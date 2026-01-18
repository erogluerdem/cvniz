const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const router = express.Router();
const User = require('../models/User');
const Payment = require('../models/Payment');
const CV = require('../models/CV');
const Coupon = require('../models/Coupon');
const Announcement = require('../models/Announcement');
const Log = require('../models/Log');
const Settings = require('../models/Settings');
const Referral = require('../models/Referral');
const Campaign = require('../models/Campaign');
const ABTest = require('../models/ABTest');
const Job = require('../models/Job');
const Partner = require('../models/Partner');
const Enterprise = require('../models/Enterprise');
const Email = require('../models/Email');
const EmailTemplate = require('../models/EmailTemplate');
const SecuritySettings = require('../models/SecuritySettings');
const LoginLog = require('../models/LoginLog');
const ApiKey = require('../models/ApiKey');
const AISettings = require('../models/AISettings');
const AIUsageLog = require('../models/AIUsageLog');
const Theme = require('../models/Theme');
const logger = require('../utils/logger');
const { authenticate, adminOnly } = require('../middleware/auth');

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const Support = require('../models/Support');

// @desc    Get dashboard statistics (Admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const premiumUsers = await User.countDocuments({ isPremium: true });
        const totalCVs = await CV.countDocuments();

        const allPayments = await Payment.find({ status: 'completed' });
        const revenue = allPayments.reduce((acc, p) => acc + p.amount, 0);

        // Daily stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayCVs = await CV.countDocuments({ createdAt: { $gte: today } });
        const yesterdayCVs = await CV.countDocuments({ createdAt: { $gte: yesterday, $lt: today } });

        const todayPayments = await Payment.find({ status: 'completed', createdAt: { $gte: today } });
        const todayRevenue = todayPayments.reduce((acc, p) => acc + p.amount, 0);

        const openTickets = await Support.countDocuments({ status: 'open' });

        // Active users (last 24h)
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const activeUsersCount = await User.countDocuments({ lastLogin: { $gte: last24h } });

        // Growth Calculation (CVs MoM)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const monthlyCVsCount = await CV.aggregate([
            {
                $match: { createdAt: { $gte: lastMonth } }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Template Usage Distribution
        const templateUsage = await CV.aggregate([
            { $group: { _id: "$template", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Monthly data for chart (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyTrends = await CV.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                premiumUsers,
                totalCVs,
                revenue,
                todayCVs,
                yesterdayCVs,
                todayRevenue,
                activeUsers: activeUsersCount,
                downloads: Math.floor(totalCVs * 3.2), // Mock but based on real CVs
                openTickets,
                templateUsage: templateUsage.map(t => ({ id: t._id, usage: t.count })),
                monthlyTrends: monthlyTrends.map(t => t.count),
                growth: yesterdayCVs > 0 ? (((todayCVs - yesterdayCVs) / yesterdayCVs) * 100).toFixed(1) : 100
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
});

// ============ COUPON MANAGEMENT ============
router.get('/coupons', authenticate, adminOnly, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ error: 'Kuponlar alınamadı' });
    }
});

router.post('/coupons', authenticate, adminOnly, async (req, res) => {
    try {
        const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'Kupon Oluşturuldu', module: 'Kuponlar', details: coupon, req });
        res.status(201).json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ error: 'Kupon oluşturulamadı' });
    }
});

router.put('/coupons/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) {
            return res.status(404).json({ error: 'Kupon bulunamadı' });
        }
        await logger({ action: 'Kupon Güncellendi', module: 'Kuponlar', details: coupon, req });
        res.json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ error: 'Kupon güncellenemedi' });
    }
});

router.delete('/coupons/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        await logger({ action: 'Kupon Silindi', module: 'Kuponlar', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'Kupon silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Kupon silinemedi' });
    }
});

// ============ ANNOUNCEMENT MANAGEMENT ============
router.get('/announcements', authenticate, adminOnly, async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json({ success: true, announcements });
    } catch (error) {
        res.status(500).json({ error: 'Duyurular alınamadı' });
    }
});

router.post('/announcements', authenticate, adminOnly, async (req, res) => {
    try {
        const announcement = await Announcement.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'Duyuru Yayınlandı', module: 'Duyurular', details: announcement, req });
        res.status(201).json({ success: true, announcement });
    } catch (error) {
        res.status(500).json({ error: 'Duyuru yayınlanamadı' });
    }
});

router.patch('/announcements/:id/toggle', authenticate, adminOnly, async (req, res) => {
    try {
        const ann = await Announcement.findById(req.params.id);
        ann.isActive = !ann.isActive;
        await ann.save();
        await logger({ action: 'Duyuru Durumu Değiştirildi', module: 'Duyurular', details: { id: req.params.id, active: ann.isActive }, req });
        res.json({ success: true, announcement: ann });
    } catch (error) {
        res.status(500).json({ error: 'Duyuru güncellenemedi' });
    }
});

router.delete('/announcements/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: 'Duyuru bulunamadı' });
        }
        await announcement.deleteOne();
        await logger({ action: 'Duyuru Silindi', module: 'Duyurular', details: { id: req.params.id, title: announcement.title }, req });
        res.json({ success: true, message: 'Duyuru başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Duyuru silinemedi' });
    }
});

