import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

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

        // Simulate AI generation (in production, this would call an API)
        await new Promise(resolve => setTimeout(resolve, 2000))

        const tonePreset = TONE_PRESETS[tone] || TONE_PRESETS.formal
        const fullName = cvData?.personal?.fullName || 'Aday'
        const currentTitle = cvData?.personal?.title || 'Profesyonel'
        const skills = cvData?.skills?.slice(0, 5).map(s => s.name).join(', ') || 'çeşitli beceriler'
        const experience = cvData?.experience?.[0]
        const experienceText = experience
            ? `${experience.company} şirketinde ${experience.position} olarak çalıştım`
            : 'sektörde deneyim kazandım'

        // Generate cover letter content based on inputs
        const content = `${tonePreset.greeting}

${company ? `${company} bünyesinde açık olan ` : ''}${jobTitle} pozisyonu için başvurumu sunarım. ${currentTitle} olarak ${experienceText} ve bu deneyimlerimle ekibinize değer katabileceğime inanıyorum.

${jobDescription ? `İlanınızda belirtilen gereksinimleri incelediğimde, ${skills} konularındaki yetkinliklerimin bu pozisyon için oldukça uygun olduğunu gördüm. ` : ''}Kariyerim boyunca edindiğim ${skills} becerileri, bu rol için beni güçlü bir aday yapmaktadır.

${experience ? `${experience.company} şirketindeki deneyimim sırasında ${experience.description?.substring(0, 100) || 'önemli projeler yürüttüm'}. Bu süreçte kazandığım problem çözme ve takım çalışması becerileri, yeni pozisyonda da başarılı olmamı sağlayacaktır.` : 'Profesyonel yaşamım boyunca edindiğim deneyimler, bu pozisyonda başarılı olmamı sağlayacak güçlü bir temel oluşturmaktadır.'}

${company ? `${company}'ın vizyonu ve ` : 'Şirketinizin '}sektördeki konumu beni heyecanlandırıyor. Bu ekibin bir parçası olarak hem kişisel gelişimime katkıda bulunmak hem de şirketin hedeflerine ulaşmasında aktif rol almak istiyorum.

Başvurumu değerlendirmeniz için teşekkür eder, görüşme fırsatı için sabırsızlanıyorum.

${tonePreset.closing}
${fullName}`

        const coverLetter = {
            id: Date.now().toString(),
            userId: user.id,
            jobTitle,
            company: company || 'Belirtilmedi',
            tone,
            content,
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

