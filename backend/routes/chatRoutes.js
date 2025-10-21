const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// TSD Endpoint: /api/chats/start (POST)
router.post('/start', protect, chatController.startChat);

// TSD Endpoint: /api/chats/:threadId/messages (GET)
router.get('/:threadId/messages', protect, chatController.getMessages);

module.exports = router;