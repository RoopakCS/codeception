const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Score = require('../models/score');
const Participant = require('../models/participant');

// Get leaderboard
router.get('/', async (req, res) => {
    try {
        // Force fresh data with lean() for better performance
        const scores = await Score.find({}, null, { lean: true })
            .sort({ score: -1, timeTaken: 1 })
            .select('registerNumber score timeTaken status completedStages startTime completionTime puzzlesSolved');

        // Get participant details for each score
        const scoreWithDetails = await Promise.all(
            scores.map(async (score) => {
                const participant = await Participant.findOne(
                    { registerNumber: score.registerNumber }, 
                    'name registerNumber department participantCode',
                    { lean: true }
                );
                
                return {
                    ...score,
                    name: participant?.name || 'Unknown',
                    department: participant?.department || 'Unknown',
                    participantCode: participant?.participantCode || 'Unknown',
                    totalPuzzles: score.puzzlesSolved?.length || 0,
                    formattedTime: score.timeTaken ? `${Math.floor(score.timeTaken / 60)}h ${score.timeTaken % 60}m` : '--',
                    lastStageCompleted: score.completedStages?.length ? score.completedStages[score.completedStages.length - 1] : null
                };
            })
        );

        // Calculate ranks (handling ties based on time)
        let currentRank = 1;
        let currentScore = -1;
        let currentTime = -1;
        let sameRankCount = 0;

        const rankedScores = scoreWithDetails.map((score, index) => {
            if (score.score !== currentScore || score.timeTaken !== currentTime) {
                currentRank = index + 1 - sameRankCount;
                currentScore = score.score;
                currentTime = score.timeTaken;
                sameRankCount = 0;
            } else {
                sameRankCount++;
            }
            return { ...score, rank: currentRank };
        });

        // Cache control headers
        res.set('Cache-Control', 'no-cache');
        res.set('Last-Modified', new Date().toUTCString());

        res.json({
            success: true,
            scores: rankedScores,
            count: rankedScores.length,
            lastUpdated: new Date().toISOString(),
            topScore: rankedScores[0]?.score || 0,
            activePlayers: rankedScores.filter(s => s.status === 'active').length,
            completedPlayers: rankedScores.filter(s => s.status === 'completed').length
        });
    } catch (error) {
        console.error('Leaderboard error:', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message
        });
    }
});

// Update participant score (Admin only)
router.put('/score/:registerNumber', authenticateToken, async (req, res) => {
    try {
        const { registerNumber } = req.params;
        const { score, timeTaken, status, puzzleId, points } = req.body;

        const participant = await Participant.findOne({
            registerNumber: registerNumber.toUpperCase(),
        });
        if (!participant) {
            return res.status(404).json({
                success: false,
                message: 'Participant not found',
            });
        }

        const updateData = { lastUpdated: new Date() };
        if (score !== undefined) updateData.score = score;
        if (timeTaken !== undefined) updateData.timeTaken = timeTaken;
        if (status !== undefined) {
            updateData.status = status;
            if (status === 'completed' && !updateData.completionTime) {
                updateData.completionTime = new Date();
            }
        }

        // Use session for atomic updates
        const session = await Score.startSession();
        let updatedScore;

        try {
            await session.withTransaction(async () => {
                // First update the main score document
                updatedScore = await Score.findOneAndUpdate(
                    { registerNumber: registerNumber.toUpperCase() },
                    updateData,
                    { new: true, session }
                );

                if (!updatedScore) {
                    throw new Error('Score document not found');
                }

                // Then handle puzzle solve if needed
                if (puzzleId && points !== undefined) {
                    // Check if puzzle already solved
                    const existingPuzzle = await Score.findOne({
                        registerNumber: registerNumber.toUpperCase(),
                        'puzzlesSolved.puzzleId': puzzleId
                    });

                    if (!existingPuzzle) {
                        await Score.updateOne(
                            { registerNumber: registerNumber.toUpperCase() },
                            {
                                $push: {
                                    puzzlesSolved: {
                                        puzzleId,
                                        solvedAt: new Date(),
                                        points,
                                    },
                                },
                                $inc: { score: points }
                            },
                            { session }
                        );
                        
                        // Refetch after puzzle update
                        updatedScore = await Score.findOne(
                            { registerNumber: registerNumber.toUpperCase() },
                            null,
                            { session }
                        );
                    }
                }
            });
        } finally {
            await session.endSession();
        }

        res.json({
            success: true,
            message: 'Score updated successfully',
            score: updatedScore,
            puzzleAdded: puzzleId && points !== undefined
        });
    } catch (error) {
        console.error('Score update error:', {
            error: error.message,
            registerNumber,
            score,
            timeTaken,
            status,
            puzzleId,
            points
        });
        
        if (error.message === 'Score document not found') {
            return res.status(404).json({
                success: false,
                message: 'Score record not found',
                error: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update score',
            error: error.message
        });
    }
});

module.exports = router;
