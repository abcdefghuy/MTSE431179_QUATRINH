const purchaseService = require("../services/purchaseService");

class PurchaseController {
  /**
   * Create a new purchase order
   * POST /api/purchases
   */
  async createPurchase(req, res) {
    try {
      const userId = req.user.id;
      const {
        productId,
        quantity,
        totalAmount,
        paymentMethod,
        shippingAddress,
        orderNote,
      } = req.body;

      // Validation
      if (!productId || !quantity || !totalAmount) {
        return res.status(400).json({
          success: false,
          message: "Product ID, quantity, and total amount are required",
        });
      }

      const result = await purchaseService.createPurchase(userId, {
        productId,
        quantity,
        totalAmount,
        paymentMethod,
        shippingAddress,
        orderNote,
      });

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Create purchase controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get user's purchase history
   * GET /api/purchases
   */
  async getUserPurchases(req, res) {
    try {
      const userId = req.user.id;
      const { limit, offset, status, startDate, endDate } = req.query;

      const result = await purchaseService.getUserPurchases(userId, {
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        status,
        startDate,
        endDate,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get user purchases controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Update purchase status
   * PUT /api/purchases/:purchaseId/status
   */
  async updatePurchaseStatus(req, res) {
    try {
      const userId = req.user.id;
      const { purchaseId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      const result = await purchaseService.updatePurchaseStatus(
        purchaseId,
        status,
        userId
      );

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Update purchase status controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get purchase details
   * GET /api/purchases/:purchaseId
   */
  async getPurchaseDetails(req, res) {
    try {
      const userId = req.user.id;
      const { purchaseId } = req.params;

      const result = await purchaseService.getPurchaseDetails(
        purchaseId,
        userId
      );

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get purchase details controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get user's order statistics
   * GET /api/purchases/stats
   */
  async getUserOrderStats(req, res) {
    try {
      const userId = req.user.id;

      const result = await purchaseService.getUserOrderStats(userId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get user order stats controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get best selling products (public endpoint)
   * GET /api/purchases/best-selling
   */
  async getBestSellingProducts(req, res) {
    try {
      const { limit, offset, startDate, endDate, category } = req.query;

      const result = await purchaseService.getBestSellingProducts({
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        startDate,
        endDate,
        category,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Get best selling products controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Check if user has purchased a product
   * GET /api/purchases/check/:productId
   */
  async checkPurchaseStatus(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      const result = await purchaseService.hasPurchased(userId, productId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Check purchase status controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Admin endpoints (would require admin middleware)

  /**
   * Update purchase status (Admin)
   * PUT /api/admin/purchases/:purchaseId/status
   */
  async adminUpdatePurchaseStatus(req, res) {
    try {
      const { purchaseId } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
        });
      }

      // Admin can update without userId restriction
      const result = await purchaseService.updatePurchaseStatus(
        purchaseId,
        status
      );

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Admin update purchase status controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get purchase details (Admin)
   * GET /api/admin/purchases/:purchaseId
   */
  async adminGetPurchaseDetails(req, res) {
    try {
      const { purchaseId } = req.params;

      // Admin can view without userId restriction
      const result = await purchaseService.getPurchaseDetails(purchaseId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Admin get purchase details controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new PurchaseController();
