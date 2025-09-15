const recommendationService = require("../services/recommendationService");

class RecommendationController {
  /**
   * Get similar products for a specific product
   * GET /api/products/:productId/similar
   */
  async getSimilarProducts(req, res) {
    try {
      const { productId } = req.params;
      const { limit, offset } = req.query;

      const result = await recommendationService.getSimilarProducts(productId, {
        limit: parseInt(limit) || 8,
        offset: parseInt(offset) || 0,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get similar products controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get personalized recommendations for authenticated user
   * GET /api/recommendations/personalized
   */
  async getPersonalizedRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { limit, offset } = req.query;

      const result = await recommendationService.getPersonalizedRecommendations(
        userId,
        {
          limit: parseInt(limit) || 10,
          offset: parseInt(offset) || 0,
        }
      );

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Get personalized recommendations controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get recently viewed products for authenticated user
   * GET /api/recommendations/recently-viewed
   */
  async getRecentlyViewed(req, res) {
    try {
      const userId = req.user.id;
      const { limit, offset } = req.query;

      const result = await recommendationService.getRecentlyViewed(userId, {
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get recently viewed controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get trending products (public endpoint)
   * GET /api/recommendations/trending
   */
  async getTrendingProducts(req, res) {
    try {
      const { limit, offset, timeRange } = req.query;

      const result = await recommendationService.getTrendingProducts({
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        timeRange: timeRange || "week",
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Get trending products controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Record product view for analytics
   * POST /api/products/:productId/view
   */
  async recordProductView(req, res) {
    try {
      const { productId } = req.params;
      const userId = req.user?.id; // Optional - may be anonymous
      const sessionId = req.sessionID || req.headers["x-session-id"];

      const result = await recommendationService.recordProductView(
        productId,
        userId,
        sessionId
      );

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Record product view controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get recommendations for anonymous users (public endpoint)
   * GET /api/recommendations/discover
   */
  async getDiscoverRecommendations(req, res) {
    try {
      const { limit, offset, category } = req.query;

      // For anonymous users, return trending products with category filter
      const result = await recommendationService.getTrendingProducts({
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        timeRange: "week",
      });

      if (result.success && category) {
        // Filter by category if specified
        const filteredData = result.data.filter(
          (product) =>
            product.category && product.category.toString() === category
        );
        result.data = filteredData;
        result.meta.itemCount = filteredData.length;
      }

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Get discover recommendations controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get comprehensive recommendation dashboard for user
   * GET /api/recommendations/dashboard
   */
  async getRecommendationDashboard(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        // For anonymous users, return discover recommendations
        return this.getDiscoverRecommendations(req, res);
      }

      // Get multiple recommendation types for authenticated users
      const [personalized, recentlyViewed, trending] = await Promise.all([
        recommendationService.getPersonalizedRecommendations(userId, {
          limit: 6,
          offset: 0,
        }),
        recommendationService.getRecentlyViewed(userId, {
          limit: 6,
          offset: 0,
        }),
        recommendationService.getTrendingProducts({
          limit: 6,
          offset: 0,
          timeRange: "week",
        }),
      ]);

      const dashboard = {
        success: true,
        message: "Recommendation dashboard",
        data: {
          personalized: personalized.success ? personalized.data : [],
          recentlyViewed: recentlyViewed.success ? recentlyViewed.data : [],
          trending: trending.success ? trending.data : [],
        },
        meta: {
          personalized: personalized.success ? personalized.meta : {},
          recentlyViewed: recentlyViewed.success ? recentlyViewed.meta : {},
          trending: trending.success ? trending.meta : {},
        },
      };

      return res.status(200).json(dashboard);
    } catch (error) {
      console.error(
        "❌ Get recommendation dashboard controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new RecommendationController();
