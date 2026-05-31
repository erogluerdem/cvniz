const express = require('express');
const router = express.Router();
const featureFlagService = require('../services/FeatureFlagService');
const aBTestService = require('../services/ABTestService');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Admin only middleware
const adminOnly = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Authorization error' });
    }
};

/**
 * @desc    Get feature flags for user
 * @route   GET /api/experiments/feature-flags
 * @access  Private
 */
router.get('/feature-flags', authenticate, async (req, res) => {
    try {
        const flags = await featureFlagService.getFlagsForFrontend(req.user.id);

        res.json({
            success: true,
            flags
        });
    } catch (error) {
        console.error('Get Feature Flags Error:', error);
        res.status(500).json({ error: 'Failed to fetch feature flags' });
    }
});

/**
 * @desc    Check if specific feature is enabled
 * @route   GET /api/experiments/feature-enabled/:name
 * @access  Private
 */
router.get('/feature-enabled/:name', authenticate, async (req, res) => {
    try {
        const { name } = req.params;
        const enabled = await featureFlagService.isFeatureEnabled(
            name,
            req.user.id,
            { userRole: req.user.role }
        );

        res.json({
            success: true,
            feature: name,
            enabled
        });
    } catch (error) {
        console.error('Check Feature Error:', error);
        res.status(500).json({ error: 'Failed to check feature' });
    }
});

/**
 * @desc    Get all feature flags (Admin)
 * @route   GET /api/experiments/flags
 * @access  Private/Admin
 */
router.get('/flags', authenticate, adminOnly, async (req, res) => {
    try {
        const flags = featureFlagService.getAllFlags();

        res.json({
            success: true,
            total: flags.length,
            flags
        });
    } catch (error) {
        console.error('Get All Flags Error:', error);
        res.status(500).json({ error: 'Failed to fetch flags' });
    }
});

/**
 * @desc    Get single flag details (Admin)
 * @route   GET /api/experiments/flags/:name
 * @access  Private/Admin
 */
router.get('/flags/:name', authenticate, adminOnly, async (req, res) => {
    try {
        const { name } = req.params;
        const flag = featureFlagService.getFlag(name);

        if (!flag) {
            return res.status(404).json({ error: 'Flag not found' });
        }

        const stats = await featureFlagService.getStats(name);

        res.json({
            success: true,
            flag,
            stats
        });
    } catch (error) {
        console.error('Get Flag Error:', error);
        res.status(500).json({ error: 'Failed to fetch flag' });
    }
});

/**
 * @desc    Update feature flag (Admin)
 * @route   PUT /api/experiments/flags/:name
 * @access  Private/Admin
 * @body    enabled, rollout
 */
router.put('/flags/:name', [
    body('enabled').optional().isBoolean(),
    body('rollout').optional().isInt({ min: 0, max: 100 })
], authenticate, adminOnly, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.params;
        const { enabled, rollout } = req.body;

        const updated = await featureFlagService.setFlag(name, { enabled, rollout });

        res.json({
            success: true,
            message: `Flag '${name}' updated`,
            flag: updated
        });
    } catch (error) {
        console.error('Update Flag Error:', error);
        res.status(500).json({ error: 'Failed to update flag' });
    }
});

/**
 * @desc    Rollout feature gradually (Admin)
 * @route   POST /api/experiments/flags/:name/rollout
 * @access  Private/Admin
 * @body    percentage
 */
router.post('/flags/:name/rollout', [
    body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be 0-100')
], authenticate, adminOnly, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.params;
        const { percentage } = req.body;

        const updated = await featureFlagService.rolloutFeature(name, percentage);

        res.json({
            success: true,
            message: `Feature '${name}' rolled out to ${percentage}%`,
            flag: updated
        });
    } catch (error) {
        console.error('Rollout Error:', error);
        res.status(500).json({ error: 'Failed to rollout feature' });
    }
});

/**
 * @desc    Get A/B test variant for user
 * @route   GET /api/experiments/ab-test/:experimentId
 * @access  Private
 */
router.get('/ab-test/:experimentId', authenticate, async (req, res) => {
    try {
        const { experimentId } = req.params;
        const assignment = await aBTestService.assignVariant(experimentId, req.user.id);

        res.json({
            success: true,
            ...assignment
        });
    } catch (error) {
        console.error('Get Variant Error:', error);
        res.status(500).json({ error: 'Failed to get variant' });
    }
});

