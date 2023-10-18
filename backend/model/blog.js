const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: [true, "Please enter heading description"],
  },
  description: {
    type: Array,
    required: [true, "Please enter description"],
  },
  images: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title name"],
  },
  content: [contentSchema],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Blog", blogSchema);
