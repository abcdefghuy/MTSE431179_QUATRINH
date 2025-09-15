const Comment = require("../models/comment");
const Product = require("../models/product");
const Purchase = require("../models/purchase");
const { ListResponseDto, BaseResponseDto } = require("../dto/responseDto");
const {
  PaginationUtils,
  ValidationUtils,
} = require("../utils/paginationUtils");

class CommentService {
  /**
   * Add a new comment/review
   */
  async addComment(userId, productId, { rating, comment }) {
    try {
      // Validate inputs
      if (
        !ValidationUtils.isValidObjectId(userId) ||
        !ValidationUtils.isValidObjectId(productId)
      ) {
        return BaseResponseDto.error("Invalid user ID or product ID");
      }

      if (!rating || rating < 1 || rating > 5) {
        return BaseResponseDto.error("Rating must be between 1 and 5");
      }

      if (!comment || comment.trim().length < 10) {
        return BaseResponseDto.error(
          "Comment must be at least 10 characters long"
        );
      }

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return BaseResponseDto.error("Product not found");
      }

      // Check if user already commented on this product
      const existingComment = await Comment.findOne({ userId, productId });
      if (existingComment) {
        return BaseResponseDto.error("You have already reviewed this product");
      }

      // Check if user purchased this product for verified purchase badge
      const purchase = await Purchase.findOne({
        userId,
        productId,
        status: "completed",
      });

      // Create comment
      const newComment = new Comment({
        userId,
        productId,
        rating: parseInt(rating),
        comment: comment.trim(),
        isVerifiedPurchase: !!purchase,
      });

      await newComment.save();

      // Update product statistics
      await this.updateProductRatingStats(productId);

      return BaseResponseDto.success("Comment added successfully", newComment);
    } catch (error) {
      console.error("❌ Add comment error:", error.message);
      return BaseResponseDto.error("Failed to add comment");
    }
  }

  /**
   * Get comments for a product
   */
  async getProductComments(
    productId,
    {
      limit = 10,
      offset = 0,
      sortBy = "createdAt",
      sortOrder = "desc",
      rating,
    } = {}
  ) {
    try {
      if (!ValidationUtils.isValidObjectId(productId)) {
        return BaseResponseDto.error("Invalid product ID");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      // Build query
      const query = { productId, isActive: true };
      if (rating && rating >= 1 && rating <= 5) {
        query.rating = parseInt(rating);
      }

      // Build sort
      const sort = {};
      if (sortBy === "rating") sort.rating = sortOrder === "asc" ? 1 : -1;
      else if (sortBy === "likes") sort.likes = sortOrder === "asc" ? 1 : -1;
      else sort.createdAt = sortOrder === "asc" ? 1 : -1;

      const [comments, totalCount, ratingStats] = await Promise.all([
        Comment.find(query)
          .sort(sort)
          .skip(paginationParams.offset)
          .limit(paginationParams.limit)
          .lean(),
        Comment.countDocuments(query),
        this.getProductRatingStats(productId),
      ]);

      const meta = {
        totalItems: totalCount,
        itemCount: comments.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
        ratingStats: ratingStats.data || {},
      };

      return ListResponseDto.create(comments, meta);
    } catch (error) {
      console.error("❌ Get product comments error:", error.message);
      return BaseResponseDto.error("Failed to get comments");
    }
  }

  /**
   * Update comment rating and review count for a product
   */
  async updateProductRatingStats(productId) {
    try {
      const stats = await Comment.aggregate([
        { $match: { productId: productId, isActive: true } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            ratingDistribution: {
              $push: "$rating",
            },
          },
        },
      ]);

      if (stats.length > 0) {
        const { averageRating, totalReviews } = stats[0];

        await Product.findByIdAndUpdate(productId, {
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          reviewCount: totalReviews,
        });
      }

      return true;
    } catch (error) {
      console.error("❌ Update product rating stats error:", error.message);
      return false;
    }
  }

  /**
   * Get rating statistics for a product
   */
  async getProductRatingStats(productId) {
    try {
      if (!ValidationUtils.isValidObjectId(productId)) {
        return BaseResponseDto.error("Invalid product ID");
      }

      const [stats, distribution] = await Promise.all([
        Comment.aggregate([
          { $match: { productId: productId, isActive: true } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
              verifiedPurchases: {
                $sum: { $cond: ["$isVerifiedPurchase", 1, 0] },
              },
            },
          },
        ]),
        Comment.aggregate([
          { $match: { productId: productId, isActive: true } },
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          { $sort: { _id: -1 } },
        ]),
      ]);

      const ratingStats = stats[0] || {
        averageRating: 0,
        totalReviews: 0,
        verifiedPurchases: 0,
      };

      // Create rating distribution (1-5 stars)
      const ratingDistribution = {};
      for (let i = 1; i <= 5; i++) {
        ratingDistribution[i] = 0;
      }

      distribution.forEach((item) => {
        ratingDistribution[item._id] = item.count;
      });

      const result = {
        ...ratingStats,
        ratingDistribution,
        averageRating: Math.round(ratingStats.averageRating * 10) / 10,
      };

      return BaseResponseDto.success("Rating statistics", result);
    } catch (error) {
      console.error("❌ Get rating stats error:", error.message);
      return BaseResponseDto.error("Failed to get rating statistics");
    }
  }

  /**
   * Like/Unlike a comment
   */
  async toggleCommentLike(commentId, userId, isLike = true) {
    try {
      if (
        !ValidationUtils.isValidObjectId(commentId) ||
        !ValidationUtils.isValidObjectId(userId)
      ) {
        return BaseResponseDto.error("Invalid comment ID or user ID");
      }

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return BaseResponseDto.error("Comment not found");
      }

      const updateField = isLike ? "likes" : "dislikes";
      const increment = 1;

      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { [updateField]: increment } },
        { new: true }
      );

      const action = isLike ? "liked" : "disliked";
      return BaseResponseDto.success(
        `Comment ${action} successfully`,
        updatedComment
      );
    } catch (error) {
      console.error("❌ Toggle comment like error:", error.message);
      return BaseResponseDto.error("Failed to update comment reaction");
    }
  }

  /**
   * Get user's comments
   */
  async getUserComments(userId, { limit = 10, offset = 0 } = {}) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      const [comments, totalCount] = await Promise.all([
        Comment.find({ userId, isActive: true })
          .populate({
            path: "productId",
            select: "name imageUrl category",
            populate: {
              path: "category",
              select: "name",
            },
          })
          .sort({ createdAt: -1 })
          .skip(paginationParams.offset)
          .limit(paginationParams.limit)
          .lean(),
        Comment.countDocuments({ userId, isActive: true }),
      ]);

      const meta = {
        totalItems: totalCount,
        itemCount: comments.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
      };

      return ListResponseDto.create(comments, meta);
    } catch (error) {
      console.error("❌ Get user comments error:", error.message);
      return BaseResponseDto.error("Failed to get user comments");
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId, userId) {
    try {
      if (
        !ValidationUtils.isValidObjectId(commentId) ||
        !ValidationUtils.isValidObjectId(userId)
      ) {
        return BaseResponseDto.error("Invalid comment ID or user ID");
      }

      const comment = await Comment.findOneAndUpdate(
        { _id: commentId, userId },
        { isActive: false },
        { new: true }
      );

      if (!comment) {
        return BaseResponseDto.error("Comment not found or unauthorized");
      }

      // Update product rating stats
      await this.updateProductRatingStats(comment.productId);

      return BaseResponseDto.success("Comment deleted successfully");
    } catch (error) {
      console.error("❌ Delete comment error:", error.message);
      return BaseResponseDto.error("Failed to delete comment");
    }
  }
}

module.exports = new CommentService();
