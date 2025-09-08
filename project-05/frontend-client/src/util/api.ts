import axios from "./axios.customize";
import type {
  ApiResponse,
  Category,
  Product,
  ProductsByCategoryParams,
  SearchProductsParams,
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

export {
  createUserAPI,
  loginUserAPI,
  getUserAPI,
  getCategoriesAPI,
  getProductsByCategoryAPI,
  searchProductsAPI,
};
