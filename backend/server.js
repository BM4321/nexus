require('dotenv').config(); // Load .env file at the very start
const express = require('express');
const mongoose = require('mongoose');

// --- Configuration ---
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully.');
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    // Exit process on connection failure
    process.exit(1);
  }
};
connectDB();

// --- Express App Setup ---
const app = express();

// Middleware: Enable JSON parsing
app.use(express.json());

// Import Routes (To be created in the next step)
const authRoutes = require('./routes/authRoutes');
// const listingRoutes = require('./routes/listingRoutes'); // Will be added later

// Route Mounting
app.use('/api/auth', authRoutes);
// app.use('/api/listings', listingRoutes);

// Simple API health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Nexus MVP API is running! 🚀' });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});