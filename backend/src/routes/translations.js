const express = require('express');
const router = express.Router();
const Translation = require('../models/Translation');
const { authenticate, adminOnly } = require('../middleware/auth');

// @desc    Get all translations for a specific locale (public)
// @route   GET /api/translations/:locale
// @access  Public
router.get('/:locale', async (req, res) => {
    try {
        const { locale } = req.params;
        const translations = await Translation.find({ locale });

        // Convert to key-value map for frontend
        const translationMap = {};
        translations.forEach(t => {
            translationMap[t.key] = t.value;
        });

        res.status(200).json(translationMap);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Get all translations (admin)
// @route   GET /api/translations/admin/all
// @access  Private/Admin
router.get('/admin/all', authenticate, adminOnly, async (req, res) => {
    try {
        const translations = await Translation.find({});
        res.status(200).json({ success: true, data: translations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Upsert a translation (admin)
// @route   POST /api/translations
// @access  Private/Admin
router.post('/', authenticate, adminOnly, async (req, res) => {
    try {
        const { locale, key, value, group } = req.body;

        const translation = await Translation.findOneAndUpdate(
            { locale, key },
            { value, group, lastUpdated: Date.now() },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: translation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Delete a translation
// @route   DELETE /api/translations/:id
// @access  Private/Admin
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Translation.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Initialize default translations (Helper route)
// @route   POST /api/translations/init
// @access  Private/Admin
router.post('/init', authenticate, adminOnly, async (req, res) => {
    try {
        const defaults = req.body.translations; // Expects array of { locale, key, value }
        if (!defaults || !Array.isArray(defaults)) {
            return res.status(400).json({ success: false, error: 'Invalid data' });
        }

        const operations = defaults.map(t => ({
            updateOne: {
                filter: { locale: t.locale, key: t.key },
                update: { $set: { value: t.value, group: t.group || 'common' } },
                upsert: true
            }
        }));

        await Translation.bulkWrite(operations);
        res.status(200).json({ success: true, message: 'Translations initialized' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
