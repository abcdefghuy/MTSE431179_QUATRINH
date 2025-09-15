const Product = require("../models/product");
const Category = require("../models/category");
const {
  PaginatedResponseDto,
  ListResponseDto,
  BaseResponseDto,
} = require("../dto/responseDto");
const {
  PaginationUtils,
  ValidationUtils,
} = require("../utils/paginationUtils");

/**
 * Get products by category with pagination
 * @param {string} categoryId - The category ID
 * @param {Object} queryParams - Query parameters (limit, offset, sortBy, sortOrder)
 * @returns {Object} - List response DTO
 */
const getProductsByCategory = async (categoryId, queryParams = {}) => {
  try {
    // Validate categoryId
    if (!ValidationUtils.isValidObjectId(categoryId)) {
      return BaseResponseDto.error("Invalid categoryId format");
    }

    // Validate category exists
    const categoryExists = await Category.findById(categoryId).where({
      isActive: true,
    });

    if (!categoryExists) {
      return BaseResponseDto.error("Category not found or inactive");
    }

    // Parse pagination parameters
    const paginationParams = PaginationUtils.parsePaginationParams(
      queryParams,
      {
        defaultSortBy: "createdAt",
        defaultSortOrder: "desc",
      }
    );

    // Query products with pagination
    const query = {
      category: categoryId,
      isActive: true,
    };

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate("category", "name description")
        .sort(paginationParams.sort)
        .skip(paginationParams.offset)
        .limit(paginationParams.limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    // Create meta information with pagination and category info
    const meta = {
      totalItems: totalCount,
      itemCount: products.length,
      itemsPerPage: paginationParams.limit,
      totalPages: Math.ceil(totalCount / paginationParams.limit),
      currentPage:
        Math.floor(paginationParams.offset / paginationParams.limit) + 1,
      category: {
        id: categoryExists._id,
        name: categoryExists.name,
        description: categoryExists.description,
      },
    };

    return ListResponseDto.create(products, meta);
  } catch (error) {
    return BaseResponseDto.error(error.message);
  }
};

/**
 * Get all active categories
 * @returns {Object} - List response DTO
 */
const getAllCategories = async () => {
  try {
    const categories = await Category.find({ isActive: true })
      .select("name description createdAt")
      .sort({ name: 1 })
      .lean();

    return ListResponseDto.create(categories);
  } catch (error) {
    return BaseResponseDto.error(error.message);
  }
};

/**
 * Get all products with pagination (without category filter)
 * @param {Object} queryParams - Query parameters (limit, offset, sortBy, sortOrder)
 * @returns {Object} - List response DTO
 */
const getAllProducts = async (queryParams = {}) => {
  try {
    // Parse pagination parameters
    const paginationParams = PaginationUtils.parsePaginationParams(queryParams);

    const query = { isActive: true };

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate("category", "name description")
        .sort(paginationParams.sort)
        .skip(paginationParams.offset)
        .limit(paginationParams.limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return ListResponseDto.create(products);
  } catch (error) {
    return BaseResponseDto.error(error.message);
  }
};

/**
 * Get product by ID with detailed information
 * @param {string} productId - The product ID
 * @returns {Object} - Base response DTO with product details
 */
const getProductById = async (productId) => {
  try {
    // Validate productId
    if (!ValidationUtils.isValidObjectId(productId)) {
      return BaseResponseDto.error("Invalid product ID format");
    }

    // Find product with category information
    const product = await Product.findById(productId)
      .where({ isActive: true })
      .populate({
        path: "category",
        select: "name description isActive",
        match: { isActive: true },
      })
      .lean();

    if (!product) {
      return BaseResponseDto.error("Product not found or inactive");
    }

    // Clean and optimize product details (remove redundant fields)
    const productWithDetails = {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount || 0,
      finalPrice:
        product.discount > 0
          ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
          : product.price,
      stock: product.stock,
      isInStock: product.stock > 0,
      imageUrl: product.imageUrl,
      category: product.category,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      purchaseCount: product.purchaseCount || 0,
      viewCount: product.viewCount || 0,
      favoriteCount: product.favoriteCount || 0,
      brand: product.brand,
      tags: product.tags || [],
      sku: product.sku,
      hasDiscount: (product.discount || 0) > 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return BaseResponseDto.success(
      productWithDetails,
      "Product details retrieved successfully"
    );
  } catch (error) {
    console.error("❌ Get product by ID error:", error.message);
    return BaseResponseDto.error("Failed to get product details");
  }
};

module.exports = {
  getProductsByCategory,
  getAllCategories,
  getAllProducts,
  getProductById,
};
