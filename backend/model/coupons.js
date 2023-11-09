const mongoose = require("mongoose");

const couponsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the coupon name"],
    },
    discountAmount: {
      type: Number,
      required: [true, "Please enter the discount amount"],
    },

    point: {
      type: Number,
      required: [true, "Please enter the point"],
    },
    userType: {
      type: String,
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupons", couponsSchema);
