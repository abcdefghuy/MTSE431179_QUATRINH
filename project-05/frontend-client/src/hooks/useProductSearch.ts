import { useState, useEffect, useCallback } from "react";
import { getCategoriesAPI, searchProductsAPI } from "../util/api";
import type {
  Category,
  Product,
  ApiResponse,
  SearchFilters,
  SearchProductsParams,
} from "../types/product.types";

interface UseProductSearchState {
  categories: Category[];
  products: Product[];
  filters: SearchFilters;
  loading: {
    categories: boolean;
    products: boolean;
    search: boolean;
  };
  error: {
    categories: string | null;
    products: string | null;
    search: string | null;
  };
  pagination: {
    hasMore: boolean;
    currentOffset: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

interface UseProductSearchActions {
  updateFilters: (filters: SearchFilters) => void;
  searchProducts: () => void;
  loadMoreProducts: () => void;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  clearFilters: () => void;
  retryLoadCategories: () => void;
  retrySearch: () => void;
}

const ITEMS_PER_PAGE = 12;

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  categoryId: "",
  priceRange: [0, 10000000],
  rating: 0,
  minReviewCount: 0,
  inStock: false,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useProductSearch = (): UseProductSearchState &
  UseProductSearchActions => {
  const [state, setState] = useState<UseProductSearchState>({
    categories: [],
    products: [],
    filters: DEFAULT_FILTERS,
    loading: {
      categories: false,
      products: false,
      search: false,
    },
    error: {
      categories: null,
      products: null,
      search: null,
    },
    pagination: {
      hasMore: true,
      currentOffset: 0,
      totalItems: 0,
      currentPage: 1,
      totalPages: 0,
      itemsPerPage: ITEMS_PER_PAGE,
    },
  });

  // Load categories on mount
  const loadCategories = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, categories: true },
      error: { ...prev.error, categories: null },
    }));

    try {
      const response: ApiResponse<Category[]> = await getCategoriesAPI();
      setState((prev) => ({
        ...prev,
        categories: response.data,
        loading: { ...prev.loading, categories: false },
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, categories: false },
        error: { ...prev.error, categories: "Không thể tải danh mục sản phẩm" },
      }));
    }
  }, []);

  // Convert filters to API parameters matching backend controller
  const filtersToApiParams = useCallback(
    (
      filters: SearchFilters,
      offset: number = 0,
      pageSize?: number
    ): SearchProductsParams => {
      const params: SearchProductsParams = {
        limit: pageSize || state.pagination.itemsPerPage,
        offset,
      };

      // Map filters to backend controller parameters
      if (filters.query.trim()) params.query = filters.query.trim();
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.priceRange[0] > 0) params.minPrice = filters.priceRange[0];
      if (filters.priceRange[1] < 10000000)
        params.maxPrice = filters.priceRange[1];
      if (filters.rating > 0) params.rating = filters.rating;
      // Remove minReviewCount as it's not commonly used and not in the basic filter
      if (filters.inStock) params.inStock = filters.inStock;

      // Default sorting
      params.sortBy = filters.sortBy || "createdAt";
      params.sortOrder = filters.sortOrder || "desc";

      return params;
    },
    [state.pagination.itemsPerPage]
  );

  // Search products
  const performSearch = useCallback(
    async (
      filters: SearchFilters,
      offset: number = 0,
      append: boolean = false,
      page: number = 1,
      pageSize?: number
    ) => {
      const loadingKey = append ? "products" : "search";
      const currentPageSize = pageSize || state.pagination.itemsPerPage;

      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [loadingKey]: true },
        error: { ...prev.error, search: null },
      }));

      try {
        const apiParams = filtersToApiParams(filters, offset, currentPageSize);
        const response: ApiResponse<Product[]> = await searchProductsAPI(
          apiParams
        );

        const totalPages = Math.ceil(
          response.meta.totalItems / currentPageSize
        );

        setState((prev) => ({
          ...prev,
          products: append
            ? [...prev.products, ...response.data]
            : response.data,
          loading: { ...prev.loading, [loadingKey]: false },
          pagination: {
            hasMore: response.data.length === currentPageSize,
            currentOffset: offset + response.data.length,
            totalItems: response.meta.totalItems,
            currentPage: page,
            totalPages,
            itemsPerPage: currentPageSize,
          },
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, [loadingKey]: false },
          error: { ...prev.error, search: "Không thể tìm kiếm sản phẩm" },
        }));
      }
    },
    [state.pagination.itemsPerPage, filtersToApiParams]
  );

  // Update filters
  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setState((prev) => ({
      ...prev,
      filters: newFilters,
      pagination: {
        ...prev.pagination,
        currentPage: 1,
        currentOffset: 0,
      },
    }));
  }, []);

  // Search products with current filters
  const searchProducts = useCallback(() => {
    performSearch(state.filters, 0, false, 1);
  }, [state.filters, performSearch]);

  // Load more products (for infinite scroll)
  const loadMoreProducts = useCallback(() => {
    if (state.pagination.hasMore && !state.loading.products) {
      performSearch(
        state.filters,
        state.pagination.currentOffset,
        true,
        state.pagination.currentPage
      );
    }
  }, [
    state.filters,
    state.pagination.hasMore,
    state.pagination.currentOffset,
    state.pagination.currentPage,
    state.loading.products,
    performSearch,
  ]);

  // Change page (for pagination mode)
  const changePage = useCallback(
    (page: number) => {
      if (!state.loading.search) {
        const offset = (page - 1) * state.pagination.itemsPerPage;
        performSearch(
          state.filters,
          offset,
          false,
          page,
          state.pagination.itemsPerPage
        );
      }
    },
    [
      state.filters,
      state.loading.search,
      state.pagination.itemsPerPage,
      performSearch,
    ]
  );

  // Change page size
  const changePageSize = useCallback(
    (pageSize: number) => {
      setState((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          itemsPerPage: pageSize,
          currentPage: 1,
          currentOffset: 0,
        },
      }));

      // Reload products with new page size
      performSearch(state.filters, 0, false, 1, pageSize);
    },
    [state.filters, performSearch]
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: DEFAULT_FILTERS,
      products: [],
      pagination: {
        hasMore: true,
        currentOffset: 0,
        totalItems: 0,
        currentPage: 1,
        totalPages: 0,
        itemsPerPage: ITEMS_PER_PAGE,
      },
    }));
  }, []);

  // Retry functions
  const retryLoadCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  const retrySearch = useCallback(() => {
    performSearch(state.filters, 0, false, state.pagination.currentPage);
  }, [state.filters, state.pagination.currentPage, performSearch]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Auto-search when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only auto-search if there are meaningful filters
      const hasFilters =
        state.filters.query.trim() ||
        state.filters.categoryId ||
        state.filters.priceRange[0] > 0 ||
        state.filters.priceRange[1] < 10000000 ||
        state.filters.rating > 0 ||
        state.filters.inStock;

      if (hasFilters) {
        performSearch(state.filters, 0, false, 1);
      }
    }, 300); // 300ms debounce - faster response

    return () => clearTimeout(timeoutId);
  }, [state.filters, performSearch]);

  return {
    ...state,
    updateFilters,
    searchProducts,
    loadMoreProducts,
    changePage,
    changePageSize,
    clearFilters,
    retryLoadCategories,
    retrySearch,
  };
};
