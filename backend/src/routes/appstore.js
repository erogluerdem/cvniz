import express from 'express';
import auth from '../middleware/auth.js';
import AppStoreService from '../services/AppStoreService.js';
import BuildService from '../services/BuildService.js';
import PublishingService from '../services/PublishingService.js';
import Sentry from '@sentry/node';

const router = express.Router();
const appStoreService = new AppStoreService();
const buildService = new BuildService();
const publishingService = new PublishingService();

// ============================================
// APP STORE CONFIG ROUTES
// ============================================

/**
 * GET /api/app-store/config
 * Mevcut app konfigürasyonlarını listele
 */
router.get('/config', auth, async (req, res) => {
    try {
        const configs = appStoreService.getAppConfig(req.user.id);

        if (!configs) {
            return res.status(404).json({
                success: false,
                message: 'App konfigürasyonu bulunamadı'
            });
        }

        res.json({
            success: true,
            config: configs
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'App konfigürasyonu yüklenirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/config
 * Yeni app konfigürasyonu oluştur
 */
router.post('/config', auth, async (req, res) => {
    try {
        const {
            appName,
            bundleId,
            displayName,
            version,
            platforms,
            icon,
            screenshots,
            privacyPolicy,
            supportEmail,
            category,
            rating
        } = req.body;

        if (!appName || !bundleId || !privacyPolicy || !supportEmail) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm gerekli alanları doldurun'
            });
        }

        const config = appStoreService.createAppConfig({
            userId: req.user.id,
            appName,
            bundleId,
            displayName: displayName || appName,
            version: version || '1.0.0',
            buildNumber: 1,
            platforms: platforms || ['ios', 'android'],
            icon,
            screenshots: screenshots || [],
            privacyPolicy,
            supportEmail,
            developers: [req.user.id],
            category: category || 'productivity',
            rating: rating || '4+'
        });

        res.status(201).json({
            success: true,
            config
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'App konfigürasyonu oluşturulurken hata oluştu',
            error: error.message
        });
    }
});

/**
 * PUT /api/app-store/config/:configId
 * App konfigürasyonunu güncelle
 */
router.put('/config/:configId', auth, async (req, res) => {
    try {
        const config = appStoreService.updateAppConfig(req.params.configId, req.body);

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'App konfigürasyonu bulunamadı'
            });
        }

        res.json({
            success: true,
            config
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'App konfigürasyonu güncellenirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/config/:configId/validate
 * App konfigürasyonunu doğrula
 */
router.post('/config/:configId/validate', auth, async (req, res) => {
    try {
        const config = appStoreService.getAppConfig(req.params.configId);

        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'App konfigürasyonu bulunamadı'
            });
        }

        const validation = appStoreService.validateAppConfig(config);

        res.json({
            success: validation.isValid,
            validation
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Doğrulama sırasında hata oluştu',
            error: error.message
        });
    }
});

// ============================================
// BUILD ROUTES
// ============================================

/**
 * GET /api/app-store/builds
 * Tüm build\'leri listele
 */
router.get('/builds', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20, platform, status } = req.query;

        const builds = buildService.listEASBuilds(
            req.user.id,
            { page: parseInt(page), limit: parseInt(limit), platform, status }
        );

        res.json({
            success: true,
            builds: builds.builds,
            pagination: builds.pagination
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Build\'ler yüklenirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/builds
 * Yeni build oluştur
 */
router.post('/builds', auth, async (req, res) => {
    try {
        const { platform, buildType } = req.body;

        if (!platform) {
            return res.status(400).json({
                success: false,
                message: 'Platform belirtilmelidir (ios/android/all)'
            });
        }

        // AppStore config\'ından config ID al
        const config = appStoreService.getAppConfig(req.user.id);
        if (!config) {
            return res.status(400).json({
                success: false,
                message: 'Önce app konfigürasyonu oluşturmalısınız'
            });
        }

        // Build config oluştur
        const buildConfig = buildService.createEASBuildConfig({
            userId: req.user.id,
            appName: config.appName,
            projectId: `expo-project-${Date.now()}`
        });

        // Build tetikle
        const build = buildService.triggerBuild(buildConfig._id, {
            platform,
            buildType: buildType || 'production'
        });

        res.status(201).json({
            success: true,
            build
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Build oluşturulurken hata oluştu',
            error: error.message
        });
    }
});

/**
 * GET /api/app-store/builds/:buildId
 * Build detaylarını al
 */
router.get('/builds/:buildId', auth, async (req, res) => {
    try {
        const build = buildService.getEASBuild(req.params.buildId);

        if (!build) {
            return res.status(404).json({
                success: false,
                message: 'Build bulunamadı'
            });
        }

        res.json({
            success: true,
            build
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Build yüklenirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/builds/:configId/trigger
 * Build tetikle
 */
router.post('/builds/:configId/trigger', auth, async (req, res) => {
    try {
        const { platform, buildType } = req.body;

        const build = buildService.triggerBuild(req.params.configId, {
            platform,
            buildType
        });

        res.status(201).json({
            success: true,
            build
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Build tetiklenirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * GET /api/app-store/builds/stats/:userId
 * Build istatistiklerini al
 */
router.get('/builds/stats/:userId', auth, async (req, res) => {
    try {
        const stats = buildService.getBuildStats(req.params.userId);

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'İstatistikler yüklenirken hata oluştu',
            error: error.message
        });
    }
});

// ============================================
// REVIEW ROUTES (APP STORE)
// ============================================

/**
 * POST /api/app-store/reviews
 * App review\'a gönder
 */
router.post('/reviews', auth, async (req, res) => {
    try {
        const { configId, platforms } = req.body;

        if (!configId) {
            return res.status(400).json({
                success: false,
                message: 'App konfigürasyonu ID\'si gerekli'
            });
        }

        const config = appStoreService.getAppConfig(configId);
        if (!config) {
            return res.status(404).json({
                success: false,
                message: 'App konfigürasyonu bulunamadı'
            });
        }

        // Doğrulama yap
        const validation = appStoreService.validateAppConfig(config);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'App konfigürasyonu eksik veya hatalı',
                errors: validation.errors
            });
        }

        const review = appStoreService.createReview({
            configId,
            userId: req.user.id,
            platforms: platforms || ['ios', 'android']
        });

        res.status(201).json({
            success: true,
            review
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Review oluşturulurken hata oluştu',
            error: error.message
        });
    }
});

/**
 * GET /api/app-store/reviews/:reviewId
 * Review detaylarını al
 */
router.get('/reviews/:reviewId', auth, async (req, res) => {
    try {
        const review = appStoreService.getReview(req.params.reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review bulunamadı'
            });
        }

        res.json({
            success: true,
            review
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Review yüklenirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * GET /api/app-store/reviews
 * Tüm review\'ları listele
 */
router.get('/reviews-list', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const reviews = appStoreService.listReviews(
            req.user.id,
            { page: parseInt(page), limit: parseInt(limit) }
        );

        res.json({
            success: true,
            reviews: reviews.reviews,
            pagination: reviews.pagination,
            stats: reviews.stats
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Review\'lar yüklenirken hata oluştu',
            error: error.message
        });
    }
});

// ============================================
// RELEASE ROUTES
// ============================================

/**
 * GET /api/app-store/releases
 * Tüm release\'leri listele
 */
router.get('/releases', auth, async (req, res) => {
    try {
        const releases = publishingService.listReleases(req.user.id);

        res.json({
            success: true,
            releases
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Release\'ler yüklenirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/releases
 * Yeni release oluştur
 */
router.post('/releases', auth, async (req, res) => {
    try {
        const { buildId, releaseNotes, version } = req.body;

        if (!buildId) {
            return res.status(400).json({
                success: false,
                message: 'Build ID\'si gerekli'
            });
        }

        const build = buildService.getEASBuild(buildId);
        if (!build) {
            return res.status(404).json({
                success: false,
                message: 'Build bulunamadı'
            });
        }

        const release = publishingService.createRelease({
            buildId,
            userId: req.user.id,
            releaseNotes: releaseNotes || '',
            version: version || '1.0.0'
        });

        res.status(201).json({
            success: true,
            release
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Release oluşturulurken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/releases/:releaseId/publish
 * Release\'i yayınla
 */
router.post('/releases/:releaseId/publish', auth, async (req, res) => {
    try {
        const release = publishingService.publishRelease(req.params.releaseId);

        if (!release) {
            return res.status(404).json({
                success: false,
                message: 'Release bulunamadı'
            });
        }

        res.json({
            success: true,
            release
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Release yayınlanırken hata oluştu',
            error: error.message
        });
    }
});

/**
 * GET /api/app-store/releases/:releaseId
 * Release detaylarını al
 */
router.get('/releases/:releaseId', auth, async (req, res) => {
    try {
        const release = publishingService.getRelease(req.params.releaseId);

        if (!release) {
            return res.status(404).json({
                success: false,
                message: 'Release bulunamadı'
            });
        }

        res.json({
            success: true,
            release
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Release yüklenirken hata oluştu',
            error: error.message
        });
    }
});

// ============================================
// ROLLOUT ROUTES
// ============================================

/**
 * POST /api/app-store/rollouts
 * Yeni staged rollout oluştur
 */
router.post('/rollouts', auth, async (req, res) => {
    try {
        const { releaseId, name, targetPercentage } = req.body;

        if (!releaseId) {
            return res.status(400).json({
                success: false,
                message: 'Release ID\'si gerekli'
            });
        }

        const rollout = publishingService.createRollout({
            releaseId,
            userId: req.user.id,
            name: name || `Rollout v${Date.now()}`,
            targetPercentage: targetPercentage || 100
        });

        res.status(201).json({
            success: true,
            rollout
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Rollout oluşturulurken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/rollouts/:rolloutId/start
 * Rollout\'u başlat
 */
router.post('/rollouts/:rolloutId/start', auth, async (req, res) => {
    try {
        const rollout = publishingService.startRollout(req.params.rolloutId);

        if (!rollout) {
            return res.status(404).json({
                success: false,
                message: 'Rollout bulunamadı'
            });
        }

        res.json({
            success: true,
            rollout
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Rollout başlatılırken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/rollouts/:rolloutId/pause
 * Rollout\'u duraklat
 */
router.post('/rollouts/:rolloutId/pause', auth, async (req, res) => {
    try {
        const rollout = publishingService.pauseRollout(req.params.rolloutId);

        if (!rollout) {
            return res.status(404).json({
                success: false,
                message: 'Rollout bulunamadı'
            });
        }

        res.json({
            success: true,
            rollout
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Rollout duraklatılırken hata oluştu',
            error: error.message
        });
    }
});

/**
 * POST /api/app-store/rollouts/:rolloutId/resume
 * Rollout\'u devam ettir
 */
router.post('/rollouts/:rolloutId/resume', auth, async (req, res) => {
    try {
        const rollout = publishingService.resumeRollout(req.params.rolloutId);

        if (!rollout) {
            return res.status(404).json({
                success: false,
                message: 'Rollout bulunamadı'
            });
        }

        res.json({
            success: true,
            rollout
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'Rollout devam ettirilirken hata oluştu',
            error: error.message
        });
    }
});

/**
 * GET /api/app-store/stats
 * Genel istatistikler
 */
router.get('/stats', auth, async (req, res) => {
    try {
        const appStats = appStoreService.getAppStats(req.user.id);
        const buildStats = buildService.getBuildStats(req.user.id);
        const releaseStats = publishingService.getReleaseStats(req.user.id);

        res.json({
            success: true,
            stats: {
                apps: appStats,
                builds: buildStats,
                releases: releaseStats
            }
        });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            success: false,
            message: 'İstatistikler yüklenirken hata oluştu',
            error: error.message
        });
    }
});

export default router;
