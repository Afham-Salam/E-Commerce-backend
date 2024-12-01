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









//edit order

  router.put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const {
      products,
      totalAmount,
      totalItems,
      customerName,
      address,
      city,
      state,
      pincode,
      contact
    } = req.body;
  
    try {
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      order.products = products || order.products;
      order.totalAmount = totalAmount || order.totalAmount;
      order.totalItems = totalItems || order.totalItems;
      order.customerName = customerName || order.customerName;
      order.address = address || order.address;
      order.city = city || order.city;
      order.state = state || order.state;
      order.pincode = pincode || order.pincode;
      order.contact = contact || order.contact;
  
      await order.save();
      res.status(200).json({ message: "Order updated successfully", order });
    } catch (error) {
      res.status(500).json({ message: "Error updating order", error });
    }
  });
  

 


  //delete order

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await Order.findByIdAndDelete(id);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error });
    }
  });