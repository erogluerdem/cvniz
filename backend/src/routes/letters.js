const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// Letter templates and patterns
const COVER_LETTER_TEMPLATES = {
    professional: {
        name: 'Profesyonel',
        opening: (name, position, company) =>
            `Sayın İlgili,\n\n${company}'de açık olan ${position} pozisyonu için başvurumu sunar, bu fırsata olan ilgimi belirtmek isterim.`,
        closing: (name) =>
            `Deneyimlerimi ve yetkinliklerimi sizinle paylaşma fırsatı bulmayı umuyorum.\n\nSaygılarımla,\n${name}`
    },
    creative: {
        name: 'Yaratıcı',
        opening: (name, position, company) =>
            `Merhaba,\n\n${company}'nin ${position} ilanını gördüğüm an, bu rolün benim için tasarlandığını hissettim.`,
        closing: (name) =>
            `Birlikte neler başarabileceğimizi konuşmak için sabırsızlanıyorum.\n\nEn içten dileklerimle,\n${name}`
    },
    formal: {
        name: 'Resmi',
        opening: (name, position, company) =>
            `Sayın Yetkili,\n\n${company} bünyesinde ilan edilen ${position} pozisyonuna başvuruda bulunmak istiyorum.`,
        closing: (name) =>
            `Başvurumun olumlu değerlendirileceğini umarak, görüşme fırsatı tanınmasını rica ederim.\n\nSaygılarımla,\n${name}`
    }
};

const REFERENCE_LETTER_TEMPLATES = {
    recommendation: {
        name: 'Tavsiye Mektubu',
        template: (candidateName, position, skills, achievements) => `
Sayın İlgili,

Bu mektupla ${candidateName}'yi ${position} pozisyonu için içtenlikle tavsiye ediyorum.

${candidateName} ile [süre] boyunca [şirket/proje] kapsamında birlikte çalışma fırsatı buldum. Bu süre zarfında kendisinin ${skills.slice(0, 3).join(', ')} konularındaki yetkinliklerine yakından şahit oldum.

Özellikle dikkat çeken başarıları arasında:
${achievements.map(a => `• ${a}`).join('\n')}

${candidateName}'nin profesyonel yaklaşımı, takım çalışmasına yatkınlığı ve problem çözme becerisi ekibimize büyük değer kattı.

Herhangi bir sorunuz olursa benimle iletişime geçmekten çekinmeyin.

Saygılarımla,
[İmza]
[Ünvan]
[İletişim]`
    },
    character: {
        name: 'Karakter Referansı',
        template: (candidateName, position, qualities) => `
Sayın İlgili,

${candidateName}'yi [süre] yıldır tanıyorum ve profesyonel karakterine güvenle kefil olabilirim.

Kendisi ${qualities.slice(0, 4).join(', ')} gibi özellikleriyle dikkat çeken bir profesyoneldir.

${candidateName}'nin her ortamda başarılı olacağına inancım tamdır.

Saygılarımla,
[İmza]`
    },
    academic: {
        name: 'Akademik Referans',
        template: (candidateName, degree, institution) => `
Sayın İlgili,

${candidateName}'yi ${institution}'da ${degree} programında öğrencim olarak tanıma fırsatı buldum.

Akademik performansı, araştırma yetenekleri ve analitik düşünme kapasitesi ile dikkat çekti.

Herhangi bir akademik veya profesyonel pozisyon için güvenle tavsiye ederim.

Saygılarımla,
[İmza]
[Akademik Ünvan]`
    }
};

// Skill-to-sentence mappings
const SKILL_SENTENCES = {
    'React': 'React ile modern, ölçeklenebilir web uygulamaları geliştirdim.',
    'Node.js': 'Node.js kullanarak yüksek performanslı backend sistemleri tasarladım.',
    'Python': 'Python ile veri analizi ve otomasyon çözümleri ürettim.',
    'AWS': 'AWS servisleri ile bulut altyapısı yönetimi ve optimizasyonu gerçekleştirdim.',
    'Machine Learning': 'Makine öğrenmesi modelleri ile iş süreçlerini optimize ettim.',
    'Liderlik': 'Ekip liderliği deneyimimle projeleri başarıyla yönettim.',
    'Problem Çözme': 'Karmaşık problemlere yaratıcı ve etkili çözümler geliştirdim.',
    'İletişim': 'Güçlü iletişim becerilerimle paydaşlarla etkin ilişkiler kurdum.',
    'Proje Yönetimi': 'Projeleri zamanında ve bütçe dahilinde tamamlama konusunda kanıtlanmış bir sicile sahibim.',
    'Takım Çalışması': 'Çapraz fonksiyonlu ekiplerle uyum içinde çalışarak ortak hedeflere ulaştım.',
    'Analitik Düşünme': 'Veri odaklı kararlar alarak iş sonuçlarını iyileştirdim.',
    'Müşteri İlişkileri': 'Müşteri memnuniyetini artıran stratejiler geliştirdim ve uyguladım.'
};

