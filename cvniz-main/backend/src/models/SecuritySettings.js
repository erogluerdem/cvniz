const mongoose = require('mongoose');

const securitySettingsSchema = new mongoose.Schema({
    // Authentication Settings
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorMethod: {
        type: String,
        enum: ['sms', 'email', 'authenticator'],
        default: 'email'
    },
    loginAlerts: {
        type: Boolean,
        default: true
    },
    requireStrongPassword: {
        type: Boolean,
        default: true
    },
    passwordMinLength: {
        type: Number,
        default: 8
    },
    passwordRequireUppercase: {
        type: Boolean,
        default: true
    },
    passwordRequireNumber: {
        type: Boolean,
        default: true
    },
    passwordRequireSpecial: {
        type: Boolean,
        default: false
    },

    // Session Settings
    sessionTimeout: {
        type: Number,
        default: 30 // minutes
    },
    preventConcurrentSessions: {
        type: Boolean,
        default: false
    },

    // Login Protection
    maxLoginAttempts: {
        type: Number,
        default: 5
    },
    lockoutDuration: {
        type: Number,
        default: 15 // minutes
    },

    // IP Settings
    blockedIPs: [{
        ip: String,
        reason: String,
        blockedAt: { type: Date, default: Date.now },
        blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    whitelistedIPs: [String],

    // Rate Limiting
    rateLimitEnabled: {
        type: Boolean,
        default: true
    },
    rateLimitRequests: {
        type: Number,
        default: 100
    },
    rateLimitWindow: {
        type: Number,
        default: 60 // seconds
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SecuritySettings', securitySettingsSchema);
