const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, generateToken, generateRefreshToken } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array()[0].msg,
            errors: errors.array()
        });
    }
    next();
};

// ============ REGISTER ============
router.post('/register', [
    body('name')
        .trim()
        .notEmpty().withMessage('İsim gerekli')
        .isLength({ max: 100 }).withMessage('İsim çok uzun'),
    body('email')
        .isEmail().withMessage('Geçerli bir e-posta girin')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
], handleValidation, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'Bu e-posta zaten kayıtlı'
            });
        }

        // Create user
        const user = new User({
            name,
            email,
            password,
            authProvider: 'local'
        });

        await user.save();

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshTokens.push({
            token: refreshToken,
            deviceInfo: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        user.lastLoginAt = new Date();
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Kayıt başarılı',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                avatar: user.avatar,
                createdAt: user.createdAt
            },
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu' });
    }
});

// ============ LOGIN ============
router.post('/login', [
    body('email').isEmail().withMessage('Geçerli bir e-posta girin'),
    body('password').notEmpty().withMessage('Şifre gerekli')
], handleValidation, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with password
        const user = await User.findByCredentials(email, password);

        if (!user) {
            return res.status(401).json({
                error: 'E-posta veya şifre hatalı'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                error: 'Hesabınız devre dışı bırakılmış'
            });
        }

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token and update last login
        user.refreshTokens.push({
            token: refreshToken,
            deviceInfo: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        // Keep only last 5 refresh tokens per user
        if (user.refreshTokens.length > 5) {
            user.refreshTokens = user.refreshTokens.slice(-5);
        }

        user.lastLoginAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Giriş başarılı',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                avatar: user.avatar,
                profile: user.profile,
                settings: user.settings,
                createdAt: user.createdAt
            },
            token,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Giriş sırasında bir hata oluştu' });
    }
});

// ============ LOGOUT ============
router.post('/logout', authenticate, async (req, res) => {
    try {
        // Remove refresh token
        req.user.refreshTokens = req.user.refreshTokens.filter(
            rt => rt.token !== req.body.refreshToken
        );
        await req.user.save();

        res.json({ success: true, message: 'Çıkış yapıldı' });
    } catch (error) {
        res.status(500).json({ error: 'Çıkış sırasında bir hata oluştu' });
    }
});

// ============ REFRESH TOKEN ============
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token gerekli' });
        }

        // Find user with this refresh token
        const user = await User.findOne({
            'refreshTokens.token': refreshToken,
            'refreshTokens.expiresAt': { $gt: new Date() }
        });

        if (!user) {
            return res.status(401).json({ error: 'Geçersiz refresh token' });
        }

        // Generate new access token
        const newToken = generateToken(user._id);

        res.json({
            success: true,
            token: newToken
        });
    } catch (error) {
        res.status(500).json({ error: 'Token yenileme hatası' });
    }
});

// ============ GET CURRENT USER ============
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cvCount');

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                premiumExpiresAt: user.premiumExpiresAt,
                avatar: user.avatar,
                profile: user.profile,
                settings: user.settings,
                cvCount: user.cvCount,
                lastSyncAt: user.lastSyncAt,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Kullanıcı bilgileri alınamadı' });
    }
});

// ============ SOCIAL LOGIN ============
router.post('/social', [
    body('provider').isIn(['google', 'linkedin', 'apple']).withMessage('Geçersiz provider'),
    body('providerId').notEmpty().withMessage('Provider ID gerekli'),
    body('email').isEmail().withMessage('Geçerli bir e-posta girin'),
    body('name').notEmpty().withMessage('İsim gerekli')
], handleValidation, async (req, res) => {
    try {
        const { provider, providerId, email, name, avatar } = req.body;

        // Check if user exists with this provider
        let user = await User.findOne({
            authProvider: provider,
            authProviderId: providerId
        });

        if (!user) {
            // Check if email exists
            user = await User.findOne({ email });

            if (user) {
                // Link social account to existing user
                user.authProvider = provider;
                user.authProviderId = providerId;
                if (avatar && !user.avatar) user.avatar = avatar;
            } else {
                // Create new user
                user = new User({
                    name,
                    email,
                    avatar,
                    authProvider: provider,
                    authProviderId: providerId
                });
            }
        }

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                avatar: user.avatar,
                createdAt: user.createdAt
            },
            token,
            refreshToken,
            isNewUser: !user.lastLoginAt
        });
    } catch (error) {
        console.error('Social login error:', error);
        res.status(500).json({ error: 'Sosyal giriş sırasında bir hata oluştu' });
    }
});

// ============ CHANGE PASSWORD ============
router.post('/change-password', authenticate, [
    body('currentPassword').notEmpty().withMessage('Mevcut şifre gerekli'),
    body('newPassword').isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalı')
], handleValidation, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        if (user.authProvider !== 'local') {
            return res.status(400).json({
                error: 'Sosyal hesap ile giriş yaptınız, şifre değiştirilemez'
            });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'Mevcut şifre hatalı' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Şifre başarıyla değiştirildi' });
    } catch (error) {
        res.status(500).json({ error: 'Şifre değiştirme hatası' });
    }
});

module.exports = router;
