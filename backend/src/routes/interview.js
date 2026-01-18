const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// Question templates by category
const QUESTION_TEMPLATES = {
    experience_gap: {
        category: 'Deneyim Boşlukları',
        questions: [
            { q: 'CV\'nizde {gap_period} süresince bir boşluk görüyorum. Bu dönemde neler yaptınız?', type: 'gap', tips: ['Dürüst ol', 'Öğrendiklerini vurgula', 'Pozitif çerçevele'] },
            { q: 'Son işinizden ayrılma nedeniniz neydi?', type: 'leave', tips: ['Negatif konuşma', 'Gelişim odaklı ol', 'Profesyonel kal'] }
        ]
    },
    technical: {
        category: 'Teknik Sorular',
        questions: [
            { q: '{skill} alanında en zorlu projeniz neydi ve nasıl çözdünüz?', type: 'skill_deep', tips: ['STAR metodunu kullan', 'Rakamlarla destekle', 'Öğrendiklerini paylaş'] },
            { q: '{skill} ile {related_skill} arasındaki farkları açıklar mısınız?', type: 'skill_compare', tips: ['Kullanım senaryolarını karşılaştır', 'Tecrübelerinden örnekle'] }
        ]
    },
    behavioral: {
        category: 'Davranışsal Sorular',
        questions: [
            { q: 'Takım içinde bir çatışma yaşadığınız bir durum anlatır mısınız?', type: 'conflict', tips: ['Çözümü vurgula', 'Kendi rolünü belirt', 'Öğrendiklerini paylaş'] },
            { q: 'Bir deadline\'ı kaçırdığınız veya kaçırma riski yaşadığınız bir durum oldu mu?', type: 'deadline', tips: ['Proaktif çözümlerini anlat', 'İletişimini vurgula'] },
            { q: 'Liderlik gösterdiğiniz bir durumu anlatır mısınız?', type: 'leadership', tips: ['Somut sonuçları paylaş', 'Takım üzerindeki etkini anlat'] },
            { q: 'Başarısız olduğunuz bir proje var mı? Ne öğrendiniz?', type: 'failure', tips: ['Dürüst ol', 'Öğrendiklerini vurgula', 'Gelişimini göster'] }
        ]
    },
    achievement: {
        category: 'Başarı Sorgulaması',
        questions: [
            { q: 'CV\'nizde "{achievement}" yazıyor. Bunu biraz açar mısınız?', type: 'verify', tips: ['Rakamlarla destekle', 'Süreci anlat', 'Rolünü netleştir'] },
            { q: 'Bu başarıyı nasıl ölçtünüz?', type: 'metrics', tips: ['Metrikler kullan', 'Before/After karşılaştır'] }
        ]
    },
    motivation: {
        category: 'Motivasyon',
        questions: [
            { q: 'Neden bu pozisyonu istiyorsunuz?', type: 'why_role', tips: ['Şirket araştırması yap', 'Kariyer hedeflerinle bağla'] },
            { q: '5 yıl sonra kendinizi nerede görüyorsunuz?', type: 'future', tips: ['Gerçekçi ol', 'Pozisyonla bağla', 'Gelişim planını anlat'] },
            { q: 'En güçlü ve en zayıf yönleriniz neler?', type: 'strength_weakness', tips: ['Zayıflığı geliştirmeye bağla', 'Somut örnekler ver'] }
        ]
    },
    salary: {
        category: 'Maaş ve Beklentiler',
        questions: [
            { q: 'Maaş beklentiniz nedir?', type: 'salary', tips: ['Araştırma yap', 'Aralık ver', 'Değerini bildir'] },
            { q: 'Ne zaman başlayabilirsiniz?', type: 'availability', tips: ['Gerçekçi ol', 'Mevcut ihbar süresini belirt'] }
        ]
    }
};

// STAR Method template for answer structuring
const STAR_STRUCTURE = {
    S: { name: 'Situation', description: 'Durumu tanımla', weight: 20 },
    T: { name: 'Task', description: 'Görevin ne olduğunu açıkla', weight: 20 },
    A: { name: 'Action', description: 'Ne yaptığını anlat', weight: 35 },
    R: { name: 'Result', description: 'Sonuçları paylaş', weight: 25 }
};

