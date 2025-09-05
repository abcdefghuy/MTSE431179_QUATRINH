require("dotenv").config();
const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login"];
  if (white_lists.find((item) => "/v1/api" + item === req.originalUrl)) {
    return next();
  } else {
    if (req?.headers?.authorization?.split(" ")?.[1]) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          name: decoded.name,
          createdBy: "hoidanit",
        };
        next();
      } catch (error) {
        return res.status(401).json({ message: "Token khong hop le" });
      }
    } else {
      return res.status(401).json({ message: "Khong tim thay token" });
    }
  }
};

module.exports = auth;
