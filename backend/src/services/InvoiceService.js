const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },

    customer: {
        name: String,
        email: String,
        phone: String,
        company: String,
        address: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        }
    },

    items: [{
        description: String,
        quantity: { type: Number, default: 1 },
        unitPrice: Number,
        tax: Number,
        total: Number,
        category: String
    }],

    totals: {
        subtotal: Number,
        tax: Number,
        discount: Number,
        total: { type: Number, required: true }
    },

    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'canceled'], default: 'draft' },

    payment: {
        paymentId: String,
        paidAt: Date,
        paidAmount: Number,
        method: String,
        transactionId: String
    },

    dueDate: Date,
    issuedAt: { type: Date, default: Date.now },

    terms: {
        paymentTerms: { type: String, default: 'NET30' },
        notes: String,
        footerText: String
    },

    metadata: {
        orderIds: [String],
        projectId: String,
        departmentId: String,
        tags: [String]
    },

    pdf: {
        url: String,
        generatedAt: Date,
        version: Number
    },

    reminders: [{
        reminderType: { type: String, enum: ['due_soon', 'overdue', 'payment_received'] },
        sentAt: Date,
        count: Number
    }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

invoiceSchema.index({ userId: 1, issuedAt: -1 });
invoiceSchema.index({ status: 1, dueDate: 1 });
invoiceSchema.index({ 'payment.paidAt': 1 });

// Credit Note Schema
const creditNoteSchema = new mongoose.Schema({
    creditNoteNumber: { type: String, required: true, unique: true, index: true },
    invoiceId: String,
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    reason: String,
    items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number
    }],
    status: { type: String, enum: ['draft', 'issued', 'applied', 'canceled'], default: 'draft' },
    appliedAt: Date,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);
const CreditNote = mongoose.model('CreditNote', creditNoteSchema);

class InvoiceService {
    // Create Invoice
    async createInvoice(userId, invoiceData) {
        try {
            const invoiceNumber = await this.generateInvoiceNumber();

            const invoice = new Invoice({
                invoiceNumber,
                userId,
                customer: invoiceData.customer,
                items: invoiceData.items,
                totals: this.calculateTotals(invoiceData.items),
                currency: invoiceData.currency || 'USD',
                dueDate: invoiceData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                terms: invoiceData.terms || {}
            });

            await invoice.save();
            recordEvent('invoice_created', { userId, invoiceNumber, total: invoice.totals.total });
            return invoice;
        } catch (error) {
            Sentry.captureException(error);
            throw new Error(`Fatura oluşturulurken hata: ${error.message}`);
        }
    }

