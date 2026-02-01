const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Get active announcement
router.get('/active', async (req, res) => {
    try {
        const now = new Date();
        // Find latest active announcement that hasn't expired
        const announcement = await Announcement.findOne({
            isActive: true,
            $or: [
                { showUntil: { $exists: false } },
                { showUntil: { $eq: null } },
                { showUntil: { $gte: now } }
            ]
        }).sort({ createdAt: -1 });

        res.json({ success: true, announcement });
    } catch (error) {
        console.error('Announcement fetch error:', error);
        res.status(500).json({ success: false, error: 'Sunucu hatası' });
    }
});

module.exports = router;
