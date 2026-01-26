const CVVisit = require('../models/CVVisit');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

class AnalyticsService {

    async trackVisit(cvId, req) {
        try {
            const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
            const uaString = req.headers['user-agent'];

            // Parse User Agent
            const parser = new UAParser(uaString);
            const result = parser.getResult();

            // GeoIP Lookup
            const geo = geoip.lookup(ip);

            const visitData = {
                cvId,
                visitorId: req.body.visitorId || 'anonymous',
                ip: ip === '::1' ? '127.0.0.1' : ip,

                deviceType: result.device.type || 'desktop',
                browser: result.browser.name,
                os: result.os.name,
                ua: uaString,

                country: geo?.country || 'Unknown',
                city: geo?.city || 'Unknown',
                region: geo?.region || 'Unknown'
            };

            const visit = await CVVisit.create(visitData);
            return visit;
        } catch (error) {
            console.error('Analytics Track Error:', error);
            return null; // Fail silently to not block the user
        }
    }

    async updateDuration(visitId, duration) {
        if (!visitId) return;
        try {
            await CVVisit.findByIdAndUpdate(visitId, { duration });
        } catch (error) {
            console.error('Analytics Duration Error:', error);
        }
    }

    async getStats(cvId) {
        try {
            const totalViews = await CVVisit.countDocuments({ cvId });

            // Unique Visitors (approximate by visitorId or IP)
            const uniqueViews = (await CVVisit.distinct('ip', { cvId })).length;

            // Device Stats
            const deviceStats = await CVVisit.aggregate([
                { $match: { cvId: new mongoose.Types.ObjectId(cvId) } },
                { $group: { _id: '$deviceType', count: { $sum: 1 } } }
            ]);

            // Location Stats (Top 5)
            const locationStats = await CVVisit.aggregate([
                { $match: { cvId: new mongoose.Types.ObjectId(cvId) } },
                { $group: { _id: '$country', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ]);

            // Daily Stats (Last 30 Days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const dailyStats = await CVVisit.aggregate([
                {
                    $match: {
                        cvId: new mongoose.Types.ObjectId(cvId),
                        timestamp: { $gte: thirtyDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Recent Views
            const recentViews = await CVVisit.find({ cvId })
                .sort({ timestamp: -1 })
                .limit(10)
                .select('timestamp country city deviceType browser os');

            return {
                totalViews,
                uniqueViews,
                deviceStats: this.formatDeviceStats(deviceStats),
                locationStats,
                dailyStats,
                recentViews
            };
        } catch (error) {
            console.error('Analytics Stats Error:', error);
            throw error;
        }
    }

    formatDeviceStats(stats) {
        const result = { desktop: 0, mobile: 0, other: 0 };
        stats.forEach(s => {
            if (!s._id || s._id === 'desktop') result.desktop += s.count;
            else if (s._id === 'mobile' || s._id === 'tablet') result.mobile += s.count;
            else result.other += s.count;
        });
        return result;
    }
}

const mongoose = require('mongoose');
module.exports = new AnalyticsService();
