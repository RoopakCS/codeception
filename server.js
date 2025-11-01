const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// Initialize Express app
const app = express();
// Middleware
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
// Import routes
const authRoutes = require('./src/routes/auth');
const leaderboardRoutes = require('./src/routes/leaderboard');
const challengeRoutes = require('./src/routes/challenges');
// Use routes
// Special endpoints
// Health check
// API hint endpoint (Stage 3)
// Hidden final challenge redirect (Stage 4)
// Session data endpoint (Stage 6)
// Static file serving
// 404 handler
// Error handler
// Start server
const PORT = process.env.PORT || 3000;
// Graceful shutdown
