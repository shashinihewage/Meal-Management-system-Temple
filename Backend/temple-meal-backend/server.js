// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const contributionRoutes = require('./routes/contributions');
const cors = require('cors');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // ✅ Allow your React frontend
  credentials: true               // ✅ Allow cookies, if needed later
}));
app.use(express.json()); // ✅ Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contributions', contributionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('🛕 Temple Meal Management Backend is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