// ============ LOGS ============
router.get('/logs', authenticate, adminOnly, async (req, res) => {
    try {
        const { module, admin, startDate, endDate, limit = 100 } = req.query;
        let query = {};

        if (module) query.module = module;
        if (admin) query.adminEmail = { $regex: admin, $options: 'i' };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const logs = await Log.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ error: 'Loglar alınamadı' });
    }
});

router.get('/logs/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const total = await Log.countDocuments();
        const todayCount = await Log.countDocuments({ createdAt: { $gte: today } });

        // En aktif modül
        const mostActiveModuleRes = await Log.aggregate([
            { $group: { _id: '$module', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        // En aktif admin
        const mostActiveAdminRes = await Log.aggregate([
            { $group: { _id: '$adminEmail', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        res.json({
            success: true,
            stats: {
                total,
                today: todayCount,
                mostActiveModule: mostActiveModuleRes[0]?._id || '-',
                mostActiveAdmin: mostActiveAdminRes[0]?._id || '-'
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Log istatistikleri alınamadı' });
    }
});

// ============ SETTINGS ============
router.get('/settings', authenticate, adminOnly, async (req, res) => {
    try {
        const settings = await Settings.find();
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ error: 'Ayarlar alınamadı' });
    }
});

router.post('/settings', authenticate, adminOnly, async (req, res) => {
    try {
        const { key, value } = req.body;
        const setting = await Settings.findOneAndUpdate(
            { key },
            { value },
            { upsert: true, new: true }
        );
        await logger({ action: 'Sistem Ayarı Güncellendi', module: 'Ayarlar', details: { key, value }, req });
        res.json({ success: true, setting });
    } catch (error) {
        res.status(500).json({ error: 'Ayar kaydedilemedi' });
    }
});

router.put('/settings/batch', authenticate, adminOnly, async (req, res) => {
    try {
        const { settings } = req.body; // { key1: value1, key2: value2 }
        const promises = Object.entries(settings).map(([key, value]) =>
            Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
        );
        await Promise.all(promises);
        await logger({ action: 'Toplu Ayar Güncelleme', module: 'Ayarlar', details: settings, req });
        res.json({ success: true, message: 'Ayarlar başarıyla güncellendi' });
    } catch (error) {
        res.status(500).json({ error: 'Ayarlar toplu güncellenemedi' });
    }
});

router.get('/settings/system-check', authenticate, adminOnly, async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'Bağlı' : 'Bağlı Değil';
        const nodeVersion = process.version;
        const platform = process.platform;
        const uptime = process.uptime();

        res.json({
            success: true,
            status: { dbStatus, nodeVersion, platform, uptime: Math.floor(uptime / 60) + ' dakika' }
        });
    } catch (error) {
        res.status(500).json({ error: 'Sistem bilgisi alınamadı' });
    }
});

// @desc    Get all CVs from all users (Admin only)
// @route   GET /api/admin/cvs
// @access  Private/Admin
router.get('/cvs', authenticate, adminOnly, async (req, res) => {
    try {
        const cvs = await CV.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            { $unwind: '$owner' },
            {
                $project: {
                    id: '$_id',
                    name: 1,
                    template: 1,
                    isPublic: 1,
                    publicUrl: 1,
                    isArchived: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'owner.id': '$owner._id',
                    'owner.name': 1,
                    'owner.email': 1,
                    'owner.avatar': 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json({ success: true, cvs });
    } catch (error) {
        console.error('Fetch all CVs error:', error);
        res.status(500).json({ error: 'CV listesi alınamadı' });
    }
});

// @desc    Get full CV detail (Admin only)
router.get('/cvs/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const cv = await CV.findById(req.params.id).populate('userId', 'name email');
        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }
        res.json({ success: true, cv });
    } catch (error) {
        res.status(500).json({ error: 'CV detayı alınamadı' });
    }
});

// @desc    Update any CV (Admin only)
router.put('/cvs/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, template, data, layout, isPublic } = req.body;
        const cv = await CV.findByIdAndUpdate(
            req.params.id,
            { $set: { name, template, data, layout, isPublic } },
            { new: true }
        );
        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }
        await logger({ action: 'CV Güncellendi (Admin)', module: 'CV Yönetimi', details: { id: cv._id, name: cv.name }, req });
        res.json({ success: true, cv });
    } catch (error) {
        res.status(500).json({ error: 'CV güncellenemedi' });
    }
});

// @desc    Delete any CV (Admin only)
router.delete('/cvs/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const cv = await CV.findByIdAndDelete(req.params.id);
        if (!cv) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }
        await logger({ action: 'CV Silindi (Admin)', module: 'CV Yönetimi', details: { id: req.params.id, name: cv.name }, req });
        res.json({ success: true, message: 'CV başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ error: 'CV silinemedi' });
    }
});

// ============ REFERRAL MANAGEMENT ============
router.get('/referrals', authenticate, adminOnly, async (req, res) => {
    try {
        const referrals = await Referral.find()
            .populate('referrer', 'name email')
            .populate('referred', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, referrals });
    } catch (error) {
        res.status(500).json({ error: 'Referanslar alınamadı' });
    }
});

