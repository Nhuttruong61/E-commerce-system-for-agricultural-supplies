const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password!"],
    minLength: [4, "Password should be greater than 4 characters"],
    select: false,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  tax: {
    type: String,
  },
  giftPoints: {
    type: Number,
    default: 0,
  },
  voucher: {
    type: Array,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  addresses: [
    {
      city: {
        type: String,
      },
      address: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  cart: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

module.exports = mongoose.model("User", userSchema);