// Answer quality keywords
const QUALITY_KEYWORDS = {
    positive: ['başardım', 'geliştirdim', 'artırdım', 'çözdüm', 'optimize ettim', 'liderlik ettim', 'inisiyatif aldım', 'öğrendim', '%', 'kişi', 'proje'],
    negative: ['bilmiyorum', 'yapamadım', 'suç', 'nefret', 'kötü', 'berbat'],
    structure: ['öncelikle', 'ardından', 'sonuç olarak', 'bunun sonucunda', 'bu sayede']
};

// POST /api/interview/generate-questions - Generate CV-based questions
router.post('/generate-questions', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Check premium
        const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'pro';
        if (!isPremium) {
            return res.status(403).json({
                error: 'Bu özellik Premium abonelik gerektirir',
                requiresPremium: true,
                upgradeUrl: '/pricing'
            });
        }

        const { cvData, targetPosition, difficulty } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verisi gerekli' });
        }

        const questions = generateCVBasedQuestions(cvData, targetPosition, difficulty || 'medium');

        res.json({
            success: true,
            questions,
            totalQuestions: questions.length,
            starMethod: STAR_STRUCTURE
        });

    } catch (error) {
        console.error('Question generation error:', error);
        res.status(500).json({ error: 'Sorular oluşturulamadı' });
    }
});

// POST /api/interview/evaluate-answer - Evaluate user's answer
router.post('/evaluate-answer', authenticate, async (req, res) => {
    try {
        const { question, answer, questionType } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: 'Soru ve cevap gerekli' });
        }

        const evaluation = evaluateAnswer(answer, questionType);

        res.json({
            success: true,
            evaluation
        });

    } catch (error) {
        console.error('Answer evaluation error:', error);
        res.status(500).json({ error: 'Cevap değerlendirilemedi' });
    }
});

// POST /api/interview/complete-session - Save session results
router.post('/complete-session', authenticate, async (req, res) => {
    try {
        const { questions, answers, scores, targetPosition } = req.body;

        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        // Save session to user history (optional)
        await User.findByIdAndUpdate(req.user.id, {
            $push: {
                'interviewSessions': {
                    date: new Date(),
                    targetPosition,
                    questionsCount: questions.length,
                    averageScore: Math.round(averageScore),
                    scores
                }
            }
        });

        res.json({
            success: true,
            summary: {
                totalQuestions: questions.length,
                averageScore: Math.round(averageScore),
                grade: getGrade(averageScore),
                strengths: identifyStrengths(questions, scores),
                improvements: identifyImprovements(questions, scores)
            }
        });

    } catch (error) {
        console.error('Session completion error:', error);
        res.status(500).json({ error: 'Oturum kaydedilemedi' });
    }
});

// GET /api/interview/history - Get user's interview practice history
router.get('/history', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const sessions = user.interviewSessions || [];

        res.json({
            success: true,
            sessions: sessions.slice(-10).reverse(),
            totalSessions: sessions.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Geçmiş alınamadı' });
    }
});

// ============ Question Generation Logic ============

