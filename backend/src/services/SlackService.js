const axios = require('axios');
const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

class SlackService {
    constructor() {
        this.webhookUrls = new Map();
        this.channels = new Map();
        this.notificationTypes = [
            'cv_completed',
            'interview_passed',
            'job_matched',
            'payment_received',
            'subscription_renewed',
            'achievement_unlocked',
            'message_from_recruiter'
        ];
    }

    async connectSlack(userId, botToken, teamId) {
        try {
            // Slack API ile doğrula
            const response = await axios.get('https://slack.com/api/auth.test', {
                headers: { 'Authorization': `Bearer ${botToken}` }
            });

            if (!response.data.ok) {
                throw new Error('Slack tokeni geçersiz');
            }

            const connectionId = `slack_${userId}_${Date.now()}`;
            this.webhookUrls.set(connectionId, {
                userId,
                botToken,
                teamId,
                teamName: response.data.team,
                botId: response.data.bot_id,
                connectedAt: new Date(),
                active: true
            });

            recordEvent({
                type: 'slack_connected',
                userId,
                teamId
            });

            return {
                connectionId,
                team: response.data.team,
                status: 'connected'
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async configureNotifications(userId, connectionId, notifications) {
        try {
            const connection = this.webhookUrls.get(connectionId);
            if (!connection || connection.userId !== userId) {
                throw new Error('Bağlantı bulunamadı');
            }

            const channelConfig = {
                connectionId,
                userId,
                notifications: {},
                updatedAt: new Date()
            };

            for (const [type, config] of Object.entries(notifications)) {
                if (!this.notificationTypes.includes(type)) {
                    throw new Error(`Geçersiz bildirim tipi: ${type}`);
                }

                channelConfig.notifications[type] = {
                    enabled: config.enabled || false,
                    channel: config.channel || '#general',
                    mentions: config.mentions || [],
                    format: config.format || 'default'
                };
            }

            const configId = `config_${userId}_${connectionId}`;
            this.channels.set(configId, channelConfig);

            recordEvent({
                type: 'slack_notifications_configured',
                userId,
                connectionId
            });

            return {
                configId,
                message: 'Slack bildirimleri yapılandırıldı'
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async sendNotification(userId, notificationType, message, metadata = {}) {
        try {
            const userConfigs = Array.from(this.channels.values())
                .filter(c => c.userId === userId);

            for (const config of userConfigs) {
                const notifConfig = config.notifications[notificationType];

                if (!notifConfig || !notifConfig.enabled) {continue;}

                const connection = this.webhookUrls.get(config.connectionId);
                if (!connection || !connection.active) {continue;}

                const slackMessage = this.formatSlackMessage(
                    notificationType,
                    message,
                    metadata,
                    notifConfig.mentions
                );

                try {
                    await axios.post(
                        'https://slack.com/api/chat.postMessage',
                        {
                            channel: notifConfig.channel,
                            ...slackMessage
                        },
                        {
                            headers: { 'Authorization': `Bearer ${connection.botToken}` }
                        }
                    );

                    recordEvent({
                        type: 'slack_notification_sent',
                        userId,
                        notificationType
                    });
                } catch (err) {
                    recordEvent({
                        type: 'slack_notification_failed',
                        userId,
                        notificationType,
                        error: err.message
                    });
                }
            }
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    formatSlackMessage(type, message, metadata, mentions = []) {
        const colors = {
            cv_completed: '#36a64f',
            interview_passed: '#2ecc71',
            job_matched: '#3498db',
            payment_received: '#f39c12',
            subscription_renewed: '#9b59b6',
            achievement_unlocked: '#e74c3c',
            message_from_recruiter: '#1abc9c'
        };

        const mentions_str = mentions.length > 0
            ? `${mentions.map(m => `<@${m}>`).join(' ')} `
            : '';

        return {
            blocks: [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `📢 ${message}`,
                        emoji: true
                    }
                },
                {
                    type: 'section',
                    fields: Object.entries(metadata)
                        .slice(0, 6)
                        .map(([key, value]) => ({
                            type: 'mrkdwn',
                            text: `*${key}:*\n${value}`
                        }))
                }
            ],
            attachments: [
                {
                    color: colors[type] || '#95a5a6',
                    footer: 'cvniz App',
                    ts: Math.floor(Date.now() / 1000)
                }
            ]
        };
    }

    async listConnections(userId) {
        return Array.from(this.webhookUrls.values())
            .filter(w => w.userId === userId)
            .map(w => ({
                connectionId: w.teamId,
                team: w.teamName,
                active: w.active,
                connectedAt: w.connectedAt
            }));
    }

    async disconnectSlack(userId, connectionId) {
        const connection = this.webhookUrls.get(connectionId);

        if (!connection || connection.userId !== userId) {
            throw new Error('Bağlantı bulunamadı');
        }

        // İlişkili yapılandırmaları temizle
        for (const [key, config] of this.channels.entries()) {
            if (config.connectionId === connectionId) {
                this.channels.delete(key);
            }
        }

        this.webhookUrls.delete(connectionId);

        recordEvent({
            type: 'slack_disconnected',
            userId,
            connectionId
        });

        return { message: 'Slack bağlantısı kesildi' };
    }

    async getNotificationStats(userId) {
        const userConfigs = Array.from(this.channels.values())
            .filter(c => c.userId === userId);

        const stats = {
            totalConnections: new Set(userConfigs.map(c => c.connectionId)).size,
            enabledNotifications: 0,
            byType: {}
        };

        for (const config of userConfigs) {
            for (const [type, notif] of Object.entries(config.notifications)) {
                if (notif.enabled) {
                    stats.enabledNotifications += 1;
                    stats.byType[type] = (stats.byType[type] || 0) + 1;
                }
            }
        }

        return stats;
    }
}

module.exports = SlackService;
