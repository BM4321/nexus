const jwt = require('jsonwebtoken');

// Get JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * @desc Middleware to protect routes and ensure user is authenticated
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Callback function to proceed to the next middleware or controller
 */
const protect = (req, res, next) => {
  let token;

  // 1. Check for token in the Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split "Bearer <token>" and take the token part)
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 3. Attach the user data to the request object (excluding the password hash)
      // This allows controllers to know who the user is without querying the DB every time
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      // 4. Proceed to the next function (the controller)
      next();
    } catch (error) {
      // Token is invalid (e.g., expired or bad signature)
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  }

  // If no token is found in the header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };