/**
 * Audit Logging Service
 * Enterprise compliance, activity tracking, data access logging
 */

const mongoose = require('mongoose');
const { recordEvent } = require('../utils/logger');
const * as Sentry = require('@sentry/node');

/**
 * Audit Log Schema
 */
const auditLogSchema = new mongoose.Schema({
    // Who performed the action
    actor: {
        id: mongoose.Schema.Types.ObjectId,
        email: String,
        name: String,
        ipAddress: String,
        userAgent: String
    },

    // What action was performed
    action: {
        type: String, // create, read, update, delete, export, login, logout, etc.
        required: true
    },
    resourceType: String, // User, CV, Job, Payment, etc.
    resourceId: mongoose.Schema.Types.ObjectId,

    // Details about the change
    changes: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed,
        fields: [String] // Which fields were changed
    },

    // Sensitive data access
    dataAccess: {
        type: {
            type: String, // PII, Financial, Health, etc.
            enum: ['PII', 'Financial', 'Health', 'Employment', 'Other']
        },
        classification: String,
        reason: String
    },

    // Status and outcome
    status: {
        type: String,
        enum: ['success', 'failed', 'pending', 'denied'],
        default: 'success'
    },
    errorMessage: String,

    // Additional context
    context: {
        organizationId: mongoose.Schema.Types.ObjectId,
        sessionId: String,
        requestId: String,
        environment: String // production, staging, development
    },

    // Compliance information
    compliance: {
        gdprRelevant: Boolean,
        consentRequired: Boolean,
        retentionDays: Number,
        expiresAt: Date
    },

    // Audit trail
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    index: {
        type: Number,
        unique: true,
        auto: true
    }
}, {
    collection: 'audit_logs',
    strict: false
});

// Indexes for efficient querying
auditLogSchema.index({ 'actor.id': 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ 'context.organizationId': 1, createdAt: -1 });
auditLogSchema.index({ 'dataAccess.type': 1 });
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days TTL

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

/**
 * Audit Logging Service
 */
