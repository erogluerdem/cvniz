const mongoose = require('mongoose');
const crypto = require('crypto');

const apiKeySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    key: {
        type: String,
        unique: true,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    hashedKey: {
        type: String,
        required: true
    },
    environment: {
        type: String,
        enum: ['production', 'staging', 'development', 'test'],
        default: 'production'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'revoked', 'expired'],
        default: 'active'
    },
    permissions: [{
        type: String,
        enum: ['read', 'write', 'delete', 'admin']
    }],
    rateLimit: {
        type: Number,
        default: 1000 // requests per hour
    },
    // Usage tracking
    totalRequests: {
        type: Number,
        default: 0
    },
    lastUsedAt: Date,
    lastUsedIP: String,
    // Expiration
    expiresAt: Date,
    // Metadata
    description: String,
    allowedIPs: [String],
    allowedDomains: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// API key oluşturma
apiKeySchema.statics.generateKey = function (environment = 'prod') {
    const prefix = `CVniz_${environment}_`;
    const randomPart = crypto.randomBytes(24).toString('hex');
    const key = prefix + randomPart;
    const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
    return { key, prefix, hashedKey };
};

// Masked key
apiKeySchema.virtual('maskedKey').get(function () {
    if (!this.key) return '••••••••••••••••';
    return this.key.substring(0, 15) + '••••••••••••';
});

apiKeySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ApiKey', apiKeySchema);

