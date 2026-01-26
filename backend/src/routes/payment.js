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

// @desc    Initialize Iyzico/PayTR Payment (Mock for now)
// @route   POST /api/payments/init
// @access  Private
router.post('/init', authenticate, async (req, res) => {
    try {
        const { planId, planName, billingCycle, amount, provider = 'iyzico' } = req.body;

        // In a real scenario, you would call Iyzico/PayTR API here to get the HTML content or Token.
        // We will simulate a successful initialization returning a mock HTML form or redirect URL.

        const mockHtmlContent = `
            <div style="text-align: center; padding: 50px; font-family: sans-serif;">
                <h2>${provider === 'iyzico' ? 'Iyzico' : 'PayTR'} Güvenli Ödeme</h2>
                <p><strong>${planName}</strong> planı için <strong>${amount} ₺</strong> tutarında ödeme alınıyor.</p>
                <div style="margin-top: 20px; padding: 20px; border: 1px dashed #ccc; background: #f9f9f9;">
                    <p>Bu bir simülasyon ekranıdır. Gerçek entegrasyonda burada Banka/Kart formu yer alır.</p>
                    <button onclick="window.parent.postMessage({ status: 'success', planId: '${planId}' }, '*')" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">Başarılı Ödeme Simüle Et</button>
                    <button onclick="window.parent.postMessage({ status: 'failed' }, '*')" style="background: #ef4444; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">Hatalı Ödeme Simüle Et</button>
                </div>
            </div>
        `;

        res.json({
            success: true,
            htmlContent: mockHtmlContent,
            paymentId: `MOCK-${Date.now()}`
        });

    } catch (error) {
        res.status(500).json({ error: 'Ödeme başlatılamadı' });
    }
});

// @desc    Process Bank Transfer Notification
// @route   POST /api/payments/bank-transfer
// @access  Private
router.post('/bank-transfer', authenticate, async (req, res) => {
    try {
        const { planId, planName, billingCycle, amount, senderName, proofDocument } = req.body;

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
            status: 'waiting_approval',
            provider: 'bank_transfer',
            paymentMethod: 'bank_transfer',
            senderName,
            proofDocument,
            transactionId: `TR-${Date.now()}`,
            expiresAt
        });

        res.status(201).json({ success: true, payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Bildirim oluşturulamadı' });
    }
});

// @desc    Callback/Success Handler for Iyzico Mock
// @route   POST /api/payments/success
// @access  Private
router.post('/success', authenticate, async (req, res) => {
    try {
        const { planId, planName, billingCycle, amount, paymentId } = req.body;

        // Verify paymentId with provider in real app

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
            status: 'completed',
            provider: 'iyzico', // or dynamic
            transactionId: paymentId || `TRX-${Date.now()}`,
            expiresAt
        });

        // Activate Premium
        await User.findByIdAndUpdate(req.user._id, {
            isPremium: true,
            premiumExpiresAt: expiresAt
        });

        res.status(201).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ error: 'Ödeme kaydedilemedi' });
    }
});

// @desc    Approve Payment (Admin)
// @route   PUT /api/payments/:id/approve
// @access  Private/Admin
router.put('/:id/approve', authenticate, adminOnly, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ error: 'Ödeme bulunamadı' });
        }

        if (payment.status === 'completed') {
            return res.status(400).json({ error: 'Zaten onaylanmış' });
        }

        payment.status = 'completed';
        await payment.save();

        // Update User
        await User.findByIdAndUpdate(payment.userId, {
            isPremium: true,
            premiumExpiresAt: payment.expiresAt
        });

        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ error: 'Onaylama başarısız' });
    }
});

// @desc    Reject Payment (Admin)
// @route   PUT /api/payments/:id/reject
// @access  Private/Admin
router.put('/:id/reject', authenticate, adminOnly, async (req, res) => {
    try {
        const { adminNote } = req.body;
        const payment = await Payment.findById(req.params.id);

        if (!payment) return res.status(404).json({ error: 'Ödeme bulunamadı' });

        payment.status = 'rejected';
        payment.adminNote = adminNote;
        await payment.save();

        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ error: 'Reddetme başarısız' });
    }
});

module.exports = router;