class AuditLogService {
    /**
     * Log user action
     */
    static async logAction(options = {}) {
        try {
            const {
                actor,
                action,
                resourceType,
                resourceId,
                changes,
                dataAccess,
                status = 'success',
                errorMessage,
                context = {},
                compliance = {}
            } = options;

            const auditLog = await AuditLog.create({
                actor,
                action,
                resourceType,
                resourceId,
                changes,
                dataAccess,
                status,
                errorMessage,
                context: {
                    environment: process.env.NODE_ENV,
                    ...context
                },
                compliance: {
                    retentionDays: 365,
                    ...compliance
                }
            });

            // Send to compliance system if needed
            if (compliance.gdprRelevant || dataAccess) {
                await AuditLogService.notifyComplianceSystem(auditLog);
            }

            recordEvent('audit_logged', {
                action,
                resourceType,
                status
            });

            return auditLog;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'audit_log' } });
            console.error('Audit log error:', error);
        }
    }

    /**
     * Log login attempt
     */
    static async logLoginAttempt(userId, email, ipAddress, userAgent, success = true) {
        return AuditLogService.logAction({
            actor: { id: userId, email, ipAddress, userAgent },
            action: success ? 'login_success' : 'login_failed',
            resourceType: 'User',
            resourceId: userId,
            status: success ? 'success' : 'failed',
            dataAccess: {
                type: 'PII',
                reason: 'Authentication'
            },
            compliance: {
                gdprRelevant: true,
                consentRequired: false
            }
        });
    }

    /**
     * Log data export
     */
    static async logDataExport(userId, email, exportType, recordCount, ipAddress) {
        return AuditLogService.logAction({
            actor: { id: userId, email, ipAddress },
            action: 'data_export',
            resourceType: exportType,
            changes: {
                after: { recordCount, timestamp: new Date() }
            },
            dataAccess: {
                type: 'PII',
                reason: `Data export (${exportType})`,
                classification: 'Sensitive'
            },
            compliance: {
                gdprRelevant: true,
                consentRequired: true
            }
        });
    }

    /**
     * Log data deletion
     */
    static async logDataDeletion(userId, email, deletedRecordIds, reason) {
        return AuditLogService.logAction({
            actor: { id: userId, email },
            action: 'data_deletion',
            resourceType: 'User',
            changes: {
                after: { deletedCount: deletedRecordIds.length }
            },
            dataAccess: {
                type: 'PII',
                reason: `Data deletion - ${reason}`,
                classification: 'Sensitive'
            },
            compliance: {
                gdprRelevant: true,
                consentRequired: reason === 'gdpr_right_to_be_forgotten'
            }
        });
    }

    /**
     * Log permission change
     */
    static async logPermissionChange(actorId, actorEmail, targetUserId, oldPermissions, newPermissions) {
        return AuditLogService.logAction({
            actor: { id: actorId, email: actorEmail },
            action: 'permission_changed',
            resourceType: 'User',
            resourceId: targetUserId,
            changes: {
                before: oldPermissions,
                after: newPermissions,
                fields: ['permissions', 'role']
            },
            dataAccess: {
                type: 'Employment',
                reason: 'Permission management'
            },
            compliance: {
                gdprRelevant: true
            }
        });
    }

    /**
     * Get audit logs for resource
     */
    static async getResourceAuditTrail(resourceType, resourceId, limit = 100) {
        try {
            return await AuditLog.find({
                resourceType,
                resourceId
            })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get user activity
     */
    static async getUserActivity(userId, limit = 50) {
        try {
            return await AuditLog.find({
                'actor.id': userId
            })
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get audit logs for organization
     */
    static async getOrganizationAuditLog(organizationId, filters = {}, limit = 100, skip = 0) {
        try {
            const query = {
                'context.organizationId': organizationId,
                ...filters
            };

            const logs = await AuditLog.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip)
                .lean();

            const total = await AuditLog.countDocuments(query);

            return { logs, total };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Generate compliance report
     */
    static async generateComplianceReport(organizationId, startDate, endDate) {
        try {
            const logs = await AuditLog.find({
                'context.organizationId': organizationId,
                'compliance.gdprRelevant': true,
                createdAt: { $gte: startDate, $lte: endDate }
            }).lean();

            const report = {
                organizationId,
                period: { startDate, endDate },
                totalEvents: logs.length,
                byAction: {},
                byActor: {},
                dataAccessLog: [],
                failedActions: []
            };

            for (const log of logs) {
                // Group by action
                report.byAction[log.action] = (report.byAction[log.action] || 0) + 1;

                // Group by actor
                const actorEmail = log.actor?.email || 'unknown';
                report.byActor[actorEmail] = (report.byActor[actorEmail] || 0) + 1;

                // Track data access
                if (log.dataAccess) {
                    report.dataAccessLog.push({
                        timestamp: log.createdAt,
                        actor: actorEmail,
                        type: log.dataAccess.type,
                        reason: log.dataAccess.reason,
                        resourceType: log.resourceType
                    });
                }

                // Track failures
                if (log.status === 'failed') {
                    report.failedActions.push({
                        timestamp: log.createdAt,
                        action: log.action,
                        actor: actorEmail,
                        error: log.errorMessage
                    });
                }
            }

            return report;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Export audit logs to CSV
     */
    static async exportAuditLogs(organizationId, startDate, endDate) {
        try {
            const logs = await AuditLog.find({
                'context.organizationId': organizationId,
                createdAt: { $gte: startDate, $lte: endDate }
            }).lean();

            // Convert to CSV
            const csv = [
                ['Timestamp', 'Actor', 'Action', 'Resource Type', 'Resource ID', 'Status', 'Data Access Type', 'Reason'].join(',')
            ];

            for (const log of logs) {
                csv.push([
                    log.createdAt.toISOString(),
                    log.actor?.email || 'system',
                    log.action,
                    log.resourceType || '-',
                    log.resourceId?.toString() || '-',
                    log.status,
                    log.dataAccess?.type || '-',
                    log.dataAccess?.reason || '-'
                ].map(v => `"${v}"`).join(','));
            }

            return csv.join('\n');
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Detect suspicious activity
     */
    static async detectSuspiciousActivity(userId) {
        try {
            const oneHourAgo = new Date(Date.now() - 3600000);

            // Get failed login attempts
            const failedLogins = await AuditLog.countDocuments({
                'actor.id': userId,
                action: 'login_failed',
                createdAt: { $gte: oneHourAgo }
            });

            // Get suspicious data exports
            const dataExports = await AuditLog.find({
                'actor.id': userId,
                action: 'data_export',
                createdAt: { $gte: oneHourAgo }
            }).lean();

            const suspicion = {
                isSuspicious: false,
                alerts: []
            };

            // Alert on multiple failed logins
            if (failedLogins > 5) {
                suspicion.isSuspicious = true;
                suspicion.alerts.push({
                    type: 'brute_force',
                    severity: 'high',
                    message: `${failedLogins} failed login attempts in the last hour`
                });
            }

            // Alert on unusual data access pattern
            if (dataExports.length > 3) {
                suspicion.isSuspicious = true;
                suspicion.alerts.push({
                    type: 'unusual_data_access',
                    severity: 'medium',
                    message: `${dataExports.length} data exports in the last hour`
                });
            }

            return suspicion;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Notify compliance system
     */
    static async notifyComplianceSystem(auditLog) {
        try {
            // Send to external compliance system (e.g., Domo, Segment, etc.)
            console.log('Compliance notification:', auditLog);

            // TODO: Implement integration with compliance system
            recordEvent('compliance_notified', {
                action: auditLog.action,
                resourceType: auditLog.resourceType
            });
        } catch (error) {
            Sentry.captureException(error);
            console.error('Compliance notification error:', error);
        }
    }
}

module.exports = {
    AuditLog,
    AuditLogService
};
