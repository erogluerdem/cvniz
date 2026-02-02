/**
 * AI Chatbot Service
 * Career coaching, Q&A, resume advice, interview prep
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Sentry = require('@sentry/node');
const { recordEvent } = require('../utils/logger');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

/**
 * Conversation Model Schema
 */
const conversationSchema = new (require('mongoose')).Schema({
    userId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        enum: ['resume', 'interview', 'career', 'job_search', 'ai_general'],
        default: 'ai_general'
    },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'] },
        content: String,
        timestamp: { type: Date, default: Date.now },
        tokens: Number,
        confidence: Number
    }],
    context: {
        cvId: require('mongoose').Schema.Types.ObjectId,
        jobId: require('mongoose').Schema.Types.ObjectId,
        interviewTopic: String
    },
    metadata: {
        language: { type: String, default: 'tr' },
        model: String,
        totalTokens: Number,
        costUSD: Number
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: Date
}, {
    collection: 'conversations'
});

module.exports = conversationSchema;

/**
 * System Prompts for different topics
 */
const systemPrompts = {
    resume: `Sen profesyonel bir CV danışmanısın. Kullanıcının CV'sini geliştirmesine yardımcı ol.
Yapacaklarını:
- CV formatı önerileri ver
- İçerik iyileştirme tavsiyesi yap
- Kelime seçimi öner
- Başarı göstergeleri tanımla
- ATS optimizasyonu tavsiye et

Ses tonu: Profesyonel, teşvik edici, pratik.`,

    interview: `Sen deneyimli bir mülakat koçusun. Kullanıcıyı mülakat için hazırlayacaksın.
Yapacaklarını:
- Yaygın mülakat soruları sor
- Cevapları değerlendir ve geribildirim ver
- Cesur karşı sorular tavsiye et
- Vücut dili ve beden dilini tartış
- Kaygı azaltma tekniklerini öğret

Ses tonu: Destekleyici, yapıcı, motivasyonlu.`,

    career: `Sen kariyer danışmanısın. Kullanıcının kariyer planlamasına yardımcı ol.
Yapacaklarını:
- Kariyer yolları keşfetmesine yardım et
- Beceri geliştirme planları oluştur
- İş değişikliği stratejileri öner
- Menajerlik öğrenmesini destekle
- Kariyer kriz yönetimi danışlığı ver

Ses tonu: İlham verici, bilgili, destekleyici.`,

    job_search: `Sen iş arama uzmanısın. Kullanıcının ideal iş bulmasına yardımcı ol.
Yapacaklarını:
- İş arama stratejileri öner
- Hantalı başvuru yazıları iyileştir
- Beklenen maaşları araştır
- Şirketleri araştırma yöntemleri öğret
- Röportaj pazarlama stratejileri ver

Ses tonu: Enerjik, pratik, başarıya odaklı.`,

    ai_general: `Sen CVniz AI asistanısın. Kariyer ve profesyonel gelişimle ilgili her konuda yardımcı ol.
Yapacaklarını:
- Sorulara kapsamlı cevaplar ver
- İlgili CVniz özelliklerine bağlantı ver
- Kişiselleştirilmiş tavsiye ver
- Eylem planları oluştur
- İlerlemeyi takip et

Ses tonu: Samimi, yardımsever, profesyonel.`
};

/**
 * AI Chatbot Service Class
 */
