import { useState, useEffect, useCallback } from "react";
import { getCategoriesAPI, getProductsByCategoryAPI } from "../util/api";
import type { Category, Product, ApiResponse } from "../types/product.types";

interface UseProductsState {
  categories: Category[];
  products: Product[];
  selectedCategory: Category | null;
  loading: {
    categories: boolean;
    products: boolean;
    loadingMore: boolean;
  };
  error: {
    categories: string | null;
    products: string | null;
  };
  pagination: {
    hasMore: boolean;
    currentOffset: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
  isInfiniteScroll: boolean;
}

interface UseProductsActions {
  selectCategory: (category: Category) => void;
  loadMoreProducts: () => void;
  retryLoadCategories: () => void;
  retryLoadProducts: () => void;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  togglePaginationMode: (isInfiniteScroll: boolean) => void;
}

const ITEMS_PER_PAGE = 10;

export const useProducts = (): UseProductsState & UseProductsActions => {
  const [state, setState] = useState<UseProductsState>({
    categories: [],
    products: [],
    selectedCategory: null,
    loading: {
      categories: false,
      products: false,
      loadingMore: false,
    },
    error: {
      categories: null,
      products: null,
    },
    pagination: {
      hasMore: true,
      currentOffset: 0,
      totalItems: 0,
      currentPage: 1,
      totalPages: 0,
      itemsPerPage: ITEMS_PER_PAGE,
    },
    isInfiniteScroll: true,
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
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, categories: false },
        error: { ...prev.error, categories: "Không thể tải danh mục sản phẩm" },
      }));
    }
  }, []);

  // Load products for selected category
  const loadProducts = useCallback(
    async (
      categoryId: string,
      offset: number = 0,
      append: boolean = false,
      page: number = 1,
      pageSize?: number
    ) => {
      const loadingKey = append ? "loadingMore" : "products";
      const currentPageSize = pageSize || state.pagination.itemsPerPage;

      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, [loadingKey]: true },
        error: { ...prev.error, products: null },
      }));

      try {
        const response: ApiResponse<Product[]> = await getProductsByCategoryAPI(
          {
            categoryId,
            limit: currentPageSize,
            offset,
          }
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
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: { ...prev.loading, [loadingKey]: false },
          error: { ...prev.error, products: "Không thể tải sản phẩm" },
        }));
      }
    },
    [state.pagination.itemsPerPage]
  );

  // Select category and load its products
  const selectCategory = useCallback(
    (category: Category) => {
      setState((prev) => ({
        ...prev,
        selectedCategory: category,
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
      loadProducts(category._id, 0, false, 1);
    },
    [loadProducts]
  );

  // Load more products (for infinite scroll)
  const loadMoreProducts = useCallback(() => {
    if (
      state.selectedCategory &&
      state.pagination.hasMore &&
      !state.loading.loadingMore &&
      state.isInfiniteScroll
    ) {
      loadProducts(
        state.selectedCategory._id,
        state.pagination.currentOffset,
        true,
        state.pagination.currentPage
      );
    }
  }, [
    state.selectedCategory,
    state.pagination.hasMore,
    state.pagination.currentOffset,
    state.pagination.currentPage,
    state.loading.loadingMore,
    state.isInfiniteScroll,
    loadProducts,
  ]);

  // Retry functions
  const retryLoadCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  const retryLoadProducts = useCallback(() => {
    if (state.selectedCategory) {
      loadProducts(
        state.selectedCategory._id,
        0,
        false,
        state.pagination.currentPage
      );
    }
  }, [state.selectedCategory, state.pagination.currentPage, loadProducts]);

  // Change page (for pagination mode)
  const changePage = useCallback(
    (page: number) => {
      if (state.selectedCategory && !state.loading.products) {
        const offset = (page - 1) * state.pagination.itemsPerPage;
        loadProducts(
          state.selectedCategory._id,
          offset,
          false,
          page,
          state.pagination.itemsPerPage
        );
      }
    },
    [
      state.selectedCategory,
      state.loading.products,
      state.pagination.itemsPerPage,
      loadProducts,
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
      if (state.selectedCategory) {
        loadProducts(state.selectedCategory._id, 0, false, 1, pageSize);
      }
    },
    [state.selectedCategory, loadProducts]
  );

  // Toggle between infinite scroll and pagination
  const togglePaginationMode = useCallback(
    (isInfiniteScroll: boolean) => {
      setState((prev) => ({
        ...prev,
        isInfiniteScroll,
        pagination: {
          ...prev.pagination,
          currentPage: 1,
          currentOffset: 0,
        },
      }));

      // Reload products with new mode
      if (state.selectedCategory) {
        loadProducts(state.selectedCategory._id, 0, false, 1);
      }
    },
    [state.selectedCategory, loadProducts]
  );

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    ...state,
    selectCategory,
    loadMoreProducts,
    retryLoadCategories,
    retryLoadProducts,
    changePage,
    changePageSize,
    togglePaginationMode,
  };
};
