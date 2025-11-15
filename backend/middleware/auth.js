const jwt = require('jsonwebtoken');
require('dotenv').config(); // Add this line!

const JWT_SECRET = process.env.JWT_SECRET; // Use .env secret

const authenticateToken = (req, res, next) => {
  console.log('🔐 Auth middleware called');
  console.log('Using JWT_SECRET from .env:', JWT_SECRET ? 'Found' : 'Missing');
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Token received:', token ? 'Yes' : 'No');

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(403).json({ 
        message: 'Invalid or expired token',
        error: err.message 
      });
    }

    console.log('✅ Token verified for user:', user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;