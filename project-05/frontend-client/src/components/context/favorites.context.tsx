import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { AuthContext } from "./auth.context";
import { getUserFavoritesAPI } from "../../util/api";
import type { Favorite } from "../../types/product.types";

interface FavoritesContextType {
  favorites: Favorite[];
  favoritesCount: number;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
  addToFavoritesLocal: (favorite: Favorite) => void;
  removeFromFavoritesLocal: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  favoritesCount: 0,
  loading: false,
  refreshFavorites: async () => {},
  addToFavoritesLocal: () => {},
  removeFromFavoritesLocal: () => {},
});

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const { authState } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!authState.isAuthenticated) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getUserFavoritesAPI();
      setFavorites(response.data);
    } catch (error) {
      console.log("Error fetching favorites:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated]);

  const addToFavoritesLocal = useCallback((favorite: Favorite) => {
    setFavorites((prev) => [favorite, ...prev]);
  }, []);

  const removeFromFavoritesLocal = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.product._id !== productId));
  }, []);

  // Refresh favorites when auth state changes
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const value: FavoritesContextType = {
    favorites,
    favoritesCount: favorites.length,
    loading,
    refreshFavorites,
    addToFavoritesLocal,
    removeFromFavoritesLocal,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavoritesContext must be used within a FavoritesProvider"
    );
  }
  return context;
};

export default FavoritesContext;
