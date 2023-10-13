const mongoose = require("mongoose");

const transportFeeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  freeShipping: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("TransportFee", transportFeeSchema);
