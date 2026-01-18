const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    planName: {
        type: String,
        required: true
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly', 'lifetime'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'TRY'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        default: 'card'
    },
    cardLast4: {
        type: String
    },
    transactionId: {
        type: String,
        unique: true
    },
    couponCode: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null // Lifetime for null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
