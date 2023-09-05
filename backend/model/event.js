const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please enter your event name"],
  },
  description: {
    type: String,
    require: [true, "Please enter your event description"],
  },
  categories: {
    type: String,
    require: [true, "Please enter your event categories"],
  },
  start: {
    type: Date,
    require: [true, "Please enter your event start"],
  },
  finish: {
    type: Date,
    require: [true, "Please enter your event finish"],
  },
  status: {
    type: String,
    default: "running",
  },
  tags: {
    type: String,
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    required: [true, "Please enter your event product price!"],
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
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
