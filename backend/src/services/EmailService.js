const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.initialize();
    }

    initialize() {
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
            console.log('✅ Email Service: SMTP configured');
        } else {
            console.log('⚠️ Email Service: SMTP credentials missing (Mock Mode)');
        }
    }

    async sendMail(to, subject, html) {
        if (!this.transporter) {
            console.log(`📧 [MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            return Promise.resolve({ success: true, mock: true });
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"CVniz" <noreply@cvniz.com>',
                to,
                subject,
                html
            });
            console.log(`✅ Email sent: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Email failed:', error);
            return { success: false, error };
        }
    }

    async getTemplate(slug, replacements = {}) {
        try {
            const EmailTemplate = require('../models/EmailTemplate');
            const template = await EmailTemplate.findOne({ slug, channel: 'email', status: 'active' });

            if (!template) return null;

            let subject = template.subject;
            let html = template.content; // Assuming content is HTML for now, or use htmlContent field

            // Replace variables
            for (const [key, value] of Object.entries(replacements)) {
                const regex = new RegExp(`{{${key}}}`, 'g');
                subject = subject.replace(regex, value);
                html = html.replace(regex, value);
            }

            return { subject, html };
        } catch (error) {
            console.error('Template fetch error:', error);
            return null;
        }
    }

    // Templates
    async sendPaymentSuccess(user, payment) {
        const replacements = {
            name: user.name,
            planName: payment.planName,
            amount: payment.amount,
            billingCycle: payment.billingCycle,
            date: new Date(payment.createdAt).toLocaleDateString()
        };

        const dbTemplate = await this.getTemplate('payment-success', replacements);
        if (dbTemplate) {
            return this.sendMail(user.email, dbTemplate.subject, dbTemplate.html);
        }

        // Fallback
        const subject = 'CVniz - Ödemeniz Başarıyla alındı';
        const html = `
            <h1>Merhaba ${user.name},</h1>
            <p><strong>${payment.planName}</strong> planı için yaptığınız <strong>${payment.amount}₺</strong> tutarındaki ödeme başarıyla alınmıştır.</p>
            <p>Fatura Detayları:</p>
            <ul>
                <li>Plan: ${payment.planName}</li>
                <li>Tutar: ${payment.amount}₺</li>
                <li>Dönem: ${payment.billingCycle}</li>
                <li>Tarih: ${new Date(payment.createdAt).toLocaleDateString()}</li>
            </ul>
            <p>CV'nizi oluşturmaya hemen başlayabilirsiniz.</p>
        `;
        return this.sendMail(user.email, subject, html);
    }

    async sendBankTransferReceived(user, payment) {
        const replacements = {
            name: user.name,
            transactionId: payment.transactionId
        };

        const dbTemplate = await this.getTemplate('bank-transfer-received', replacements);
        if (dbTemplate) {
            return this.sendMail(user.email, dbTemplate.subject, dbTemplate.html);
        }

        const subject = 'CVniz - Havale Bildiriminiz Alındı';
        const html = `
            <h1>Merhaba ${user.name},</h1>
            <p>Havale bildiriminiz bize ulaştı. Yöneticilerimiz dekontunuzu inceleyip en kısa sürede üyeliğinizi onaylayacaktır.</p>
            <p>İşlem No: ${payment.transactionId}</p>
        `;
        return this.sendMail(user.email, subject, html);
    }

    async sendBankTransferApproved(user, payment) {
        const replacements = { name: user.name };

        const dbTemplate = await this.getTemplate('bank-transfer-approved', replacements);
        if (dbTemplate) {
            return this.sendMail(user.email, dbTemplate.subject, dbTemplate.html);
        }

        const subject = 'CVniz - Üyeliğiniz Onaylandı! 🎉';
        const html = `
            <h1>Tebrikler ${user.name}!</h1>
            <p>Havale işleminiz onaylanmıştır. Premium özellikleriniz hesabınıza tanımlandı.</p>
            <p>Hemen giriş yapıp CV'nizi düzenleyebilirsiniz.</p>
        `;
        return this.sendMail(user.email, subject, html);
    }

    async sendBankTransferRejected(user, payment) {
        const replacements = {
            name: user.name,
            adminNote: payment.adminNote || 'Belirtilmedi'
        };

        const dbTemplate = await this.getTemplate('bank-transfer-rejected', replacements);
        if (dbTemplate) {
            return this.sendMail(user.email, dbTemplate.subject, dbTemplate.html);
        }

        const subject = 'CVniz - Havale Bildirimi Hakkında';
        const html = `
            <h1>Merhaba ${user.name},</h1>
            <p>Maalesef havale bildiriminiz reddedildi.</p>
            <p><strong>Sebep:</strong> ${payment.adminNote}</p>
            <p>Lütfen destek ekibimizle iletişime geçin veya işlemi tekrarlayın.</p>
        `;
        return this.sendMail(user.email, subject, html);
    }

    async sendAdminNotification(payment) {
        // Did not convert this to template yet as it is internal
        // Send to admin email (from env or hardcoded for now)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cvniz.com';
        const subject = `[Admin] Yeni Havale Bildirimi: ${payment.amount}₺`;
        const html = `
            <p>Yeni bir havale bildirimi var.</p>
            <ul>
                <li>Kullanıcı: ${payment.userName} (${payment.userEmail})</li>
                <li>Tutar: ${payment.amount}₺</li>
                <li>Gönderen: ${payment.senderName}</li>
            </ul>
            <a href="${process.env.FRONTEND_URL}/admin/payments">Panele Git</a>
        `;
        return this.sendMail(adminEmail, subject, html);
    }
}

module.exports = new EmailService();
