const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    views: {
        type: Number,
        default: 0
    },
    conversions: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    }
});

const abTestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    element: {
        type: String,
        enum: ['button', 'heading', 'pricing', 'layout', 'form', 'image', 'color', 'copy', 'other'],
        default: 'other'
    },
    variants: [variantSchema],
    status: {
        type: String,
        enum: ['draft', 'running', 'paused', 'completed', 'archived'],
        default: 'draft'
    },
    trafficPercentage: {
        type: Number,
        default: 50,
        min: 1,
        max: 100
    },
    winnerVariant: {
        type: String
    },
    confidenceLevel: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    targetPage: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Toplam görüntüleme
abTestSchema.virtual('totalViews').get(function () {
    return this.variants.reduce((sum, v) => sum + (v.views || 0), 0);
});

// Toplam dönüşüm
abTestSchema.virtual('totalConversions').get(function () {
    return this.variants.reduce((sum, v) => sum + (v.conversions || 0), 0);
});

abTestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ABTest', abTestSchema);
