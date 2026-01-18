const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const User = require('../models/User');

// Sector-specific keywords database
const SECTOR_KEYWORDS = {
    'yazilim': {
        name: 'Yazılım / IT',
        keywords: {
            critical: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'API', 'REST', 'Docker'],
            important: ['TypeScript', 'AWS', 'Azure', 'Kubernetes', 'CI/CD', 'Agile', 'Scrum', 'MongoDB', 'PostgreSQL', 'Linux'],
            bonus: ['Machine Learning', 'AI', 'Microservices', 'GraphQL', 'Redis', 'Terraform', 'DevOps', 'Cloud', 'Security', 'Testing']
        },
        weight: { critical: 5, important: 3, bonus: 1 }
    },
    'finans': {
        name: 'Finans / Bankacılık',
        keywords: {
            critical: ['Excel', 'Finansal Analiz', 'Muhasebe', 'Raporlama', 'Bütçe', 'Risk Yönetimi'],
            important: ['SAP', 'Power BI', 'SQL', 'VBA', 'Audit', 'IFRS', 'Compliance', 'KPI'],
            bonus: ['Bloomberg', 'Python', 'CFA', 'ACCA', 'Tableau', 'Trading', 'Değerleme']
        },
        weight: { critical: 5, important: 3, bonus: 1 }
    },
    'pazarlama': {
        name: 'Pazarlama / Dijital',
        keywords: {
            critical: ['SEO', 'Google Ads', 'Sosyal Medya', 'Analytics', 'Content Marketing'],
            important: ['Facebook Ads', 'Google Analytics', 'Email Marketing', 'CRM', 'HubSpot', 'Copywriting'],
            bonus: ['A/B Testing', 'Conversion', 'Influencer', 'Brand', 'Growth Hacking', 'SEM']
        },
        weight: { critical: 5, important: 3, bonus: 1 }
    },
    'uretim': {
        name: 'Üretim / Mühendislik',
        keywords: {
            critical: ['Kalite Yönetimi', 'Üretim Planlama', 'ISO 9001', 'Süreç İyileştirme', 'ERP'],
            important: ['Six Sigma', 'Lean', 'Kaizen', 'TPM', 'AutoCAD', 'SolidWorks', 'PLC'],
            bonus: ['FMEA', 'SPC', '5S', 'Value Stream', 'OEE', 'SAP', 'MES']
        },
        weight: { critical: 5, important: 3, bonus: 1 }
    },
    'insan_kaynaklari': {
        name: 'İnsan Kaynakları',
        keywords: {
            critical: ['İşe Alım', 'Performans Yönetimi', 'İK Süreçleri', 'Bordro', 'Özlük'],
            important: ['KVKK', 'İş Hukuku', 'Eğitim ve Gelişim', 'Yetenek Yönetimi', 'SAP HR'],
            bonus: ['Employer Branding', 'Competency', 'Succession Planning', 'OKR', 'KPI']
        },
        weight: { critical: 5, important: 3, bonus: 1 }
    },
    'satis': {
        name: 'Satış / Business Development',
        keywords: {
            critical: ['B2B', 'B2C', 'CRM', 'Müşteri İlişkileri', 'Hedef Yönetimi'],
            important: ['Salesforce', 'Pipeline', 'Lead Generation', 'Account Management', 'Sunum'],
            bonus: ['Key Account', 'Negotiation', 'Cross-selling', 'Upselling', 'KPI']
        },
        weight: { critical: 5, important: 3, bonus: 1 }
    },
    'saglik': {
        name: 'Sağlık',
        keywords: {
            critical: ['Hasta Bakımı', 'Klinik', 'Sağlık Yönetimi', 'Tıbbi Terminoloji'],
            important: ['HBYS', 'JCI', 'Akreditasyon', 'Enfeksiyon Kontrolü', 'CPR'],
            bonus: ['EMR', 'HIPAA', 'Telemedicine', 'Clinical Research']
        },
        weight: { critical: 5, important: 3, bonus: 1 }
    },
    'genel': {
        name: 'Genel',
        keywords: {
            critical: ['İletişim', 'Problem Çözme', 'Takım Çalışması', 'Microsoft Office', 'Excel'],
            important: ['Liderlik', 'Proje Yönetimi', 'Zaman Yönetimi', 'Sunum', 'Analitik Düşünme'],
            bonus: ['Yabancı Dil', 'İngilizce', 'Almanca', 'Sertifika', 'Eğitim']
        },
        weight: { critical: 4, important: 2, bonus: 1 }
    }
};

