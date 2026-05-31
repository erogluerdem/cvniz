const mongoose = require('mongoose');

const abTestSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'draft', 'archived'],
        default: 'draft'
    },
    variants: [{
        name: { type: String, required: true }, // e.g., 'Control', 'Variant A'
        value: { type: mongoose.Schema.Types.Mixed, required: true }, // The config/text/color
        trafficAllocation: { type: Number, default: 50 }, // Percentage

        // Stats
        views: { type: Number, default: 0 },
        conversions: { type: Number, default: 0 }
    }],
    startDate: Date,
    endDate: Date,
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ABTest', abTestSchema);
