const mongoose = require('mongoose');

/**
 * Track user interactions with job postings
 * Used for recommendations and analytics
 */
const jobInteractionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['view', 'apply', 'save', 'dismiss', 'click'],
        required: true
    },
    duration: {
        type: Number,
        description: 'Time spent on job posting in seconds'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Compound index for quick lookups
jobInteractionSchema.index({ userId: 1, timestamp: -1 });
jobInteractionSchema.index({ jobId: 1, type: 1 });

module.exports = mongoose.model('JobInteraction', jobInteractionSchema);
