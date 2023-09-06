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
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
});

module.exports = mongoose.model("Question", questionShema);
