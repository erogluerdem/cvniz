import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import { useCV } from './CVContext'

const TranslationContext = createContext(null)

// Supported languages
const SUPPORTED_LANGUAGES = {
    tr: { name: 'Türkçe', flag: '🇹🇷', code: 'tr' },
    en: { name: 'English', flag: '🇬🇧', code: 'en' },
    de: { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
    fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
    es: { name: 'Español', flag: '🇪🇸', code: 'es' },
    ar: { name: 'العربية', flag: '🇸🇦', code: 'ar', rtl: true }
}

// Translation dictionary for common CV terms
const TRANSLATIONS = {
    // Section Headers
    'Profesyonel Özet': { en: 'Professional Summary', de: 'Berufliches Profil', fr: 'Résumé Professionnel', es: 'Resumen Profesional', ar: 'الملخص المهني' },
    'İş Deneyimi': { en: 'Work Experience', de: 'Berufserfahrung', fr: 'Expérience Professionnelle', es: 'Experiencia Laboral', ar: 'الخبرة العملية' },
    'Eğitim': { en: 'Education', de: 'Bildung', fr: 'Formation', es: 'Educación', ar: 'التعليم' },
    'Beceriler': { en: 'Skills', de: 'Fähigkeiten', fr: 'Compétences', es: 'Habilidades', ar: 'المهارات' },
    'Diller': { en: 'Languages', de: 'Sprachen', fr: 'Langues', es: 'Idiomas', ar: 'اللغات' },
    'Sertifikalar': { en: 'Certifications', de: 'Zertifikate', fr: 'Certifications', es: 'Certificaciones', ar: 'الشهادات' },
    'Projeler': { en: 'Projects', de: 'Projekte', fr: 'Projets', es: 'Proyectos', ar: 'المشاريع' },
    'Referanslar': { en: 'References', de: 'Referenzen', fr: 'Références', es: 'Referencias', ar: 'المراجع' },
    'Hobiler': { en: 'Hobbies', de: 'Hobbys', fr: 'Loisirs', es: 'Pasatiempos', ar: 'الهوايات' },

    // Common terms
    'Günümüz': { en: 'Present', de: 'Heute', fr: 'Présent', es: 'Actualidad', ar: 'الحالي' },
    'Şu an': { en: 'Currently', de: 'Aktuell', fr: 'Actuellement', es: 'Actualmente', ar: 'حاليا' },
    'Lisans': { en: 'Bachelor\'s Degree', de: 'Bachelor', fr: 'Licence', es: 'Licenciatura', ar: 'بكالوريوس' },
    'Yüksek Lisans': { en: 'Master\'s Degree', de: 'Master', fr: 'Master', es: 'Maestría', ar: 'ماجستير' },
    'Doktora': { en: 'PhD', de: 'Promotion', fr: 'Doctorat', es: 'Doctorado', ar: 'دكتوراه' },

    // Months
    'Ocak': { en: 'January', de: 'Januar', fr: 'Janvier', es: 'Enero', ar: 'يناير' },
    'Şubat': { en: 'February', de: 'Februar', fr: 'Février', es: 'Febrero', ar: 'فبراير' },
    'Mart': { en: 'March', de: 'März', fr: 'Mars', es: 'Marzo', ar: 'مارس' },
    'Nisan': { en: 'April', de: 'April', fr: 'Avril', es: 'Abril', ar: 'أبريل' },
    'Mayıs': { en: 'May', de: 'Mai', fr: 'Mai', es: 'Mayo', ar: 'مايو' },
    'Haziran': { en: 'June', de: 'Juni', fr: 'Juin', es: 'Junio', ar: 'يونيو' },
    'Temmuz': { en: 'July', de: 'Juli', fr: 'Juillet', es: 'Julio', ar: 'يوليو' },
    'Ağustos': { en: 'August', de: 'August', fr: 'Août', es: 'Agosto', ar: 'أغسطس' },
    'Eylül': { en: 'September', de: 'September', fr: 'Septembre', es: 'Septiembre', ar: 'سبتمبر' },
    'Ekim': { en: 'October', de: 'Oktober', fr: 'Octobre', es: 'Octubre', ar: 'أكتوبر' },
    'Kasım': { en: 'November', de: 'November', fr: 'Novembre', es: 'Noviembre', ar: 'نوفمبر' },
    'Aralık': { en: 'December', de: 'Dezember', fr: 'Décembre', es: 'Diciembre', ar: 'ديسمبر' }
}

export function TranslationProvider({ children }) {
    const { user } = useAuth()
    const { saveCV } = useCV()
    const [translating, setTranslating] = useState(false)
    const [dynamicTranslations, setDynamicTranslations] = useState({})
    const [currentLang, setCurrentLang] = useState('tr')

    // Fetch translations on mount and when lang changes
    useEffect(() => {
        // Initial load for current lang
        loadTranslations(currentLang)
    }, [currentLang])

    const loadTranslations = async (lang) => {
        try {
            const data = await import('../services/api').then(m => m.translationAPI.getAll(lang))
            setDynamicTranslations(prev => ({
                ...prev,
                [lang]: data
            }))
        } catch (error) {
            console.error('Failed to load translations:', error)
        }
    }

    const changeLanguage = (lang) => {
        if (SUPPORTED_LANGUAGES[lang]) {
            setCurrentLang(lang)
            loadTranslations(lang)
        }
    }

    // Simple translation function using dictionary + dynamic backend data
    const translateText = (text, targetLang) => {
        if (!text) return text
        const lang = targetLang || currentLang
        if (lang === 'tr') return text

        // Check dynamic backend translations first
        // Assuming backend returns { "Orjinal Metin": "Translated Text" } map
        if (dynamicTranslations[lang] && dynamicTranslations[lang][text]) {
            return dynamicTranslations[lang][text]
        }

        let translated = text

        // Fallback to static dictionary
        for (const [term, translations] of Object.entries(TRANSLATIONS)) {
            if (translations[lang]) {
                translated = translated.replace(new RegExp(term, 'gi'), translations[lang])
            }
        }

        return translated
    }

    // Translate entire CV
    const translateCV = async (cvData, targetLang) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }
        if (!cvData) return { success: false, error: 'CV verisi bulunamadı' }

        setTranslating(true)

        // Simulate AI translation delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        try {
            const translatedCV = JSON.parse(JSON.stringify(cvData)) // Deep copy

            // Translate personal info fields
            if (translatedCV.personal?.summary) {
                translatedCV.personal.summary = translateText(translatedCV.personal.summary, targetLang)
            }
            if (translatedCV.personal?.title) {
                translatedCV.personal.title = translateText(translatedCV.personal.title, targetLang)
            }

            // Translate experience
            if (translatedCV.experience) {
                translatedCV.experience = translatedCV.experience.map(exp => ({
                    ...exp,
                    position: translateText(exp.position, targetLang),
                    description: translateText(exp.description, targetLang)
                }))
            }

            // Translate education
            if (translatedCV.education) {
                translatedCV.education = translatedCV.education.map(edu => ({
                    ...edu,
                    degree: translateText(edu.degree, targetLang),
                    field: translateText(edu.field, targetLang)
                }))
            }

            // Translate skills (skill names might not need translation, but categories do)
            if (translatedCV.skills) {
                translatedCV.skills = translatedCV.skills.map(skill => ({
                    ...skill,
                    category: translateText(skill.category, targetLang)
                }))
            }

            // Translate certifications
            if (translatedCV.certifications) {
                translatedCV.certifications = translatedCV.certifications.map(cert => ({
                    ...cert,
                    name: translateText(cert.name, targetLang),
                    issuer: translateText(cert.issuer, targetLang)
                }))
            }

            // Translate projects
            if (translatedCV.projects) {
                translatedCV.projects = translatedCV.projects.map(proj => ({
                    ...proj,
                    description: translateText(proj.description, targetLang)
                }))
            }

            // Translate hobbies
            if (translatedCV.hobbies) {
                translatedCV.hobbies = translatedCV.hobbies.map(hobby =>
                    translateText(hobby, targetLang)
                )
            }

            setTranslating(false)
            return { success: true, translatedCV }
        } catch (error) {
            setTranslating(false)
            return { success: false, error: 'Çeviri sırasında bir hata oluştu' }
        }
    }

    // Save translated CV as new
    const saveTranslatedCV = async (cvData, template, originalName, targetLang) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const langName = SUPPORTED_LANGUAGES[targetLang]?.name || targetLang.toUpperCase()
        const newName = `${originalName} (${langName})`

        const result = saveCV(cvData, template, newName)
        return result
    }

    return (
        <TranslationContext.Provider value={{
            supportedLanguages: SUPPORTED_LANGUAGES,
            translating,
            translateCV,
            saveTranslatedCV,
            translateCV,
            saveTranslatedCV,
            translateText,
            currentLang,
            changeLanguage,
            t: (key) => translateText(key, currentLang) // Helper for direct UI translation
        }}>
            {children}
        </TranslationContext.Provider>
    )
}

export const useTranslation = () => useContext(TranslationContext)
