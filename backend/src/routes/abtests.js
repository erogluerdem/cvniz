const express = require('express');
const router = express.Router();
const abTestService = require('../services/ABTestService');
const { authenticate, adminOnly } = require('../middleware/auth');

// @desc    Get active variant for a test
// @route   GET /api/abtests/active/:key
// @access  Public
router.get('/active/:key', async (req, res) => {
    try {
        // Use a persistent visitor ID from query or headers if logged out
        const userId = req.query.visitorId || (req.user ? req.user._id.toString() : null);
        const variant = await abTestService.getVariant(req.params.key, userId);

        if (!variant) {
            return res.json({ success: false, message: 'Test not active or found' });
        }

        res.json({ success: true, variant });
    } catch (error) {
        console.error('ABTest Get Active Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Track conversion
// @route   POST /api/abtests/track
// @access  Public
router.post('/track', async (req, res) => {
    try {
        const { key, variantName } = req.body;
        const result = await abTestService.trackConversion(key, variantName);
        res.json({ success: result });
    } catch (error) {
        console.error('ABTest Track Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ================= ADMIN ROUTES =================

// @desc    Get all tests
// @route   GET /api/abtests/admin/all
// @access  Admin
router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
    try {
        const tests = await abTestService.getAllTests();
        res.json({ success: true, tests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Create test
// @route   POST /api/abtests/admin
// @access  Admin
router.post('/admin', authenticate, adminOnly, async (req, res) => {
    try {
        const test = await abTestService.createTest(req.body);
        res.json({ success: true, test });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Update test
// @route   PUT /api/abtests/admin/:id
// @access  Admin
router.put('/admin/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const test = await abTestService.updateTest(req.params.id, req.body);
        res.json({ success: true, test });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Delete test
// @route   DELETE /api/abtests/admin/:id
// @access  Admin
router.delete('/admin/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await abTestService.deleteTest(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
