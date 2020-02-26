const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  accountBalance: {
    type: Number,
    default: 5000
  },
  transactions: {
    type: Array
  },
  history: {
    type: Array
  },
  cash:{
    type: Number,
    default: 0
  }
});
module.exports = User = mongoose.model("users", UserSchema);