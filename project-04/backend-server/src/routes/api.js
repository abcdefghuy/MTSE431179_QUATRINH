const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

router.post("/register", createUser);
router.post("/login", handleLogin);
router.get("/user", auth, getUser);
router.get("/account", auth, delay, getAccount);

module.exports = router;