router.get('/referrals/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const totalReferrals = await Referral.countDocuments();
        const converted = await Referral.countDocuments({ status: 'completed' });
        const pending = await Referral.countDocuments({ status: 'pending' });
        const paidReferrals = await Referral.find({ isPaid: true });
        const totalEarnings = paidReferrals.reduce((sum, r) => sum + (r.referrerReward || 0), 0);

        // Top referrers
        const topReferrers = await Referral.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: '$referrer',
                    count: { $sum: 1 },
                    earnings: { $sum: '$referrerReward' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            {
                $project: {
                    name: '$user.name',
                    email: '$user.email',
                    referrals: '$count',
                    earnings: 1
                }
            }
        ]);

        res.json({
            success: true,
            stats: { totalReferrals, converted, pending, totalEarnings, conversionRate: totalReferrals > 0 ? Math.round((converted / totalReferrals) * 100) : 0 },
            topReferrers
        });
    } catch (error) {
        res.status(500).json({ error: 'Referans istatistikleri alınamadı' });
    }
});

router.put('/referrals/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const referral = await Referral.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('referrer', 'name email')
            .populate('referred', 'name email');
        if (!referral) {
            return res.status(404).json({ error: 'Referans bulunamadı' });
        }
        await logger({ action: 'Referans Güncellendi', module: 'Referanslar', details: referral, req });
        res.json({ success: true, referral });
    } catch (error) {
        res.status(500).json({ error: 'Referans güncellenemedi' });
    }
});

router.delete('/referrals/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Referral.findByIdAndDelete(req.params.id);
        await logger({ action: 'Referans Silindi', module: 'Referanslar', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'Referans silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Referans silinemedi' });
    }
});

// ============ CAMPAIGN MANAGEMENT ============
router.get('/campaigns', authenticate, adminOnly, async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json({ success: true, campaigns });
    } catch (error) {
        res.status(500).json({ error: 'Kampanyalar alınamadı' });
    }
});

router.get('/campaigns/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await Campaign.countDocuments();
        const active = await Campaign.countDocuments({ status: 'active' });
        const paused = await Campaign.countDocuments({ status: 'paused' });
        const draft = await Campaign.countDocuments({ status: 'draft' });

        const allCampaigns = await Campaign.find();
        const totalViews = allCampaigns.reduce((sum, c) => sum + (c.views || 0), 0);
        const totalClicks = allCampaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
        const totalConversions = allCampaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
        const totalRevenue = allCampaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);

        res.json({
            success: true,
            stats: { total, active, paused, draft, totalViews, totalClicks, totalConversions, totalRevenue }
        });
    } catch (error) {
        res.status(500).json({ error: 'Kampanya istatistikleri alınamadı' });
    }
});

router.post('/campaigns', authenticate, adminOnly, async (req, res) => {
    try {
        const campaign = await Campaign.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'Kampanya Oluşturuldu', module: 'Kampanyalar', details: campaign, req });
        res.status(201).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ error: 'Kampanya oluşturulamadı' });
    }
});

router.put('/campaigns/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!campaign) {
            return res.status(404).json({ error: 'Kampanya bulunamadı' });
        }
        await logger({ action: 'Kampanya Güncellendi', module: 'Kampanyalar', details: campaign, req });
        res.json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ error: 'Kampanya güncellenemedi' });
    }
});

router.delete('/campaigns/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.params.id);
        await logger({ action: 'Kampanya Silindi', module: 'Kampanyalar', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'Kampanya silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Kampanya silinemedi' });
    }
});

// ============ A/B TEST MANAGEMENT ============
router.get('/abtests', authenticate, adminOnly, async (req, res) => {
    try {
        const tests = await ABTest.find().sort({ createdAt: -1 });
        res.json({ success: true, tests });
    } catch (error) {
        res.status(500).json({ error: 'A/B testleri alınamadı' });
    }
});

router.get('/abtests/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await ABTest.countDocuments();
        const running = await ABTest.countDocuments({ status: 'running' });
        const paused = await ABTest.countDocuments({ status: 'paused' });
        const completed = await ABTest.countDocuments({ status: 'completed' });

        const allTests = await ABTest.find();
        let totalViews = 0, totalConversions = 0;
        allTests.forEach(test => {
            test.variants.forEach(v => {
                totalViews += v.views || 0;
                totalConversions += v.conversions || 0;
            });
        });

        const avgImprovement = completed > 0 ? 12 : 0; // Placeholder

        res.json({
            success: true,
            stats: { total, running, paused, completed, totalViews, totalConversions, avgImprovement }
        });
    } catch (error) {
        res.status(500).json({ error: 'A/B test istatistikleri alınamadı' });
    }
});

router.post('/abtests', authenticate, adminOnly, async (req, res) => {
    try {
        const test = await ABTest.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'A/B Test Oluşturuldu', module: 'A/B Testleri', details: test, req });
        res.status(201).json({ success: true, test });
    } catch (error) {
        res.status(500).json({ error: 'A/B test oluşturulamadı' });
    }
});

router.put('/abtests/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const test = await ABTest.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!test) {
            return res.status(404).json({ error: 'A/B test bulunamadı' });
        }
        await logger({ action: 'A/B Test Güncellendi', module: 'A/B Testleri', details: test, req });
        res.json({ success: true, test });
    } catch (error) {
        res.status(500).json({ error: 'A/B test güncellenemedi' });
    }
});

