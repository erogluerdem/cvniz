const express = require('express');
const router = express.Router();
const monitoringService = require('../services/MonitoringService');
const { authenticate } = require('../middleware/auth');

/**
 * @desc    Get system health status
 * @route   GET /api/monitoring/health
 * @access  Public
 */
router.get('/health', async (req, res) => {
    try {
        const health = await monitoringService.getSystemHealth();
        res.json(health);
    } catch (error) {
        console.error('Health Check Error:', error);
        res.status(500).json({ status: 'unhealthy', error: error.message });
    }
});

/**
 * @desc    Get feature adoption metrics
 * @route   GET /api/monitoring/features
 * @access  Private/Admin
 */
router.get('/features', authenticate, async (req, res) => {
    try {
        // Check if admin
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const metrics = await monitoringService.getFeatureAdoptionMetrics();
        res.json({
            success: true,
            ...metrics
        });
    } catch (error) {
        console.error('Feature Adoption Error:', error);
        res.status(500).json({ error: 'Failed to fetch feature adoption metrics' });
    }
});

/**
 * @desc    Get user retention metrics
 * @route   GET /api/monitoring/retention
 * @access  Private/Admin
 */
router.get('/retention', authenticate, async (req, res) => {
    try {
        // Check if admin
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const metrics = await monitoringService.getUserRetentionMetrics();
        res.json({
            success: true,
            ...metrics
        });
    } catch (error) {
        console.error('Retention Metrics Error:', error);
        res.status(500).json({ error: 'Failed to fetch retention metrics' });
    }
});

/**
 * @desc    Get metrics report
 * @route   GET /api/monitoring/report
 * @access  Private/Admin
 * @query   startDate, endDate
 */
router.get('/report', authenticate, async (req, res) => {
    try {
        // Check if admin
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { startDate = new Date(Date.now() - 30 * 86400000), endDate = new Date() } = req.query;

        const report = await monitoringService.getMetricsReport(
            new Date(startDate),
            new Date(endDate)
        );

        res.json({
            success: true,
            ...report
        });
    } catch (error) {
        console.error('Metrics Report Error:', error);
        res.status(500).json({ error: 'Failed to generate metrics report' });
    }
});

/**
 * @desc    Get system alerts
 * @route   GET /api/monitoring/alerts
 * @access  Private/Admin
 */
router.get('/alerts', authenticate, async (req, res) => {
    try {
        // Check if admin
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const CacheService = require('../services/CacheService');
        const alertsRaw = await CacheService.lrange('system:alerts', 0, -1);
        const alerts = alertsRaw.map(a => JSON.parse(a));

        res.json({
            success: true,
            total: alerts.length,
            alerts: alerts.slice(-20) // Last 20 alerts
        });
    } catch (error) {
        console.error('Get Alerts Error:', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

/**
 * @desc    Get API performance metrics
 * @route   GET /api/monitoring/performance
 * @access  Private/Admin
 * @query   endpoint (optional filter)
 */
router.get('/performance', authenticate, async (req, res) => {
    try {
        // Check if admin
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { endpoint } = req.query;
        const CacheService = require('../services/CacheService');

        // Get all performance metrics
        let pattern = 'metric:endpoint:*:stats';
        if (endpoint) {
            pattern = `metric:endpoint:${endpoint}:*:stats`;
        }

        const keys = await CacheService.keys(pattern);
        const metrics = [];

        for (const key of keys) {
            const data = await CacheService.get(key);
            if (data) {
                const parsed = JSON.parse(data);
                const keyParts = key.split(':');
                metrics.push({
                    endpoint: keyParts[2],
                    method: keyParts[3],
                    ...parsed
                });
            }
        }

        res.json({
            success: true,
            totalMetrics: metrics.length,
            metrics: metrics.sort((a, b) => b.avgTime - a.avgTime)
        });
    } catch (error) {
        console.error('Performance Metrics Error:', error);
        res.status(500).json({ error: 'Failed to fetch performance metrics' });
    }
});

/**
 * @desc    Get database performance metrics
 * @route   GET /api/monitoring/database
 * @access  Private/Admin
 */
router.get('/database', authenticate, async (req, res) => {
    try {
        // Check if admin
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const CacheService = require('../services/CacheService');
        const keys = await CacheService.keys('metric:db:*:stats');
        const dbMetrics = [];

        for (const key of keys) {
            const data = await CacheService.get(key);
            if (data) {
                const parsed = JSON.parse(data);
                const keyParts = key.split(':');
                dbMetrics.push({
                    collection: keyParts[2],
                    operation: keyParts[3],
                    ...parsed
                });
            }
        }

        res.json({
            success: true,
            totalOperations: dbMetrics.length,
            metrics: dbMetrics.sort((a, b) => b.avgTime - a.avgTime)
        });
    } catch (error) {
        console.error('Database Metrics Error:', error);
        res.status(500).json({ error: 'Failed to fetch database metrics' });
    }
});

/**
 * @desc    Get cache performance metrics
 * @route   GET /api/monitoring/cache
 * @access  Private/Admin
 */
router.get('/cache', authenticate, async (req, res) => {
    try {
        // Check if admin
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const CacheService = require('../services/CacheService');
        const keys = await CacheService.keys('metric:cache:*:stats');
        const cacheMetrics = [];

        for (const key of keys) {
            const data = await CacheService.get(key);
            if (data) {
                const parsed = JSON.parse(data);
                const operation = key.split(':')[2];
                cacheMetrics.push({
                    operation,
                    ...parsed
                });
            }
        }

        res.json({
            success: true,
            totalOperations: cacheMetrics.length,
            metrics: cacheMetrics
        });
    } catch (error) {
        console.error('Cache Metrics Error:', error);
        res.status(500).json({ error: 'Failed to fetch cache metrics' });
    }
});

module.exports = router;
