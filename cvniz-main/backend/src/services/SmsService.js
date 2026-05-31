class SmsService {
    constructor() {
        // Init provider SDK here if needed
        this.provider = 'mock';
    }

    async sendSms(phone, message) {
        if (!phone) {return { success: false, error: 'No phone number' };}

        // Real integration would go here (Netgsm, Twilio etc.)
        console.log(`📱 [MOCK SMS] To: ${phone} | Message: ${message}`);

        return { success: true, messageId: `SMS-${Date.now()}` };
    }

    async getTemplate(slug, replacements = {}) {
        try {
            const EmailTemplate = require('../models/EmailTemplate');
            const template = await EmailTemplate.findOne({ slug, channel: 'sms', status: 'active' });

            if (!template) {return null;}

            let message = template.content;

            // Replace variables
            for (const [key, value] of Object.entries(replacements)) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                message = message.replace(regex, value);
            }

            return message;
        } catch (error) {
            console.error('SMS Template fetch error:', error);
            return null;
        }
    }

    async sendPaymentSuccess(user, payment) {
        if (!user.phone) {return;}

        const replacements = { amount: payment.amount };
        const dbMessage = await this.getTemplate('payment-success', replacements);

        const message = dbMessage || `CVniz: ${payment.amount}TL odemeniz alindi. Iyi gunler dileriz.`;
        return this.sendSms(user.phone, message);
    }

    async sendBankTransferApproved(user, payment) {
        if (!user.phone) {return;}

        const replacements = { name: user.name };
        const dbMessage = await this.getTemplate('bank-transfer-approved', replacements);

        const message = dbMessage || 'CVniz: Havale isleminiz onaylandi. Premium uyeliginiz basladi.';
        return this.sendSms(user.phone, message);
    }
}

module.exports = new SmsService();
