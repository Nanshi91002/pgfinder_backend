const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pgSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, default: "" },
  price:{type:Number,required:true},
  sharing:{
    type:String,
    enum:["Single","Double","Triple"],
    required:true
  },
  facilities:[{type:String}]
});

module.exports = mongoose.model("pgs", pgSchema);