function generateCVBasedQuestions(cvData, targetPosition, difficulty) {
    const questions = [];

    // Extract CV data
    const experiences = cvData?.experience || [];
    const skills = extractSkills(cvData);
    const education = cvData?.education || [];
    const personal = cvData?.personal || cvData?.personalInfo || {};

    // 1. Analyze experience gaps
    const gaps = findExperienceGaps(experiences);
    if (gaps.length > 0) {
        const gapQ = { ...QUESTION_TEMPLATES.experience_gap.questions[0] };
        gapQ.q = gapQ.q.replace('{gap_period}', gaps[0]);
        gapQ.category = QUESTION_TEMPLATES.experience_gap.category;
        gapQ.difficulty = 'hard';
        questions.push(gapQ);
    }

    // 2. Technical questions based on skills
    if (skills.length > 0) {
        const topSkills = skills.slice(0, 3);
        topSkills.forEach((skill, i) => {
            const template = QUESTION_TEMPLATES.technical.questions[0];
            questions.push({
                q: template.q.replace('{skill}', skill),
                type: template.type,
                tips: template.tips,
                category: QUESTION_TEMPLATES.technical.category,
                skill,
                difficulty: i === 0 ? 'hard' : 'medium'
            });
        });
    }

    // 3. Achievement verification (look for numbers/claims)
    const achievements = findAchievements(experiences);
    if (achievements.length > 0) {
        const template = QUESTION_TEMPLATES.achievement.questions[0];
        questions.push({
            q: template.q.replace('{achievement}', achievements[0]),
            type: template.type,
            tips: template.tips,
            category: QUESTION_TEMPLATES.achievement.category,
            difficulty: 'medium'
        });
    }

    // 4. Behavioral questions
    const behavioralQuestions = QUESTION_TEMPLATES.behavioral.questions;
    const selectedBehavioral = behavioralQuestions.slice(0, 2);
    selectedBehavioral.forEach(bq => {
        questions.push({
            ...bq,
            category: QUESTION_TEMPLATES.behavioral.category,
            difficulty: 'medium'
        });
    });

    // 5. Motivation question (if target position provided)
    if (targetPosition) {
        questions.push({
            q: `${targetPosition} pozisyonunda kendinizi nasıl görüyorsunuz?`,
            type: 'motivation',
            tips: ['Pozisyonun gereksinimlerini araştır', 'Kendi hedeflerinle bağla'],
            category: QUESTION_TEMPLATES.motivation.category,
            difficulty: 'easy'
        });
    }

    // 6. Strength/Weakness (always included)
    questions.push({
        q: 'En güçlü ve en zayıf yönleriniz neler?',
        type: 'strength_weakness',
        tips: ['Zayıflığı geliştirmeye bağla', 'Güçlü yanları işle uyumla'],
        category: QUESTION_TEMPLATES.motivation.category,
        difficulty: 'medium'
    });

    // Filter by difficulty if needed
    let finalQuestions = questions;
    if (difficulty === 'easy') {
        finalQuestions = questions.filter(q => q.difficulty !== 'hard').slice(0, 5);
    } else if (difficulty === 'hard') {
        finalQuestions = questions.filter(q => q.difficulty !== 'easy').slice(0, 7);
    } else {
        finalQuestions = questions.slice(0, 6);
    }

    return finalQuestions.map((q, i) => ({ id: i + 1, ...q }));
}

function extractSkills(cvData) {
    const skills = cvData?.skills || [];
    return skills.map(s => typeof s === 'string' ? s : s.name || s.skill || '').filter(Boolean);
}

function findExperienceGaps(experiences) {
    const gaps = [];
    const sorted = experiences
        .filter(e => e.startDate)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    for (let i = 0; i < sorted.length - 1; i++) {
        const end = sorted[i].endDate ? new Date(sorted[i].endDate) : new Date();
        const nextStart = new Date(sorted[i + 1].startDate);
        const gapMonths = (nextStart - end) / (1000 * 60 * 60 * 24 * 30);

        if (gapMonths > 6) {
            const gapYears = Math.round(gapMonths / 12);
            gaps.push(gapYears > 0 ? `${gapYears} yıl` : `${Math.round(gapMonths)} ay`);
        }
    }

    return gaps;
}

function findAchievements(experiences) {
    const achievements = [];

    experiences.forEach(exp => {
        const desc = exp.description || '';
        // Look for quantified claims
        const patterns = [
            /(\d+%[^.]*)/gi,
            /(\d+\s*(kişi|proje|müşteri)[^.]*)/gi,
            /(liderlik[^.]*)/gi,
            /(ödül[^.]*)/gi
        ];

        patterns.forEach(pattern => {
            const matches = desc.match(pattern);
            if (matches) {
                achievements.push(...matches.map(m => m.trim().substring(0, 80)));
            }
        });
    });

    return [...new Set(achievements)].slice(0, 3);
}

// ============ Answer Evaluation Logic ============

