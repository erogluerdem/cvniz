/**
 * Premium Service
 * Premium features, memberships, and exclusive content management
 */

const express = require('express');
const router = express.Router();
const * as Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');
const User = require('../models/User');

/**
 * Premium Plan Schema
 */
const premiumPlanSchema = new (require('mongoose')).Schema({
    name: {
        type: String,
        enum: ['premium', 'pro', 'enterprise'],
        required: true,
        unique: true
    },
    price: {
        monthly: Number,
        yearly: Number
    },
    features: [{
        name: String,
        description: String,
        icon: String,
        enabled: Boolean
    }],
    limits: {
        chatbotMessages: Number,      // aylık mesaj sayısı
        resumeParsingQuota: Number,   // aylık ayrıştırma
        interviewsPerMonth: Number,   // aylık mülakat
        jobApplications: Number,       // iş başvurusu
        freelanceProjects: Number      // freelance proje
    },
    benefits: [String],
    supportLevel: {
        type: String,
        enum: ['email', 'priority', '24/7'],
        default: 'email'
    },
    customization: {
        profileBadge: Boolean,
        brandingRemoval: Boolean,
        customTheme: Boolean,
        whiteLabel: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'premium_plans' });

/**
 * Subscription Schema
 */
const subscriptionSchema = new (require('mongoose')).Schema({
    userId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    planId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'PremiumPlan',
        required: true
    },
    planName: String,
    status: {
        type: String,
        enum: ['active', 'canceled', 'expired', 'pending'],
        default: 'active'
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
        type: Boolean,
        default: true
    },
    paymentMethod: String,
    amount: Number,
    currency: {
        type: String,
        default: 'USD'
    },
    invoices: [require('mongoose').Schema.Types.ObjectId],
    
    // Usage tracking
    usageMetrics: {
        chatbotMessagesUsed: {
            type: Number,
            default: 0
        },
        resumeParsingUsed: {
            type: Number,
            default: 0
        },
        interviewsCompleted: {
            type: Number,
            default: 0
        },
        jobApplications: {
            type: Number,
            default: 0
        },
        freelanceProjectsActive: {
            type: Number,
            default: 0
        }
    },

    // Renewal info
    nextBillingDate: Date,
    renewalAttempts: {
        type: Number,
        default: 0
    },
    lastRenewalAttempt: Date,

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, { collection: 'subscriptions' });

module.exports = { premiumPlanSchema, subscriptionSchema };

/**
 * Premium Service Class
 */
class PremiumService {
    /**
     * Get all premium plans
     */
    static async getAllPlans() {
        try {
            const PremiumPlan = require('../models/PremiumPlan');
            return await PremiumPlan.find({}).lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get plan by name
     */
    static async getPlanByName(planName) {
        try {
            const PremiumPlan = require('../models/PremiumPlan');
            return await PremiumPlan.findOne({ name: planName }).lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Create subscription
     */
    static async createSubscription(userId, planId, billingCycle = 'monthly') {
        try {
            const PremiumPlan = require('../models/PremiumPlan');
            const Subscription = require('../models/Subscription');

            const plan = await PremiumPlan.findById(planId);
            if (!plan) throw new Error('Plan bulunamadı');

            const price = plan.price[billingCycle] || plan.price.monthly;

            const subscription = await Subscription.create({
                userId,
                planId,
                planName: plan.name,
                status: 'pending',
                billingCycle,
                startDate: new Date(),
                endDate: PremiumService.calculateEndDate(billingCycle),
                amount: price,
                usageMetrics: {
                    chatbotMessagesUsed: 0,
                    resumeParsingUsed: 0,
                    interviewsCompleted: 0,
                    jobApplications: 0,
                    freelanceProjectsActive: 0
                }
            });

            recordEvent('subscription_created', {
                userId,
                planId,
                billingCycle,
                amount: price
            });

            return subscription;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get user subscription
     */
    static async getUserSubscription(userId) {
        try {
            const Subscription = require('../models/Subscription');
            return await Subscription.findOne({ userId, status: 'active' })
                .populate('planId')
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Check subscription status
     */
    static async checkSubscriptionStatus(userId) {
        try {
            const subscription = await PremiumService.getUserSubscription(userId);

            if (!subscription) {
                return {
                    hasSubscription: false,
                    status: 'free',
                    plan: null
                };
            }

            const now = new Date();
            if (subscription.endDate < now) {
                return {
                    hasSubscription: false,
                    status: 'expired',
                    plan: subscription.planName
                };
            }

            return {
                hasSubscription: true,
                status: 'active',
                plan: subscription.planName,
                daysRemaining: Math.ceil((subscription.endDate - now) / (1000 * 60 * 60 * 24)),
                usageMetrics: subscription.usageMetrics
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Check usage limits
     */
    static async checkUsageLimit(userId, featureKey, amount = 1) {
        try {
            const subscription = await PremiumService.getUserSubscription(userId);

            // Free plan defaults
            const limits = {
                chatbotMessages: 50,
                resumeParsing: 3,
                interviews: 2,
                jobApplications: 5,
                freelanceProjects: 0
            };

            if (subscription) {
                Object.assign(limits, subscription.planId.limits);
            }

            const usageKey = featureKey + 'Used';
            const usage = subscription?.usageMetrics[usageKey] || 0;
            const limit = limits[featureKey] || 0;

            return {
                allowed: usage + amount <= limit,
                usage,
                limit,
                remaining: Math.max(0, limit - usage)
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Increment usage
     */
    static async incrementUsage(userId, featureKey, amount = 1) {
        try {
            const Subscription = require('../models/Subscription');
            const usageKey = `usageMetrics.${featureKey}Used`;

            await Subscription.updateOne(
                { userId, status: 'active' },
                { $inc: { [usageKey]: amount } }
            );

            recordEvent('usage_incremented', {
                userId,
                feature: featureKey,
                amount
            });
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    /**
     * Upgrade subscription
     */
    static async upgradeSubscription(userId, newPlanId) {
        try {
            const Subscription = require('../models/Subscription');
            const PremiumPlan = require('../models/PremiumPlan');

            const currentSub = await Subscription.findOne({ userId, status: 'active' });
            const newPlan = await PremiumPlan.findById(newPlanId);

            if (!currentSub || !newPlan) {
                throw new Error('Abonelik veya plan bulunamadı');
            }

            const prorationCredit = PremiumService.calculateProration(
                currentSub.startDate,
                currentSub.endDate,
                currentSub.amount
            );

            await Subscription.updateOne(
                { _id: currentSub._id },
                {
                    planId: newPlanId,
                    planName: newPlan.name,
                    updatedAt: new Date()
                }
            );

            recordEvent('subscription_upgraded', {
                userId,
                oldPlan: currentSub.planName,
                newPlan: newPlan.name,
                prorationCredit
            });

            return { success: true, prorationCredit };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Cancel subscription
     */
    static async cancelSubscription(userId, immediate = false) {
        try {
            const Subscription = require('../models/Subscription');

            const update = {
                status: immediate ? 'canceled' : 'canceled',
                autoRenew: false,
                updatedAt: new Date()
            };

            if (immediate) {
                update.endDate = new Date();
            }

            await Subscription.updateOne(
                { userId, status: 'active' },
                update
            );

            recordEvent('subscription_canceled', {
                userId,
                immediate
            });

            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get subscription history
     */
    static async getSubscriptionHistory(userId, limit = 10) {
        try {
            const Subscription = require('../models/Subscription');
            return await Subscription.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('planId')
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get premium features for plan
     */
    static async getPremiumFeatures(userId) {
        try {
            const subscription = await PremiumService.getUserSubscription(userId);

            const features = {
                chatbot: {
                    enabled: !!subscription,
                    priority: subscription?.planName === 'pro' || subscription?.planName === 'enterprise'
                },
                resumeParser: {
                    enabled: !!subscription,
                    advancedAnalysis: subscription?.planName === 'pro' || subscription?.planName === 'enterprise'
                },
                interviews: {
                    enabled: !!subscription,
                    unlimitedPractice: subscription?.planName === 'pro' || subscription?.planName === 'enterprise'
                },
                jobMatching: {
                    enabled: !!subscription,
                    aiPowered: subscription?.planName === 'pro' || subscription?.planName === 'enterprise'
                },
                freelanceMarketplace: {
                    enabled: subscription?.planName === 'pro' || subscription?.planName === 'enterprise',
                    commission: subscription?.planName === 'enterprise' ? 5 : 10
                },
                customization: {
                    enabled: subscription?.planName === 'enterprise'
                }
            };

            return features;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Calculate end date
     */
    static calculateEndDate(billingCycle) {
        const date = new Date();
        if (billingCycle === 'monthly') {
            date.setMonth(date.getMonth() + 1);
        } else if (billingCycle === 'yearly') {
            date.setFullYear(date.getFullYear() + 1);
        }
        return date;
    }

    /**
     * Calculate proration
     */
    static calculateProration(startDate, endDate, amount) {
        const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
        const remainingDays = (endDate - new Date()) / (1000 * 60 * 60 * 24);
        return (amount / totalDays) * remainingDays;
    }
}

/**
 * Routes
 */

// GET /api/premium/plans
router.get('/plans', async (req, res) => {
    try {
        const plans = await PremiumService.getAllPlans();
        res.json(plans);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/premium/subscription
router.get('/subscription', async (req, res) => {
    try {
        const subscription = await PremiumService.getUserSubscription(req.user._id);
        res.json(subscription);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/premium/status
router.get('/status', async (req, res) => {
    try {
        const status = await PremiumService.checkSubscriptionStatus(req.user._id);
        res.json(status);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/premium/subscribe
router.post('/subscribe', async (req, res) => {
    try {
        const { planId, billingCycle } = req.body;
        const subscription = await PremiumService.createSubscription(
            req.user._id,
            planId,
            billingCycle
        );
        res.json(subscription);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/premium/upgrade
router.post('/upgrade', async (req, res) => {
    try {
        const { planId } = req.body;
        const result = await PremiumService.upgradeSubscription(
            req.user._id,
            planId
        );
        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/premium/cancel
router.post('/cancel', async (req, res) => {
    try {
        const result = await PremiumService.cancelSubscription(
            req.user._id,
            req.body.immediate
        );
        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/premium/features
router.get('/features', async (req, res) => {
    try {
        const features = await PremiumService.getPremiumFeatures(req.user._id);
        res.json(features);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    PremiumService,
    premiumPlanSchema,
    subscriptionSchema
};
