import React, { createContext, useContext, ReactNode } from "react";
import { useProductSearch } from "../../hooks/useProductSearch";
import type {
  Category,
  Product,
  SearchFilters,
} from "../../types/product.types";

interface SearchContextType {
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
  updateFilters: (filters: SearchFilters) => void;
  searchProducts: () => void;
  loadMoreProducts: () => void;
  changePage: (page: number) => void;
  changePageSize: (pageSize: number) => void;
  clearFilters: () => void;
  retryLoadCategories: () => void;
  retrySearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const searchState = useProductSearch();

  return (
    <SearchContext.Provider value={searchState}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
