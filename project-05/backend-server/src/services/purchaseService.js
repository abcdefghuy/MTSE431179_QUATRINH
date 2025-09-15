const Purchase = require("../models/purchase");
const Product = require("../models/product");
const { ListResponseDto, BaseResponseDto } = require("../dto/responseDto");
const {
  PaginationUtils,
  ValidationUtils,
} = require("../utils/paginationUtils");

class PurchaseService {
  /**
   * Create a new purchase
   */
  async createPurchase(
    userId,
    {
      productId,
      quantity,
      totalAmount,
      paymentMethod,
      shippingAddress,
      orderNote,
    }
  ) {
    try {
      // Validate inputs
      if (
        !ValidationUtils.isValidObjectId(userId) ||
        !ValidationUtils.isValidObjectId(productId)
      ) {
        return BaseResponseDto.error("Invalid user ID or product ID");
      }

      if (!quantity || quantity <= 0) {
        return BaseResponseDto.error("Quantity must be greater than 0");
      }

      if (!totalAmount || totalAmount <= 0) {
        return BaseResponseDto.error("Total amount must be greater than 0");
      }

      // Check if product exists and has enough stock
      const product = await Product.findById(productId);
      if (!product) {
        return BaseResponseDto.error("Product not found");
      }

      if (product.stock < quantity) {
        return BaseResponseDto.error("Insufficient stock");
      }

      // Generate order ID
      const orderId = this.generateOrderId();

      // Create purchase
      const purchase = new Purchase({
        userId,
        productId,
        orderId,
        quantity: parseInt(quantity),
        unitPrice: product.price,
        totalAmount: parseFloat(totalAmount),
        paymentMethod: paymentMethod || "cash",
        shippingAddress,
        orderNote,
        status: "pending",
      });

      await purchase.save();

      // Update product stock and purchase count
      await Product.findByIdAndUpdate(productId, {
        $inc: {
          stock: -quantity,
          purchaseCount: quantity,
        },
      });

      return BaseResponseDto.success("Purchase created successfully", purchase);
    } catch (error) {
      console.error("❌ Create purchase error:", error.message);
      return BaseResponseDto.error("Failed to create purchase");
    }
  }

  /**
   * Get user purchases
   */
  async getUserPurchases(
    userId,
    { limit = 10, offset = 0, status, startDate, endDate } = {}
  ) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Build query
      const query = { userId };
      if (status) {
        query.status = status;
      }
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const [purchases, totalCount, orderStats] = await Promise.all([
        Purchase.find(query)
          .populate({
            path: "productId",
            select: "name imageUrl category price",
            populate: {
              path: "category",
              select: "name",
            },
          })
          .sort({ createdAt: -1 })
          .skip(paginationParams.offset)
          .limit(paginationParams.limit)
          .lean(),
        Purchase.countDocuments(query),
        this.getUserOrderStats(userId),
      ]);

      const meta = {
        totalItems: totalCount,
        itemCount: purchases.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
        orderStats: orderStats.data || {},
      };

