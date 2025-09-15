export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name?: string;
  description?: string;
  price?: number;
  category?: Category;
  imageUrl?: string;
  stock?: number;
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
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

// New interfaces for extended functionality
export interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  product: string;
  purchase: string;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  _id: string;
  user: string;
  product: Product;
  quantity: number;
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  _id: string;
  user: string;
  product: Product;
  createdAt: string;
}

export interface ViewHistory {
  _id: string;
  userId: string;
  productId: Product;
  viewedAt?: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductDetail extends Product {
  comments?: Comment[];
  relatedProducts?: Product[];
  isFavorited?: boolean;
  totalComments?: number;
}

export interface CreateCommentRequest {
  content: string;
  rating: number;
  purchaseId: string;
}

export interface CreatePurchaseRequest {
  productId: string;
  quantity: number;
}
