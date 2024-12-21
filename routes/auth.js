const express=require("express");
const User = require("../models/User");
const router=express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// Register

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists. Please login instead." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Create and save the new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    // Send success response
    res.status(201).json({
      success: true,
      message: "User registration successful.",
      user: userResponse,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
    });
  }
});



//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token with an expiration time
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    res.json({
      message:"Login Successfully",
      token: token,
      user: {
        name:user._id,
        name: user.name,
        email: user.email,  
        role: user.role,    
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;