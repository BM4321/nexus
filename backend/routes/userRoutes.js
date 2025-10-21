const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth'); // Import the new middleware

// TSD Endpoint: /api/users/:id (GET) - Fetch public user profile. PUBLIC access
router.get('/:id', userController.getUserProfile);

// TSD Endpoint: /api/users/profile (PUT) - Update the logged-in user's profile. AUTH access
// NOTE: The 'protect' middleware runs FIRST, ensuring a valid token is present.
router.put('/profile', protect, userController.updateUserProfile); 

module.exports = router;