const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled", "refunded"],
    default: "pending",
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "bank_transfer", "cash"],
    default: "credit_card",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Indexes for performance and queries
purchaseSchema.index({ productId: 1, status: 1 });
purchaseSchema.index({ userId: 1, createdAt: -1 });
purchaseSchema.index({ orderId: 1 });
purchaseSchema.index({ createdAt: -1 });

// Populate product and user info
purchaseSchema.pre(/^find/, function (next) {
  this.populate("productId", "name price category").populate(
    "userId",
    "name email"
  );
  next();
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
