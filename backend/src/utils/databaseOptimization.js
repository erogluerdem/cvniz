/**
 * Database Performance Optimization
 * Creates indexes for frequently queried fields and aggregations
 */

const mongoose = require('mongoose');

const optimizeDatabase = async () => {
    try {
        console.log('📊 Optimizing database indexes...');

        // CV Model Indexes
        const CVModel = require('../models/CV');
        await CVModel.collection.createIndex({ userId: 1, createdAt: -1 });
        await CVModel.collection.createIndex({ isPublic: 1, views: -1 });
        await CVModel.collection.createIndex({ title: 'text', summary: 'text' });

        // User Model Indexes
        const UserModel = require('../models/User');
        await UserModel.collection.createIndex({ email: 1 }, { unique: true });
        await UserModel.collection.createIndex({ tier: 1, isPremium: 1 });
        await UserModel.collection.createIndex({ lastLogin: -1 });

        // Job Model Indexes
        const JobModel = require('../models/Job');
        await JobModel.collection.createIndex({ title: 1, location: 1 });
        await JobModel.collection.createIndex({ salary: 1, salaryMax: 1 });
        await JobModel.collection.createIndex({ postedDate: -1 });
        await JobModel.collection.createIndex({ skills: 1 });
        await JobModel.collection.createIndex({ company: 1 });

        // Review Model Indexes
        const ReviewModel = require('../models/CVReview');
        await ReviewModel.collection.createIndex({ cvId: 1 });
        await ReviewModel.collection.createIndex({ reviewerId: 1 });
        await ReviewModel.collection.createIndex({ createdAt: -1 });

        // Analytics Indexes
        const LogModel = require('../models/Log');
        await LogModel.collection.createIndex({ userId: 1, action: 1, timestamp: -1 });
        await LogModel.collection.createIndex({ timestamp: -1 });
        await LogModel.collection.createIndex({ 'metadata.page': 1 });

        // Payment Indexes
        const PaymentModel = require('../models/Payment');
        await PaymentModel.collection.createIndex({ userId: 1, status: 1 });
        await PaymentModel.collection.createIndex({ createdAt: -1 });

        // Notification Indexes
        const NotificationModel = require('../models/Notification');
        await NotificationModel.collection.createIndex({ userId: 1, read: 1 });
        await NotificationModel.collection.createIndex({ createdAt: -1 });

        // Email Indexes
        const EmailModel = require('../models/Email');
        await EmailModel.collection.createIndex({ userId: 1, template: 1 });
        await EmailModel.collection.createIndex({ createdAt: -1 });

        // AIUsageLog Indexes
        const AIUsageLogModel = require('../models/AIUsageLog');
        await AIUsageLogModel.collection.createIndex({ userId: 1, date: -1 });
        await AIUsageLogModel.collection.createIndex({ usage: -1 });

        // Referral Indexes
        const ReferralModel = require('../models/Referral');
        await ReferralModel.collection.createIndex({ referrerId: 1 });
        await ReferralModel.collection.createIndex({ referredId: 1 });

        // Support Indexes
        const SupportModel = require('../models/Support');
        await SupportModel.collection.createIndex({ userId: 1, status: 1 });
        await SupportModel.collection.createIndex({ createdAt: -1 });

        console.log('✅ Database indexes created successfully');

        // Enable TTL for temporary data
        const SessionModel = mongoose.model('Session', new mongoose.Schema({ 
            expiresAt: { type: Date, expires: 0 }
        }), 'sessions');

        console.log('✅ TTL indexes configured');
    } catch (error) {
        console.error('❌ Database optimization error:', error);
        // Don't fail startup if indexing fails
    }
};

/**
 * Connection Pool Configuration
 */
const configureConnectionPool = async (mongoUri) => {
    const options = {
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 60000,
        waitQueueTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority'
    };

    return mongoose.connect(mongoUri, options);
};

/**
 * Query Profiling Wrapper
 */
const profileQuery = async (fn, label) => {
    const start = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - start;
        
        if (duration > 100) {
            console.warn(`⚠️  Slow Query (${duration}ms): ${label}`);
        }
        
        return result;
    } catch (error) {
        console.error(`❌ Query Error: ${label}`, error);
        throw error;
    }
};

module.exports = {
    optimizeDatabase,
    configureConnectionPool,
    profileQuery
};
