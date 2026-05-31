const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config for selfie uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads/headshots');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Sadece JPEG, PNG ve WebP dosyaları yüklenebilir'));
        }
    }
});

// Headshot styles
const HEADSHOT_STYLES = [
    { id: 'business_formal', name: 'Business Formal', description: 'Klasik takım elbise, stüdyo arka plan' },
    { id: 'business_casual', name: 'Business Casual', description: 'Gömlek, modern ofis arka planı' },
    { id: 'creative', name: 'Yaratıcı', description: 'Renkli arka plan, casual-chic görünüm' },
    { id: 'tech', name: 'Tech/Startup', description: 'Modern, minimalist, koyu arka plan' },
    { id: 'linkedin', name: 'LinkedIn Optimized', description: 'Mavi gradient, profesyonel aydınlatma' }
];

// Pricing
const HEADSHOT_PRICE = 199; // TL per photo
const BUNDLE_PRICE = 449; // 3 photos

// Bio templates by industry
const BIO_TEMPLATES = {
    tech: {
        keywords: ['teknoloji', 'yazılım', 'geliştirici', 'mühendis'],
        template: '{years} yılı aşkın deneyime sahip {title} olarak, {skills} alanlarında uzmanlaşmış bulunuyorum. {company} gibi önde gelen firmalarda çalışarak {achievement} başarılarına imza attım. Sürekli öğrenme ve yenilikçi çözümler üretme tutkusuyla, ekiplere ve projelere değer katmaya devam ediyorum.'
    },
    finance: {
        keywords: ['finans', 'bankacılık', 'muhasebe', 'yatırım'],
        template: '{years} yıllık finans sektörü deneyimiyle, {skills} konularında derin uzmanlık geliştirdim. {company} bünyesinde {achievement} katkılarıyla şirket hedeflerine ulaşılmasında önemli rol oynadım. Stratejik düşünce ve analitik yaklaşımımla kurumsal değer yaratmaya odaklanıyorum.'
    },
    marketing: {
        keywords: ['pazarlama', 'dijital', 'marka', 'içerik'],
        template: 'Yaratıcı ve veri odaklı bir {title} olarak, {years} yıldır markaların büyüme hikayelerine katkıda bulunuyorum. {skills} stratejileriyle {achievement} sonuçlar elde ettim. Yenilikçi kampanyalar ve ölçülebilir başarılarla sektörde fark yaratıyorum.'
    },
    general: {
        keywords: [],
        template: '{years} yıllık profesyonel deneyimime dayanan {title} kariyerimde, {skills} konularında kendimi geliştirdim. {company} deneyimimde {achievement} başarılarla ekibime ve şirket hedeflerine katkı sağladım. Sürekli gelişim odaklı yaklaşımımla yeni fırsatlar arıyorum.'
    }
};

// Elevator pitch templates (30 seconds)
const ELEVATOR_TEMPLATES = {
    jobseeker: 'Merhaba, ben {name}. {years} yıllık {field} deneyimine sahip bir {title}\'ım. {skills} konularında uzmanlaştım ve son olarak {company}\'de {achievement} başardım. Şu an {goal} arıyorum ve sizin için nasıl değer katabileceğimi konuşmayı çok isterim.',
    networking: 'Ben {name}, {title} olarak {years} yıldır {field} sektöründeyim. En büyük tutkum {passion}. Son projemde {achievement} ve bu beni çok heyecanlandırdı. Siz ne üzerinde çalışıyorsunuz?',
    interview: '{name} olarak, {years} yıllık {field} tecrübemle bu pozisyon için güçlü bir aday olduğuma inanıyorum. {company}\'de {achievement} başarısına imza attım. {skills} konularındaki uzmanlığımı şirketinize taşımak ve birlikte büyümek istiyorum.'
};