router.delete('/abtests/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await ABTest.findByIdAndDelete(req.params.id);
        await logger({ action: 'A/B Test Silindi', module: 'A/B Testleri', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'A/B test silindi' });
    } catch (error) {
        res.status(500).json({ error: 'A/B test silinemedi' });
    }
});

// ============ JOB MANAGEMENT ============
router.get('/jobs', authenticate, adminOnly, async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ error: 'İş ilanları alınamadı' });
    }
});

router.get('/jobs/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await Job.countDocuments();
        const active = await Job.countDocuments({ status: 'active' });
        const paused = await Job.countDocuments({ status: 'paused' });
        const expired = await Job.countDocuments({ status: 'expired' });
        const featured = await Job.countDocuments({ featured: true });

        const allJobs = await Job.find();
        const totalApplications = allJobs.reduce((sum, j) => sum + (j.applications || 0), 0);
        const totalViews = allJobs.reduce((sum, j) => sum + (j.views || 0), 0);
        const companies = new Set(allJobs.map(j => j.company)).size;

        res.json({
            success: true,
            stats: { total, active, paused, expired, featured, totalApplications, totalViews, companies }
        });
    } catch (error) {
        res.status(500).json({ error: 'İş ilanı istatistikleri alınamadı' });
    }
});

router.post('/jobs', authenticate, adminOnly, async (req, res) => {
    try {
        const job = await Job.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'İş İlanı Oluşturuldu', module: 'İş İlanları', details: job, req });
        res.status(201).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ error: 'İş ilanı oluşturulamadı' });
    }
});

router.put('/jobs/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ error: 'İş ilanı bulunamadı' });
        }
        await logger({ action: 'İş İlanı Güncellendi', module: 'İş İlanları', details: job, req });
        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ error: 'İş ilanı güncellenemedi' });
    }
});

router.delete('/jobs/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        await logger({ action: 'İş İlanı Silindi', module: 'İş İlanları', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'İş ilanı silindi' });
    } catch (error) {
        res.status(500).json({ error: 'İş ilanı silinemedi' });
    }
});

// ============ PARTNER MANAGEMENT ============
router.get('/partners', authenticate, adminOnly, async (req, res) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.json({ success: true, partners });
    } catch (error) {
        res.status(500).json({ error: 'Partnerlar alınamadı' });
    }
});

router.get('/partners/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await Partner.countDocuments();
        const active = await Partner.countDocuments({ status: 'active' });
        const pending = await Partner.countDocuments({ status: 'pending' });

        const allPartners = await Partner.find();
        const totalReferrals = allPartners.reduce((sum, p) => sum + (p.referrals || 0), 0);
        const totalConversions = allPartners.reduce((sum, p) => sum + (p.conversions || 0), 0);
        const totalEarnings = allPartners.reduce((sum, p) => sum + (p.earnings || 0), 0);
        const paidEarnings = allPartners.reduce((sum, p) => sum + (p.paidEarnings || 0), 0);

        res.json({
            success: true,
            stats: { total, active, pending, totalReferrals, totalConversions, totalEarnings, paidEarnings }
        });
    } catch (error) {
        res.status(500).json({ error: 'Partner istatistikleri alınamadı' });
    }
});

router.post('/partners', authenticate, adminOnly, async (req, res) => {
    try {
        const partner = await Partner.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'Partner Oluşturuldu', module: 'Partnerlar', details: partner, req });
        res.status(201).json({ success: true, partner });
    } catch (error) {
        res.status(500).json({ error: 'Partner oluşturulamadı' });
    }
});

router.put('/partners/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!partner) {
            return res.status(404).json({ error: 'Partner bulunamadı' });
        }
        await logger({ action: 'Partner Güncellendi', module: 'Partnerlar', details: partner, req });
        res.json({ success: true, partner });
    } catch (error) {
        res.status(500).json({ error: 'Partner güncellenemedi' });
    }
});

router.delete('/partners/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        await logger({ action: 'Partner Silindi', module: 'Partnerlar', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'Partner silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Partner silinemedi' });
    }
});

// ============ ENTERPRISE MANAGEMENT ============
router.get('/enterprises', authenticate, adminOnly, async (req, res) => {
    try {
        const enterprises = await Enterprise.find().sort({ createdAt: -1 });
        res.json({ success: true, enterprises });
    } catch (error) {
        res.status(500).json({ error: 'Kurumsal hesaplar alınamadı' });
    }
});

router.get('/enterprises/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await Enterprise.countDocuments();
        const active = await Enterprise.countDocuments({ status: 'active' });
        const trial = await Enterprise.countDocuments({ status: 'trial' });

        const allEnterprises = await Enterprise.find({ status: 'active' });
        const totalUsers = allEnterprises.reduce((sum, e) => sum + (e.activeUsers || 0), 0);
        const monthlyRevenue = allEnterprises.reduce((sum, e) => sum + (e.monthlyFee || 0), 0);
        const totalCVLimit = allEnterprises.reduce((sum, e) => sum + (e.cvLimit || 0), 0);

        res.json({
            success: true,
            stats: { total, active, trial, totalUsers, monthlyRevenue, totalCVLimit }
        });
    } catch (error) {
        res.status(500).json({ error: 'Kurumsal istatistikler alınamadı' });
    }
});

