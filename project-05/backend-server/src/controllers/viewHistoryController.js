const viewHistoryService = require("../services/viewHistoryService");

class ViewHistoryController {
  /**
   * Save view history
   * POST /api/view-history
   */
  async saveViewHistory(req, res) {
    try {
      const userId = req.user?.id; // Optional - có thể là anonymous user
      const { productId, sessionId, source, referrer, userAgent } = req.body;

      // Validate required fields
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
          error: "MISSING_PRODUCT_ID",
        });
      }

      // Either userId (authenticated) or sessionId (anonymous) is required
      if (!userId && !sessionId) {
        return res.status(400).json({
          success: false,
          message: "Session ID is required for anonymous users",
          error: "MISSING_SESSION_ID",
        });
      }

      const viewData = {
        productId,
        userId,
        sessionId: sessionId || req.sessionID,
        source,
        referrer,
        userAgent: userAgent || req.get("User-Agent"),
      };

      const result = await viewHistoryService.saveViewHistory(viewData);

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Save view history controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get user's view history
   * GET /api/view-history
   */
  async getViewHistory(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required to view history",
          error: "AUTHENTICATION_REQUIRED",
        });
      }

      const { limit, offset, sortBy, sortOrder } = req.query;

      const result = await viewHistoryService.getViewHistory(userId, {
        limit: parseInt(limit) || 20,
        offset: parseInt(offset) || 0,
        sortBy: sortBy || "viewedAt",
        sortOrder: sortOrder || "desc",
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get view history controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get view history statistics for user
   * GET /api/view-history/stats
   */
  async getViewHistoryStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
          error: "AUTHENTICATION_REQUIRED",
        });
      }

      const result = await viewHistoryService.getViewHistoryStats(userId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Get view history stats controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Clear user's view history
   * DELETE /api/view-history
   */
  async clearViewHistory(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User authentication required",
          error: "AUTHENTICATION_REQUIRED",
        });
      }

      const result = await viewHistoryService.clearViewHistory(userId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Clear view history controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new ViewHistoryController();
