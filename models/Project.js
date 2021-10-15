const { Schema, model } = require("mongoose");

const project = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  company: {
    type: String,
  },
  status: {
    type: Object,
    required: true,
  },
  leader: {
    type: String,
  },
  works: [
    {
      worker: {
        type: Schema.Types.ObjectId,
        ref: "worker",
      },
      payment: Object,
    },
  ],
  totalPayment: {
    type: Number,
    required: true,
  },
  clientName: {
    type: String,
  },
  clientNumber: {
    type: Number,
  },
  telegram: {
    type: String,
  },
  clientLocation: {
    type: String,
  },
  deadline: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  progress: Number,
});

module.exports = model("project", project);