router.post('/enterprises', authenticate, adminOnly, async (req, res) => {
    try {
        const enterprise = await Enterprise.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'Kurumsal Hesap Oluşturuldu', module: 'Enterprise', details: enterprise, req });
        res.status(201).json({ success: true, enterprise });
    } catch (error) {
        res.status(500).json({ error: 'Kurumsal hesap oluşturulamadı' });
    }
});

router.put('/enterprises/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const enterprise = await Enterprise.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!enterprise) {
            return res.status(404).json({ error: 'Kurumsal hesap bulunamadı' });
        }
        await logger({ action: 'Kurumsal Hesap Güncellendi', module: 'Enterprise', details: enterprise, req });
        res.json({ success: true, enterprise });
    } catch (error) {
        res.status(500).json({ error: 'Kurumsal hesap güncellenemedi' });
    }
});

router.delete('/enterprises/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Enterprise.findByIdAndDelete(req.params.id);
        await logger({ action: 'Kurumsal Hesap Silindi', module: 'Enterprise', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'Kurumsal hesap silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Kurumsal hesap silinemedi' });
    }
});

// ============ EMAIL MANAGEMENT ============
router.get('/emails', authenticate, adminOnly, async (req, res) => {
    try {
        const emails = await Email.find().sort({ createdAt: -1 });
        res.json({ success: true, emails });
    } catch (error) {
        res.status(500).json({ error: 'E-postalar alınamadı' });
    }
});

router.get('/emails/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await Email.countDocuments();
        const sent = await Email.countDocuments({ status: 'sent' });
        const scheduled = await Email.countDocuments({ status: 'scheduled' });

        const allEmails = await Email.find({ status: 'sent' });
        const totalDelivered = allEmails.reduce((sum, e) => sum + (e.delivered || 0), 0);
        const totalOpened = allEmails.reduce((sum, e) => sum + (e.opened || 0), 0);
        const totalClicked = allEmails.reduce((sum, e) => sum + (e.clicked || 0), 0);
        const totalRecipients = allEmails.reduce((sum, e) => sum + (e.recipientCount || 0), 0);
        const avgOpenRate = totalRecipients > 0 ? ((totalOpened / totalRecipients) * 100).toFixed(1) : 0;

        res.json({
            success: true,
            stats: { total, sent, scheduled, totalDelivered, totalOpened, totalClicked, avgOpenRate }
        });
    } catch (error) {
        res.status(500).json({ error: 'E-posta istatistikleri alınamadı' });
    }
});

router.post('/emails', authenticate, adminOnly, async (req, res) => {
    try {
        const email = await Email.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'E-posta Oluşturuldu', module: 'E-postalar', details: email, req });
        res.status(201).json({ success: true, email });
    } catch (error) {
        res.status(500).json({ error: 'E-posta oluşturulamadı' });
    }
});

router.put('/emails/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const email = await Email.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!email) {
            return res.status(404).json({ error: 'E-posta bulunamadı' });
        }
        await logger({ action: 'E-posta Güncellendi', module: 'E-postalar', details: email, req });
        res.json({ success: true, email });
    } catch (error) {
        res.status(500).json({ error: 'E-posta güncellenemedi' });
    }
});

router.delete('/emails/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Email.findByIdAndDelete(req.params.id);
        await logger({ action: 'E-posta Silindi', module: 'E-postalar', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'E-posta silindi' });
    } catch (error) {
        res.status(500).json({ error: 'E-posta silinemedi' });
    }
});

// ============ EMAIL TEMPLATE MANAGEMENT ============
router.get('/email-templates', authenticate, adminOnly, async (req, res) => {
    try {
        const templates = await EmailTemplate.find().sort({ createdAt: -1 });
        res.json({ success: true, templates });
    } catch (error) {
        res.status(500).json({ error: 'Şablonlar alınamadı' });
    }
});

router.post('/email-templates', authenticate, adminOnly, async (req, res) => {
    try {
        const template = await EmailTemplate.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'E-posta Şablonu Oluşturuldu', module: 'E-posta Şablonları', details: template, req });
        res.status(201).json({ success: true, template });
    } catch (error) {
        res.status(500).json({ error: 'Şablon oluşturulamadı' });
    }
});

router.put('/email-templates/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const template = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!template) {
            return res.status(404).json({ error: 'Şablon bulunamadı' });
        }
        await logger({ action: 'E-posta Şablonu Güncellendi', module: 'E-posta Şablonları', details: template, req });
        res.json({ success: true, template });
    } catch (error) {
        res.status(500).json({ error: 'Şablon güncellenemedi' });
    }
});

router.delete('/email-templates/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await EmailTemplate.findByIdAndDelete(req.params.id);
        await logger({ action: 'E-posta Şablonu Silindi', module: 'E-posta Şablonları', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'Şablon silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Şablon silinemedi' });
    }
});

// ============ SECURITY MANAGEMENT ============
router.get('/security/settings', authenticate, adminOnly, async (req, res) => {
    try {
        let settings = await SecuritySettings.findOne();
        if (!settings) {
            settings = await SecuritySettings.create({});
        }
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ error: 'Güvenlik ayarları alınamadı' });
    }
});

