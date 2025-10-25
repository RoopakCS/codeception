const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
// Replace with your MongoDB Atlas connection string or local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeception';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✓ Connected to MongoDB'))
.catch(err => console.error('✗ MongoDB connection error:', err));

// ===== MONGOOSE SCHEMAS =====

// Team Schema
const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    leaderEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    members: [{
        type: String,
        trim: true
    }],
    teamCode: {
        type: String,
        required: true,
        unique: true
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

// Score Schema
const scoreSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        ref: 'Team'
    },
    teamCode: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0,
        min: 0
    },
    timeTaken: {
        type: Number, // in minutes
        default: null
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
teamSchema.index({ teamName: 1, teamCode: 1 });
scoreSchema.index({ score: -1, timeTaken: 1 });

// Create Models
const Team = mongoose.model('Team', teamSchema);
const Score = mongoose.model('Score', scoreSchema);

// ===== UTILITY FUNCTIONS =====

// Generate unique team code
function generateTeamCode() {
    return crypto.randomBytes(4).toString('hex').toUpperCase();
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

// Register a new team
app.post('/api/register', async (req, res) => {
    try {
        const { teamName, leaderEmail, members } = req.body;
        
        // Validation
        if (!teamName || !leaderEmail || !members || members.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Team name, leader email, and at least one member are required' 
            });
        }
        
        if (!isValidEmail(leaderEmail)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email format' 
            });
        }
        
        if (members.length > 3) {
            return res.status(400).json({ 
                success: false,
                message: 'Maximum 3 members allowed per team' 
            });
        }
        
        // Check if team name already exists
        const existingTeam = await Team.findOne({ teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } });
        if (existingTeam) {
            return res.status(409).json({ 
                success: false,
                message: 'Team name already exists. Please choose a different name.' 
            });
        }
        
        // Generate unique team code
        let teamCode;
        let codeExists = true;
        while (codeExists) {
            teamCode = generateTeamCode();
            const existingCode = await Team.findOne({ teamCode });
            if (!existingCode) {
                codeExists = false;
            }
        }
        
        // Create new team
        const newTeam = new Team({
            teamName,
            leaderEmail,
            members: members.filter(m => m.trim() !== ''),
            teamCode
        });
        
        await newTeam.save();
        
        // Create initial score entry
        const newScore = new Score({
            teamName,
            teamCode,
            score: 0,
            status: 'pending'
        });
        
        await newScore.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Team registered successfully',
            teamCode,
            teamName
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error. Please try again later.' 
        });
    }
});

// Verify team credentials
app.post('/api/verify-team', async (req, res) => {
    try {
        const { teamName, teamCode } = req.body;
        
        if (!teamName || !teamCode) {
            return res.status(400).json({ 
                valid: false,
                message: 'Team name and code are required' 
            });
        }
        
        // Find team with matching name and code
        const team = await Team.findOne({ 
            teamName: { $regex: new RegExp(`^${teamName}$`, 'i') },
            teamCode: teamCode.toUpperCase(),
            active: true
        });
        
        if (team) {
            res.json({ 
                valid: true,
                message: 'Authentication successful',
                teamName: team.teamName
            });
        } else {
            res.status(401).json({ 
                valid: false,
                message: 'Invalid team name or code' 
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
            .select('teamName score timeTaken status')
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

// Update team score (Admin only - in production, add authentication)
app.put('/api/score/:teamCode', async (req, res) => {
    try {
        const { teamCode } = req.params;
        const { score, timeTaken, status, puzzleId, points } = req.body;
        
        // Find team
        const team = await Team.findOne({ teamCode: teamCode.toUpperCase() });
        if (!team) {
            return res.status(404).json({ 
                success: false,
                message: 'Team not found' 
            });
        }
        
        // Update score
        const updateData = {
            lastUpdated: Date.now()
        };
        
        if (score !== undefined) updateData.score = score;
        if (timeTaken !== undefined) updateData.timeTaken = timeTaken;
        if (status !== undefined) updateData.status = status;
        
        const scoreDoc = await Score.findOneAndUpdate(
            { teamCode: teamCode.toUpperCase() },
            updateData,
            { new: true }
        );
        
        // Add puzzle solved entry if provided
        if (puzzleId && points !== undefined) {
            await Score.updateOne(
                { teamCode: teamCode.toUpperCase() },
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

// Get team details by team code
app.get('/api/team/:teamCode', async (req, res) => {
    try {
        const { teamCode } = req.params;
        
        const team = await Team.findOne({ teamCode: teamCode.toUpperCase() })
            .select('-__v');
        
        if (!team) {
            return res.status(404).json({ 
                success: false,
                message: 'Team not found' 
            });
        }
        
        const score = await Score.findOne({ teamCode: teamCode.toUpperCase() })
            .select('-__v');
        
        res.json({ 
            success: true,
            team,
            score
        });
        
    } catch (error) {
        console.error('Team fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch team details' 
        });
    }
});

// Get all teams (Admin only - in production, add authentication)
app.get('/api/teams', async (req, res) => {
    try {
        const teams = await Team.find()
            .sort({ registrationDate: -1 })
            .select('-__v');
        
        res.json({ 
            success: true,
            teams,
            count: teams.length
        });
        
    } catch (error) {
        console.error('Teams fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch teams' 
        });
    }
});

// Delete team (Admin only - in production, add authentication)
app.delete('/api/team/:teamCode', async (req, res) => {
    try {
        const { teamCode } = req.params;
        
        const team = await Team.findOneAndDelete({ teamCode: teamCode.toUpperCase() });
        if (!team) {
            return res.status(404).json({ 
                success: false,
                message: 'Team not found' 
            });
        }
        
        // Also delete associated score
        await Score.findOneAndDelete({ teamCode: teamCode.toUpperCase() });
        
        res.json({ 
            success: true,
            message: 'Team deleted successfully'
        });
        
    } catch (error) {
        console.error('Team deletion error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete team' 
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
    console.log(`
╔════════════════════════════════════════════╗
║   CODECEPTION 2025 - Server Running       ║
╠════════════════════════════════════════════╣
║   Port: ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                  ║
║   MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}                      ║
╠════════════════════════════════════════════╣
║   Access the website at:                   ║
║   http://localhost:${PORT}                    ║
╚════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});

module.exports = app;
