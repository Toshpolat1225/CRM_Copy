const { Schema, model } = require("mongoose");

const income = new Schema({
  description: {
    type: String,
    required: true,
  },
  payment: {
    type: Number,
    required: true,
  },
  date: Number,
  time: String,
});

module.exports = model("income", income);
