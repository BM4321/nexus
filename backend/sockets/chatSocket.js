const Chat = require('../models/Chat');
const jwt = require('jsonwebtoken'); // To authenticate the socket connection

// Get JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET; 

module.exports = (io) => {
    // Middleware for socket authentication (protecting the real-time connection)
    io.use(async (socket, next) => {
        // The client must send the JWT token in the connection query
        const token = socket.handshake.query.token; 
        
        if (!token) {
            return next(new Error('Authentication error: No token provided.'));
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            // Attach the user info to the socket for later use
            socket.user = { id: decoded.id, role: decoded.role }; 
            next();
        } catch (err) {
            return next(new Error('Authentication error: Invalid token.'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id} (User ID: ${socket.user.id})`);

        // 1. Join Chat Room
        // When the frontend opens a specific chat thread, it requests to join the room
        socket.on('joinChat', (threadId) => {
            // Socket.IO rooms are used for targeted messaging
            socket.join(threadId);
            console.log(`User ${socket.user.id} joined room ${threadId}`);
        });

        // 2. Handle New Message
        socket.on('newMessage', async ({ threadId, text }) => {
            const senderId = socket.user.id;

            // 2a. Save the message to MongoDB (Data Persistence)
            try {
                const message = { senderId, text };

                // Find the chat and push the new message to the embedded array
                const chat = await Chat.findByIdAndUpdate(
                    threadId,
                    { $push: { messages: message } },
                    { new: true, runValidators: true }
                );

                if (!chat) {
                    return console.error(`Chat thread ${threadId} not found.`);
                }
                
                // 2b. Emit the real-time message to all other users in the room
                // Use .to(threadId) to send only to users in that room
                io.to(threadId).emit('messageReceived', {
                    threadId,
                    message: { 
                        ...message, 
                        timestamp: Date.now(), // Use a fresh timestamp for real-time consistency
                        senderId: senderId.toString() 
                    }
                });
                
            } catch (error) {
                console.error('Error saving or emitting message:', error);
            }
        });

        // 3. Disconnect
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};