// ATS formatting rules
const ATS_RULES = {
    noTables: { weight: 5, check: 'Tablo kullanımından kaçınılmalı' },
    noGraphics: { weight: 5, check: 'Grafik/resim yerine metin tercih edilmeli' },
    standardFonts: { weight: 3, check: 'Standart fontlar kullanılmalı (Arial, Calibri, Times)' },
    clearHeadings: { weight: 5, check: 'Bölüm başlıkları açık olmalı (Deneyim, Eğitim, Beceriler)' },
    reverseChronological: { weight: 4, check: 'Tarihler ters kronolojik sırada olmalı' },
    quantifiedResults: { weight: 5, check: 'Başarılar sayılarla ifade edilmeli' },
    keywordDensity: { weight: 5, check: 'Sektörel anahtar kelimeler yeterli olmalı' },
    contactInfo: { weight: 5, check: 'İletişim bilgileri eksiksiz olmalı' },
    appropriateLength: { weight: 3, check: 'CV uzunluğu 1-2 sayfa olmalı' }
};

// Free tier limits
const FREE_SCAN_LIMIT = 3;
const PREMIUM_PRICE = 449;

// POST /api/ats/analyze - Analyze CV for ATS compatibility
router.post('/analyze', optionalAuth, async (req, res) => {
    try {
        const { cvData, sector } = req.body;
        const userId = req.user?.id;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verisi gerekli' });
        }

        // Check usage limits for non-premium users
        let usageInfo = { used: 0, limit: FREE_SCAN_LIMIT, isPremium: false };

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                usageInfo.isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'pro';

                if (!usageInfo.isPremium) {
                    // Check free tier usage
                    const atsUsage = user.usage?.atsScans || 0;
                    usageInfo.used = atsUsage;

                    if (atsUsage >= FREE_SCAN_LIMIT) {
                        return res.status(403).json({
                            error: 'Ücretsiz tarama hakkınız doldu',
                            usageInfo,
                            upgradePrice: PREMIUM_PRICE,
                            upgradeUrl: '/pricing'
                        });
                    }

                    // Increment usage
                    await User.findByIdAndUpdate(userId, {
                        $inc: { 'usage.atsScans': 1 }
                    });
                    usageInfo.used += 1;
                }
            }
        }

        // Perform ATS analysis
        const analysis = analyzeATS(cvData, sector || 'genel');

        res.json({
            success: true,
            analysis,
            usageInfo: userId ? usageInfo : null
        });

    } catch (error) {
        console.error('ATS analysis error:', error);
        res.status(500).json({ error: 'Analiz sırasında hata oluştu' });
    }
});

// GET /api/ats/sectors - Get available sectors
router.get('/sectors', (req, res) => {
    const sectors = Object.entries(SECTOR_KEYWORDS).map(([id, data]) => ({
        id,
        name: data.name,
        keywordCount: Object.values(data.keywords).flat().length
    }));
    res.json({ success: true, sectors });
});

// GET /api/ats/usage - Get user's ATS scan usage
router.get('/usage', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'pro';

        res.json({
            success: true,
            usage: {
                used: user.usage?.atsScans || 0,
                limit: isPremium ? 'unlimited' : FREE_SCAN_LIMIT,
                isPremium,
                remaining: isPremium ? 'unlimited' : Math.max(0, FREE_SCAN_LIMIT - (user.usage?.atsScans || 0))
            },
            upgradePrice: PREMIUM_PRICE
        });
    } catch (error) {
        res.status(500).json({ error: 'Kullanım bilgisi alınamadı' });
    }
});

