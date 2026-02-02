const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// Payment Schema
const paymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'processing', 'succeeded', 'failed', 'refunded', 'canceled'], default: 'pending' },

    paymentMethod: {
        type: { type: String, enum: ['card', 'bank_transfer', 'paypal', 'apple_pay', 'google_pay'], required: true },
        last4: String,
        brand: String,
        expiryMonth: Number,
        expiryYear: Number
    },

    order: {
        orderId: String,
        description: String,
        invoiceId: String,
        items: [{
            name: String,
            quantity: Number,
            price: Number,
            tax: Number
        }],
        metadata: Map
    },

    billingAddress: {
        name: String,
        email: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },

    refund: {
        refundId: String,
        amount: Number,
        reason: String,
        timestamp: Date,
        status: String
    },

    stripe: {
        paymentIntentId: String,
        chargeId: String,
        receiptUrl: String
    },

    fees: {
        platformFee: { type: Number, default: 0 },
        processingFee: { type: Number, default: 0 },
        tax: { type: Number, default: 0 },
        total: { type: Number, default: 0 }
    },

    fraud: {
        riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
        fraudChecks: [String],
        flagged: { type: Boolean, default: false },
        reason: String
    },

    metadata: {
        userAgent: String,
        ipAddress: String,
        deviceId: String,
        sessionId: String
    },

    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
    completedAt: Date
}, { timestamps: true });

paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Refund Schema
const refundSchema = new mongoose.Schema({
    refundId: { type: String, required: true, unique: true, index: true },
    paymentId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'processing', 'succeeded', 'failed'], default: 'pending' },

    requestor: {
        type: { type: String, enum: ['user', 'admin', 'system'] },
        id: String,
        reason: String
    },

    stripe: {
        refundId: String,
        receiptNumber: String
    },

    notes: String,
    createdAt: { type: Date, default: Date.now },
    processedAt: Date
}, { timestamps: true });

