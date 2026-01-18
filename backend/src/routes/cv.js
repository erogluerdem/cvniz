const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const CV = require('../models/CV');
const CVView = require('../models/CVView');
const Notification = require('../models/Notification');
const { authenticate, optionalAuth, premiumOnly } = require('../middleware/auth');
const { getLocationFromIP, getClientIP, parseUserAgent } = require('../utils/geoip');

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

// ============ GET ALL USER CVs ============
router.get('/', authenticate, async (req, res) => {
    try {
        const { includeArchived, limit = 50, skip = 0 } = req.query;

        const query = { userId: req.user._id };
        if (includeArchived !== 'true') {
            query.isArchived = false;
        }

        const cvs = await CV.find(query)
            .sort({ updatedAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .select('-versions'); // Exclude versions for list view

        const total = await CV.countDocuments(query);

        res.json({
            success: true,
            cvs: cvs.map(cv => ({
                id: cv._id,
                name: cv.name,
                template: cv.template,
                data: cv.data,
                layout: cv.layout,
                metadata: cv.metadata,
                isPublic: cv.isPublic,
                publicUrl: cv.publicUrl,
                isArchived: cv.isArchived,
                lastSyncedAt: cv.lastSyncedAt,
                syncVersion: cv.syncVersion,
                createdAt: cv.createdAt,
                updatedAt: cv.updatedAt
            })),
            total,
            hasMore: skip + cvs.length < total
        });
    } catch (error) {
        console.error('Get CVs error:', error);
        res.status(500).json({ error: 'CV\'ler alınamadı' });
    }
});

// ============ GET SINGLE CV ============
router.get('/:id', authenticate, async (req, res) => {
    try {
        const cv = await CV.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        res.json({
            success: true,
            cv: {
                id: cv._id,
                name: cv.name,
                template: cv.template,
                data: cv.data,
                layout: cv.layout,
                versions: cv.versions,
                metadata: cv.metadata,
                isPublic: cv.isPublic,
                publicUrl: cv.publicUrl,
                isArchived: cv.isArchived,
                lastSyncedAt: cv.lastSyncedAt,
                syncVersion: cv.syncVersion,
                createdAt: cv.createdAt,
                updatedAt: cv.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'CV alınamadı' });
    }
});

// ============ CREATE CV ============
router.post('/', authenticate, [
    body('name').optional().trim().isLength({ max: 200 }),
    body('template').optional().trim()
], handleValidation, async (req, res) => {
    try {
        const { name, template, data, layout } = req.body;

        // Check CV limit for non-premium users
        if (!req.user.hasPremiumAccess()) {
            const cvCount = await CV.countDocuments({
                userId: req.user._id,
                isArchived: false
            });
            if (cvCount >= 3) {
                return res.status(403).json({
                    error: 'Ücretsiz hesapta en fazla 3 CV oluşturabilirsiniz',
                    code: 'CV_LIMIT_REACHED'
                });
            }
        }

        const cv = new CV({
            userId: req.user._id,
            name: name || 'Adsız CV',
            template: template || 'modern',
            data: data || {},
            layout: layout || {},
            metadata: {
                lastEdited: req.headers['x-platform'] || 'web'
            }
        });

        cv.calculateCompleteness();
        await cv.save();

        res.status(201).json({
            success: true,
            message: 'CV oluşturuldu',
            cv: {
                id: cv._id,
                name: cv.name,
                template: cv.template,
                data: cv.data,
                layout: cv.layout,
                metadata: cv.metadata,
                syncVersion: cv.syncVersion,
                createdAt: cv.createdAt,
                updatedAt: cv.updatedAt
            }
        });
    } catch (error) {
        console.error('Create CV error:', error);
        res.status(500).json({ error: 'CV oluşturma hatası' });
    }
});

// ============ UPDATE CV ============
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { name, template, data, layout, isPublic } = req.body;

        const cv = await CV.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        // Update fields
        if (name !== undefined) cv.name = name;
        if (template !== undefined) cv.template = template;
        if (data !== undefined) cv.data = data;
        if (layout !== undefined) cv.layout = layout;
        if (isPublic !== undefined) {
            cv.isPublic = isPublic;
            if (isPublic && !cv.publicUrl) {
                cv.publicUrl = uuidv4();
            }
        }

        cv.metadata.lastEdited = req.headers['x-platform'] || 'web';
        cv.calculateCompleteness();
        await cv.save();

        res.json({
            success: true,
            message: 'CV güncellendi',
            cv: {
                id: cv._id,
                name: cv.name,
                template: cv.template,
                data: cv.data,
                layout: cv.layout,
                metadata: cv.metadata,
                isPublic: cv.isPublic,
                publicUrl: cv.publicUrl,
                syncVersion: cv.syncVersion,
                lastSyncedAt: cv.lastSyncedAt,
                updatedAt: cv.updatedAt
            }
        });
    } catch (error) {
        console.error('Update CV error:', error);
        res.status(500).json({ error: 'CV güncelleme hatası' });
    }
});

// ============ DELETE CV ============
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const cv = await CV.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        res.json({
            success: true,
            message: 'CV silindi'
        });
    } catch (error) {
        res.status(500).json({ error: 'CV silme hatası' });
    }
});

