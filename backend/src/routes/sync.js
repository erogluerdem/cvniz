const express = require('express');
const CV = require('../models/CV');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ============ SYNC STATUS ============
// Check if there are updates since last sync
router.get('/status', authenticate, async (req, res) => {
    try {
        const { lastSyncAt } = req.query;
        const lastSync = lastSyncAt ? new Date(lastSyncAt) : new Date(0);

        // Get CVs updated after last sync
        const updatedCVs = await CV.find({
            userId: req.user._id,
            lastSyncedAt: { $gt: lastSync }
        }).select('_id name syncVersion lastSyncedAt updatedAt');

        res.json({
            success: true,
            hasUpdates: updatedCVs.length > 0,
            updatedCVs: updatedCVs.map(cv => ({
                id: cv._id,
                name: cv.name,
                syncVersion: cv.syncVersion,
                lastSyncedAt: cv.lastSyncedAt,
                updatedAt: cv.updatedAt
            })),
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        console.error('Sync status error:', error);
        res.status(500).json({ error: 'Sync durumu alınamadı' });
    }
});

// ============ FULL SYNC ============
// Get all user data for initial sync
router.get('/full', authenticate, async (req, res) => {
    try {
        const cvs = await CV.find({ userId: req.user._id })
            .sort({ updatedAt: -1 });

        const user = await User.findById(req.user._id);

        // Update last sync time
        user.lastSyncAt = new Date();
        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                avatar: user.avatar,
                profile: user.profile,
                settings: user.settings
            },
            cvs: cvs.map(cv => ({
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
                syncVersion: cv.syncVersion,
                lastSyncedAt: cv.lastSyncedAt,
                createdAt: cv.createdAt,
                updatedAt: cv.updatedAt
            })),
            syncedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Full sync error:', error);
        res.status(500).json({ error: 'Full sync hatası' });
    }
});

// ============ PUSH CHANGES ============
// Push local changes to server
router.post('/push', authenticate, async (req, res) => {
    try {
        const { changes } = req.body;

        if (!changes || !Array.isArray(changes)) {
            return res.status(400).json({ error: 'Değişiklikler gerekli' });
        }

        const results = [];
        const conflicts = [];

        for (const change of changes) {
            try {
                const { action, cvId, data, localSyncVersion } = change;

                switch (action) {
                    case 'create': {
                        const newCV = new CV({
                            userId: req.user._id,
                            name: data.name || 'Adsız CV',
                            template: data.template || 'modern',
                            data: data.data || {},
                            layout: data.layout || {},
                            metadata: {
                                lastEdited: req.headers['x-platform'] || 'mobile'
                            }
                        });
                        await newCV.save();
                        results.push({
                            localId: change.localId,
                            serverId: newCV._id,
                            action: 'created',
                            syncVersion: newCV.syncVersion
                        });
                        break;
                    }

                    case 'update': {
                        const cv = await CV.findOne({
                            _id: cvId,
                            userId: req.user._id
                        });

                        if (!cv) {
                            results.push({
                                cvId,
                                action: 'error',
                                error: 'CV bulunamadı'
                            });
                            break;
                        }

                        // Check for conflicts (optimistic locking)
                        if (localSyncVersion && cv.syncVersion > localSyncVersion) {
                            conflicts.push({
                                cvId,
                                serverVersion: cv.syncVersion,
                                localVersion: localSyncVersion,
                                serverData: cv.data,
                                localData: data.data
                            });
                            break;
                        }

                        // Apply updates
                        if (data.name) cv.name = data.name;
                        if (data.template) cv.template = data.template;
                        if (data.data) cv.data = data.data;
                        if (data.layout) cv.layout = data.layout;

                        cv.metadata.lastEdited = req.headers['x-platform'] || 'mobile';
                        cv.calculateCompleteness();
                        await cv.save();

                        results.push({
                            cvId,
                            action: 'updated',
                            syncVersion: cv.syncVersion
                        });
                        break;
                    }

                    case 'delete': {
                        await CV.findOneAndDelete({
                            _id: cvId,
                            userId: req.user._id
                        });
                        results.push({
                            cvId,
                            action: 'deleted'
                        });
                        break;
                    }

                    default:
                        results.push({
                            cvId,
                            action: 'error',
                            error: 'Bilinmeyen işlem'
                        });
                }
            } catch (error) {
                console.error('Push change error:', error);
                results.push({
                    cvId: change.cvId,
                    action: 'error',
                    error: error.message
                });
            }
        }

        // Update user's last sync time
        req.user.lastSyncAt = new Date();
        await req.user.save();

        res.json({
            success: true,
            results,
            conflicts,
            syncedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Push sync error:', error);
        res.status(500).json({ error: 'Push sync hatası' });
    }
});

// ============ PULL CHANGES ============
// Pull changes from server since last sync
router.get('/pull', authenticate, async (req, res) => {
    try {
        const { lastSyncAt } = req.query;
        const lastSync = lastSyncAt ? new Date(lastSyncAt) : new Date(0);

        // Get CVs updated after last sync
        const updatedCVs = await CV.find({
            userId: req.user._id,
            lastSyncedAt: { $gt: lastSync }
        });

        // Update user's last sync time
        req.user.lastSyncAt = new Date();
        await req.user.save();

        res.json({
            success: true,
            cvs: updatedCVs.map(cv => ({
                id: cv._id,
                name: cv.name,
                template: cv.template,
                data: cv.data,
                layout: cv.layout,
                metadata: cv.metadata,
                isArchived: cv.isArchived,
                syncVersion: cv.syncVersion,
                lastSyncedAt: cv.lastSyncedAt,
                updatedAt: cv.updatedAt
            })),
            syncedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Pull sync error:', error);
        res.status(500).json({ error: 'Pull sync hatası' });
    }
});

// ============ RESOLVE CONFLICT ============
router.post('/resolve-conflict', authenticate, async (req, res) => {
    try {
        const { cvId, resolution, mergedData } = req.body;

        const cv = await CV.findOne({
            _id: cvId,
            userId: req.user._id
        });

        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        switch (resolution) {
            case 'keep-server':
                // Do nothing, server version is already current
                break;

            case 'keep-local':
            case 'merge':
                if (!mergedData) {
                    return res.status(400).json({ error: 'Veri gerekli' });
                }
                cv.data = mergedData;
                cv.metadata.lastEdited = req.headers['x-platform'] || 'mobile';
                await cv.save();
                break;

            default:
                return res.status(400).json({ error: 'Geçersiz çözüm tipi' });
        }

        res.json({
            success: true,
            message: 'Çakışma çözüldü',
            cv: {
                id: cv._id,
                syncVersion: cv.syncVersion,
                data: cv.data
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Çakışma çözme hatası' });
    }
});

module.exports = router;
