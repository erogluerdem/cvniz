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

    async generateProject(params) {
        const { input, type, outputType = 'paragraph', lang = 'tr' } = params;
        const client = await this.getClient();

        if (!client) {
            return { error: 'AI_NOT_CONFIGURED', message: 'AI servisi yapılandırılmamış.' };
        }

        const projectTypeLabels = {
            web: 'Web Uygulaması',
            mobile: 'Mobil Uygulama',
            api: 'API / Backend',
            data: 'Data / Makine Öğrenmesi',
            devops: 'DevOps / Altyapı',
            other: 'Genel Proje'
        };
        const typeLabel = projectTypeLabels[type] || 'Proje';

        const prompt = lang === 'tr'
            ? `Sen kıdemli bir İnsan Kaynakları (HR) yöneticisi ve teknik bir işe alım uzmanısın. Adayın girdiği bilgilere dayanarak, CV'sinde veya portfolyosunda sergileyeceği profesyonel bir proje açıklaması yaz.

            PROJE BİLGİLERİ:
            Tür: ${typeLabel}
            Proje Adı/Konusu: ${input.name || 'Belirtilmedi'}
            Kullanılan Teknolojiler: ${input.tech || 'Belirtilmedi'}
            Temel Özellikler: ${input.features || 'Belirtilmedi'}
            Elde Edilen Sonuç/Etki: ${input.impact || 'Belirtilmedi'}
            Rol/Sorumluluk: ${input.role || 'Belirtilmedi'}
            İstenen Çıktı Formatı: ${outputType === 'bullets' ? 'Madde İşaretli (Bullet Points)' : 'Paragraf (Paragraph)'}

            TALİMATLAR:
            1. Metin çok profesyonel, etki odaklı (impact-driven) ve STAR (Situation, Task, Action, Result) tekniğine uygun olmalıdır.
            2. Eğer çıktı formatı "bullets" ise, 4-6 maddeden oluşan bir liste döndür. Her madde bir başarıyı veya teknik sorumluluğu vurgulasın.
            3. Eğer çıktı formatı "paragraph" ise, 3-4 cümlelik akıcı, çarpıcı ve teknik detayları barındıran bir özet döndür.
            4. JSON formatında cevap ver.

            SADECE JSON FORMATINDA DÖN, BAŞKA METİN EKLEME:
            {
                "description": "Eğer format paragraph ise buraya yazılacak, bullets ise boş bırak",
                "bullets": ["Eğer format bullets ise madde 1", "madde 2", ...],
                "impact_score": 85, // 1-100 arası projenin etkileyicilik skoru
                "keywords": ["React", "Performance", "API"] // Çıkarılan 3-5 anahtar kelime
            }`
            : `You are a senior HR manager and technical recruiter. Write a professional project description for a candidate's CV or portfolio based on the provided information.

            PROJECT INFO:
            Type: ${typeLabel}
            Name/Topic: ${input.name || 'Not specified'}
            Technologies: ${input.tech || 'Not specified'}
            Key Features: ${input.features || 'Not specified'}
            Impact/Result: ${input.impact || 'Not specified'}
            Role/Responsibility: ${input.role || 'Not specified'}
            Desired Output Format: ${outputType === 'bullets' ? 'Bullet Points' : 'Paragraph'}

            INSTRUCTIONS:
            1. The text must be highly professional, impact-driven, and loosely follow the STAR (Situation, Task, Action, Result) method.
            2. If output format is "bullets", return a list of 4-6 bullet points highlighting technical responsibilities and achievements.
            3. If output format is "paragraph", return a 3-4 sentence fluent, impactful summary including technical details.
            4. Return in JSON format.

            RETURN ONLY JSON, NO OTHER TEXT:
            {
                "description": "Write here if format is paragraph, empty otherwise",
                "bullets": ["bullet 1", "bullet 2", ...],
                "impact_score": 85, // 1-100 score of how impressive the project sounds
                "keywords": ["React", "Performance", "API"] // 3-5 extracted keywords
            }`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async optimizeLinkedIn(params) {
        const { cvData, lang = 'tr' } = params;
        const client = await this.getClient();

        if (!client) {
            return { error: 'AI_NOT_CONFIGURED', message: 'AI servisi yapılandırılmamış.' };
        }

        const candidateName = cvData?.personalInfo?.name || cvData?.personal?.fullName || (lang === 'tr' ? 'Aday' : 'Candidate');
        const candidateTitle = cvData?.personalInfo?.title || 'Profesyonel';
        const summary = cvData?.personalInfo?.summary || '';
        const experience = cvData?.experience || [];
        const skills = cvData?.skills?.slice(0, 10) || [];

        const prompt = lang === 'tr'
            ? `Sen üst düzey bir LinkedIn Profil Optimizasyon Uzmanısın. Verilen CV bilgilerini inceleyerek adayın LinkedIn profilini uçuracak (optimize edecek) öneriler hazırla.

            ADAY BİLGİLERİ:
            İsim: ${candidateName}
            Mevcut Ünvan: ${candidateTitle}
            Mevcut Özet: ${summary}
            Deneyim: ${JSON.stringify(experience.slice(0, 2))}
            Yetenekler: ${JSON.stringify(skills)}

            GÖREVİN:
            1. 'score': Mevcut profil bilgilerine göre 100 üzerinden bir LinkedIn SEO & Çekicilik skoru ver (Sayı).
            2. 'headlines': Dikkat çekici, SEO uyumlu ve emojilerle desteklenmiş en az 4 farklı Başlık (Headline) önerisi sun (Array of strings).
            3. 'summary': Adayı anlatan, sıcak (merhaba ile başlayan), deneyimleri vurgulayan ve call-to-action (CTA) içeren mükemmel bir 'Hakkında' (About) yazısı yaz (String).
            4. 'keywords': Adayın aranabilirliğini artıracak 10-15 yetenek/anahtar kelime ver (Array of strings).
            5. 'tips': Profilini daha iyi hale getirmesi için 3-4 özel ipucu ver (Array of strings).

            SADECE AŞAĞIDAKİ JSON FORMATINDA DÖN, BAŞKA METİN EKLEME:
            {
                "score": 85,
                "headlines": ["...", "..."],
                "summary": "...",
                "keywords": ["...", "..."],
                "tips": ["...", "..."]
            }`
            : `You are a top-tier LinkedIn Profile Optimization Expert. Analyze the provided CV info and create a comprehensive LinkedIn optimization plan.

            CANDIDATE INFO:
            Name: ${candidateName}
            Current Title: ${candidateTitle}
            Current Summary: ${summary}
            Experience: ${JSON.stringify(experience.slice(0, 2))}
            Skills: ${JSON.stringify(skills)}

            YOUR TASK:
            1. 'score': Give a LinkedIn SEO & Attractiveness score out of 100 based on the current data (Number).
            2. 'headlines': Provide at least 4 catchy, SEO-friendly, and emoji-supported Headline suggestions (Array of strings).
            3. 'summary': Write a perfect 'About' section that is engaging, highlights experience, and includes a call-to-action (String).
            4. 'keywords': Provide 10-15 keywords to boost searchability (Array of strings).
            5. 'tips': Provide 3-4 specific tips to improve the profile (Array of strings).

            RETURN ONLY IN THIS JSON FORMAT:
            {
                "score": 85,
                "headlines": ["...", "..."],
                "summary": "...",
                "keywords": ["...", "..."],
                "tips": ["...", "..."]
            }`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async generateEmail(params) {
        const { type, tone, input, cvData, lang = 'tr' } = params;
        const client = await this.getClient();

        if (!client) {
            return { error: 'AI_NOT_CONFIGURED', message: 'AI servisi yapılandırılmamış.' };
        }

        const candidateName = cvData?.personalInfo?.name || (lang === 'tr' ? 'Aday' : 'Candidate');
        const candidateTitle = cvData?.personalInfo?.title || 'Profesyonel';
        const skills = cvData?.skills?.slice(0, 5).map(s => s.name).join(', ') || '';
        
        let typeInstruction = '';
        if (type === 'application') typeInstruction = `İş Başvurusu: ${input.company} şirketindeki ${input.position} pozisyonu için başvuruda bulunuyor. Vurgulanacak neden: ${input.whyCompany}`;
        else if (type === 'followup') typeInstruction = `Takip E-postası: ${input.company} şirketindeki ${input.position} pozisyonu için ${input.date} tarihinde yapılan başvuru/görüşmenin takibi.`;
        else if (type === 'networking') typeInstruction = `Networking: Sektör profesyoneli olan ${input.recipient} ile tanışmak ve bağlantı kurmak istiyor. İletişim nedeni: ${input.reason}`;
        else if (type === 'referral') typeInstruction = `Referans İsteme: Eski iş arkadaşı/yöneticisi ${input.recipient} kişisinden ${input.position} pozisyonu için referans/tavsiye rica ediyor.`;
        else if (type === 'informational') typeInstruction = `Bilgi Görüşmesi (Informational Interview): ${input.company} şirketinde çalışan ${input.recipient} ile ${input.topic} hakkında 15 dakikalık kısa bir görüşme talep ediyor.`;
        else if (type === 'thankyou') typeInstruction = `Teşekkür E-postası: ${input.company} şirketindeki ${input.position} pozisyonu için yapılan mülakat sonrası ${input.recipient} kişisine teşekkür ediyor.`;

        const prompt = lang === 'tr'
            ? `Sen kurumsal iletişim ve insan kaynakları uzmanısın. Kullanıcının talebine uygun, profesyonel bir e-posta hazırla.
            
            GÖNDEREN BİLGİLERİ:
            Adı: ${candidateName}
            Ünvanı: ${candidateTitle}
            Yetenekleri: ${skills}

            E-POSTA DETAYLARI:
            Türü: ${typeInstruction}
            Kime: ${input.recipient || 'Sayın İlgili'}
            İstenen Ton/Tarz: ${tone} (Örn: Profesyonel, Samimi, Özgüvenli, Heyecanlı)

            GÖREVİN:
            1. 'subject': E-posta için çok etkili ve doğrudan bir konu başlığı yaz.
            2. 'body': İstenen tona tamamen uygun, akıcı, imla kurallarına dikkat eden ve karşı tarafı harekete geçiren (CTA) bir e-posta metni yaz.

            SADECE AŞAĞIDAKİ JSON FORMATINDA DÖN:
            {
                "subject": "E-posta Konusu",
                "body": "Sayın İlgili,\\n\\n..."
            }`
            : `You are a corporate communications and HR expert. Draft a professional email based on the user's request.
            
            SENDER INFO:
            Name: ${candidateName}
            Title: ${candidateTitle}
            Skills: ${skills}

            EMAIL DETAILS:
            Type: ${typeInstruction}
            To: ${input.recipient || 'To whom it may concern'}
            Desired Tone: ${tone} (e.g., Professional, Friendly, Confident, Enthusiastic)

            YOUR TASK:
            1. 'subject': Write a highly effective and direct subject line.
            2. 'body': Write the email body completely matching the desired tone. Ensure it's fluent, grammatically correct, and includes a clear Call to Action (CTA).

            RETURN ONLY IN THIS JSON FORMAT:
            {
                "subject": "Email Subject",
                "body": "Dear [Name],\\n\\n..."
            }`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async writeReferenceLetter(params) {
        const { referenceType, input, cvData, tone, lang = 'tr' } = params;
        const client = await this.getClient();

        if (!client) {
            return { error: 'AI_NOT_CONFIGURED', message: 'AI servisi yapılandırılmamış.' };
        }

        const candidateName = cvData?.personalInfo?.name || (lang === 'tr' ? 'Aday' : 'Candidate');
        const candidateTitle = cvData?.personalInfo?.title || 'Profesyonel';
        const skills = cvData?.skills?.slice(0, 5).map(s => s.name).join(', ') || '';
        
        let typeInstruction = '';
        if (referenceType === 'manager') typeInstruction = `Yönetici Referansı: Adayın doğrudan yöneticisi ağzından yazılacak. Vurgulanacak başarı: ${input.achievement}. Çalışılan proje: ${input.project}.`;
        else if (referenceType === 'colleague') typeInstruction = `İş Arkadaşı Referansı: Adayla aynı seviyede çalışan iş arkadaşı ağzından yazılacak. Vurgulanacak güçlü yön: ${input.strength}. Takım çalışması/Proje: ${input.project}.`;
        else if (referenceType === 'client') typeInstruction = `Müşteri Referansı: Adayın çalıştığı müşteri ağzından yazılacak. Memnuniyet sebebi ve başarı: ${input.achievement}. Çalışılan proje: ${input.project}.`;
        else if (referenceType === 'professor') typeInstruction = `Akademik Referans: Adayın üniversitedeki profesörü ağzından yazılacak. Alınan ders/proje: ${input.course} - ${input.project}. Güçlü yönü: ${input.strength}.`;

        const prompt = lang === 'tr'
            ? `Sen profesyonel bir metin yazarısın. Aşağıdaki bilgilere dayanarak, çok etkileyici ve gerçekçi bir referans mektubu oluştur.

            ADAY BİLGİLERİ:
            Adı: ${candidateName}
            Rolü: ${candidateTitle}
            Yetenekleri: ${skills}

            MEKTUP DETAYLARI:
            Tür: ${typeInstruction}
            Ton: ${tone} (Resmi, Samimi, Coşkulu vb.)
            Şirket/Kurum: ${input.company || input.university || '[Şirket/Kurum Adı]'}
            Çalışma/Eğitim Süresi: ${input.duration || '[Süre]'}
            Başvurduğu Yeni Pozisyon: ${input.position || '[Hedef Pozisyon]'}

            REFERANS VEREN BİLGİLERİ (İMZA KISMI İÇİN):
            İsim: ${input.referrerName || '[İsim Soyisim]'}
            Ünvan: ${input.referrerTitle || '[Ünvan]'}
            Şirket: ${input.referrerCompany || '[Şirket]'}
            E-posta: ${input.referrerEmail || '[E-posta]'}
            Telefon: ${input.referrerPhone || '[Telefon]'}

            GÖREVİN:
            İstenilen tonda, akıcı, imla kurallarına uygun, çok profesyonel bir referans mektubu yaz. Mektubu normal metin/paragraf formatında hazırla (Tarih ve Yetkili Makama kısımlarını ve imza blokunu dahil et). 
            JSON FORMATINDA DÖN:
            {
                "content": "Günün tarihi\\n\\nYetkili Makama,\\n\\n..."
            }`
            : `You are a professional copywriter. Create a highly impressive and realistic reference letter based on the following details.

            CANDIDATE INFO:
            Name: ${candidateName}
            Role: ${candidateTitle}
            Skills: ${skills}

            LETTER DETAILS:
            Type: ${typeInstruction}
            Tone: ${tone} (Formal, Warm, Enthusiastic etc.)
            Company/Institution: ${input.company || input.university || '[Company/Institution Name]'}
            Duration: ${input.duration || '[Duration]'}
            Target Position: ${input.position || '[Target Position]'}

            REFERRER INFO (FOR SIGNATURE):
            Name: ${input.referrerName || '[Name Surname]'}
            Title: ${input.referrerTitle || '[Title]'}
            Company: ${input.referrerCompany || '[Company]'}
            Email: ${input.referrerEmail || '[Email]'}
            Phone: ${input.referrerPhone || '[Phone]'}

            YOUR TASK:
            Write a very professional reference letter in the requested tone, grammatically correct and fluent. Include the date, salutation (To whom it may concern), and signature block.
            RETURN IN JSON FORMAT:
            {
                "content": "Date\\n\\nTo whom it may concern,\\n\\n..."
            }`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async targetFitCV(originalCV, parsedJob, lang = 'tr') {
        const client = await this.getClient();

        if (!client) {
            return { error: 'AI_NOT_CONFIGURED', message: 'AI servisi yapılandırılmamış.' };
        }

        const cvSummary = originalCV.personalInfo?.summary || originalCV.summary || '';
        const cvExperience = JSON.stringify(originalCV.experience || []);
        
        const jobTitle = parsedJob.title || '';
        const jobDescription = parsedJob.description || '';
        const jobRequirements = parsedJob.requirements?.join(', ') || '';
        const jobSkills = parsedJob.skills?.join(', ') || '';

        const prompt = lang === 'tr'
            ? `Sen uzman bir Kariyer Danışmanı ve CV Optimizasyon Uzmanısın. Amacın, verilen bir adayın CV'sini spesifik bir iş ilanına mükemmel şekilde uyumlu (Target-Fit) hale getirmektir.

            ADAYIN MEVCUT BİLGİLERİ:
            - Özet (Summary): ${cvSummary}
            - Deneyimler (JSON): ${cvExperience}

            HEDEF İŞ İLANI BİLGİLERİ:
            - Başlık: ${jobTitle}
            - Yetenekler/Anahtar Kelimeler: ${jobSkills}
            - Gereksinimler: ${jobRequirements}
            - Açıklama: ${jobDescription}

            GÖREVİN:
            1. 'summary': Adayın özetini, ilandaki anahtar kelimeleri (özellikle yetenekleri ve gereksinimleri) doğal bir şekilde içerecek ve ilana mükemmel uyum sağlayacak şekilde yeniden yaz. (Maksimum 4-5 cümle).
            2. 'experience': Adayın deneyimlerini analiz et. İlanla en çok eşleşen deneyim maddelerini öne çıkar, ilandaki gereksinimleri karşılayan başarıları daha vurgulu hale getir. Deneyim yapısını (company, position, description, startDate vb.) bozmadan, sadece 'description' veya 'achievements' kısımlarını optimize et. (Önceki JSON formatına sadık kal).

            SADECE AŞAĞIDAKİ JSON FORMATINDA DÖN (Bunun dışında hiçbir açıklama metni yazma):
            {
                "summary": "İlana özel yeniden yazılmış, anahtar kelimelerle zenginleştirilmiş özet metni...",
                "experience": [
                    {
                        "company": "Firma Adı",
                        "position": "Pozisyon",
                        "description": "İlan gereksinimlerine göre optimize edilmiş ve vurgulanmış açıklama maddeleri..."
                    }
                ]
            }`
            : `You are an expert Career Coach and CV Optimization Specialist. Your goal is to perfectly tailor a candidate's CV to a specific job listing (Target-Fit).

            CANDIDATE'S CURRENT INFO:
            - Summary: ${cvSummary}
            - Experience (JSON): ${cvExperience}

            TARGET JOB INFO:
            - Title: ${jobTitle}
            - Skills/Keywords: ${jobSkills}
            - Requirements: ${jobRequirements}
            - Description: ${jobDescription}

            YOUR TASK:
            1. 'summary': Rewrite the summary to naturally incorporate the job's keywords and requirements. Make it a perfect fit for the target role. (Max 4-5 sentences).
            2. 'experience': Analyze the candidate's experiences. Highlight and rewrite the 'description' or 'achievements' bullets to emphasize accomplishments that align perfectly with the job requirements. Keep the original JSON structure intact (company, position, dates, etc.), only modify the descriptive text.

            RETURN ONLY IN THIS EXACT JSON FORMAT (No extra text):
            {
                "summary": "Tailored summary enriched with job keywords...",
                "experience": [
                    {
                        "company": "Company Name",
                        "position": "Position",
                        "description": "Optimized description highlighting relevant achievements..."
                    }
                ]
            }`;

        return this.provider === 'google'
            ? this.callGoogle(prompt)
            : this.callOpenAI(client, prompt);
    }

    async generateCoverLetter(params) {
        const { style, jobData, targetPosition, cvData, lang = 'tr' } = params;
        const client = await this.getClient();

        if (!client) {
            return { error: 'AI_NOT_CONFIGURED', message: 'AI servisi yapılandırılmamış.' };
        }

        const candidateName = cvData?.personalInfo?.name || (lang === 'tr' ? 'Aday' : 'Candidate');
        const cvSummary = cvData?.personalInfo?.summary || cvData?.summary || '';
        const cvExperience = JSON.stringify(cvData?.experience || []);
        const cvSkills = cvData?.skills?.slice(0, 10).map(s => s.name).join(', ') || '';

        const targetCompany = jobData?.company || '[Şirket Adı]';
        const position = targetPosition || jobData?.title || '[Pozisyon]';

        let toneInstruction = '';
        if (style === 'professional') toneInstruction = 'Çok profesyonel, kurumsal, net ve özgüvenli bir ton.';
        else if (style === 'creative') toneInstruction = 'Yaratıcı, tutkulu, samimi ve dinamik bir ton.';
        else if (style === 'formal') toneInstruction = 'Geleneksel, ciddi ve çok resmi bir ton.';

        const prompt = lang === 'tr'
            ? `Sen uzman bir Kariyer Koçu ve İK Profesyonelisin. Verilen aday bilgilerine ve hedeflenen işe göre, adayın işe alım yöneticisini (Hiring Manager) etkileyecek muazzam bir Niyet Mektubu (Cover Letter) oluştur.

            ADAY BİLGİLERİ:
            - İsim: ${candidateName}
            - Özet: ${cvSummary}
            - Yetenekler: ${cvSkills}
            - Deneyimler (JSON): ${cvExperience}

            HEDEF ROL:
            - Şirket: ${targetCompany}
            - Pozisyon: ${position}

            İSTENEN TON/STİL:
            ${toneInstruction}

            GÖREVİN:
            - Adayın deneyimlerini ve yeteneklerini analiz et. Sadece hedeflenen pozisyonla (${position}) en çok eşleşen ve şirkete (${targetCompany}) en çok değer katacak deneyimlerini öne çıkararak etkileyici bir niyet mektubu yaz.
            - Mektubu standart giriş (Sayın Yetkili / İşe Alım Yöneticisi), gelişme (neden bu pozisyon ve adayın şirkete katacağı değer) ve sonuç (aksiyona çağrı - mülakat talebi) şeklinde kurgula.
            - Tarih ve imza (isim) bloklarını mutlaka ekle. (Normal metin formatında, paragraf boşluklarıyla).
            
            SADECE AŞAĞIDAKİ JSON FORMATINDA DÖN:
            {
                "content": "Günün tarihi\\n\\nSayın İşe Alım Yöneticisi,\\n\\n..."
            }`
            : `You are an expert Career Coach and HR Professional. Based on the candidate's profile and target job, create a highly compelling Cover Letter that will impress the Hiring Manager.

            CANDIDATE INFO:
            - Name: ${candidateName}
            - Summary: ${cvSummary}
            - Skills: ${cvSkills}
            - Experience (JSON): ${cvExperience}

            TARGET ROLE:
            - Company: ${targetCompany}
            - Position: ${position}

            DESIRED TONE/STYLE:
            ${toneInstruction}

            YOUR TASK:
            - Analyze the candidate's experience and skills. Highlight ONLY the achievements and skills that are most relevant to the target position (${position}) and explain the value they will bring to the company (${targetCompany}).
            - Structure the letter with a standard introduction (Dear Hiring Manager), body (why this role and value add), and conclusion (call to action for an interview).
            - Include the date and signature block (name).
            
            RETURN ONLY IN THIS JSON FORMAT:
            {
                "content": "Date\\n\\nDear Hiring Manager,\\n\\n..."
            }`;

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

module.exports = AIService;
