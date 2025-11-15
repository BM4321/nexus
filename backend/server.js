require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const listingRoutes = require('./routes/listingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB Atlas
connectDB(); 

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New socket connection:', socket.id);
  
  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });
  
  socket.on('send-message', (data) => {
    console.log('Message received:', data);
    io.to(data.chatId).emit('new-message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📨 ${req.method} ${req.path}`);
  if (req.headers.authorization) {
    console.log('Auth header:', req.headers.authorization.substring(0, 20) + '...');
  }
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', listingRoutes);
app.use('/api', chatRoutes);
app.use('/api', userRoutes);

// Test endpoint
app.get('/test', (req, res) => {
  console.log('✅ Test endpoint hit!');
  res.json({ message: 'Backend is working!' });
});

// 404 handler
app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.path);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log('📡 Ready to receive requests...');
  console.log('Press CTRL+C to stop\n');
});

// Handle errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
  } else {
    console.error('❌ Server error:', error);
  }
});