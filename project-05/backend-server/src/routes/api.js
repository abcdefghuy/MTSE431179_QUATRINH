const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");

const {
  getProductsByCategory,
  getAllCategories,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

const {
  searchProducts,
  getSearchSuggestions,
  getSearchFilters,
  getPopularSearchTerms,
  getSearchAnalytics,
} = require("../controllers/searchController");

// Import new controllers
const favoriteController = require("../controllers/favoriteController");
const commentController = require("../controllers/commentController");
const purchaseController = require("../controllers/purchaseController");
const recommendationController = require("../controllers/recommendationController");
const viewHistoryController = require("../controllers/viewHistoryController");

const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

// User routes
router.post("/register", createUser);
router.post("/login", handleLogin);
router.get("/user", auth, getUser);
router.get("/account", auth, delay, getAccount);

// Product routes
router.get("/products", getAllProducts);
router.get("/products/by-category", getProductsByCategory);
router.get("/products/search", searchProducts); // Main product search endpoint
router.get("/products/:productId", getProductById); // Get product details by ID

// Category routes
router.get("/categories", getAllCategories);

// Search utility routes
router.get("/search/suggestions", getSearchSuggestions);
router.get("/search/filters", getSearchFilters);
router.get("/search/popular", getPopularSearchTerms);
router.get("/search/analytics", auth, getSearchAnalytics); // Require auth for analytics

// **NEW FEATURE ROUTES**

// Favorite routes (require authentication)
router.post("/favorites", auth, favoriteController.addToFavorites);
router.delete(
  "/favorites/:productId",
  auth,
  favoriteController.removeFromFavorites
);
router.get("/favorites", auth, favoriteController.getUserFavorites);
router.get(
  "/favorites/check/:productId",
  auth,
  favoriteController.checkFavoriteStatus
);
router.get("/favorites/stats", auth, favoriteController.getFavoriteStats);
router.get("/favorites/trending", favoriteController.getMostFavorited); // Public endpoint

// Comment/Review routes
router.post(
  "/products/:productId/comments",
  auth,
  commentController.addComment
);
router.get(
  "/products/:productId/comments",
  commentController.getProductComments
); // Public
router.get(
  "/products/:productId/rating-stats",
  commentController.getProductRatingStats
); // Public
router.post(
  "/comments/:commentId/react",
  auth,
  commentController.toggleCommentReaction
);
router.get("/comments/my-comments", auth, commentController.getUserComments);
router.delete("/comments/:commentId", auth, commentController.deleteComment);

// Purchase/Order routes (require authentication)
router.post("/purchases", auth, purchaseController.createPurchase);
router.get("/purchases", auth, purchaseController.getUserPurchases);
router.put(
  "/purchases/:purchaseId/status",
  auth,
  purchaseController.updatePurchaseStatus
);
router.get(
  "/purchases/:purchaseId",
  auth,
  purchaseController.getPurchaseDetails
);
router.get("/purchases/stats", auth, purchaseController.getUserOrderStats);
router.get(
  "/purchases/check/:productId",
  auth,
  purchaseController.checkPurchaseStatus
);
router.get(
  "/purchases/best-selling",
  purchaseController.getBestSellingProducts
); // Public

// Admin purchase routes (would need admin middleware in production)
router.put(
  "/admin/purchases/:purchaseId/status",
  auth,
  purchaseController.adminUpdatePurchaseStatus
);
router.get(
  "/admin/purchases/:purchaseId",
  auth,
  purchaseController.adminGetPurchaseDetails
);

// Recommendation routes
router.get(
  "/products/:productId/similar",
  recommendationController.getSimilarProducts
); // Public
router.get(
  "/recommendations/personalized",
  auth,
  recommendationController.getPersonalizedRecommendations
);
router.get(
  "/recommendations/recently-viewed",
  auth,
  recommendationController.getRecentlyViewed
);
router.get(
  "/recommendations/trending",
  recommendationController.getTrendingProducts
); // Public
router.get(
  "/recommendations/discover",
  recommendationController.getDiscoverRecommendations
); // Public
router.get(
  "/recommendations/dashboard",
  recommendationController.getRecommendationDashboard
); // Mixed (auth optional)

// Analytics routes (view tracking)
router.post(
  "/products/:productId/view",
  recommendationController.recordProductView
); // Public (but can be auth)

// View history routes
router.post("/view-history", auth, viewHistoryController.saveViewHistory);
router.get("/view-history", auth, viewHistoryController.getViewHistory);

module.exports = router;
