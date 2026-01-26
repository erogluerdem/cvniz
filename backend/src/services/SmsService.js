class SmsService {
    constructor() {
        // Init provider SDK here if needed
        this.provider = 'mock';
    }

    async sendSms(phone, message) {
        if (!phone) return { success: false, error: 'No phone number' };

        // Real integration would go here (Netgsm, Twilio etc.)
        console.log(`📱 [MOCK SMS] To: ${phone} | Message: ${message}`);

        return { success: true, messageId: `SMS-${Date.now()}` };
    }

    async sendPaymentSuccess(user, payment) {
        if (!user.phone) return;
        const message = `CVniz: ${payment.amount}TL odemeniz alindi. Iyi gunler dileriz.`;
        return this.sendSms(user.phone, message);
    }

    async sendBankTransferApproved(user, payment) {
        if (!user.phone) return;
        const message = `CVniz: Havale isleminiz onaylandi. Premium uyeliginiz basladi.`;
        return this.sendSms(user.phone, message);
    }
}

module.exports = new SmsService();