// ============ DUPLICATE CV ============
router.post('/:id/duplicate', authenticate, async (req, res) => {
    try {
        const originalCV = await CV.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!originalCV) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        // Check CV limit for non-premium users
        if (!req.user.hasPremiumAccess()) {
            const cvCount = await CV.countDocuments({
                userId: req.user._id,
                isArchived: false
            });
            if (cvCount >= 3) {
                return res.status(403).json({
                    error: 'Ücretsiz hesapta en fazla 3 CV oluşturabilirsiniz',
                    code: 'CV_LIMIT_REACHED'
                });
            }
        }

        const newCV = new CV({
            userId: req.user._id,
            name: `${originalCV.name} (Kopya)`,
            template: originalCV.template,
            data: originalCV.data,
            layout: originalCV.layout,
            metadata: {
                ...originalCV.metadata,
                lastEdited: req.headers['x-platform'] || 'web'
            }
        });

        await newCV.save();

        res.status(201).json({
            success: true,
            message: 'CV kopyalandı',
            cv: {
                id: newCV._id,
                name: newCV.name,
                template: newCV.template,
                createdAt: newCV.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'CV kopyalama hatası' });
    }
});

// ============ ARCHIVE/UNARCHIVE CV ============
router.patch('/:id/archive', authenticate, async (req, res) => {
    try {
        const cv = await CV.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        cv.isArchived = !cv.isArchived;
        await cv.save();

        res.json({
            success: true,
            message: cv.isArchived ? 'CV arşivlendi' : 'CV arşivden çıkarıldı',
            isArchived: cv.isArchived
        });
    } catch (error) {
        res.status(500).json({ error: 'Arşivleme hatası' });
    }
});

// ============ SAVE VERSION ============
router.post('/:id/versions', authenticate, async (req, res) => {
    try {
        const { name } = req.body;

        const cv = await CV.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        // Limit versions for non-premium users
        if (!req.user.hasPremiumAccess() && cv.versions.length >= 5) {
            return res.status(403).json({
                error: 'Ücretsiz hesapta en fazla 5 versiyon kaydedebilirsiniz',
                code: 'VERSION_LIMIT_REACHED'
            });
        }

        const version = {
            id: uuidv4(),
            name: name || `Versiyon ${cv.versions.length + 1}`,
            data: JSON.parse(JSON.stringify(cv.data)),
            template: cv.template,
            createdAt: new Date()
        };

        cv.versions.push(version);
        await cv.save();

        res.status(201).json({
            success: true,
            message: 'Versiyon kaydedildi',
            version
        });
    } catch (error) {
        res.status(500).json({ error: 'Versiyon kaydetme hatası' });
    }
});

// ============ RESTORE VERSION ============
router.post('/:id/versions/:versionId/restore', authenticate, async (req, res) => {
    try {
        const cv = await CV.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        const version = cv.versions.find(v => v.id === req.params.versionId);

        if (!version) {
            return res.status(404).json({ error: 'Versiyon bulunamadı' });
        }

        // Save current state as version before restoring
        cv.versions.push({
            id: uuidv4(),
            name: `Geri yükleme öncesi (${new Date().toLocaleDateString('tr-TR')})`,
            data: JSON.parse(JSON.stringify(cv.data)),
            template: cv.template,
            createdAt: new Date()
        });

        // Restore version
        cv.data = version.data;
        cv.template = version.template;
        await cv.save();

        res.json({
            success: true,
            message: 'Versiyon geri yüklendi',
            cv: {
                id: cv._id,
                data: cv.data,
                template: cv.template
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Versiyon geri yükleme hatası' });
    }
});

// ============ GET PUBLIC CV ============
router.get('/public/:publicUrl', optionalAuth, async (req, res) => {
    try {
        const cv = await CV.findOne({
            publicUrl: req.params.publicUrl,
            isPublic: true
        }).select('-versions');

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı veya herkese açık değil' });
        }

        // Increment view count
        cv.metadata.viewCount += 1;
        await cv.save();

        // Track view with geo-location (async, don't wait)
        const clientIP = getClientIP(req);
        const userAgent = req.headers['user-agent'] || '';

        // Check if this is a unique view (not viewed from same IP in 24h)
        const hasRecent = await CVView.hasRecentView(cv._id, clientIP);

        // Get location and device info
        const [location, deviceInfo] = await Promise.all([
            getLocationFromIP(clientIP),
            Promise.resolve(parseUserAgent(userAgent))
        ]);

        // Create view record
        const cvView = await CVView.create({
            cvId: cv._id,
            userId: cv.userId,
            viewerIp: clientIP,
            location,
            device: {
                userAgent,
                ...deviceInfo
            },
            referer: req.headers['referer'] || '',
            isUnique: !hasRecent
        });

        // Send notification to CV owner (only for unique views)
        if (!hasRecent) {
            try {
                await Notification.createCVViewNotification(
                    cv.userId,
                    cv.name,
                    location
                );
            } catch (notifError) {
                console.error('Notification creation error:', notifError);
                // Don't fail the request if notification fails
            }
        }

        res.json({
            success: true,
            cv: {
                name: cv.name,
                template: cv.template,
                data: cv.data,
                layout: cv.layout
            }
        });
    } catch (error) {
        console.error('Get public CV error:', error);
        res.status(500).json({ error: 'CV alınamadı' });
    }
});

// ============ GET CV ANALYTICS ============
router.get('/:id/analytics', authenticate, async (req, res) => {
    try {
        const cv = await CV.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        const stats = await CVView.getCVStats(cv._id);
        const recentViews = await CVView.getCVViews(cv._id, { limit: 20 });

        res.json({
            success: true,
            analytics: {
                totalViews: stats.totalViews,
                uniqueViews: stats.uniqueViews,
                locationStats: stats.locationStats,
                dailyStats: stats.dailyStats,
                deviceStats: stats.deviceStats,
                recentViews: recentViews.map(v => ({
                    id: v._id,
                    location: v.location,
                    device: {
                        browser: v.device.browser,
                        os: v.device.os,
                        isMobile: v.device.isMobile
                    },
                    createdAt: v.createdAt
                }))
            }
        });
    } catch (error) {
        console.error('Get CV analytics error:', error);
        res.status(500).json({ error: 'Analitik verileri alınamadı' });
    }
});

module.exports = router;

