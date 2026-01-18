const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const CV = require('../models/CV');
const axios = require('axios');
const cheerio = require('cheerio');

// Credit pricing
const TAILORING_CREDIT_COST = 1;
const CREDIT_PRICE = 49.90; // TL per credit

// Common job site parsers
const JOB_SITE_PARSERS = {
    'kariyer.net': parseKariyerNet,
    'linkedin.com': parseLinkedIn,
    'indeed.com': parseIndeed,
    'secretcv.com': parseSecretCV,
    'yenibiris.com': parseYeniBiris,
    'default': parseGeneric
};

// POST /api/target-fit/analyze - Analyze job listing (free preview)
router.post('/analyze', authenticate, async (req, res) => {
    try {
        const { jobUrl, jobText } = req.body;

        if (!jobUrl && !jobText) {
            return res.status(400).json({ error: 'İş ilanı linki veya metni gerekli' });
        }

        let jobData;
        if (jobUrl) {
            jobData = await parseJobListing(jobUrl);
        } else {
            jobData = parseJobText(jobText);
        }

        res.json({
            success: true,
            jobData,
            message: 'İlan analiz edildi. CV\'nizi düzenlemek için kredi kullanın.'
        });

    } catch (error) {
        console.error('Job analysis error:', error);
        res.status(500).json({ error: 'İlan analizi sırasında hata oluştu' });
    }
});

// POST /api/target-fit/tailor - Tailor CV to job listing (uses credit)
router.post('/tailor', authenticate, async (req, res) => {
    try {
        const { cvId, jobUrl, jobText, jobData } = req.body;

        if (!cvId) {
            return res.status(400).json({ error: 'CV ID gerekli' });
        }

        // Check user credits
        const user = await User.findById(req.user.id);
        const credits = user.credits?.targetFit || 0;

        if (credits < TAILORING_CREDIT_COST) {
            return res.status(403).json({
                error: 'Yeterli krediniz yok',
                creditsRequired: TAILORING_CREDIT_COST,
                creditsAvailable: credits,
                purchaseUrl: '/pricing?product=target-fit',
                pricePerCredit: CREDIT_PRICE
            });
        }

        // Get original CV
        const originalCV = await CV.findOne({ _id: cvId, userId: req.user.id });
        if (!originalCV) {
            return res.status(404).json({ error: 'CV bulunamadı' });
        }

        // Parse job listing if not already parsed
        let parsedJob = jobData;
        if (!parsedJob) {
            if (jobUrl) {
                parsedJob = await parseJobListing(jobUrl);
            } else if (jobText) {
                parsedJob = parseJobText(jobText);
            } else {
                return res.status(400).json({ error: 'İş ilanı bilgisi gerekli' });
            }
        }

        // Tailor the CV
        const tailoredData = tailorCVToJob(originalCV.data || originalCV, parsedJob);

        // Create new CV version
        const newCV = new CV({
            userId: req.user.id,
            name: `${originalCV.name} - ${parsedJob.company || 'İlana Özel'}`,
            template: originalCV.template,
            data: tailoredData,
            isPublic: false,
            metadata: {
                ...originalCV.metadata,
                tailoredFrom: originalCV._id,
                tailoredFor: parsedJob.title || 'İş İlanı',
                tailoredAt: new Date(),
                jobUrl: jobUrl || null
            }
        });

        await newCV.save();

        // Deduct credit
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'credits.targetFit': -TAILORING_CREDIT_COST }
        });

        res.json({
            success: true,
            tailoredCV: newCV,
            changes: tailoredData._changes,
            creditsRemaining: credits - TAILORING_CREDIT_COST
        });

    } catch (error) {
        console.error('CV tailoring error:', error);
        res.status(500).json({ error: 'CV düzenleme sırasında hata oluştu' });
    }
});

// GET /api/target-fit/credits - Get user's credit balance
router.get('/credits', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            credits: user.credits?.targetFit || 0,
            pricePerCredit: CREDIT_PRICE
        });
    } catch (error) {
        res.status(500).json({ error: 'Kredi bilgisi alınamadı' });
    }
});

