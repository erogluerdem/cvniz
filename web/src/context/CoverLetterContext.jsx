import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { aiAPI } from '../services/api'

const CoverLetterContext = createContext(null)

// Default cover letter templates/tones
const TONE_PRESETS = {
    formal: {
        name: 'Resmi',
        description: 'Kurumsal ve profesyonel ton',
        greeting: 'Sayın Yetkili,',
        closing: 'Saygılarımla,'
    },
    friendly: {
        name: 'Samimi',
        description: 'Sıcak ve yaklaşılabilir ton',
        greeting: 'Merhaba,',
        closing: 'En iyi dileklerimle,'
    },
    confident: {
        name: 'Özgüvenli',
        description: 'Güçlü ve kararlı ton',
        greeting: 'Sayın İşe Alım Ekibi,',
        closing: 'Görüşmek üzere,'
    }
}

export function CoverLetterProvider({ children }) {
    const { user } = useAuth()
    const [coverLetters, setCoverLetters] = useState([])
    const [generating, setGenerating] = useState(false)

    // Load cover letters from localStorage
    useEffect(() => {
        if (user) {
            loadUserCoverLetters()
        } else {
            setCoverLetters([])
        }
    }, [user])

    const loadUserCoverLetters = () => {
        const allLetters = JSON.parse(localStorage.getItem('CVniz_cover_letters') || '[]')
        const userLetters = allLetters.filter(l => l.userId === user?.id)
        setCoverLetters(userLetters)
    }

    // Generate AI Cover Letter
    const generateCoverLetter = async (params) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const { cvData, jobTitle, company, jobDescription, tone = 'formal' } = params

        setGenerating(true)

        setGenerating(true)

        try {
            const response = await aiAPI.generateCoverLetter({
                jobTitle,
                company,
                tone,
                cvData,
                jobDescription,
                lang: 'tr'
            });

            if (!response.success) {
                throw new Error('API request failed');
            }

            const coverLetter = {
                id: Date.now().toString(),
                userId: user.id,
                jobTitle,
                company: company || 'Belirtilmedi',
                tone,
                content: response.data?.content || "Sayın Yetkili,\n\nBu pozisyonla ilgileniyorum. CV'mi inceleyebilirsiniz.", // Fallback if no content
                cvId: params.cvId || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            // Save to localStorage
            const allLetters = JSON.parse(localStorage.getItem('CVniz_cover_letters') || '[]')
            allLetters.push(coverLetter)
            localStorage.setItem('CVniz_cover_letters', JSON.stringify(allLetters))
            loadUserCoverLetters()

            setGenerating(false)
            return { success: true, coverLetter }

        } catch (error) {
            console.warn('Cover Letter API failed, using fallback:', error)
            
            // Fallback content
            const fallbackContent = `${TONE_PRESETS[tone]?.greeting || 'Sayın Yetkili,'}\n\n${company || 'Şirketinizde'} açık bulunan ${jobTitle || 'pozisyon'} rolü ile yakından ilgileniyorum. Ekteki özgeçmişimde de görebileceğiniz üzere, bu alandaki yetkinliklerimle kurumunuza değer katabileceğime inanıyorum.\n\nSüreçle ilgili olumlu dönüşlerinizi beklerim.\n\n${TONE_PRESETS[tone]?.closing || 'Saygılarımla,'}`;
            
            const coverLetter = {
                id: Date.now().toString(),
                userId: user.id,
                jobTitle,
                company: company || 'Belirtilmedi',
                tone,
                content: fallbackContent,
                cvId: params.cvId || null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const allLetters = JSON.parse(localStorage.getItem('CVniz_cover_letters') || '[]')
            allLetters.push(coverLetter)
            localStorage.setItem('CVniz_cover_letters', JSON.stringify(allLetters))
            loadUserCoverLetters()

            setGenerating(false)
            return { success: true, coverLetter }
        }
    }

    // Update cover letter
    const updateCoverLetter = (letterId, updates) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const allLetters = JSON.parse(localStorage.getItem('CVniz_cover_letters') || '[]')
        const index = allLetters.findIndex(l => l.id === letterId && l.userId === user.id)

        if (index === -1) return { success: false, error: 'Ön yazı bulunamadı' }

        allLetters[index] = {
            ...allLetters[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        localStorage.setItem('CVniz_cover_letters', JSON.stringify(allLetters))
        loadUserCoverLetters()

        return { success: true, coverLetter: allLetters[index] }
    }

    // Delete cover letter
    const deleteCoverLetter = (letterId) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const allLetters = JSON.parse(localStorage.getItem('CVniz_cover_letters') || '[]')
        const filtered = allLetters.filter(l => !(l.id === letterId && l.userId === user.id))
        localStorage.setItem('CVniz_cover_letters', JSON.stringify(filtered))
        loadUserCoverLetters()

        return { success: true }
    }

    // Duplicate cover letter
    const duplicateCoverLetter = (letterId) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const letter = coverLetters.find(l => l.id === letterId)
        if (!letter) return { success: false, error: 'Ön yazı bulunamadı' }

        const newLetter = {
            ...letter,
            id: Date.now().toString(),
            jobTitle: `${letter.jobTitle} (Kopya)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        const allLetters = JSON.parse(localStorage.getItem('CVniz_cover_letters') || '[]')
        allLetters.push(newLetter)
        localStorage.setItem('CVniz_cover_letters', JSON.stringify(allLetters))
        loadUserCoverLetters()

        return { success: true, coverLetter: newLetter }
    }

    return (
        <CoverLetterContext.Provider value={{
            coverLetters,
            generating,
            tonePresets: TONE_PRESETS,
            generateCoverLetter,
            updateCoverLetter,
            deleteCoverLetter,
            duplicateCoverLetter,
            loadUserCoverLetters
        }}>
            {children}
        </CoverLetterContext.Provider>
    )
}

export const useCoverLetter = () => useContext(CoverLetterContext)

