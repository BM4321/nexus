const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @desc Registers a new user (talent or seeker)
 * @route POST /api/auth/register
 * @access Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { email, password, role, name, location } = req.body;

    // Basic validation
    if (!email || !password || !role || !name || !location) {
      return res.status(400).json({ message: 'Please enter all required fields: email, password, role, name, and location.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }

    // Hash the password (using 10 salt rounds for security)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the new user object
    const newUser = new User({
      email,
      passwordHash,
      role,
      name,
      // NOTE: Location must be sent in GeoJSON format:
      // { type: "Point", coordinates: [longitude, latitude] }
      location, 
      isVerified: false,
    });

    // Save the user to MongoDB
    const user = await newUser.save();

    // Create a JWT for immediate login upon registration
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // Send back token and basic user info
    res.status(201).json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * @desc Authenticates a user and returns a token
 * @route POST /api/auth/login
 * @access Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password.' });
    }

    // Check for user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare the submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Issue a new JWT
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d', 
    });

    // Send back token and basic user info
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};