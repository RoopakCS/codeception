const mongoose = require('mongoose');

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
    }],
    completedStages: {
        type: [String],
        default: []
    },
    startTime: {
        type: Date,
        default: null
    },
    completionTime: {
        type: Date,
        default: null
    }
});

// Create indexes for better query performance
scoreSchema.index({ score: -1, timeTaken: 1 });

module.exports = mongoose.model('Score', scoreSchema);