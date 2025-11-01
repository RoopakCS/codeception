const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./src/routes/auth');
const leaderboardRoutes = require('./src/routes/leaderboard');
const challengeRoutes = require('./src/routes/challenges');

// Use routes
app.use('/api', authRoutes); // Changed from /api/auth to /api
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/challenges', challengeRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Codeception 2025 API is running',
        timestamp: new Date().toISOString(),
    });
});

// API hint endpoint (Stage 3)
app.get('/api/getHint', async (req, res) => {
    const { stage } = req.query;

    if (stage === '2') {
        res.json({
            next: '/the-dark-corner',
            hint: 'The network tab holds the key to your next destination.',
        });
    } else {
        res.json({
            message: 'No hints available for this stage',
        });
    }
});

// Hidden final challenge redirect (Stage 4)
app.get('/hidden/final', (req, res) => {
    const { key } = req.query;

    if (key === '0x91f') {
        res.redirect('/final-challenge.html');
    } else {
        res.status(404).send('Invalid access key');
    }
});

// Session data endpoint (Stage 6)
app.get('/api/session-data', async (req, res) => {
    const sessionId = req.headers['x-session-id'];

    // Set custom response header with next stage
    res.setHeader('X-Next-Stage', '/cookies-matter');
    res.setHeader('X-Challenge-Level', '6');
    res.setHeader('X-Hint', 'Check response headers');

    res.json({
        success: true,
        sessionId: sessionId || 'none',
        message: 'Session data retrieved',
        timestamp: new Date().toISOString(),
        hint: 'The next path is in the response headers',
    });
});

// Static file serving - Update all paths to use /public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

// Protected routes

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = app;
