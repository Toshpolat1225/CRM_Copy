const { Schema, model } = require("mongoose");

const expense = new Schema({
  teacher: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: true,
  },
  student: {
    type: String,
    required: true,
  },
  description: String,
  payment: {
    type: Number,
    required: true,
  },
  date: Number,
  time: String,
});

module.exports = model("expense", expense);
