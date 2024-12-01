
const mongoose = require("mongoose");


const favoriteScheme = new mongoose.Scheme({
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
  { Timestamp: true }
);

