/**
 * Marketplace Service
 * Central marketplace platform for services and collaboration
 */

const express = require('express');
const router = express.Router();
const * as Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

/**
 * Service Listing Schema
 */
const serviceListingSchema = new (require('mongoose')).Schema({
    providerId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    title: String,
    description: String,
    category: {
        type: String,
        enum: [
            'resume_writing',
            'interview_coaching',
            'career_consulting',
            'portfolio_building',
            'linkedin_optimization',
            'job_search',
            'freelance',
            'mentoring',
            'training',
            'other'
        ]
    },
    subcategory: String,

    // Pricing
    pricing: {
        type: {
            type: String,
            enum: ['fixed', 'hourly', 'package'],
            default: 'fixed'
        },
        amount: Number,
        currency: { type: String, default: 'USD' },
        packages: [{
            name: String,
            price: Number,
            features: [String],
            duration: String
        }]
    },

    // Service details
    deliverables: [String],
    timeline: String,
    skills: [String],
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },

    // Portfolio & proof
    portfolio: [{
        title: String,
        description: String,
        image: String,
        testimonial: String
    }],
    certificates: [String],
    experience: String,

    // Ratings & reviews
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 },
        reviews: [{
            buyerId: require('mongoose').Schema.Types.ObjectId,
            rating: Number,
            comment: String,
            createdAt: Date
        }]
    },

    // Availability
    availability: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
    },
    responseTime: String,

    // Status
    status: {
        type: String,
        enum: ['draft', 'active', 'archived', 'suspended'],
        default: 'draft'
    },
    views: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },
    ordersCompleted: { type: Number, default: 0 },

    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, { collection: 'service_listings' });

/**
 * Marketplace Order Schema
 */
const marketplaceOrderSchema = new (require('mongoose')).Schema({
    serviceId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'ServiceListing',
        required: true
    },
    buyerId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    providerId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: String,
    price: Number,
    currency: { type: String, default: 'USD' },

    // Order details
    requirements: String,
    attachments: [String],
    customizations: [{
        name: String,
        value: String,
        price: Number
    }],

    // Timeline
    deadline: Date,
    completionDate: Date,
    revisionsDue: Date,

    // Status
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'revision', 'completed', 'canceled', 'disputed'],
        default: 'pending'
    },

    // Deliverables
    deliverables: [{
        title: String,
        description: String,
        files: [String],
        submittedDate: Date,
        approved: Boolean,
        approvedDate: Date,
        feedback: String
    }],

    // Communication
    messages: [{
        senderId: require('mongoose').Schema.Types.ObjectId,
        message: String,
        attachments: [String],
        timestamp: Date
    }],

    // Revisions
    revisionCount: { type: Number, default: 0 },
    maxRevisions: { type: Number, default: 3 },

    // Feedback
    buyerReview: {
        rating: Number,
        comment: String,
        createdAt: Date
    },
    providerReview: {
        rating: Number,
        comment: String,
        createdAt: Date
    },

    // Payment
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: String,
    transactionId: String,

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, { collection: 'marketplace_orders' });

module.exports = { serviceListingSchema, marketplaceOrderSchema };

/**
 * Marketplace Service Class
 */
