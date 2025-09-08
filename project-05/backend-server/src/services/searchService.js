const { Client } = require("@elastic/elasticsearch");
const Product = require("../models/product");
const Category = require("../models/category");
const { ListResponseDto, BaseResponseDto } = require("../dto/responseDto");
const {
  PaginationUtils,
  ValidationUtils,
} = require("../utils/paginationUtils");
const elasticsearchConfig = require("../config/elasticsearchConfig");

class SearchService {
  constructor() {
    // Elasticsearch properties
    this.productIndex = elasticsearchConfig.indices.products;
    this.isElasticsearchAvailable = false;
    this.elasticsearchClient = null;
    this.config = elasticsearchConfig;

    this.initializeElasticsearch();
  } // Elasticsearch Initialization Methods
  initializeElasticsearch() {
    try {
      console.log("🔧 Initializing Elasticsearch client...");

      this.elasticsearchClient = new Client({
        node: this.config.connection.node,
        auth: this.config.connection.auth,
        requestTimeout: this.config.connection.requestTimeout,
        pingTimeout: this.config.connection.pingTimeout,
        maxRetries: this.config.connection.maxRetries,
      });

      console.log("✅ Elasticsearch client created successfully");
      this.initElasticsearchConnection();
    } catch (error) {
      console.error("❌ Error creating Elasticsearch client:", error.message);
      this.isElasticsearchAvailable = false;
      this.elasticsearchClient = null;
    }
  }

  async initElasticsearchConnection() {
    try {
      await this.elasticsearchClient.ping();
      console.log("✅ Elasticsearch connected successfully");
      this.isElasticsearchAvailable = true;
      await this.createProductIndex();
    } catch (error) {
      console.log("⚠️  Elasticsearch not available, using fallback search");
      console.log("   Error:", error.message);
      this.isElasticsearchAvailable = false;
    }
  }

  async createProductIndex() {
    try {
      if (!this.elasticsearchClient) {
        console.error("❌ Elasticsearch client not available");
        return;
      }

      const indexExists = await this.elasticsearchClient.indices.exists({
        index: this.productIndex,
      });

      const exists = indexExists === true || indexExists.body === true;

      if (!exists) {
        console.log("📁 Creating product index...");
        await this.elasticsearchClient.indices.create({
          index: this.productIndex,
          mappings: this.config.mappings.products,
          settings: this.config.settings,
        });
        console.log("✅ Product index created successfully");
      } else {
        console.log("📁 Product index already exists");
      }
    } catch (error) {
      console.error("❌ Error creating product index:", error.message);
    }
  }

  // Elasticsearch Indexing Methods
  async indexProduct(product) {
    if (!this.isElasticsearchAvailable || !this.elasticsearchClient) {
      return false;
    }

    try {
      await this.elasticsearchClient.index({
        index: this.productIndex,
        id: product._id.toString(),
        document: {
          ...product,
          suggest: {
            input: [product.name, product.description].filter(Boolean),
            weight: Math.floor(
              product.rating * 10 + (product.reviewCount || 0)
            ),
          },
        },
      });
      return true;
    } catch (error) {
      console.error("❌ Error indexing product:", error.message);
      return false;
    }
  }

