const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// Region Schema
const regionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  continent: String,
  timezone: { type: String, required: true },
  currency: { type: String, required: true },
  languages: [String],
  country: String,
  server: {
    location: String,
    ip: String,
    status: { type: String, enum: ['active', 'maintenance', 'degraded'], default: 'active' },
    latency: Number,
    capacity: { current: Number, max: Number }
  },
  compliance: {
    gdpr: Boolean,
    ccpa: Boolean,
    laws: [String],
    dataResidency: Boolean
  },
  features: {
    enabled: [String],
    disabled: [String],
    restrictions: [String]
  },
  pricing: {
    multiplier: { type: Number, default: 1.0 },
    currency: String,
    vat: Number
  },
  failover: {
    primary: String,
    backup: [String],
    strategy: { type: String, enum: ['round-robin', 'latency', 'weight'], default: 'latency' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

regionSchema.index({ code: 1, 'server.status': 1 });
regionSchema.index({ country: 1 });

// User Regional Preference Schema
const userRegionalPrefSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true, unique: true },
  primaryRegion: { type: String, required: true },
  secondaryRegions: [String],
  timezone: String,
  currency: String,
  language: String,
  dataResidency: String,
  ipLocation: {
    lastDetected: Date,
    country: String,
    region: String
  },
  preferences: {
    autoRegion: { type: Boolean, default: true },
    preferredServer: String,
    lowBandwidth: { type: Boolean, default: false }
  },
  settings: {
    cookieConsent: Map,
    analyticsSharing: Boolean,
    dataCollection: Boolean
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userRegionalPrefSchema.index({ userId: 1, primaryRegion: 1 });

const Region = mongoose.model('Region', regionSchema);
const UserRegionalPreference = mongoose.model('UserRegionalPreference', userRegionalPrefSchema);

class RegionalService {
  // Region Management
  async getAllRegions() {
    try {
      const regions = await Region.find().select('-server.ip');
      recordEvent('region_list_retrieved', { count: regions.length });
      return regions;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Bölgeleri listelerken hata: ${error.message}`);
    }
  }

  async getRegion(code) {
    try {
      const region = await Region.findOne({ code });
      if (!region) throw new Error('Bölge bulunamadı');
      recordEvent('region_retrieved', { code });
      return region;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async createRegion(regionData) {
    try {
      const region = new Region(regionData);
      await region.save();
      recordEvent('region_created', { code: region.code, timezone: region.timezone });
      return region;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Bölge oluşturulurken hata: ${error.message}`);
    }
  }

  async updateRegion(code, updates) {
    try {
      const region = await Region.findOneAndUpdate(
        { code },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      recordEvent('region_updated', { code, fields: Object.keys(updates) });
      return region;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Bölge güncellenirken hata: ${error.message}`);
    }
  }

  async deleteRegion(code) {
    try {
      await Region.deleteOne({ code });
      recordEvent('region_deleted', { code });
      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // User Regional Preferences
  async getUserRegionalPreference(userId) {
    try {
      let prefs = await UserRegionalPreference.findOne({ userId });
      if (!prefs) {
        prefs = await this.createUserRegionalPreference(userId, { primaryRegion: 'EU' });
      }
      recordEvent('user_regional_pref_retrieved', { userId });
      return prefs;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async createUserRegionalPreference(userId, data) {
    try {
      const prefs = new UserRegionalPreference({
        userId,
        ...data
      });
      await prefs.save();
      recordEvent('user_regional_pref_created', { userId, region: data.primaryRegion });
      return prefs;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async updateUserRegionalPreference(userId, updates) {
    try {
      const prefs = await UserRegionalPreference.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      recordEvent('user_regional_pref_updated', { userId });
      return prefs;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Regional Server Management
  async getOptimalRegion(userCountry) {
    try {
      const regions = await Region.find({ country: userCountry, 'server.status': 'active' })
        .sort({ 'server.latency': 1 })
        .limit(1);
      
      if (regions.length === 0) {
        return await Region.findOne({ 'server.status': 'active' }).sort({ 'server.latency': 1 });
      }
      
      recordEvent('optimal_region_selected', { userCountry, region: regions[0].code });
      return regions[0];
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async checkRegionHealth(code) {
    try {
      const region = await Region.findOne({ code });
      if (!region) throw new Error('Bölge bulunamadı');

      const healthScore = {
        code: region.code,
        status: region.server.status,
        latency: region.server.latency,
        capacity: {
          used: region.server.capacity.current,
          total: region.server.capacity.max,
          percentage: (region.server.capacity.current / region.server.capacity.max) * 100
        },
        healthy: region.server.status === 'active' && 
                 (region.server.capacity.current / region.server.capacity.max) < 0.85 &&
                 region.server.latency < 100
      };

      recordEvent('region_health_checked', { code, healthy: healthScore.healthy });
      return healthScore;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async updateServerStatus(code, status, metrics) {
    try {
      const update = {
        'server.status': status,
        'server.latency': metrics.latency,
        'server.capacity.current': metrics.capacityCurrent
      };

      const region = await Region.findOneAndUpdate({ code }, update, { new: true });
      recordEvent('server_status_updated', { code, status, latency: metrics.latency });
      return region;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Regional Features & Compliance
  async getRegionalFeatures(regionCode) {
    try {
      const region = await Region.findOne({ code: regionCode });
      if (!region) throw new Error('Bölge bulunamadı');

      recordEvent('regional_features_retrieved', { code: regionCode });
      return {
        enabled: region.features.enabled,
        disabled: region.features.disabled,
        restrictions: region.features.restrictions,
        compliance: region.compliance
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async checkCompliance(regionCode, feature) {
    try {
      const region = await Region.findOne({ code: regionCode });
      if (!region) throw new Error('Bölge bulunamadı');

      const isAllowed = !region.features.disabled.includes(feature) &&
                       !region.features.restrictions.includes(feature);

      recordEvent('compliance_check', { regionCode, feature, allowed: isAllowed });
      return {
        allowed: isAllowed,
        compliance: region.compliance,
        restrictions: region.features.restrictions
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Regional Pricing
  async getRegionalPricing(regionCode, basePrice) {
    try {
      const region = await Region.findOne({ code: regionCode });
      if (!region) throw new Error('Bölge bulunamadı');

      const adjustedPrice = basePrice * region.pricing.multiplier;
      const withVAT = adjustedPrice * (1 + (region.pricing.vat || 0) / 100);

      recordEvent('regional_pricing_calculated', { 
        regionCode, 
        base: basePrice, 
        adjusted: adjustedPrice,
        final: withVAT
      });

      return {
        currency: region.pricing.currency,
        basePrice,
        multiplier: region.pricing.multiplier,
        adjustedPrice,
        vat: region.pricing.vat,
        finalPrice: withVAT
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Failover Management
  async getFailoverRegions(primaryCode) {
    try {
      const primary = await Region.findOne({ code: primaryCode });
      if (!primary) throw new Error('Bölge bulunamadı');

      const backups = await Region.find({
        code: { $in: primary.failover.backup },
        'server.status': 'active'
      }).sort({ 'server.latency': 1 });

      recordEvent('failover_regions_retrieved', { primary: primaryCode, backups: backups.length });
      return backups;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async activateFailover(primaryCode) {
    try {
      const backups = await this.getFailoverRegions(primaryCode);
      if (backups.length === 0) throw new Error('Yedek bölge bulunamadı');

      const newPrimary = backups[0];
      recordEvent('failover_activated', { from: primaryCode, to: newPrimary.code });
      
      return {
        newPrimary: newPrimary.code,
        timestamp: new Date(),
        reason: 'Primary region failure detected'
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Regional Statistics
  async getRegionalStats() {
    try {
      const regions = await Region.find();
      const users = await UserRegionalPreference.find();

      const stats = {
        totalRegions: regions.length,
        activeRegions: regions.filter(r => r.server.status === 'active').length,
        totalUsers: users.length,
        usersByRegion: {},
        averageLatency: regions.reduce((sum, r) => sum + (r.server.latency || 0), 0) / regions.length,
        capacityUtilization: {}
      };

      for (const region of regions) {
        stats.usersByRegion[region.code] = users.filter(u => u.primaryRegion === region.code).length;
        stats.capacityUtilization[region.code] = (region.server.capacity.current / region.server.capacity.max) * 100;
      }

      recordEvent('regional_stats_calculated', stats);
      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}

module.exports = { RegionalService, Region, UserRegionalPreference };
