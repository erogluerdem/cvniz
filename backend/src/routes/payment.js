const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const { authenticate, adminOnly } = require('../middleware/auth');
const emailService = require('../services/EmailService');
const smsService = require('../services/SmsService');
const Iyzipay = require('iyzipay');

// Iyzico Configuration (Sandbox)
const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY || 'sandbox-api-key',
    secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-secret-key',
    uri: process.env.IYZICO_URI || 'https://sandbox-api.iyzipay.com'
});

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

// @desc    Initialize Iyzico Payment Form
// @route   POST /api/payments/init
// @access  Private
router.post('/init', authenticate, async (req, res) => {
    try {
        const { planId, planName, price, billingCycle } = req.body;

        // Ensure price is a string for Iyzico (e.g. '49.90')
        const paidPrice = parseFloat(price).toFixed(2);

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: `CVNIZ-${req.user._id}-${Date.now()}`,
            price: paidPrice,
            paidPrice: paidPrice,
            currency: Iyzipay.CURRENCY.TRY,
            basketId: `BASKET-${Date.now()}`,
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.API_URL || 'http://localhost:3001/api'}/payments/callback`,
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: {
                id: req.user._id.toString(),
                name: req.user.name || 'Misafir',
                surname: 'Kullanıcı',
                gsmNumber: req.user.phone || '+905555555555',
                email: req.user.email,
                identityNumber: '11111111111', // Sandbox dummy
                lastLoginDate: '2024-01-01 12:00:00',
                registrationDate: '2024-01-01 12:00:00',
                registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                ip: req.ip,
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: req.user.name || 'Misafir',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                zipCode: '34732'
            },
            billingAddress: {
                contactName: req.user.name || 'Misafir',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                zipCode: '34732'
            },
            basketItems: [
                {
                    id: planId,
                    name: planName,
                    category1: 'Premium Membership',
                    category2: billingCycle,
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: paidPrice
                }
            ]
        };

        iyzipay.checkoutFormInitialize.create(request, (err, result) => {
            if (err || result.status !== 'success') {
                console.error('Iyzico Init Error:', err || result.errorMessage);
                return res.status(500).json({ error: 'Ödeme başlatılamadı.' });
            }

            res.json({
                success: true,
                htmlContent: result.checkoutFormContent,
                token: result.token,
                paymentPageUrl: result.paymentPageUrl // Optional redirect usage
            });
        });

    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ error: 'Ödeme servisi hatası.' });
    }
});

// @desc    Iyzico Callback (POST from Iyzico)
// @route   POST /api/payments/callback
// @access  Public (Called by Iyzico)
router.post('/callback', async (req, res) => {
    try {
        const { token } = req.body;

        iyzipay.checkoutForm.retrieve({
            locale: Iyzipay.LOCALE.TR,
            token: token
        }, async (err, result) => {
            if (err || result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
                // Payment failed or user cancelled, redirect to frontend failure page
                return res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=failed`);
            }

            // Payment Successful
            const conversationId = result.conversationId;
            // Extract userId from conversationId (Format: CVNIZ-userId-timestamp)
            const parts = conversationId.split('-');
            const userId = parts[1];

            // Calculate expiration
            // Ideally we should store the plan details in a temp "Order" table before init,
            // but for now we default to 1 month or check basket items if needed.
            // Let's assume 30 days for simplicity or fetch plan from result.basketItems
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            // Save Payment Record
            const payment = await Payment.create({
                userId: userId,
                userEmail: result.buyerEmail || 'unknown@email.com',
                userName: 'Iyzico User',
                planId: 'premium',
                planName: 'Premium Plan (Iyzico)',
                amount: result.paidPrice,
                status: 'completed',
                provider: 'iyzico',
                transactionId: result.paymentId,
                billingCycle: 'monthly', // Default assumption
                expiresAt
            });

            // Activate User
            const user = await User.findByIdAndUpdate(userId, {
                isPremium: true,
                premiumExpiresAt: expiresAt
            });

            // NOTIFICATIONS
            if (user) {
                await emailService.sendPaymentSuccess(user, payment);
            }

            // Redirect to frontend success page
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?payment=success`);
        });

    } catch (error) {
        console.error('Callback Error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/dashboard?payment=error`);
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

        // NOTIFICATIONS
        await emailService.sendBankTransferReceived(req.user, payment);
        await emailService.sendAdminNotification(payment);

        res.status(201).json({ success: true, payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Bildirim oluşturulamadı' });
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
        const user = await User.findByIdAndUpdate(payment.userId, {
            isPremium: true,
            premiumExpiresAt: payment.expiresAt
        });

        // NOTIFICATIONS
        await emailService.sendBankTransferApproved(user, payment);
        await smsService.sendBankTransferApproved(user, payment);

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

        if (!payment) {return res.status(404).json({ error: 'Ödeme bulunamadı' });}

        payment.status = 'rejected';
        payment.adminNote = adminNote;
        await payment.save();

        const user = await User.findById(payment.userId);

        // NOTIFICATIONS
        await emailService.sendBankTransferRejected(user, payment);

        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ error: 'Reddetme başarısız' });
    }
});

module.exports = router;
