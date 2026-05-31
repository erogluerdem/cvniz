const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['percent', 'fixed'],
        default: 'percent'
    },
    discount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date
    },
    usageLimit: {
        type: Number,
        default: null // null for unlimited
    },
    usageCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);
