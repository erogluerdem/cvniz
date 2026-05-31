const mongoose = require('mongoose');

const cvReviewSchema = new mongoose.Schema({
    cvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_review', 'completed', 'rejected'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high'],
        default: 'normal'
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    feedback: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes
cvReviewSchema.index({ cvId: 1 });
cvReviewSchema.index({ userId: 1 });
cvReviewSchema.index({ status: 1 });

module.exports = mongoose.model('CVReview', cvReviewSchema);
