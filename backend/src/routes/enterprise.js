/**
 * Enterprise Routes
 * SSO, SCIM, Audit Logs, Organization management
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin, requireOrgAdmin } = require('../middleware/auth');
const { SSOService } = require('../services/SSOService');
const { SCIMService } = require('../services/SCIMService');
const { AuditLogService } = require('../services/AuditLogService');
const Enterprise = require('../models/Enterprise');
const User = require('../models/User');
const Sentry = require('@sentry/node');

/**
 * GET /api/enterprise/sso/providers
 * Get available SSO providers
 */
router.get('/sso/providers', async (req, res) => {
    try {
        const providers = await SSOService.getSSOProviders();
        res.json(providers);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/sso/my-providers
 * Get user's linked SSO providers
 */
router.get('/sso/my-providers', requireAuth, async (req, res) => {
    try {
        const providers = await SSOService.getUserSSOProviders(req.user._id);
        res.json(providers);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/enterprise/sso/link/:provider
 * Link SSO provider to existing account
 */
router.post('/sso/link/:provider', requireAuth, async (req, res) => {
    try {
        const { provider } = req.params;
        const { providerData } = req.body;

        const user = await SSOService.linkSSOProvider(
            req.user._id,
            provider,
            providerData
        );

        res.json({
            success: true,
            message: `${provider} successfully linked`,
            user: {
                id: user._id,
                email: user.email,
                ssoProvider: user.ssoProvider
            }
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/enterprise/sso/unlink/:provider
 * Unlink SSO provider
 */
router.delete('/sso/unlink/:provider', requireAuth, async (req, res) => {
    try {
        const { provider } = req.params;

        await SSOService.unlinkSSOProvider(req.user._id, provider);

        res.json({
            success: true,
            message: `${provider} successfully unlinked`
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/enterprise/sso/enforce
 * Enforce SSO for organization (Admin only)
 */
router.post('/sso/enforce', requireAdmin, async (req, res) => {
    try {
        const { organizationId, provider } = req.body;

        await SSOService.enforceSSO(organizationId, provider);

        res.json({
            success: true,
            message: `SSO enforcement enabled for ${provider}`
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/scim/status
 * Check SCIM provisioning status
 */
router.get('/scim/status', requireOrgAdmin, async (req, res) => {
    try {
        const org = await Enterprise.findById(req.user.organizationId);

        res.json({
            scimEnabled: org?.scimEnabled || false,
            scimToken: org?.scimToken ? '****' : null,
            lastSyncTime: org?.lastSCIMSync,
            syncStatus: org?.scimSyncStatus || 'not_synced',
            userCount: await User.countDocuments({ organizationId: org._id })
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/enterprise/scim/enable
 * Enable SCIM provisioning
 */
router.post('/scim/enable', requireOrgAdmin, async (req, res) => {
    try {
        const org = await Enterprise.findById(req.user.organizationId);

        // Generate SCIM token
        const scimToken = require('crypto').randomBytes(32).toString('hex');

        org.scimEnabled = true;
        org.scimToken = scimToken;
        await org.save();

        res.json({
            success: true,
            scimToken,
            scimEndpoint: `${process.env.API_URL}/scim/v2`,
            message: 'SCIM provisioning enabled'
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/enterprise/scim/bulk-import
 * Bulk import users via SCIM
 */
router.post('/scim/bulk-import', requireOrgAdmin, async (req, res) => {
    try {
        const { users } = req.body;

        const results = await SCIMService.bulkImportUsers(users);

        res.json({
            success: true,
            totalImported: users.length,
            successCount: results.filter(r => r.status === 'success').length,
            errorCount: results.filter(r => r.status === 'error').length,
            results
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/audit-logs
 * Get organization audit logs
 */
router.get('/audit-logs', requireOrgAdmin, async (req, res) => {
    try {
        const { startDate, endDate, action, limit = 50, skip = 0 } = req.query;

        const filters = {};
        if (action) {filters.action = action;}

        const { logs, total } = await AuditLogService.getOrganizationAuditLog(
            req.user.organizationId,
            {
                ...filters,
                createdAt: {
                    $gte: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
                    $lte: new Date(endDate || Date.now())
                }
            },
            parseInt(limit),
            parseInt(skip)
        );

        res.json({
            logs,
            total,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/audit-logs/compliance-report
 * Generate compliance report
 */
router.get('/audit-logs/compliance-report', requireOrgAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const report = await AuditLogService.generateComplianceReport(
            req.user.organizationId,
            new Date(startDate || Date.now() - 365 * 24 * 60 * 60 * 1000),
            new Date(endDate || Date.now())
        );

        res.json(report);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/audit-logs/export
 * Export audit logs as CSV
 */
router.get('/audit-logs/export', requireOrgAdmin, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const csv = await AuditLogService.exportAuditLogs(
            req.user.organizationId,
            new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
            new Date(endDate || Date.now())
        );

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
        res.send(csv);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/audit-logs/user/:userId
 * Get specific user's activity
 */
router.get('/audit-logs/user/:userId', requireOrgAdmin, async (req, res) => {
    try {
        const { limit = 50 } = req.query;

        const logs = await AuditLogService.getUserActivity(
            req.params.userId,
            parseInt(limit)
        );

        res.json(logs);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/audit-logs/suspicious-activity
 * Detect suspicious activity
 */
router.get('/audit-logs/suspicious-activity', requireOrgAdmin, async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId required' });
        }

        const suspicion = await AuditLogService.detectSuspiciousActivity(userId);

        res.json(suspicion);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/enterprise/create
 * Create new enterprise/organization
 */
router.post('/create', requireAuth, async (req, res) => {
    try {
        const { name, industry, size, country } = req.body;

        const enterprise = await Enterprise.create({
            name,
            industry,
            size,
            country,
            owner: req.user._id,
            admins: [req.user._id],
            createdAt: new Date()
        });

        // Update user
        req.user.organizationId = enterprise._id;
        req.user.organizationRole = 'admin';
        await req.user.save();

        res.status(201).json({
            success: true,
            enterprise: {
                id: enterprise._id,
                name: enterprise.name,
                owner: enterprise.owner
            }
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/enterprise/settings
 * Get enterprise settings
 */
router.get('/settings', requireOrgAdmin, async (req, res) => {
    try {
        const org = await Enterprise.findById(req.user.organizationId);

        res.json({
            id: org._id,
            name: org.name,
            industry: org.industry,
            size: org.size,
            country: org.country,
            ssoEnabled: org.ssoEnabled,
            scimEnabled: org.scimEnabled,
            auditLogsEnabled: org.auditLogsEnabled,
            createdAt: org.createdAt
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/enterprise/settings
 * Update enterprise settings
 */
router.put('/settings', requireOrgAdmin, async (req, res) => {
    try {
        const { name, industry, size, country } = req.body;

        const org = await Enterprise.findByIdAndUpdate(
            req.user.organizationId,
            { name, industry, size, country },
            { new: true }
        );

        res.json({
            success: true,
            enterprise: {
                id: org._id,
                name: org.name,
                industry: org.industry,
                size: org.size,
                country: org.country
            }
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