/**
 * @desc    Record event for A/B test
 * @route   POST /api/experiments/ab-test/:experimentId/event
 * @access  Private
 * @body    variant, eventType, metadata
 */
router.post('/ab-test/:experimentId/event', [
    body('variant').notEmpty().withMessage('Variant is required'),
    body('eventType').notEmpty().withMessage('Event type is required')
], authenticate, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { experimentId } = req.params;
        const { variant, eventType, metadata = {} } = req.body;

        await aBTestService.trackEvent(experimentId, req.user.id, variant, eventType, metadata);

        res.json({
            success: true,
            message: 'Event recorded'
        });
    } catch (error) {
        console.error('Record Event Error:', error);
        res.status(500).json({ error: 'Failed to record event' });
    }
});

/**
 * @desc    Get A/B test results (Admin)
 * @route   GET /api/experiments/ab-test/:experimentId/results
 * @access  Private/Admin
 */
router.get('/ab-test/:experimentId/results', authenticate, adminOnly, async (req, res) => {
    try {
        const { experimentId } = req.params;
        const results = await aBTestService.getResults(experimentId);

        if (!results) {
            return res.status(404).json({ error: 'Experiment not found' });
        }

        // Calculate significance
        const controlKey = Object.keys(results.variants)[0];
        const variantKey = Object.keys(results.variants)[1];

        let significance = null;
        if (results.results[controlKey] && results.results[variantKey]) {
            significance = aBTestService.calculateSignificance(
                results.results[controlKey],
                results.results[variantKey]
            );
        }

        res.json({
            success: true,
            ...results,
            significance
        });
    } catch (error) {
        console.error('Get Results Error:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

/**
 * @desc    Get all A/B tests (Admin)
 * @route   GET /api/experiments/ab-tests
 * @access  Private/Admin
 */
router.get('/ab-tests', authenticate, adminOnly, async (req, res) => {
    try {
        const experiments = aBTestService.getAllExperiments();

        res.json({
            success: true,
            total: experiments.length,
            experiments
        });
    } catch (error) {
        console.error('Get Experiments Error:', error);
        res.status(500).json({ error: 'Failed to fetch experiments' });
    }
});

/**
 * @desc    Create new A/B test (Admin)
 * @route   POST /api/experiments/ab-tests
 * @access  Private/Admin
 * @body    name, description, variants, startDate, endDate, metrics
 */
router.post('/ab-tests', [
    body('name').notEmpty().withMessage('Name is required'),
    body('variants').isObject().withMessage('Variants object required')
], authenticate, adminOnly, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const experiment = await aBTestService.createExperiment(req.body);

        res.json({
            success: true,
            message: 'Experiment created',
            experiment
        });
    } catch (error) {
        console.error('Create Experiment Error:', error);
        res.status(500).json({ error: 'Failed to create experiment' });
    }
});

/**
 * @desc    Start A/B test (Admin)
 * @route   POST /api/experiments/ab-tests/:experimentId/start
 * @access  Private/Admin
 */
router.post('/ab-tests/:experimentId/start', authenticate, adminOnly, async (req, res) => {
    try {
        const { experimentId } = req.params;
        const experiment = await aBTestService.updateExperimentStatus(experimentId, 'active');

        res.json({
            success: true,
            message: 'Experiment started',
            experiment
        });
    } catch (error) {
        console.error('Start Experiment Error:', error);
        res.status(500).json({ error: 'Failed to start experiment' });
    }
});

/**
 * @desc    Conclude A/B test (Admin)
 * @route   POST /api/experiments/ab-tests/:experimentId/conclude
 * @access  Private/Admin
 */
router.post('/ab-tests/:experimentId/conclude', authenticate, adminOnly, async (req, res) => {
    try {
        const { experimentId } = req.params;
        const result = await aBTestService.concludeExperiment(experimentId);

        res.json({
            success: true,
            message: 'Experiment concluded',
            ...result
        });
    } catch (error) {
        console.error('Conclude Experiment Error:', error);
        res.status(500).json({ error: 'Failed to conclude experiment' });
    }
});

module.exports = router;
