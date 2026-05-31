// AI Service - Gemini 2.5 Flash API Integration

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// Get API key from localStorage (set by admin)
const getApiKey = () => {
    const settings = JSON.parse(localStorage.getItem('CVniz_ai_settings') || '{}')
    return settings.apiKey || ''
}

// Generate professional profile summary
export async function generateProfileSummary(jobTitle, language = 'tr') {
    const apiKey = getApiKey()
    if (!apiKey) {
        throw new Error('API key bulunamadı. Lütfen admin panelinden API anahtarını ayarlayın.')
    }

    const prompt = language === 'tr'
        ? `Sen profesyonel bir CV yazarısın. "${jobTitle}" pozisyonu için kısa, etkileyici ve profesyonel bir özet yaz. 
           - Maksimum 3 cümle olsun
           - İlk kişi ağzından yaz ("...yıllık deneyime sahibim" gibi)
           - Somut beceriler ve başarılar içersin
           - Türkçe yaz`
        : `You are a professional CV writer. Write a short, impactful, and professional summary for the "${jobTitle}" position.
           - Maximum 3 sentences
           - Write in first person
           - Include concrete skills and achievements`

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
            }
        })
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'AI API hatası')
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// Generate experience description
export async function generateExperienceDescription(company, position, language = 'tr') {
    const apiKey = getApiKey()
    if (!apiKey) {
        throw new Error('API key bulunamadı.')
    }

    const prompt = language === 'tr'
        ? `"${company}" şirketinde "${position}" pozisyonu için 3-4 maddelik iş deneyimi açıklaması yaz.
           - Her madde başarı odaklı olsun
           - Sayısal veriler içersin (%, adet vb.)
           - Maddeleri tire (-) ile başlat
           - Türkçe yaz`
        : `Write 3-4 bullet points for work experience at "${company}" as "${position}".
           - Each point should be achievement-focused
           - Include metrics (%, numbers)
           - Start each bullet with a dash (-)`

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
        })
    })

    if (!response.ok) throw new Error('AI API hatası')

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

// Suggest skills based on job title
export async function suggestSkills(jobTitle, language = 'tr') {
    const apiKey = getApiKey()
    if (!apiKey) {
        throw new Error('API key bulunamadı.')
    }

    const prompt = language === 'tr'
        ? `"${jobTitle}" pozisyonu için en önemli 8 teknik ve soft skill'i listele.
           - Sadece beceri isimlerini yaz, açıklama yapma
           - Her satıra bir beceri yaz
           - Türkçe yaz`
        : `List the 8 most important technical and soft skills for "${jobTitle}".
           - Only write skill names, no descriptions
           - One skill per line`

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.5, maxOutputTokens: 150 }
        })
    })

    if (!response.ok) throw new Error('AI API hatası')

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Parse skills from response
    return text.split('\n')
        .map(s => s.replace(/^[-•*\d.)\s]+/, '').trim())
        .filter(s => s.length > 0 && s.length < 50)
}

// Improve/enhance text
export async function improveText(text, type = 'summary', language = 'tr') {
    const apiKey = getApiKey()
    if (!apiKey) {
        throw new Error('API key bulunamadı.')
    }

    const typePrompts = {
        summary: 'profesyonel bir CV özeti',
        experience: 'iş deneyimi açıklaması',
        general: 'profesyonel metin'
    }

    const prompt = language === 'tr'
        ? `Aşağıdaki metni ${typePrompts[type] || 'profesyonel metin'} olarak geliştir ve daha etkileyici hale getir. Orijinal anlamı koru ama daha profesyonel yaz:

"${text}"

Sadece geliştirilmiş metni yaz, açıklama yapma.`
        : `Improve the following text as a ${type}. Keep the original meaning but make it more professional:

"${text}"

Only output the improved text, no explanations.`

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6, maxOutputTokens: 300 }
        })
    })

    if (!response.ok) throw new Error('AI API hatası')

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/^["']|["']$/g, '') || text
}

// Check if AI is configured
export function isAIConfigured() {
    const settings = JSON.parse(localStorage.getItem('CVniz_ai_settings') || '{}')
    return !!settings.apiKey
}

// Test API connection
export async function testAPIConnection() {
    const apiKey = getApiKey()
    if (!apiKey) return { success: false, error: 'API key bulunamadı' }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Merhaba, test.' }] }],
                generationConfig: { maxOutputTokens: 10 }
            })
        })

        if (!response.ok) {
            const error = await response.json()
            return { success: false, error: error.error?.message || 'Bağlantı hatası' }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

// Translate Entire CV
export async function translateCV(cvData, targetLanguage) {
    const apiKey = getApiKey()
    if (!apiKey) {
        throw new Error('API key bulunamadı.')
    }

    const prompt = `You are an expert translator. Translate the following CV JSON data to ${targetLanguage}. 
    - KEEP all JSON keys exactly the same.
    - ONLY translate the string values.
    - DO NOT translate proper nouns like company names, locations, or degree names if they shouldn't be translated.
    - Return ONLY valid JSON, no markdown formatting.
    
    Here is the CV JSON:
    ${JSON.stringify(cvData)}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                temperature: 0.1, 
                maxOutputTokens: 8192,
                responseMimeType: "application/json"
            }
        })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'AI API hatası');
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    try {
        return JSON.parse(resultText);
    } catch (e) {
        // Fallback cleanup if Gemini returned markdown formatting despite instructions
        const cleanJson = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    }
}

