const mongoose = require('mongoose');

const cvVisitSchema = new mongoose.Schema({
    cvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CV',
        required: true,
        index: true
    },
    visitorId: String, // Anonymous ID for unique visitor tracking
    ip: String,

    // Location
    country: String,
    city: String,
    region: String,

    // Device
    deviceType: String, // mobile, tablet, console, smarttv, wearable, embedded
    browser: String,
    os: String,
    ua: String, // Full User Agent

    // Engagement
    duration: {
        type: Number,
        default: 0 // seconds
    },
    scrollDepth: {
        type: Number,
        default: 0 // percentage
    },

    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CVVisit', cvVisitSchema);
