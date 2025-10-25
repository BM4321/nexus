require('dotenv').config(); // Load .env file at the very start
const express = require('express');
const mongoose = require('mongoose');
// --- NEW IMPORTS ---
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// -------------------

/* --- Configuration --- */
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

/* --- Database Connection --- */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully.');
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};
// Execute DB connection
connectDB();

/* --- Express App Setup --- */
const app = express();
app.use(express.json());

// --- CORS: allow frontend requests (set CORS_ORIGIN in .env for production) ---
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'; // e.g. "http://192.168.0.11:19000" or your Expo URL
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const chatRoutes = require('./routes/chatRoutes'); // <-- NEW IMPORT

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chats', chatRoutes); // <-- NEW ROUTE MOUNT

// Simple API health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Nexus MVP API is running! 🚀' });
});

/* --- Start HTTP + WebSocket Server --- */
// 1) Create native HTTP server from Express app
const server = http.createServer(app);

// 2) Initialize Socket.IO and attach to HTTP server
const io = new Server(server, {
  cors: {
    origin: '*', // restrict in production to your frontend origin
    methods: ['GET', 'POST'],
  },
});

// 3) Wire socket handlers (create ./sockets/chatSocket.js to use this)
try {
  require('./sockets/chatSocket')(io);
} catch (e) {
  console.warn('No chatSocket found or failed to load. Create /sockets/chatSocket.js to enable sockets.');
}

// 4) Listen on HTTP server (Socket.IO uses same server)
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('WebSocket server active.');
});