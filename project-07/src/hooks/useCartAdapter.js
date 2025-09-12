// Data Transformation Hooks
// =========================
// Custom hooks to help users integrate their data with the cart library

import { useCallback, useMemo } from "react";
import { useCart } from "../context/CartContext.jsx";
import {
  CartDataAdapter,
  createPlatformAdapter,
  createAutoAdapter,
} from "../adapters/CartDataAdapter.js";

/**
 * Hook to create and use a data adapter
 * @param {string|Object} adapterConfig - Platform name or custom field mapping
 * @returns {Object} Adapter functions
 */
export function useCartAdapter(adapterConfig = {}) {
  const { addItem, items } = useCart();

  const adapter = useMemo(() => {
    if (typeof adapterConfig === "string") {
      return createPlatformAdapter(adapterConfig);
    } else if (typeof adapterConfig === "object") {
      return new CartDataAdapter(adapterConfig);
    }
    return new CartDataAdapter();
  }, [adapterConfig]);

  // Add item using user's data format
  const addUserItem = useCallback(
    (userProduct, quantity = 1) => {
      const cartItem = adapter.transformToCartItem(userProduct, quantity);
      addItem(cartItem);
      return cartItem;
    },
    [adapter, addItem]
  );

  // Add multiple items at once
  const addUserItems = useCallback(
    (userProducts) => {
      const cartItems = userProducts.map((product) =>
        adapter.transformToCartItem(
          product.data || product,
          product.quantity || 1
        )
      );
      cartItems.forEach((item) => addItem(item));
      return cartItems;
    },
    [adapter, addItem]
  );

  // Get cart items in user's original format
  const getUserItems = useCallback(() => {
    return items.map((cartItem) => adapter.transformFromCartItem(cartItem));
  }, [adapter, items]);

  // Check if user's product is in cart
  const hasUserItem = useCallback(
    (userProduct) => {
      const cartItem = adapter.transformToCartItem(userProduct);
      return items.some((item) => item.id === cartItem.id);
    },
    [adapter, items]
  );

  // Get quantity of user's product in cart
  const getUserItemQuantity = useCallback(
    (userProduct) => {
      const cartItem = adapter.transformToCartItem(userProduct);
      const existingItem = items.find((item) => item.id === cartItem.id);
      return existingItem ? existingItem.quantity : 0;
    },
    [adapter, items]
  );

  return {
    addUserItem,
    addUserItems,
    getUserItems,
    hasUserItem,
    getUserItemQuantity,
    adapter,
  };
}

/**
 * Hook for auto-detecting data format and creating adapter
 * @param {Object} sampleData - Sample product data to analyze
 * @returns {Object} Auto-configured adapter functions
 */
export function useAutoAdapter(sampleData) {
  const adapter = useMemo(() => {
    if (!sampleData) return new CartDataAdapter();
    return createAutoAdapter(sampleData);
  }, [sampleData]);

  return useCartAdapter(adapter.fieldMapping);
}

/**
 * Hook for API integration
 * @param {Function} fetchFunction - Function to fetch products from API
 * @param {string|Object} adapterConfig - Adapter configuration
 * @returns {Object} API integration functions
 */
export function useCartAPI(fetchFunction, adapterConfig = {}) {
  const { addUserItem, adapter } = useCartAdapter(adapterConfig);

  // Add item by ID (fetch from API)
  const addItemById = useCallback(
    async (productId, quantity = 1) => {
      try {
        const userProduct = await fetchFunction(productId);
        return addUserItem(userProduct, quantity);
      } catch (error) {
        console.error("Failed to fetch and add item:", error);
        throw error;
      }
    },
    [fetchFunction, addUserItem]
  );

  // Add multiple items by IDs
  const addItemsByIds = useCallback(
    async (productIds) => {
      try {
        const promises = productIds.map((id) =>
          typeof id === "object"
            ? fetchFunction(id.id).then((product) => ({
                ...product,
                quantity: id.quantity || 1,
              }))
            : fetchFunction(id).then((product) => ({ ...product, quantity: 1 }))
        );
        const userProducts = await Promise.all(promises);
        return userProducts.map((product) =>
          addUserItem(product, product.quantity)
        );
      } catch (error) {
        console.error("Failed to fetch and add items:", error);
        throw error;
      }
    },
    [fetchFunction, addUserItem]
  );

  return {
    addItemById,
    addItemsByIds,
    adapter,
  };
}

/**
 * Hook for working with form data (e.g., custom product builder)
 * @param {Object} fieldMapping - Custom field mapping for form
 * @returns {Object} Form integration functions
 */
export function useCartForm(fieldMapping = {}) {
  const { addUserItem } = useCartAdapter(fieldMapping);

  // Create cart item from form data
  const createFromForm = useCallback(
    (formData, quantity = 1) => {
      // Convert FormData to object if needed
      const productData =
        formData instanceof FormData
          ? Object.fromEntries(formData.entries())
          : formData;

      return addUserItem(productData, quantity);
    },
    [addUserItem]
  );

  // Validate form data before adding
  const validateAndAdd = useCallback(
    (formData, validator, quantity = 1) => {
      const errors = validator(formData);
      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(", ")}`);
      }
      return createFromForm(formData, quantity);
    },
    [createFromForm]
  );

  return {
    createFromForm,
    validateAndAdd,
  };
}

/**
 * Hook for bulk operations (e.g., import from CSV, Excel)
 * @param {string|Object} adapterConfig - Adapter configuration
 * @returns {Object} Bulk operation functions
 */
export function useCartBulk(adapterConfig = {}) {
  const { addUserItems } = useCartAdapter(adapterConfig);

  // Import from array of products
  const importProducts = useCallback(
    (products) => {
      return addUserItems(products);
    },
    [addUserItems]
  );

  // Import from CSV string
  const importFromCSV = useCallback(
    (csvString, headerMapping = {}) => {
      const lines = csvString.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      const products = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const product = {};

        headers.forEach((header, index) => {
          const mappedField = headerMapping[header] || header;
          product[mappedField] = values[index];
        });

        return product;
      });

      return importProducts(products);
    },
    [importProducts]
  );

  // Import from JSON array
  const importFromJSON = useCallback(
    (jsonString) => {
      try {
        const products = JSON.parse(jsonString);
        if (!Array.isArray(products)) {
          throw new Error("JSON must be an array of products");
        }
        return importProducts(products);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        throw error;
      }
    },
    [importProducts]
  );

  return {
    importProducts,
    importFromCSV,
    importFromJSON,
  };
}
