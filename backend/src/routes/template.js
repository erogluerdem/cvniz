const express = require('express');
const router = express.Router();
const { authenticate, adminOnly } = require('../middleware/auth');
const Template = require('../models/Template');

// @route   GET /api/templates
// @desc    Get all active templates (Users) or all templates (Admin)
// @access  Public/Private
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.headers['x-admin-request'] === 'true'; // Simplified check for demonstration
        const query = isAdmin ? {} : { isActive: true };
        const templates = await Template.find(query).sort({ usageCount: -1 });
        res.json({ success: true, count: templates.length, templates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/templates
// @desc    Create or update templates (Bulk or Single)
// @access  Private/Admin
router.post('/', authenticate, adminOnly, async (req, res) => {
    try {
        const { templates } = req.body;

        if (Array.isArray(templates)) {
            // Bulk upsert
            const operations = templates.map(t => ({
                updateOne: {
                    filter: { templateId: t.templateId },
                    update: { $set: t },
                    upsert: true
                }
            }));
            await Template.bulkWrite(operations);
            return res.json({ success: true, message: 'Templates synced successfully' });
        }

        // Single create/update
        const template = await Template.findOneAndUpdate(
            { templateId: req.body.templateId },
            req.body,
            { new: true, upsert: true }
        );
        res.json({ success: true, template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PATCH /api/templates/:id/toggle
// @desc    Toggle template status
// @access  Private/Admin
router.patch('/:id/toggle', authenticate, adminOnly, async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

        template.isActive = !template.isActive;
        await template.save();

        res.json({ success: true, template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/templates/:id
// @desc    Delete a template
// @access  Private/Admin
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const template = await Template.findByIdAndDelete(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
        res.json({ success: true, message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