// POST /api/letters/cover - Generate cover letter
router.post('/cover', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Check subscription
        const hasSubscription = user.subscription?.plan === 'premium' ||
            user.subscription?.plan === 'pro' ||
            user.subscription?.features?.includes('letters');

        if (!hasSubscription) {
            return res.status(403).json({
                error: 'Bu özellik için abonelik gerekli',
                requiresSubscription: true,
                upgradeUrl: '/pricing'
            });
        }

        const { cvData, jobData, style, customInstructions } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verisi gerekli' });
        }

        const coverLetter = generateCoverLetter(cvData, jobData, style || 'professional', customInstructions);

        res.json({
            success: true,
            coverLetter,
            wordCount: coverLetter.content.split(/\s+/).length
        });

    } catch (error) {
        console.error('Cover letter generation error:', error);
        res.status(500).json({ error: 'Niyet mektubu oluşturulamadı' });
    }
});

// POST /api/letters/reference - Generate reference letter template
router.post('/reference', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Check subscription
        const hasSubscription = user.subscription?.plan === 'premium' ||
            user.subscription?.plan === 'pro' ||
            user.subscription?.features?.includes('letters');

        if (!hasSubscription) {
            return res.status(403).json({
                error: 'Bu özellik için abonelik gerekli',
                requiresSubscription: true
            });
        }

        const { cvData, referenceType, targetPosition, referrerInfo } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verisi gerekli' });
        }

        const referenceLetter = generateReferenceLetter(cvData, referenceType || 'recommendation', targetPosition, referrerInfo);

        res.json({
            success: true,
            referenceLetter,
            note: 'Bu taslağı eski yöneticinize gönderebilirsiniz.'
        });

    } catch (error) {
        console.error('Reference letter generation error:', error);
        res.status(500).json({ error: 'Referans mektubu oluşturulamadı' });
    }
});

// GET /api/letters/templates - Get available templates
router.get('/templates', (req, res) => {
    res.json({
        success: true,
        coverLetterStyles: Object.entries(COVER_LETTER_TEMPLATES).map(([id, t]) => ({
            id,
            name: t.name
        })),
        referenceTypes: Object.entries(REFERENCE_LETTER_TEMPLATES).map(([id, t]) => ({
            id,
            name: t.name
        }))
    });
});

// ============ Generation Logic ============

function generateCoverLetter(cvData, jobData, style, customInstructions) {
    const template = COVER_LETTER_TEMPLATES[style] || COVER_LETTER_TEMPLATES.professional;

    // Extract CV info
    const personal = cvData?.personal || cvData?.personalInfo || {};
    const name = personal.fullName || personal.name || 'Aday';
    const experiences = cvData?.experience || [];
    const skills = extractSkills(cvData);

    // Job info
    const jobTitle = jobData?.title || 'ilgili pozisyon';
    const company = jobData?.company || 'şirketiniz';
    const jobSkills = jobData?.skills || [];
    const jobKeywords = jobData?.keywords || [];

    // Build the letter
    const parts = [];

    // Opening
    parts.push(template.opening(name, jobTitle, company));

    // First paragraph - Introduction with experience
    const totalYears = calculateExperienceYears(experiences);
    let introParagraph = '';

    if (totalYears > 0) {
        introParagraph = `${totalYears} yılı aşkın profesyonel deneyimimle, ${jobTitle} rolünün gerektirdiği yetkinliklere sahibim.`;
    } else {
        introParagraph = `Eğitimim ve projelerim sayesinde ${jobTitle} rolü için gerekli becerileri kazandım.`;
    }
    parts.push(introParagraph);

    // Second paragraph - Matching skills
    const matchingSkills = [];
    jobSkills.forEach(js => {
        const match = skills.find(s =>
            s.toLowerCase().includes(js.toLowerCase()) ||
            js.toLowerCase().includes(s.toLowerCase())
        );
        if (match && !matchingSkills.includes(match)) {
            matchingSkills.push(match);
        }
    });

    if (matchingSkills.length > 0) {
        const skillSentences = matchingSkills.slice(0, 3).map(skill => {
            return SKILL_SENTENCES[skill] || `${skill} alanında deneyim sahibiyim.`;
        });
        parts.push(skillSentences.join(' '));
    }

    // Third paragraph - Key achievements from experience
    const achievements = extractAchievements(experiences);
    if (achievements.length > 0) {
        const lastCompany = experiences[0]?.company || 'önceki rolümde';
        parts.push(`${lastCompany}'deki görevimde ${achievements.slice(0, 2).join(' Ayrıca ')}.`);
    }

    // Fourth paragraph - Why this company (if job data available)
    if (jobData?.company && jobData.company !== 'şirketiniz') {
        const emphasisKeywords = extractEmphasis(jobData);
        if (emphasisKeywords.length > 0) {
            parts.push(`${company}'nin ${emphasisKeywords[0]} konusundaki yaklaşımı, kariyer hedeflerimle örtüşmekte ve bu ekibe katkı sağlama motivasyonumu artırmaktadır.`);
        } else {
            parts.push(`${company}'nin sektördeki öncü konumu ve yenilikçi yaklaşımı, bu ekipte yer almak istememin en önemli sebeplerinden.`);
        }
    }

    // Custom instructions integration
    if (customInstructions) {
        parts.push(customInstructions);
    }

    // Closing
    parts.push(template.closing(name));

    return {
        content: parts.join('\n\n'),
        style: template.name,
        targetPosition: jobTitle,
        targetCompany: company,
        generatedAt: new Date().toISOString()
    };
}

