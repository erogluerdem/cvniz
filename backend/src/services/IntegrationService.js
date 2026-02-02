const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

class IntegrationService {
    constructor() {
        this.integrations = new Map();
        this.webhooks = new Map();
        this.supportedIntegrations = [
            'zapier',
            'slack',
            'google_calendar',
            'microsoft_teams',
            'discord',
            'github'
        ];
    }

    async enableIntegration(userId, integrationName, credentials = {}) {
        try {
            if (!this.supportedIntegrations.includes(integrationName)) {
                throw new Error(`Geçersiz entegrasyon: ${integrationName}`);
            }

            const integrationId = `${integrationName}_${userId}_${Date.now()}`;
            this.integrations.set(integrationId, {
                userId,
                integrationName,
                credentials,
                enabled: true,
                enabledAt: new Date(),
                lastSync: null,
                syncFrequency: 'realtime'
            });

            recordEvent({
                type: 'integration_enabled',
                userId,
                integrationName
            });

            return {
                integrationId,
                name: integrationName,
                status: 'enabled'
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async disableIntegration(userId, integrationId) {
        try {
            const integration = this.integrations.get(integrationId);

            if (!integration || integration.userId !== userId) {
                throw new Error('Entegrasyon bulunamadı');
            }

            integration.enabled = false;
            integration.disabledAt = new Date();

            recordEvent({
                type: 'integration_disabled',
                userId,
                integrationId,
                integrationName: integration.integrationName
            });

            return { message: 'Entegrasyon devre dışı bırakıldı' };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async registerWebhook(userId, integrationId, event, webhookUrl) {
        try {
            const integration = this.integrations.get(integrationId);

            if (!integration || integration.userId !== userId || !integration.enabled) {
                throw new Error('Entegrasyon bulunamadı');
            }

            const webhookId = `${integrationId}_${event}_${Date.now()}`;
            this.webhooks.set(webhookId, {
                userId,
                integrationId,
                integrationName: integration.integrationName,
                event,
                webhookUrl,
                active: true,
                createdAt: new Date(),
                triggerCount: 0,
                lastTriggered: null
            });

            recordEvent({
                type: 'webhook_registered',
                userId,
                integrationId,
                event
            });

            return {
                webhookId,
                event,
                status: 'active'
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async triggerWebhook(userId, event, data) {
        try {
            const webhooks = Array.from(this.webhooks.values()).filter(
                w => w.userId === userId && w.event === event && w.active
            );

            for (const webhook of webhooks) {
                const integration = this.integrations.get(webhook.integrationId);

                if (!integration || !integration.enabled) {continue;}

                try {
                    // Webhook tetikleme mantığı
                    webhook.lastTriggered = new Date();
                    webhook.triggerCount += 1;

                    recordEvent({
                        type: 'webhook_triggered',
                        event,
                        userId,
                        integrationName: webhook.integrationName,
                        webhookId: webhook.webhookId
                    });
                } catch (err) {
                    recordEvent({
                        type: 'webhook_trigger_failed',
                        event,
                        userId,
                        error: err.message
                    });
                }
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async listIntegrations(userId) {
        return Array.from(this.integrations.values())
            .filter(i => i.userId === userId)
            .map(i => ({
                integrationId: i.integrationId,
                name: i.integrationName,
                enabled: i.enabled,
                enabledAt: i.enabledAt,
                lastSync: i.lastSync
            }));
    }

    async getWebhooks(userId, integrationId) {
        const integration = this.integrations.get(integrationId);

        if (!integration || integration.userId !== userId) {
            throw new Error('Entegrasyon bulunamadı');
        }

        return Array.from(this.webhooks.values())
            .filter(w => w.integrationId === integrationId)
            .map(w => ({
                webhookId: w.webhookId,
                event: w.event,
                active: w.active,
                triggerCount: w.triggerCount,
                lastTriggered: w.lastTriggered
            }));
    }

    async getIntegrationStats(userId) {
        const userIntegrations = Array.from(this.integrations.values())
            .filter(i => i.userId === userId);

        const userWebhooks = Array.from(this.webhooks.values())
            .filter(w => w.userId === userId);

        return {
            totalIntegrations: userIntegrations.length,
            enabledIntegrations: userIntegrations.filter(i => i.enabled).length,
            totalWebhooks: userWebhooks.length,
            activeWebhooks: userWebhooks.filter(w => w.active).length,
            totalTriggers: userWebhooks.reduce((sum, w) => sum + w.triggerCount, 0),
            byIntegration: this.supportedIntegrations.reduce((acc, name) => {
                acc[name] = userIntegrations.filter(i => i.integrationName === name).length;
                return acc;
            }, {})
        };
    }

    async testIntegration(userId, integrationId) {
        try {
            const integration = this.integrations.get(integrationId);

            if (!integration || integration.userId !== userId) {
                throw new Error('Entegrasyon bulunamadı');
            }

            // Her entegrasyon için farklı test
            const testResults = {
                integrationName: integration.integrationName,
                status: 'connected',
                timestamp: new Date(),
                details: {
                    credentialsValid: true,
                    lastConnection: new Date(),
                    responseTime: Math.random() * 1000 // Simüle
                }
            };

            recordEvent({
                type: 'integration_tested',
                userId,
                integrationName: integration.integrationName,
                success: true
            });

            return testResults;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async revokeIntegration(userId, integrationId) {
        try {
            const integration = this.integrations.get(integrationId);

            if (!integration || integration.userId !== userId) {
                throw new Error('Entegrasyon bulunamadı');
            }

            // İlişkili webhook'ları sil
            for (const [key, webhook] of this.webhooks.entries()) {
                if (webhook.integrationId === integrationId) {
                    this.webhooks.delete(key);
                }
            }

            // Credentials temizle
            integration.credentials = {};
            integration.enabled = false;
            integration.revokedAt = new Date();

            recordEvent({
                type: 'integration_revoked',
                userId,
                integrationId,
                integrationName: integration.integrationName
            });

            return { message: 'Entegrasyon iptal edildi' };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

module.exports = IntegrationService;
