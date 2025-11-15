const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/auth');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  try {
    console.log('✅ Register route hit!');
    console.log('Registration data:', req.body);
    
    const { email, password, username, role } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = new User({
      email,
      password: hashedPassword,
      name: username || '',
      role: role || 'talent'
    });
    
    await newUser.save();
    console.log('✅ User saved to database!');
    
    // Create token
    const token = jwt.sign(
      { 
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      message: 'Registration successful',
      token,
      user: { 
        id: newUser._id,
        email: newUser.email, 
        name: newUser.name,
        role: newUser.role 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('✅ Login route hit!');
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login successful!');
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user._id,
        email: user.email, 
        name: user.name,
        role: user.role 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/verify', authenticateToken, (req, res) => {
  console.log('✅ Verify route hit!');
  
  res.json({ 
    user: req.user,
    message: 'Token is valid' 
  });
});

module.exports = router;