// Helper: Full ATS Analysis
function analyzeATS(cvData, sectorId) {
    const sector = SECTOR_KEYWORDS[sectorId] || SECTOR_KEYWORDS['genel'];

    const scores = {
        contact: analyzeContact(cvData),
        summary: analyzeSummary(cvData),
        experience: analyzeExperience(cvData),
        education: analyzeEducation(cvData),
        skills: analyzeSkills(cvData),
        keywords: analyzeKeywords(cvData, sector),
        formatting: analyzeFormatting(cvData)
    };

    // Calculate weighted total
    const weights = {
        contact: 10,
        summary: 10,
        experience: 25,
        education: 10,
        skills: 15,
        keywords: 20,
        formatting: 10
    };

    let totalScore = 0;
    let totalWeight = 0;
    for (const [key, weight] of Object.entries(weights)) {
        totalScore += (scores[key].score || 0) * weight;
        totalWeight += weight;
    }

    const finalScore = Math.round(totalScore / totalWeight);

    // Compile suggestions
    const allSuggestions = [];
    Object.values(scores).forEach(s => {
        if (s.suggestions) {
            allSuggestions.push(...s.suggestions);
        }
    });

    // Sort by priority
    allSuggestions.sort((a, b) => {
        const priority = { critical: 0, high: 1, medium: 2, low: 3 };
        return (priority[a.priority] || 2) - (priority[b.priority] || 2);
    });

    return {
        totalScore: finalScore,
        grade: getGrade(finalScore),
        scores,
        suggestions: allSuggestions.slice(0, 10),
        keywordAnalysis: scores.keywords,
        sector: sector.name,
        generatedAt: new Date().toISOString()
    };
}

function analyzeContact(cvData) {
    const personal = cvData?.personal || cvData?.personalInfo || {};
    const checks = {
        name: !!personal.fullName || !!personal.name,
        email: !!personal.email,
        phone: !!personal.phone,
        location: !!personal.location || !!personal.city,
        linkedin: !!(personal.linkedin || personal.linkedIn)
    };

    const score = Object.values(checks).filter(Boolean).length * 20;
    const suggestions = [];

    if (!checks.email) suggestions.push({ category: 'contact', text: 'E-posta adresi ekleyin', priority: 'critical', impact: 10 });
    if (!checks.phone) suggestions.push({ category: 'contact', text: 'Telefon numarası ekleyin', priority: 'high', impact: 8 });
    if (!checks.linkedin) suggestions.push({ category: 'contact', text: 'LinkedIn profil linki ekleyin', priority: 'medium', impact: 5 });

    return { score: Math.min(100, score), checks, suggestions };
}

function analyzeSummary(cvData) {
    const summary = cvData?.personal?.summary || cvData?.summary || cvData?.personalInfo?.summary || '';
    const length = summary.length;

    let score = 0;
    const suggestions = [];

    if (length >= 200) score = 100;
    else if (length >= 150) score = 85;
    else if (length >= 100) score = 70;
    else if (length >= 50) score = 40;
    else if (length > 0) score = 20;

    if (length < 100) {
        suggestions.push({
            category: 'summary',
            text: 'Profesyonel özetinizi en az 100 karakter yapın (şu an: ' + length + ')',
            priority: 'high',
            impact: 10
        });
    }

    if (length > 0 && length < 150) {
        suggestions.push({
            category: 'summary',
            text: 'Özetinize sektörel anahtar kelimeler ekleyin',
            priority: 'medium',
            impact: 7
        });
    }

    return { score, length, suggestions };
}

