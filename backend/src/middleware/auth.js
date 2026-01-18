const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT Token
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Yetkilendirme token\'ı gerekli'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({
                error: 'Geçersiz veya devre dışı kullanıcı'
            });
        }

        // Attach user to request
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token süresi dolmuş',
                code: 'TOKEN_EXPIRED'
            });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Geçersiz token'
            });
        }
        return res.status(500).json({
            error: 'Yetkilendirme hatası'
        });
    }
};

// Optional Authentication (for public/private resources)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(); // Continue without user
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (user && user.isActive) {
            req.user = user;
            req.token = token;
        }
        next();
    } catch (error) {
        next(); // Continue without user on error
    }
};

// Admin Only Middleware
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            error: 'Bu işlem için admin yetkisi gerekli'
        });
    }
    next();
};

// Premium Only Middleware
const premiumOnly = (req, res, next) => {
    if (!req.user || !req.user.hasPremiumAccess()) {
        return res.status(403).json({
            error: 'Bu özellik premium üyelere özel',
            code: 'PREMIUM_REQUIRED'
        });
    }
    next();
};

// Generate JWT Token
const generateToken = (userId, expiresIn = process.env.JWT_EXPIRES_IN || '7d') => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

module.exports = {
    authenticate,
    optionalAuth,
    adminOnly,
    premiumOnly,
    generateToken,
    generateRefreshToken
};
