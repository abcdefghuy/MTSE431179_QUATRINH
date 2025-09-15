const favoriteService = require("../services/favoriteService");

class FavoriteController {
  /**
   * Add product to favorites
   * POST /api/favorites
   */
  async addToFavorites(req, res) {
    try {
      const userId = req.user?.id;
      console.log("User ID:", userId);

      // Validate user authentication
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication failed. Please login again.",
          error: "INVALID_USER_TOKEN",
        });
      }

      const { productId } = req.body;

      // Validate request body
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
          error: "MISSING_PRODUCT_ID",
        });
      }

      const result = await favoriteService.addToFavorites(userId, productId);

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Add to favorites controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Remove product from favorites
   * DELETE /api/favorites/:productId
   */
  async removeFromFavorites(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication failed. Please login again.",
          error: "INVALID_USER_TOKEN",
        });
      }

      const { productId } = req.params;

      const result = await favoriteService.removeFromFavorites(
        userId,
        productId
      );

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Remove from favorites controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get user's favorite products
   * GET /api/favorites
   */
  async getUserFavorites(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication failed. Please login again.",
          error: "INVALID_USER_TOKEN",
        });
      }

      const { limit, offset, sortBy, sortOrder } = req.query;

      const result = await favoriteService.getUserFavorites(userId, {
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        sortBy: sortBy || "createdAt",
        sortOrder: sortOrder || "desc",
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get user favorites controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Check if product is favorited by user
   * GET /api/favorites/check/:productId
   */
  async checkFavoriteStatus(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication failed. Please login again.",
          error: "INVALID_USER_TOKEN",
        });
      }

      const { productId } = req.params;

      const result = await favoriteService.isFavorited(userId, productId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Check favorite status controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get favorite statistics for user
   * GET /api/favorites/stats
   */
  async getFavoriteStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication failed. Please login again.",
          error: "INVALID_USER_TOKEN",
        });
      }

      const result = await favoriteService.getFavoriteStats(userId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get favorite stats controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get most favorited products (public endpoint)
   * GET /api/favorites/trending
   */
  async getMostFavorited(req, res) {
    try {
      const { limit, offset, category, timeRange } = req.query;

      const result = await favoriteService.getMostFavorited({
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        category,
        timeRange: timeRange || "all",
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get most favorited controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new FavoriteController();
