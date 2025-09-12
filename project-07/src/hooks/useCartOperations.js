import { useCallback } from "react";
import { useCart } from "../context/CartContext";

export const useCartOperations = () => {
  const cart = useCart();

  // Add item with validation
  const addItemToCart = useCallback(
    (item) => {
      if (!item.id) {
        throw new Error("Item must have an id");
      }
      if (!item.name) {
        throw new Error("Item must have a name");
      }
      if (!item.price || item.price < 0) {
        throw new Error("Item must have a valid price");
      }

      const cartItem = {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity) || 1,
        description: item.description || "",
        image: item.image || null,
        ...item,
      };

      cart.addItem(cartItem);
      return cartItem;
    },
    [cart]
  );

  // Remove item with confirmation
  const removeItemFromCart = useCallback(
    (itemId, skipConfirmation = false) => {
      if (!skipConfirmation) {
        const confirmed = window.confirm(
          "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?"
        );
        if (!confirmed) {
          return false;
        }
      }

      cart.removeItem(itemId);
      return true;
    },
    [cart]
  );

  // Update quantity with validation
  const updateItemQuantity = useCallback(
    (itemId, quantity) => {
      const parsedQuantity = parseInt(quantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        throw new Error("Quantity must be a positive number");
      }

      cart.updateQuantity(itemId, parsedQuantity);
    },
    [cart]
  );

  // Update item details
  const updateItemDetails = useCallback(
    (itemId, updates) => {
      if (
        updates.price !== undefined &&
        (isNaN(updates.price) || updates.price < 0)
      ) {
        throw new Error("Price must be a valid positive number");
      }

      if (updates.quantity !== undefined) {
        const parsedQuantity = parseInt(updates.quantity);
        if (isNaN(parsedQuantity) || parsedQuantity < 1) {
          throw new Error("Quantity must be a positive number");
        }
        updates.quantity = parsedQuantity;
      }

      if (updates.price !== undefined) {
        updates.price = parseFloat(updates.price);
      }

      cart.updateItem(itemId, updates);
    },
    [cart]
  );

  // Clear cart with confirmation
  const clearCartWithConfirmation = useCallback(
    (skipConfirmation = false) => {
      if (!skipConfirmation && cart.itemCount > 0) {
        const confirmed = window.confirm(
          "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?"
        );
        if (!confirmed) {
          return false;
        }
      }

      cart.clearCart();
      return true;
    },
    [cart]
  );

  // Calculate discounted total
  const calculateDiscountedTotal = useCallback(
    (discountPercent = 0) => {
      const discount = Math.max(0, Math.min(100, discountPercent));
      return cart.totalPrice * (1 - discount / 100);
    },
    [cart.totalPrice]
  );

  // Get cart summary
  const getCartSummary = useCallback(() => {
    return {
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: cart.totalPrice,
      itemCount: cart.itemCount,
      isEmpty: cart.isEmpty,
      averageItemPrice:
        cart.itemCount > 0 ? cart.totalPrice / cart.totalItems : 0,
    };
  }, [cart]);

  // Bulk operations
  const addMultipleItems = useCallback(
    (items) => {
      const results = [];
      const errors = [];

      items.forEach((item, index) => {
        try {
          const addedItem = addItemToCart(item);
          results.push(addedItem);
        } catch (error) {
          errors.push({ index, item, error: error.message });
        }
      });

      return { results, errors };
    },
    [addItemToCart]
  );

  return {
    // Basic operations
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    updateQuantity: updateItemQuantity,
    updateItem: updateItemDetails,
    clearCart: clearCartWithConfirmation,

    // Bulk operations
    addMultipleItems,

    // Calculations
    calculateDiscountedTotal,
    getCartSummary,

    // Direct access to cart state and methods
    ...cart,
  };
};

export default useCartOperations;
