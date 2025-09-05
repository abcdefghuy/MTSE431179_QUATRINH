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

// Category routes
router.get("/categories", getAllCategories);

module.exports = router;