refundSchema.index({ paymentId: 1, status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
const Refund = mongoose.model('Refund', refundSchema);

class PaymentService {
    // Initialize Stripe
    constructor() {
        this.stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    }

    // Create Payment Intent
    async createPaymentIntent(userId, amount, currency = 'USD', metadata = {}) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: currency.toLowerCase(),
                metadata: { userId, ...metadata },
                automatic_payment_methods: { enabled: true }
            });

            const payment = new Payment({
                transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                userId,
                amount,
                currency,
                status: 'pending',
                stripe: { paymentIntentId: paymentIntent.id },
                order: { metadata }
            });

            await payment.save();
            recordEvent('payment_intent_created', { userId, amount, currency });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentId: payment._id,
                transactionId: payment.transactionId
            };
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Ödeme intent'i oluşturulurken hata: ${error.message}`);
        }
    }

    // Confirm Payment
    async confirmPayment(paymentId, stripePaymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(stripePaymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                const payment = await Payment.findOneAndUpdate(
                    { _id: paymentId },
                    {
                        status: 'succeeded',
                        'stripe.chargeId': paymentIntent.charges.data[0]?.id,
                        'stripe.receiptUrl': paymentIntent.charges.data[0]?.receipt_url,
                        completedAt: new Date(),
                        updatedAt: new Date()
                    },
                    { new: true }
                );

                recordEvent('payment_succeeded', { paymentId, amount: payment.amount });
                return payment;
            } else if (paymentIntent.status === 'requires_action') {
                return { status: 'requires_action' };
            } else {
                throw new Error('Ödeme başarısız oldu');
            }
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Get Payment
    async getPayment(paymentId) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {throw new Error('Ödeme bulunamadı');}

            recordEvent('payment_retrieved', { paymentId });
            return payment;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Get User Payments
    async getUserPayments(userId, limit = 50, offset = 0) {
        try {
            const payments = await Payment.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(offset);

            const total = await Payment.countDocuments({ userId });

            recordEvent('user_payments_retrieved', { userId, count: payments.length, total });
            return { payments, total };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Process Refund
    async processRefund(paymentId, amount, reason, requestor) {
        try {
            const payment = await Payment.findById(paymentId);
            if (!payment) {throw new Error('Ödeme bulunamadı');}
            if (payment.status !== 'succeeded') {throw new Error('Yalnızca başarılı ödemeler iade edilebilir');}

            const stripeRefund = await this.stripe.refunds.create({
                charge: payment.stripe.chargeId,
                amount: Math.round(amount * 100),
                reason: this.mapRefundReason(reason),
                metadata: { paymentId, userId: payment.userId }
            });

            const refund = new Refund({
                refundId: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                paymentId,
                userId: payment.userId,
                amount,
                reason,
                status: stripeRefund.status === 'succeeded' ? 'succeeded' : 'processing',
                requestor,
                stripe: { refundId: stripeRefund.id }
            });

            await refund.save();

            // Update payment
            payment.status = amount === payment.amount ? 'refunded' : 'partial_refunded';
            payment.refund = {
                refundId: refund._id,
                amount,
                reason,
                timestamp: new Date()
            };
            await payment.save();

            recordEvent('refund_processed', { paymentId, amount, refundId: refund._id });
            return refund;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Fraud Detection
    async detectFraud(payment) {
        try {
            const fraudChecks = [];
            let riskLevel = 'low';

            // Check 1: Amount anomaly
            const userPayments = await Payment.find({ userId: payment.userId });
            const avgAmount = userPayments.reduce((sum, p) => sum + p.amount, 0) / userPayments.length;
            if (payment.amount > avgAmount * 3) {
                fraudChecks.push('amount_anomaly');
                riskLevel = 'medium';
            }

            // Check 2: Velocity check
            const recentPayments = await Payment.find({
                userId: payment.userId,
                createdAt: { $gte: new Date(Date.now() - 3600000) } // Last hour
            });
            if (recentPayments.length > 5) {
                fraudChecks.push('high_velocity');
                riskLevel = 'high';
            }

            // Check 3: Country mismatch
            if (payment.billingAddress.country !== payment.metadata?.country) {
                fraudChecks.push('country_mismatch');
                riskLevel = riskLevel === 'high' ? 'high' : 'medium';
            }

            // Check 4: New card
            const userCards = await Payment.find({ userId: payment.userId });
            const cardExists = userCards.some(p => p.paymentMethod.last4 === payment.paymentMethod.last4);
            if (!cardExists && userCards.length > 0) {
                fraudChecks.push('new_card');
                riskLevel = riskLevel === 'high' ? 'high' : 'medium';
            }

            recordEvent('fraud_check_completed', { riskLevel, checks: fraudChecks });

            return {
                riskLevel,
                fraudChecks,
                flagged: riskLevel === 'high',
                requiresReview: riskLevel === 'high'
            };
        } catch (error) {
            Sentry.captureException(error);
            return { riskLevel: 'low', fraudChecks: [], flagged: false };
        }
    }

    // Payment Statistics
    async getPaymentStats(userId) {
        try {
            const payments = await Payment.find({ userId, status: 'succeeded' });
            const refunds = await Refund.find({ userId, status: 'succeeded' });

            const stats = {
                totalPayments: payments.length,
                totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
                totalRefunds: refunds.reduce((sum, r) => sum + r.amount, 0),
                averageTransaction: payments.length > 0 ? payments.reduce((sum, p) => sum + p.amount, 0) / payments.length : 0,
                byPaymentMethod: {},
                byStatus: {}
            };

            // Group by payment method
            for (const payment of payments) {
                const method = payment.paymentMethod.type;
                stats.byPaymentMethod[method] = (stats.byPaymentMethod[method] || 0) + payment.amount;
            }

            // Count by status
            const allPayments = await Payment.find({ userId });
            for (const payment of allPayments) {
                stats.byStatus[payment.status] = (stats.byStatus[payment.status] || 0) + 1;
            }

            recordEvent('payment_stats_calculated', stats);
            return stats;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Webhook Handler (Stripe)
    async handleStripeWebhook(event) {
        try {
            switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handlePaymentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;
            case 'charge.refunded':
                await this.handleChargeRefunded(event.data.object);
                break;
            }

            recordEvent('stripe_webhook_processed', { type: event.type });
            return { received: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async handlePaymentSucceeded(paymentIntent) {
        const payment = await Payment.findOneAndUpdate(
            { 'stripe.paymentIntentId': paymentIntent.id },
            { status: 'succeeded', completedAt: new Date() },
            { new: true }
        );
        recordEvent('webhook_payment_succeeded', { paymentId: payment?._id });
    }

    async handlePaymentFailed(paymentIntent) {
        const payment = await Payment.findOneAndUpdate(
            { 'stripe.paymentIntentId': paymentIntent.id },
            { status: 'failed' },
            { new: true }
        );
        recordEvent('webhook_payment_failed', { paymentId: payment?._id });
    }

    async handleChargeRefunded(charge) {
        const payment = await Payment.findOneAndUpdate(
            { 'stripe.chargeId': charge.id },
            { status: 'refunded' },
            { new: true }
        );
        recordEvent('webhook_charge_refunded', { paymentId: payment?._id });
    }

    // Helper Methods
    mapRefundReason(reason) {
        const reasonMap = {
            'duplicate': 'duplicate',
            'fraudulent': 'fraudulent',
            'requested_by_customer': 'requested_by_customer',
            'cancelled_order': 'requested_by_customer',
            'defective_product': 'requested_by_customer'
        };
        return reasonMap[reason] || 'requested_by_customer';
    }
}

module.exports = { PaymentService, Payment, Refund };
