export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    category?: {
      id: string;
      name: string;
      description: string;
    };
  };
}

export interface ProductsByCategoryParams {
  categoryId: string;
  limit?: number;
  offset?: number;
}

export interface SearchProductsParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  minReviewCount?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: string;
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  query: string;
  categoryId: string;
  priceRange: [number, number];
  rating: number;
  minReviewCount: number;
  inStock: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
