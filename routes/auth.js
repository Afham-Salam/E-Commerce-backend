const express=require("express");
const User = require("../models/User");
const router=express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



// Register

router.post("/register",async(req,res)=>{

try {
    const{name,email,password}=req.body;
    const hassedPassword=await bcrypt.hash(password,8);
    const newUser= new User({name,email,password:hassedPassword})
    await newUser.save();
    res.status(201).json({message:"User registration successfully"})  
} 

catch (error) {
    res.status(500).json({"error":error.message})
}   
})


//login

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }); 
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: "Invalid credentials" }); 
      }
      const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET 
      );
      res.json({ token }); 
      
    } catch (error) {
      res.status(500).json({ error: error.message }); 
    }
  });

module.exports = router;