const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description"],
  },
  category: {
    type: String,
    required: [true, "Please enter your product category"],
  },
  tags: {
    type: String,
  },
  originPrice: {
    type: Number,
  },
  distCount: {
    type: Number,
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
  rating: {
    type: Number,
  },
//   shopId: {
//     type: Object,
//     required: true,
//   },
//   shop: {
//     type: Object,
//     required: true,
//   },
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
