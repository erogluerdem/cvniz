const mongoose = require('mongoose');

const aiUsageLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    feature: {
        type: String,
        enum: ['contentGeneration', 'cvAnalysis', 'skillSuggestions', 'coverLetter', 'interviewCoach', 'jobMatching', 'salaryPrediction', 'other'],
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    // Token usage
    promptTokens: {
        type: Number,
        default: 0
    },
    completionTokens: {
        type: Number,
        default: 0
    },
    totalTokens: {
        type: Number,
        default: 0
    },
    // Cost
    cost: {
        type: Number,
        default: 0
    },
    // Performance
    responseTime: {
        type: Number, // milliseconds
        default: 0
    },
    success: {
        type: Boolean,
        default: true
    },
    errorMessage: String,
    // Request info
    endpoint: String,
    statusCode: Number
}, {
    timestamps: true
});

// İndeksler
aiUsageLogSchema.index({ createdAt: -1 });
aiUsageLogSchema.index({ user: 1, createdAt: -1 });
aiUsageLogSchema.index({ feature: 1 });

module.exports = mongoose.model('AIUsageLog', aiUsageLogSchema);
