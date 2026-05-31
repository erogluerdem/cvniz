const mongoose = require('mongoose');

const cvViewSchema = new mongoose.Schema({
    cvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CV',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    viewerIp: {
        type: String,
        required: true
    },
    location: {
        city: { type: String, default: 'Bilinmiyor' },
        region: { type: String, default: '' },
        country: { type: String, default: 'Bilinmiyor' },
        countryCode: { type: String, default: '' },
        lat: { type: Number, default: null },
        lon: { type: Number, default: null }
    },
    device: {
        userAgent: { type: String, default: '' },
        browser: { type: String, default: 'Bilinmiyor' },
        os: { type: String, default: 'Bilinmiyor' },
        isMobile: { type: Boolean, default: false }
    },
    referer: {
        type: String,
        default: ''
    },
    isUnique: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
cvViewSchema.index({ cvId: 1, createdAt: -1 });
cvViewSchema.index({ userId: 1, createdAt: -1 });
cvViewSchema.index({ viewerIp: 1, cvId: 1 });
cvViewSchema.index({ 'location.city': 1 });
cvViewSchema.index({ 'location.country': 1 });

// Static: Get views for a CV
cvViewSchema.statics.getCVViews = function (cvId, options = {}) {
    const { limit = 50, skip = 0 } = options;
    return this.find({ cvId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
};

// Static: Get view statistics for a CV
cvViewSchema.statics.getCVStats = async function (cvId) {
    const totalViews = await this.countDocuments({ cvId });
    const uniqueViews = await this.countDocuments({ cvId, isUnique: true });

    // Views by location
    const locationStats = await this.aggregate([
        { $match: { cvId: new mongoose.Types.ObjectId(cvId) } },
        {
            $group: {
                _id: '$location.city',
                count: { $sum: 1 },
                country: { $first: '$location.country' }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    // Views by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await this.aggregate([
        {
            $match: {
                cvId: new mongoose.Types.ObjectId(cvId),
                createdAt: { $gte: thirtyDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // Device breakdown
    const deviceStats = await this.aggregate([
        { $match: { cvId: new mongoose.Types.ObjectId(cvId) } },
        {
            $group: {
                _id: '$device.isMobile',
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        totalViews,
        uniqueViews,
        locationStats,
        dailyStats,
        deviceStats: {
            mobile: deviceStats.find(d => d._id === true)?.count || 0,
            desktop: deviceStats.find(d => d._id === false)?.count || 0
        }
    };
};

// Static: Check if IP has viewed CV recently (within 24 hours)
cvViewSchema.statics.hasRecentView = async function (cvId, ip) {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const recentView = await this.findOne({
        cvId,
        viewerIp: ip,
        createdAt: { $gte: twentyFourHoursAgo }
    });

    return !!recentView;
};

const CVView = mongoose.model('CVView', cvViewSchema);

module.exports = CVView;
