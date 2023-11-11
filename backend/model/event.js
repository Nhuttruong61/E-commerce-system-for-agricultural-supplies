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

  discount: {
    type: Number,
  },
  product: {
    type: Array,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
