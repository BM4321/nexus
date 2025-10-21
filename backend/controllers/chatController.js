const Chat = require('../models/Chat');
const User = require('../models/User');

/**
 * @desc Start a new chat thread between two users for a specific listing
 * @route POST /api/chats/start
 * @access Private (Requires JWT)
 */
exports.startChat = async (req, res) => {
  try {
    const senderId = req.user.id; // Logged-in user
    const { receiverId, listingRef } = req.body;

    if (!receiverId || !listingRef) {
      return res.status(400).json({ message: 'Receiver ID and Listing ID are required.' });
    }

    if (senderId.toString() === receiverId) {
        return res.status(400).json({ message: 'Cannot start a chat with yourself.' });
    }

    // Check if a thread already exists for this pair on this listing
    let chat = await Chat.findOne({
      listingRef,
      participants: { $all: [senderId, receiverId] },
    });

    if (chat) {
      // Thread exists, return it
      return res.status(200).json(chat);
    }

    // Create a new thread
    chat = new Chat({
      participants: [senderId, receiverId],
      listingRef,
    });

    await chat.save();
    res.status(201).json(chat);

  } catch (error) {
    console.error('Start Chat Error:', error);
    res.status(500).json({ message: 'Server error starting chat.' });
  }
};

/**
 * @desc Fetch message history for a thread
 * @route GET /api/chats/:threadId/messages
 * @access Private (Requires JWT)
 */
exports.getMessages = async (req, res) => {
  try {
    const threadId = req.params.threadId;
    const userId = req.user.id; // Current user

    const chat = await Chat.findById(threadId)
      .select('messages participants listingRef status')
      .populate('listingRef', 'title');

    if (!chat) {
      return res.status(404).json({ message: 'Chat thread not found.' });
    }

    // Security check: Ensure the user is one of the participants
    const isParticipant = chat.participants.some(p => p.toString() === userId.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'Forbidden. You are not a participant in this chat.' });
    }

    // Return the chat object, which includes the embedded messages array
    res.status(200).json(chat);

  } catch (error) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ message: 'Server error fetching messages.' });
  }
};