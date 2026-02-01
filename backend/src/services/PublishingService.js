const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

class PublishingService {
  constructor() {
    this.releases = new Map();
    this.rollouts = new Map();
    this.updateChannels = new Map();
  }

  async createRelease(userId, buildId, releaseConfig) {
    try {
      const releaseId = `release_${buildId}_${Date.now()}`;
      const release = {
        releaseId,
        buildId,
        userId,
        version: releaseConfig.version,
        buildNumber: releaseConfig.buildNumber,
        releaseNotes: releaseConfig.releaseNotes,
        platforms: releaseConfig.platforms || ['ios', 'android'],
        status: 'draft',
        rolloutPercentage: 0,
        rolloutStartedAt: null,
        releasedAt: null,
        downloads: {
          ios: 0,
          android: 0
        },
        crashes: 0,
        ratings: {
          average: 4.5,
          count: 0
        },
        createdAt: new Date()
      };

      this.releases.set(releaseId, release);

      recordEvent({
        type: 'release_created',
        userId,
        releaseId,
        version: releaseConfig.version
      });

      return release;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async publishRelease(userId, releaseId, publishConfig = {}) {
    try {
      const release = this.releases.get(releaseId);
      
      if (!release || release.userId !== userId) {
        throw new Error('Release bulunamadı');
      }

      if (release.status !== 'draft') {
        throw new Error('Yalnızca taslak release\'ler yayınlanabilir');
      }

      release.status = 'publishing';
      release.releasedAt = new Date();

      // İşletim sistemi mağazalarına yayınla
      for (const platform of release.platforms) {
        try {
          await this.publishToStore(userId, releaseId, platform);
        } catch (err) {
          recordEvent({
            type: 'release_publish_failed',
            userId,
            releaseId,
            platform,
            error: err.message
          });
        }
      }

      release.status = 'published';

      recordEvent({
        type: 'release_published',
        userId,
        releaseId,
        platforms: release.platforms,
        version: release.version
      });

      return release;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async publishToStore(userId, releaseId, platform) {
    const release = this.releases.get(releaseId);
    
    // Platform spesifik yayın mantığı
    if (platform === 'ios') {
      // App Store'a yayınla
      // TestFlight'ta da barındır
      release.platforms_status = release.platforms_status || {};
      release.platforms_status.ios = 'submitted_to_app_store';
    } else if (platform === 'android') {
      // Google Play Store'a yayınla
      release.platforms_status = release.platforms_status || {};
      release.platforms_status.android = 'submitted_to_play_store';
    }

    recordEvent({
      type: 'release_submitted_to_store',
      releaseId,
      platform
    });
  }

  async createRollout(userId, releaseId, rolloutConfig) {
    try {
      const release = this.releases.get(releaseId);
      
      if (!release || release.userId !== userId) {
        throw new Error('Release bulunamadı');
      }

      const rolloutId = `rollout_${releaseId}_${Date.now()}`;
      const rollout = {
        rolloutId,
        releaseId,
        userId,
        name: rolloutConfig.name,
        targetPercentage: rolloutConfig.targetPercentage || 100,
        currentPercentage: rolloutConfig.startPercentage || 0,
        stages: rolloutConfig.stages || [
          { percentage: 10, duration: 86400000 }, // 24h, 10%
          { percentage: 50, duration: 172800000 }, // 48h, 50%
          { percentage: 100, duration: 0 } // Geri kalan
        ],
        currentStage: 0,
        status: 'scheduled',
        startedAt: null,
        completedAt: null,
        pausedAt: null,
        metrics: {
          crashes: 0,
          reviews: 0,
          uninstalls: 0
        },
        createdAt: new Date()
      };

      this.rollouts.set(rolloutId, rollout);

      recordEvent({
        type: 'rollout_created',
        userId,
        rolloutId,
        releaseId,
        targetPercentage: rolloutConfig.targetPercentage
      });

      return rollout;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async startRollout(userId, rolloutId) {
    try {
      const rollout = this.rollouts.get(rolloutId);
      
      if (!rollout || rollout.userId !== userId) {
        throw new Error('Rollout bulunamadı');
      }

      rollout.status = 'running';
      rollout.startedAt = new Date();

      // Aşamalar arasında geçiş
      this.executeRolloutStages(rolloutId);

      recordEvent({
        type: 'rollout_started',
        userId,
        rolloutId
      });

      return rollout;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async executeRolloutStages(rolloutId) {
    const rollout = this.rollouts.get(rolloutId);
    if (!rollout) return;

    const stages = rollout.stages;
    let currentIndex = 0;

    const executeNextStage = () => {
      if (currentIndex >= stages.length) {
        rollout.status = 'completed';
        rollout.completedAt = new Date();
        rollout.currentPercentage = rollout.targetPercentage;

        recordEvent({
          type: 'rollout_completed',
          rolloutId
        });
        return;
      }

      const stage = stages[currentIndex];
      rollout.currentStage = currentIndex;
      rollout.currentPercentage = stage.percentage;

      recordEvent({
        type: 'rollout_stage_updated',
        rolloutId,
        stage: currentIndex,
        percentage: stage.percentage
      });

      if (stage.duration > 0) {
        setTimeout(executeNextStage, stage.duration);
      } else {
        executeNextStage();
      }

      currentIndex++;
    };

    executeNextStage();
  }

  async pauseRollout(userId, rolloutId) {
    try {
      const rollout = this.rollouts.get(rolloutId);
      
      if (!rollout || rollout.userId !== userId) {
        throw new Error('Rollout bulunamadı');
      }

      rollout.status = 'paused';
      rollout.pausedAt = new Date();

      recordEvent({
        type: 'rollout_paused',
        userId,
        rolloutId,
        currentPercentage: rollout.currentPercentage
      });

      return rollout;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async resumeRollout(userId, rolloutId) {
    try {
      const rollout = this.rollouts.get(rolloutId);
      
      if (!rollout || rollout.userId !== userId) {
        throw new Error('Rollout bulunamadı');
      }

      rollout.status = 'running';
      rollout.pausedAt = null;

      recordEvent({
        type: 'rollout_resumed',
        userId,
        rolloutId
      });

      return rollout;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async getReleaseStats(userId) {
    const releases = Array.from(this.releases.values())
      .filter(r => r.userId === userId);

    const rollouts = Array.from(this.rollouts.values())
      .filter(ro => ro.userId === userId);

    return {
      totalReleases: releases.length,
      releasesByStatus: {
        draft: releases.filter(r => r.status === 'draft').length,
        publishing: releases.filter(r => r.status === 'publishing').length,
        published: releases.filter(r => r.status === 'published').length
      },
      totalRollouts: rollouts.length,
      activeRollouts: rollouts.filter(ro => ro.status === 'running').length,
      totalDownloads: releases.reduce((sum, r) => sum + r.downloads.ios + r.downloads.android, 0),
      totalCrashes: releases.reduce((sum, r) => sum + r.crashes, 0),
      avgRating: releases.length > 0 
        ? (releases.reduce((sum, r) => sum + r.ratings.average, 0) / releases.length).toFixed(1)
        : 'N/A'
    };
  }

  async createUpdateChannel(userId, channelName, config) {
    try {
      const channelId = `channel_${userId}_${Date.now()}`;
      const channel = {
        channelId,
        userId,
        name: channelName,
        description: config.description,
        releaseChannel: config.releaseChannel || 'production',
        autoUpdate: config.autoUpdate !== false,
        minInterval: config.minInterval || 60000, // 1 dakika
        updates: [],
        createdAt: new Date()
      };

      this.updateChannels.set(channelId, channel);

      recordEvent({
        type: 'update_channel_created',
        userId,
        channelId,
        channelName
      });

      return channel;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }

  async publishUpdate(userId, channelId, updateData) {
    try {
      const channel = this.updateChannels.get(channelId);
      
      if (!channel || channel.userId !== userId) {
        throw new Error('Update channel bulunamadı');
      }

      const update = {
        updateId: `update_${channelId}_${Date.now()}`,
        version: updateData.version,
        releaseNotes: updateData.releaseNotes,
        assetUrl: updateData.assetUrl,
        metadata: updateData.metadata || {},
        publishedAt: new Date(),
        downloadsCount: 0
      };

      channel.updates.push(update);

      recordEvent({
        type: 'update_published',
        userId,
        channelId,
        updateId: update.updateId,
        version: updateData.version
      });

      return update;
    } catch (error) {
      Sentry.captureException(error);
      throw error;
    }
  }
}

module.exports = PublishingService;
