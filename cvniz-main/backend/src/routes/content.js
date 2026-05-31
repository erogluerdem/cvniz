const express = require('express');
const Settings = require('../models/Settings');
const Theme = require('../models/Theme');

const router = express.Router();

// @route   GET api/content/landing
// @desc    Get landing page content (Public)
// @access  Public
router.get('/landing', async (req, res) => {
    try {
        const content = await Settings.findOne({ key: 'landing_page_content' });

        if (!content) {
            return res.json({
                success: true,
                content: null,
                message: 'No custom landing page content found, using defaults.'
            });
        }

        res.json({
            success: true,
            content: content.value
        });
    } catch (error) {
        console.error('Fetch landing page content error:', error);
        res.status(500).json({ error: 'İçerik yüklenirken bir hata oluştu' });
    }
});

// @route   GET api/content/active-theme
// @desc    Get active theme (Public)
// @access  Public
router.get('/active-theme', async (req, res) => {
    try {
        let theme = await Theme.findOne({ isDefault: true }).select('-createdBy -status');
        if (!theme) {
            theme = await Theme.findOne().select('-createdBy -status');
        }
        res.json({ success: true, theme });
    } catch (error) {
        console.error('Fetch active theme error:', error);
        res.status(500).json({ error: 'Aktif tema alınamadı' });
    }
});

module.exports = router;
