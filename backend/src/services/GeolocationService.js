const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// Geolocation Schema
const geolocationSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, unique: true, index: true },
  country: { type: String, required: true },
  countryCode: String,
  region: String,
  city: String,
  latitude: Number,
  longitude: Number,
  timezone: String,
  currency: String,
  language: String,
  isp: String,
  organization: String,
  connectionType: String,
  
  // VPN/Proxy Detection
  security: {
    isVpn: { type: Boolean, default: false },
    isProxy: { type: Boolean, default: false },
    isTor: { type: Boolean, default: false },
    isDatacenter: { type: Boolean, default: false },
    threatLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' }
  },

  // Network Information
  network: {
    asn: String,
    asnOrg: String,
    routePrefix: String,
    mobileCarrier: String
  },

  // Caching
  lastLookup: { type: Date, default: Date.now },
  ttl: { type: Number, default: 2592000 }, // 30 days

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

geolocationSchema.index({ ipAddress: 1, lastLookup: 1 });
geolocationSchema.index({ country: 1, city: 1 });
geolocationSchema.index({ 'security.threatLevel': 1 });

// User Location History Schema
const locationHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  ipAddress: String,
  country: String,
  city: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
  
  device: {
    userAgent: String,
    deviceType: String,
    browser: String,
    os: String
  },

  action: { type: String, enum: ['login', 'logout', 'purchase', 'upload', 'access'] },
  
  security: {
    anomalous: { type: Boolean, default: false },
    suspicious: { type: Boolean, default: false },
    flaggedReason: String
  },

  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

locationHistorySchema.index({ userId: 1, timestamp: -1 });

const Geolocation = mongoose.model('Geolocation', geolocationSchema);
const LocationHistory = mongoose.model('LocationHistory', locationHistorySchema);

class GeolocationService {
  constructor() {
    // Initialize geolocation API (MaxMind, IP2Location, etc.)
    this.geoipProvider = process.env.GEOIP_PROVIDER || 'maxmind';
  }

