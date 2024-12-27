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
    const cart = await Cart.findOne({ userId }).populate({
      path: 'products.productId', // Path to populate
      model: 'Product', // Referenced model
    })
    .exec();

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log({error});
    
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

    const product = cart.products.find((p) => p.productId.toString() === productId);
   
    
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
    // Find the cart for the given userId
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter the products to remove the one with the given productId
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );

    console.log(cart.products); // Debugging line to see if the products are being filtered

    // Save the updated cart
    await cart.save();

    // Return success response
    res.status(200).json({ message: 'Product removed from cart' });

  } catch (error) {
    console.error("Error removing product from cart:", error); // Log the error for debugging
    res.status(500).json({ message: "Error removing product from cart", error: error.message });
  }
});




// Increment Quantity
router.put("/increment/:userId", async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Increment the product quantity
    cart.products[productIndex].quantity += 1;

    // Save the updated cart
    await cart.save();
    res.status(200).json({ message: "Product quantity incremented" });

  } catch (error) {
    console.error("Error incrementing product quantity:", error);
    res.status(500).json({ message: "Error incrementing product quantity", error: error.message });
  }
});

// Decrement Quantity
router.put("/decrement/:userId", async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Decrement the product quantity but ensure it doesn't go below 1
    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
    } else {
      return res.status(400).json({ message: "Quantity cannot go below 1" });
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json({ message: "Product quantity decremented" });

  } catch (error) {
    console.error("Error decrementing product quantity:", error);
    res.status(500).json({ message: "Error decrementing product quantity", error: error.message });
  }
});


module.exports = router;
