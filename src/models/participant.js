const mongoose = require('mongoose');

// Participant Schema (Individual Registration)
const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    registerNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    department: {
        type: String,
        required: true,
        trim: true,
    },
    year: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4'],
    },
    participantCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

// Create indexes for better query performance
participantSchema.index({ registerNumber: 1, email: 1, participantCode: 1 });

module.exports = mongoose.model('Participant', participantSchema);