  async bulkIndexProducts(products) {
    if (
      !this.isElasticsearchAvailable ||
      !this.elasticsearchClient ||
      !products.length
    ) {
      return false;
    }

    try {
      const operations = products.flatMap((product) => [
        { index: { _index: this.productIndex, _id: product._id.toString() } },
        {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          imageUrl: product.imageUrl,
          isActive: product.isActive,
          tags: product.tags,
          brand: product.brand,
          discount: product.discount,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          suggest: {
            input: [
              product.name,
              product.description,
              product.category?.name,
            ].filter(Boolean),
            weight: Math.floor(
              product.rating * 10 + (product.reviewCount || 0) / 100
            ),
          },
        },
      ]);

      const result = await this.elasticsearchClient.bulk({
        body: operations,
      });

      const hasErrors =
        result.errors !== undefined ? result.errors : result.body?.errors;

      if (hasErrors) {
        console.error("❌ Bulk index had errors");
        return false;
      } else {
        console.log(`✅ Successfully indexed ${products.length} products`);
        return true;
      }
    } catch (error) {
      console.error("❌ Error bulk indexing products:", error.message);
      return false;
    }
  }
  // Main Search Methods
  async searchProducts(searchParams = {}) {
    try {
      const {
        query = "",
        categoryId,
        minPrice,
        maxPrice,
        rating,
        minReviewCount,
        inStock,
        hasDiscount,
        brand,
        sortBy = "relevance",
        sortOrder = "desc",
        limit = 20,
        offset = 0,
      } = searchParams;

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Try Elasticsearch first, fallback to MongoDB
      if (this.isElasticsearchAvailable) {
        try {
          const result = await this.elasticsearchSearch(searchParams);

          const meta = {
            totalItems: result.total,
            itemCount: result.products.length,
            itemsPerPage: paginationParams.limit,
            totalPages: Math.ceil(result.total / paginationParams.limit),
            currentPage:
              Math.floor(paginationParams.offset / paginationParams.limit) + 1,
            searchQuery: query,
            filters: this.extractAppliedFilters(searchParams),
            searchTime: `${result.took}ms`,
            searchEngine: "elasticsearch",
          };

          return ListResponseDto.create(result.products, meta);
        } catch (error) {
          console.log("Elasticsearch failed, using MongoDB fallback");
          return await this.mongodbSearch(searchParams);
        }
      } else {
        return await this.mongodbSearch(searchParams);
      }
    } catch (error) {
      console.error("❌ Search error:", error.message);
      return BaseResponseDto.error("Search service temporarily unavailable");
    }
  }

  async elasticsearchSearch(searchParams) {
    if (!this.isElasticsearchAvailable || !this.elasticsearchClient) {
      throw new Error("Elasticsearch not available");
    }

    const {
      query = "",
      categoryId,
      minPrice,
      maxPrice,
      rating,
      minReviewCount,
      inStock,
      brand,
      sortBy = "relevance",
      sortOrder = "desc",
      limit = 20,
      offset = 0,
    } = searchParams;

    const must = [];
    const filter = [];

    // Text search
    if (query.trim()) {
      must.push({
        multi_match: {
          query: query.trim(),
          fields: ["name^3", "description^2", "category.name^2", "brand^1.5"],
          fuzziness: "AUTO",
        },
      });
    }

    // Filters
    filter.push({ term: { isActive: true } });

    if (categoryId) {
      filter.push({ term: { "category._id": categoryId } });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceRange = {};
      if (minPrice !== undefined) priceRange.gte = parseFloat(minPrice);
      if (maxPrice !== undefined) priceRange.lte = parseFloat(maxPrice);
      filter.push({ range: { price: priceRange } });
    }

    if (rating !== undefined) {
      filter.push({ range: { rating: { gte: parseFloat(rating) } } });
    }

    if (minReviewCount !== undefined) {
      filter.push({
        range: { reviewCount: { gte: parseInt(minReviewCount) } },
      });
    }

    if (inStock === "true") {
      filter.push({ range: { stock: { gt: 0 } } });
    }

    if (brand) {
      filter.push({ term: { brand } });
    }

    // Build sort
    const sort = [];
    switch (sortBy) {
      case "price":
        sort.push({ price: { order: sortOrder } });
        break;
      case "rating":
        sort.push({ rating: { order: sortOrder } });
        break;
      case "reviewCount":
        sort.push({ reviewCount: { order: sortOrder } });
        break;
      case "name":
        sort.push({ "name.keyword": { order: sortOrder } });
        break;
      case "createdAt":
        sort.push({ createdAt: { order: sortOrder } });
        break;
      default:
        sort.push({ _score: { order: "desc" } });
    }

    const searchQuery = {
      index: this.productIndex,
      query: {
        bool: {
          must: must.length > 0 ? must : [{ match_all: {} }],
          filter,
        },
      },
      sort,
      from: offset,
      size: limit,
      track_total_hits: true,
    };

    const result = await this.elasticsearchClient.search(searchQuery);

    return {
      products: result.hits.hits.map((hit) => ({
        ...hit._source,
        _score: hit._score,
      })),
      total:
        typeof result.hits.total === "number"
          ? result.hits.total
          : result.hits.total.value,
      took: result.took,
    };
  }

