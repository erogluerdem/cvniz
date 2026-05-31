const AIUsageLog = require('../models/AIUsageLog');
const CVView = require('../models/CVView');
const User = require('../models/User');
const CacheService = require('./CacheService');

const AnalyticsService = {
    // Track AI feature usage
    async trackAIUsage(userId, action, details = {}) {
        try {
            await AIUsageLog.create({
                userId,
                action,
                details,
                timestamp: new Date()
            });

            // Invalidate cache for this user's stats
            await CacheService.del(`user:${userId}:ai-stats`);
        } catch (err) {
            console.error('Error tracking AI usage:', err);
        }
    },

    // Get user's AI usage statistics
    async getAIStats(userId) {
        try {
            // Check cache first
            const cached = await CacheService.get(`user:${userId}:ai-stats`);
            if (cached) {return cached;}

            const stats = await AIUsageLog.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: '$action',
                        count: { $sum: 1 },
                        lastUsed: { $max: '$timestamp' }
                    }
                }
            ]);

            // Cache for 1 hour
            await CacheService.set(`user:${userId}:ai-stats`, stats, 3600);
            return stats;
        } catch (err) {
            console.error('Error getting AI stats:', err);
            return [];
        }
    },

    // Track CV views
    async trackCVView(cvId, viewerId = null) {
        try {
            await CVView.create({
                cvId,
                viewerId,
                viewedAt: new Date()
            });

            // Invalidate cache
            await CacheService.del(`cv:${cvId}:views`);
        } catch (err) {
            console.error('Error tracking CV view:', err);
        }
    },

    // Get CV view statistics
    async getCVViewStats(cvId) {
        try {
            const cached = await CacheService.get(`cv:${cvId}:views`);
            if (cached) {return cached;}

            const stats = await CVView.aggregate([
                { $match: { cvId } },
                {
                    $group: {
                        _id: null,
                        totalViews: { $sum: 1 },
                        uniqueViewers: { $addToSet: '$viewerId' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalViews: 1,
                        uniqueViewersCount: { $size: '$uniqueViewers' }
                    }
                }
            ]);

            const result = stats[0] || { totalViews: 0, uniqueViewersCount: 0 };
            await CacheService.set(`cv:${cvId}:views`, result, 3600);
            return result;
        } catch (err) {
            console.error('Error getting CV view stats:', err);
            return { totalViews: 0, uniqueViewersCount: 0 };
        }
    },

    // Get user engagement dashboard
    async getUserEngagementMetrics(userId) {
        try {
            const cacheKey = `user:${userId}:engagement`;
            const cached = await CacheService.get(cacheKey);
            if (cached) {return cached;}

            const [user, cvViews, aiUsage] = await Promise.all([
                User.findById(userId).select('createdAt lastLogin'),
                CVView.countDocuments({ viewerId: userId }),
                AIUsageLog.countDocuments({ userId })
            ]);

            const metrics = {
                accountAge: user ? Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) : 0,
                totalCVViews: cvViews,
                totalAIUsage: aiUsage,
                lastLogin: user?.lastLogin
            };

            await CacheService.set(cacheKey, metrics, 3600);
            return metrics;
        } catch (err) {
            console.error('Error getting engagement metrics:', err);
            return {};
        }
    },

    // A/B Test tracking
    async recordABTestEvent(userId, testId, variant, eventType) {
        try {
            // Log to dedicated AB Test collection
            const ABTest = require('../models/ABTest');
            await ABTest.create({
                userId,
                testId,
                variant,
                eventType,
                timestamp: new Date()
            });
        } catch (err) {
            console.error('Error recording A/B test event:', err);
        }
    },

    // Get conversion rates for A/B tests
    async getABTestConversionRates(testId) {
        try {
            const ABTest = require('../models/ABTest');
            const conversionData = await ABTest.aggregate([
                { $match: { testId } },
                {
                    $group: {
                        _id: '$variant',
                        totalEvents: { $sum: 1 },
                        conversions: {
                            $sum: { $cond: [{ $eq: ['$eventType', 'conversion'] }, 1, 0] }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        totalEvents: 1,
                        conversions: 1,
                        conversionRate: {
                            $multiply: [
                                { $divide: ['$conversions', '$totalEvents'] },
                                100
                            ]
                        }
                    }
                }
            ]);

            return conversionData;
        } catch (err) {
            console.error('Error getting A/B test conversion rates:', err);
            return [];
        }
    }
};

module.exports = AnalyticsService;
