const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// TSD Endpoint: /api/auth/register (POST)
router.post('/register', authController.registerUser);

// TSD Endpoint: /api/auth/login (POST)
router.post('/login', authController.loginUser);

module.exports = router;