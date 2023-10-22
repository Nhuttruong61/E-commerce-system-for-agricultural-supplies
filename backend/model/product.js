const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name"],
  },
  description: {
    type: Array,
    required: [true, "Please enter your product description"],
  },
  ingredient: {
    type: Array,
    required: [true, "Please enter your product ingredient"],
  },
  category: {
    type: Object,
    required: [true, "Please select a category"],
  },
  weight: {
    type: String,
  },
  capacity: {
    type: String,
  },
  originPrice: {
    type: Number,
  },
  price: {
    type: Number,
  },
  distCount: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: [true, "Please enter quantity "],
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  origin: {
    type: String,
    required: [true, "Please enter origin"],
  },
  expirationDate: {
    type: Date,
    required: [true, "Please enter expiration date"],
  },
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  ratings: {
    type: String,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
