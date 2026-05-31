const express = require('express');
const router = express.Router();
const Support = require('../models/Support');
const { authenticate: protect, adminOnly: admin } = require('../middleware/auth');

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { subject, category, description, priority, targetUserId } = req.body;

        let userId = req.user._id;
        let userName = req.user.name || 'Kullanıcı';
        let userEmail = req.user.email;
        let sender = 'user';

        // Admin is creating a ticket for a user
        if (req.user.role === 'admin' && targetUserId) {
            const User = require('../models/User');
            const targetUser = await User.findById(targetUserId);
            if (!targetUser) {
                return res.status(404).json({ error: 'Hedef kullanıcı bulunamadı' });
            }
            userId = targetUser._id;
            userName = targetUser.name || 'Kullanıcı';
            userEmail = targetUser.email;
            sender = 'admin'; // Initial message is from admin
        }

        const ticket = await Support.create({
            userId,
            userName,
            userEmail,
            subject,
            category,
            description,
            priority,
            messages: [{
                sender,
                content: description
            }]
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Get all tickets for a user
// @route   GET /api/support
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const tickets = await Support.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Get all tickets (Admin)
// @route   GET /api/support/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
    try {
        const tickets = await Support.find().sort({ updatedAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Update ticket status
// @route   PUT /api/support/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const ticket = await Support.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// @desc    Add message to ticket
// @route   POST /api/support/:id/message
// @access  Private
router.post('/:id/message', protect, async (req, res) => {
    try {
        const { content, sender } = req.body;
        const ticket = await Support.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket bulunamadı' });
        }

        // Only user who created the ticket or admin can reply
        if (ticket.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
        }

        ticket.messages.push({
            sender: sender || (req.user.role === 'admin' ? 'admin' : 'user'),
            content
        });

        await ticket.save();
        res.json(ticket);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
