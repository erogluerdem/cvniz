const express = require('express');
const router = express.Router();
const aiService = require('../services/AIService');
const { authenticate } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting for AI endpoints
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 requests per windowMs
    message: { error: 'Saatlik AI kullanım limitiniz doldu.' }
});

router.use(authenticate);
router.use(aiLimiter);

// @desc    Generate CV Summary
// @route   POST /api/ai/generate-summary
// @access  Private
router.post('/generate-summary', async (req, res) => {
    try {
        const { jobTitle, experienceLevel, lang } = req.body;

        if (!jobTitle) {
            return res.status(400).json({ error: 'İş unvanı gereklidir.' });
        }

        const result = await aiService.generateSummary(jobTitle, experienceLevel || 'Mid-Level', lang);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('AI Route Error:', error);
        res.status(500).json({ error: 'AI servisi yanıt vermedi.' });
    }
});

// @desc    Generate Cover Letter
// @route   POST /api/ai/generate-cover-letter
// @access  Private
router.post('/generate-cover-letter', async (req, res) => {
    try {
        const { jobTitle, company, tone, cvData, lang } = req.body;

        if (!jobTitle) {
            return res.status(400).json({ error: 'İş unvanı gereklidir.' });
        }

        const result = await aiService.generateCoverLetter({ jobTitle, company, tone, cvData, lang });
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('AI Cover Letter Error:', error);
        res.status(500).json({ error: 'Ön yazı oluşturulamadı.' });
    }
});

// @desc    Improve Text
// @route   POST /api/ai/improve-text
// @access  Private
router.post('/improve-text', async (req, res) => {
    try {
        const { text, lang, mode } = req.body;

        if (!text || text.length < 10) {
            return res.status(400).json({ error: 'Lütfen en az 10 karakterlik metin girin.' });
        }

        const result = await aiService.improveText(text, lang, mode);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('AI Route Error:', error);
        res.status(500).json({ error: 'AI servisi yanıt vermedi.' });
    }
});

// @desc    Generate Experience Points
// @route   POST /api/ai/generate-experience
// @access  Private
router.post('/generate-experience', async (req, res) => {
    try {
        const { jobTitle, lang } = req.body;

        if (!jobTitle) {
            return res.status(400).json({ error: 'İş unvanı gereklidir.' });
        }

        const result = await aiService.generateExperience(jobTitle, lang);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('AI Route Error:', error);
        res.status(500).json({ error: 'AI servisi yanıt vermedi.' });
    }
});

// ============================================
// PHASE 2: NEW AI ENDPOINTS
// ============================================

// @desc    Generate Interview Preparation
// @route   POST /api/ai/interview-prep
// @access  Private
router.post('/interview-prep', async (req, res) => {
    try {
        const { jobTitle, experience, lang } = req.body;

        if (!jobTitle) {
            return res.status(400).json({ error: 'İş unvanı gereklidir.' });
        }

        const result = await aiService.generateInterviewPrep(jobTitle, experience, lang);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Interview Prep Error:', error);
        res.status(500).json({ error: 'Mülakat hazırlanması başarısız oldu.' });
    }
});

// @desc    Analyze Skill Gap
// @route   POST /api/ai/skill-gap
// @access  Private
router.post('/skill-gap', async (req, res) => {
    try {
        const { currentSkills, targetJobTitle, lang } = req.body;

        if (!targetJobTitle || !currentSkills) {
            return res.status(400).json({ error: 'Gerekli bilgiler eksik.' });
        }

        const result = await aiService.analyzeSkillGap(currentSkills, targetJobTitle, lang);

        // Log AI usage
        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            'skill_gap_analysis',
            { targetJobTitle }
        );

        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Skill Gap Error:', error);
        res.status(500).json({ error: 'Yetenek analizi başarısız oldu.' });
    }
});

// @desc    Analyze CV Score
// @route   POST /api/ai/cv-score
// @access  Private
router.post('/cv-score', async (req, res) => {
    try {
        const { cvData, lang } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verileri gereklidir.' });
        }

        const result = await aiService.analyzeCVScore(cvData, lang);

        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            'cv_analysis',
            {}
        );

        res.json({ success: true, ...result });
    } catch (error) {
        console.error('CV Score Error:', error);
        res.status(500).json({ error: 'CV analizi başarısız oldu.' });
    }
});

// @desc    Get Formatting Tips
// @route   GET /api/ai/formatting-tips
// @access  Private
router.get('/formatting-tips', async (req, res) => {
    try {
        const lang = req.query.lang || 'tr';
        const result = await aiService.getFormattingTips(lang);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Formatting Tips Error:', error);
        res.status(500).json({ error: 'Formatı tavsiyeler alınamadı.' });
    }
});

// @desc    Generate Project Description
// @route   POST /api/ai/project
// @access  Private
router.post('/project', async (req, res) => {
    try {
        const { input, type, outputType, lang } = req.body;
        
        const result = await aiService.generateProject({ input, type, outputType, lang });

        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            'project_generation',
            { project_type: type, output_type: outputType }
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Project Generation Error:', error);
        res.status(500).json({ error: 'Proje üretimi başarısız oldu.' });
    }
});

// @desc    Optimize LinkedIn Profile
// @route   POST /api/ai/optimize-linkedin
// @access  Private
router.post('/optimize-linkedin', async (req, res) => {
    try {
        const { cvData, lang } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verileri gereklidir.' });
        }

        const result = await aiService.optimizeLinkedIn({ cvData, lang });

        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            'linkedin_optimization',
            { lang }
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('LinkedIn Optimization Error:', error);
        res.status(500).json({ error: 'LinkedIn optimizasyonu başarısız oldu.' });
    }
});

// @desc    Generate Email
// @route   POST /api/ai/generate-email
// @access  Private
router.post('/generate-email', async (req, res) => {
    try {
        const { type, tone, input, cvData, lang } = req.body;

        const result = await aiService.generateEmail({ type, tone, input, cvData, lang });

        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            'email_generation',
            { email_type: type, tone }
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Email Generation Error:', error);
        res.status(500).json({ error: 'E-posta üretimi başarısız oldu.' });
    }
});

// @desc    Write Reference Letter
// @route   POST /api/ai/write-reference
// @access  Private
router.post('/write-reference', async (req, res) => {
    try {
        const { referenceType, tone, input, cvData, lang } = req.body;

        const result = await aiService.writeReferenceLetter({ referenceType, tone, input, cvData, lang });

        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            'reference_letter_generation',
            { reference_type: referenceType, tone }
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Reference Letter Generation Error:', error);
        res.status(500).json({ error: 'Referans mektubu üretimi başarısız oldu.' });
    }
});

// @desc    Generate Cover Letter
// @route   POST /api/ai/generate-cover-letter
// @access  Private
router.post('/generate-cover-letter', async (req, res) => {
    try {
        const { style, jobData, targetPosition, cvData, lang } = req.body;

        const result = await aiService.generateCoverLetter({ style, jobData, targetPosition, cvData, lang });

        await require('../services/EnhancedAnalyticsService').trackAIUsage(
            req.user.id,
            'cover_letter_generation',
            { style }
        );

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Cover Letter Generation Error:', error);
        res.status(500).json({ error: 'Niyet mektubu üretimi başarısız oldu.' });
    }
});

module.exports = router;
