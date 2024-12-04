const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema( 
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products", 
          required: true,
        },
      },
    ],
  },
  { timestamps: true } 

);

const Favourite = mongoose.model("Favourite", favoriteSchema);

module.exports = Favourite;
