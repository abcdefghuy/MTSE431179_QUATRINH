const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  purchaseCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  favoriteCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  brand: {
    type: String,
    trim: true,
    default: "",
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ purchaseCount: -1 });
productSchema.index({ viewCount: -1 });
productSchema.index({ favoriteCount: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ createdAt: -1 });

// Compound indexes for recommendations
productSchema.index({ category: 1, rating: -1, purchaseCount: -1 });
productSchema.index({ tags: 1, rating: -1 });

// Update timestamp on save
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
