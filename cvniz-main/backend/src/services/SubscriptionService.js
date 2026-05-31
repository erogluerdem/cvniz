const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// Subscription Plan Schema
const subscriptionPlanSchema = new mongoose.Schema({
    planId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: String,

    pricing: {
        monthlyPrice: Number,
        yearlyPrice: Number,
        currency: { type: String, default: 'USD' },
        setupFee: { type: Number, default: 0 },
        trialDays: { type: Number, default: 0 }
    },

    features: {
        included: [String],
        limits: Map
    },

    billing: {
        billingCycle: { type: String, enum: ['monthly', 'annual'], default: 'monthly' },
        autoRenewal: { type: Boolean, default: true },
        cancellationPolicy: String,
        proration: { type: Boolean, default: true }
    },

    tier: { type: String, enum: ['free', 'starter', 'professional', 'enterprise'], default: 'starter' },
    status: { type: String, enum: ['active', 'inactive', 'deprecated'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

subscriptionPlanSchema.index({ tier: 1, status: 1 });

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
    subscriptionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    planId: { type: String, required: true },

    status: {
        current: { type: String, enum: ['active', 'past_due', 'canceled', 'ended', 'trialing'], default: 'active' },
        reason: String,
        canceledAt: Date,
        endedAt: Date
    },

    billing: {
        currency: String,
        currentPeriodStart: Date,
        currentPeriodEnd: Date,
        nextBillingDate: Date,
        billingCycle: { type: String, enum: ['monthly', 'annual'] },
        autoRenewal: { type: Boolean, default: true }
    },

    pricing: {
        basePrice: Number,
        discount: Number,
        tax: Number,
        total: Number,
        history: [{
            date: Date,
            amount: Number,
            reason: String
        }]
    },

    payment: {
        paymentMethodId: String,
        lastPaymentId: String,
        lastPaymentDate: Date,
        nextPaymentAmount: Number,
        failedAttempts: { type: Number, default: 0 },
        lastFailureReason: String
    },

    trial: {
        isTrialing: Boolean,
        trialStart: Date,
        trialEnd: Date,
        trialConvertedAt: Date
    },

    usage: {
        messageCount: { type: Number, default: 0 },
        parseCount: { type: Number, default: 0 },
        interviewCount: { type: Number, default: 0 },
        jobApplications: { type: Number, default: 0 },
        lastResetDate: Date
    },

    dunning: {
        enabled: { type: Boolean, default: true },
        attempts: [{
            attemptNumber: Number,
            date: Date,
            status: { type: String, enum: ['pending', 'sent', 'failed', 'succeeded'] },
            amount: Number,
            nextRetryDate: Date
        }],
        status: { type: String, enum: ['none', 'active', 'final_attempt', 'exhausted'], default: 'none' }
    },

    metadata: {
        notes: String,
        tags: [String],
        source: String
    },

    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

subscriptionSchema.index({ userId: 1, 'status.current': 1 });
subscriptionSchema.index({ 'billing.nextBillingDate': 1 });

// Subscription Invoice Schema
const subscriptionInvoiceSchema = new mongoose.Schema({
    invoiceId: { type: String, required: true, unique: true, index: true },
    subscriptionId: String,
    userId: { type: String, required: true, index: true },

    period: {
        startDate: Date,
        endDate: Date
    },

    amount: Number,
    status: { type: String, enum: ['draft', 'open', 'paid', 'void', 'uncollectible'], default: 'open' },

    items: [{
        description: String,
        amount: Number,
        tax: Number
    }],

    payment: {
        paidDate: Date,
        paidAmount: Number,
        paymentMethod: String
    },

    attempts: [{
        attemptNumber: Number,
        date: Date,
        status: String,
        errorReason: String
    }],

    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

subscriptionInvoiceSchema.index({ userId: 1, createdAt: -1 });

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);
const SubscriptionInvoice = mongoose.model('SubscriptionInvoice', subscriptionInvoiceSchema);

class SubscriptionService {
    // Get Plans
    async getPlans(filter = {}) {
        try {
            const plans = await SubscriptionPlan.find({ status: 'active', ...filter }).sort({ tier: 1 });
            recordEvent('subscription_plans_retrieved', { count: plans.length });
            return plans;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Get Plan
    async getPlan(planId) {
        try {
            const plan = await SubscriptionPlan.findOne({ planId });
            if (!plan) {throw new Error('Plan bulunamadı');}

            recordEvent('subscription_plan_retrieved', { planId });
            return plan;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Create Subscription
    async createSubscription(userId, planId, billingCycle = 'monthly') {
        try {
            const plan = await this.getPlan(planId);
            const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            const price = billingCycle === 'annual' ? plan.pricing.yearlyPrice : plan.pricing.monthlyPrice;
            const currentPeriodStart = new Date();
            const currentPeriodEnd = new Date();
            currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + (billingCycle === 'annual' ? 12 : 1));

            const subscription = new Subscription({
                subscriptionId,
                userId,
                planId,
                'status.current': plan.pricing.trialDays > 0 ? 'trialing' : 'active',
                'billing.currency': plan.pricing.currency,
                'billing.currentPeriodStart': currentPeriodStart,
                'billing.currentPeriodEnd': currentPeriodEnd,
                'billing.nextBillingDate': currentPeriodEnd,
                'billing.billingCycle': billingCycle,
                'pricing.basePrice': price,
                'pricing.total': price,
                'trial.isTrialing': plan.pricing.trialDays > 0,
                'trial.trialStart': plan.pricing.trialDays > 0 ? currentPeriodStart : null,
                'trial.trialEnd': plan.pricing.trialDays > 0 ?
                    new Date(currentPeriodStart.getTime() + plan.pricing.trialDays * 24 * 60 * 60 * 1000) : null
            });

            await subscription.save();
            recordEvent('subscription_created', { userId, planId, subscriptionId, billingCycle });
            return subscription;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Get User Subscription
    async getUserSubscription(userId) {
        try {
            const subscription = await Subscription.findOne({
                userId,
                'status.current': { $in: ['active', 'trialing', 'past_due'] }
            });

            if (!subscription) {
                // Return free plan
                return { planId: 'free', tier: 'free' };
            }

            recordEvent('user_subscription_retrieved', { userId, planId: subscription.planId });
            return subscription;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Upgrade/Downgrade Subscription
    async updateSubscription(userId, newPlanId) {
        try {
            const currentSub = await Subscription.findOne({ userId, 'status.current': 'active' });
            const newPlan = await this.getPlan(newPlanId);

            if (!currentSub) {throw new Error('Aktif abonelik bulunamadı');}

            const currentPlan = await this.getPlan(currentSub.planId);
            const proratedAmount = this.calculateProration(currentSub, currentPlan, newPlan);

            // Update subscription
            const updated = await Subscription.findByIdAndUpdate(
                currentSub._id,
                {
                    planId: newPlanId,
                    'pricing.basePrice': newPlan.pricing.monthlyPrice,
                    'pricing.discount': -proratedAmount, // Negative for credit
                    'pricing.total': newPlan.pricing.monthlyPrice - proratedAmount,
                    updatedAt: new Date()
                },
                { new: true }
            );

            recordEvent('subscription_upgraded', { userId, from: currentSub.planId, to: newPlanId, credit: proratedAmount });
            return updated;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Cancel Subscription
    async cancelSubscription(userId, reason, immediate = false) {
        try {
            const subscription = await Subscription.findOne({ userId, 'status.current': 'active' });
            if (!subscription) {throw new Error('Aktif abonelik bulunamadı');}

            const cancelDate = immediate ? new Date() : subscription.billing.currentPeriodEnd;

            const updated = await Subscription.findByIdAndUpdate(
                subscription._id,
                {
                    'status.current': 'canceled',
                    'status.reason': reason,
                    'status.canceledAt': new Date(),
                    'status.endedAt': cancelDate,
                    'billing.autoRenewal': false,
                    updatedAt: new Date()
                },
                { new: true }
            );

            recordEvent('subscription_canceled', { userId, reason, immediate });
            return updated;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Check Usage Limits
    async checkUsageLimit(userId, feature) {
        try {
            const subscription = await this.getUserSubscription(userId);
            const plan = await this.getPlan(subscription.planId);

            if (!plan) {return { allowed: true };}

            const limits = plan.features.limits;
            const currentUsage = subscription.usage[`${feature}Count`] || 0;
            const limit = limits.get(`${feature}_limit`) || Infinity;

            const allowed = currentUsage < limit;

            recordEvent('usage_limit_checked', { userId, feature, usage: currentUsage, limit });
            return { allowed, usage: currentUsage, limit };
        } catch (error) {
            Sentry.captureException(error);
            return { allowed: true };
        }
    }

    // Increment Usage
    async incrementUsage(userId, feature) {
        try {
            const subscription = await Subscription.findOne({ userId, 'status.current': 'active' });
            if (!subscription) {return;}

            const field = `usage.${feature}Count`;
            await Subscription.findByIdAndUpdate(
                subscription._id,
                { $inc: { [field]: 1 } }
            );

            recordEvent('usage_incremented', { userId, feature });
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    // Process Dunning
    async processDunning() {
        try {
            const pastDueSubscriptions = await Subscription.find({
                'status.current': 'past_due',
                'payment.failedAttempts': { $lt: 3 }
            });

            for (const subscription of pastDueSubscriptions) {
                // Create dunning attempt
                const attemptNumber = subscription.dunning.attempts.length + 1;
                const nextRetryDate = new Date();
                nextRetryDate.setDate(nextRetryDate.getDate() + attemptNumber); // Retry after N days

                subscription.dunning.attempts.push({
                    attemptNumber,
                    date: new Date(),
                    status: 'pending',
                    amount: subscription.pricing.total,
                    nextRetryDate
                });

                if (attemptNumber >= 3) {
                    subscription.dunning.status = 'final_attempt';
                }

                await subscription.save();
            }

            recordEvent('dunning_processed', { count: pastDueSubscriptions.length });
            return pastDueSubscriptions;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Calculate Proration
    calculateProration(currentSub, currentPlan, newPlan) {
        const daysRemaining = Math.ceil(
            (currentSub.billing.currentPeriodEnd - new Date()) / (1000 * 60 * 60 * 24)
        );

        const dailyRate = currentPlan.pricing.monthlyPrice / 30;
        const creditAmount = dailyRate * daysRemaining;
        const newDailyRate = newPlan.pricing.monthlyPrice / 30;
        const chargeAmount = newDailyRate * daysRemaining;

        return chargeAmount - creditAmount;
    }

    // Create Subscription Invoice
    async createSubscriptionInvoice(subscriptionId) {
        try {
            const subscription = await Subscription.findOne({ subscriptionId });
            if (!subscription) {throw new Error('Abonelik bulunamadı');}

            const invoiceId = `sinv_${Date.now()}`;
            const invoice = new SubscriptionInvoice({
                invoiceId,
                subscriptionId,
                userId: subscription.userId,
                period: {
                    startDate: subscription.billing.currentPeriodStart,
                    endDate: subscription.billing.currentPeriodEnd
                },
                amount: subscription.pricing.total,
                items: [{
                    description: `Subscription for ${subscription.billing.billingCycle} period`,
                    amount: subscription.pricing.basePrice,
                    tax: subscription.pricing.tax || 0
                }]
            });

            await invoice.save();
            recordEvent('subscription_invoice_created', { subscriptionId, invoiceId });
            return invoice;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Get Subscription Statistics
    async getSubscriptionStats() {
        try {
            const activeSubscriptions = await Subscription.countDocuments({ 'status.current': 'active' });
            const trialingSubscriptions = await Subscription.countDocuments({ 'status.current': 'trialing' });
            const canceledSubscriptions = await Subscription.countDocuments({ 'status.current': 'canceled' });

            const stats = {
                activeSubscriptions,
                trialingSubscriptions,
                canceledSubscriptions,
                mrr: await this.calculateMRR(),
                arr: await this.calculateARR(),
                churnRate: await this.calculateChurnRate()
            };

            recordEvent('subscription_stats_calculated', stats);
            return stats;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async calculateMRR() {
        const subscriptions = await Subscription.find({ 'status.current': 'active', 'billing.billingCycle': 'monthly' });
        return subscriptions.reduce((sum, sub) => sum + sub.pricing.total, 0);
    }

    async calculateARR() {
        const mrr = await this.calculateMRR();
        return mrr * 12;
    }

    async calculateChurnRate() {
        const canceledThisMonth = await Subscription.countDocuments({
            'status.current': 'canceled',
            'status.canceledAt': { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
        });

        const totalSubscriptions = await Subscription.countDocuments({ 'status.current': 'active' });
        return totalSubscriptions > 0 ? (canceledThisMonth / totalSubscriptions * 100).toFixed(2) : 0;
    }
}

module.exports = { SubscriptionService, SubscriptionPlan, Subscription, SubscriptionInvoice };
