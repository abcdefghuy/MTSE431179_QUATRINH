import React, { createContext, useContext, useReducer, useEffect } from "react";

// Cart action types
export const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  UPDATE_ITEM: "UPDATE_ITEM",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + (action.payload.quantity || 1),
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload, quantity: action.payload.quantity || 1 },
        ],
      };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || [],
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({
  children,
  persistToLocalStorage = true,
  localStorageKey = "cart-items",
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (persistToLocalStorage) {
      try {
        const savedCart = localStorage.getItem(localStorageKey);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
        }
      } catch (error) {
        console.warn("Failed to load cart from localStorage:", error);
      }
    }
  }, [persistToLocalStorage, localStorageKey]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (persistToLocalStorage) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(state.items));
      } catch (error) {
        console.warn("Failed to save cart to localStorage:", error);
      }
    }
  }, [state.items, persistToLocalStorage, localStorageKey]);

  // Cart actions
  const addItem = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: itemId, quantity },
    });
  };

  const updateItem = (itemId, updates) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_ITEM,
      payload: { id: itemId, updates },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Computed values
  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = state.items.length;

  const contextValue = {
    // State
    items: state.items,
    totalItems,
    totalPrice,
    itemCount,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    updateItem,
    clearCart,

    // Utils
    getItem: (itemId) => state.items.find((item) => item.id === itemId),
    hasItem: (itemId) => state.items.some((item) => item.id === itemId),
    isEmpty: state.items.length === 0,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
