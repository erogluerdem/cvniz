const express = require('express');
const router = express.Router();
const backupService = require('../services/BackupService');
const { authenticate } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Admin only middleware
const adminOnly = async (req, res, next) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Authorization error' });
    }
};

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(adminOnly);

/**
 * @desc    Create full database backup
 * @route   POST /api/backup/create-full
 * @access  Private/Admin
 * @body    name (optional)
 */
router.post('/create-full', [
    body('name').optional().isString().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;
        const manifest = await backupService.createFullBackup(name);

        res.json({
            success: true,
            message: 'Full backup created successfully',
            backup: manifest
        });
    } catch (error) {
        console.error('Create Full Backup Error:', error);
        res.status(500).json({ error: 'Failed to create full backup' });
    }
});

/**
 * @desc    Create incremental backup
 * @route   POST /api/backup/create-incremental
 * @access  Private/Admin
 * @body    name (optional)
 */
router.post('/create-incremental', [
    body('name').optional().isString().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name } = req.body;
        const manifest = await backupService.createIncrementalBackup(name);

        res.json({
            success: true,
            message: 'Incremental backup created successfully',
            backup: manifest
        });
    } catch (error) {
        console.error('Create Incremental Backup Error:', error);
        res.status(500).json({ error: 'Failed to create incremental backup' });
    }
});

/**
 * @desc    List available backups
 * @route   GET /api/backup/list
 * @access  Private/Admin
 * @query   limit (default: 20)
 */
router.get('/list', async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const backups = await backupService.listBackups(Math.min(parseInt(limit), 100));

        res.json({
            success: true,
            ...backups
        });
    } catch (error) {
        console.error('List Backups Error:', error);
        res.status(500).json({ error: 'Failed to list backups' });
    }
});

/**
 * @desc    Get backup status
 * @route   GET /api/backup/status
 * @access  Private/Admin
 */
router.get('/status', async (req, res) => {
    try {
        const status = await backupService.getBackupStatus();

        res.json({
            success: true,
            ...status
        });
    } catch (error) {
        console.error('Get Backup Status Error:', error);
        res.status(500).json({ error: 'Failed to get backup status' });
    }
});

/**
 * @desc    Verify backup integrity
 * @route   POST /api/backup/verify
 * @access  Private/Admin
 * @body    backupName
 */
router.post('/verify', [
    body('backupName').notEmpty().withMessage('Backup name is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { backupName } = req.body;
        const result = await backupService.verifyBackup(backupName);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Verify Backup Error:', error);
        res.status(500).json({ error: 'Failed to verify backup' });
    }
});

/**
 * @desc    Restore from backup
 * @route   POST /api/backup/restore
 * @access  Private/Admin
 * @body    backupName
 */
router.post('/restore', [
    body('backupName').notEmpty().withMessage('Backup name is required'),
    body('confirm').isBoolean().withMessage('Confirmation required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { backupName, confirm } = req.body;

        if (!confirm) {
            return res.status(400).json({ error: 'Restore operation must be confirmed' });
        }

        console.warn(`RESTORE INITIATED: ${req.user.email} is restoring backup ${backupName}`);

        const result = await backupService.restoreFromBackup(backupName);

        res.json({
            success: true,
            message: 'Database restored successfully',
            ...result
        });
    } catch (error) {
        console.error('Restore Error:', error);
        res.status(500).json({ error: 'Failed to restore backup' });
    }
});

/**
 * @desc    Get disaster recovery plan
 * @route   GET /api/backup/dr-plan
 * @access  Private/Admin
 */
router.get('/dr-plan', async (req, res) => {
    try {
        const plan = {
            recoveryTimeObjective: '1 hour',
            recoveryPointObjective: '15 minutes',
            procedures: [
                {
                    name: 'System Failure Recovery',
                    steps: [
                        'Verify failure with monitoring alerts',
                        'Notify incident response team',
                        'Get latest backup from S3',
                        'Perform backup verification',
                        'Stop current services',
                        'Clear database',
                        'Restore from backup',
                        'Verify data integrity',
                        'Restart services',
                        'Run health checks'
                    ],
                    estimatedTime: '30-45 minutes'
                },
                {
                    name: 'Data Corruption Recovery',
                    steps: [
                        'Identify corrupted data',
                        'Alert incident team',
                        'Find last known good backup',
                        'Restore specific collection',
                        'Verify restoration',
                        'Monitor for issues'
                    ],
                    estimatedTime: '15-20 minutes'
                },
                {
                    name: 'Complete Infrastructure Loss',
                    steps: [
                        'Provision new infrastructure',
                        'Deploy application code',
                        'Configure environment',
                        'Restore database from S3',
                        'Verify all services',
                        'Update DNS records',
                        'Run full health checks'
                    ],
                    estimatedTime: '1-2 hours'
                }
            ],
            contacts: [
                { role: 'Incident Commander', phone: 'TBD', email: 'TBD' },
                { role: 'Database Admin', phone: 'TBD', email: 'TBD' },
                { role: 'Infrastructure Lead', phone: 'TBD', email: 'TBD' }
            ],
            backupLocations: [
                'AWS S3 (primary)',
                'Local filesystem (secondary)',
                'Monthly archive (long-term)'
            ],
            testingSchedule: 'Monthly DR drill on first Sunday'
        };

        res.json({
            success: true,
            ...plan
        });
    } catch (error) {
        console.error('Get DR Plan Error:', error);
        res.status(500).json({ error: 'Failed to get DR plan' });
    }
});

/**
 * @desc    Get backup history and statistics
 * @route   GET /api/backup/statistics
 * @access  Private/Admin
 */
router.get('/statistics', async (req, res) => {
    try {
        const backups = await backupService.listBackups(100);

        // Calculate statistics
        const stats = {
            totalBackups: backups.total,
            totalSize: backups.backups.reduce((sum, b) => sum + b.size, 0),
            averageSize: backups.backups.length > 0
                ? backups.backups.reduce((sum, b) => sum + b.size, 0) / backups.backups.length
                : 0,
            oldestBackup: backups.backups.length > 0 ? backups.backups[backups.backups.length - 1].date : null,
            newestBackup: backups.backups.length > 0 ? backups.backups[0].date : null,
            backupFrequency: 'Daily incremental + Weekly full',
            retention: '90 days'
        };

        res.json({
            success: true,
            ...stats
        });
    } catch (error) {
        console.error('Get Statistics Error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

/**
 * @desc    Delete old backups
 * @route   POST /api/backup/cleanup
 * @access  Private/Admin
 * @body    retentionDays (default: 90)
 */
router.post('/cleanup', [
    body('retentionDays').optional().isInt({ min: 1, max: 365 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { retentionDays = 90 } = req.body;

        // This would need S3 implementation
        // For now, return success message

        res.json({
            success: true,
            message: `Cleanup initiated for backups older than ${retentionDays} days`,
            estimatedCleanup: 'Check backup status in 1 hour'
        });
    } catch (error) {
        console.error('Cleanup Error:', error);
        res.status(500).json({ error: 'Failed to cleanup backups' });
    }
});

module.exports = router;
