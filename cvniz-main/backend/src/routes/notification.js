const express = require('express');
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ============ GET USER NOTIFICATIONS ============
router.get('/', authenticate, async (req, res) => {
    try {
        const { limit = 20, skip = 0, unreadOnly = false } = req.query;

        const notifications = await Notification.getUserNotifications(req.user._id, {
            limit: parseInt(limit),
            skip: parseInt(skip),
            unreadOnly: unreadOnly === 'true'
        });

        const total = await Notification.countDocuments({ userId: req.user._id });
        const unreadCount = await Notification.getUnreadCount(req.user._id);

        res.json({
            success: true,
            notifications: notifications.map(n => ({
                id: n._id,
                type: n.type,
                title: n.title,
                message: n.message,
                icon: n.icon,
                priority: n.priority,
                isRead: n.isRead,
                data: n.data,
                createdAt: n.createdAt
            })),
            total,
            unreadCount
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Bildirimler alınamadı' });
    }
});

// ============ GET UNREAD COUNT ============
router.get('/unread-count', authenticate, async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.user._id);
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ error: 'Bildirim sayısı alınamadı' });
    }
});

// ============ MARK NOTIFICATION AS READ ============
router.patch('/:id/read', authenticate, async (req, res) => {
    try {
        const notification = await Notification.markAsRead(req.params.id, req.user._id);

        if (!notification) {
            return res.status(404).json({ error: 'Bildirim bulunamadı' });
        }

        res.json({
            success: true,
            message: 'Bildirim okundu olarak işaretlendi'
        });
    } catch (error) {
        res.status(500).json({ error: 'Bildirim güncellenemedi' });
    }
});

// ============ MARK ALL AS READ ============
router.patch('/read-all', authenticate, async (req, res) => {
    try {
        await Notification.markAllAsRead(req.user._id);

        res.json({
            success: true,
            message: 'Tüm bildirimler okundu olarak işaretlendi'
        });
    } catch (error) {
        res.status(500).json({ error: 'Bildirimler güncellenemedi' });
    }
});

// ============ DELETE NOTIFICATION ============
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!notification) {
            return res.status(404).json({ error: 'Bildirim bulunamadı' });
        }

        res.json({
            success: true,
            message: 'Bildirim silindi'
        });
    } catch (error) {
        res.status(500).json({ error: 'Bildirim silinemedi' });
    }
});

// ============ CLEAR ALL NOTIFICATIONS ============
router.delete('/', authenticate, async (req, res) => {
    try {
        await Notification.deleteMany({ userId: req.user._id });

        res.json({
            success: true,
            message: 'Tüm bildirimler silindi'
        });
    } catch (error) {
        res.status(500).json({ error: 'Bildirimler silinemedi' });
    }
});

module.exports = router;
