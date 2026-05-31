const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logo: String,
    logoUrl: String,
    website: String,
    type: {
        type: String,
        enum: ['integration', 'referral', 'affiliate', 'education', 'reseller', 'strategic'],
        default: 'referral'
    },
    tier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
        default: 'bronze'
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'paused', 'suspended', 'terminated'],
        default: 'pending'
    },
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    commission: {
        type: Number,
        default: 15,
        min: 0,
        max: 100
    },
    referrals: {
        type: Number,
        default: 0
    },
    conversions: {
        type: Number,
        default: 0
    },
    earnings: {
        type: Number,
        default: 0
    },
    paidEarnings: {
        type: Number,
        default: 0
    },
    pendingEarnings: {
        type: Number,
        default: 0
    },
    apiKey: String,
    notes: String,
    contractStartDate: Date,
    contractEndDate: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Dönüşüm oranı
partnerSchema.virtual('conversionRate').get(function () {
    if (this.referrals === 0) {return 0;}
    return ((this.conversions / this.referrals) * 100).toFixed(1);
});

partnerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Partner', partnerSchema);
