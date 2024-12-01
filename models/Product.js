const mongoose = require("mongoose");

const productScheme =new mongoose.Schema({
    name: {
      require: true,
      type: String,
    },
    category: {
      required: true,
      type: String,
    },
    price: {
      required: true,
      type: Number,
    },
    stock: {
      required: true,
      type: Number,
    },
    images: {
      type: [String],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  });
 const Product=mongoose.model("Product",productScheme)
 module.exports = Product;
