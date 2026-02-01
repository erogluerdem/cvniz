const express = require('express');
const router = express.Router();
const recommendationService = require('../services/RecommendationService');
const { authenticate } = require('../middleware/auth');
const { body, query, validationResult } = require('express-validator');

// Middleware
router.use(authenticate);

/**
 * @desc    Get personalized job recommendations for user
 * @route   GET /api/recommendations/jobs
 * @access  Private
 * @query   limit (default: 10), experienceLevel, location, locationType, jobType, minSalary
 */
router.get('/jobs', async (req, res) => {
    try {
        const { limit = 10, experienceLevel, location, locationType, jobType, minSalary } = req.query;

        const filters = {
            experienceLevel,
            location,
            locationType,
            jobType,
            minSalary: minSalary ? parseInt(minSalary) : null
        };

        // Remove null filters
        Object.keys(filters).forEach(key =>
            filters[key] === null && delete filters[key]
        );

        const recommendations = await recommendationService.getRecommendations(
            req.user.id,
            Math.min(parseInt(limit), 50),
            filters
        );

        res.json({
            success: true,
            ...recommendations
        });
    } catch (error) {
        console.error('Recommendations Route Error:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

/**
 * @desc    Get trending jobs (popular, most applied)
 * @route   GET /api/recommendations/trending
 * @access  Public
 * @query   skills (comma-separated), limit (default: 10)
 */
router.get('/trending', async (req, res) => {
    try {
        const { skills, limit = 10 } = req.query;
        const skillArray = skills ? skills.split(',').map(s => s.trim()) : [];

        const trending = await recommendationService.getTrendingJobs(
            skillArray,
            Math.min(parseInt(limit), 50)
        );

        res.json({
            success: true,
            ...trending
        });
    } catch (error) {
        console.error('Trending Jobs Error:', error);
        res.status(500).json({ error: 'Failed to fetch trending jobs' });
    }
});

/**
 * @desc    Get salary prediction for a role
 * @route   GET /api/recommendations/salary
 * @access  Private
 * @query   jobTitle, experienceLevel, location
 */
router.get('/salary', [
    query('jobTitle').notEmpty().withMessage('Job title is required'),
    query('experienceLevel').notEmpty().withMessage('Experience level is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobTitle, experienceLevel, location = 'Turkey' } = req.query;

        const prediction = await recommendationService.getSalaryPrediction(
            jobTitle,
            experienceLevel,
            location
        );

        res.json({
            success: true,
            ...prediction
        });
    } catch (error) {
        console.error('Salary Prediction Error:', error);
        res.status(500).json({ error: 'Failed to predict salary' });
    }
});

/**
 * @desc    Get match score between user's CV and specific job
 * @route   POST /api/recommendations/match
 * @access  Private
 * @body    jobId
 */
router.post('/match', [
    body('jobId').notEmpty().withMessage('Job ID is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobId } = req.body;

        // Get job
        const Job = require('../models/Job');
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Get user's CV
        const CV = require('../models/CV');
        const userCV = await CV.findOne({ userId: req.user.id, isDefault: true });

        if (!userCV) {
            return res.status(400).json({ error: 'Complete your CV first' });
        }

        // Calculate match score
        const matchScore = await recommendationService.calculateMatchScore(
            userCV.toObject(),
            job.toObject()
        );

        const matchedSkills = recommendationService.getMatchedSkills(
            userCV.skills,
            job.skills
        );

        res.json({
            success: true,
            jobId: job._id,
            jobTitle: job.title,
            company: job.company,
            matchScore,
            matchPercentage: `${matchScore}%`,
            matchedSkills,
            reasonsForMatch: generateMatchReasons(userCV, job, matchScore),
            recommendation: matchScore >= 70 ? 'HIGHLY RECOMMENDED' : matchScore >= 50 ? 'RECOMMENDED' : 'WORTH CONSIDERING'
        });
    } catch (error) {
        console.error('Match Score Error:', error);
        res.status(500).json({ error: 'Failed to calculate match score' });
    }
});

/**
 * @desc    Record user interaction with job (view, apply, save, dismiss)
 * @route   POST /api/recommendations/interact
 * @access  Private
 * @body    jobId, type (view|apply|save|dismiss), duration (optional)
 */
router.post('/interact', [
    body('jobId').notEmpty().withMessage('Job ID is required'),
    body('type').isIn(['view', 'apply', 'save', 'dismiss', 'click']).withMessage('Invalid interaction type')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobId, type, duration } = req.body;

        await recommendationService.recordJobInteraction(
            req.user.id,
            jobId,
            type
        );

        // Track analytics
        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            `job_${type}`,
            { jobId }
        );

        res.json({
            success: true,
            message: `Job interaction recorded: ${type}`
        });
    } catch (error) {
        console.error('Interaction Error:', error);
        res.status(500).json({ error: 'Failed to record interaction' });
    }
});

/**
 * @desc    Get user's saved jobs
 * @route   GET /api/recommendations/saved
 * @access  Private
 */
router.get('/saved', async (req, res) => {
    try {
        const JobInteraction = require('../models/JobInteraction');
        const Job = require('../models/Job');

        // Get all saved job IDs
        const savedInteractions = await JobInteraction.find({
            userId: req.user.id,
            type: 'save'
        }).select('jobId');

        const jobIds = savedInteractions.map(i => i.jobId);

        // Get job details
        const jobs = await Job.find({ _id: { $in: jobIds } })
            .select('title company location salaryMin salaryMax experienceLevel locationType');

        res.json({
            success: true,
            total: jobs.length,
            jobs
        });
    } catch (error) {
        console.error('Saved Jobs Error:', error);
        res.status(500).json({ error: 'Failed to fetch saved jobs' });
    }
});

/**
 * Helper function to generate match reasons
 */
function generateMatchReasons(cv, job, matchScore) {
    const reasons = [];

    // Skills match
    const userSkills = (cv.skills || []).map(s => s.toLowerCase());
    const jobSkills = (job.skills || []).map(s => s.toLowerCase());
    const matchedCount = jobSkills.filter(js =>
        userSkills.some(us =>
            us.includes(js) || js.includes(us)
        )
    ).length;

    if (matchedCount > 0) {
        reasons.push(`${matchedCount} of ${jobSkills.length} required skills matched`);
    }

    // Experience level
    if (cv.experience?.length > 0) {
        const experience = cv.experience.length;
        reasons.push(`${experience} years of relevant experience`);
    }

    // Location
    if (job.locationType === 'remote') {
        reasons.push('Remote position - great flexibility');
    }

    if (matchScore >= 70) {
        reasons.push('Excellent fit based on your profile');
    }

    return reasons.slice(0, 3); // Return top 3 reasons
}

module.exports = router;
