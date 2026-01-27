require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const syncRoutes = require('./routes/sync');
const userRoutes = require('./routes/user');
const supportRoutes = require('./routes/support');
const paymentRoutes = require('./routes/payment');
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

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:3000',
            'https://cvniz.com',
            'https://www.cvniz.com',
            'https://admin.cvniz.com'
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting - Development modunda devre dışı bırakıldı
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000, // 1 minute window
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000, // Çok yüksek limit
    message: {
        error: 'Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'development' // Development'ta rate limit yok
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/payments', paymentRoutes);
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
app.use('/api/analytics', analyticsRoutes);
app.use('/api/abtests', abTestRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint bulunamadı' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development'
            ? err.message
            : 'Sunucu hatası oluştu'
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB bağlantısı başarılı');

        // Start Server
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`🚀 Server ${PORT} portunda çalışıyor`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB bağlantı hatası:', err.message);
        process.exit(1);
    });

// Graceful Shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM alındı, kapatılıyor...');
    mongoose.connection.close(() => {
        console.log('MongoDB bağlantısı kapatıldı');
        process.exit(0);
    });
});

module.exports = app;
