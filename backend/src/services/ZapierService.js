const axios = require('axios');
const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

class ZapierService {
  constructor() {
    this.baseURL = 'https://hooks.zapier.com/hooks/catch';
    this.webhooks = new Map();
    this.events = [
      'cv.created',
      'cv.updated',
      'cv.deleted',
      'cv.shared',
      'interview.completed',
      'payment.received',
      'subscription.activated',
      'application.submitted'
    ];
  }

  async registerWebhook(userId, event, webhookUrl) {
    try {
      if (!this.events.includes(event)) {
        throw new Error(`Geçersiz event: ${event}`);
      }

      const webhookId = `${userId}_${event}_${Date.now()}`;
      this.webhooks.set(webhookId, {
        userId,
        event,
        webhookUrl,
        active: true,
        createdAt: new Date(),
        lastTriggered: null,
        triggerCount: 0
      });

      recordEvent({
        type: 'zapier_webhook_registered',
        userId,
        event,
        webhookId
      });

      return {
        webhookId,
        event,
        status: 'active',
        message: `${event} için webhook kaydedildi`
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async triggerEvent(event, data, userId) {
    try {
      const webhooks = Array.from(this.webhooks.values()).filter(
        w => w.event === event && w.userId === userId && w.active
      );

      for (const webhook of webhooks) {
        try {
          await axios.post(webhook.webhookUrl, {
            event,
            data,
            timestamp: new Date().toISOString(),
            source: 'cvniz-app'
          }, {
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
          });

          webhook.lastTriggered = new Date();
          webhook.triggerCount += 1;

          recordEvent({
            type: 'zapier_event_triggered',
            event,
            userId,
            success: true
          });
        } catch (err) {
          recordEvent({
            type: 'zapier_event_failed',
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

  async listWebhooks(userId) {
    return Array.from(this.webhooks.values())
      .filter(w => w.userId === userId)
      .map(w => ({
        webhookId: w.webhookId,
        event: w.event,
        active: w.active,
        createdAt: w.createdAt,
        lastTriggered: w.lastTriggered,
        triggerCount: w.triggerCount
      }));
  }

  async deleteWebhook(webhookId, userId) {
    const webhook = this.webhooks.get(webhookId);
    
    if (!webhook || webhook.userId !== userId) {
      throw new Error('Webhook bulunamadı');
    }

    this.webhooks.delete(webhookId);

    recordEvent({
      type: 'zapier_webhook_deleted',
      webhookId,
      userId
    });

    return { message: 'Webhook silindi' };
  }

  async getWebhookStats(userId) {
    const userWebhooks = Array.from(this.webhooks.values())
      .filter(w => w.userId === userId);

    return {
      totalWebhooks: userWebhooks.length,
      activeWebhooks: userWebhooks.filter(w => w.active).length,
      totalTriggers: userWebhooks.reduce((sum, w) => sum + w.triggerCount, 0),
      byEvent: this.events.reduce((acc, event) => {
        acc[event] = userWebhooks.filter(w => w.event === event).length;
        return acc;
      }, {})
    };
  }
}

module.exports = ZapierService;
