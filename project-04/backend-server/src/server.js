require("dotenv").config();

const express = require("express");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const connection = require("./config/database");
const { getHomePage } = require("./controllers/homeController");
const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
configViewEngine(app);
const webAPI = express.Router();
webAPI.get("/", getHomePage);
app.use("/v1/api/", apiRoutes);
(async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();
