const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: String,
    ip: {
        type: String,
        required: true
    },
    location: {
        city: String,
        country: String,
        countryCode: String
    },
    device: {
        browser: String,
        os: String,
        device: String
    },
    userAgent: String,
    success: {
        type: Boolean,
        default: true
    },
    failReason: String,
    sessionId: String
}, {
    timestamps: true
});

// Konum string'i
loginLogSchema.virtual('locationString').get(function () {
    if (!this.location) return 'Bilinmiyor';
    const parts = [];
    if (this.location.city) parts.push(this.location.city);
    if (this.location.countryCode) parts.push(this.location.countryCode);
    return parts.length > 0 ? parts.join(', ') : 'Bilinmiyor';
});

// Cihaz string'i
loginLogSchema.virtual('deviceString').get(function () {
    if (!this.device) return this.userAgent || 'Bilinmiyor';
    const parts = [];
    if (this.device.browser) parts.push(this.device.browser);
    if (this.device.os) parts.push(this.device.os);
    return parts.length > 0 ? parts.join(' / ') : 'Bilinmiyor';
});

loginLogSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('LoginLog', loginLogSchema);
