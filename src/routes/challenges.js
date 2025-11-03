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
                message: 'Missing required fields',
            });
        }

        const participant = await Participant.findOne({
            participantCode: participantCode.toUpperCase(),
            email: email.toLowerCase(),
        });

        if (!participant) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found',
            });
        }

        const scoreDoc = await Score.findOne({
            registerNumber: participant.registerNumber,
        });

        if (!scoreDoc) {
            return res.status(404).json({
                success: false,
                message: 'Score record not found',
            });
        }

        if (scoreDoc.completedStages.includes(stage)) {
            return res.json({
                success: true,
                message: 'Stage already completed',
                alreadyCompleted: true,
                totalScore: scoreDoc.score,
            });
        }

        // Log before update
        console.log(
            'Before update - Score:',
            scoreDoc.score,
            'Points to add:',
            points
        );

        const now = new Date();
        const shouldActivate =
            !scoreDoc.startTime && !scoreDoc.completedStages.length;

        try {
            // Use a single atomic findOneAndUpdate operation
            const updatedScore = await Score.findOneAndUpdate(
                {
                    _id: scoreDoc._id,
                    // Safety check to prevent duplicate awards
                    completedStages: { $ne: stage },
                },
                {
                    $inc: { score: points },
                    $set: {
                        lastUpdated: now,
                        ...(shouldActivate && {
                            startTime: now,
                            status: 'active',
                        }),
                    },
                    $push: {
                        completedStages: stage,
                        puzzlesSolved: {
                            puzzleId: stage,
                            solvedAt: now,
                            points: points,
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!updatedScore) {
                // This could happen if the stage was already completed
                const currentScore = await Score.findById(scoreDoc._id);
                if (currentScore.completedStages.includes(stage)) {
                    return res.json({
                        success: true,
                        message: 'Stage already completed',
                        alreadyCompleted: true,
                        totalScore: currentScore.score,
                    });
                }
                throw new Error('Failed to update score document');
            }

            // Log successful update with detailed information
            console.log('Score updated successfully:', {
                participant: participant.registerNumber,
                stage,
                points,
                previousScore: scoreDoc.score,
                newScore: updatedScore.score,
                totalPuzzles: updatedScore.puzzlesSolved.length,
                timestamp: new Date().toISOString(),
            });

            res.json({
                success: true,
                message: 'Points awarded successfully',
                totalScore: updatedScore.score,
                stage,
                completedStages: updatedScore.completedStages,
                previousScore: scoreDoc.score,
                pointsAdded: points,
            });
        } catch (updateError) {
            console.error('Error updating score:', updateError);
            throw updateError; // Let outer catch handle it
        }
    } catch (error) {
        console.error('Award points error:', {
            error: error.message,
            participant: req.user?.registerNumber,
            stage,
            points,
        });

        // Send appropriate error response
        if (error.message.includes('already completed')) {
            return res.status(400).json({
                success: false,
                message: 'Stage already completed',
                error: error.message,
            });
        }

        if (error.message.includes('Score record not found')) {
            return res.status(404).json({
                success: false,
                message: 'Score record not found',
                error: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to award points',
            error: error.message,
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
                message: 'Missing required fields',
            });
        }

        const participant = await Participant.findOne({
            participantCode: participantCode.toUpperCase(),
            email: email.toLowerCase(),
        });

        if (!participant) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found',
            });
        }

        const scoreDoc = await Score.findOne({
            registerNumber: participant.registerNumber,
        });

        if (!scoreDoc) {
            return res.status(404).json({
                success: false,
                message: 'Score record not found',
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
                    timeTaken: { $lt: scoreDoc.timeTaken },
                },
            ],
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
            message: 'Challenge completed successfully!',
        });
    } catch (error) {
        console.error('Complete challenge error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to complete challenge',
        });
    }
});

module.exports = router;
