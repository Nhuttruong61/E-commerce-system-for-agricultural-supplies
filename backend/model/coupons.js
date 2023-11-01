const mongoose = require("mongoose");

const couponsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the coupon name"],
    },
    code: {
      type: String,
      required: [true, "Please enter the coupon code"],
      unique: true,
    },
    discountAmount: {
      type: Number,
      required: [true, "Please enter the discount amount"],
    },

    point: {
      type: Number,
      required: [true, "Please enter the point"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupons", couponsSchema);
