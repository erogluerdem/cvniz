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
        enum: ['pending', 'completed', 'failed', 'refunded', 'waiting_approval', 'rejected'],
        default: 'pending'
    },
    provider: {
        type: String,
        enum: ['iyzico', 'paytr', 'bank_transfer', 'stripe', 'card'],
        default: 'card'
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
    conversationId: {
        type: String
    },
    proofDocument: {
        type: String, // URL for bank transfer receipt
        default: null
    },
    senderName: {
        type: String, // Name on the bank account
        default: null
    },
    adminNote: {
        type: String,
        default: null
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
