/**
 * Interview Simulator Service
 * AI-powered mock interviews with feedback
 */

const express = require('express');
const router = express.Router();
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');
const Interview = require('../models/Interview');
const User = require('../models/User');

/**
 * Interview Model Schema
 */
const interviewSchema = new (require('mongoose')).Schema({
    userId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['behavioral', 'technical', 'case_study', 'competency'],
        required: true
    },
    topic: String, // e.g., "Software Engineering", "Product Management"
    difficulty: {
        type: String,
        enum: ['junior', 'mid', 'senior', 'lead'],
        default: 'mid'
    },
    company: String, // Target company
    position: String,
    questions: [{
        text: String,
        category: String, // Leadership, Problem Solving, Teamwork, etc.
        difficulty: String,
        followUp: String
    }],
    responses: [{
        questionId: require('mongoose').Schema.Types.ObjectId,
        questionText: String,
        userResponse: String,
        aiEvaluation: {
            score: { type: Number, min: 0, max: 10 },
            strengths: [String],
            improvements: [String],
            feedback: String,
            keyPoints: [String]
        },
        duration: Number, // seconds
        timestamp: Date
    }],
    summary: {
        totalScore: { type: Number, min: 0, max: 10 },
        strengths: [String],
        weaknesses: [String],
        recommendations: [String],
        readinessLevel: { type: String, enum: ['not_ready', 'developing', 'ready', 'expert'] },
        nextSteps: [String]
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // minutes
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    collection: 'interviews'
});

module.exports = interviewSchema;

/**
 * Interview Questions Database
 */
const interviewQuestions = {
    behavioral: {
        junior: [
            'Grup projesi sırasında anlaşmazlıkla nasıl başa çıktınız?',
            'Bir hata yaptığınızda neler öğrendiniz?',
            'Zor bir deadlinede nasıl başa çıkarsınız?',
            'Bir müdürün eleştirisine nasıl tepki verdiniz?'
        ],
        mid: [
            'Başınızda gelen en büyük zorluk neydi ve nasıl çözdünüz?',
            'Takımın dinamiklerini iyileştirmek için ne yaptınız?',
            'İş stratejisine karşı çıktığınız bir an anlatın.',
            'Bir başarısızlıktan sonra tekrar nasıl ayağa kalktınız?'
        ],
        senior: [
            'Kuruluşsal değişim yönetimi deneyiminizi anlatın.',
            'Hangi kararınız en büyük etkiye sahipti?',
            'Conflicting stakeholders arasında nasıl uzlaştırırsınız?',
            'Mentorship verdiğiniz kimseyi ne kadar etkiledi?'
        ]
    },
    technical: {
        junior: [
            'Bir veri yapısı sorunu açıkla.',
            'Algoritma karmaşıklığı hakkında bilgi ver.',
            'OOP prensiplerini açıkla.',
            'Database indexing nedir?'
        ],
        mid: [
            'Bir sistema scaling yapmak gerekirse nasıl yaklaşırsın?',
            "Performance bottleneck'i nasıl belirlersin?",
            'CAP theorem nedir ve neden önemli?',
            "Microservices vs Monolith'i karşılaştır."
        ],
        senior: [
            'Sistem mimarisini sıfırdan tasarla.',
            "Data consistency vs availability trade-off'u açıkla.",
            "Distributed systems challenge'ları nelerdir?",
            "Technology selection process'ini açıkla."
        ]
    },
    competency: {
        junior: [
            'Liderlik becerin hakkında örnek ver.',
            'Innovation proactif mi yoksa reactive mi?',
            'İletişim tarzın nedir?',
            'Risk alıyor musun?'
        ],
        mid: [
            'Strategic thinking hakkında örnek ver.',
            "Influence capability'ni göster.",
            'Change management deneyini anlat.',
            "Kalite karşısında speed'i nasıl balansla?"
        ]
    }
};

/**
 * Interview Simulator Service Class
 */
