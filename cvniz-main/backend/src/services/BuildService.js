const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

class BuildService {
    constructor() {
        this.buildConfigs = new Map();
        this.eas = new Map(); // Expo Application Services
        this.certificates = new Map();
    }

    async createEASBuildConfig(userId, appName, buildConfig) {
        try {
            const configId = `eas_config_${userId}_${Date.now()}`;
            const config = {
                configId,
                userId,
                appName,
                projectId: buildConfig.projectId,
                buildProfiles: {
                    preview: {
                        ios: {
                            resourceClass: 'default',
                            simulator: true
                        },
                        android: {
                            resourceClass: 'default',
                            buildType: 'apk'
                        }
                    },
                    production: {
                        ios: {
                            resourceClass: 'default',
                            simulator: false,
                            distribution: 'app-store'
                        },
                        android: {
                            resourceClass: 'default',
                            buildType: 'aab',
                            distribution: 'play-store'
                        }
                    }
                },
                credentials: {
                    ios: {
                        appleId: buildConfig.appleId,
                        appleTeamId: buildConfig.appleTeamId,
                        applePassword: buildConfig.applePassword // Encrypted
                    },
                    android: {
                        serviceAccountJson: buildConfig.serviceAccountJson,
                        keystore: buildConfig.keystore // Base64 encoded
                    }
                },
                versioning: {
                    strategy: buildConfig.versioningStrategy || 'nativeVersion',
                    autoIncrement: true
                },
                updates: {
                    enabled: buildConfig.updatesEnabled !== false,
                    channel: buildConfig.updateChannel || 'production'
                },
                notifications: {
                    email: buildConfig.notificationEmail,
                    slack: buildConfig.slackWebhook
                },
                createdAt: new Date(),
                updated: new Date()
            };

            this.buildConfigs.set(configId, config);

            recordEvent({
                type: 'eas_build_config_created',
                userId,
                appName,
                configId
            });

            return config;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async getBuildConfig(userId, configId) {
        const config = this.buildConfigs.get(configId);

        if (!config || config.userId !== userId) {
            throw new Error('Build konfigürasyonu bulunamadı');
        }

        return config;
    }

    async triggerBuild(userId, configId, buildParams) {
        try {
            const config = this.buildConfigs.get(configId);

            if (!config || config.userId !== userId) {
                throw new Error('Build konfigürasyonu bulunamadı');
            }

            const buildId = `eas_build_${configId}_${Date.now()}`;
            const build = {
                buildId,
                configId,
                userId,
                platform: buildParams.platform, // ios, android, all
                buildType: buildParams.buildType || 'production', // preview, production
                version: buildParams.version,
                buildNumber: buildParams.buildNumber,
                releaseChannel: buildParams.releaseChannel || 'production',
                status: 'queued',
                queuedAt: new Date(),
                startedAt: null,
                completedAt: null,
                buildArtifacts: {
                    ios: null,
                    android: null
                },
                logs: [],
                errors: []
            };

            this.eas.set(buildId, build);

            recordEvent({
                type: 'eas_build_triggered',
                userId,
                buildId,
                platform: buildParams.platform
            });

            // Build'i başlat
            this.startEASBuild(buildId);

            return build;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async startEASBuild(buildId) {
        const build = this.eas.get(buildId);
        if (!build) {return;}

        // Kuyruktaki bekleme
        setTimeout(() => {
            build.status = 'running';
            build.startedAt = new Date();

            recordEvent({
                type: 'eas_build_started',
                buildId,
                platform: build.platform
            });

            // Yapı süreci (simüle)
            const buildDuration = build.platform === 'all' ? 600000 : 300000; // 10 min (all) or 5 min

            setTimeout(() => {
                build.status = 'finished';
                build.completedAt = new Date();

                if (build.platform === 'ios' || build.platform === 'all') {
                    build.buildArtifacts.ios = {
                        id: `artifact_ios_${buildId}`,
                        url: `https://builds.example.com/${buildId}/ios.ipa`,
                        size: Math.random() * 100 + 50 // MB
                    };
                }

                if (build.platform === 'android' || build.platform === 'all') {
                    build.buildArtifacts.android = {
                        id: `artifact_android_${buildId}`,
                        url: `https://builds.example.com/${buildId}/android.aab`,
                        size: Math.random() * 80 + 40 // MB
                    };
                }

                recordEvent({
                    type: 'eas_build_finished',
                    buildId,
                    platform: build.platform,
                    artifacts: Object.keys(build.buildArtifacts).filter(k => build.buildArtifacts[k])
                });
            }, buildDuration);
        }, 5000); // 5 saniye kuyruk zamanı
    }

    async getEASBuild(userId, buildId) {
        const build = this.eas.get(buildId);

        if (!build || build.userId !== userId) {
            throw new Error('Build bulunamadı');
        }

        return build;
    }

    async listEASBuilds(userId, configId = null, status = null) {
        const builds = Array.from(this.eas.values())
            .filter(b => b.userId === userId && (!configId || b.configId === configId) && (!status || b.status === status))
            .sort((a, b) => b.queuedAt - a.queuedAt);

        return {
            builds,
            total: builds.length,
            stats: {
                total: builds.length,
                running: builds.filter(b => b.status === 'running').length,
                finished: builds.filter(b => b.status === 'finished').length,
                failed: builds.filter(b => b.status === 'failed').length
            }
        };
    }

    async validateCredentials(userId, configId) {
        try {
            const config = this.buildConfigs.get(configId);

            if (!config || config.userId !== userId) {
                throw new Error('Build konfigürasyonu bulunamadı');
            }

            const validation = {
                ios: {
                    valid: !!config.credentials.ios.appleId,
                    errors: []
                },
                android: {
                    valid: !!config.credentials.android.serviceAccountJson,
                    errors: []
                }
            };

            if (!config.credentials.ios.appleId) {
                validation.ios.errors.push('Apple ID gerekli');
            }
            if (!config.credentials.ios.appleTeamId) {
                validation.ios.errors.push('Apple Team ID gerekli');
            }
            if (!config.credentials.android.serviceAccountJson) {
                validation.android.errors.push('Service Account JSON gerekli');
            }

            recordEvent({
                type: 'build_credentials_validated',
                userId,
                configId,
                iosValid: validation.ios.valid,
                androidValid: validation.android.valid
            });

            return validation;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async getBuildStats(userId) {
        const configs = Array.from(this.buildConfigs.values())
            .filter(c => c.userId === userId);

        const builds = Array.from(this.eas.values())
            .filter(b => b.userId === userId);

        const statuses = ['queued', 'running', 'finished', 'failed'];

        return {
            totalConfigs: configs.length,
            totalBuilds: builds.length,
            buildsByStatus: statuses.reduce((acc, status) => {
                acc[status] = builds.filter(b => b.status === status).length;
                return acc;
            }, {}),
            buildsByPlatform: {
                ios: builds.filter(b => b.platform === 'ios' || b.platform === 'all').length,
                android: builds.filter(b => b.platform === 'android' || b.platform === 'all').length
            },
            averageBuildTime: this.calculateAverageBuildTime(builds)
        };
    }

    calculateAverageBuildTime(builds) {
        const completedBuilds = builds.filter(b => b.completedAt && b.startedAt);

        if (completedBuilds.length === 0) {return 'N/A';}

        const totalTime = completedBuilds.reduce((sum, b) => {
            return sum + (b.completedAt - b.startedAt);
        }, 0);

        const avgSeconds = Math.floor(totalTime / completedBuilds.length / 1000);
        const minutes = Math.floor(avgSeconds / 60);
        const seconds = avgSeconds % 60;

        return `${minutes}m ${seconds}s`;
    }
}

module.exports = BuildService;
