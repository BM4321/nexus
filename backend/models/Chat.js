const mongoose = require('mongoose');

// Define the structure for an individual message within the chat thread
const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Define the main Chat Thread Schema
const ChatSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId], // Array of two User IDs
    ref: 'User',
    required: true,
    validate: [arrayLimit, '{PATH} must contain exactly 2 participants.'],
  },
  listingRef: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Listing being discussed
    ref: 'Listing',
    required: true,
  },
  messages: [MessageSchema], // Array of embedded Message objects
  status: {
    type: String,
    required: true,
    enum: ['open', 'agreed', 'closed'],
    default: 'open',
  },
}, { timestamps: true });

// Custom validator to ensure exactly two participants
function arrayLimit(val) {
  return val.length === 2;
}

// Ensure participants combination is unique (only one thread per Listing between two users)
ChatSchema.index({ participants: 1, listingRef: 1 }, { unique: true });

module.exports = mongoose.model('Chat', ChatSchema);