class ChatbotService {
    /**
     * Send message to chatbot
     */
    static async chat(userId, message, topic = 'ai_general', context = {}) {
        try {
            // Get or create conversation
            let conversation = await Conversation.findOne({
                userId,
                topic
            }).sort({ createdAt: -1 });

            if (!conversation) {
                conversation = await Conversation.create({
                    userId,
                    topic,
                    context,
                    messages: []
                });
            }

            // Add user message
            conversation.messages.push({
                role: 'user',
                content: message,
                timestamp: new Date()
            });

            // Call OpenAI API (or similar)
            const response = await ChatbotService.callLLM(
                message,
                conversation.messages.slice(0, -1),
                topic,
                systemPrompts[topic]
            );

            // Add assistant message
            conversation.messages.push({
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
                tokens: response.tokens,
                confidence: response.confidence || 0.95
            });

            // Update metadata
            conversation.metadata.model = 'gpt-4-turbo';
            conversation.metadata.totalTokens = (conversation.metadata.totalTokens || 0) + response.totalTokens;
            conversation.metadata.costUSD = conversation.metadata.totalTokens * 0.00003;
            conversation.updatedAt = new Date();

            await conversation.save();

            // Log event
            recordEvent('chatbot_message', {
                userId,
                topic,
                messageLength: message.length,
                responseLength: response.content.length,
                tokens: response.totalTokens
            });

            return {
                success: true,
                response: response.content,
                conversationId: conversation._id,
                messageCount: conversation.messages.length
            };

        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'chatbot' } });
            console.error('Chatbot error:', error);
            throw error;
        }
    }

    /**
     * Call LLM (OpenAI, Claude, etc.)
     */
    static async callLLM(userMessage, history = [], topic = 'ai_general', systemPrompt) {
        try {
            // Format conversation history
            const messages = [
                { role: 'system', content: systemPrompt },
                ...history.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                { role: 'user', content: userMessage }
            ];

            // Call OpenAI API
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4-turbo-preview',
                    messages,
                    temperature: 0.7,
                    max_tokens: 1000,
                    top_p: 0.9
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                content: response.data.choices[0].message.content,
                tokens: response.data.usage.completion_tokens,
                totalTokens: response.data.usage.total_tokens,
                confidence: 0.95
            };

        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Get conversation history
     */
    static async getConversation(userId, conversationId) {
        try {
            const conversation = await Conversation.findOne({
                _id: conversationId,
                userId
            });

            if (!conversation) {
                throw new Error('Conversation not found');
            }

            return conversation;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * List user conversations
     */
    static async listConversations(userId, limit = 20) {
        try {
            return await Conversation.find({ userId })
                .sort({ updatedAt: -1 })
                .limit(limit)
                .select('-messages')
                .lean();
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Delete conversation
     */
    static async deleteConversation(userId, conversationId) {
        try {
            const result = await Conversation.deleteOne({
                _id: conversationId,
                userId
            });

            recordEvent('chatbot_conversation_deleted', {
                userId,
                conversationId
            });

            return result;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Export conversation as PDF
     */
    static async exportConversation(conversationId) {
        try {
            const conversation = await Conversation.findById(conversationId);

            // Generate PDF with conversation
            // TODO: Implement PDF generation

            return {
                success: true,
                format: 'pdf'
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

// POST /api/chatbot/chat
router.post('/chat', async (req, res) => {
    try {
        const { message, topic = 'ai_general', context } = req.body;

        const result = await ChatbotService.chat(
            req.user._id,
            message,
            topic,
            context
        );

        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/chatbot/conversations
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await ChatbotService.listConversations(
            req.user._id,
            parseInt(req.query.limit) || 20
        );

        res.json(conversations);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/chatbot/conversations/:conversationId
router.get('/conversations/:conversationId', async (req, res) => {
    try {
        const conversation = await ChatbotService.getConversation(
            req.user._id,
            req.params.conversationId
        );

        res.json(conversation);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/chatbot/conversations/:conversationId
router.delete('/conversations/:conversationId', async (req, res) => {
    try {
        await ChatbotService.deleteConversation(
            req.user._id,
            req.params.conversationId
        );

        res.json({ success: true });
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

// POST /api/chatbot/export/:conversationId
router.post('/export/:conversationId', async (req, res) => {
    try {
        const result = await ChatbotService.exportConversation(
            req.params.conversationId
        );

        res.json(result);
    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    router,
    ChatbotService,
    conversationSchema
};