function generateReferenceLetter(cvData, referenceType, targetPosition, referrerInfo) {
    const template = REFERENCE_LETTER_TEMPLATES[referenceType] || REFERENCE_LETTER_TEMPLATES.recommendation;

    // Extract CV info
    const personal = cvData?.personal || cvData?.personalInfo || {};
    const name = personal.fullName || personal.name || '[Aday Adı]';
    const skills = extractSkills(cvData);
    const experiences = cvData?.experience || [];
    const education = cvData?.education || [];

    // Extract achievements
    const achievements = extractAchievements(experiences);
    if (achievements.length === 0) {
        achievements.push('Projeleri başarıyla tamamladı');
        achievements.push('Takım çalışmasına önemli katkılar sağladı');
    }

    // Soft skills/qualities
    const qualities = [
        'sorumluluk sahibi',
        'detaylara özen gösteren',
        'hızlı öğrenen',
        'takım oyuncusu',
        'güvenilir'
    ];

    let content = '';

    switch (referenceType) {
    case 'recommendation':
        content = template.template(name, targetPosition || 'ilgili pozisyon', skills, achievements);
        break;
    case 'character':
        content = template.template(name, targetPosition || 'ilgili pozisyon', qualities);
        break;
    case 'academic': {
        const degree = education[0]?.degree || 'lisans';
        const institution = education[0]?.school || education[0]?.institution || '[Üniversite]';
        content = template.template(name, degree, institution);
        break;
    }
    default:
        content = template.template(name, targetPosition, skills, achievements);
    }

    // Add referrer placeholders
    const referrer = referrerInfo || {};
    content = content.replace('[süre]', referrer.duration || '[X]');
    content = content.replace('[şirket/proje]', referrer.company || '[Şirket/Proje adı]');

    return {
        content,
        type: template.name,
        candidateName: name,
        placeholders: ['[süre]', '[şirket/proje]', '[İmza]', '[Ünvan]', '[İletişim]'],
        instructions: 'Köşeli parantez içindeki alanları doldurup eski yöneticinize gönderin.',
        generatedAt: new Date().toISOString()
    };
}

// Helper functions
function extractSkills(cvData) {
    const skills = cvData?.skills || [];
    return skills.map(s => typeof s === 'string' ? s : s.name || s.skill || '');
}

function calculateExperienceYears(experiences) {
    let totalMonths = 0;
    experiences.forEach(exp => {
        if (exp.startDate) {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            const months = (end - start) / (1000 * 60 * 60 * 24 * 30);
            totalMonths += Math.max(0, months);
        }
    });
    return Math.round(totalMonths / 12);
}

function extractAchievements(experiences) {
    const achievements = [];

    experiences.forEach(exp => {
        const desc = exp.description || '';
        // Look for quantified achievements
        const patterns = [
            /(\d+%[^.]*başar[^.]*)/gi,
            /(\d+\s*(kişi|proje|müşteri)[^.]*)/gi,
            /(artır[^.]*\d+)/gi,
            /(azalt[^.]*\d+)/gi,
            /(ödül[^.]*)/gi,
            /(liderlik[^.]*)/gi
        ];

        patterns.forEach(pattern => {
            const matches = desc.match(pattern);
            if (matches) {
                achievements.push(...matches);
            }
        });

        // If no patterns, extract bullet points
        const bullets = desc.split(/[-•*]/).filter(b => b.trim().length > 20);
        if (achievements.length < 2 && bullets.length > 0) {
            achievements.push(bullets[0].trim().substring(0, 100));
        }
    });

    return [...new Set(achievements)].slice(0, 5);
}

function extractEmphasis(jobData) {
    const emphasisKeywords = [];
    const description = (jobData?.description || '').toLowerCase();

    const emphasisPatterns = [
        { pattern: /inovasyon|yenilik/i, word: 'inovasyon' },
        { pattern: /takım|ekip/i, word: 'takım çalışması' },
        { pattern: /müşteri/i, word: 'müşteri odaklılık' },
        { pattern: /sürdürülebilir/i, word: 'sürdürülebilirlik' },
        { pattern: /lider/i, word: 'liderlik' },
        { pattern: /kalite/i, word: 'kalite' },
        { pattern: /teknoloji/i, word: 'teknoloji' },
        { pattern: /data|veri/i, word: 'veri odaklı çalışma' }
    ];

    emphasisPatterns.forEach(({ pattern, word }) => {
        if (pattern.test(description)) {
            emphasisKeywords.push(word);
        }
    });

    return emphasisKeywords;
}

module.exports = router;
