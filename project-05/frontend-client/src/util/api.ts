import axios from "./axios.customize";
import type {
  ApiResponse,
  Category,
  Product,
  ProductDetail,
  ProductsByCategoryParams,
  SearchProductsParams,
  Comment,
  Purchase,
  Favorite,
  ViewHistory,
  CreateCommentRequest,
  CreatePurchaseRequest,
} from "../types/product.types";

const BASE_URL = "/v1/api";

// User APIs
const createUserAPI = (name: string, email: string, password: string) => {
  return axios.post(`${BASE_URL}/register`, {
    name,
    email,
    password,
  });
};

const loginUserAPI = (email: string, password: string) => {
  return axios.post(`${BASE_URL}/login`, {
    email,
    password,
  });
};

const getUserAPI = () => {
  return axios.get(`${BASE_URL}/user`);
};

// Category APIs
const getCategoriesAPI = (): Promise<ApiResponse<Category[]>> => {
  return axios.get(`${BASE_URL}/categories`);
};

// Product APIs
const getProductsByCategoryAPI = (
  params: ProductsByCategoryParams
): Promise<ApiResponse<Product[]>> => {
  const { categoryId, limit = 10, offset = 0 } = params;
  return axios.get(`${BASE_URL}/products/by-category`, {
    params: {
      categoryId,
      limit,
      offset,
    },
  });
};

const searchProductsAPI = (
  params: SearchProductsParams
): Promise<ApiResponse<Product[]>> => {
  return axios.get(`${BASE_URL}/products/search`, {
    params,
  });
};

// Product detail and related APIs
const getProductDetailAPI = (
  productId: string
): Promise<ApiResponse<ProductDetail>> => {
  return axios.get(`${BASE_URL}/products/${productId}`);
};

const getRelatedProductsAPI = (
  productId: string
): Promise<ApiResponse<Product[]>> => {
  return axios.get(`${BASE_URL}/products/${productId}/related`);
};

// Favorite APIs
const addToFavoritesAPI = (
  productId: string
): Promise<ApiResponse<Favorite>> => {
  return axios.post(`${BASE_URL}/favorites`, { productId });
};

const removeFromFavoritesAPI = (
  productId: string
): Promise<ApiResponse<{ message: string }>> => {
  return axios.delete(`${BASE_URL}/favorites/${productId}`);
};

const getUserFavoritesAPI = (): Promise<ApiResponse<Favorite[]>> => {
  return axios.get(`${BASE_URL}/favorites`);
};

// Purchase APIs
const createPurchaseAPI = (
  data: CreatePurchaseRequest
): Promise<ApiResponse<Purchase>> => {
  return axios.post(`${BASE_URL}/purchases`, data);
};

const getUserPurchasesAPI = (): Promise<ApiResponse<Purchase[]>> => {
  return axios.get(`${BASE_URL}/purchases`);
};

// Comment APIs
const createCommentAPI = (
  data: CreateCommentRequest
): Promise<ApiResponse<Comment>> => {
  return axios.post(`${BASE_URL}/comments`, data);
};

const getProductCommentsAPI = (
  productId: string
): Promise<ApiResponse<Comment[]>> => {
  return axios.get(`${BASE_URL}/products/${productId}/comments`);
};

// View history APIs
const recordProductViewAPI = (
  productId: string
): Promise<ApiResponse<ViewHistory>> => {
  return axios.post(`${BASE_URL}/view-history`, { productId });
};

const getUserViewHistoryAPI = (): Promise<ApiResponse<ViewHistory[]>> => {
  return axios.get(`${BASE_URL}/view-history`);
};

// Recommendation APIs
const getRecommendationsAPI = (): Promise<ApiResponse<Product[]>> => {
  return axios.get(`${BASE_URL}/recommendations/personalized`);
};

// Get discover recommendations (public)
const getDiscoverRecommendationsAPI = (): Promise<ApiResponse<Product[]>> => {
  return axios.get(`${BASE_URL}/recommendations/discover`);
};

// Get trending products (public)
const getTrendingProductsAPI = (): Promise<ApiResponse<Product[]>> => {
  return axios.get(`${BASE_URL}/recommendations/trending`);
};

// Get personalized recommendations (authenticated)
const getPersonalizedRecommendationsAPI = (): Promise<
  ApiResponse<Product[]>
> => {
  return axios.get(`${BASE_URL}/recommendations/personalized`);
};

// Get similar products for a product (public)
const getSimilarProductsAPI = (
  productId: string
): Promise<ApiResponse<Product[]>> => {
  return axios.get(`${BASE_URL}/products/${productId}/similar`);
};

export {
  createUserAPI,
  loginUserAPI,
  getUserAPI,
  getCategoriesAPI,
  getProductsByCategoryAPI,
  searchProductsAPI,
  getProductDetailAPI,
  getRelatedProductsAPI,
  addToFavoritesAPI,
  removeFromFavoritesAPI,
  getUserFavoritesAPI,
  createPurchaseAPI,
  getUserPurchasesAPI,
  createCommentAPI,
  getProductCommentsAPI,
  recordProductViewAPI,
  getUserViewHistoryAPI,
  getRecommendationsAPI,
  getDiscoverRecommendationsAPI,
  getTrendingProductsAPI,
  getPersonalizedRecommendationsAPI,
  getSimilarProductsAPI,
};
