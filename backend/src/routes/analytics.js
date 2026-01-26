const express = require('express');
const router = express.Router();
const analyticsService = require('../services/AnalyticsService');
const { authenticate } = require('../middleware/auth');
const CV = require('../models/CV');

// @desc    Track a visit
// @route   POST /api/analytics/track/:cvId
// @access  Public
router.post('/track/:cvId', async (req, res) => {
    try {
        await analyticsService.trackVisit(req.params.cvId, req);
        res.json({ success: true });
    } catch (error) {
        // Analytics errors should not break the app
        res.status(200).json({ success: false });
    }
});

// @desc    Get analytics stats
// @route   GET /api/analytics/stats/:cvId
// @access  Private (Owner only)
router.get('/stats/:cvId', authenticate, async (req, res) => {
    try {
        const cv = await CV.findById(req.params.cvId);

        if (!cv) {
            return res.status(404).json({ error: 'CV not found' });
        }

        if (cv.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const stats = await analyticsService.getStats(req.params.cvId);
        res.json({ success: true, analytics: stats });
    } catch (error) {
        console.error('Analytics Route Error:', error);
        res.status(500).json({ error: 'Stats could not be retrieved' });
    }
});

module.exports = router;