class MarketplaceService {
    /**
     * Create service listing
     */
    static async createServiceListing(providerId, listingData) {
        try {
            const ServiceListing = require('../models/ServiceListing');

            const listing = await ServiceListing.create({
                providerId,
                title: listingData.title,
                description: listingData.description,
                category: listingData.category,
                pricing: listingData.pricing,
                deliverables: listingData.deliverables,
                status: 'draft'
            });

            recordEvent('service_listing_created', { providerId, listingId: listing._id });
            return listing;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get service listing
     */
    static async getServiceListing(listingId) {
        try {
            const ServiceListing = require('../models/ServiceListing');
            return await ServiceListing.findById(listingId)
                .populate('providerId', 'name avatar')
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Search services
     */
    static async searchServices(query = {}) {
        try {
            const ServiceListing = require('../models/ServiceListing');

            const {
                category = '',
                minPrice = 0,
                maxPrice = 10000,
                searchTerm = '',
                level = '',
                rating = 0,
                limit = 20,
                skip = 0
            } = query;

            const filter = {
                status: 'active'
            };

            if (category) filter.category = category;
            if (level) filter.level = level;
            if (rating > 0) filter['rating.average'] = { $gte: rating };

            filter['pricing.amount'] = { $gte: minPrice, $lte: maxPrice };

            if (searchTerm) {
                filter.$or = [
                    { title: { $regex: searchTerm, $options: 'i' } },
                    { description: { $regex: searchTerm, $options: 'i' } },
                    { tags: { $in: [searchTerm] } }
                ];
            }

            const listings = await ServiceListing
                .find(filter)
                .sort({ 'rating.average': -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('providerId', 'name avatar')
                .lean();

            const total = await ServiceListing.countDocuments(filter);

            return { listings, total };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Place order
     */
    static async placeOrder(buyerId, serviceId, orderData) {
        try {
            const ServiceListing = require('../models/ServiceListing');
            const MarketplaceOrder = require('../models/MarketplaceOrder');

            const service = await ServiceListing.findById(serviceId);
            if (!service) throw new Error('Hizmet bulunamadı');

            const order = await MarketplaceOrder.create({
                serviceId,
                buyerId,
                providerId: service.providerId,
                title: service.title,
                price: service.pricing.amount,
                requirements: orderData.requirements,
                status: 'pending'
            });

            recordEvent('marketplace_order_placed', { buyerId, serviceId, orderId: order._id });
            return order;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get orders
     */
    static async getOrders(userId, role = 'buyer', limit = 20, skip = 0) {
        try {
            const MarketplaceOrder = require('../models/MarketplaceOrder');

            const filter = role === 'buyer' ? { buyerId: userId } : { providerId: userId };

            const orders = await MarketplaceOrder
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('serviceId')
                .populate('buyerId', 'name avatar')
                .populate('providerId', 'name avatar')
                .lean();

            const total = await MarketplaceOrder.countDocuments(filter);

            return { orders, total };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Submit deliverable
     */
    static async submitDeliverable(orderId, providerId, deliverableData) {
        try {
            const MarketplaceOrder = require('../models/MarketplaceOrder');

            const deliverable = {
                title: deliverableData.title,
                description: deliverableData.description,
                files: deliverableData.files,
                submittedDate: new Date()
            };

            await MarketplaceOrder.updateOne(
                { _id: orderId, providerId },
                {
                    $push: { deliverables: deliverable },
                    status: 'revision'
                }
            );

            recordEvent('deliverable_submitted', { orderId, providerId });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Approve deliverable
     */
    static async approveDeliverable(orderId, buyerId, deliverableIndex) {
        try {
            const MarketplaceOrder = require('../models/MarketplaceOrder');

            await MarketplaceOrder.updateOne(
                { _id: orderId, buyerId },
                {
                    'deliverables.$[elem].approved': true,
                    'deliverables.$[elem].approvedDate': new Date()
                },
                { arrayFilters: [{ 'elem._id': { $elemMatch: {} } }] }
            );

            recordEvent('deliverable_approved', { orderId, buyerId });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Leave review
     */
    static async leaveReview(orderId, userId, rating, comment, isProvider = false) {
        try {
            const MarketplaceOrder = require('../models/MarketplaceOrder');

            const updateField = isProvider
                ? { 'providerReview.rating': rating, 'providerReview.comment': comment, 'providerReview.createdAt': new Date() }
                : { 'buyerReview.rating': rating, 'buyerReview.comment': comment, 'buyerReview.createdAt': new Date() };

            await MarketplaceOrder.updateOne({ _id: orderId }, updateField);

            recordEvent('marketplace_review_submitted', { orderId, userId, rating });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Complete order
     */
    static async completeOrder(orderId, providerId) {
        try {
            const MarketplaceOrder = require('../models/MarketplaceOrder');
            const ServiceListing = require('../models/ServiceListing');

            await MarketplaceOrder.updateOne(
                { _id: orderId, providerId },
                {
                    status: 'completed',
                    completionDate: new Date()
                }
            );

            // Update service listing stats
            const order = await MarketplaceOrder.findById(orderId);
            await ServiceListing.updateOne(
                { _id: order.serviceId },
                { $inc: { ordersCompleted: 1 } }
            );

            recordEvent('marketplace_order_completed', { orderId, providerId });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get marketplace stats
     */
    static async getMarketplaceStats() {
        try {
            const ServiceListing = require('../models/ServiceListing');
            const MarketplaceOrder = require('../models/MarketplaceOrder');

            const activeListings = await ServiceListing.countDocuments({ status: 'active' });
            const totalOrders = await MarketplaceOrder.countDocuments({});
            const completedOrders = await MarketplaceOrder.countDocuments({ status: 'completed' });

            const topServices = await ServiceListing
                .find()
                .sort({ ordersCompleted: -1 })
                .limit(5)
                .lean();

            return {
                activeListings,
                totalOrders,
                completedOrders,
                completionRate: Math.round((completedOrders / totalOrders) * 100),
                topServices
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get provider earnings
     */
    static async getProviderEarnings(providerId) {
        try {
            const MarketplaceOrder = require('../models/MarketplaceOrder');

            const completedOrders = await MarketplaceOrder
                .find({ providerId, status: 'completed' })
                .lean();

            const totalEarnings = completedOrders.reduce((sum, order) => sum + order.price, 0);

            return {
                totalEarnings,
                completedOrders: completedOrders.length,
                averageOrderValue: completedOrders.length > 0 
                    ? totalEarnings / completedOrders.length 
                    : 0
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

/**
 * Routes
 */

// GET /api/marketplace/search
router.get('/search', async (req, res) => {
    try {
        const result = await MarketplaceService.searchServices(req.query);
        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/marketplace/service
router.post('/service', async (req, res) => {
    try {
        const listing = await MarketplaceService.createServiceListing(
            req.user._id,
            req.body
        );
        res.json(listing);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/marketplace/stats
router.get('/stats', async (req, res) => {
    try {
        const stats = await MarketplaceService.getMarketplaceStats();
        res.json(stats);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    MarketplaceService,
    serviceListingSchema,
    marketplaceOrderSchema
};