// POST /api/target-fit/purchase - Purchase credits (webhook simulation)
router.post('/purchase', authenticate, async (req, res) => {
    try {
        const { creditCount } = req.body;
        const count = parseInt(creditCount) || 1;

        // In production, this would be handled by payment webhook
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'credits.targetFit': count }
        });

        res.json({
            success: true,
            message: `${count} kredi eklendi`,
            totalCost: count * CREDIT_PRICE
        });
    } catch (error) {
        res.status(500).json({ error: 'Kredi satın alma hatası' });
    }
});

// ============ Job Parsing Functions ============

async function parseJobListing(url) {
    try {
        // Determine which parser to use
        let parser = JOB_SITE_PARSERS.default;
        for (const [domain, parserFn] of Object.entries(JOB_SITE_PARSERS)) {
            if (url.includes(domain)) {
                parser = parserFn;
                break;
            }
        }

        // Fetch the page
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        return parser($, url);

    } catch (error) {
        console.error('Job parsing error:', error.message);
        // Return basic info if parsing fails
        return {
            title: 'İş İlanı',
            company: extractCompanyFromUrl(url),
            url: url,
            requirements: [],
            keywords: [],
            parseError: true
        };
    }
}

function parseKariyerNet($, url) {
    const title = $('h1.job-title, .job-detail-title h1').text().trim() || '';
    const company = $('.company-name, .company-title').first().text().trim() || '';
    const description = $('.job-description, .job-detail-description').text() || '';

    return {
        title,
        company,
        url,
        description: description.substring(0, 2000),
        requirements: extractRequirements(description),
        keywords: extractKeywords(description),
        skills: extractSkills(description)
    };
}

function parseLinkedIn($, url) {
    const title = $('h1.job-title, .topcard__title').text().trim() || '';
    const company = $('.topcard__org-name-link, .company-name').text().trim() || '';
    const description = $('.description__text, .show-more-less-html__markup').text() || '';

    return {
        title,
        company,
        url,
        description: description.substring(0, 2000),
        requirements: extractRequirements(description),
        keywords: extractKeywords(description),
        skills: extractSkills(description)
    };
}

function parseIndeed($, url) {
    const title = $('h1.jobsearch-JobInfoHeader-title').text().trim() || '';
    const company = $('.jobsearch-InlineCompanyRating-companyHeader').text().trim() || '';
    const description = $('#jobDescriptionText').text() || '';

    return {
        title,
        company,
        url,
        description: description.substring(0, 2000),
        requirements: extractRequirements(description),
        keywords: extractKeywords(description),
        skills: extractSkills(description)
    };
}

function parseSecretCV($, url) {
    const title = $('h1.position-title').text().trim() || '';
    const company = $('.company-name').text().trim() || '';
    const description = $('.job-description').text() || '';

    return {
        title,
        company,
        url,
        description: description.substring(0, 2000),
        requirements: extractRequirements(description),
        keywords: extractKeywords(description),
        skills: extractSkills(description)
    };
}

function parseYeniBiris($, url) {
    const title = $('h1.job-title').text().trim() || '';
    const company = $('.company-name').text().trim() || '';
    const description = $('.job-description').text() || '';

    return {
        title,
        company,
        url,
        description: description.substring(0, 2000),
        requirements: extractRequirements(description),
        keywords: extractKeywords(description),
        skills: extractSkills(description)
    };
}

function parseGeneric($, url) {
    // Try common selectors
    const title = $('h1').first().text().trim() ||
        $('[class*="title"]').first().text().trim() ||
        $('title').text().trim() || '';

    const company = $('[class*="company"]').first().text().trim() ||
        extractCompanyFromUrl(url) || '';

    const description = $('body').text().substring(0, 5000);

    return {
        title: title.substring(0, 100),
        company: company.substring(0, 100),
        url,
        description: description.substring(0, 2000),
        requirements: extractRequirements(description),
        keywords: extractKeywords(description),
        skills: extractSkills(description)
    };
}

