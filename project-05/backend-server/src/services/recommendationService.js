const Product = require("../models/product");
const ViewHistory = require("../models/viewHistory");
const Favorite = require("../models/favorite");
const Purchase = require("../models/purchase");
const { ListResponseDto, BaseResponseDto } = require("../dto/responseDto");
const {
  PaginationUtils,
  ValidationUtils,
} = require("../utils/paginationUtils");

class RecommendationService {
  /**
   * Get similar products based on category, tags, and ratings
   */
  async getSimilarProducts(productId, { limit = 8, offset = 0 } = {}) {
    try {
      if (!ValidationUtils.isValidObjectId(productId)) {
        return BaseResponseDto.error("Invalid product ID");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Get the current product
      const currentProduct = await Product.findById(productId).lean();
      if (!currentProduct) {
        return BaseResponseDto.error("Product not found");
      }

      // Build similarity query
      const similarityQuery = {
        _id: { $ne: productId },
        isActive: true,
        $or: [
          { category: currentProduct.category },
          { tags: { $in: currentProduct.tags || [] } },
          { brand: currentProduct.brand },
        ],
      };

      // Advanced scoring pipeline
      const pipeline = [
        { $match: similarityQuery },
        {
          $addFields: {
            similarityScore: {
              $add: [
                // Category match (high weight)
                {
                  $cond: [
                    { $eq: ["$category", currentProduct.category] },
                    50,
                    0,
                  ],
                },
                // Brand match (medium weight)
                { $cond: [{ $eq: ["$brand", currentProduct.brand] }, 30, 0] },
                // Tag overlap (variable weight)
                {
                  $multiply: [
                    {
                      $size: {
                        $setIntersection: [
                          { $ifNull: ["$tags", []] },
                          currentProduct.tags || [],
                        ],
                      },
                    },
                    10,
                  ],
                },
                // Price similarity (closer price = higher score)
                {
                  $subtract: [
                    20,
                    {
                      $multiply: [
                        {
                          $abs: {
                            $subtract: [
                              { $ifNull: ["$price", 0] },
                              currentProduct.price || 0,
                            ],
                          },
                        },
                        0.01,
                      ],
                    },
                  ],
                },
                // Rating boost
                { $multiply: [{ $ifNull: ["$rating", 0] }, 2] },
                // Popularity boost
                {
                  $multiply: [
                    {
                      $log10: { $add: [{ $ifNull: ["$purchaseCount", 0] }, 1] },
                    },
                    5,
                  ],
                },
              ],
            },
          },
        },
        { $sort: { similarityScore: -1, rating: -1, purchaseCount: -1 } },
        { $skip: paginationParams.offset },
        { $limit: paginationParams.limit },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            imageUrl: 1,
            rating: 1,
            reviewCount: 1,
            category: 1,
            brand: 1,
            tags: 1,
            purchaseCount: 1,
            similarityScore: 1,
          },
        },
      ];

      const [similarProducts, totalCount] = await Promise.all([
        Product.aggregate(pipeline),
        Product.countDocuments(similarityQuery),
      ]);

      const meta = {
        totalItems: totalCount,
        itemCount: similarProducts.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
        algorithm: "hybrid_similarity",
      };

      return ListResponseDto.create(similarProducts, meta);
    } catch (error) {
      console.error("❌ Get similar products error:", error.message);
      return BaseResponseDto.error("Failed to get similar products");
    }
  }

  /**
   * Get personalized recommendations for user
   */
  async getPersonalizedRecommendations(
    userId,
    { limit = 10, offset = 0 } = {}
  ) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Get user interaction data
      const [userPurchases, userFavorites, userViews] = await Promise.all([
        Purchase.find({ userId, status: { $in: ["delivered", "completed"] } })
          .populate("productId", "category tags brand")
          .lean(),
        Favorite.find({ userId })
          .populate("productId", "category tags brand")
          .lean(),
        ViewHistory.find({ userId })
          .sort({ viewedAt: -1 })
          .limit(50)
          .populate("productId", "category tags brand")
          .lean(),
      ]);

      // Extract user preferences
      const userPreferences = this.extractUserPreferences(
        userPurchases,
        userFavorites,
        userViews
      );

      if (Object.keys(userPreferences.categories).length === 0) {
        // Fallback to trending products for new users
        return this.getTrendingProducts({ limit, offset });
      }

      // Build recommendation query
      const recommendationQuery = {
        isActive: true,
        _id: {
          $nin: [
            ...userPurchases.map((p) => p.productId._id),
            ...userFavorites.map((f) => f.productId._id),
          ],
        },
      };

      // Score-based recommendation pipeline
      const pipeline = [
        { $match: recommendationQuery },
        {
          $addFields: {
            recommendationScore: {
              $add: [
                // Category preference score
                {
                  $multiply: [
                    { $ifNull: [userPreferences.categories["$category"], 0] },
                    40,
                  ],
                },
                // Brand preference score
                {
                  $multiply: [
                    { $ifNull: [userPreferences.brands["$brand"], 0] },
                    30,
                  ],
                },
                // Tag preference score
                {
                  $multiply: [
                    {
                      $size: {
                        $setIntersection: [
                          { $ifNull: ["$tags", []] },
                          Object.keys(userPreferences.tags),
                        ],
                      },
                    },
                    15,
                  ],
                },
                // Quality indicators
                { $multiply: [{ $ifNull: ["$rating", 0] }, 8] },
                {
                  $multiply: [
                    {
                      $log10: { $add: [{ $ifNull: ["$purchaseCount", 0] }, 1] },
                    },
                    5,
                  ],
                },
                {
                  $multiply: [
                    {
                      $log10: { $add: [{ $ifNull: ["$favoriteCount", 0] }, 1] },
                    },
                    3,
                  ],
                },
                // Freshness bonus for new products
                {
                  $cond: [
                    {
                      $gte: [
                        "$createdAt",
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    10,
                    0,
                  ],
                },
              ],
            },
          },
        },
        { $sort: { recommendationScore: -1, rating: -1 } },
        { $skip: paginationParams.offset },
        { $limit: paginationParams.limit },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            imageUrl: 1,
            rating: 1,
            reviewCount: 1,
            category: 1,
            brand: 1,
            tags: 1,
            purchaseCount: 1,
            favoriteCount: 1,
            recommendationScore: 1,
          },
        },
      ];

      const [recommendations, totalCount] = await Promise.all([
        Product.aggregate(pipeline),
        Product.countDocuments(recommendationQuery),
      ]);

      const meta = {
        totalItems: totalCount,
        itemCount: recommendations.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
        algorithm: "collaborative_filtering",
        userPreferences,
      };

      return ListResponseDto.create(recommendations, meta);
    } catch (error) {
      console.error(
        "❌ Get personalized recommendations error:",
        error.message
      );
      return BaseResponseDto.error(
        "Failed to get personalized recommendations"
      );
    }
  }

  /**
   * Get recently viewed products for user
   */
  async getRecentlyViewed(userId, { limit = 10, offset = 0 } = {}) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      const [recentViews, totalCount] = await Promise.all([
        ViewHistory.find({ userId })
          .populate({
            path: "productId",
            select:
              "name price imageUrl rating reviewCount category brand isActive",
            match: { isActive: true },
          })
          .sort({ viewedAt: -1 })
          .skip(paginationParams.offset)
          .limit(paginationParams.limit)
          .lean(),
        ViewHistory.countDocuments({ userId }),
      ]);

      // Filter out products that might have been deleted
      const validViews = recentViews.filter((view) => view.productId);

      const meta = {
        totalItems: totalCount,
        itemCount: validViews.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
      };

      return ListResponseDto.create(validViews, meta);
    } catch (error) {
      console.error("❌ Get recently viewed error:", error.message);
      return BaseResponseDto.error("Failed to get recently viewed products");
    }
  }

  /**
   * Get trending products
   */
  async getTrendingProducts({
    limit = 10,
    offset = 0,
    timeRange = "week",
  } = {}) {
    try {
      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Calculate date range
      let startDate = new Date();
      switch (timeRange) {
        case "day":
          startDate.setDate(startDate.getDate() - 1);
          break;
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      const pipeline = [
        {
          $match: {
            isActive: true,
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            }, // Last 30 days
          },
        },
        {
          $addFields: {
            trendingScore: {
              $add: [
                // Recent purchase activity (high weight)
                { $multiply: [{ $ifNull: ["$purchaseCount", 0] }, 10] },
                // View activity
                { $multiply: [{ $ifNull: ["$viewCount", 0] }, 2] },
                // Favorite activity
                { $multiply: [{ $ifNull: ["$favoriteCount", 0] }, 5] },
                // Rating quality
                { $multiply: [{ $ifNull: ["$rating", 0] }, 8] },
                // Review engagement
                { $multiply: [{ $ifNull: ["$reviewCount", 0] }, 3] },
                // Recency bonus for new products
                {
                  $multiply: [
                    {
                      $divide: [
                        { $subtract: [new Date(), "$createdAt"] },
                        1000 * 60 * 60 * 24, // Convert to days
                      ],
                    },
                    -0.5, // Newer products get higher scores
                  ],
                },
              ],
            },
          },
        },
        { $sort: { trendingScore: -1, rating: -1 } },
        { $skip: paginationParams.offset },
        { $limit: paginationParams.limit },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            imageUrl: 1,
            rating: 1,
            reviewCount: 1,
            category: 1,
            brand: 1,
            purchaseCount: 1,
            viewCount: 1,
            favoriteCount: 1,
            trendingScore: 1,
            createdAt: 1,
          },
        },
      ];

      const [trendingProducts, totalCount] = await Promise.all([
        Product.aggregate(pipeline),
        Product.countDocuments({ isActive: true }),
      ]);

      const meta = {
        totalItems: totalCount,
        itemCount: trendingProducts.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
        timeRange,
        algorithm: "trending_score",
      };

      return ListResponseDto.create(trendingProducts, meta);
    } catch (error) {
      console.error("❌ Get trending products error:", error.message);
      return BaseResponseDto.error("Failed to get trending products");
    }
  }

  /**
   * Extract user preferences from interaction history
   */
  extractUserPreferences(purchases, favorites, views) {
    const preferences = {
      categories: {},
      brands: {},
      tags: {},
    };

    // Weight different interactions
    const weights = {
      purchase: 3,
      favorite: 2,
      view: 1,
    };

    // Process purchases
    purchases.forEach((purchase) => {
      if (purchase.productId) {
        const product = purchase.productId;
        this.addToPreference(
          preferences.categories,
          product.category,
          weights.purchase
        );
        this.addToPreference(
          preferences.brands,
          product.brand,
          weights.purchase
        );
        if (product.tags) {
          product.tags.forEach((tag) => {
            this.addToPreference(preferences.tags, tag, weights.purchase);
          });
        }
      }
    });

    // Process favorites
    favorites.forEach((favorite) => {
      if (favorite.productId) {
        const product = favorite.productId;
        this.addToPreference(
          preferences.categories,
          product.category,
          weights.favorite
        );
        this.addToPreference(
          preferences.brands,
          product.brand,
          weights.favorite
        );
        if (product.tags) {
          product.tags.forEach((tag) => {
            this.addToPreference(preferences.tags, tag, weights.favorite);
          });
        }
      }
    });

    // Process views (with decay for older views)
    views.forEach((view, index) => {
      if (view.productId) {
        const product = view.productId;
        const decayFactor = Math.max(0.1, 1 - index * 0.1); // Decay older views
        const weight = weights.view * decayFactor;

        this.addToPreference(preferences.categories, product.category, weight);
        this.addToPreference(preferences.brands, product.brand, weight);
        if (product.tags) {
          product.tags.forEach((tag) => {
            this.addToPreference(preferences.tags, tag, weight);
          });
        }
      }
    });

    // Normalize preferences to percentages
    this.normalizePreferences(preferences.categories);
    this.normalizePreferences(preferences.brands);
    this.normalizePreferences(preferences.tags);

    return preferences;
  }

  /**
   * Add weight to preference category
   */
  addToPreference(preferenceMap, key, weight) {
    if (key) {
      preferenceMap[key] = (preferenceMap[key] || 0) + weight;
    }
  }

  /**
   * Normalize preference scores to percentages
   */
  normalizePreferences(preferenceMap) {
    const total = Object.values(preferenceMap).reduce(
      (sum, val) => sum + val,
      0
    );
    if (total > 0) {
      Object.keys(preferenceMap).forEach((key) => {
        preferenceMap[key] =
          Math.round((preferenceMap[key] / total) * 100) / 100;
      });
    }
  }

  /**
   * Record product view for analytics
   */
  async recordProductView(productId, userId = null, sessionId = null) {
    try {
      if (!ValidationUtils.isValidObjectId(productId)) {
        return BaseResponseDto.error("Invalid product ID");
      }

      // Create view history record
      const viewData = {
        productId,
        viewedAt: new Date(),
      };

      if (userId && ValidationUtils.isValidObjectId(userId)) {
        viewData.userId = userId;
      } else if (sessionId) {
        viewData.sessionId = sessionId;
      }

      const viewHistory = new ViewHistory(viewData);
      await viewHistory.save();

      // Update product view count
      await Product.findByIdAndUpdate(productId, {
        $inc: { viewCount: 1 },
      });

      return BaseResponseDto.success("Product view recorded");
    } catch (error) {
      console.error("❌ Record product view error:", error.message);
      return BaseResponseDto.error("Failed to record product view");
    }
  }
}

module.exports = new RecommendationService();
