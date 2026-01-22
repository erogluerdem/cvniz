import { createContext, useContext, useState, useEffect } from 'react'
import { contentAPI } from '../services/api'

const SiteContentContext = createContext()

// Default site content
const defaultContent = {
    hero: {
        title: 'Profesyonel CV\'nizi',
        titleHighlight: 'Dakikalar İçinde',
        titleEnd: 'Oluşturun',
        subtitle: 'Yapay zeka destekli CV oluşturucu ile kariyer hedeflerinize ulaşın. 200+ profesyonel şablon, anında PDF indirme.',
        ctaPrimary: 'Ücretsiz Başla',
        ctaSecondary: 'Şablonları İncele',
        badge: '🚀 100.000+ kullanıcı güveniyor'
    },
    stats: [
        { value: 100000, suffix: '+', label: 'Mutlu Kullanıcı' },
        { value: 107, suffix: '+', label: 'Profesyonel Şablon' },
        { value: 98, suffix: '%', label: 'Memnuniyet Oranı' },
        { value: 24, suffix: '/7', label: 'Destek' }
    ],
    features: [
        { icon: 'Sparkles', title: 'AI Destekli İçerik', description: 'Yapay zeka ile profesyonel CV metinleri oluşturun.' },
        { icon: 'Download', title: 'Anında PDF', description: 'CV\'nizi tek tıkla PDF olarak indirin.' },
        { icon: 'Shield', title: 'ATS Uyumlu', description: 'Tüm şablonlarımız ATS sistemleriyle uyumludur.' },
        { icon: 'Globe', title: 'Çok Dilli', description: '10+ dilde CV oluşturma desteği.' }
    ],
    testimonials: [
        { name: 'Ahmet Yılmaz', role: 'Yazılım Mühendisi', text: 'CVniz sayesinde hayalimdeki işe girdim!', rating: 5 },
        { name: 'Ayşe Kaya', role: 'Pazarlama Uzmanı', text: 'Profesyonel ve kullanımı çok kolay.', rating: 5 },
        { name: 'Mehmet Demir', role: 'Grafik Tasarikcı', text: 'Şablonlar gerçekten çok şık.', rating: 5 }
    ],
    faqs: [
        { question: 'CVniz ücretsiz mi?', answer: 'Evet, temel özellikler ücretsizdir. Premium özellikler için Pro plan gereklidir.' },
        { question: 'Kaç tane CV oluşturabilirim?', answer: 'Ücretsiz planda 1, Pro planda sınırsız CV oluşturabilirsiniz.' },
        { question: 'PDF indirmek ücretli mi?', answer: 'Ücretsiz planda 3 indirme hakkınız var. Pro\'da sınırsız.' },
        { question: 'Şablonları değiştirebilir miyim?', answer: 'Evet, istediğiniz zaman şablon değiştirebilirsiniz.' },
        { question: 'Verilerim güvende mi?', answer: 'Evet, 256-bit SSL şifreleme ile verileriniz korunur.' }
    ],
    steps: [
        { icon: 'FileText', title: 'Şablon Seç', description: '200+ profesyonel şablon arasından seç' },
        { icon: 'Zap', title: 'Bilgilerini Gir', description: 'AI destekli editör ile içerik oluştur' },
        { icon: 'Download', title: 'PDF İndir', description: '300 DPI kalitesinde profesyonel CV' }
    ],
    companies: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Spotify', 'Tesla'],
    pricing: {
        free: { price: 0, features: ['1 CV', '1 Şablon', '3 PDF İndirme'] },
        pro: { price: 29, features: ['Sınırsız CV', '200+ Şablon', 'Sınırsız PDF', 'AI Asistan', 'Öncelikli Destek'] }
    },
    footer: {
        description: 'Profesyonel CV oluşturmanın en kolay yolu.',
        copyright: '© 2024 CVniz. Tüm hakları saklıdır.'
    },
    seo: {
        title: 'CVniz - Profesyonel CV Oluşturucu',
        description: 'Yapay zeka destekli CV oluşturucu ile kariyer hedeflerinize ulaşın.',
        keywords: 'cv, özgeçmiş, resume, cv oluşturucu, profesyonel cv'
    }
}

export function SiteContentProvider({ children }) {
    const [content, setContent] = useState(() => {
        try {
            const saved = localStorage.getItem('CVniz_site_content')
            return saved ? JSON.parse(saved) : defaultContent
        } catch (e) {
            return defaultContent
        }
    })

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await contentAPI.getLandingPageContent()
                if (response.success && response.content) {
                    const mergedContent = {
                        ...defaultContent,
                        ...response.content,
                        // Deep merge hero for safety
                        hero: { ...defaultContent.hero, ...response.content.hero }
                    }
                    setContent(mergedContent)
                    localStorage.setItem('CVniz_site_content', JSON.stringify(mergedContent))
                }
            } catch (error) {
                console.error('Failed to fetch site content from API:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchContent()
    }, [])

    const updateContent = (section, data) => {
        setContent(prev => {
            const next = { ...prev, [section]: data }
            localStorage.setItem('CVniz_site_content', JSON.stringify(next))
            return next
        })
    }

    const updateNestedContent = (section, index, data) => {
        setContent(prev => {
            const next = {
                ...prev,
                [section]: prev[section]?.map((item, i) => i === index ? { ...item, ...data } : item) || []
            }
            localStorage.setItem('CVniz_site_content', JSON.stringify(next))
            return next
        })
    }

    const addItem = (section, item) => {
        setContent(prev => {
            const next = { ...prev, [section]: [...prev[section], item] }
            localStorage.setItem('CVniz_site_content', JSON.stringify(next))
            return next
        })
    }

    const removeItem = (section, index) => {
        setContent(prev => {
            const next = { ...prev, [section]: prev[section].filter((_, i) => i !== index) }
            localStorage.setItem('CVniz_site_content', JSON.stringify(next))
            return next
        })
    }

    const resetToDefault = () => {
        setContent(defaultContent)
        localStorage.removeItem('CVniz_site_content')
    }

    return (
        <SiteContentContext.Provider value={{
            content,
            isLoading,
            updateContent,
            updateNestedContent,
            addItem,
            removeItem,
            resetToDefault,
            defaultContent
        }}>
            {children}
        </SiteContentContext.Provider>
    )
}

export function useSiteContent() {
    const context = useContext(SiteContentContext)
    if (!context) {
        throw new Error('useSiteContent must be used within a SiteContentProvider')
    }
    return context
}

