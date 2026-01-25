const express = require('express');
const { body } = require('express-validator');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Coupon = require('../models/Coupon');
const CV = require('../models/CV');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', authenticate, adminOnly, async (req, res) => {
    try {
        const { search, role, isPremium, isActive } = req.query;
        let query = {};

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Role filter
        if (role && role !== 'all') {
            query.role = role;
        }

        // Premium filter
        if (isPremium !== undefined && isPremium !== 'all') {
            query.isPremium = isPremium === 'true';
        }

        // Active/Banned filter
        if (isActive !== undefined && isActive !== 'all') {
            query.isActive = isActive === 'true';
        }

        const users = await User.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'cvs',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'cvs'
                }
            },
            {
                $project: {
                    id: '$_id',
                    name: 1,
                    email: 1,
                    role: 1,
                    isPremium: 1,
                    premiumExpiresAt: 1,
                    isActive: 1,
                    createdAt: 1,
                    lastLogin: 1,
                    cvCount: { $size: '$cvs' }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json({ success: true, users });
    } catch (error) {
        console.error('Fetch users error:', error);
        res.status(500).json({ error: 'Kullanıcılar alınamadı' });
    }
});

// @desc    Get user stats (Admin only)
// @route   GET /api/users/stats
router.get('/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await User.countDocuments();
        const premium = await User.countDocuments({ isPremium: true });
        const banned = await User.countDocuments({ isActive: false });
        const admins = await User.countDocuments({ role: 'admin' });

        // Last 7 days registration trend
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const trend = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            success: true,
            stats: { total, premium, banned, admins, trend }
        });
    } catch (error) {
        res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
});

// @desc    Create new user manually (Admin only)
// @route   POST /api/users
// @access  Private/Admin
router.post('/', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user'
        });

        await logger({ action: 'Yeni Kullanıcı Manuel Oluşturuldu', module: 'Kullanıcılar', details: { id: user._id, email: user.email }, req });

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı oluşturulamadı' });
    }
});

// Update profile (Admin can update anyone)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, email, role, isPremium, premiumExpiresAt, isActive } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (role) updates.role = role;
        if (isPremium !== undefined) updates.isPremium = isPremium;
        if (premiumExpiresAt) updates.premiumExpiresAt = premiumExpiresAt;
        if (isActive !== undefined) updates.isActive = isActive;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı güncelleme hatası' });
    }
});

// @desc    Get user login logs (Admin only)
// @route   GET /api/users/:id/login-logs
router.get('/:id/login-logs', authenticate, adminOnly, async (req, res) => {
    try {
        const LoginLog = require('../models/LoginLog');
        const logs = await LoginLog.find({ userId: req.params.id }).sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ error: 'Giriş kayıtları alınamadı' });
    }
});

// @desc    Reset user password (Admin only)
// @route   POST /api/users/:id/reset-password
router.post('/:id/reset-password', authenticate, adminOnly, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Geçersiz şifre' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

        user.password = password;
        await user.save();

        res.json({ success: true, message: 'Şifre başarıyla sıfırlandı' });
    } catch (error) {
        res.status(500).json({ error: 'Şifre sıfırlama hatası' });
    }
});

// ============ USER: ANNOUNCEMENTS ============
router.get('/announcements/active', authenticate, async (req, res) => {
    try {
        const query = {
            isActive: true,
            $or: [
                { target: 'all' },
                { target: req.user.isPremium ? 'premium' : 'free' }
            ]
        };
        const announcements = await Announcement.find(query).sort({ createdAt: -1 });
        res.json({ success: true, announcements });
    } catch (error) {
        res.status(500).json({ error: 'Duyurular alınamadı' });
    }
});

// ============ USER: COUPONS ============
router.get('/coupons/validate/:code', authenticate, async (req, res) => {
    try {
        const { code } = req.params;
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            $or: [
                { expiryDate: null },
                { expiryDate: { $gt: new Date() } }
            ]
        });

        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Geçersiz veya süresi dolmuş kupon' });
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, error: 'Kupon kullanım limiti dolmuş' });
        }

        res.json({
            success: true,
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                discount: coupon.discount,
                type: coupon.type
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Kupon doğrulama hatası' });
    }
});

module.exports = router;
