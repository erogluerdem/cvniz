const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// Tax Rate Schema
const taxRateSchema = new mongoose.Schema({
  taxRateId: { type: String, required: true, unique: true, index: true },
  country: { type: String, required: true },
  region: String,
  taxType: { type: String, enum: ['vat', 'gst', 'sales_tax', 'income_tax'], required: true },
  rate: { type: Number, required: true }, // e.g., 0.18 for 18%
  effectiveFrom: { type: Date, default: Date.now },
  effectiveUntil: Date,
  applicableCategories: [String],
  exemptedCategories: [String],
  status: { type: String, enum: ['active', 'inactive', 'deprecated'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

taxRateSchema.index({ country: 1, taxType: 1, status: 1 });

// Tax Calculation Schema
const taxCalculationSchema = new mongoose.Schema({
  calculationId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  invoiceId: String,
  
  billing: {
    country: String,
    state: String,
    city: String,
    postalCode: String
  },

  items: [{
    itemId: String,
    description: String,
    category: String,
    amount: Number,
    taxable: Boolean,
    taxRate: Number,
    taxAmount: Number
  }],

  totals: {
    subtotal: Number,
    taxableAmount: Number,
    totalTax: Number,
    total: Number
  },

  breakdown: {
    vat: Number,
    gst: Number,
    stateTax: Number,
    localTax: Number,
    other: Number
  },

  compliance: {
    requiresFilig: Boolean,
    jurisdiction: String,
    deadlineDate: Date,
    notes: String
  },

  createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

taxCalculationSchema.index({ userId: 1, createdAt: -1 });

// Tax Filing Schema
const taxFilingSchema = new mongoose.Schema({
  filingId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  
  period: {
    year: Number,
    quarter: { type: Number, enum: [1, 2, 3, 4] },
    startDate: Date,
    endDate: Date
  },

  jurisdiction: String,
  filingType: { type: String, enum: ['monthly', 'quarterly', 'annual'], default: 'quarterly' },
  
  amounts: {
    totalSales: Number,
    totalTaxable: Number,
    totalTaxCollected: Number,
    taxCredits: Number,
    taxDue: Number
  },

  status: { type: String, enum: ['draft', 'prepared', 'submitted', 'accepted', 'rejected'], default: 'draft' },
  
  submission: {
    submittedAt: Date,
    confirmationNumber: String,
    submissionMethod: String,
    dueDate: Date
  },

  documentation: {
    invoices: [String],
    expenses: [String],
    credits: [String],
    supportingDocs: [String]
  },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

taxFilingSchema.index({ userId: 1, 'period.year': 1, 'period.quarter': 1 });

const TaxRate = mongoose.model('TaxRate', taxRateSchema);
const TaxCalculation = mongoose.model('TaxCalculation', taxCalculationSchema);
const TaxFiling = mongoose.model('TaxFiling', taxFilingSchema);

class TaxService {
  // Get Applicable Tax Rate
  async getTaxRate(country, category, date = new Date()) {
    try {
      const taxRate = await TaxRate.findOne({
        country,
        applicableCategories: { $in: [category, 'all'] },
        exemptedCategories: { $nin: [category] },
        status: 'active',
        effectiveFrom: { $lte: date },
        $or: [
          { effectiveUntil: { $exists: false } },
          { effectiveUntil: { $gte: date } }
        ]
      });

      if (!taxRate) {
        // Default tax rate
        const defaultRate = await TaxRate.findOne({
          country,
          applicableCategories: 'all',
          status: 'active'
        });
        return defaultRate || { rate: 0.18 }; // Default 18%
      }

      recordEvent('tax_rate_retrieved', { country, category, rate: taxRate.rate });
      return taxRate;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Calculate Tax for Items
  async calculateTax(userId, items, billingInfo) {
    try {
      const calculationId = `taxcalc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      let subtotal = 0;
      let totalTax = 0;
      const calculatedItems = [];

      for (const item of items) {
        const taxRate = await this.getTaxRate(billingInfo.country, item.category);
        const itemTax = item.amount * (taxRate.rate || 0);
        
        calculatedItems.push({
          ...item,
          taxRate: taxRate.rate,
          taxAmount: itemTax
        });

        subtotal += item.amount;
        totalTax += itemTax;
      }

      const calculation = new TaxCalculation({
        calculationId,
        userId,
        billing: billingInfo,
        items: calculatedItems,
        totals: {
          subtotal,
          taxableAmount: subtotal,
          totalTax,
          total: subtotal + totalTax
        }
      });

      await calculation.save();
      recordEvent('tax_calculated', { userId, total: calculation.totals.total, tax: totalTax });
      return calculation;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Get User Tax Summary
  async getUserTaxSummary(userId, year) {
    try {
      const calculations = await TaxCalculation.find({
        userId,
        createdAt: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1)
        }
      });

      const summary = {
        year,
        totalSales: calculations.reduce((sum, c) => sum + c.totals.subtotal, 0),
        totalTaxCollected: calculations.reduce((sum, c) => sum + c.totals.totalTax, 0),
        byQuarter: {
          Q1: 0,
          Q2: 0,
          Q3: 0,
          Q4: 0
        },
        filings: {}
      };

      // Group by quarter
      for (const calc of calculations) {
        const month = calc.createdAt.getMonth();
        const quarter = Math.floor(month / 3) + 1;
        summary.byQuarter[`Q${quarter}`] += calc.totals.totalTax;
      }

      recordEvent('tax_summary_retrieved', { userId, year, totalTax: summary.totalTaxCollected });
      return summary;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Create Tax Filing
  async createTaxFiling(userId, filingData) {
    try {
      const filingId = `taxfiling_${Date.now()}`;
      const year = filingData.period.year;
      const quarter = filingData.period.quarter;

      const startDate = new Date(year, (quarter - 1) * 3, 1);
      const endDate = new Date(year, quarter * 3, 0);

      // Calculate amounts from transactions
      const calculations = await TaxCalculation.find({
        userId,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      const totalSales = calculations.reduce((sum, c) => sum + c.totals.subtotal, 0);
      const totalTaxCollected = calculations.reduce((sum, c) => sum + c.totals.totalTax, 0);

      const filing = new TaxFiling({
        filingId,
        userId,
        period: {
          ...filingData.period,
          startDate,
          endDate
        },
        amounts: {
          totalSales,
          totalTaxable: totalSales,
          totalTaxCollected,
          taxDue: totalTaxCollected
        },
        documentation: {
          invoices: calculations.map(c => c._id.toString())
        }
      });

      await filing.save();
      recordEvent('tax_filing_created', { userId, filingId, taxDue: totalTaxCollected });
      return filing;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Submit Tax Filing
  async submitTaxFiling(filingId, submissionData) {
    try {
      const filing = await TaxFiling.findOneAndUpdate(
        { filingId },
        {
          status: 'submitted',
          'submission.submittedAt': new Date(),
          'submission.confirmationNumber': submissionData.confirmationNumber,
          'submission.submissionMethod': submissionData.method,
          'submission.dueDate': submissionData.dueDate,
          updatedAt: new Date()
        },
        { new: true }
      );

      recordEvent('tax_filing_submitted', { filingId, confirmationNumber: submissionData.confirmationNumber });
      return filing;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Get Upcoming Tax Deadlines
  async getUpcomingDeadlines(jurisdiction) {
    try {
      const now = new Date();
      const nextYear = new Date(now.getFullYear() + 1, 11, 31);

      const filings = await TaxFiling.find({
        jurisdiction,
        'submission.dueDate': { $gte: now, $lte: nextYear },
        status: { $nin: ['submitted', 'accepted'] }
      }).sort({ 'submission.dueDate': 1 });

      recordEvent('tax_deadlines_retrieved', { jurisdiction, count: filings.length });
      return filings;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Compliance Check
  async checkCompliance(userId, year) {
    try {
      const filings = await TaxFiling.find({
        userId,
        'period.year': year
      });

      const expectedFilings = 4; // Quarterly
      const submittedFilings = filings.filter(f => f.status === 'submitted').length;
      const acceptedFilings = filings.filter(f => f.status === 'accepted').length;

      const compliance = {
        year,
        expectedFilings,
        submittedFilings,
        acceptedFilings,
        compliant: submittedFilings === expectedFilings && acceptedFilings === expectedFilings,
        missingFilings: expectedFilings - submittedFilings,
        status: acceptedFilings === expectedFilings ? 'compliant' : 
               submittedFilings === expectedFilings ? 'pending_review' : 'non_compliant'
      };

      recordEvent('compliance_checked', { userId, year, status: compliance.status });
      return compliance;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Add Tax Rate
  async addTaxRate(taxRateData) {
    try {
      const taxRateId = `taxrate_${taxRateData.country}_${taxRateData.taxType}`;
      
      const taxRate = new TaxRate({
        taxRateId,
        ...taxRateData
      });

      await taxRate.save();
      recordEvent('tax_rate_added', { country: taxRateData.country, rate: taxRateData.rate });
      return taxRate;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Tax Reporting
  async generateTaxReport(userId, year) {
    try {
      const summary = await this.getUserTaxSummary(userId, year);
      const filings = await TaxFiling.find({
        userId,
        'period.year': year
      });

      const report = {
        year,
        summary,
        filings: filings.map(f => ({
          period: f.period,
          status: f.status,
          amounts: f.amounts,
          submittedAt: f.submission.submittedAt
        })),
        generatedAt: new Date()
      };

      recordEvent('tax_report_generated', { userId, year });
      return report;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}

module.exports = { TaxService, TaxRate, TaxCalculation, TaxFiling };
