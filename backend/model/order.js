const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    cart: {
      type: Array,
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Processing",
    },
    iscomment: {
      type: Boolean,
      default: false,
    },
    paymentInfo: {
      id: {
        type: String,
      },
      status: {
        type: String,
      },
      type: {
        type: String,
      },
      paidAt: {
        type: Date,
        default: Date.now(),
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