// POST /api/headshot/upload - Upload selfie for processing
router.post('/upload', authenticate, upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Fotoğraf yüklenemedi' });
        }

        const { style } = req.body;
        const styleConfig = HEADSHOT_STYLES.find(s => s.id === style) || HEADSHOT_STYLES[0];

        // Check if user has credits or premium
        const user = await User.findById(req.user.id);
        const hasCredit = (user.credits?.headshot || 0) > 0;
        const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'pro';

        if (!hasCredit && !isPremium) {
            // Delete uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(403).json({
                error: 'Headshot kredisi gerekli',
                price: HEADSHOT_PRICE,
                bundlePrice: BUNDLE_PRICE,
                purchaseUrl: '/pricing?product=headshot'
            });
        }

        // Create headshot job (in production, this would call an AI API)
        const job = {
            id: generateId(),
            userId: req.user.id,
            originalPath: req.file.path,
            style: styleConfig.id,
            status: 'processing',
            createdAt: new Date(),
            resultPath: null
        };

        // Store job in user's headshot history
        await User.findByIdAndUpdate(req.user.id, {
            $push: { 'headshotJobs': job },
            $inc: { 'credits.headshot': isPremium ? 0 : -1 }
        });

        // In production: Call AI API here (Replicate, Stable Diffusion, etc.)
        // For now, simulate processing
        const result = await simulateHeadshotGeneration(req.file.path, styleConfig);

        // Update job with result
        await User.findOneAndUpdate(
            { _id: req.user.id, 'headshotJobs.id': job.id },
            {
                $set: {
                    'headshotJobs.$.status': 'completed',
                    'headshotJobs.$.resultPath': result.path,
                    'headshotJobs.$.completedAt': new Date()
                }
            }
        );

        res.json({
            success: true,
            job: {
                ...job,
                status: 'completed',
                resultPath: result.path,
                resultUrl: result.url
            },
            message: 'Fotoğrafınız işlendi!'
        });

    } catch (error) {
        console.error('Headshot upload error:', error);
        res.status(500).json({ error: 'Fotoğraf işlenemedi' });
    }
});

// GET /api/headshot/styles - Get available styles
router.get('/styles', (req, res) => {
    res.json({ success: true, styles: HEADSHOT_STYLES, price: HEADSHOT_PRICE, bundlePrice: BUNDLE_PRICE });
});

// GET /api/headshot/history - Get user's headshot history
router.get('/history', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const jobs = user.headshotJobs || [];
        const credits = user.credits?.headshot || 0;

        res.json({
            success: true,
            jobs: jobs.slice(-10).reverse(),
            credits
        });
    } catch (error) {
        res.status(500).json({ error: 'Geçmiş alınamadı' });
    }
});

// POST /api/headshot/bio - Generate LinkedIn bio
router.post('/bio', authenticate, async (req, res) => {
    try {
        const { cvData, tone, maxLength } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verisi gerekli' });
        }

        const bio = generateLinkedInBio(cvData, tone || 'professional', maxLength || 300);

        res.json({ success: true, bio });
    } catch (error) {
        console.error('Bio generation error:', error);
        res.status(500).json({ error: 'Bio oluşturulamadı' });
    }
});

// POST /api/headshot/elevator-pitch - Generate 30-second elevator pitch
router.post('/elevator-pitch', authenticate, async (req, res) => {
    try {
        const { cvData, purpose, targetCompany } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verisi gerekli' });
        }

        const pitch = generateElevatorPitch(cvData, purpose || 'jobseeker', targetCompany);

        res.json({
            success: true,
            pitch,
            duration: '~30 saniye',
            wordCount: pitch.split(/\s+/).length
        });
    } catch (error) {
        console.error('Elevator pitch error:', error);
        res.status(500).json({ error: 'Pitch oluşturulamadı' });
    }
});

// POST /api/headshot/purchase - Purchase headshot credits
router.post('/purchase', authenticate, async (req, res) => {
    try {
        const { packageType } = req.body; // single, bundle

        const credits = packageType === 'bundle' ? 3 : 1;
        const price = packageType === 'bundle' ? BUNDLE_PRICE : HEADSHOT_PRICE;

        // In production: Handle payment here
        await User.findByIdAndUpdate(req.user.id, {
            $inc: { 'credits.headshot': credits }
        });

        res.json({
            success: true,
            message: `${credits} headshot kredisi eklendi`,
            totalPrice: price
        });
    } catch (error) {
        res.status(500).json({ error: 'Satın alma hatası' });
    }
});

// ============ Helper Functions ============

