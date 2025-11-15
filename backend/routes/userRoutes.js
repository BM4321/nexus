const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/users/profile', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Get user profile route hit!');
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/users/profile', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Update user profile route hit!');
    console.log('Update data:', req.body);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name: req.body.name,
        phone: req.body.phone,
        bio: req.body.bio,
        skills: req.body.skills
      },
      { new: true }
    ).select('-password');
    
    console.log('✅ Profile saved to database!');
    
    res.json({ 
      message: 'Profile updated successfully',
      profile: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;