  /**
   * MongoDB fallback search
   */
  async mongodbSearch(searchParams) {
    const {
      query = "",
      categoryId,
      minPrice,
      maxPrice,
      rating,
      minReviewCount,
      inStock,
      hasDiscount,
      brand,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 20,
      offset = 0,
    } = searchParams;

    const paginationParams = PaginationUtils.parsePaginationParams({
      limit,
      offset,
    });

    // Build MongoDB query
    const mongoQuery = { isActive: true };

    if (query.trim()) {
      mongoQuery.$or = [
        { name: { $regex: query.trim(), $options: "i" } },
        { description: { $regex: query.trim(), $options: "i" } },
      ];
    }

    if (categoryId && ValidationUtils.isValidObjectId(categoryId)) {
      mongoQuery.category = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      mongoQuery.price = {};
      if (minPrice !== undefined) mongoQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) mongoQuery.price.$lte = parseFloat(maxPrice);
    }

    if (rating !== undefined) {
      mongoQuery.rating = { $gte: parseFloat(rating) };
    }

    if (minReviewCount !== undefined) {
      mongoQuery.reviewCount = { $gte: parseInt(minReviewCount) };
    }

    if (inStock === "true") {
      mongoQuery.stock = { $gt: 0 };
    }

    if (hasDiscount === "true") {
      mongoQuery["discount.isActive"] = true;
      mongoQuery["discount.endDate"] = { $gte: new Date() };
    }

    if (brand) {
      mongoQuery.brand = brand;
    }

    // Build sort
    const sort = {};
    if (sortBy === "price") sort.price = sortOrder === "asc" ? 1 : -1;
    else if (sortBy === "rating") sort.rating = sortOrder === "asc" ? 1 : -1;
    else if (sortBy === "reviewCount")
      sort.reviewCount = sortOrder === "asc" ? 1 : -1;
    else if (sortBy === "name") sort.name = sortOrder === "asc" ? 1 : -1;
    else sort.createdAt = sortOrder === "asc" ? 1 : -1;

    const [products, totalCount] = await Promise.all([
      Product.find(mongoQuery)
        .populate("category", "name description")
        .sort(sort)
        .skip(paginationParams.offset)
        .limit(paginationParams.limit)
        .lean(),
      Product.countDocuments(mongoQuery),
    ]);

    const meta = {
      totalItems: totalCount,
      itemCount: products.length,
      itemsPerPage: paginationParams.limit,
      totalPages: Math.ceil(totalCount / paginationParams.limit),
      currentPage:
        Math.floor(paginationParams.offset / paginationParams.limit) + 1,
      searchQuery: query,
      filters: this.extractAppliedFilters(searchParams),
      searchEngine: "mongodb",
    };