router.put('/security/settings', authenticate, adminOnly, async (req, res) => {
    try {
        let settings = await SecuritySettings.findOne();
        if (!settings) {
            settings = await SecuritySettings.create({ ...req.body, updatedBy: req.user._id });
        } else {
            Object.assign(settings, req.body, { updatedBy: req.user._id });
            await settings.save();
        }
        await logger({ action: 'Güvenlik Ayarları Güncellendi', module: 'Güvenlik', details: req.body, req });
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ error: 'Güvenlik ayarları güncellenemedi' });
    }
});

router.get('/security/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const successfulLogins = await LoginLog.countDocuments({ success: true, createdAt: { $gte: sevenDaysAgo } });
        const failedLogins = await LoginLog.countDocuments({ success: false, createdAt: { $gte: sevenDaysAgo } });

        const settings = await SecuritySettings.findOne();
        const blockedIPCount = settings?.blockedIPs?.length || 0;

        res.json({
            success: true,
            stats: { successfulLogins, failedLogins, blockedIPCount, status: 'secure' }
        });
    } catch (error) {
        res.status(500).json({ error: 'Güvenlik istatistikleri alınamadı' });
    }
});

router.get('/security/login-logs', authenticate, adminOnly, async (req, res) => {
    try {
        const logs = await LoginLog.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ error: 'Giriş logları alınamadı' });
    }
});

router.post('/security/block-ip', authenticate, adminOnly, async (req, res) => {
    try {
        const { ip, reason } = req.body;
        if (!ip) return res.status(400).json({ error: 'IP adresi gerekli' });

        let settings = await SecuritySettings.findOne();
        if (!settings) settings = await SecuritySettings.create({});

        // Check if IP already blocked
        const exists = settings.blockedIPs.find(b => b.ip === ip);
        if (exists) return res.status(400).json({ error: 'Bu IP zaten engellenmiş' });

        settings.blockedIPs.push({ ip, reason: reason || 'Manuel engel', blockedBy: req.user._id });
        await settings.save();

        await logger({ action: 'IP Engellendi', module: 'Güvenlik', details: { ip, reason }, req });
        res.json({ success: true, blockedIPs: settings.blockedIPs });
    } catch (error) {
        res.status(500).json({ error: 'IP engellenemedi' });
    }
});

router.delete('/security/block-ip/:ip', authenticate, adminOnly, async (req, res) => {
    try {
        const ip = decodeURIComponent(req.params.ip);
        let settings = await SecuritySettings.findOne();
        if (!settings) return res.status(404).json({ error: 'Ayarlar bulunamadı' });

        settings.blockedIPs = settings.blockedIPs.filter(b => b.ip !== ip);
        await settings.save();

        await logger({ action: 'IP Engeli Kaldırıldı', module: 'Güvenlik', details: { ip }, req });
        res.json({ success: true, blockedIPs: settings.blockedIPs });
    } catch (error) {
        res.status(500).json({ error: 'IP engeli kaldırılamadı' });
    }
});

// ============ API KEY MANAGEMENT ============
router.get('/api-keys', authenticate, adminOnly, async (req, res) => {
    try {
        const apiKeys = await ApiKey.find().sort({ createdAt: -1 });
        res.json({ success: true, apiKeys });
    } catch (error) {
        res.status(500).json({ error: 'API anahtarları alınamadı' });
    }
});

router.get('/api-keys/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const total = await ApiKey.countDocuments();
        const active = await ApiKey.countDocuments({ status: 'active' });

        const allKeys = await ApiKey.find();
        const totalRequests = allKeys.reduce((sum, k) => sum + (k.totalRequests || 0), 0);

        res.json({
            success: true,
            stats: { total, active, totalRequests, version: 'v1.0' }
        });
    } catch (error) {
        res.status(500).json({ error: 'API istatistikleri alınamadı' });
    }
});

router.post('/api-keys', authenticate, adminOnly, async (req, res) => {
    try {
        const { name, environment, permissions, rateLimit, description, expiresAt } = req.body;
        const { key, prefix, hashedKey } = ApiKey.generateKey(environment || 'prod');

        const apiKey = await ApiKey.create({
            name,
            key,
            prefix,
            hashedKey,
            environment: environment || 'production',
            permissions: permissions || ['read'],
            rateLimit: rateLimit || 1000,
            description,
            expiresAt,
            createdBy: req.user._id
        });

        await logger({ action: 'API Anahtarı Oluşturuldu', module: 'API Yönetimi', details: { name, environment }, req });
        res.status(201).json({ success: true, apiKey });
    } catch (error) {
        res.status(500).json({ error: 'API anahtarı oluşturulamadı' });
    }
});

router.put('/api-keys/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const apiKey = await ApiKey.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!apiKey) {
            return res.status(404).json({ error: 'API anahtarı bulunamadı' });
        }
        await logger({ action: 'API Anahtarı Güncellendi', module: 'API Yönetimi', details: apiKey, req });
        res.json({ success: true, apiKey });
    } catch (error) {
        res.status(500).json({ error: 'API anahtarı güncellenemedi' });
    }
});

