const Favorite = require("../models/favorite");
const Product = require("../models/product");
const { ListResponseDto, BaseResponseDto } = require("../dto/responseDto");
const {
  PaginationUtils,
  ValidationUtils,
} = require("../utils/paginationUtils");

class FavoriteService {
  /**
   * Add product to favorites
   */
  async addToFavorites(userId, productId) {
    try {
      console.log("Adding to favorites:", { userId, productId });
      // Validate inputs
      if (
        !ValidationUtils.isValidObjectId(userId) ||
        !ValidationUtils.isValidObjectId(productId)
      ) {
        return BaseResponseDto.error("Invalid user ID or product ID");
      }

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return BaseResponseDto.error("Product not found");
      }

      // Check if already favorited
      const existingFavorite = await Favorite.findOne({ userId, productId });
      if (existingFavorite) {
        return BaseResponseDto.error("Product already in favorites");
      }

      // Create favorite
      const favorite = new Favorite({ userId, productId });
      await favorite.save();

      // Update product favorite count
      await Product.findByIdAndUpdate(productId, {
        $inc: { favoriteCount: 1 },
      });

      return BaseResponseDto.success(favorite, "Product added to favorites");
    } catch (error) {
      console.error("❌ Add to favorites error:", error.message);
      return BaseResponseDto.error("Failed to add to favorites");
    }
  }

  /**
   * Remove product from favorites
   */
  async removeFromFavorites(userId, productId) {
    try {
      // Validate inputs
      if (
        !ValidationUtils.isValidObjectId(userId) ||
        !ValidationUtils.isValidObjectId(productId)
      ) {
        return BaseResponseDto.error("Invalid user ID or product ID");
      }

      const favorite = await Favorite.findOneAndDelete({ userId, productId });
      if (!favorite) {
        return BaseResponseDto.error("Product not in favorites");
      }

      // Update product favorite count
      await Product.findByIdAndUpdate(productId, {
        $inc: { favoriteCount: -1 },
      });

      return BaseResponseDto.success("Product removed from favorites");
    } catch (error) {
      console.error("❌ Remove from favorites error:", error.message);
      return BaseResponseDto.error("Failed to remove from favorites");
    }
  }

  /**
   * Get user's favorite products
   */
  async getUserFavorites(
    userId,
    { limit = 20, offset = 0, sortBy = "createdAt", sortOrder = "desc" } = {}
  ) {
    try {
      if (!ValidationUtils.isValidObjectId(userId)) {
        return BaseResponseDto.error("Invalid user ID");
      }

      const paginationParams = PaginationUtils.parsePaginationParams({
        limit,
        offset,
      });

      const sort = {};
      if (sortBy === "name")
        sort["productId.name"] = sortOrder === "asc" ? 1 : -1;
      else if (sortBy === "price")
        sort["productId.price"] = sortOrder === "asc" ? 1 : -1;
      else if (sortBy === "rating")
        sort["productId.rating"] = sortOrder === "asc" ? 1 : -1;
      else sort.createdAt = sortOrder === "asc" ? 1 : -1;

      const [favorites, totalCount] = await Promise.all([
        Favorite.find({ userId })
          .populate({
            path: "productId",
            select:
              "name description price category imageUrl rating reviewCount stock isActive brand",
            populate: {
              path: "category",
              select: "name",
            },
          })
          .sort(sort)
          .skip(paginationParams.offset)
          .limit(paginationParams.limit)
          .lean(),
        Favorite.countDocuments({ userId }),
      ]);

      // Filter out favorites with deleted products
      const validFavorites = favorites.filter(
        (fav) => fav.productId && fav.productId.isActive
      );

      const meta = {
        totalItems: totalCount,
        itemCount: validFavorites.length,
        itemsPerPage: paginationParams.limit,
        totalPages: Math.ceil(totalCount / paginationParams.limit),
        currentPage:
          Math.floor(paginationParams.offset / paginationParams.limit) + 1,
      };

      return ListResponseDto.create(validFavorites, meta);
    } catch (error) {
      console.error("❌ Get user favorites error:", error.message);
      return BaseResponseDto.error("Failed to get favorites");
    }
  }

  /**
   * Check if product is favorited by user
   */
  async isFavorited(userId, productId) {
    try {
      if (
        !ValidationUtils.isValidObjectId(userId) ||
        !ValidationUtils.isValidObjectId(productId)
      ) {
        return BaseResponseDto.success("Favorite status", {
          isFavorited: false,
        });
      }

      const favorite = await Favorite.findOne({ userId, productId });
      return BaseResponseDto.success("Favorite status", {
        isFavorited: !!favorite,
      });
    } catch (error) {
      console.error("❌ Check favorite status error:", error.message);
      return BaseResponseDto.success("Favorite status", { isFavorited: false });
    }
  }

  /**
   * Get favorite statistics for product
   */
  async getFavoriteStats(productId) {
    try {
      if (!ValidationUtils.isValidObjectId(productId)) {
        return BaseResponseDto.error("Invalid product ID");
      }

      const [favoriteCount, recentFavorites] = await Promise.all([
        Favorite.countDocuments({ productId }),
        Favorite.find({ productId })
          .populate("userId", "name")
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
      ]);

      const stats = {
        favoriteCount,
        recentFavorites: recentFavorites.map((fav) => ({
          userId: fav.userId._id,
          userName: fav.userId.name,
          createdAt: fav.createdAt,
        })),
      };

      return BaseResponseDto.success("Favorite statistics", stats);
    } catch (error) {
      console.error("❌ Get favorite stats error:", error.message);
      return BaseResponseDto.error("Failed to get favorite statistics");
    }
  }

  /**
   * Get most favorited products
   */
  async getMostFavorited({ limit = 10, categoryId } = {}) {
    try {
      const matchQuery = { isActive: true };
      if (categoryId && ValidationUtils.isValidObjectId(categoryId)) {
        matchQuery.category = categoryId;
      }

      const products = await Product.find(matchQuery)
        .populate("category", "name")
        .sort({ favoriteCount: -1, rating: -1 })
        .limit(limit)
        .lean();

      return ListResponseDto.create(products);
    } catch (error) {
      console.error("❌ Get most favorited error:", error.message);
      return BaseResponseDto.error("Failed to get most favorited products");
    }
  }
}

module.exports = new FavoriteService();
