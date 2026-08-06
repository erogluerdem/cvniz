const mongoose = require('mongoose');

const seoSettingsSchema = new mongoose.Schema({
    path: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    pageName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        default: []
    },
    ogImage: {
        type: String
    },
    robots: {
        type: String,
        default: 'index, follow'
    },
    canonicalUrl: {
        type: String
    },
    healthScore: {
        type: Number,
        default: 100
    },
    issues: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['optimized', 'needs-improvement', 'critical'],
        default: 'optimized'
    },
    lastCrawled: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SEOSettings', seoSettingsSchema);