function analyzeExperience(cvData) {
    const experiences = cvData?.experience || [];
    let score = 0;
    const suggestions = [];

    // Base score on count
    if (experiences.length >= 4) score = 60;
    else if (experiences.length >= 3) score = 50;
    else if (experiences.length >= 2) score = 40;
    else if (experiences.length >= 1) score = 25;

    // Check for descriptions with achievements
    let hasDescriptions = 0;
    let hasNumbers = 0;
    let hasDates = 0;

    experiences.forEach(exp => {
        const desc = exp.description || '';
        if (desc.length > 50) hasDescriptions++;
        if (/\d+%|\d+\s*(kişi|proje|müşteri|yıl|bin|milyon)/i.test(desc)) hasNumbers++;
        if (exp.startDate) hasDates++;
    });

    if (experiences.length > 0) {
        const descRatio = hasDescriptions / experiences.length;
        score += descRatio * 20;

        const numbersRatio = hasNumbers / experiences.length;
        score += numbersRatio * 20;
    }

    if (experiences.length === 0) {
        suggestions.push({ category: 'experience', text: 'En az bir iş deneyimi ekleyin', priority: 'critical', impact: 15 });
    } else {
        if (hasDescriptions < experiences.length) {
            suggestions.push({ category: 'experience', text: 'Tüm deneyimlere detaylı açıklama ekleyin', priority: 'high', impact: 10 });
        }
        if (hasNumbers < experiences.length * 0.5) {
            suggestions.push({
                category: 'experience',
                text: 'Başarılarınızı rakamlarla ifade edin (ör: %30 artış, 50+ müşteri)',
                priority: 'high',
                impact: 12
            });
        }
    }

    return { score: Math.min(100, Math.round(score)), count: experiences.length, suggestions };
}

function analyzeEducation(cvData) {
    const educations = cvData?.education || [];
    let score = 0;
    const suggestions = [];

    if (educations.length >= 1) score = 70;
    if (educations.some(e => e.degree)) score = 85;
    if (educations.some(e => e.gpa || e.grade)) score = 100;

    if (educations.length === 0) {
        suggestions.push({ category: 'education', text: 'Eğitim bilgilerinizi ekleyin', priority: 'high', impact: 8 });
    }

    return { score, count: educations.length, suggestions };
}

function analyzeSkills(cvData) {
    const skills = cvData?.skills || [];
    const skillNames = skills.map(s => typeof s === 'string' ? s : s.name || s.skill);

    let score = 0;
    const suggestions = [];

    if (skillNames.length >= 15) score = 100;
    else if (skillNames.length >= 10) score = 85;
    else if (skillNames.length >= 7) score = 70;
    else if (skillNames.length >= 5) score = 55;
    else if (skillNames.length >= 3) score = 35;
    else if (skillNames.length >= 1) score = 15;

    if (skillNames.length < 5) {
        suggestions.push({
            category: 'skills',
            text: 'En az 5 teknik beceri ekleyin (şu an: ' + skillNames.length + ')',
            priority: 'high',
            impact: 10
        });
    } else if (skillNames.length < 10) {
        suggestions.push({
            category: 'skills',
            text: 'Daha fazla beceri ekleyerek görünürlüğünüzü artırın',
            priority: 'low',
            impact: 5
        });
    }

    return { score, count: skillNames.length, skills: skillNames, suggestions };
}

