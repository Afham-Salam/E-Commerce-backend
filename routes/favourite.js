const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User.js");
const Favorite = require("../models/Favourite.js");
const Products = require("../models/Product.js");

// Add to favorite
router.post("/add/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, message: "Invalid product ID" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const product = await Products.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    let favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      favorite = new Favorite({
        userId,
        products: [{ productId }],
      });
    } else {
      const exists = favorite.products.find(
        (product) => product.productId.toString() === productId
      );
      if (exists)
        return res.status(400).json({ success: false, message: "Product already in favorites" });

      favorite.products.push({ productId });
    }

    await favorite.save();
    res.status(200).json({ success: true, data: favorite, message: "Product added to favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
  }
});

// Get favorites for a user
router.get("/getfavourite/:id", async (req, res) => {

  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ success: false, message: "Invalid user ID" });

    const favorite = await Favorite.findOne({ userId }).populate("products.productId");
    if (!favorite)
      return res.status(404).json({ success: false, message: "Favorites not found" });

    res.status(200).json({ success: true, data: favorite, message: "Favorites fetched successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
  }
});

// Remove product from favorites
router.delete("/remove/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;


    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ success: false, message: "Invalid product ID" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const favorite = await Favorite.findOne({ userId });
    if (!favorite)
      return res.status(404).json({ success: false, message: "Favorites not found" });

    const productIndex = favorite.products.findIndex(
      (product) => product.productId.toString() === productId
    );
    if (productIndex === -1)
      return res.status(404).json({ success: false, message: "Product not found in favorites" });

    favorite.products.splice(productIndex, 1);
    await favorite.save();

    res.status(200).json({
      success: true,
      data: favorite.products,
      message: "Product removed from favorites successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
  }
});

module.exports = router;
