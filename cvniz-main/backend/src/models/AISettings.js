const mongoose = require('mongoose');

const aiSettingsSchema = new mongoose.Schema({
    // Provider Configuration
    provider: {
        type: String,
        enum: ['openai', 'anthropic', 'google', 'azure', 'custom'],
        default: 'openai'
    },
    model: {
        type: String,
        default: 'gpt-4'
    },
    apiKey: {
        type: String,
        default: ''
    },
    apiEndpoint: String,

    // Model Parameters
    maxTokens: {
        type: Number,
        default: 2000
    },
    temperature: {
        type: Number,
        default: 0.7,
        min: 0,
        max: 2
    },
    topP: {
        type: Number,
        default: 1,
        min: 0,
        max: 1
    },
    frequencyPenalty: {
        type: Number,
        default: 0,
        min: 0,
        max: 2
    },
    presencePenalty: {
        type: Number,
        default: 0,
        min: 0,
        max: 2
    },

    // Features
    enabled: {
        type: Boolean,
        default: true
    },
    features: {
        contentGeneration: { type: Boolean, default: true },
        cvAnalysis: { type: Boolean, default: true },
        skillSuggestions: { type: Boolean, default: true },
        coverLetter: { type: Boolean, default: true },
        interviewCoach: { type: Boolean, default: true },
        jobMatching: { type: Boolean, default: false },
        salaryPrediction: { type: Boolean, default: false }
    },

    // Rate Limiting
    rateLimitEnabled: {
        type: Boolean,
        default: true
    },
    requestsPerMinute: {
        type: Number,
        default: 60
    },
    requestsPerDay: {
        type: Number,
        default: 1000
    },

    // Budget
    monthlyBudget: {
        type: Number,
        default: 50 // dollars
    },
    currentMonthCost: {
        type: Number,
        default: 0
    },
    budgetAlertThreshold: {
        type: Number,
        default: 80 // percentage
    },
    disableOnBudgetExceed: {
        type: Boolean,
        default: true
    },

    // Logging
    logRequests: {
        type: Boolean,
        default: true
    },
    logResponses: {
        type: Boolean,
        default: false
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Masked API key
aiSettingsSchema.virtual('maskedApiKey').get(function () {
    if (!this.apiKey || this.apiKey.length < 8) { return '••••••••••••••••'; }
    return this.apiKey.substring(0, 4) + '••••••••••••' + this.apiKey.slice(-4);
});

aiSettingsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('AISettings', aiSettingsSchema);
