/**
 * Freelancer Service
 * Freelancer marketplace and project management
 */

const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');

/**
 * Freelancer Profile Schema
 */
const freelancerProfileSchema = new (require('mongoose')).Schema({
    userId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    title: String,
    bio: String,
    avatar: String,
    hourlyRate: Number,
    portfolio: [{
        title: String,
        description: String,
        image: String,
        link: String,
        completedDate: Date
    }],
    skills: [{
        name: String,
        proficiency: { type: String, enum: ['beginner', 'intermediate', 'expert'] },
        endorsements: { type: Number, default: 0 },
        verified: Boolean
    }],
    experience: [{
        title: String,
        company: String,
        duration: String,
        description: String
    }],
    certificates: [{
        name: String,
        issuer: String,
        issuedDate: Date,
        expiryDate: Date,
        credentialId: String
    }],

    // Rating & Reviews
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 },
        recentReviews: [{
            clientId: require('mongoose').Schema.Types.ObjectId,
            rating: Number,
            comment: String,
            projectId: require('mongoose').Schema.Types.ObjectId,
            createdAt: Date
        }]
    },

    // Verification
    verified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verificationDocuments: [String],

    // Stats
    stats: {
        projectsCompleted: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 },
        clientsWorkedWith: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        responseTime: String // Average response time
    },

    // Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'banned'],
        default: 'active'
    },
    lastActive: Date,
    availability: {
        type: String,
        enum: ['not_available', 'available', 'partially_available', 'limited'],
        default: 'available'
    },

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, { collection: 'freelancer_profiles' });

/**
 * Project Schema
 */
const projectSchema = new (require('mongoose')).Schema({
    clientId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    freelancerId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },

    title: String,
    description: String,
    category: String,
    skills: [String],

    budget: {
        type: {
            type: String,
            enum: ['fixed', 'hourly'],
            default: 'fixed'
        },
        amount: Number,
        currency: { type: String, default: 'USD' }
    },

    timeline: {
        deadline: Date,
        estimatedDuration: String, // '1-2 weeks', '1 month' vb.
        startDate: Date,
        completionDate: Date
    },

    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'disputed', 'closed'],
        default: 'open'
    },

    proposals: [{
        freelancerId: require('mongoose').Schema.Types.ObjectId,
        bidAmount: Number,
        estimatedDuration: String,
        coverLetter: String,
        attachments: [String],
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        createdAt: Date
    }],

    attachments: [String],

    milestones: [{
        title: String,
        description: String,
        amount: Number,
        dueDate: Date,
        status: { type: String, enum: ['pending', 'completed', 'approved'], default: 'pending' },
        submittedDate: Date
    }],

    messages: [{
        senderId: require('mongoose').Schema.Types.ObjectId,
        message: String,
        attachments: [String],
        timestamp: Date
    }],

    feedback: {
        clientRating: Number,
        clientComment: String,
        freelancerRating: Number,
        freelancerComment: String
    },

    disputes: [{
        openedBy: require('mongoose').Schema.Types.ObjectId,
        reason: String,
        status: String,
        resolution: String,
        createdAt: Date
    }],

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, { collection: 'projects' });

module.exports = { freelancerProfileSchema, projectSchema };

/**
 * Freelancer Service Class
 */
