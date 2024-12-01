const express = require("express");
// const Product = require("../models/Product");
 const Cart = require("../models/Cart");
const router = express.Router();

// add to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const product = cart.products.find((p) => p.productId === productId);

      if (product) {
        product.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product to cart",
      error,
    });
  }
});

// Get all cart items for a user
router.get("/get/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

// Update quantity of a product in the cart
router.put("/update/:userId", async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
 

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find((p) => p.productId === productId);
    console.log()
    if (product) {
      product.quantity = quantity;
      await cart.save();
      return res.status(200).json({ message: "Quantity updated", cart });
    }

    return res.status(404).json({ message: "Product not found in cart" });
  } catch (error) {
    res.status(500).json({ message: "Error updating quantity", error });
  }
});

//remove the product in the cart

router.delete("/remove/:userId", async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  try {
    const cart = new Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = cart.products.filter((p) =>p.productId !== productId);
    await cart.save();
    res.status(500).json({  message: 'Product removed from cart', error });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error  removing Product', error });

  }
});

module.exports = router;