function parseJobText(text) {
    return {
        title: 'İş İlanı',
        company: '',
        description: text.substring(0, 2000),
        requirements: extractRequirements(text),
        keywords: extractKeywords(text),
        skills: extractSkills(text),
        isManualInput: true
    };
}

function extractCompanyFromUrl(url) {
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace('www.', '').split('.')[0];
    } catch {
        return '';
    }
}

// ============ Keyword Extraction ============

const TECH_SKILLS = [
    'JavaScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'React', 'Vue', 'Angular', 'Next.js', 'Node.js', 'Django', 'Flask', 'Spring', '.NET',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux',
    'Machine Learning', 'AI', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch',
    'Agile', 'Scrum', 'Jira', 'Confluence', 'DevOps', 'Microservices'
];

const SOFT_SKILLS = [
    'Liderlik', 'İletişim', 'Problem Çözme', 'Takım Çalışması', 'Analitik Düşünme',
    'Zaman Yönetimi', 'Sunum', 'Müşteri İlişkileri', 'Proje Yönetimi', 'Strateji'
];

const EXPERIENCE_KEYWORDS = [
    'deneyim', 'tecrübe', 'yıl', 'experience', 'years', 'senior', 'junior', 'lead', 'manager'
];

function extractKeywords(text) {
    const textLower = text.toLowerCase();
    const keywords = [];

    // Extract tech skills
    TECH_SKILLS.forEach(skill => {
        if (textLower.includes(skill.toLowerCase())) {
            keywords.push({ type: 'tech', keyword: skill });
        }
    });

    // Extract soft skills
    SOFT_SKILLS.forEach(skill => {
        if (textLower.includes(skill.toLowerCase())) {
            keywords.push({ type: 'soft', keyword: skill });
        }
    });

    return keywords;
}

function extractSkills(text) {
    const textLower = text.toLowerCase();
    return TECH_SKILLS.filter(skill => textLower.includes(skill.toLowerCase()));
}

function extractRequirements(text) {
    const requirements = [];
    const lines = text.split(/[.\n]/);

    lines.forEach(line => {
        const lineLower = line.toLowerCase().trim();
        // Look for requirement patterns
        if (
            lineLower.includes('arıyoruz') ||
            lineLower.includes('bekliyoruz') ||
            lineLower.includes('gerekli') ||
            lineLower.includes('zorunlu') ||
            lineLower.includes('tercih') ||
            lineLower.includes('required') ||
            lineLower.includes('must have') ||
            lineLower.includes('deneyim') ||
            lineLower.includes('bilgisi') ||
            /^\s*[-•*]\s*/.test(line)
        ) {
            if (line.trim().length > 10 && line.trim().length < 200) {
                requirements.push(line.trim().replace(/^[-•*]\s*/, ''));
            }
        }
    });

    return requirements.slice(0, 15);
}

// ============ CV Tailoring Logic ============

function tailorCVToJob(cvData, jobData) {
    const tailored = JSON.parse(JSON.stringify(cvData)); // Deep clone
    const changes = [];

    // 1. Update professional summary with job keywords
    if (tailored.personal?.summary || tailored.summary) {
        const originalSummary = tailored.personal?.summary || tailored.summary;
        const enhancedSummary = enhanceSummary(originalSummary, jobData);

        if (tailored.personal?.summary) {
            tailored.personal.summary = enhancedSummary;
        } else {
            tailored.summary = enhancedSummary;
        }

        if (enhancedSummary !== originalSummary) {
            changes.push({
                section: 'summary',
                type: 'enhanced',
                description: 'Özet ilana uygun anahtar kelimelerle güçlendirildi'
            });
        }
    }

    // 2. Reorder and enhance experience based on job relevance
    if (tailored.experience && tailored.experience.length > 0) {
        const { enhanced, modified } = enhanceExperience(tailored.experience, jobData);
        tailored.experience = enhanced;
        if (modified) {
            changes.push({
                section: 'experience',
                type: 'reordered',
                description: 'Deneyimler ilana uygunluğa göre sıralandı ve güçlendirildi'
            });
        }
    }

    // 3. Prioritize matching skills
    if (tailored.skills && tailored.skills.length > 0) {
        const { enhanced, added } = enhanceSkills(tailored.skills, jobData);
        tailored.skills = enhanced;
        if (added.length > 0) {
            changes.push({
                section: 'skills',
                type: 'enhanced',
                description: `${added.length} beceri öne çıkarıldı`,
                details: added
            });
        }
    }

    // 4. Add a "Target Position" section if applicable
    if (jobData.title) {
        tailored._targetPosition = jobData.title;
        changes.push({
            section: 'target',
            type: 'set',
            description: `Hedef pozisyon: ${jobData.title}`
        });
    }

    // Store changes for reference
    tailored._changes = changes;
    tailored._tailoredAt = new Date().toISOString();
    tailored._tailoredFor = {
        title: jobData.title,
        company: jobData.company,
        url: jobData.url
    };

    return tailored;
}