      return ListResponseDto.create(purchases, meta);
    } catch (error) {
      console.error("❌ Get user purchases error:", error.message);
      return BaseResponseDto.error("Failed to get purchases");
    }
  }

  /**
   * Update purchase status
   */
  async updatePurchaseStatus(purchaseId, status, userId = null) {
    try {
      if (!ValidationUtils.isValidObjectId(purchaseId)) {
        return BaseResponseDto.error("Invalid purchase ID");
      }

      const validStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ];
      if (!validStatuses.includes(status)) {
        return BaseResponseDto.error("Invalid status");
      }

      // Build query - allow admin updates without userId check
      const query = { _id: purchaseId };
      if (userId) {
        query.userId = userId;
      }

      const purchase = await Purchase.findOneAndUpdate(
        query,
        {
          status,
          ...(status === "delivered" && { deliveredAt: new Date() }),
          ...(status === "cancelled" && { cancelledAt: new Date() }),
        },
        { new: true }
      ).populate("productId", "name");

      if (!purchase) {
        return BaseResponseDto.error("Purchase not found or unauthorized");
      }

      // If status is cancelled, restore product stock
      if (status === "cancelled" && purchase.status !== "cancelled") {
        await Product.findByIdAndUpdate(purchase.productId._id, {
          $inc: {
            stock: purchase.quantity,
            purchaseCount: -purchase.quantity,
          },
        });
      }

      return BaseResponseDto.success(
        "Purchase status updated successfully",
        purchase
      );
    } catch (error) {
      console.error("❌ Update purchase status error:", error.message);
      return BaseResponseDto.error("Failed to update purchase status");
    }
  }

  /**
   * Get purchase details
   */
  async getPurchaseDetails(purchaseId, userId = null) {
    try {
      if (!ValidationUtils.isValidObjectId(purchaseId)) {
        return BaseResponseDto.error("Invalid purchase ID");
      }

      // Build query - allow admin access without userId check
      const query = { _id: purchaseId };
      if (userId) {
        query.userId = userId;
      }

      const purchase = await Purchase.findOne(query)
        .populate({
          path: "productId",
          select: "name description imageUrl category price",
          populate: {
            path: "category",
            select: "name",
          },
        })
        .populate("userId", "username email")
        .lean();

      if (!purchase) {
        return BaseResponseDto.error("Purchase not found or unauthorized");
      }

      return BaseResponseDto.success("Purchase details", purchase);
    } catch (error) {
      console.error("❌ Get purchase details error:", error.message);
      return BaseResponseDto.error("Failed to get purchase details");
    }
  }

  /**
   * Get user order statistics
   */
  async getUserOrderStats(userId) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID");
      }

      const stats = await Purchase.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$totalAmount" },
            totalItems: { $sum: "$quantity" },
            avgOrderValue: { $avg: "$totalAmount" },
            statusBreakdown: {
              $push: "$status",
            },
          },
        },
      ]);

      if (stats.length === 0) {
        return BaseResponseDto.success("Order statistics", {
          totalOrders: 0,
          totalSpent: 0,
          totalItems: 0,
          avgOrderValue: 0,
          statusBreakdown: {},
        });
      }

      const result = stats[0];

      // Calculate status breakdown
      const statusBreakdown = {};
      result.statusBreakdown.forEach((status) => {
        statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
      });

      const orderStats = {
        totalOrders: result.totalOrders,
        totalSpent: Math.round(result.totalSpent * 100) / 100,
        totalItems: result.totalItems,
        avgOrderValue: Math.round(result.avgOrderValue * 100) / 100,
        statusBreakdown,
      };

      return BaseResponseDto.success("Order statistics", orderStats);
    } catch (error) {
      console.error("❌ Get user order stats error:", error.message);
      return BaseResponseDto.error("Failed to get order statistics");
    }
  }

  /**
   * Get best selling products
   */
  async getBestSellingProducts({
    limit = 10,
    offset = 0,
    startDate,
    endDate,
    category,
  } = {}) {
    try {
      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Build match query
      const matchQuery = { status: { $in: ["delivered", "completed"] } };

      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
        if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
      }

      const pipeline = [
        { $match: matchQuery },
        {
          $group: {
            _id: "$productId",
            totalSold: { $sum: "$quantity" },
            totalRevenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $match: category ? { "product.category": category } : {},
        },
        {
          $project: {
            _id: 1,
            totalSold: 1,
            totalRevenue: 1,
            orderCount: 1,
            product: {
              name: 1,
              imageUrl: 1,
              price: 1,
              category: 1,
            },
          },
        },
        { $sort: { totalSold: -1 } },
        { $skip: paginationParams.offset },
        { $limit: paginationParams.limit },
      ];

      const [results, totalCount] = await Promise.all([
        Purchase.aggregate(pipeline),
        Purchase.aggregate([...pipeline.slice(0, -2), { $count: "total" }]),
      ]);

      const meta = {
        totalItems: totalCount[0]?.total || 0,
        itemCount: results.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(
          (totalCount[0]?.total || 0) / paginationParams.limit
        ),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
      };

      return ListResponseDto.create(results, meta);
    } catch (error) {
      console.error("❌ Get best selling products error:", error.message);
      return BaseResponseDto.error("Failed to get best selling products");
    }
  }

  /**
   * Generate unique order ID
   */
  generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD${timestamp.slice(-6)}${random}`;
  }

  /**
   * Check if user has purchased a product
   */
  async hasPurchased(userId, productId) {
    try {
      if (
        !ValidationUtils.isValidObjectId(userId) ||
        !ValidationUtils.isValidObjectId(productId)
      ) {
        return BaseResponseDto.error("Invalid user ID or product ID");
      }

      const purchase = await Purchase.findOne({
        userId,
        productId,
        status: { $in: ["delivered", "completed"] },
      });

      return BaseResponseDto.success("Purchase check", {
        hasPurchased: !!purchase,
      });
    } catch (error) {
      console.error("❌ Check purchase error:", error.message);
      return BaseResponseDto.error("Failed to check purchase");
    }
  }
}

module.exports = new PurchaseService();
