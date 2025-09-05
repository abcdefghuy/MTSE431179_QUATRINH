const productService = require("../services/productService");
const { BaseResponseDto } = require("../dto/responseDto");
const { ValidationUtils } = require("../utils/paginationUtils");

/**
 * Get products by category with pagination
 * GET /v1/api/products/by-category?categoryId=xxx&limit=10&offset=0&sortBy=createdAt&sortOrder=desc
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    // Validate required parameters
    if (!categoryId) {
      const errorResponse = BaseResponseDto.error("categoryId is required");
      return res.status(400).json(errorResponse);
    }

    // Validate categoryId format (MongoDB ObjectId)
    if (!ValidationUtils.isValidObjectId(categoryId)) {
      const errorResponse = BaseResponseDto.error("Invalid categoryId format");
      return res.status(400).json(errorResponse);
    }

    const result = await productService.getProductsByCategory(
      categoryId,
      req.query
    );

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error in getProductsByCategory:", error);
    const errorResponse = BaseResponseDto.error("Internal server error");
    return res.status(500).json(errorResponse);
  }
};

/**
 * Get all categories
 * GET /v1/api/categories
 */
const getAllCategories = async (req, res) => {
  try {
    const result = await productService.getAllCategories();

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    const errorResponse = BaseResponseDto.error("Internal server error");
    return res.status(500).json(errorResponse);
  }
};

/**
 * Get all products with pagination
 * GET /v1/api/products?limit=10&offset=0&sortBy=createdAt&sortOrder=desc
 */
const getAllProducts = async (req, res) => {
  try {
    const result = await productService.getAllProducts(req.query);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    const errorResponse = BaseResponseDto.error("Internal server error");
    return res.status(500).json(errorResponse);
  }
};

module.exports = {
  getProductsByCategory,
  getAllCategories,
  getAllProducts,
};