  // Geolocation Lookup
  async lookupIP(ipAddress) {
    try {
      // Check cache first
      let geo = await Geolocation.findOne({ ipAddress });
      
      if (geo && (Date.now() - geo.lastLookup) < (geo.ttl * 1000)) {
        recordEvent('geolocation_cached', { ipAddress, country: geo.country });
        return geo;
      }

      // Mock geolocation data (in production, use MaxMind or IP2Location API)
      geo = new Geolocation({
        ipAddress,
        country: 'Turkey',
        countryCode: 'TR',
        region: 'Istanbul',
        city: 'Istanbul',
        latitude: 41.0082,
        longitude: 28.9784,
        timezone: 'Europe/Istanbul',
        currency: 'TRY',
        language: 'tr',
        isp: 'Türk Telekom',
        connectionType: 'residential',
        'security.threatLevel': 'low'
      });

      await geo.save();
      recordEvent('geolocation_lookup', { ipAddress, country: geo.country });
      return geo;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`IP adresi sorgulanırken hata: ${error.message}`);
    }
  }

  async lookupIPBatch(ipAddresses) {
    try {
      const results = await Promise.all(
        ipAddresses.map(ip => this.lookupIP(ip))
      );

      recordEvent('geolocation_batch_lookup', { count: ipAddresses.length });
      return results;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // User Location Tracking
  async recordLocation(userId, ipAddress, locationData) {
    try {
      const geo = await this.lookupIP(ipAddress);
      
      const history = new LocationHistory({
        userId,
        ipAddress,
        country: geo.country,
        city: geo.city,
        latitude: geo.latitude,
        longitude: geo.longitude,
        device: locationData.device || {},
        action: locationData.action || 'access'
      });

      // Detect anomalies
      const isAnomalous = await this.detectAnomalies(userId, geo);
      history.security.anomalous = isAnomalous.anomalous;
      history.security.suspicious = isAnomalous.suspicious;
      history.security.flaggedReason = isAnomalous.reason;

      await history.save();
      recordEvent('location_recorded', { userId, country: geo.country });
      return history;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async getUserLocationHistory(userId, limit = 50) {
    try {
      const history = await LocationHistory.find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit);

      recordEvent('location_history_retrieved', { userId, count: history.length });
      return history;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Anomaly Detection
  async detectAnomalies(userId, currentGeo) {
    try {
      const recentHistory = await LocationHistory.find({ userId })
        .sort({ timestamp: -1 })
        .limit(5);

      if (recentHistory.length === 0) {
        return { anomalous: false, suspicious: false };
      }

      const lastLocation = recentHistory[0];
      const timeDiff = Date.now() - lastLocation.timestamp;
      const distance = this.calculateDistance(
        lastLocation.latitude,
        lastLocation.longitude,
        currentGeo.latitude,
        currentGeo.longitude
      );

      // Impossible travel check (more than 900 km/hr)
      const impossibleSpeed = distance / (timeDiff / 3600000) > 900;
      
      // New country check
      const newCountry = lastLocation.country !== currentGeo.country;

      // VPN/Proxy usage
      const suspiciousConnection = currentGeo.security.isVpn || 
                                   currentGeo.security.isProxy ||
                                   currentGeo.security.threatLevel !== 'low';

      const result = {
        anomalous: impossibleSpeed || (newCountry && timeDiff < 3600000), // 1 hour
        suspicious: suspiciousConnection,
        reason: impossibleSpeed ? 'Impossible travel' : 
                newCountry ? 'New country access' :
                suspiciousConnection ? 'Suspicious connection' : null
      };

      recordEvent('anomaly_detected', { userId, ...result });
      return result;
    } catch (error) {
      Sentry.captureException(error);
      return { anomalous: false, suspicious: false };
    }
  }

  // Distance Calculation (Haversine Formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Regional Routing
  async getOptimalServer(userIP) {
    try {
      const geo = await this.lookupIP(userIP);
      
      // Map country to region for server routing
      const regionMap = {
        'Turkey': 'TR',
        'Germany': 'DE',
        'France': 'FR',
        'United Kingdom': 'UK',
        'United States': 'US',
        'Japan': 'JP',
        'Australia': 'AU'
      };

      const region = regionMap[geo.country] || 'EU';
      recordEvent('optimal_server_selected', { userIP, region });
      
      return {
        region,
        server: `${region.toLowerCase()}-server.cvniz.com`,
        country: geo.country,
        timezone: geo.timezone
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Regional Content Delivery
  async selectOptimalCDNNode(userIP) {
    try {
      const geo = await this.lookupIP(userIP);
      
      // Select closest CDN node based on latency
      const cdnNodes = {
        'TR': { host: 'tr-cdn.cvniz.com', priority: 1 },
        'EU': { host: 'eu-cdn.cvniz.com', priority: 2 },
        'US': { host: 'us-cdn.cvniz.com', priority: 3 },
        'APAC': { host: 'apac-cdn.cvniz.com', priority: 4 }
      };

      // Determine region from country
      let region = 'EU';
      if (geo.country === 'Turkey') region = 'TR';
      else if (geo.country === 'United States' || geo.country === 'Canada') region = 'US';
      else if (['Japan', 'Australia', 'Singapore'].includes(geo.country)) region = 'APAC';

      const node = cdnNodes[region];
      recordEvent('cdn_node_selected', { userIP, region, node: node.host });
      
      return {
        cdnNode: node.host,
        region,
        country: geo.country
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Content Localization
  async getLocalizedContent(userIP, contentType) {
    try {
      const geo = await this.lookupIP(userIP);
      
      const localization = {
        language: geo.language,
        timezone: geo.timezone,
        currency: geo.currency,
        dateFormat: this.getDateFormat(geo.country),
        numberFormat: this.getNumberFormat(geo.country),
        paymentMethods: this.getPaymentMethods(geo.country),
        priceAdjustment: this.getPriceMultiplier(geo.country)
      };

      recordEvent('localized_content_provided', { userIP, country: geo.country });
      return localization;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  getDateFormat(country) {
    const formats = {
      'United States': 'MM/DD/YYYY',
      'United Kingdom': 'DD/MM/YYYY',
      'Turkey': 'DD.MM.YYYY',
      'Germany': 'DD.MM.YYYY'
    };
    return formats[country] || 'DD/MM/YYYY';
  }

  getNumberFormat(country) {
    const formats = {
      'United States': { decimal: '.', thousands: ',' },
      'Turkey': { decimal: ',', thousands: '.' },
      'Germany': { decimal: ',', thousands: '.' }
    };
    return formats[country] || { decimal: '.', thousands: ',' };
  }

  getPaymentMethods(country) {
    const methods = {
      'Turkey': ['credit_card', 'bank_transfer', 'eftpos'],
      'United States': ['credit_card', 'paypal', 'apple_pay'],
      'Germany': ['credit_card', 'sofort', 'sepa']
    };
    return methods[country] || ['credit_card', 'paypal'];
  }

  getPriceMultiplier(country) {
    const multipliers = {
      'Turkey': 1.0,
      'United States': 1.2,
      'Germany': 1.15,
      'United Kingdom': 1.18
    };
    return multipliers[country] || 1.0;
  }

  // Security: IP Blocking
  async blockIP(ipAddress, reason, duration) {
    try {
      const geo = await Geolocation.findOneAndUpdate(
        { ipAddress },
        {
          'security.threatLevel': 'critical',
          'security.flaggedReason': reason,
          updatedAt: new Date()
        },
        { new: true, upsert: true }
      );

      recordEvent('ip_blocked', { ipAddress, reason, duration });
      return geo;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async getAllowIP(ipAddress) {
    try {
      const geo = await Geolocation.findOneAndUpdate(
        { ipAddress },
        {
          'security.threatLevel': 'low',
          updatedAt: new Date()
        },
        { new: true }
      );

      recordEvent('ip_allowed', { ipAddress });
      return geo;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Geolocation Statistics
  async getGeolocationStats() {
    try {
      const geoData = await Geolocation.aggregate([
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 },
            avgLatency: { $avg: '$security.threatLevel' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      const threatStats = await Geolocation.countDocuments({ 'security.threatLevel': { $ne: 'low' } });

      const stats = {
        totalUniqueIPs: await Geolocation.countDocuments(),
        byCountry: geoData,
        threatLevel: {
          low: await Geolocation.countDocuments({ 'security.threatLevel': 'low' }),
          medium: await Geolocation.countDocuments({ 'security.threatLevel': 'medium' }),
          high: await Geolocation.countDocuments({ 'security.threatLevel': 'high' }),
          critical: await Geolocation.countDocuments({ 'security.threatLevel': 'critical' })
        },
        vpnUsage: await Geolocation.countDocuments({ 'security.isVpn': true })
      };

      recordEvent('geolocation_stats_retrieved', stats);
      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}

module.exports = { GeolocationService, Geolocation, LocationHistory };
