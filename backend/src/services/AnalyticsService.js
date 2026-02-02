const CVVisit = require('../models/CVVisit');
const GeoService = require('./GeoService'); // Use the new service
const UAParser = require('ua-parser-js');
const mongoose = require('mongoose');

class AnalyticsService {

    async trackVisit(cvId, req) {
        try {
            const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
            const uaString = req.headers['user-agent'];

            // Parse User Agent
            const parser = new UAParser(uaString);
            const result = parser.getResult();

            // GeoIP Lookup via GeoService
            const geo = GeoService.getLocation(ip);

            const visitData = {
                cvId,
                visitorId: req.body.visitorId || 'anonymous',
                ip: ip === '::1' ? '127.0.0.1' : ip,

                deviceType: result.device.type || 'desktop',
                browser: result.browser.name || 'Unknown',
                os: result.os.name || 'Unknown',
                ua: uaString,

                country: geo?.country || 'Unknown',
                city: geo?.city || 'Unknown',
                region: geo?.region || 'Unknown', // geoip-lite might return 'region' code
                timestamp: new Date()
            };

            const visit = await CVVisit.create(visitData);
            return visit;
        } catch (error) {
            console.error('Analytics Track Error:', error);
            return null; // Fail silently
        }
    }

    async updateDuration(visitId, duration) {
        if (!visitId) {return;}
        try {
            await CVVisit.findByIdAndUpdate(visitId, { duration });
        } catch (error) {
            console.error('Analytics Duration Error:', error);
        }
    }

    async getStats(cvId) {
        try {
            const totalViews = await CVVisit.countDocuments({ cvId });

            // Unique Visitors (approximate by IP)
            const uniqueViews = (await CVVisit.distinct('ip', { cvId })).length;

            // Device Stats
            const deviceStats = await CVVisit.aggregate([
                { $match: { cvId: new mongoose.Types.ObjectId(cvId) } },
                { $group: { _id: '$deviceType', count: { $sum: 1 } } }
            ]);

            // Location Stats (Top 10)
            const locationStats = await CVVisit.aggregate([
                { $match: { cvId: new mongoose.Types.ObjectId(cvId) } },
                { $group: { _id: { country: '$country', city: '$city' }, count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        country: '$_id.country',
                        city: '$_id.city',
                        count: '$count',
                        _id: 0
                    }
                }
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
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Recent Views
            const recentViews = await CVVisit.find({ cvId })
                .sort({ timestamp: -1 })
                .limit(20)
                .select('timestamp country city deviceType browser os duration');

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
            const type = s._id ? s._id.toLowerCase() : 'desktop'; // Assume desktop if null
            if (type === 'mobile' || type === 'tablet') {result.mobile += s.count;}
            else if (type === 'desktop') {result.desktop += s.count;}
            else {result.other += s.count;}
        });
        return result;
    }
}

module.exports = new AnalyticsService();
