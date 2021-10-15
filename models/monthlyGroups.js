const { Schema, model } = require("mongoose");


const monthlyGroups = new Schema({
    archive: Array,
    date: {
      type:Date,
      default: new Date(Date.now()).getTime()
    }
  })

  
  module.exports = model("monthlyGroups", monthlyGroups);
