const express = require('express');
const router = express.Router();
const CVReview = require('../models/CVReview');
const { authenticate, adminOnly } = require('../middleware/auth');
const logger = require('../utils/logger');

// @desc    Get all CV reviews for admin
// @route   GET /api/reviews
// @access  Private/Admin
router.get('/', authenticate, adminOnly, async (req, res) => {
    try {
        const reviews = await CVReview.find()
            .populate('userId', 'name email')
            .populate('cvId', 'name template')
            .sort({ createdAt: -1 });

        res.json({ success: true, reviews });
    } catch (error) {
        console.error('Fetch reviews error:', error);
        res.status(500).json({ error: 'İnceleme talepleri alınamadı' });
    }
});

// @desc    Update review status (admin)
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
router.patch('/:id/status', authenticate, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const review = await CVReview.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'İnceleme bulunamadı' });
        }

        review.status = status;
        if (status === 'in_review') {
            review.assignedTo = req.user._id;
        }

        await review.save();
        await logger({ action: 'Analiz Durumu Güncellendi', module: 'CV Analiz', details: { id: review._id, status }, req });

        res.json({ success: true, review });
    } catch (error) {
        res.status(500).json({ error: 'Durum güncellenemedi' });
    }
});

// @desc    Complete review with score and feedback (admin)
// @route   PATCH /api/reviews/:id/complete
// @access  Private/Admin
router.patch('/:id/complete', authenticate, adminOnly, async (req, res) => {
    try {
        const { score, feedback, status = 'completed' } = req.body;
        const review = await CVReview.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'İnceleme bulunamadı' });
        }

        review.score = score;
        review.feedback = feedback;
        review.status = status;
        review.completedAt = new Date();

        await review.save();
        await logger({ action: 'Analiz Tamamlandı', module: 'CV Analiz', details: { id: review._id, score }, req });

        res.json({ success: true, review });
    } catch (error) {
        res.status(500).json({ error: 'İnceleme tamamlanamadı' });
    }
});

module.exports = router;
