const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
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

// Indexes for performance
commentSchema.index({ productId: 1, isActive: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });
commentSchema.index({ productId: 1, rating: -1 });

// Update timestamp on save
commentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Populate user info by default
commentSchema.pre(/^find/, function (next) {
  this.populate("userId", "name email");
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