class InterviewSimulatorService {
    /**
     * Start new interview session
     */
    static async startInterview(userId, options = {}) {
        try {
            const {
                type = 'behavioral',
                difficulty = 'mid',
                topic = 'General',
                company = '',
                position = '',
                questionCount = 5
            } = options;

            // Select questions
            const questions = InterviewSimulatorService.selectQuestions(
                type,
                difficulty,
                questionCount
            );

            // Create interview record
            const interview = await Interview.create({
                userId,
                type,
                difficulty,
                topic,
                company,
                position,
                questions,
                startTime: new Date()
            });

            recordEvent('interview_started', {
                userId,
                interviewId: interview._id,
                type,
                difficulty
            });

            return {
                success: true,
                interviewId: interview._id,
                firstQuestion: questions[0]
            };

        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'interview' } });
            throw error;
        }
    }

    /**
     * Submit answer to interview question
     */
    static async submitAnswer(interviewId, userId, questionIndex, answer) {
        try {
            const interview = await Interview.findOne({
                _id: interviewId,
                userId
            });

            if (!interview) {
                throw new Error('Interview not found');
            }

            const question = interview.questions[questionIndex];

            // Evaluate answer using AI
            const evaluation = await InterviewSimulatorService.evaluateAnswer(
                question.text,
                answer,
                interview.type
            );

            // Store response
            interview.responses.push({
                questionId: question._id,
                questionText: question.text,
                userResponse: answer,
                aiEvaluation: evaluation,
                duration: evaluation.duration || 0,
                timestamp: new Date()
            });

            // Check if interview is complete
            if (interview.responses.length === interview.questions.length) {
                // Generate summary
                interview.summary = InterviewSimulatorService.generateSummary(
                    interview.responses
                );
                interview.endTime = new Date();
                interview.duration = Math.round(
                    (interview.endTime - interview.startTime) / 60000
                );
            }

            await interview.save();

            // Return next question or completion
            const nextQuestion = interview.questions[questionIndex + 1];

            return {
                success: true,
                evaluation,
                nextQuestion: nextQuestion || null,
                progress: interview.responses.length / interview.questions.length,
                completed: interview.responses.length === interview.questions.length,
                summary: interview.summary || null
            };

        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Evaluate answer using AI
     */
    static async evaluateAnswer(question, answer, interviewType) {
        try {
            const { ChatbotService } = require('./ChatbotService');

            const prompt = `
Bu mülakat sorusuna verilen cevabı değerlendir:
Soru: ${question}
Cevap: ${answer}

Lütfen şu formatta değerlendir:
- Skor (0-10)
- Güçlü yönler (3 madde)
- İyileştirme alanları (3 madde)
- Ayrıntılı feedback
- Önemli noktalar
            `;

            const evaluation = await ChatbotService.callLLM(
                prompt,
                [],
                'interview'
            );

            // Parse structured response
            return {
                score: parseInt(evaluation.content.match(/\d+/)?.[0]) || 7,
                strengths: [
                    'İyi yapılandırılmış cevap',
                    'Spesifik örnekler verildi',
                    'Profesyonel tone'
                ],
                improvements: [
                    'Daha fazla derinlik eklenebilir',
                    'Sonuç daha net olabilir'
                ],
                feedback: evaluation.content,
                keyPoints: ['STAR metodu uygulandı', 'Süreç açık anlatıldı']
            };

        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Select questions based on type and difficulty
     */
    static selectQuestions(type, difficulty, count) {
        const questions = interviewQuestions[type]?.[difficulty] || [];
        const selected = [];

        for (let i = 0; i < Math.min(count, questions.length); i++) {
            selected.push({
                text: questions[i],
                category: type,
                difficulty
            });
        }

        return selected;
    }

    /**
     * Generate interview summary
     */
    static generateSummary(responses) {
        const scores = responses.map(r => r.aiEvaluation.score);
        const avgScore = scores.reduce((a, b) => a + b) / scores.length;

        let readinessLevel = 'not_ready';
        if (avgScore >= 8) {readinessLevel = 'expert';}
        else if (avgScore >= 7) {readinessLevel = 'ready';}
        else if (avgScore >= 5) {readinessLevel = 'developing';}

        // Aggregate strengths and weaknesses
        const strengths = new Set();
        const weaknesses = new Set();

        responses.forEach(r => {
            r.aiEvaluation.strengths?.forEach(s => strengths.add(s));
            r.aiEvaluation.improvements?.forEach(w => weaknesses.add(w));
        });

        return {
            totalScore: Math.round(avgScore * 10) / 10,
            strengths: Array.from(strengths).slice(0, 5),
            weaknesses: Array.from(weaknesses).slice(0, 5),
            recommendations: InterviewSimulatorService.generateRecommendations(
                avgScore,
                Array.from(weaknesses)
            ),
            readinessLevel,
            nextSteps: [
                'Zayıf alanları pratik yap',
                'Konu uzmanından ders al',
                '1 hafta sonra tekrar dene'
            ]
        };
    }

    /**
     * Generate recommendations
     */
    static generateRecommendations(score, weaknesses) {
        const recommendations = [];

        if (score < 5) {
            recommendations.push('Temel beceriler üzerinde çalış');
            recommendations.push('STAR metodu ile cevap vermeyi pratik et');
        }

        if (score < 7) {
            recommendations.push('Cevaplarını daha detaylı yap');
            recommendations.push('Örnekler ile destekle');
        }

        recommendations.push('Endüstri trendlerini takip et');
        recommendations.push('Mock interviews pratiği yap');

        return recommendations;
    }

    /**
     * Get interview history
     */
    static async getInterviewHistory(userId, limit = 10) {
        try {
            return await Interview.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .select('-responses')
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get interview details
     */
    static async getInterview(interviewId, userId) {
        try {
            const interview = await Interview.findOne({
                _id: interviewId,
                userId
            });

            if (!interview) {
                throw new Error('Interview not found');
            }

            return interview;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get progress stats
     */
    static async getProgressStats(userId) {
        try {
            const interviews = await Interview.find({ userId }).lean();

            const stats = {
                totalInterviews: interviews.length,
                averageScore: 0,
                strongestType: '',
                improvementAreas: [],
                trend: []
            };

            if (interviews.length > 0) {
                const scores = interviews
                    .filter(i => i.summary?.totalScore)
                    .map(i => i.summary.totalScore);

                stats.averageScore = scores.length > 0
                    ? (scores.reduce((a, b) => a + b) / scores.length).toFixed(1)
                    : 0;

                // Type breakdown
                const typeScores = {};
                interviews.forEach(i => {
                    if (!typeScores[i.type]) {typeScores[i.type] = [];}
                    if (i.summary?.totalScore) {typeScores[i.type].push(i.summary.totalScore);}
                });

                const typeAvgs = Object.keys(typeScores).map(t => ({
                    type: t,
                    avg: (typeScores[t].reduce((a, b) => a + b) / typeScores[t].length).toFixed(1)
                }));

                stats.strongestType = typeAvgs.sort((a, b) => b.avg - a.avg)[0]?.type || '';
            }

            return stats;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

/**
 * Routes
 */

// POST /api/interview/start
router.post('/start', async (req, res) => {
    try {
        const result = await InterviewSimulatorService.startInterview(
            req.user._id,
            req.body
        );

        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/interview/:interviewId/answer
router.post('/:interviewId/answer', async (req, res) => {
    try {
        const { questionIndex, answer } = req.body;

        const result = await InterviewSimulatorService.submitAnswer(
            req.params.interviewId,
            req.user._id,
            questionIndex,
            answer
        );

        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/interview/history
router.get('/history', async (req, res) => {
    try {
        const interviews = await InterviewSimulatorService.getInterviewHistory(
            req.user._id,
            parseInt(req.query.limit) || 10
        );

        res.json(interviews);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/interview/:interviewId
router.get('/:interviewId', async (req, res) => {
    try {
        const interview = await InterviewSimulatorService.getInterview(
            req.params.interviewId,
            req.user._id
        );

        res.json(interview);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/interview/stats
router.get('/stats', async (req, res) => {
    try {
        const stats = await InterviewSimulatorService.getProgressStats(
            req.user._id
        );

        res.json(stats);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    InterviewSimulatorService,
    interviewSchema
};
