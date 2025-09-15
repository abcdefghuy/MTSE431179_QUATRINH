const ViewHistory = require("../models/viewHistory");
const Product = require("../models/product");
const { ListResponseDto, BaseResponseDto } = require("../dto/responseDto");
const {
  PaginationUtils,
  ValidationUtils,
} = require("../utils/paginationUtils");

class ViewHistoryService {
  /**
   * Save view history
   */
  async saveViewHistory(data) {
    try {
      const { productId, userId, sessionId, source, referrer, userAgent } =
        data;

      // Validate productId
      if (!ValidationUtils.isValidObjectId(productId)) {
        return BaseResponseDto.error("Invalid product ID format");
      }

      // Check if product exists
      const product = await Product.findById(productId).where({
        isActive: true,
      });
      if (!product) {
        return BaseResponseDto.error("Product not found or inactive");
      }

      // Prepare view history data
      const viewData = {
        productId,
        viewedAt: new Date(),
        source: source || "direct",
        referrer,
        userAgent,
      };

      // Add userId if authenticated, otherwise use sessionId
      if (userId && ValidationUtils.isValidObjectId(userId)) {
        viewData.userId = userId;
      } else if (sessionId) {
        viewData.sessionId = sessionId;
      } else {
        return BaseResponseDto.error("Either userId or sessionId is required");
      }

      // Check if this is a duplicate view (same user/session viewing same product within 10 minutes)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const duplicateQuery = {
        productId,
        viewedAt: { $gte: tenMinutesAgo },
      };

      if (userId) {
        duplicateQuery.userId = userId;
      } else {
        duplicateQuery.sessionId = sessionId;
      }

      const existingView = await ViewHistory.findOne(duplicateQuery);
      if (existingView) {
        return BaseResponseDto.success(
          "View already recorded recently",
          existingView
        );
      }

      // Create new view history
      const viewHistory = new ViewHistory(viewData);
      await viewHistory.save();

      // Update product view count
      await Product.findByIdAndUpdate(productId, {
        $inc: { viewCount: 1 },
      });

      return BaseResponseDto.success(
        viewHistory,
        "View history saved successfully"
      );
    } catch (error) {
      console.error("❌ Save view history error:", error.message);
      return BaseResponseDto.error("Failed to save view history");
    }
  }

  /**
   * Get user's view history
   */
  async getViewHistory(
    userId,
    { limit = 20, offset = 0, sortBy = "viewedAt", sortOrder = "desc" } = {}
  ) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID format");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Build sort
      const sort = {};
      if (sortBy === "viewedAt") sort.viewedAt = sortOrder === "asc" ? 1 : -1;
      else sort.viewedAt = -1; // Default sort

      const [viewHistory, totalCount] = await Promise.all([
        ViewHistory.find({ userId })
          .populate({
            path: "productId",
            select:
              "name price imageUrl rating reviewCount category brand isActive",
            match: { isActive: true },
            populate: {
              path: "category",
              select: "name",
            },
          })
          .sort(sort)
          .skip(paginationParams.offset)
          .limit(paginationParams.limit)
          .lean(),
        ViewHistory.countDocuments({ userId }),
      ]);

      // Filter out views where product was deleted/deactivated
      const validViews = viewHistory.filter((view) => view.productId);

      // Group by product to show unique products with latest view time
      const uniqueProducts = new Map();
      validViews.forEach((view) => {
        const productId = view.productId._id.toString();
        if (
          !uniqueProducts.has(productId) ||
          uniqueProducts.get(productId).viewedAt < view.viewedAt
        ) {
          uniqueProducts.set(productId, {
            ...view,
            viewCount: (uniqueProducts.get(productId)?.viewCount || 0) + 1,
          });
        }
      });

      const uniqueViewHistory = Array.from(uniqueProducts.values());

      const meta = {
        totalItems: totalCount,
        itemCount: uniqueViewHistory.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
        uniqueProducts: uniqueProducts.size,
      };

      return ListResponseDto.create(uniqueViewHistory, meta);
    } catch (error) {
      console.error("❌ Get view history error:", error.message);
      return BaseResponseDto.error("Failed to get view history");
    }
  }

  /**
   * Get view history analytics for user
   */
  async getViewHistoryStats(userId) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID format");
      }

      const stats = await ViewHistory.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: 1 },
            uniqueProducts: { $addToSet: "$productId" },
            firstView: { $min: "$viewedAt" },
            lastView: { $max: "$viewedAt" },
            sources: { $push: "$source" },
          },
        },
        {
          $project: {
            totalViews: 1,
            uniqueProductCount: { $size: "$uniqueProducts" },
            firstView: 1,
            lastView: 1,
            sources: 1,
          },
        },
      ]);

      if (stats.length === 0) {
        return BaseResponseDto.success("View history statistics", {
          totalViews: 0,
          uniqueProductCount: 0,
          firstView: null,
          lastView: null,
          sourceBreakdown: {},
        });
      }

      const result = stats[0];

      // Calculate source breakdown
      const sourceBreakdown = {};
      result.sources.forEach((source) => {
        sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
      });

      const viewStats = {
        totalViews: result.totalViews,
        uniqueProductCount: result.uniqueProductCount,
        firstView: result.firstView,
        lastView: result.lastView,
        sourceBreakdown,
      };

      return BaseResponseDto.success("View history statistics", viewStats);
    } catch (error) {
      console.error("❌ Get view history stats error:", error.message);
      return BaseResponseDto.error("Failed to get view history statistics");
    }
  }

  /**
   * Clear user's view history
   */
  async clearViewHistory(userId) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID format");
      }

      const result = await ViewHistory.deleteMany({ userId });

      return BaseResponseDto.success(
        `Cleared ${result.deletedCount} view history records`,
        { deletedCount: result.deletedCount }
      );
    } catch (error) {
      console.error("❌ Clear view history error:", error.message);
      return BaseResponseDto.error("Failed to clear view history");
    }
  }
}

module.exports = new ViewHistoryService();
