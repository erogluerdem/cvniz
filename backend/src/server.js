require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');
const xss = require('xss');
const responseCache = require('./middleware/responseCache');
const { optimizeDatabase, configureConnectionPool } = require('./utils/databaseOptimization');

// Sentry Initialization (must be early)
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.Express({
                app: true,
                request: true,
            }),
        ],
    });
}

// Import routes
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const syncRoutes = require('./routes/sync');
const userRoutes = require('./routes/user');
const supportRoutes = require('./routes/support');
const paymentRoutes = require('./routes/payment');
const translationRoutes = require('./routes/translations');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/review');
const contentRoutes = require('./routes/content');
const mediaRoutes = require('./routes/media');
const templateRoutes = require('./routes/template');
const notificationRoutes = require('./routes/notification');
const skillGapRoutes = require('./routes/skill-gap');
const atsRoutes = require('./routes/ats');
const salaryRoutes = require('./routes/salary');
const targetFitRoutes = require('./routes/target-fit');
const lettersRoutes = require('./routes/letters');
const interviewRoutes = require('./routes/interview');
const applicationsRoutes = require('./routes/applications');
const headshotRoutes = require('./routes/headshot');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const abTestRoutes = require('./routes/abtests');
const seoRoutes = require('./routes/seo');
const announcementRoutes = require('./routes/announcements');
const recommendationsRoutes = require('./routes/recommendations');
const monitoringRoutes = require('./routes/monitoring');
const backupRoutes = require('./routes/backup');
const featureFlagsRoutes = require('./routes/featureflags');

const app = express();

// Sentry Request Handler Middleware (must be early)
if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());
}

// Security Middleware - Enhanced
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    dnsPrefetchControl: true,
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
}));

// XSS Protection Middleware
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        });
    }
    next();
};

// SEO Route
app.use('/cv', seoRoutes);

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const defaultAllowed = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:3000',
            'https://cvniz.com',
            'https://www.cvniz.com',
            'https://admin.cvniz.com',
            'https://api.cvniz.com',
            'https://cvniz.coolify.app'
        ];

        const envAllowed = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
        const allowedOrigins = [...new Set([...defaultAllowed, ...envAllowed])];

        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            console.log('CORS Blocked Origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Enhanced Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000,
    message: {
        error: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'development',
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Çok fazla başarısız giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.' },
    skip: () => process.env.NODE_ENV === 'development'
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Response Caching Middleware (before routes)
app.use('/api/', responseCache.middleware({
    duration: 3600, // 1 hour for most endpoints
    excludePaths: ['/auth', '/payments', '/support'],
    conditions: {
        statusCode: 200
    }
}));

// Body Parser with Sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../../web/dist')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/target-fit', targetFitRoutes);
app.use('/api/letters', lettersRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/headshot', headshotRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/experiments', featureFlagsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/abtests', abTestRoutes);
app.use('/api/announcements', announcementRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Sentry Error Handler (must be after all routes)
if (process.env.SENTRY_DSN) {
    app.use(Sentry.Handlers.errorHandler());
}

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    if (process.env.SENTRY_DSN) {
        Sentry.captureException(err);
    }
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Sunucu hatası oluştu'
    });
});

const startServer = async () => {
    try {
        // Configure connection pool first
        await configureConnectionPool(process.env.MONGODB_URI);
        console.log('✅ MongoDB bağlantısı başarılı (connection pool configured)');

        // Optimize database indexes
        await optimizeDatabase();

        const PORT = process.env.PORT || 3001;
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server ${PORT} portunda çalışıyor`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📊 Cache Stats: ${JSON.stringify(responseCache.getStats())}`);
        });
        return server;
    } catch (err) {
        console.error('❌ MongoDB bağlantı hatası:', err.message);
        if (process.env.SENTRY_DSN) {
            Sentry.captureException(err);
        }
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

process.on('SIGTERM', () => {
    console.log('SIGTERM alındı, kapatılıyor...');
    mongoose.connection.close(() => {
        console.log('MongoDB bağlantısı kapatıldı');
        process.exit(0);
    });
});

module.exports = app;

