const commentService = require("../services/commentService");

class CommentController {
  /**
   * Add a new comment/review
   * POST /api/products/:productId/comments
   */
  async addComment(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { rating, comment } = req.body;

      // Validation
      if (!rating || !comment) {
        return res.status(400).json({
          success: false,
          message: "Rating and comment are required",
        });
      }

      const result = await commentService.addComment(userId, productId, {
        rating,
        comment,
      });

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Add comment controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get comments for a product
   * GET /api/products/:productId/comments
   */
  async getProductComments(req, res) {
    try {
      const { productId } = req.params;
      const { limit, offset, sortBy, sortOrder, rating } = req.query;

      const result = await commentService.getProductComments(productId, {
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
        sortBy: sortBy || "createdAt",
        sortOrder: sortOrder || "desc",
        rating: rating ? parseInt(rating) : undefined,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get product comments controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get rating statistics for a product
   * GET /api/products/:productId/rating-stats
   */
  async getProductRatingStats(req, res) {
    try {
      const { productId } = req.params;

      const result = await commentService.getProductRatingStats(productId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Get product rating stats controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Like or dislike a comment
   * POST /api/comments/:commentId/react
   */
  async toggleCommentReaction(req, res) {
    try {
      const userId = req.user.id;
      const { commentId } = req.params;
      const { isLike } = req.body;

      if (typeof isLike !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isLike must be a boolean value",
        });
      }

      const result = await commentService.toggleCommentLike(
        commentId,
        userId,
        isLike
      );

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error(
        "❌ Toggle comment reaction controller error:",
        error.message
      );
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get user's own comments
   * GET /api/comments/my-comments
   */
  async getUserComments(req, res) {
    try {
      const userId = req.user.id;
      const { limit, offset } = req.query;

      const result = await commentService.getUserComments(userId, {
        limit: parseInt(limit) || 10,
        offset: parseInt(offset) || 0,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Get user comments controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Delete a comment
   * DELETE /api/comments/:commentId
   */
  async deleteComment(req, res) {
    try {
      const userId = req.user.id;
      const { commentId } = req.params;

      const result = await commentService.deleteComment(commentId, userId);

      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      console.error("❌ Delete comment controller error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new CommentController();
