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
} = require("../controllers/productController");

const {
  searchProducts,
  getSearchSuggestions,
  getSearchFilters,
  getPopularSearchTerms,
  getSearchAnalytics,
} = require("../controllers/searchController");

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

// Category routes
router.get("/categories", getAllCategories);

// Search utility routes
router.get("/search/suggestions", getSearchSuggestions);
router.get("/search/filters", getSearchFilters);
router.get("/search/popular", getPopularSearchTerms);
router.get("/search/analytics", auth, getSearchAnalytics); // Require auth for analytics

module.exports = router;
