const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();

// Trust proxy for production deployment
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL, process.env.PRODUCTION_URL].filter(Boolean)
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        // Security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
    });
}

app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
        console.log('Connected to MongoDB');
        console.log(`Database: ${mongoose.connection.name}`);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

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
    const healthcheck = {
        status: 'ok',
        message: 'Codeception 2025 API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    };
    
    res.json(healthcheck);
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
        res.redirect('/color-riddle.html');
    } else {
        res.status(404).send('Invalid access key');
    }
});

// Vault unlock endpoint (Stage 5)
app.post('/api/vault-unlock', (req, res) => {
    // The key is in the request headers
    const vaultKey = req.headers['x-vault-key'];

    // Send response with the key in headers
    res.setHeader(
        'X-Vault-Key',
        vaultKey || 'o3cGZz5XpKIkIRu0pID4qT96FGOkZwyfozjkM0kYDGOAF1L='
    );
    res.setHeader('X-Vault-Status', 'ACTIVE');
    res.setHeader('X-Vault-Level', '5');
    res.json({
        status: 'Vault system active',
        message: 'Check response headers for the key',
    });
});

// GET endpoint for vault status
app.get('/api/vault-unlock', (req, res) => {
    res.setHeader(
        'X-Vault-Key',
        'o3cGZz5XpKIkIRu0pID4qT96FGOkZwyfozjkM0kYDGOAF1L='
    );
    res.setHeader('X-Vault-Status', 'ACTIVE');
    res.setHeader('X-Vault-Level', '5');
    res.json({
        status: 'Vault system active',
        message: 'Inspect the response headers carefully',
    });
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
    
    // Don't leak error details in production
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    res.status(err.status || 500).json({
        success: false,
        message: message,
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    
    // Close server
    server.close(async () => {
        console.log('HTTP server closed');
        
        // Close database connection
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        } catch (err) {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
        }
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown due to timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = app;