    // Get Invoice
    async getInvoice(invoiceId) {
        try {
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {throw new Error('Fatura bulunamadı');}

            recordEvent('invoice_retrieved', { invoiceId });
            return invoice;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Get User Invoices
    async getUserInvoices(userId, filter = {}, limit = 50, offset = 0) {
        try {
            const query = { userId, ...filter };
            const invoices = await Invoice.find(query)
                .sort({ issuedAt: -1 })
                .limit(limit)
                .skip(offset);

            const total = await Invoice.countDocuments(query);

            recordEvent('user_invoices_retrieved', { userId, count: invoices.length });
            return { invoices, total };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Send Invoice
    async sendInvoice(invoiceId, recipientEmail) {
        try {
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {throw new Error('Fatura bulunamadı');}

            // Generate PDF if not exists
            if (!invoice.pdf.url) {
                await this.generateInvoicePDF(invoiceId);
            }

            // Send email (mock)
            // In production, integrate with email service
            await Invoice.findByIdAndUpdate(
                invoiceId,
                {
                    status: 'sent',
                    updatedAt: new Date()
                },
                { new: true }
            );

            recordEvent('invoice_sent', { invoiceId, recipientEmail });
            return { success: true, message: 'Fatura gönderildi' };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Generate Invoice PDF
    async generateInvoicePDF(invoiceId) {
        try {
            const invoice = await Invoice.findById(invoiceId);
            if (!invoice) {throw new Error('Fatura bulunamadı');}

            // Create PDF document
            const doc = new PDFDocument();

            // PDF generation logic (simplified)
            doc.fontSize(20).text('FATURA', 100, 100);
            doc.fontSize(12).text(`Fatura No: ${invoice.invoiceNumber}`, 100, 140);
            doc.text(`Tarih: ${invoice.issuedAt.toLocaleDateString('tr-TR')}`, 100, 160);
            doc.text(`Vade: ${invoice.dueDate.toLocaleDateString('tr-TR')}`, 100, 180);

            // Customer info
            doc.fontSize(10).text('Müşteri Bilgileri:', 100, 220);
            doc.text(`${invoice.customer.name}`, 100, 240);
            doc.text(`${invoice.customer.address.line1}`, 100, 260);

            // Items table
            let yPosition = 320;
            doc.fontSize(10).text('Açıklama', 100, yPosition);
            doc.text('Miktar', 250, yPosition);
            doc.text('Birim Fiyat', 330, yPosition);
            doc.text('Toplam', 450, yPosition);

            yPosition += 20;
            for (const item of invoice.items) {
                doc.text(item.description, 100, yPosition);
                doc.text(item.quantity.toString(), 250, yPosition);
                doc.text(`${item.unitPrice.toFixed(2)} ${invoice.currency}`, 330, yPosition);
                doc.text(`${item.total.toFixed(2)} ${invoice.currency}`, 450, yPosition);
                yPosition += 20;
            }

            // Totals
            yPosition += 20;
            doc.text(`Ara Toplam: ${invoice.totals.subtotal.toFixed(2)} ${invoice.currency}`, 100, yPosition);
            yPosition += 20;
            doc.text(`Vergi: ${invoice.totals.tax.toFixed(2)} ${invoice.currency}`, 100, yPosition);
            yPosition += 20;
            doc.fontSize(12).text(`GENEL TOPLAM: ${invoice.totals.total.toFixed(2)} ${invoice.currency}`, 100, yPosition);

            // Save PDF URL (mock)
            const pdfUrl = `/invoices/${invoiceId}.pdf`;

            await Invoice.findByIdAndUpdate(
                invoiceId,
                {
                    'pdf.url': pdfUrl,
                    'pdf.generatedAt': new Date(),
                    'pdf.version': (invoice.pdf.version || 0) + 1
                },
                { new: true }
            );

            recordEvent('invoice_pdf_generated', { invoiceId });
            return { pdfUrl };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Mark as Paid
    async markAsPaid(invoiceId, paymentData) {
        try {
            const invoice = await Invoice.findByIdAndUpdate(
                invoiceId,
                {
                    status: 'paid',
                    'payment.paidAt': new Date(),
                    'payment.paidAmount': paymentData.amount,
                    'payment.method': paymentData.method,
                    'payment.transactionId': paymentData.transactionId,
                    updatedAt: new Date()
                },
                { new: true }
            );

            recordEvent('invoice_marked_paid', { invoiceId, amount: paymentData.amount });
            return invoice;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Calculate Totals
    calculateTotals(items) {
        const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
        const tax = items.reduce((sum, item) => sum + (item.tax || 0), 0);
        const discount = 0; // Can be calculated based on discounts

        return {
            subtotal,
            tax,
            discount,
            total: subtotal + tax - discount
        };
    }

    // Generate Invoice Number
    async generateInvoiceNumber() {
        const count = await Invoice.countDocuments();
        const year = new Date().getFullYear();
        return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
    }

    // Invoice Statistics
    async getInvoiceStats(userId) {
        try {
            const invoices = await Invoice.find({ userId });

            const stats = {
                totalInvoices: invoices.length,
                totalAmount: invoices.reduce((sum, inv) => sum + inv.totals.total, 0),
                paidAmount: invoices
                    .filter(inv => inv.status === 'paid')
                    .reduce((sum, inv) => sum + inv.totals.total, 0),
                overdueAmount: invoices
                    .filter(inv => inv.status === 'overdue')
                    .reduce((sum, inv) => sum + inv.totals.total, 0),
                byStatus: {},
                averageAmount: 0
            };

            // Count by status
            for (const invoice of invoices) {
                stats.byStatus[invoice.status] = (stats.byStatus[invoice.status] || 0) + 1;
            }

            stats.averageAmount = invoices.length > 0 ? stats.totalAmount / invoices.length : 0;

            recordEvent('invoice_stats_calculated', stats);
            return stats;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Create Credit Note
    async createCreditNote(userId, invoiceId, amount, reason) {
        try {
            const creditNoteNumber = `CN-${Date.now()}`;

            const creditNote = new CreditNote({
                creditNoteNumber,
                invoiceId,
                userId,
                amount,
                reason
            });

            await creditNote.save();
            recordEvent('credit_note_created', { userId, invoiceId, amount });
            return creditNote;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    // Check Overdue Invoices
    async checkOverdueInvoices() {
        try {
            const now = new Date();
            const overdueInvoices = await Invoice.find({
                dueDate: { $lt: now },
                status: { $nin: ['paid', 'canceled'] }
            });

            for (const invoice of overdueInvoices) {
                if (invoice.status !== 'overdue') {
                    invoice.status = 'overdue';
                    await invoice.save();
                }
            }

            recordEvent('overdue_invoices_checked', { count: overdueInvoices.length });
            return overdueInvoices;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

module.exports = { InvoiceService, Invoice, CreditNote };
