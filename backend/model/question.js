const mongoose = require("mongoose");

const questionShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "Prossing",
  },
  view: {
    type: Number,
    default: 0,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      content: {
        type: String,
        required: true,
      },
      author: {
        type: Object,
        required: true,
      },
      report: {
        type: Number,
        default: 0,
      },
      userReport: {
        type: Array,
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Question", questionShema);