    return ListResponseDto.create(products, meta);
  }

  // Suggestion Methods
  async getSearchSuggestions(query, limit = 10) {
    if (!query.trim()) {
      return ListResponseDto.create([]);
    }

    if (this.isElasticsearchAvailable) {
      try {
        const suggestions = await this.elasticsearchSuggestions(
          query.trim(),
          limit
        );
        return ListResponseDto.create(suggestions);
      } catch (error) {
        console.error("❌ Suggestions error:", error.message);
      }
    }

    // Fallback to MongoDB
    try {
      const products = await Product.find({
        isActive: true,
        name: { $regex: query.trim(), $options: "i" },
      })
        .select("name price category")
        .populate("category", "name")
        .limit(limit)
        .lean();

      const suggestions = products.map((p) => ({
        text: p.name,
        source: p,
      }));

      return ListResponseDto.create(suggestions);
    } catch (error) {
      console.error("❌ MongoDB suggestions error:", error.message);
      return ListResponseDto.create([]);
    }
  }

  async elasticsearchSuggestions(query, limit = 5) {
    if (!this.isElasticsearchAvailable || !this.elasticsearchClient || !query) {
      return [];
    }

    try {
      const result = await this.elasticsearchClient.search({
        index: this.productIndex,
        suggest: {
          product_suggest: {
            prefix: query,
            completion: {
              field: "name.suggest",
              size: limit,
            },
          },
        },
      });

      return (
        result.suggest?.product_suggest?.[0]?.options?.map((option) => ({
          text: option.text,
          score: option._score,
          source: option._source,
        })) || []
      );
    } catch (error) {
      console.error("❌ Error getting suggestions:", error.message);
      return [];
    }
  }

  /**
   * Get search filters
   */
  async getSearchFilters(categoryId) {
    try {
      const query = { isActive: true };
      if (categoryId && ValidationUtils.isValidObjectId(categoryId)) {
        query.category = categoryId;
      }

      const [priceRange, brands, categories] = await Promise.all([
        Product.aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" },
              avgPrice: { $avg: "$price" },
            },
          },
        ]),
        Product.distinct("brand", query),
        Product.aggregate([
          { $match: query },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          { $unwind: "$category" },
          {
            $group: {
              _id: "$category._id",
              name: { $first: "$category.name" },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const filters = {
        priceRange: priceRange[0] || {
          minPrice: 0,
          maxPrice: 1000,
          avgPrice: 100,
        },
        brands: brands.filter(Boolean),
        categories,
        ratingOptions: [5, 4, 3, 2, 1],
      };

      return ListResponseDto.create(filters);
    } catch (error) {
      console.error("❌ Get filters error:", error.message);
      return BaseResponseDto.error("Unable to load filters");
    }
  }

  // Utility Methods
  extractAppliedFilters(searchParams) {
    const filters = {};
    if (searchParams.categoryId) filters.category = searchParams.categoryId;
    if (searchParams.minPrice !== undefined)
      filters.minPrice = searchParams.minPrice;
    if (searchParams.maxPrice !== undefined)
      filters.maxPrice = searchParams.maxPrice;
    if (searchParams.rating !== undefined) filters.rating = searchParams.rating;
    if (searchParams.minReviewCount !== undefined)
      filters.minReviewCount = searchParams.minReviewCount;
    if (searchParams.inStock) filters.inStock = searchParams.inStock;
    if (searchParams.hasDiscount)
      filters.hasDiscount = searchParams.hasDiscount;
    if (searchParams.brand) filters.brand = searchParams.brand;
    return filters;
  }

  isElasticsearchEnabled() {
    return (
      this.isElasticsearchAvailable === true &&
      this.elasticsearchClient !== null
    );
  }

  getStatus() {
    return {
      elasticsearch: {
        isAvailable: this.isElasticsearchAvailable,
        hasClient: !!this.elasticsearchClient,
        productIndex: this.productIndex,
        config: {
          node: this.config.connection.node,
          hasApiKey: !!this.config.connection.auth?.apiKey,
          hasAuth: !!this.config.connection.auth?.username,
        },
      },
      mongodb: {
        isAvailable: true, // Assuming MongoDB is always available
      },
    };
  }

  async deleteProduct(productId) {
    if (this.isElasticsearchAvailable && this.elasticsearchClient) {
      try {
        await this.elasticsearchClient.delete({
          index: this.productIndex,
          id: productId.toString(),
        });
        return true;
      } catch (error) {
        console.error(
          "❌ Error deleting product from Elasticsearch:",
          error.message
        );
        return false;
      }
    }
    return false;
  }

  async refreshIndex() {
    if (this.isElasticsearchAvailable && this.elasticsearchClient) {
      try {
        await this.elasticsearchClient.indices.refresh({
          index: this.productIndex,
        });
        return true;
      } catch (error) {
        console.error("❌ Error refreshing index:", error.message);
        return false;
      }
    }
    return false;
  }
}

module.exports = new SearchService();