class FreelancerService {
    /**
     * Create freelancer profile
     */
    static async createFreelancerProfile(userId, profileData) {
        try {
            const FreelancerProfile = require('../models/FreelancerProfile');

            const profile = await FreelancerProfile.create({
                userId,
                title: profileData.title,
                bio: profileData.bio,
                hourlyRate: profileData.hourlyRate,
                skills: profileData.skills || [],
                status: 'active'
            });

            recordEvent('freelancer_profile_created', { userId });
            return profile;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get freelancer profile
     */
    static async getFreelancerProfile(freelancerId) {
        try {
            const FreelancerProfile = require('../models/FreelancerProfile');
            return await FreelancerProfile.findOne({ userId: freelancerId })
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Search freelancers
     */
    static async searchFreelancers(query = {}) {
        try {
            const FreelancerProfile = require('../models/FreelancerProfile');

            const {
                skills = [],
                minRating = 0,
                maxHourlyRate = 1000,
                availability = 'available',
                limit = 20,
                skip = 0
            } = query;

            const filter = {
                status: 'active',
                verificationStatus: 'verified'
            };

            if (skills.length > 0) {
                filter['skills.name'] = { $in: skills };
            }

            if (minRating > 0) {
                filter['rating.average'] = { $gte: minRating };
            }

            filter['hourlyRate'] = { $lte: maxHourlyRate };
            filter['availability'] = availability;

            const freelancers = await FreelancerProfile
                .find(filter)
                .sort({ 'rating.average': -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const total = await FreelancerProfile.countDocuments(filter);

            return { freelancers, total };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Post project
     */
    static async postProject(clientId, projectData) {
        try {
            const Project = require('../models/Project');

            const project = await Project.create({
                clientId,
                title: projectData.title,
                description: projectData.description,
                category: projectData.category,
                skills: projectData.skills,
                budget: projectData.budget,
                timeline: projectData.timeline,
                status: 'open'
            });

            recordEvent('project_posted', { clientId, projectId: project._id });
            return project;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get projects
     */
    static async getProjects(filter = {}, limit = 20, skip = 0) {
        try {
            const Project = require('../models/Project');

            const projects = await Project
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('clientId', 'name avatar')
                .populate('freelancerId', 'name avatar')
                .lean();

            const total = await Project.countDocuments(filter);

            return { projects, total };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Submit proposal
     */
    static async submitProposal(freelancerId, projectId, proposalData) {
        try {
            const Project = require('../models/Project');

            const project = await Project.findById(projectId);
            if (!project) {throw new Error('Proje bulunamadı');}

            const proposal = {
                freelancerId,
                bidAmount: proposalData.bidAmount,
                estimatedDuration: proposalData.estimatedDuration,
                coverLetter: proposalData.coverLetter,
                status: 'pending',
                createdAt: new Date()
            };

            await Project.updateOne(
                { _id: projectId },
                { $push: { proposals: proposal } }
            );

            recordEvent('proposal_submitted', { freelancerId, projectId });
            return proposal;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Accept proposal
     */
    static async acceptProposal(clientId, projectId, freelancerId) {
        try {
            const Project = require('../models/Project');

            const project = await Project.findOne({ _id: projectId, clientId });
            if (!project) {throw new Error('Proje bulunamadı');}

            const proposal = project.proposals.find(p => p.freelancerId.toString() === freelancerId);
            if (!proposal) {throw new Error('Teklif bulunamadı');}

            await Project.updateOne(
                { _id: projectId },
                {
                    freelancerId,
                    status: 'in_progress',
                    'proposals.$[elem].status': 'accepted',
                    'timeline.startDate': new Date()
                },
                { arrayFilters: [{ 'elem._id': proposal._id }] }
            );

            recordEvent('proposal_accepted', { clientId, freelancerId, projectId });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Submit milestone
     */
    static async submitMilestone(freelancerId, projectId, milestoneIndex, submission) {
        try {
            const Project = require('../models/Project');

            await Project.updateOne(
                { _id: projectId, freelancerId },
                {
                    'milestones.$[elem].submittedDate': new Date(),
                    'milestones.$[elem].status': 'completed'
                },
                { arrayFilters: [{ 'elem': { $eq: projectId.milestones[milestoneIndex] } }] }
            );

            recordEvent('milestone_submitted', { freelancerId, projectId, milestoneIndex });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Leave review
     */
    static async leaveReview(reviewerId, projectId, rating, comment, isFreelancerReview = false) {
        try {
            const Project = require('../models/Project');

            const updateField = isFreelancerReview
                ? { 'feedback.freelancerRating': rating, 'feedback.freelancerComment': comment }
                : { 'feedback.clientRating': rating, 'feedback.clientComment': comment };

            await Project.updateOne({ _id: projectId }, updateField);

            recordEvent('review_submitted', { reviewerId, projectId, rating });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Update freelancer rating
     */
    static async updateFreelancerRating(freelancerId, projectId) {
        try {
            const FreelancerProfile = require('../models/FreelancerProfile');
            const Project = require('../models/Project');

            const project = await Project.findOne({ _id: projectId }).lean();
            if (!project?.feedback?.clientRating) {return;}

            const freelancerProjects = await Project.find({
                freelancerId,
                'feedback.clientRating': { $exists: true }
            }).lean();

            const ratings = freelancerProjects
                .map(p => p.feedback.clientRating)
                .filter(r => r);

            const averageRating = ratings.length > 0
                ? ratings.reduce((a, b) => a + b) / ratings.length
                : 0;

            await FreelancerProfile.updateOne(
                { userId: freelancerId },
                {
                    'rating.average': averageRating,
                    'rating.totalReviews': ratings.length
                }
            );

            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
        }
    }

    /**
     * Complete project
     */
    static async completeProject(clientId, projectId) {
        try {
            const Project = require('../models/Project');

            await Project.updateOne(
                { _id: projectId, clientId },
                {
                    status: 'completed',
                    'timeline.completionDate': new Date()
                }
            );

            recordEvent('project_completed', { clientId, projectId });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get freelancer earnings
     */
    static async getFreelancerEarnings(freelancerId) {
        try {
            const Project = require('../models/Project');

            const projects = await Project.find({
                freelancerId,
                status: 'completed'
            }).lean();

            const totalEarnings = projects.reduce((sum, p) => sum + (p.budget?.amount || 0), 0);
            const completedProjects = projects.length;

            return {
                totalEarnings,
                completedProjects,
                averageProjectValue: completedProjects > 0 ? totalEarnings / completedProjects : 0
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

// GET /api/freelancer/search
router.get('/search', async (req, res) => {
    try {
        const result = await FreelancerService.searchFreelancers(req.query);
        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/freelancer/profile
router.post('/profile', async (req, res) => {
    try {
        const profile = await FreelancerService.createFreelancerProfile(
            req.user._id,
            req.body
        );
        res.json(profile);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/freelancer/profile/:freelancerId
router.get('/profile/:freelancerId', async (req, res) => {
    try {
        const profile = await FreelancerService.getFreelancerProfile(
            req.params.freelancerId
        );
        res.json(profile);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    FreelancerService,
    freelancerProfileSchema,
    projectSchema
};
