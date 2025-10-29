const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// ===== CONSTANTS =====
const SALT_ROUNDS = 10;

// ===== MONGOOSE SCHEMAS =====

// Participant Schema (Individual Registration)
const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    registerNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    year: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4']
    },
    participantCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    }
});

// Score Schema (Participant-based)
const scoreSchema = new mongoose.Schema({
    participantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Participant'
    },
    name: {
        type: String,
        required: true
    },
    registerNumber: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    timeTaken: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'pending'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    puzzlesSolved: [{
        puzzleId: String,
        solvedAt: Date,
        points: Number
    }]
});

// Create indexes for better query performance
participantSchema.index({ registerNumber: 1, email: 1, participantCode: 1 });
scoreSchema.index({ score: -1, timeTaken: 1 });

// Create Models
const Participant = mongoose.model('Participant', participantSchema);
const Score = mongoose.model('Score', scoreSchema);

// ===== UTILITY FUNCTIONS =====

// Generate unique participant code
function generateParticipantCode() {
    return 'PC' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== API ROUTES =====

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Codeception 2025 API is running',
        timestamp: new Date().toISOString()
    });
});

// Register a new participant (Individual Registration)
app.post('/api/register', async (req, res) => {
    try {
        const { name, registerNumber, email, department, year, password } = req.body;
        
        // Validation
        if (!name || !registerNumber || !email || !department || !year || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required (Name, Register Number, Email, Department, Year, Password)'
            });
        }
        
        if (!isValidEmail(email)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email format'
            });
        }
        
        if (!['1', '2', '3', '4'].includes(year)) {
            return res.status(400).json({ 
                success: false,
                message: 'Year must be 1, 2, 3, or 4'
            });
        }
        
        // Check if participant already exists
        const existingParticipant = await Participant.findOne({ 
            $or: [
                { registerNumber: registerNumber.toUpperCase() },
                { email: email.toLowerCase() }
            ]
        });
        
        if (existingParticipant) {
            return res.status(409).json({
                success: false,
                message: 'A participant with this register number or email already exists'
            });
        }
        
        // Generate unique participant code
        let participantCode;
        let codeExists = true;
        
        while (codeExists) {
            participantCode = generateParticipantCode();
            const existing = await Participant.findOne({ participantCode });
            if (!existing) {
                codeExists = false;
            }
        }
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        // Create new participant
        const newParticipant = new Participant({
            name: name.trim(),
            registerNumber: registerNumber.toUpperCase(),
            email: email.toLowerCase(),
            department: department.trim(),
            year: year,
            participantCode,
            passwordHash
        });
        
        await newParticipant.save();
        
        // Create initial score entry for the participant
        const newScore = new Score({
            participantId: newParticipant._id,
            name: newParticipant.name,
            registerNumber: newParticipant.registerNumber,
            score: 0,
            timeTaken: 0,
            status: 'pending'
        });
        await newScore.save();
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            participantCode: participantCode,
            name: newParticipant.name
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during registration. Please try again later.'
        });
    }
});
// Verify participant credentials (Login with Email and Participant Code)
app.post('/api/verify-team', async (req, res) => {
    try {
        const { email, participantCode } = req.body;
        
        if (!email || !participantCode) {
            return res.status(400).json({ 
                valid: false,
                message: 'Email and participant code are required' 
            });
        }
        
        // Find participant with matching email and code
        const participant = await Participant.findOne({ 
            email: email.toLowerCase(),
            participantCode: participantCode.toUpperCase(),
            active: true
        });
        
        if (participant) {
            res.json({ 
                valid: true,
                message: 'Authentication successful',
                name: participant.name,
                participantCode: participant.participantCode
            });
        } else {
            res.status(401).json({ 
                valid: false,
                message: 'Invalid email or participant code' 
            });
        }
        
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ 
            valid: false,
            message: 'Server error. Please try again later.' 
        });
    }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        // Fetch all scores, sorted by score (descending) and time taken (ascending)
        const scores = await Score.find()
            .sort({ score: -1, timeTaken: 1 })
            .select('name registerNumber score timeTaken status')
            .lean();
        
        res.json({ 
            success: true,
            scores,
            count: scores.length,
            lastUpdated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch leaderboard' 
        });
    }
});

// Update participant score (Admin only - in production, add authentication)
app.put('/api/score/:registerNumber', async (req, res) => {
    try {
        const { registerNumber } = req.params;
        const { score, timeTaken, status, puzzleId, points } = req.body;
        
        // Find participant
        const participant = await Participant.findOne({ registerNumber: registerNumber.toUpperCase() });
        if (!participant) {
            return res.status(404).json({ 
                success: false,
                message: 'Participant not found' 
            });
        }
        
        // Build update object
        const updateData = { lastUpdated: new Date() };
        if (score !== undefined) updateData.score = score;
        if (timeTaken !== undefined) updateData.timeTaken = timeTaken;
        if (status !== undefined) updateData.status = status;
        
        const scoreDoc = await Score.findOneAndUpdate(
            { registerNumber: registerNumber.toUpperCase() },
            updateData,
            { new: true }
        );
        
        // Add puzzle solved entry if provided
        if (puzzleId && points !== undefined) {
            await Score.updateOne(
                { registerNumber: registerNumber.toUpperCase() },
                { 
                    $push: { 
                        puzzlesSolved: {
                            puzzleId,
                            solvedAt: new Date(),
                            points
                        }
                    },
                    $inc: { score: points }
                }
            );
        }
        
        res.json({ 
            success: true,
            message: 'Score updated successfully',
            score: scoreDoc
        });
        
    } catch (error) {
        console.error('Score update error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update score' 
        });
    }
});

// Get participant details by register number
app.get('/api/participant/:registerNumber', async (req, res) => {
    try {
        const { registerNumber } = req.params;
        
        const participant = await Participant.findOne({ registerNumber: registerNumber.toUpperCase() })
            .select('-__v -passwordHash');
        
        if (!participant) {
            return res.status(404).json({ 
                success: false,
                message: 'Participant not found' 
            });
        }
        
        const score = await Score.findOne({ registerNumber: registerNumber.toUpperCase() })
            .select('-__v');
        
        res.json({ 
            success: true,
            participant,
            score
        });
        
    } catch (error) {
        console.error('Participant fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch participant details' 
        });
    }
});

// Get all participants (Admin only - in production, add authentication)
app.get('/api/participants', async (req, res) => {
    try {
        const participants = await Participant.find()
            .sort({ registrationDate: -1 })
            .select('-__v -passwordHash');
        
        res.json({ 
            success: true,
            participants,
            count: participants.length
        });
        
    } catch (error) {
        console.error('Participants fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch participants' 
        });
    }
});

// Delete participant (Admin only - in production, add authentication)
app.delete('/api/participant/:registerNumber', async (req, res) => {
    try {
        const { registerNumber } = req.params;
        
        const participant = await Participant.findOneAndDelete({ registerNumber: registerNumber.toUpperCase() });
        if (!participant) {
            return res.status(404).json({ 
                success: false,
                message: 'Participant not found' 
            });
        }
        
        // Also delete associated score
        await Score.findOneAndDelete({ registerNumber: registerNumber.toUpperCase() });
        
        res.json({ 
            success: true,
            message: 'Participant deleted successfully'
        });
        
    } catch (error) {
        console.error('Participant deletion error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete participant' 
        });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'leaderboard.html'));
});

app.get('/puzzle', (req, res) => {
    res.sendFile(path.join(__dirname, 'puzzle.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Endpoint not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false,
        message: 'Internal server error' 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Started");
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = app;
