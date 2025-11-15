const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const Chat = require('../models/Chat');

// Get all chats for user
router.get('/chats', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Get chats route hit!');
    
    const chats = await Chat.find({ 
      participants: req.user.id 
    })
    .populate('participants', 'name email')
    .sort({ lastMessageTime: -1 });
    
    console.log(`Found ${chats.length} chats`);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
});

// Get messages for specific chat
router.get('/chats/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Get chat messages route hit!');
    
    if (req.params.chatId === 'undefined') {
      return res.status(400).json({ message: 'Invalid chat ID' });
    }
    
    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'name email');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    res.json(chat.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Send message
router.post('/chats/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    console.log('✅ Send message route hit!');
    
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    const newMessage = {
      sender: req.user.id,
      text: req.body.text,
      timestamp: new Date()
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = req.body.text;
    chat.lastMessageTime = new Date();
    
    await chat.save();
    
    res.json({ 
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

module.exports = router;