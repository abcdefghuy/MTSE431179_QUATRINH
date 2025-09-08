require("dotenv").config();

const elasticsearchConfig = {
  // Connection config
  connection: {
    node:
      process.env.ELASTIC_URL ||
      process.env.ELASTICSEARCH_URL ||
      "http://localhost:9200",

    auth: process.env.ELASTIC_API_KEY
      ? {
          apiKey: process.env.ELASTIC_API_KEY,
        }
      : process.env.ELASTICSEARCH_AUTH
      ? {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        }
      : undefined,

    requestTimeout: 30000,
    pingTimeout: 3000,
    maxRetries: 3,
  },

  // Index config
  indices: {
    products: "products",
  },

  // Mappings config
  mappings: {
    products: {
      properties: {
        name: {
          type: "text",
          fields: {
            keyword: { type: "keyword" },
            suggest: { type: "completion" },
          },
        },
        description: { type: "text" },
        price: { type: "double" },
        category: {
          type: "object",
          properties: {
            _id: { type: "keyword" },
            name: {
              type: "text",
              fields: { keyword: { type: "keyword" } },
            },
          },
        },
        stock: { type: "integer" },
        rating: { type: "float" },
        reviewCount: { type: "integer" },
        imageUrl: { type: "keyword" },
        isActive: { type: "boolean" },
        tags: { type: "keyword" },
        brand: { type: "keyword" },
        discount: {
          type: "object",
          properties: {
            percentage: { type: "float" },
            isActive: { type: "boolean" },
            startDate: { type: "date" },
            endDate: { type: "date" },
          },
        },
        createdAt: { type: "date" },
        updatedAt: { type: "date" },
      },
    },
  },

  // Settings config
  settings: {
    analysis: {
      analyzer: {
        product_analyzer: {
          tokenizer: "standard",
          filter: ["lowercase", "asciifolding", "stop"],
        },
      },
    },
  },
};

module.exports = elasticsearchConfig;
