// Data Adapter System for React Cart Library
// ==========================================
// Allows library to work with different data formats from user's system

/**
 * Default CartItem interface that the library expects
 */
export const DEFAULT_CART_ITEM_SCHEMA = {
  id: "id",
  name: "name",
  price: "price",
  quantity: "quantity",
  image: "image",
  description: "description",
  category: "category",
  metadata: "metadata",
};

/**
 * Data adapter to transform user's data format to library format
 */
export class CartDataAdapter {
  constructor(fieldMapping = {}) {
    this.fieldMapping = { ...DEFAULT_CART_ITEM_SCHEMA, ...fieldMapping };
  }

  /**
   * Transform user's product data to CartItem format
   * @param {Object} userProduct - User's product object
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Object} CartItem compatible object
   */
  transformToCartItem(userProduct, quantity = 1) {
    const cartItem = {};

    // Map required fields
    cartItem.id = this.getFieldValue(userProduct, this.fieldMapping.id);
    cartItem.name = this.getFieldValue(userProduct, this.fieldMapping.name);
    cartItem.price = this.parsePrice(
      this.getFieldValue(userProduct, this.fieldMapping.price)
    );
    cartItem.quantity = quantity;

    // Map optional fields
    if (this.fieldMapping.image) {
      cartItem.image = this.getFieldValue(userProduct, this.fieldMapping.image);
    }
    if (this.fieldMapping.description) {
      cartItem.description = this.getFieldValue(
        userProduct,
        this.fieldMapping.description
      );
    }
    if (this.fieldMapping.category) {
      cartItem.category = this.getFieldValue(
        userProduct,
        this.fieldMapping.category
      );
    }

    // Preserve any extra metadata
    cartItem.metadata = {
      ...userProduct,
      originalData: userProduct,
    };

    return cartItem;
  }

  /**
   * Transform CartItem back to user's format (for API calls)
   * @param {Object} cartItem - CartItem object
   * @returns {Object} User's format object
   */
  transformFromCartItem(cartItem) {
    if (cartItem.metadata && cartItem.metadata.originalData) {
      return {
        ...cartItem.metadata.originalData,
        quantity: cartItem.quantity,
      };
    }

    // Fallback: create object in user's format
    const userProduct = {};
    Object.entries(this.fieldMapping).forEach(([libField, userField]) => {
      if (cartItem[libField] !== undefined) {
        this.setFieldValue(userProduct, userField, cartItem[libField]);
      }
    });

    return userProduct;
  }

  /**
   * Get nested field value using dot notation
   */
  getFieldValue(obj, path) {
    if (!path) return undefined;
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested field value using dot notation
   */
  setFieldValue(obj, path, value) {
    if (!path) return;
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  /**
   * Parse price from various formats
   */
  parsePrice(price) {
    if (typeof price === "number") return price;
    if (typeof price === "string") {
      // Remove currency symbols and parse
      const numStr = price.replace(/[^0-9.-]/g, "");
      return parseFloat(numStr) || 0;
    }
    return 0;
  }
}

/**
 * Common field mappings for popular e-commerce platforms
 */
export const PLATFORM_MAPPINGS = {
  // Shopify format
  shopify: {
    id: "id",
    name: "title",
    price: "variants.0.price",
    image: "images.0.src",
    description: "body_html",
    category: "product_type",
  },

  // WooCommerce format
  woocommerce: {
    id: "id",
    name: "name",
    price: "price",
    image: "images.0.src",
    description: "description",
    category: "categories.0.name",
  },

  // Magento format
  magento: {
    id: "id",
    name: "name",
    price: "price",
    image: "media_gallery_entries.0.file",
    description: "custom_attributes.description.value",
    category: "custom_attributes.category_ids.value",
  },

  // Custom API format example
  customApi: {
    id: "productId",
    name: "productName",
    price: "pricing.basePrice",
    image: "media.thumbnail.url",
    description: "details.longDescription",
    category: "categorization.primaryCategory.name",
  },

  // Database format example
  database: {
    id: "product_id",
    name: "product_name",
    price: "unit_price",
    image: "image_url",
    description: "product_description",
    category: "category_name",
  },
};

/**
 * Create adapter instance for specific platform
 */
export function createPlatformAdapter(platform) {
  const mapping = PLATFORM_MAPPINGS[platform];
  if (!mapping) {
    throw new Error(
      `Unknown platform: ${platform}. Available: ${Object.keys(
        PLATFORM_MAPPINGS
      ).join(", ")}`
    );
  }
  return new CartDataAdapter(mapping);
}

/**
 * Auto-detect data format and create appropriate adapter
 */
export function createAutoAdapter(sampleData) {
  // Try to detect format based on field names
  const fields = Object.keys(sampleData);

  // Shopify detection
  if (fields.includes("variants") && fields.includes("title")) {
    return createPlatformAdapter("shopify");
  }

  // WooCommerce detection
  if (
    fields.includes("price") &&
    fields.includes("images") &&
    sampleData.images?.[0]?.src
  ) {
    return createPlatformAdapter("woocommerce");
  }

  // Database format detection
  if (fields.some((f) => f.includes("_"))) {
    return createPlatformAdapter("database");
  }

  // Default: assume standard format
  return new CartDataAdapter();
}
