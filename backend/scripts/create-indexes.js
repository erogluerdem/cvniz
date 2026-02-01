// Database Indexing Optimization
// Run this script after connecting to MongoDB to create optimal indexes

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const CV = require('../models/CV');
const CVView = require('../models/CVView');
const Analytics = require('../models/AIUsageLog');
const EmailLog = require('../models/Email');
const LoginLog = require('../models/LoginLog');
const CVVisit = require('../models/CVVisit');
const Payment = require('../models/Payment');
const Support = require('../models/Support');

async function createIndexes() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📍 MongoDB bağlantısı başarılı');

        // User Indexes
        await User.collection.createIndex({ email: 1 }, { unique: true });
        await User.collection.createIndex({ createdAt: -1 });
        await User.collection.createIndex({ isPremium: 1, expiresAt: 1 });
        await User.collection.createIndex({ referralCode: 1 });
        console.log('✅ User indexes oluşturuldu');

        // CV Indexes
        await CV.collection.createIndex({ userId: 1, createdAt: -1 });
        await CV.collection.createIndex({ isPublic: 1, updatedAt: -1 });
        await CV.collection.createIndex({ template: 1 });
        await CV.collection.createIndex({ language: 1 });
        await CV.collection.createIndex({ title: 'text', content: 'text' });
        console.log('✅ CV indexes oluşturuldu');

        // CVView Indexes
        await CVView.collection.createIndex({ cvId: 1, createdAt: -1 });
        await CVView.collection.createIndex({ viewerId: 1 });
        await CVView.collection.createIndex({ createdAt: -1 });
        console.log('✅ CVView indexes oluşturuldu');

        // Analytics Indexes
        await Analytics.collection.createIndex({ userId: 1, createdAt: -1 });
        await Analytics.collection.createIndex({ action: 1, createdAt: -1 });
        await Analytics.collection.createIndex({ createdAt: -1 });
        console.log('✅ Analytics indexes oluşturuldu');

        // Email Logs
        await EmailLog.collection.createIndex({ userId: 1, createdAt: -1 });
        await EmailLog.collection.createIndex({ recipient: 1 });
        await EmailLog.collection.createIndex({ createdAt: -1 });
        console.log('✅ Email indexes oluşturuldu');

        // Login Logs
        await LoginLog.collection.createIndex({ userId: 1, createdAt: -1 });
        await LoginLog.collection.createIndex({ ip: 1, createdAt: -1 });
        console.log('✅ LoginLog indexes oluşturuldu');

        // CV Visits
        await CVVisit.collection.createIndex({ cvId: 1, visitDate: -1 });
        await CVVisit.collection.createIndex({ userId: 1, visitDate: -1 });
        console.log('✅ CVVisit indexes oluşturuldu');

        // Payment
        await Payment.collection.createIndex({ userId: 1, createdAt: -1 });
        await Payment.collection.createIndex({ status: 1 });
        console.log('✅ Payment indexes oluşturuldu');

        // Support
        await Support.collection.createIndex({ userId: 1, createdAt: -1 });
        await Support.collection.createIndex({ status: 1, createdAt: -1 });
        console.log('✅ Support indexes oluşturuldu');

        console.log('\n🎉 Tüm indexes başarıyla oluşturuldu!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Index oluşturma hatası:', err);
        process.exit(1);
    }
}

createIndexes();