function evaluateAnswer(answer, questionType) {
    const scores = {
        length: 0,
        structure: 0,
        positivity: 0,
        specificity: 0
    };

    const words = answer.split(/\s+/);
    const wordCount = words.length;

    // Length score (ideal: 100-200 words)
    if (wordCount >= 100 && wordCount <= 200) scores.length = 100;
    else if (wordCount >= 50 && wordCount < 100) scores.length = 70;
    else if (wordCount >= 200 && wordCount <= 300) scores.length = 80;
    else if (wordCount < 50) scores.length = 30;
    else scores.length = 60;

    // Structure score (uses STAR-like structure)
    const lowerAnswer = answer.toLowerCase();
    QUALITY_KEYWORDS.structure.forEach(keyword => {
        if (lowerAnswer.includes(keyword)) scores.structure += 20;
    });
    scores.structure = Math.min(100, scores.structure);

    // Positivity score
    let positiveCount = 0;
    let negativeCount = 0;
    QUALITY_KEYWORDS.positive.forEach(kw => {
        if (lowerAnswer.includes(kw)) positiveCount++;
    });
    QUALITY_KEYWORDS.negative.forEach(kw => {
        if (lowerAnswer.includes(kw)) negativeCount++;
    });
    scores.positivity = Math.min(100, Math.max(0, 50 + (positiveCount * 10) - (negativeCount * 20)));

    // Specificity score (numbers, names, concrete details)
    const hasNumbers = /\d+/.test(answer);
    const hasQuotes = /["']/.test(answer) || answer.includes('örneğin') || answer.includes('mesela');
    scores.specificity = (hasNumbers ? 40 : 0) + (hasQuotes ? 30 : 0) + (wordCount > 80 ? 30 : wordCount > 50 ? 20 : 10);
    scores.specificity = Math.min(100, scores.specificity);

    // Overall score
    const overallScore = Math.round(
        (scores.length * 0.2) +
        (scores.structure * 0.25) +
        (scores.positivity * 0.25) +
        (scores.specificity * 0.3)
    );

    // Feedback
    const feedback = [];
    if (scores.length < 50) feedback.push('Cevabınız çok kısa. Daha fazla detay ekleyin.');
    if (scores.structure < 50) feedback.push('STAR metodunu kullanarak cevabınızı yapılandırın.');
    if (scores.positivity < 60) feedback.push('Daha pozitif ve çözüm odaklı bir dil kullanın.');
    if (scores.specificity < 50) feedback.push('Somut rakamlar ve örnekler ekleyin.');

    if (feedback.length === 0) {
        feedback.push('Harika bir cevap! Yapı, uzunluk ve içerik dengeli.');
    }

    return {
        overallScore,
        scores,
        feedback,
        wordCount,
        grade: getGrade(overallScore),
        tips: generateTips(scores)
    };
}

function getGrade(score) {
    if (score >= 90) return { letter: 'A+', label: 'Mükemmel', color: 'green' };
    if (score >= 80) return { letter: 'A', label: 'Çok İyi', color: 'green' };
    if (score >= 70) return { letter: 'B', label: 'İyi', color: 'cyan' };
    if (score >= 60) return { letter: 'C', label: 'Orta', color: 'amber' };
    if (score >= 50) return { letter: 'D', label: 'Geliştirmeli', color: 'orange' };
    return { letter: 'F', label: 'Zayıf', color: 'red' };
}

function generateTips(scores) {
    const tips = [];
    if (scores.structure < 60) {
        tips.push({
            title: 'STAR Metodunu Kullan',
            description: 'Situation → Task → Action → Result yapısıyla cevapla'
        });
    }
    if (scores.specificity < 60) {
        tips.push({
            title: 'Somutlaştır',
            description: 'Rakamlar ve spesifik örnekler ekle (%30 artış, 5 kişilik ekip)'
        });
    }
    return tips;
}

function identifyStrengths(questions, scores) {
    const strengths = [];
    scores.forEach((score, i) => {
        if (score >= 75) {
            strengths.push(questions[i]?.category || `Soru ${i + 1}`);
        }
    });
    return [...new Set(strengths)].slice(0, 3);
}

function identifyImprovements(questions, scores) {
    const improvements = [];
    scores.forEach((score, i) => {
        if (score < 60) {
            improvements.push(questions[i]?.category || `Soru ${i + 1}`);
        }
    });
    return [...new Set(improvements)].slice(0, 3);
}

module.exports = router;
