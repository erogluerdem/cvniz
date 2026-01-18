const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['discount', 'trial', 'bonus', 'flash_sale', 'seasonal'],
        default: 'discount'
    },
    discount: {
        type: Number,
        default: 0
    },
    discountType: {
        type: String,
        enum: ['percent', 'fixed'],
        default: 'percent'
    },
    couponCode: {
        type: String,
        uppercase: true,
        trim: true
    },
    targetAudience: {
        type: String,
        enum: ['all', 'new_users', 'premium', 'expired_premium', 'inactive'],
        default: 'all'
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'ended', 'scheduled'],
        default: 'draft'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    views: {
        type: Number,
        default: 0
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
    budget: {
        type: Number,
        default: 0
    },
    spentBudget: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Dönüşüm oranı virtual
campaignSchema.virtual('conversionRate').get(function () {
    if (this.views === 0) return 0;
    return ((this.conversions / this.views) * 100).toFixed(2);
});

// Kampanya aktif mi kontrolü
campaignSchema.virtual('isLive').get(function () {
    if (this.status !== 'active') return false;
    const now = new Date();
    if (this.startDate && now < this.startDate) return false;
    if (this.endDate && now > this.endDate) return false;
    return true;
});

campaignSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
