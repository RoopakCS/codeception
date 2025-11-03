const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { JWT_SECRET } = require('../middleware/auth');
const Participant = require('../models/participant');
const Score = require('../models/score');

// Register a new participant
router.post('/register', async (req, res) => {
    try {
        console.log('Received registration request:', req.body);
        const { name, registerNumber, email, department, year, password } =
            req.body;

        // Validation
        if (
            !name ||
            !registerNumber ||
            !email ||
            !department ||
            !year ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Check if participant already exists
        const existingParticipant = await Participant.findOne({
            $or: [
                { registerNumber: registerNumber.toUpperCase() },
                { email: email.toLowerCase() },
            ],
        });

        if (existingParticipant) {
            return res.status(409).json({
                success: false,
                message:
                    'A participant with this register number or email already exists',
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
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new participant
        const newParticipant = new Participant({
            name: name.trim(),
            registerNumber: registerNumber.toUpperCase(),
            email: email.toLowerCase(),
            department: department.trim(),
            year: year,
            participantCode,
            passwordHash,
        });

        await newParticipant.save();

        // Create initial score entry
        const newScore = new Score({
            participantId: newParticipant._id,
            name: newParticipant.name,
            registerNumber: newParticipant.registerNumber,
        });
        await newScore.save();

        // Generate JWT token for auto-login
        const token = jwt.sign(
            {
                id: newParticipant._id,
                email: newParticipant.email,
                participantCode: newParticipant.participantCode,
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            participantCode,
            name: newParticipant.name,
            token,
            participant: {
                name: newParticipant.name,
                email: newParticipant.email,
                participantCode: newParticipant.participantCode,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        console.log('Received login request:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const participant = await Participant.findOne({
            email: email.toLowerCase(),
        });

        if (!participant) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            participant.passwordHash
        );
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = jwt.sign(
            {
                id: participant._id,
                email: participant.email,
                participantCode: participant.participantCode,
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            participant: {
                name: participant.name,
                email: participant.email,
                participantCode: participant.participantCode,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
});

function generateParticipantCode() {
    return (
        'PC' + require('crypto').randomBytes(3).toString('hex').toUpperCase()
    );
}

module.exports = router;
