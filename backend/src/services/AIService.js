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
        if (!config || !config.apiKey) {return null;}

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
        if (!client) {return this.mockSummary(jobTitle);}

        const prompt = lang === 'tr'
            ? `${jobTitle} pozisyonunda ${experienceLevel} seviyesinde bir çalışan için CV özeti (Professional Summary) yaz. 3 farklı kısa paragraf (max 50 kelime) üret. JSON formatında 'options' array'i dön. Yanıtın sadece JSON olsun.`
            : `Write a professional CV summary for a ${experienceLevel} ${jobTitle}. Generate 3 different short paragraphs (max 50 words). Return a JSON object with an 'options' array. Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async improveText(text, lang = 'tr', mode = 'professional') {
        const client = await this.getClient();
        if (!client) {return { options: [text, text + ' (Improved)', text + ' (Professional)'] };}

        let instruction = '';
        if (lang === 'tr') {
            switch (mode) {
            case 'fix_grammar': instruction = 'Gramer hatalarını düzelt ve akıcılığı artır.'; break;
            case 'shorter': instruction = 'Metni daha kısa ve öz hale getir.'; break;
            case 'longer': instruction = 'Metni daha detaylı ve açıklayıcı hale getir.'; break;
            case 'professional': default: instruction = 'Metni CV için daha profesyonel, kurumsal ve etkileyici hale getir.'; break;
            }
        } else {
            switch (mode) {
            case 'fix_grammar': instruction = 'Fix grammar errors and improve flow.'; break;
            case 'shorter': instruction = 'Make the text shorter and more concise.'; break;
            case 'longer': instruction = 'Make the text more detailed and descriptive.'; break;
            case 'professional': default: instruction = 'Make the text more professional and impactful for a CV.'; break;
            }
        }

        const prompt = lang === 'tr'
            ? `${instruction} 3 farklı varyasyon üret. JSON formatında 'options' array'i dön. Metin: "${text}"\n\nSadece JSON dön.`
            : `${instruction} Generate 3 variations. Return a JSON object with an 'options' array. Text: "${text}"\n\nReturn only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async generateCoverLetter(params) {
        const { jobTitle, company, tone, cvData, lang = 'tr' } = params;
        const client = await this.getClient();

        if (!client) {
            return { error: 'AI_NOT_CONFIGURED', message: 'AI servisi yapılandırılmamış.' };
        }

        const candidateName = cvData?.personal?.fullName || (lang === 'tr' ? 'Aday' : 'Candidate');
        const experience = cvData?.experience || [];
        const skills = cvData?.skills || [];

        const prompt = lang === 'tr'
            ? `Sen profesyonel bir CV ve Ön Yazı uzmanısın. Aşağıdaki bilgilere göre "${company}" şirketindeki "${jobTitle}" pozisyonu için etkileyici bir ön yazı (cover letter) yaz.
            
            ADAY BİLGİLERİ:
            Ad: ${candidateName}
            Deneyim: ${JSON.stringify(experience.slice(0, 2))}
            Yetenekler: ${JSON.stringify(skills.slice(0, 8))}
            
            TON: ${tone || 'Kurumsal'} (Resmi, Samimi veya Özgüvenli olabilir)
            
            KURALLAR:
            1. Ön yazı "Sayın Yetkili" veya benzeri uygun bir hitapla başlasın.
            2. 3-4 paragraf olsun.
            3. Adayın deneyimlerini iş ilanıyla ilişkilendir.
            4. Şablonsal ifadelerden kaçın, özgün olsun.
            5. JSON formatında "content" alanı içinde tek bir string olarak dön. Satır sonları için \\n kullan. Sadece JSON dön.`

            : `You are a professional CV writer. Write an impressive cover letter for the "${jobTitle}" position at "${company}".
            
            CANDIDATE INFO:
            Name: ${candidateName}
            Experience: ${JSON.stringify(experience.slice(0, 2))}
            Skills: ${JSON.stringify(skills.slice(0, 8))}
            
            TONE: ${tone || 'Professional'}
            
            RULES:
            1. Start with appropriate greeting.
            2. 3-4 paragraphs.
            3. Connect experience to the job.
            4. Return a JSON object with a single "content" field containing the letter. Use \\n for newlines. Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async generateExperience(jobTitle, lang = 'tr') {
        const client = await this.getClient();
        if (!client) {return this.mockExperience(jobTitle);}

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
                    { role: 'system', content: 'You are a helpful career assistant. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                model: this.modelName || 'gpt-3.5-turbo',
                response_format: { type: 'json_object' }
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
                model: this.modelName || 'gemini-1.5-flash',
                generationConfig: { responseMimeType: 'application/json' }
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
                'Cross-functional ekiplerle çalışarak projeleri zamanında teslim ettim.',
                'Müşteri memnuniyetini artırmaya yönelik stratejiler geliştirdim.',
                'Yeni teknolojileri entegre ederek maliyetleri düşürdüm.',
                'Ekip içi eğitimler vererek performansı yükselttim.'
            ]
        };
    }

    // ============================================
    // PHASE 2: NEW AI FEATURES
    // ============================================

    /**
     * Interview Preparation - Potential questions and answers
     */
    async generateInterviewPrep(jobTitle, experience, lang = 'tr') {
        const client = await this.getClient();
        if (!client) {return this.mockInterviewPrep(jobTitle);}

        const prompt = lang === 'tr'
            ? `Sen senior insan kaynakları danışmanısın. "${jobTitle}" pozisyonu için mülakat öncesi hazırlık materyali oluştur.
            
            ADAYIN DENEYİMİ: ${experience}
            
            JSON formatında aşağıdaki yapıda dön:
            {
              "likely_questions": ["Soru 1", "Soru 2", ...],
              "answer_tips": ["İpucu 1", "İpucu 2", ...],
              "body_language": "Vücut dili önerileri",
              "common_mistakes": ["Hata 1", "Hata 2", ...],
              "closing_questions": ["Kapanış sorusu 1", ...]
            }
            
            Sadece JSON dön.`
            : `You are a senior HR consultant. Create interview preparation materials for a ${jobTitle} position.
            
            Return a JSON object with:
            {
              "likely_questions": ["Question 1", "Question 2", ...],
              "answer_tips": ["Tip 1", "Tip 2", ...],
              "body_language": "Body language tips",
              "common_mistakes": ["Mistake 1", ...],
              "closing_questions": ["Question to ask them 1", ...]
            }
            
            Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    /**
     * Skill Gap Analysis - Identify missing skills for job target
     */
    async analyzeSkillGap(currentSkills, targetJobTitle, lang = 'tr') {
        const client = await this.getClient();
        if (!client) {return this.mockSkillGap(targetJobTitle);}

        const skillsList = Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills;

        const prompt = lang === 'tr'
            ? `Kariyer danışmanı olarak "${targetJobTitle}" pozisyonu için yetenek analizi yap.
            
            MEVCUT YETENEKLERİ: ${skillsList}
            
            JSON formatında dön:
            {
              "gap_analysis": "Genel analiz (2-3 cümle)",
              "missing_skills": [
                { "skill": "Yetenek adı", "importance": "critical|high|medium", "learning_time": "2 hafta" }
              ],
              "strength_skills": ["Güçlü yetenek 1", ...],
              "learning_path": ["Adım 1: ...", "Adım 2: ..."],
              "resources": ["Kaynak 1 (tür)", "Kaynak 2 (tür)"],
              "score": "0-100 arası uyum puanı"
            }
            
            Sadece JSON dön.`
            : `As a career consultant, analyze skill gaps for a ${targetJobTitle} position.
            
            Current Skills: ${skillsList}
            
            Return JSON with:
            {
              "gap_analysis": "General analysis",
              "missing_skills": [
                { "skill": "Skill name", "importance": "critical|high|medium", "learning_time": "2 weeks" }
              ],
              "strength_skills": ["Strength 1", ...],
              "learning_path": ["Step 1: ...", "Step 2: ..."],
              "resources": ["Resource 1 (type)", ...],
              "score": "Match score 0-100"
            }
            
            Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    /**
     * CV Score Analysis - Rate CV completeness and quality
     */
    async analyzeCVScore(cvData, lang = 'tr') {
        const client = await this.getClient();
        if (!client) {return this.mockCVScore();}

        const cvSummary = {
            hasPersonal: !!cvData?.personal,
            hasPhoto: !!cvData?.personal?.photo,
            experienceCount: cvData?.experience?.length || 0,
            skillsCount: cvData?.skills?.length || 0,
            educationCount: cvData?.education?.length || 0,
            hasLanguages: !!cvData?.languages?.length,
            hasCertifications: !!cvData?.certifications?.length
        };

        const prompt = lang === 'tr'
            ? `CV kalite değerlendirmeci olarak verilen CV'yi analiz et.
            
            CV İçeriği:
            ${JSON.stringify(cvSummary, null, 2)}
            
            JSON formatında dön:
            {
              "overall_score": "0-100 arası puan",
              "category_scores": {
                "personal_info": "Puan",
                "experience": "Puan",
                "skills": "Puan",
                "education": "Puan",
                "presentation": "Puan"
              },
              "strengths": ["Güçlü taraf 1", ...],
              "improvements": [
                { "area": "İyileştirilecek alan", "suggestion": "Spesifik öneriler" }
              ],
              "estimated_response_rate": "Tahmini başvuru geri dönüş oranı (%)"
            }
            
            Sadece JSON dön.`
            : `As a CV evaluator, analyze the provided CV.
            
            CV Structure:
            ${JSON.stringify(cvSummary, null, 2)}
            
            Return JSON with:
            {
              "overall_score": "Score 0-100",
              "category_scores": {
                "personal_info": "Score",
                "experience": "Score",
                "skills": "Score",
                "education": "Score",
                "presentation": "Score"
              },
              "strengths": ["Strength 1", ...],
              "improvements": [
                { "area": "Area to improve", "suggestion": "Specific recommendations" }
              ],
              "estimated_response_rate": "Estimated response rate (%)"
            }
            
            Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    /**
     * Resume Formatting Tips - Best practices for formatting
     */
    async getFormattingTips(lang = 'tr') {
        const client = await this.getClient();
        if (!client) {return this.mockFormattingTips(lang);}

        const prompt = lang === 'tr'
            ? `CV formatı ve tasarım uzmanı olarak CV'yi formatlarken dikkat edilmesi gereken en önemli noktaları sırayla liste halinde ver.
            
            JSON formatında dön:
            {
              "typography": ["Tavsiye 1", "Tavsiye 2", ...],
              "layout": ["Tavsiye 1", "Tavsiye 2", ...],
              "sections": ["Tavsiye 1", "Tavsiye 2", ...],
              "dos": ["Yapılması gereken 1", ...],
              "donts": ["Yapılmaması gereken 1", ...],
              "color_psychology": "Renk seçimi hakkında bilgi"
            }
            
            Sadece JSON dön.`
            : `As a CV formatting expert, provide best practices for CV formatting.
            
            Return JSON with:
            {
              "typography": ["Tip 1", "Tip 2", ...],
              "layout": ["Tip 1", "Tip 2", ...],
              "sections": ["Tip 1", "Tip 2", ...],
              "dos": ["Do 1", ...],
              "donts": ["Don't 1", ...],
              "color_psychology": "Info about color choice"
            }
            
            Return only JSON.`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    // ============================================
    // MOCK RESPONSES FOR PHASE 2
    // ============================================

    mockInterviewPrep(jobTitle) {
        return {
            mock: true,
            likely_questions: [
                `${jobTitle} pozisyonunda en başarılı proje neydi?`,
                'Takım çalışmasında zorluk yaşadığınız bir durum var mı?',
                'Kariyer hedefleriniz neler?',
                'Neden bu şirkete katılmak istiyorsunuz?'
            ],
            answer_tips: [
                'STAR metodu kullanın (Situation, Task, Action, Result)',
                'Spesifik örnekler verin, genel cümlelerden kaçının',
                'Şirketi araştırıp kültürüne uyum sağlayacağınızı gösterin'
            ],
            body_language: 'Düz oturun, göz kontağı sağlayın, gülümseyin',
            common_mistakes: [
                'Soru sormamak',
                'Önceki işverenlerden şikayetçi olmak',
                'Araştırmadan gelme'
            ]
        };
    }

    mockSkillGap(jobTitle) {
        return {
            mock: true,
            gap_analysis: `${jobTitle} pozisyonu için bazı kritik beceriler eksik. Gelişim planı oluşturmanız önerilir.`,
            missing_skills: [
                { skill: 'Advanced SQL', importance: 'high', learning_time: '3 hafta' },
                { skill: 'Python', importance: 'medium', learning_time: '4 hafta' }
            ],
            strength_skills: ['Project Management', 'Communication'],
            score: 72
        };
    }

    mockCVScore() {
        return {
            mock: true,
            overall_score: 78,
            category_scores: {
                personal_info: 85,
                experience: 75,
                skills: 72,
                education: 80,
                presentation: 75
            },
            strengths: ['Deneyim bölümü detaylı', 'İyi organize edilmiş'],
            improvements: [
                { area: 'Yetenek bölümü', suggestion: 'Daha spesifik teknoloji adları ekleyin' }
            ],
            estimated_response_rate: '35-40%'
        };
    }

    mockFormattingTips(lang = 'tr') {
        return {
            mock: true,
            typography: [
                lang === 'tr' ? '12-14px arası yazı boyutu ideal' : 'Font size 12-14px is ideal',
                lang === 'tr' ? 'Maximum 2 farklı font kullanın' : 'Use maximum 2 fonts'
            ],
            layout: [
                lang === 'tr' ? 'Marjinler 1cm olmalı' : 'Margins should be 1cm',
                lang === 'tr' ? 'Tek sayfa (1-2 sayfa maks)' : 'One page (2 pages max)'
            ],
            dos: [
                lang === 'tr' ? 'İstatistik ve sayılarla başarıları gösterin' : 'Show achievements with numbers',
                lang === 'tr' ? 'PDF formatında gönderin' : 'Send as PDF'
            ],
            donts: [
                lang === 'tr' ? 'Fotoğraf kullanmayın (talep edilmediği sürece)' : 'Don\'t use photo unless required',
                lang === 'tr' ? 'Çok renkli tasarım yapmayın' : 'Don\'t use too many colors'
            ]
        };
    }
}
