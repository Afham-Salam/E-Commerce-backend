
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true, 
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Cart",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order",
  },
}, 

{
  timestamps: true, 
});


const User = mongoose.model("User", userSchema);

module.exports = User;
