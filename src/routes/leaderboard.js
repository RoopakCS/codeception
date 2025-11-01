const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Score = require('../models/score');
const Participant = require('../models/participant');

// Get leaderboard
router.get('/', async (req, res) => {
    try {
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

// Update participant score (Admin only)
router.put('/score/:registerNumber', authenticateToken, async (req, res) => {
    try {
        const { registerNumber } = req.params;
        const { score, timeTaken, status, puzzleId, points } = req.body;
        
        const participant = await Participant.findOne({ registerNumber: registerNumber.toUpperCase() });
        if (!participant) {
            return res.status(404).json({ 
                success: false,
                message: 'Participant not found' 
            });
        }
        
        const updateData = { lastUpdated: new Date() };
        if (score !== undefined) updateData.score = score;
        if (timeTaken !== undefined) updateData.timeTaken = timeTaken;
        if (status !== undefined) updateData.status = status;
        
        const scoreDoc = await Score.findOneAndUpdate(
            { registerNumber: registerNumber.toUpperCase() },
            updateData,
            { new: true }
        );
        
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

module.exports = router;