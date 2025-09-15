const mongoose = require("mongoose");

const viewHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false, // Allow anonymous views
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  sessionId: {
    type: String,
    required: false, // For anonymous users
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  viewDuration: {
    type: Number, // seconds spent viewing
    default: 0,
  },
  source: {
    type: String,
    enum: ["search", "category", "recommendation", "direct", "external"],
    default: "direct",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
viewHistorySchema.index({ productId: 1, createdAt: -1 });
viewHistorySchema.index({ userId: 1, createdAt: -1 });
viewHistorySchema.index({ sessionId: 1, createdAt: -1 });
viewHistorySchema.index({ createdAt: -1 }); // For analytics

// TTL index to automatically delete old view records (after 90 days)
viewHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Populate product info
viewHistorySchema.pre(/^find/, function (next) {
  this.populate("productId", "name price category imageUrl rating reviewCount");
  next();
});

const ViewHistory = mongoose.model("ViewHistory", viewHistorySchema);

module.exports = ViewHistory;
