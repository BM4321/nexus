const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.post('/profile', authenticateToken, (req, res) => {
  console.log('✅ Profile route hit!');
  console.log('User from token:', req.user);
  console.log('Profile data received:', req.body);
  
  // Here you would normally save to database
  res.json({ 
    message: 'Profile updated successfully',
    data: req.body 
  });
});

router.get('/profile', authenticateToken, (req, res) => {
  console.log('✅ Get profile route hit!');
  console.log('User:', req.user);
  
  // Here you would fetch from database
  res.json({ 
    message: 'Profile retrieved',
    profile: {
      fullName: 'John Doe',
      email: req.user.email,
      phone: '+1234567890'
    }
  });
});

module.exports = router;