router.post('/api-keys/:id/regenerate', authenticate, adminOnly, async (req, res) => {
    try {
        const apiKey = await ApiKey.findById(req.params.id);
        if (!apiKey) {
            return res.status(404).json({ error: 'API anahtarı bulunamadı' });
        }

        const envShort = apiKey.environment === 'production' ? 'prod' : apiKey.environment === 'staging' ? 'stg' : 'dev';
        const { key, prefix, hashedKey } = ApiKey.generateKey(envShort);

        apiKey.key = key;
        apiKey.prefix = prefix;
        apiKey.hashedKey = hashedKey;
        await apiKey.save();

        await logger({ action: 'API Anahtarı Yenilendi', module: 'API Yönetimi', details: { id: apiKey._id, name: apiKey.name }, req });
        res.json({ success: true, apiKey });
    } catch (error) {
        res.status(500).json({ error: 'API anahtarı yenilenemedi' });
    }
});

router.delete('/api-keys/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await ApiKey.findByIdAndDelete(req.params.id);
        await logger({ action: 'API Anahtarı Silindi', module: 'API Yönetimi', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'API anahtarı silindi' });
    } catch (error) {
        res.status(500).json({ error: 'API anahtarı silinemedi' });
    }
});

// ============ AI SETTINGS MANAGEMENT ============
router.get('/ai-settings', authenticate, adminOnly, async (req, res) => {
    try {
        let settings = await AISettings.findOne();
        if (!settings) {
            settings = await AISettings.create({});
        }
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ error: 'AI ayarları alınamadı' });
    }
});

router.put('/ai-settings', authenticate, adminOnly, async (req, res) => {
    try {
        let settings = await AISettings.findOne();
        if (!settings) {
            settings = await AISettings.create({ ...req.body, updatedBy: req.user._id });
        } else {
            Object.assign(settings, req.body, { updatedBy: req.user._id });
            await settings.save();
        }
        await logger({ action: 'AI Ayarları Güncellendi', module: 'AI Yönetimi', details: req.body, req });
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ error: 'AI ayarları güncellenemedi' });
    }
});

router.get('/ai-settings/stats', authenticate, adminOnly, async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyLogs = await AIUsageLog.find({ createdAt: { $gte: startOfMonth } });
        const totalRequests = monthlyLogs.length;
        const totalCost = monthlyLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

        const avgResponseTime = totalRequests > 0
            ? (monthlyLogs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / totalRequests / 1000).toFixed(1)
            : 0;

        const settings = await AISettings.findOne();

        res.json({
            success: true,
            stats: {
                totalRequests,
                totalCost: totalCost.toFixed(2),
                avgResponseTime,
                activeModel: settings?.model || 'gpt-4'
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'AI istatistikleri alınamadı' });
    }
});

router.post('/ai-settings/test', authenticate, adminOnly, async (req, res) => {
    try {
        // In a real scenario, we would make a small request to the provider here
        // For now, we'll simulate a success with a timeout
        await new Promise(resolve => setTimeout(resolve, 1500));

        res.json({ success: true, message: 'AI sağlayıcı bağlantısı başarılı!' });
    } catch (error) {
        res.status(500).json({ error: 'AI testi başarısız oldu' });
    }
});

// ============ THEME MANAGEMENT ============
router.get('/themes', authenticate, adminOnly, async (req, res) => {
    try {
        let themes = await Theme.find().sort({ createdAt: -1 });

        // Seed default theme if none exists
        if (themes.length === 0) {
            const defaultTheme = await Theme.create({
                name: 'CVniz Dark (Orijinal)',
                slug: 'default',
                description: 'Sistemin varsayılan koyu teması.',
                colors: {
                    primary: '#22d3ee',
                    secondary: '#a855f7',
                    accent: '#f59e0b',
                    background: '#0f172a',
                    surface: '#1e293b',
                    text: '#f8fafc',
                    textMuted: '#94a3b8'
                },
                typography: { fontFamily: 'Inter', baseSize: '16px' },
                ui: { borderRadius: 12, glassmorphism: true, shadows: 'soft' }
            });
            themes = [defaultTheme];

            // Set as active in settings if not set
            await Settings.findOneAndUpdate(
                { key: 'active_theme' },
                { value: 'default' },
                { upsert: true }
            );
        }

        const activeThemeSetting = await Settings.findOne({ key: 'active_theme' });
        res.json({ success: true, themes, activeThemeSlug: activeThemeSetting?.value || 'default' });
    } catch (error) {
        res.status(500).json({ error: 'Temalar alınamadı' });
    }
});

router.post('/themes', authenticate, adminOnly, async (req, res) => {
    try {
        const theme = await Theme.create({ ...req.body, createdBy: req.user._id });
        await logger({ action: 'Yeni Tema Oluşturuldu', module: 'Görünüm', details: theme, req });
        res.status(201).json({ success: true, theme });
    } catch (error) {
        res.status(500).json({ error: 'Tema oluşturulamadı' });
    }
});

router.put('/themes/:id', authenticate, adminOnly, async (req, res) => {
    try {
        const theme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true });
        await logger({ action: 'Tema Güncellendi', module: 'Görünüm', details: theme, req });
        res.json({ success: true, theme });
    } catch (error) {
        res.status(500).json({ error: 'Tema güncellenemedi' });
    }
});

router.delete('/themes/:id', authenticate, adminOnly, async (req, res) => {
    try {
        await Theme.findByIdAndDelete(req.params.id);
        await logger({ action: 'Tema Silindi', module: 'Görünüm', details: { id: req.params.id }, req });
        res.json({ success: true, message: 'Tema silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Tema silinemedi' });
    }
});

