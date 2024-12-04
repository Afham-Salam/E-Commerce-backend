const express = require("express");
const Order=require("../models/Order")
const router = express.Router();


// Create a new order
router.post("/create", async (req, res) => {
    const {
      userId,
      products,
      totalAmount,
      paymentId,
      totalItems,
      customerName,
      address,
      city,
      state,
      pincode,
      contact
    } = req.body;
  
    try {
      const newOrder = new Order({
        userId,
        products,
        totalAmount,
        paymentId,
        totalItems,
        customerName,
        address,
        city,
        state,
        pincode,
        contact
      });
  
      await newOrder.save();
      res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Error creating order", error });
    }
  });


  // Get all orders
  router.get("/all", async (req, res) => {
    try {
      const orders = await Order.find().populate("userId").populate("products.productId");
      res.status(200).json({ message: "Orders fetched successfully", orders });
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error });
    }
  });

  //get order based on user

  router.get("/get/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userOrders = await Order.find({ userId })
        .populate("userId")
        .populate("products.productId");
  
      if (userOrders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user" });
      }
  
      res.status(200).json({ message: "Orders fetched successfully", orders: userOrders });
    } catch (error) {
      res.status(500).json({ message: "Error fetching user's orders", error });
    }
  });




  


  module.exports = router;