const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AISettings = require('../models/AISettings');

class AIService {
    constructor() {
        this.client = null;
        this.provider = null;
        this.modelName = null;
    }

    async getConfig() {
        try {
            const settings = await AISettings.findOne();
            if (settings && settings.apiKey && settings.enabled) {
                return {
                    apiKey: settings.apiKey,
                    model: settings.model || 'gpt-3.5-turbo',
                    provider: settings.provider
                };
            }
        } catch (error) {
            console.error('Error fetching AI Settings:', error);
        }

        // Fallback to Env
        if (process.env.OPENAI_API_KEY) {
            return {
                apiKey: process.env.OPENAI_API_KEY,
                model: 'gpt-3.5-turbo',
                provider: 'openai'
            };
        }

        if (process.env.GOOGLE_API_KEY) {
            return {
                apiKey: process.env.GOOGLE_API_KEY,
                model: 'gemini-1.5-flash', // Default for Google
                provider: 'google'
            };
        }

        return null;
    }

    async getClient() {
        // Always refresh config to support dynamic changes
        const config = await this.getConfig();
        if (!config || !config.apiKey) return null;

        // If the client is already initialized with the current config, return it
        if (this.client && this.provider === config.provider && this.modelName === config.model) {
            return this.client;
        }

        if (config.provider === 'google') {
            this.client = new GoogleGenerativeAI(config.apiKey);
            this.provider = 'google';
            this.modelName = config.model || 'gemini-1.5-flash';
        } else { // Default to openai
            this.client = new OpenAI({ apiKey: config.apiKey });
            this.provider = 'openai';
            this.modelName = config.model || 'gpt-3.5-turbo';
        }
        return this.client;
    }

    async generateSummary(jobTitle, experienceLevel, lang = 'tr') {
        const client = await this.getClient();
        if (!client) return this.mockSummary(jobTitle);

        const prompt = lang === 'tr'
            ? `${jobTitle} pozisyonunda ${experienceLevel} seviyesinde bir çalışan için CV özeti (Professional Summary) yaz. 3 farklı kısa paragraf (max 50 kelime) üret. JSON formatında 'options' array'i dön. Yanıtın sadece JSON olsun.`
            : `Write a professional CV summary for a ${experienceLevel} ${jobTitle}. Generate 3 different short paragraphs (max 50 words). Return a JSON object with an 'options' array. Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async improveText(text, lang = 'tr') {
        const client = await this.getClient();
        if (!client) return { options: [text, text + " (Improved)", text + " (Professional)"] };

        const prompt = lang === 'tr'
            ? `Aşağıdaki metni CV için daha profesyonel, kurumsal ve etkileyici hale getir. 3 farklı varyasyon üret. JSON formatında 'options' array'i dön:\n\n"${text}"\n\nSadece JSON dön.`
            : `Rewrite the following text to be more professional and impactful for a CV. Generate 3 variations. Return a JSON object with an 'options' array:\n\n"${text}"\n\nReturn only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async generateExperience(jobTitle, lang = 'tr') {
        const client = await this.getClient();
        if (!client) return this.mockExperience(jobTitle);

        const prompt = lang === 'tr'
            ? `${jobTitle} pozisyonu için CV'de kullanılabilecek 5 adet etkileyici iş deneyimi maddesi (bullet point) yaz. Başarı odaklı olsun. JSON formatında 'options' array'i dön. Sadece JSON dön.`
            : `Generate 5 impressive bullet points for a ${jobTitle} role on a CV. Focus on achievements. Return a JSON object with an 'options' array. Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async callOpenAI(client, prompt) {
        try {
            const completion = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful career assistant. Return only valid JSON." },
                    { role: "user", content: prompt }
                ],
                model: this.modelName || "gpt-3.5-turbo",
                response_format: { type: "json_object" },
            });

            const content = completion.choices[0].message.content;
            return JSON.parse(content);
        } catch (error) {
            console.error('OpenAI Error:', error);
            return { error: 'AI generation failed', options: [] };
        }
    }

    async callGoogle(prompt) {
        try {
            const model = this.client.getGenerativeModel({
                model: this.modelName || "gemini-1.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return JSON.parse(text);
        } catch (error) {
            console.error('Gemini Error:', error);
            return { error: 'AI generation failed', options: [] };
        }
    }

    mockSummary(jobTitle) {
        return {
            mock: true,
            options: [
                `${jobTitle} olarak 5+ yıl deneyimli, sonuç odaklı profesyonel.`,
                `Yaratıcı ve analitik düşünen, takım çalışmasına yatkın ${jobTitle}.`,
                `Sektör trendlerini takip eden, kendini sürekli geliştiren ${jobTitle}.`
            ]
        };
    }

    mockExperience(jobTitle) {
        return {
            mock: true,
            options: [
                `${jobTitle} süreçlerini optimize ederek verimliliği %20 artırdım.`,
                `Cross-functional ekiplerle çalışarak projeleri zamanında teslim ettim.`,
                `Müşteri memnuniyetini artırmaya yönelik stratejiler geliştirdim.`,
                `Yeni teknolojileri entegre ederek maliyetleri düşürdüm.`,
                `Ekip içi eğitimler vererek performansı yükselttim.`
            ]
        };
    }
}

module.exports = new AIService();
