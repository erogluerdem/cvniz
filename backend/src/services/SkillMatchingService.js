/**
 * Skill Matching Service
 * AI-powered skill gap analysis and job matching
 */

const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');
const axios = require('axios');
const { recordEvent } = require('../utils/logger');
const { ChatbotService } = require('./ChatbotService');

/**
 * Skill Assessment Schema
 */
const skillAssessmentSchema = new (require('mongoose')).Schema({
    userId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    // Current skills assessment
    currentSkills: [{
        name: String,
        level: { type: Number, min: 1, max: 10 },
        yearsOfExperience: Number,
        proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
        verified: Boolean,
        endorsements: { type: Number, default: 0 }
    }],

    // Desired skills
    targetSkills: [{
        name: String,
        importance: { type: String, enum: ['nice_to_have', 'important', 'critical'] },
        targetLevel: { type: Number, min: 1, max: 10 },
        priority: Number
    }],

    // Skill gap analysis
    skillGap: [{
        skillName: String,
        currentLevel: Number,
        targetLevel: Number,
        gap: Number,
        estimatedTimeToAcquire: String,
        learningResources: [{
            type: String,
            title: String,
            platform: String,
            duration: String,
            difficulty: String,
            rating: Number
        }],
        importance: String
    }],

    // Job matching
    jobMatches: [{
        jobId: String,
        title: String,
        company: String,
        matchScore: { type: Number, min: 0, max: 100 },
        requiredSkills: [{
            name: String,
            level: Number,
            matched: Boolean,
            gap: Number
        }],
        missingSkills: [String],
        estimatedTimeToQualify: String
    }],

    // Learning recommendations
    recommendations: [{
        skillName: String,
        priority: String,
        courses: [{
            title: String,
            provider: String,
            duration: String,
            cost: Number,
            rating: Number
        }],
        roadmap: [String]
    }],

    // Assessment metadata
    assessmentDate: Date,
    nextReviewDate: Date,
    completionPercentage: Number,

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, { collection: 'skill_assessments' });

module.exports = skillAssessmentSchema;

/**
 * Skill Matching Service Class
 */
class SkillMatchingService {
    /**
     * Create skill assessment
     */
    static async createSkillAssessment(userId, currentSkills = [], targetSkills = []) {
        try {
            const SkillAssessment = require('../models/SkillAssessment');

            const assessment = await SkillAssessment.create({
                userId,
                currentSkills,
                targetSkills,
                assessmentDate: new Date(),
                nextReviewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            });

            recordEvent('skill_assessment_created', { userId });
            return assessment;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Analyze skill gap
     */
    static async analyzeSkillGap(userId) {
        try {
            const SkillAssessment = require('../models/SkillAssessment');

            const assessment = await SkillAssessment.findOne({ userId });
            if (!assessment) {throw new Error('Yeterlik değerlendirmesi bulunamadı');}

            const skillGap = [];

            assessment.targetSkills.forEach(target => {
                const current = assessment.currentSkills.find(
                    s => s.name.toLowerCase() === target.name.toLowerCase()
                );

                const currentLevel = current?.level || 0;
                const gap = Math.max(0, target.targetLevel - currentLevel);

                if (gap > 0) {
                    skillGap.push({
                        skillName: target.name,
                        currentLevel,
                        targetLevel: target.targetLevel,
                        gap,
                        estimatedTimeToAcquire: SkillMatchingService.estimateTimeToAcquire(gap),
                        learningResources: SkillMatchingService.getRecommendedResources(target.name, gap),
                        importance: target.importance
                    });
                }
            });

            // Sort by importance and gap
            skillGap.sort((a, b) => {
                const importanceOrder = { 'critical': 0, 'important': 1, 'nice_to_have': 2 };
                if (importanceOrder[a.importance] !== importanceOrder[b.importance]) {
                    return importanceOrder[a.importance] - importanceOrder[b.importance];
                }
                return b.gap - a.gap;
            });

            await SkillAssessment.updateOne(
                { userId },
                { skillGap }
            );

            recordEvent('skill_gap_analyzed', { userId, gapCount: skillGap.length });
            return skillGap;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Match jobs based on skills
     */
    static async matchJobsToSkills(userId, limit = 10) {
        try {
            const SkillAssessment = require('../models/SkillAssessment');
            const Job = require('../models/Job');

            const assessment = await SkillAssessment.findOne({ userId }).lean();
            if (!assessment) {throw new Error('Yeterlik değerlendirmesi bulunamadı');}

            // Get available jobs
            const jobs = await Job.find({ status: 'active' })
                .limit(50)
                .lean();

            const jobMatches = jobs.map(job => {
                const matchScore = SkillMatchingService.calculateMatchScore(
                    assessment.currentSkills,
                    job.requiredSkills || []
                );

                const requiredSkills = (job.requiredSkills || []).map(req => {
                    const userSkill = assessment.currentSkills.find(
                        s => s.name.toLowerCase() === req.name.toLowerCase()
                    );

                    return {
                        name: req.name,
                        level: req.level || 5,
                        matched: !!userSkill && userSkill.level >= (req.level || 5),
                        gap: userSkill ? Math.max(0, (req.level || 5) - userSkill.level) : (req.level || 5)
                    };
                });

                const missingSkills = requiredSkills
                    .filter(s => !s.matched)
                    .map(s => s.name);

                return {
                    jobId: job._id.toString(),
                    title: job.title,
                    company: job.company,
                    matchScore,
                    requiredSkills,
                    missingSkills,
                    estimatedTimeToQualify: SkillMatchingService.estimateTimeToQualify(
                        requiredSkills,
                        missingSkills
                    )
                };
            })
                .filter(match => match.matchScore > 0)
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit);

            await SkillAssessment.updateOne(
                { userId },
                { jobMatches }
            );

            recordEvent('jobs_matched', { userId, matchCount: jobMatches.length });
            return jobMatches;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Generate learning recommendations
     */
    static async generateRecommendations(userId) {
        try {
            const SkillAssessment = require('../models/SkillAssessment');

            const assessment = await SkillAssessment.findOne({ userId });
            if (!assessment) {throw new Error('Yeterlik değerlendirmesi bulunamadı');}

            const recommendations = [];

            assessment.skillGap.slice(0, 5).forEach(gap => {
                const courses = SkillMatchingService.getCourseRecommendations(
                    gap.skillName,
                    gap.targetLevel
                );

                const roadmap = SkillMatchingService.buildLearningRoadmap(gap.skillName);

                recommendations.push({
                    skillName: gap.skillName,
                    priority: gap.importance,
                    courses,
                    roadmap
                });
            });

            await SkillAssessment.updateOne(
                { userId },
                { recommendations }
            );

            recordEvent('recommendations_generated', { userId });
            return recommendations;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Calculate match score (0-100)
     */
    static calculateMatchScore(userSkills, requiredSkills) {
        if (!requiredSkills || requiredSkills.length === 0) {return 100;}

        let matchedCount = 0;

        requiredSkills.forEach(req => {
            const userSkill = userSkills.find(
                s => s.name.toLowerCase() === req.name.toLowerCase()
            );

            if (userSkill && userSkill.level >= (req.level || 5)) {
                matchedCount++;
            }
        });

        return Math.round((matchedCount / requiredSkills.length) * 100);
    }

    /**
     * Estimate time to acquire skill
     */
    static estimateTimeToAcquire(gap) {
        if (gap <= 2) {return '1-2 weeks';}
        if (gap <= 4) {return '1-2 months';}
        if (gap <= 6) {return '3-6 months';}
        if (gap <= 8) {return '6-12 months';}
        return '1+ year';
    }

    /**
     * Estimate time to qualify for job
     */
    static estimateTimeToQualify(requiredSkills, missingSkills) {
        if (missingSkills.length === 0) {return 'Ready now';}

        let maxTime = 0;
        missingSkills.forEach(missing => {
            const skill = requiredSkills.find(s => s.name === missing);
            const gap = skill?.gap || 5;

            const months = Math.ceil(gap * 2);
            maxTime = Math.max(maxTime, months);
        });

        if (maxTime <= 1) {return '1 week';}
        if (maxTime <= 4) {return `${maxTime} weeks`;}
        if (maxTime <= 12) {return `${Math.ceil(maxTime / 4)} months`;}
        return `${Math.ceil(maxTime / 12)}+ year`;
    }

    /**
     * Get recommended learning resources
     */
    static getRecommendedResources(skillName, gap) {
        const resources = [
            {
                type: 'online_course',
                title: `${skillName} Masterclass`,
                platform: 'Udemy',
                duration: '20-30 hours',
                difficulty: 'intermediate',
                rating: 4.5
            },
            {
                type: 'book',
                title: `The Complete ${skillName} Guide`,
                platform: 'Amazon',
                duration: '300+ pages',
                difficulty: 'intermediate',
                rating: 4.3
            },
            {
                type: 'tutorial',
                title: `${skillName} for Beginners`,
                platform: 'YouTube',
                duration: '10 hours',
                difficulty: 'beginner',
                rating: 4.2
            }
        ];

        return resources;
    }

    /**
     * Get course recommendations
     */
    static getCourseRecommendations(skillName, targetLevel) {
        return [
            {
                title: `${skillName} Level 1-3`,
                provider: 'Coursera',
                duration: '4 weeks',
                cost: 49,
                rating: 4.6
            },
            {
                title: `${skillName} Advanced`,
                provider: 'edX',
                duration: '6 weeks',
                cost: 99,
                rating: 4.5
            },
            {
                title: `${skillName} Professional Certification`,
                provider: 'LinkedIn Learning',
                duration: '3 weeks',
                cost: 30,
                rating: 4.4
            }
        ];
    }

    /**
     * Build learning roadmap
     */
    static buildLearningRoadmap(skillName) {
        return [
            `Week 1-2: ${skillName} Fundamentals`,
            'Week 3-4: Core Concepts & Theory',
            'Week 5-8: Practical Projects',
            'Week 9-12: Advanced Techniques',
            'Week 13+: Specialization & Mastery'
        ];
    }

    /**
     * Get skill assessment
     */
    static async getSkillAssessment(userId) {
        try {
            const SkillAssessment = require('../models/SkillAssessment');
            return await SkillAssessment.findOne({ userId }).lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Update skill level
     */
    static async updateSkillLevel(userId, skillName, newLevel) {
        try {
            const SkillAssessment = require('../models/SkillAssessment');

            await SkillAssessment.updateOne(
                { userId, 'currentSkills.name': skillName },
                { 'currentSkills.$.level': newLevel }
            );

            recordEvent('skill_updated', { userId, skillName, newLevel });
            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

/**
 * Routes
 */

// POST /api/skill-matching/assessment
router.post('/assessment', async (req, res) => {
    try {
        const assessment = await SkillMatchingService.createSkillAssessment(
            req.user._id,
            req.body.currentSkills,
            req.body.targetSkills
        );
        res.json(assessment);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/skill-matching/gap
router.get('/gap', async (req, res) => {
    try {
        const gap = await SkillMatchingService.analyzeSkillGap(req.user._id);
        res.json(gap);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/skill-matching/job-matches
router.get('/job-matches', async (req, res) => {
    try {
        const matches = await SkillMatchingService.matchJobsToSkills(
            req.user._id,
            parseInt(req.query.limit) || 10
        );
        res.json(matches);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/skill-matching/recommendations
router.get('/recommendations', async (req, res) => {
    try {
        const recommendations = await SkillMatchingService.generateRecommendations(
            req.user._id
        );
        res.json(recommendations);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    SkillMatchingService,
    skillAssessmentSchema
};
