const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    clicks: {
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
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Affiliate', affiliateSchema);
