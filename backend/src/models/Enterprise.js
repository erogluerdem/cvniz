const mongoose = require('mongoose');

const enterpriseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logo: String,
    domain: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    plan: {
        type: String,
        enum: ['starter', 'business', 'enterprise', 'custom'],
        default: 'starter'
    },
    status: {
        type: String,
        enum: ['trial', 'active', 'suspended', 'cancelled', 'expired'],
        default: 'trial'
    },
    userLimit: {
        type: Number,
        default: 10
    },
    cvLimit: {
        type: Number,
        default: 100
    },
    activeUsers: {
        type: Number,
        default: 0
    },
    usedCVs: {
        type: Number,
        default: 0
    },
    monthlyFee: {
        type: Number,
        default: 999
    },
    annualDiscount: {
        type: Number,
        default: 20
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
        default: 'monthly'
    },
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    contactTitle: String,
    features: [{
        type: String
    }],
    customBranding: {
        type: Boolean,
        default: false
    },
    apiAccess: {
        type: Boolean,
        default: false
    },
    ssoEnabled: {
        type: Boolean,
        default: false
    },
    dedicatedSupport: {
        type: Boolean,
        default: false
    },
    trialEndDate: Date,
    contractStartDate: Date,
    contractEndDate: Date,
    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Kullanım yüzdesi
enterpriseSchema.virtual('usagePercentage').get(function () {
    if (this.cvLimit === 0) {return 0;}
    return Math.round((this.usedCVs / this.cvLimit) * 100);
});

// Yıllık gelir
enterpriseSchema.virtual('annualRevenue').get(function () {
    const monthlyAmount = this.monthlyFee;
    if (this.billingCycle === 'annual') {
        return monthlyAmount * 12 * (1 - this.annualDiscount / 100);
    }
    return monthlyAmount * 12;
});

enterpriseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Enterprise', enterpriseSchema);
