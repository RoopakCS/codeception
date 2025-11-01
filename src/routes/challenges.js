const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Score = require('../models/score');
const Participant = require('../models/participant');

// Award points for completing a stage
router.post('/award-points', authenticateToken, async (req, res) => {
    try {
        const { participantCode, email, points, stage } = req.body;
        
        if (!participantCode || !email || points === undefined || !stage) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields' 
            });
        }
        
        const participant = await Participant.findOne({ 
            participantCode: participantCode.toUpperCase(),
            email: email.toLowerCase()
        });
        
        if (!participant) {
            return res.status(404).json({ 
                success: false,
                message: 'Participant not found' 
            });
        }
        
        const scoreDoc = await Score.findOne({ 
            registerNumber: participant.registerNumber 
        });
        
        if (!scoreDoc) {
            return res.status(404).json({ 
                success: false,
                message: 'Score record not found' 
            });
        }
        
        if (scoreDoc.completedStages.includes(stage)) {
            return res.json({ 
                success: true,
                message: 'Stage already completed',
                alreadyCompleted: true
            });
        }
        
        scoreDoc.score += points;
        scoreDoc.completedStages.push(stage);
        scoreDoc.lastUpdated = new Date();
        
        if (!scoreDoc.startTime && scoreDoc.completedStages.length === 1) {
            scoreDoc.startTime = new Date();
            scoreDoc.status = 'active';
        }
        
        await scoreDoc.save();
        
        res.json({ 
            success: true,
            message: 'Points awarded successfully',
            totalScore: scoreDoc.score,
            stage
        });
        
    } catch (error) {
        console.error('Award points error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to award points' 
        });
    }
});

// Complete challenge endpoint
router.post('/complete-challenge', authenticateToken, async (req, res) => {
    try {
        const { participantCode, email } = req.body;
        
        if (!participantCode || !email) {
            return res.status(400).json({ 
                success: false,
                message: 'Missing required fields' 
            });
        }
        
        const participant = await Participant.findOne({ 
            participantCode: participantCode.toUpperCase(),
            email: email.toLowerCase()
        });
        
        if (!participant) {
            return res.status(404).json({ 
                success: false,
                message: 'Participant not found' 
            });
        }
        
        const scoreDoc = await Score.findOne({ 
            registerNumber: participant.registerNumber 
        });
        
        if (!scoreDoc) {
            return res.status(404).json({ 
                success: false,
                message: 'Score record not found' 
            });
        }
        
        if (scoreDoc.status !== 'completed') {
            scoreDoc.score += 50;
            scoreDoc.status = 'completed';
            scoreDoc.completionTime = new Date();
            
            if (scoreDoc.startTime) {
                const timeDiff = scoreDoc.completionTime - scoreDoc.startTime;
                scoreDoc.timeTaken = Math.floor(timeDiff / (1000 * 60));
            }
            
            await scoreDoc.save();
        }
        
        const higherScores = await Score.countDocuments({
            $or: [
                { score: { $gt: scoreDoc.score } },
                { 
                    score: scoreDoc.score,
                    timeTaken: { $lt: scoreDoc.timeTaken }
                }
            ]
        });
        const rank = higherScores + 1;
        
        let completionTimeStr = '--';
        if (scoreDoc.timeTaken) {
            const hours = Math.floor(scoreDoc.timeTaken / 60);
            const mins = scoreDoc.timeTaken % 60;
            completionTimeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        }
        
        res.json({ 
            success: true,
            totalPoints: scoreDoc.score,
            completionTime: completionTimeStr,
            rank,
            message: 'Challenge completed successfully!'
        });
        
    } catch (error) {
        console.error('Complete challenge error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to complete challenge' 
        });
    }
});

module.exports = router;