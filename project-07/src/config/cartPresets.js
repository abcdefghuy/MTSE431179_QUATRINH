// Cart Configuration Presets and Constants
// ========================================

/**
 * Configuration presets for common e-commerce scenarios
 */
export const CART_CONFIG_PRESETS = {
  // E-commerce platforms
  shopify: {
    platform: "shopify",
    description: "Shopify products with variants and collections",
  },

  woocommerce: {
    platform: "woocommerce",
    description: "WooCommerce products with categories and attributes",
  },

  magento: {
    platform: "magento",
    description: "Magento products with custom attributes",
  },

  // Custom database formats
  mysql: {
    adapterConfig: {
      id: "product_id",
      name: "product_name",
      price: "unit_price",
      image: "image_url",
      description: "product_description",
      category: "category_name",
    },
    description: "Standard MySQL e-commerce schema",
  },

  postgresql: {
    adapterConfig: {
      id: "id",
      name: "product_name",
      price: "price_cents", // Will be converted to dollars
      image: "image_urls.0", // First image from array
      description: "description",
      category: "categories.name", // Nested category object
    },
    description: "PostgreSQL with JSON fields",
  },

  // API formats
  restApi: {
    adapterConfig: {
      id: "productId",
      name: "title",
      price: "pricing.retail",
      image: "images.thumbnail",
      description: "details.description",
      category: "category.displayName",
    },
    description: "REST API with nested objects",
  },

  graphql: {
    adapterConfig: {
      id: "node.id",
      name: "node.title",
      price: "node.variants.edges.0.node.price",
      image: "node.featuredImage.url",
      description: "node.description",
      category: "node.productType",
    },
    description: "GraphQL nested node structure",
  },

  // Spreadsheet/Import formats
  excel: {
    adapterConfig: {
      id: "SKU",
      name: "Product Name",
      price: "Price",
      image: "Image URL",
      description: "Description",
      category: "Category",
    },
    description: "Excel/CSV import format",
  },
};

/**
 * Validation rules for different data types
 */
export const VALIDATION_RULES = {
  required: ["id", "name", "price"],
  optional: ["image", "description", "category", "metadata"],
  types: {
    id: ["string", "number"],
    name: ["string"],
    price: ["number", "string"], // string will be parsed
    quantity: ["number"],
    image: ["string"],
    description: ["string"],
    category: ["string", "object"],
    metadata: ["object"],
  },
};

/**
 * Default configurations for common scenarios
 */
export const DEFAULT_CONFIGS = {
  storageKey: "react-cart-library",
  maxItems: 100,
  maxQuantityPerItem: 999,
  persistCart: true,
  autoSave: true,
  currency: "USD",
  locale: "en-US",
};