function enhanceSummary(summary, jobData) {
    if (!summary) return summary;

    let enhanced = summary;
    const jobKeywords = jobData.skills || [];
    const lowerSummary = summary.toLowerCase();

    // Add missing high-priority keywords naturally
    const missingKeywords = jobKeywords.filter(k =>
        !lowerSummary.includes(k.toLowerCase())
    ).slice(0, 3);

    if (missingKeywords.length > 0 && summary.length < 400) {
        // Add a sentence with missing keywords
        const keywordPhrase = missingKeywords.join(', ');
        enhanced = `${summary} ${keywordPhrase} alanlarında deneyimli.`;
    }

    return enhanced;
}

function enhanceExperience(experiences, jobData) {
    const jobSkills = (jobData.skills || []).map(s => s.toLowerCase());
    let modified = false;

    // Score each experience by relevance
    const scored = experiences.map(exp => {
        let score = 0;
        const desc = (exp.description || '').toLowerCase();
        const title = (exp.position || exp.title || '').toLowerCase();

        jobSkills.forEach(skill => {
            if (desc.includes(skill) || title.includes(skill)) {
                score += 10;
            }
        });

        // Boost if title matches job title
        if (jobData.title && title.includes(jobData.title.toLowerCase().split(' ')[0])) {
            score += 20;
        }

        return { ...exp, _relevanceScore: score };
    });

    // Sort by relevance (highest first) while keeping chronological within similar scores
    const sorted = scored.sort((a, b) => {
        const scoreDiff = (b._relevanceScore || 0) - (a._relevanceScore || 0);
        if (Math.abs(scoreDiff) > 10) return scoreDiff;
        // If similar scores, keep chronological (recent first)
        return new Date(b.startDate || 0) - new Date(a.startDate || 0);
    });

    // Check if order changed
    if (JSON.stringify(sorted.map(e => e.company)) !== JSON.stringify(experiences.map(e => e.company))) {
        modified = true;
    }

    // Remove internal scoring
    const enhanced = sorted.map(exp => {
        const { _relevanceScore, ...rest } = exp;
        return rest;
    });

    return { enhanced, modified };
}

function enhanceSkills(skills, jobData) {
    const jobSkills = (jobData.skills || []).map(s => s.toLowerCase());
    const added = [];

    // Normalize skills
    const normalizedSkills = skills.map(skill => {
        if (typeof skill === 'string') {
            return { name: skill, level: 'intermediate' };
        }
        return skill;
    });

    // Score and sort skills
    const scored = normalizedSkills.map(skill => {
        const skillName = (skill.name || skill.skill || '').toLowerCase();
        const isMatch = jobSkills.some(js =>
            skillName.includes(js) || js.includes(skillName)
        );

        if (isMatch && !added.some(a => a.name === skill.name)) {
            added.push(skill);
        }

        return {
            ...skill,
            _priority: isMatch ? 1 : 0
        };
    });

    // Sort: matching skills first
    const sorted = scored.sort((a, b) => (b._priority || 0) - (a._priority || 0));

    // Remove internal priority
    const enhanced = sorted.map(skill => {
        const { _priority, ...rest } = skill;
        return rest;
    });

    return { enhanced, added };
}

module.exports = router;
