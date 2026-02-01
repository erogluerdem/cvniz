const mongoose = require('mongoose');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

// CDN Asset Schema
const cdnAssetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['image', 'video', 'document', 'font', 'script', 'style'], required: true },
  size: { type: Number, required: true },
  mimeType: String,
  url: { type: String, required: true },
  originalUrl: String,
  
  // CDN Distribution
  distribution: {
    regions: [String],
    primaryRegion: String,
    cacheKey: String,
    compressionEnabled: { type: Boolean, default: true },
    compressionFormat: { type: String, enum: ['gzip', 'brotli', 'deflate'], default: 'brotli' }
  },

  // Optimization
  optimization: {
    originalSize: Number,
    optimizedSize: Number,
    compressionRatio: Number,
    variants: [{
      width: Number,
      height: Number,
      format: String,
      size: Number,
      url: String
    }]
  },

  // Caching
  cache: {
    ttl: { type: Number, default: 86400 },
    browserCache: { type: Number, default: 3600 },
    strategy: { type: String, enum: ['aggressive', 'normal', 'conservative'], default: 'normal' },
    lastPurged: Date
  },

  // Performance Metrics
  metrics: {
    requests: { type: Number, default: 0 },
    bandwidth: { type: Number, default: 0 },
    averageLoadTime: Number,
    p95LoadTime: Number,
    hitRate: Number,
    regions: Map
  },

  // Security
  security: {
    publicKey: String,
    signatureRequired: Boolean,
    tokenExpiry: Number,
    allowedDomains: [String],
    deniedRegions: [String]
  },

  // Monitoring
  monitoring: {
    enabled: { type: Boolean, default: true },
    alerts: Boolean,
    errorRate: Number,
    lastHealthCheck: Date
  },

  status: { type: String, enum: ['active', 'archived', 'deleted'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

cdnAssetSchema.index({ 'distribution.regions': 1 });
cdnAssetSchema.index({ type: 1, status: 1 });

// CDN Configuration Schema
const cdnConfigSchema = new mongoose.Schema({
  provider: { type: String, enum: ['cloudflare', 'aws', 'azure', 'akamai'], required: true },
  apiKey: String,
  apiSecret: String,
  enabled: { type: Boolean, default: true },
  
  settings: {
    autoOptimize: { type: Boolean, default: true },
    autoCompress: { type: Boolean, default: true },
    lazyLoad: { type: Boolean, default: true },
    imageOptimization: { type: Boolean, default: true },
    videoOptimization: { type: Boolean, default: true }
  },

  limits: {
    maxFileSize: { type: Number, default: 524288000 }, // 500MB
    maxBandwidth: { type: Number, default: 107374182400 }, // 100GB
    maxRequests: { type: Number, default: 10000000 }
  },

  purgeRules: [{
    pattern: String,
    frequency: String,
    lastPurge: Date
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const CDNAsset = mongoose.model('CDNAsset', cdnAssetSchema);
const CDNConfig = mongoose.model('CDNConfig', cdnConfigSchema);

class CDNService {
  constructor() {
    this.providers = {
      cloudflare: this.cloudflareAdapter,
      aws: this.awsAdapter,
      azure: this.azureAdapter,
      akamai: this.akamaiAdapter
    };
  }

  // Asset Management
  async uploadAsset(file, options = {}) {
    try {
      const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const asset = new CDNAsset({
        assetId,
        name: file.originalname,
        type: options.type || file.mimetype.split('/')[0],
        size: file.size,
        mimeType: file.mimetype,
        originalUrl: file.path,
        url: options.cdnUrl || `https://cdn.cvniz.com/${assetId}`,
        'distribution.regions': options.regions || ['EU', 'US'],
        'distribution.primaryRegion': options.primaryRegion || 'EU'
      });

      await asset.save();
      recordEvent('asset_uploaded', { assetId, size: file.size, type: asset.type });
      return asset;
    } catch (error) {
      Sentry.captureException(error);
      throw new Error(`Dosya yüklenirken hata: ${error.message}`);
    }
  }

  async getAsset(assetId) {
    try {
      const asset = await CDNAsset.findOne({ assetId });
      if (!asset) throw new Error('Dosya bulunamadı');
      
      // Update metrics
      asset.metrics.requests += 1;
      asset.metrics.bandwidth += asset.size;
      await asset.save();

      recordEvent('asset_retrieved', { assetId });
      return asset;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async deleteAsset(assetId) {
    try {
      const asset = await CDNAsset.findOneAndUpdate(
        { assetId },
        { status: 'deleted', updatedAt: new Date() },
        { new: true }
      );

      recordEvent('asset_deleted', { assetId });
      return { success: true };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Asset Optimization
  async optimizeAsset(assetId) {
    try {
      const asset = await CDNAsset.findOne({ assetId });
      if (!asset) throw new Error('Dosya bulunamadı');

      // Create image variants for responsive images
      if (asset.type === 'image') {
        const variants = [
          { width: 320, height: 240 },
          { width: 640, height: 480 },
          { width: 1280, height: 960 },
          { width: 1920, height: 1440 }
        ];

        asset.optimization.variants = variants.map(v => ({
          width: v.width,
          height: v.height,
          format: 'webp',
          size: Math.round(asset.size * (v.width / 1920)),
          url: `${asset.url}?w=${v.width}&h=${v.height}&f=webp`
        }));
      }

      // Calculate compression
      const originalSize = asset.size;
      const optimizedSize = Math.round(originalSize * 0.6); // Assume 40% compression
      
      asset.optimization.originalSize = originalSize;
      asset.optimization.optimizedSize = optimizedSize;
      asset.optimization.compressionRatio = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

      await asset.save();
      recordEvent('asset_optimized', { assetId, ratio: asset.optimization.compressionRatio });
      return asset;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Caching
  async setCachingPolicy(assetId, policy) {
    try {
      const asset = await CDNAsset.findOneAndUpdate(
        { assetId },
        {
          'cache.ttl': policy.ttl || 86400,
          'cache.browserCache': policy.browserCache || 3600,
          'cache.strategy': policy.strategy || 'normal',
          updatedAt: new Date()
        },
        { new: true }
      );

      recordEvent('cache_policy_set', { assetId, policy });
      return asset;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async purgeCache(pattern) {
    try {
      const assets = await CDNAsset.updateMany(
        { url: { $regex: pattern } },
        { 'cache.lastPurged': new Date() }
      );

      recordEvent('cache_purged', { pattern, count: assets.modifiedCount });
      return { success: true, purgedCount: assets.modifiedCount };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Regional Distribution
  async distributeToRegions(assetId, regions) {
    try {
      const asset = await CDNAsset.findOneAndUpdate(
        { assetId },
        {
          'distribution.regions': regions,
          updatedAt: new Date()
        },
        { new: true }
      );

      recordEvent('asset_distributed', { assetId, regions });
      return asset;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async getRegionalUrl(assetId, region) {
    try {
      const asset = await CDNAsset.findOne({ assetId });
      if (!asset) throw new Error('Dosya bulunamadı');

      if (!asset.distribution.regions.includes(region)) {
        return asset.url; // Fallback to primary
      }

      // Generate region-specific URL
      const regionUrl = `https://${region.toLowerCase()}-cdn.cvniz.com/${assetId}`;
      recordEvent('regional_url_generated', { assetId, region });
      return regionUrl;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Security
  async generateSignedUrl(assetId, expiryHours = 24) {
    try {
      const asset = await CDNAsset.findOne({ assetId });
      if (!asset) throw new Error('Dosya bulunamadı');

      const token = Buffer.from(`${assetId}:${Date.now() + expiryHours * 3600000}`).toString('base64');
      const signedUrl = `${asset.url}?token=${token}`;

      recordEvent('signed_url_generated', { assetId, expiryHours });
      return signedUrl;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async restrictAccess(assetId, domains, regions) {
    try {
      const asset = await CDNAsset.findOneAndUpdate(
        { assetId },
        {
          'security.allowedDomains': domains,
          'security.deniedRegions': regions,
          updatedAt: new Date()
        },
        { new: true }
      );

      recordEvent('asset_access_restricted', { assetId, domains, regions });
      return asset;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Performance Metrics
  async updateMetrics(assetId, metrics) {
    try {
      const asset = await CDNAsset.findOne({ assetId });
      if (!asset) throw new Error('Dosya bulunamadı');

      asset.metrics.averageLoadTime = metrics.loadTime || asset.metrics.averageLoadTime;
      asset.metrics.p95LoadTime = metrics.p95LoadTime || asset.metrics.p95LoadTime;
      asset.metrics.hitRate = metrics.hitRate || asset.metrics.hitRate;

      if (metrics.region) {
        asset.metrics.regions.set(metrics.region, {
          loadTime: metrics.loadTime,
          requests: (asset.metrics.regions.get(metrics.region)?.requests || 0) + 1
        });
      }

      await asset.save();
      recordEvent('metrics_updated', { assetId, metrics });
      return asset;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async getPerformanceStats(assetId) {
    try {
      const asset = await CDNAsset.findOne({ assetId });
      if (!asset) throw new Error('Dosya bulunamadı');

      recordEvent('performance_stats_retrieved', { assetId });
      return {
        assetId,
        requests: asset.metrics.requests,
        bandwidth: (asset.metrics.bandwidth / (1024 * 1024)).toFixed(2) + ' MB',
        averageLoadTime: asset.metrics.averageLoadTime + ' ms',
        hitRate: asset.metrics.hitRate + '%',
        regions: Object.fromEntries(asset.metrics.regions)
      };
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // CDN Configuration
  async getConfig(provider) {
    try {
      let config = await CDNConfig.findOne({ provider });
      if (!config) {
        config = new CDNConfig({ provider });
        await config.save();
      }
      return config;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async updateConfig(provider, updates) {
    try {
      const config = await CDNConfig.findOneAndUpdate(
        { provider },
        { ...updates, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      recordEvent('cdn_config_updated', { provider });
      return config;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(assetId) {
    try {
      const asset = await CDNAsset.findOne({ assetId });
      if (!asset) throw new Error('Dosya bulunamadı');

      const status = {
        assetId,
        status: 'healthy',
        cacheStatus: asset.cache.lastPurged ? 'active' : 'pending',
        regions: asset.distribution.regions.length,
        optimization: asset.optimization.compressionRatio ? 'optimized' : 'pending',
        lastCheck: new Date()
      };

      await CDNAsset.updateOne({ assetId }, { 'monitoring.lastHealthCheck': new Date() });
      recordEvent('cdn_health_checked', { assetId });
      return status;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  // CDN Statistics
  async getStatistics() {
    try {
      const assets = await CDNAsset.find({ status: 'active' });
      const totalBandwidth = assets.reduce((sum, a) => sum + a.metrics.bandwidth, 0);
      const totalRequests = assets.reduce((sum, a) => sum + a.metrics.requests, 0);

      const stats = {
        totalAssets: assets.length,
        totalBandwidth: (totalBandwidth / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
        totalRequests,
        averageLoadTime: Math.round(
          assets.reduce((sum, a) => sum + (a.metrics.averageLoadTime || 0), 0) / assets.length
        ) + ' ms',
        byType: {},
        byRegion: {}
      };

      for (const asset of assets) {
        stats.byType[asset.type] = (stats.byType[asset.type] || 0) + 1;
        for (const region of asset.distribution.regions) {
          stats.byRegion[region] = (stats.byRegion[region] || 0) + 1;
        }
      }

      recordEvent('cdn_statistics_retrieved', stats);
      return stats;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}

module.exports = { CDNService, CDNAsset, CDNConfig };