function analyzeKeywords(cvData, sector) {
    // Extract all text from CV
    const allText = extractAllText(cvData).toLowerCase();

    const found = { critical: [], important: [], bonus: [] };
    const missing = { critical: [], important: [], bonus: [] };

    // Check each keyword category
    for (const [level, keywords] of Object.entries(sector.keywords)) {
        keywords.forEach(keyword => {
            if (allText.includes(keyword.toLowerCase())) {
                found[level].push(keyword);
            } else {
                missing[level].push(keyword);
            }
        });
    }

    // Calculate score
    const weights = sector.weight;
    const maxScore =
        sector.keywords.critical.length * weights.critical +
        sector.keywords.important.length * weights.important +
        sector.keywords.bonus.length * weights.bonus;

    const actualScore =
        found.critical.length * weights.critical +
        found.important.length * weights.important +
        found.bonus.length * weights.bonus;

    const score = Math.round((actualScore / maxScore) * 100);

    const suggestions = [];

    if (missing.critical.length > 0) {
        suggestions.push({
            category: 'keywords',
            text: `Kritik eksik anahtar kelimeler: ${missing.critical.slice(0, 5).join(', ')}`,
            priority: 'critical',
            impact: 15,
            keywords: missing.critical.slice(0, 5)
        });
    }

    if (missing.important.length > 0) {
        suggestions.push({
            category: 'keywords',
            text: `Önemli eksik anahtar kelimeler: ${missing.important.slice(0, 5).join(', ')}`,
            priority: 'high',
            impact: 10,
            keywords: missing.important.slice(0, 5)
        });
    }

    return {
        score,
        found,
        missing,
        suggestions,
        coverage: {
            critical: `${found.critical.length}/${sector.keywords.critical.length}`,
            important: `${found.important.length}/${sector.keywords.important.length}`,
            bonus: `${found.bonus.length}/${sector.keywords.bonus.length}`
        }
    };
}

function analyzeFormatting(cvData) {
    let score = 80; // Base score
    const suggestions = [];

    // Check for proper structure
    const hasExperience = (cvData?.experience || []).length > 0;
    const hasEducation = (cvData?.education || []).length > 0;
    const hasSkills = (cvData?.skills || []).length > 0;
    const hasContact = cvData?.personal || cvData?.personalInfo;

    if (!hasExperience) score -= 15;
    if (!hasEducation) score -= 10;
    if (!hasSkills) score -= 15;
    if (!hasContact) score -= 20;

    // Word count estimation
    const allText = extractAllText(cvData);
    const wordCount = allText.split(/\s+/).length;

    if (wordCount < 200) {
        score -= 10;
        suggestions.push({
            category: 'formatting',
            text: 'CV içeriği çok kısa, daha fazla detay ekleyin',
            priority: 'medium',
            impact: 8
        });
    } else if (wordCount > 1000) {
        score -= 5;
        suggestions.push({
            category: 'formatting',
            text: 'CV çok uzun, 1-2 sayfa olacak şekilde kısaltın',
            priority: 'low',
            impact: 3
        });
    }

    return { score: Math.max(0, Math.min(100, score)), wordCount, suggestions };
}

function extractAllText(cvData) {
    const parts = [];

    // Personal info
    const personal = cvData?.personal || cvData?.personalInfo || {};
    parts.push(personal.fullName || personal.name || '');
    parts.push(personal.title || '');
    parts.push(personal.summary || '');

    // Experience
    (cvData?.experience || []).forEach(exp => {
        parts.push(exp.company || '');
        parts.push(exp.position || exp.title || '');
        parts.push(exp.description || '');
    });

    // Education
    (cvData?.education || []).forEach(edu => {
        parts.push(edu.school || edu.institution || '');
        parts.push(edu.degree || '');
        parts.push(edu.field || '');
    });

    // Skills
    (cvData?.skills || []).forEach(skill => {
        parts.push(typeof skill === 'string' ? skill : skill.name || skill.skill || '');
    });

    // Certifications
    (cvData?.certifications || []).forEach(cert => {
        parts.push(typeof cert === 'string' ? cert : cert.name || '');
    });

    return parts.join(' ');
}

function getGrade(score) {
    if (score >= 90) return { letter: 'A+', label: 'Mükemmel', color: 'green' };
    if (score >= 80) return { letter: 'A', label: 'Çok İyi', color: 'green' };
    if (score >= 70) return { letter: 'B', label: 'İyi', color: 'cyan' };
    if (score >= 60) return { letter: 'C', label: 'Orta', color: 'amber' };
    if (score >= 50) return { letter: 'D', label: 'Zayıf', color: 'orange' };
    return { letter: 'F', label: 'Yetersiz', color: 'red' };
}

module.exports = router;
