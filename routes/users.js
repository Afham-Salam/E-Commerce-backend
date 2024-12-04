var express = require('express');
const User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/all', async function (req, res) {
  
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

//current user

router.get('/me', async function (req, res) {
  try {
    const users = await User.findById(req.user.userId); 
    if (!users) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: users.name,
      email: users.email,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});


module.exports = router;
