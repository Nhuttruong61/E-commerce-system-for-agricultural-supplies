const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    product: {
      type: Object,
      required: true,
    },
    originPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please enter quantity "],
    },
    sold_out: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Receipt", receiptSchema);
