const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const { authenticate, adminOnly } = require('../middleware/auth');

// @desc    Get all payments (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
router.get('/', authenticate, adminOnly, async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ error: 'Ödemeler alınamadı' });
    }
});

// @desc    Get current user's payments
// @route   GET /api/payments/my
// @access  Private
router.get('/my', authenticate, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ error: 'Ödeme geçmişiniz alınamadı' });
    }
});

// @desc    Process a new payment
// @route   POST /api/payments
// @access  Private
router.post('/', authenticate, async (req, res) => {
    try {
        const { planId, planName, billingCycle, amount, cardLast4, couponCode } = req.body;

        // In a real app, you would integrate Iyzico/Stripe here.
        // For now, we simulate success.

        const expiresAt = billingCycle === 'lifetime'
            ? null
            : new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000);

        const payment = await Payment.create({
            userId: req.user._id,
            userEmail: req.user.email,
            userName: req.user.name,
            planId,
            planName,
            billingCycle,
            amount,
            cardLast4,
            couponCode,
            status: 'completed',
            transactionId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            expiresAt
        });

        // Update user premium status
        await User.findByIdAndUpdate(req.user._id, {
            isPremium: true,
            premiumExpiresAt: expiresAt
        });

        res.status(201).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ error: 'Ödeme işlenirken bir hata oluştu' });
    }
});

module.exports = router;
