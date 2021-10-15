const { Schema, model } = require("mongoose");

const workerSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
  },
  job: {
    type: String,
  },
  about: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
  },
  education: {
    type: String,
  },
  skills: {
    type: String,
  },
  notes: {
    type: String,
  },
  avatar: {
    type: String,
    default: "default.png",
  },
  telegram: {
    type: String,
  },
  status: {
    type: String,
    default: "Worker",
    required: true,
  },
});

module.exports = model("worker", workerSchema);