function generateId() {
    return 'hs_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

async function simulateHeadshotGeneration(originalPath, _style) {
    // In production: Call AI API like Replicate or Stable Diffusion
    // Example with Replicate:
    // const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    // const output = await replicate.run("tencentarc/photomaker", { ... });

    // For now, return the original path as placeholder
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

    return {
        path: originalPath,
        url: `/uploads/headshots/${path.basename(originalPath)}`
    };
}

function generateLinkedInBio(cvData, tone, maxLength) {
    const personal = cvData?.personal || cvData?.personalInfo || {};
    const experiences = cvData?.experience || [];
    const skills = cvData?.skills || [];

    // Extract info
    const title = personal.title || experiences[0]?.position || 'Profesyonel';
    const years = calculateYears(experiences);
    const topSkills = extractSkillNames(skills).slice(0, 3).join(', ');
    const latestCompany = experiences[0]?.company || '';
    const achievement = extractTopAchievement(experiences);

    // Detect industry
    const industry = detectIndustry(cvData);
    const template = BIO_TEMPLATES[industry] || BIO_TEMPLATES.general;

    // Fill template
    let bio = template.template
        .replace('{years}', years || '5+')
        .replace('{title}', title)
        .replace('{skills}', topSkills || 'çeşitli')
        .replace('{company}', latestCompany || 'sektördeki firmalar')
        .replace('{achievement}', achievement || 'önemli projeler tamamlama');

    // Trim if too long
    if (bio.length > maxLength) {
        bio = bio.substring(0, maxLength - 3) + '...';
    }

    return {
        content: bio,
        characterCount: bio.length,
        industry: industry,
        suggestions: [
            'Spesifik rakamlar ve başarılar ekleyin',
            'Anahtar kelimeleri vurgulayın',
            'Call-to-action ile bitirin (örn: "İletişime geçin")'
        ]
    };
}

function generateElevatorPitch(cvData, purpose, targetCompany) {
    const personal = cvData?.personal || cvData?.personalInfo || {};
    const experiences = cvData?.experience || [];
    const skills = cvData?.skills || [];

    const name = personal.fullName || personal.name || 'Ben';
    const title = personal.title || experiences[0]?.position || 'profesyonel';
    const years = calculateYears(experiences) || '5';
    const field = detectField(cvData);
    const topSkills = extractSkillNames(skills).slice(0, 2).join(' ve ');
    const latestCompany = experiences[0]?.company || 'önceki şirketimde';
    const achievement = extractTopAchievement(experiences) || 'önemli projeler tamamladım';

    const template = ELEVATOR_TEMPLATES[purpose] || ELEVATOR_TEMPLATES.jobseeker;

    const pitch = template
        .replace(/{name}/g, name)
        .replace(/{years}/g, years)
        .replace(/{title}/g, title)
        .replace(/{field}/g, field)
        .replace(/{skills}/g, topSkills || 'çeşitli beceriler')
        .replace(/{company}/g, latestCompany)
        .replace(/{achievement}/g, achievement)
        .replace(/{goal}/g, targetCompany ? `${targetCompany}'de bir fırsat` : 'yeni kariyer fırsatları')
        .replace(/{passion}/g, 'problem çözme ve yenilikçi projeler')
        .replace(/{targetCompany}/g, targetCompany || 'bu şirket');

    return pitch;
}

function calculateYears(experiences) {
    let totalMonths = 0;
    experiences.forEach(exp => {
        if (exp.startDate) {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            totalMonths += Math.max(0, (end - start) / (1000 * 60 * 60 * 24 * 30));
        }
    });
    return Math.round(totalMonths / 12);
}

function extractSkillNames(skills) {
    return skills.map(s => typeof s === 'string' ? s : s.name || s.skill || '').filter(Boolean);
}

function extractTopAchievement(experiences) {
    for (const exp of experiences) {
        const desc = exp.description || '';
        const match = desc.match(/(\d+%[^.]*)|(\d+\s*(kişi|proje|müşteri)[^.]*)/i);
        if (match) {return match[0].trim();}
    }
    return null;
}

function detectIndustry(cvData) {
    const allText = JSON.stringify(cvData).toLowerCase();

    if (/yazılım|developer|mühendis|react|python|node/.test(allText)) {return 'tech';}
    if (/finans|banka|muhasebe|yatırım/.test(allText)) {return 'finance';}
    if (/pazarlama|marketing|dijital|marka/.test(allText)) {return 'marketing';}

    return 'general';
}

function detectField(cvData) {
    const industry = detectIndustry(cvData);
    const fields = {
        tech: 'teknoloji',
        finance: 'finans',
        marketing: 'pazarlama',
        general: 'iş dünyası'
    };
    return fields[industry];
}

module.exports = router;