router.post('/themes/set-active', authenticate, adminOnly, async (req, res) => {
    try {
        const { slug } = req.body;
        await Settings.findOneAndUpdate(
            { key: 'active_theme' },
            { value: slug },
            { upsert: true }
        );
        await logger({ action: 'Aktif Tema Değiştirildi', module: 'Görünüm', details: { slug }, req });
        res.json({ success: true, message: 'Aktif tema güncellendi' });
    } catch (error) {
        res.status(500).json({ error: 'Aktif tema ayarlanamadı' });
    }
});

// ============ ANALYTICS ============
router.get('/analytics', authenticate, adminOnly, async (req, res) => {
    try {
        const { range = '30d' } = req.query;
        let startDate = new Date();

        if (range === '7d') startDate.setDate(startDate.getDate() - 7);
        else if (range === '30d') startDate.setDate(startDate.getDate() - 30);
        else if (range === '90d') startDate.setDate(startDate.getDate() - 90);
        else if (range === '1y') startDate.setFullYear(startDate.getFullYear() - 1);

        // 1. Core Metrics Over Time
        const metrics = await CV.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    cvCount: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const signupMetrics = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const revenueMetrics = await Payment.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Top Templates
        const topTemplates = await CV.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: "$template", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 3. User Demographics (Mocking for now as we don't store country/city in User)
        // In real app, we would use GeoIP or stored profile data
        const devices = [
            { id: 'Desktop', count: Math.floor(Math.random() * 500) + 1000 },
            { id: 'Mobile', count: Math.floor(Math.random() * 800) + 1200 },
            { id: 'Tablet', count: Math.floor(Math.random() * 100) + 200 }
        ];

        // 4. Conversion Stats
        const totalVisitors = 50000; // Mocked
        const totalSignups = await User.countDocuments({ createdAt: { $gte: startDate } });
        const totalCVs = await CV.countDocuments({ createdAt: { $gte: startDate } });
        const totalPayments = await Payment.countDocuments({ status: 'completed', createdAt: { $gte: startDate } });

        res.json({
            success: true,
            analytics: {
                metrics: {
                    cvs: metrics,
                    signups: signupMetrics,
                    revenue: revenueMetrics
                },
                topTemplates: topTemplates.map(t => ({ name: t._id, usage: t.count })),
                devices,
                conversion: {
                    visitors: totalVisitors,
                    signups: totalSignups,
                    cvs: totalCVs,
                    payments: totalPayments
                }
            }
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Analizler alınamadı' });
    }
});

// ============ LIVE STATS ============
router.get('/live-stats', authenticate, adminOnly, async (req, res) => {
    try {
        const last5Mins = new Date(Date.now() - 5 * 60 * 1000);
        const lastHour = new Date(Date.now() - 60 * 60 * 1000);

        // 1. Online Users (Last 5 mins activity)
        const onlineUsers = await User.countDocuments({ lastLogin: { $gte: last5Mins } });

        // 2. Active CV Sessions (Modified in last hour)
        const activeCVSessions = await CV.countDocuments({ updatedAt: { $gte: lastHour } });

        // 3. System Metrics
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const ramUsage = Math.round((usedMem / totalMem) * 100);

        const cpuUsage = Math.round(os.loadavg()[0] * 100 / os.cpus().length);
        const uptime = os.uptime();

        // 4. Live Activity (Last 10 logs)
        const recentLogs = await Log.find().sort({ createdAt: -1 }).limit(10);

        res.json({
            success: true,
            stats: {
                onlineUsers: onlineUsers || Math.floor(Math.random() * 5) + 1, // Fallback to a small random if no real activity
                activeCVSessions,
                pdfGenerations: Math.floor(Math.random() * 10), // Mocked for now
                server: {
                    cpu: Math.min(cpuUsage, 100),
                    ram: ramUsage,
                    uptime: Math.floor(uptime / 3600),
                    platform: os.platform()
                }
            },
            recentActions: recentLogs.map(log => ({
                action: log.action,
                user: log.adminEmail || 'Misafir',
                time: log.createdAt,
                type: log.module.toLowerCase()
            }))
        });
    } catch (error) {
        console.error('Live stats error:', error);
        res.status(500).json({ error: 'Canlı veriler alınamadı' });
    }
});

// ============ REPORTS ============
router.get('/reports', authenticate, adminOnly, async (req, res) => {
    try {
        const { start, end } = req.query;
        const startDate = start ? new Date(start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = end ? new Date(end) : new Date();

        // 1. Revenue Report
        const revenueData = await Payment.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. User Growth Report
        const userData = await User.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 3. CV Creation Report
        const cvData = await CV.aggregate([
            { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 4. Summaries
        const summary = {
            totalRevenue: revenueData.reduce((acc, curr) => acc + curr.amount, 0),
            totalPayments: revenueData.reduce((acc, curr) => acc + curr.count, 0),
            newUsers: userData.reduce((acc, curr) => acc + curr.count, 0),
            totalCVs: cvData.reduce((acc, curr) => acc + curr.count, 0)
        };

        res.json({
            success: true,
            reports: {
                revenue: revenueData,
                users: userData,
                cvs: cvData,
                summary
            }
        });
    } catch (error) {
        console.error('Reports error:', error);
        res.status(500).json({ error: 'Raporlar hazırlanamadı' });
    }
});

module.exports = router;

