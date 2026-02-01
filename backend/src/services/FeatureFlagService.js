const CacheService = require('./CacheService');
const * as Sentry from '@sentry/node';

/**
 * Feature Flags Service
 * Dynamic feature management and gradual rollouts
 */
class FeatureFlagService {
    constructor() {
        this.flags = new Map();
        this.variants = new Map();
        this.loadDefaultFlags();
    }

    /**
     * Load default feature flags
     */
    loadDefaultFlags() {
        const defaultFlags = {
            // AI Features
            'ai.interview_prep': { enabled: true, rollout: 100, description: 'Interview prep generator' },
            'ai.skill_gap_analysis': { enabled: true, rollout: 100, description: 'Skill gap analyzer' },
            'ai.cv_scoring': { enabled: true, rollout: 100, description: 'CV scoring engine' },
            'ai.formatting_tips': { enabled: true, rollout: 100, description: 'Formatting tips' },

            // Recommendations
            'recommendations.enabled': { enabled: true, rollout: 100, description: 'Job recommendations' },
            'recommendations.trending': { enabled: true, rollout: 100, description: 'Trending jobs' },
            'recommendations.salary_prediction': { enabled: true, rollout: 100, description: 'Salary prediction' },

            // Monitoring
            'monitoring.dashboard': { enabled: true, rollout: 100, description: 'Analytics dashboard' },
            'monitoring.alerts': { enabled: true, rollout: 100, description: 'System alerts' },

            // Beta Features
            'beta.advanced_cv_analysis': { enabled: false, rollout: 0, description: 'Advanced CV analysis' },
            'beta.interview_video': { enabled: false, rollout: 0, description: 'Video interview practice' },
            'beta.mock_interviews': { enabled: false, rollout: 30, description: 'Mock interviews' },

            // Experiments
            'experiment.recommendation_algorithm_v2': { enabled: true, rollout: 50, description: 'New matching algorithm' },
            'experiment.ui_redesign': { enabled: true, rollout: 25, description: 'New UI design' },

            // Maintenance
            'maintenance.readonly_mode': { enabled: false, rollout: 0, description: 'Read-only mode' },
            'maintenance.feature_limited': { enabled: false, rollout: 0, description: 'Limited features mode' }
        };

        for (const [name, config] of Object.entries(defaultFlags)) {
            this.flags.set(name, {
                ...config,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }

    /**
     * Check if feature is enabled for user
     */
    async isFeatureEnabled(featureName, userId = null, context = {}) {
        try {
            // Check cache first
            const cacheKey = `feature_flag:${featureName}:${userId || 'anonymous'}`;
            const cached = await CacheService.get(cacheKey);
            if (cached !== null) {
                return JSON.parse(cached);
            }

            const flag = this.flags.get(featureName);

            // Feature not found
            if (!flag) {
                console.warn(`Feature flag not found: ${featureName}`);
                return false;
            }

            // Feature disabled globally
            if (!flag.enabled) {
                await CacheService.set(cacheKey, JSON.stringify(false), 3600);
                return false;
            }

            // Check rollout percentage
            const isEnabled = this.checkRollout(featureName, userId, flag.rollout);

            // Check user segments/context
            if (isEnabled && context) {
                const passesContext = await this.checkContext(featureName, userId, context);
                const result = isEnabled && passesContext;
                await CacheService.set(cacheKey, JSON.stringify(result), 3600);
                return result;
            }

            await CacheService.set(cacheKey, JSON.stringify(isEnabled), 3600);
            return isEnabled;

        } catch (err) {
            console.error('Feature Flag Check Error:', err);
            Sentry.captureException(err);
            // Fail safely - disable feature on error
            return false;
        }
    }

    /**
     * Check rollout percentage using consistent hashing
     */
    checkRollout(featureName, userId, rolloutPercent) {
        if (rolloutPercent >= 100) return true;
        if (rolloutPercent <= 0) return false;

        // Use consistent hashing for stable rollout
        const hash = this.hashCode(`${featureName}:${userId || 'anonymous'}`);
        const percentage = Math.abs(hash) % 100;

        return percentage < rolloutPercent;
    }

    /**
     * Simple hash function for consistent hashing
     */
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Check user context/segments
     */
    async checkContext(featureName, userId, context) {
        try {
            // Example context checks
            const { userRole, userTier, country, browser } = context;

            // Role-based access
            if (featureName.includes('enterprise')) {
                return userRole === 'admin' || userTier === 'enterprise';
            }

            // Tier-based access
            if (featureName.includes('premium')) {
                return userTier === 'premium' || userTier === 'enterprise';
            }

            // Beta features only for specific users
            if (featureName.includes('beta')) {
                return await this.isBetaTester(userId);
            }

            return true;
        } catch (err) {
            console.error('Context Check Error:', err);
            return true;
        }
    }

    /**
     * Check if user is beta tester
     */
    async isBetaTester(userId) {
        try {
            if (!userId) return false;

            const betaKey = `beta_tester:${userId}`;
            const isBeta = await CacheService.get(betaKey);

            if (isBeta !== null) {
                return JSON.parse(isBeta);
            }

            // Check in database
            const User = require('../models/User');
            const user = await User.findById(userId).select('betaTester');

            const result = user?.betaTester || false;
            await CacheService.set(betaKey, JSON.stringify(result), 86400); // Cache 24h

            return result;
        } catch (err) {
            console.error('Beta Tester Check Error:', err);
            return false;
        }
    }

    /**
     * Get all flags
     */
    getAllFlags() {
        return Array.from(this.flags.entries()).map(([name, config]) => ({
            name,
            ...config
        }));
    }

    /**
     * Get flag details
     */
    getFlag(featureName) {
        const flag = this.flags.get(featureName);
        if (!flag) return null;

        return {
            name: featureName,
            ...flag
        };
    }

    /**
     * Create or update flag
     */
    async setFlag(featureName, config) {
        try {
            const existingFlag = this.flags.get(featureName);
            
            const updatedFlag = {
                ...existingFlag,
                ...config,
                updatedAt: new Date(),
                createdAt: existingFlag?.createdAt || new Date()
            };

            this.flags.set(featureName, updatedFlag);

            // Invalidate cache
            const pattern = `feature_flag:${featureName}:*`;
            await CacheService.del(pattern);

            // Store in cache for persistence
            const cacheKey = `flag_config:${featureName}`;
            await CacheService.set(cacheKey, JSON.stringify(updatedFlag), 86400 * 30); // 30 days

            console.log(`Feature flag updated: ${featureName}`);
            return updatedFlag;

        } catch (err) {
            console.error('Set Flag Error:', err);
            Sentry.captureException(err);
            throw err;
        }
    }

    /**
     * Enable feature flag
     */
    async enableFlag(featureName, rolloutPercent = 100) {
        return this.setFlag(featureName, {
            enabled: true,
            rollout: rolloutPercent
        });
    }

    /**
     * Disable feature flag
     */
    async disableFlag(featureName) {
        return this.setFlag(featureName, {
            enabled: false,
            rollout: 0
        });
    }

    /**
     * Gradually roll out feature (increase percentage)
     */
    async rolloutFeature(featureName, percentage) {
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;

        return this.setFlag(featureName, {
            enabled: true,
            rollout: percentage
        });
    }

    /**
     * Get feature flag stats
     */
    async getStats(featureName) {
        try {
            const flag = this.flags.get(featureName);
            if (!flag) return null;

            // Get usage from cache
            const usageKey = `flag_usage:${featureName}`;
            const usageData = await CacheService.get(usageKey);
            const usage = usageData ? JSON.parse(usageData) : { enabled: 0, disabled: 0 };

            return {
                name: featureName,
                ...flag,
                usage,
                enabledPercentage: usage.enabled + usage.disabled > 0 
                    ? (usage.enabled / (usage.enabled + usage.disabled)) * 100 
                    : 0
            };
        } catch (err) {
            console.error('Get Stats Error:', err);
            return null;
        }
    }

    /**
     * Track feature usage
     */
    async trackUsage(featureName, userId, enabled) {
        try {
            const usageKey = `flag_usage:${featureName}`;
            const usageData = await CacheService.get(usageKey);
            const usage = usageData ? JSON.parse(usageData) : { enabled: 0, disabled: 0 };

            if (enabled) {
                usage.enabled++;
            } else {
                usage.disabled++;
            }

            await CacheService.set(usageKey, JSON.stringify(usage), 86400); // 24h

            // Track in analytics
            const MonitoringService = require('./MonitoringService');
            await MonitoringService.trackUserEngagement(userId, `feature_flag_${featureName}`, {
                enabled,
                timestamp: new Date()
            });
        } catch (err) {
            console.error('Track Usage Error:', err);
        }
    }

    /**
     * Get feature flags for frontend
     */
    async getFlagsForFrontend(userId = null) {
        try {
            const flags = this.getAllFlags();
            const result = {};

            for (const flag of flags) {
                const isEnabled = await this.isFeatureEnabled(flag.name, userId);
                result[flag.name] = {
                    enabled: isEnabled,
                    rollout: flag.rollout
                };
            }

            return result;
        } catch (err) {
            console.error('Get Frontend Flags Error:', err);
            return {};
        }
    }
}

module.exports = new FeatureFlagService();
