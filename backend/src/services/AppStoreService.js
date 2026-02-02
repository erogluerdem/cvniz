const fs = require('fs');
const path = require('path');
const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

class AppStoreService {
    constructor() {
        this.appConfigs = new Map();
        this.builds = new Map();
        this.reviews = new Map();
        this.platforms = ['ios', 'android'];
        this.buildStatuses = ['pending', 'building', 'succeeded', 'failed'];
        this.reviewStatuses = ['submitted', 'in_review', 'approved', 'rejected', 'ready_for_sale'];
    }

    async createAppConfig(userId, appName, configData) {
        try {
            const configId = `app_${userId}_${Date.now()}`;
            const config = {
                configId,
                userId,
                appName,
                bundleId: configData.bundleId,
                displayName: configData.displayName,
                version: configData.version || '1.0.0',
                buildNumber: configData.buildNumber || '1',
                platforms: configData.platforms || ['ios', 'android'],
                description: configData.description,
                keywords: configData.keywords || [],
                category: configData.category,
                rating: configData.rating || '4+',
                icon: configData.icon,
                screenshots: configData.screenshots || [],
                privacyPolicy: configData.privacyPolicy,
                supportEmail: configData.supportEmail,
                developers: configData.developers || [],
                createdAt: new Date(),
                updated: new Date(),
                status: 'draft'
            };

            this.appConfigs.set(configId, config);

            recordEvent({
                type: 'app_config_created',
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

    async getAppConfig(userId, configId) {
        const config = this.appConfigs.get(configId);

        if (!config || config.userId !== userId) {
            throw new Error('App konfigürasyonu bulunamadı');
        }

        return config;
    }

    async updateAppConfig(userId, configId, updates) {
        try {
            const config = this.appConfigs.get(configId);

            if (!config || config.userId !== userId) {
                throw new Error('App konfigürasyonu bulunamadı');
            }

            Object.assign(config, updates, { updated: new Date() });

            recordEvent({
                type: 'app_config_updated',
                userId,
                configId,
                updates: Object.keys(updates)
            });

            return config;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async validateAppConfig(configId) {
        try {
            const config = this.appConfigs.get(configId);

            if (!config) {
                throw new Error('App bulunamadı');
            }

            const errors = [];

            // Gerekli alanları kontrol et
            if (!config.bundleId) {errors.push('Bundle ID gerekli');}
            if (!config.displayName) {errors.push('Uygulama adı gerekli');}
            if (!config.version) {errors.push('Versiyon gerekli');}
            if (!config.icon) {errors.push('Uygulama ikonu gerekli');}
            if (config.screenshots.length < 2) {errors.push('En az 2 ekran görüntüsü gerekli');}
            if (!config.privacyPolicy) {errors.push('Gizlilik politikası gerekli');}
            if (!config.supportEmail) {errors.push('Destek e-postası gerekli');}

            // Platform spesifik kontrol
            if (config.platforms.includes('ios')) {
                if (!config.bundleId.match(/^[a-z0-9]+(\.[a-z0-9]+)*$/)) {
                    errors.push('iOS Bundle ID formatı geçersiz');
                }
            }

            if (config.platforms.includes('android')) {
                if (!config.bundleId.match(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/)) {
                    errors.push('Android Package Name formatı geçersiz');
                }
            }

            return {
                valid: errors.length === 0,
                errors
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async createBuild(userId, configId, buildConfig) {
        try {
            const config = this.appConfigs.get(configId);

            if (!config || config.userId !== userId) {
                throw new Error('App konfigürasyonu bulunamadı');
            }

            // Validasyon
            const validation = await this.validateAppConfig(configId);
            if (!validation.valid) {
                throw new Error(`Validasyon hataları: ${validation.errors.join(', ')}`);
            }

            const buildId = `build_${configId}_${Date.now()}`;
            const build = {
                buildId,
                configId,
                userId,
                platform: buildConfig.platform,
                buildNumber: buildConfig.buildNumber || config.buildNumber,
                version: buildConfig.version || config.version,
                status: 'pending',
                startedAt: null,
                completedAt: null,
                logs: [],
                errorMessage: null,
                artifacts: {
                    ios: null,  // .ipa dosyası
                    android: null  // .aab dosyası
                },
                createdAt: new Date()
            };

            this.builds.set(buildId, build);

            recordEvent({
                type: 'app_build_created',
                userId,
                buildId,
                platform: buildConfig.platform
            });

            // Build'i başlat
            setTimeout(() => this.startBuild(buildId), 1000);

            return build;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async startBuild(buildId) {
        try {
            const build = this.builds.get(buildId);
            if (!build) {return;}

            build.status = 'building';
            build.startedAt = new Date();

            recordEvent({
                type: 'app_build_started',
                buildId,
                platform: build.platform
            });

            // Simüle build süreci
            const buildDuration = 120000; // 2 dakika
            setTimeout(() => {
                build.status = 'succeeded';
                build.completedAt = new Date();
                build.artifacts[build.platform] = `${build.buildId}.${build.platform === 'ios' ? 'ipa' : 'aab'}`;

                recordEvent({
                    type: 'app_build_completed',
                    buildId,
                    platform: build.platform,
                    status: 'succeeded'
                });
            }, buildDuration);
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    async getBuild(userId, buildId) {
        const build = this.builds.get(buildId);

        if (!build || build.userId !== userId) {
            throw new Error('Build bulunamadı');
        }

        return build;
    }

    async listBuilds(userId, configId = null) {
        const builds = Array.from(this.builds.values())
            .filter(b => b.userId === userId && (!configId || b.configId === configId))
            .sort((a, b) => b.createdAt - a.createdAt);

        return {
            builds,
            total: builds.length
        };
    }

    async createReview(userId, buildId) {
        try {
            const build = this.builds.get(buildId);

            if (!build || build.userId !== userId) {
                throw new Error('Build bulunamadı');
            }

            if (build.status !== 'succeeded') {
                throw new Error('Başarısız build gönderilemiyor');
            }

            const config = this.appConfigs.get(build.configId);
            const reviewId = `review_${buildId}_${Date.now()}`;

            const review = {
                reviewId,
                buildId,
                configId: build.configId,
                userId,
                platform: build.platform,
                appName: config.appName,
                version: build.version,
                status: 'submitted',
                submittedAt: new Date(),
                decidedAt: null,
                decision: null,
                feedback: [],
                estimatedReviewTime: build.platform === 'ios' ? '24-48 saat' : '2-3 saat'
            };

            this.reviews.set(reviewId, review);

            recordEvent({
                type: 'app_review_submitted',
                userId,
                reviewId,
                platform: build.platform,
                appName: config.appName
            });

            // Simüle inceleme süreci
            this.simulateReview(reviewId);

            return review;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async simulateReview(reviewId) {
        const review = this.reviews.get(reviewId);
        if (!review) {return;}

        // İnceleme süresi
        const reviewDuration = review.platform === 'ios' ? 86400000 : 10800000; // iOS: 24h, Android: 3h

        setTimeout(() => {
            review.status = 'in_review';

            recordEvent({
                type: 'app_review_status_changed',
                reviewId,
                status: 'in_review'
            });

            // Inceleme tamamlanması
            setTimeout(() => {
                const approved = Math.random() > 0.1; // %90 onay şansı

                if (approved) {
                    review.status = 'approved';
                    review.decision = 'approved';
                    review.feedback = ['Harika uygulama! Onaylandı.'];
                    review.decidedAt = new Date();

                    recordEvent({
                        type: 'app_review_approved',
                        reviewId,
                        platform: review.platform
                    });
                } else {
                    review.status = 'rejected';
                    review.decision = 'rejected';
                    review.feedback = [
                        'Gizlilik politikası hataları',
                        'Kilitlemeler gerekli'
                    ];
                    review.decidedAt = new Date();

                    recordEvent({
                        type: 'app_review_rejected',
                        reviewId,
                        feedback: review.feedback
                    });
                }
            }, 3600000); // 1 saat sonra karar
        }, 60000); // 1 dakika sonra inceleme başla
    }

    async getReview(userId, reviewId) {
        const review = this.reviews.get(reviewId);

        if (!review || review.userId !== userId) {
            throw new Error('İnceleme bulunamadı');
        }

        return review;
    }

    async listReviews(userId, status = null) {
        const reviews = Array.from(this.reviews.values())
            .filter(r => r.userId === userId && (!status || r.status === status))
            .sort((a, b) => b.submittedAt - a.submittedAt);

        return {
            reviews,
            total: reviews.length,
            stats: {
                total: reviews.length,
                approved: reviews.filter(r => r.status === 'approved').length,
                rejected: reviews.filter(r => r.status === 'rejected').length,
                pending: reviews.filter(r => r.status !== 'approved' && r.status !== 'rejected').length
            }
        };
    }

    async resubmitApp(userId, reviewId) {
        try {
            const review = this.reviews.get(reviewId);

            if (!review || review.userId !== userId) {
                throw new Error('İnceleme bulunamadı');
            }

            if (review.status !== 'rejected') {
                throw new Error('Sadece reddedilen uygulamalar yeniden gönderilebilir');
            }

            const build = this.builds.get(review.buildId);
            const newReview = await this.createReview(userId, review.buildId);

            recordEvent({
                type: 'app_resubmitted',
                userId,
                reviewId,
                newReviewId: newReview.reviewId
            });

            return newReview;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    async getAppStats(userId) {
        const configs = Array.from(this.appConfigs.values())
            .filter(c => c.userId === userId);

        const builds = Array.from(this.builds.values())
            .filter(b => b.userId === userId);

        const reviews = Array.from(this.reviews.values())
            .filter(r => r.userId === userId);

        return {
            apps: configs.length,
            totalBuilds: builds.length,
            buildsByStatus: this.buildStatuses.reduce((acc, status) => {
                acc[status] = builds.filter(b => b.status === status).length;
                return acc;
            }, {}),
            totalReviews: reviews.length,
            reviewsByStatus: this.reviewStatuses.reduce((acc, status) => {
                acc[status] = reviews.filter(r => r.status === status).length;
                return acc;
            }, {}),
            approvalRate: reviews.length > 0
                ? ((reviews.filter(r => r.decision === 'approved').length / reviews.length) * 100).toFixed(1) + '%'
                : 'N/A'
        };
    }
}

module.exports = AppStoreService;
