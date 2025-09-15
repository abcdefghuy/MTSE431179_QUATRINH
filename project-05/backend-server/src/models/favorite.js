const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one favorite per user per product
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Index for user's favorites list
favoriteSchema.index({ userId: 1, createdAt: -1 });

// Index for product popularity
favoriteSchema.index({ productId: 1 });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
