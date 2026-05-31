import { useState } from 'react'
import {
    Sparkles, Palette, BarChart3, FileText, Wand2, Lock, Crown,
    Languages, Target, RefreshCw, CheckCircle, Copy, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function PremiumFeaturesPanel({ cvData, setCVData, onClose }) {
    const { isPremium } = useAuth()
    const [activeFeature, setActiveFeature] = useState('ai')
    const [loading, setLoading] = useState(false)
    const [atsScore, setAtsScore] = useState(null)
    const [selectedColor, setSelectedColor] = useState('cyan')

    const colorSchemes = [
        { id: 'cyan', name: 'Turkuaz', primary: '#06b6d4', secondary: '#0891b2' },
        { id: 'blue', name: 'Mavi', primary: '#3b82f6', secondary: '#2563eb' },
        { id: 'purple', name: 'Mor', primary: '#8b5cf6', secondary: '#7c3aed' },
        { id: 'emerald', name: 'Zümrüt', primary: '#10b981', secondary: '#059669' },
        { id: 'rose', name: 'Gül', primary: '#f43f5e', secondary: '#e11d48' },
        { id: 'amber', name: 'Amber', primary: '#f59e0b', secondary: '#d97706' },
        { id: 'slate', name: 'Gri', primary: '#64748b', secondary: '#475569' },
        { id: 'indigo', name: 'İndigo', primary: '#6366f1', secondary: '#4f46e5' },
    ]

    const aiSuggestions = {
        summary: [
            "10+ yıllık deneyime sahip, sonuç odaklı profesyonel. Liderlik becerileri ve stratejik düşünme yeteneği ile ekipleri başarıya taşıma konusunda kanıtlanmış bir geçmiş.",
            "Yenilikçi çözümler geliştirme konusunda tutkulu, analitik düşünce yapısına sahip uzman. Karmaşık problemleri çözme ve süreçleri optimize etme konusunda güçlü bir geçmiş.",
            "Dinamik ve özverili profesyonel, hızlı öğrenme yeteneği ve adaptasyon becerisi ile değişen iş gereksinimlerine kolayca uyum sağlar."
        ],
        skills: [
            ["Proje Yönetimi", "Agile/Scrum", "Takım Liderliği", "Stratejik Planlama", "Problem Çözme"],
            ["Microsoft Office", "Google Suite", "Data Analizi", "Raporlama", "Sunum Becerileri"],
            ["İletişim", "Müzakere", "Zaman Yönetimi", "Çatışma Çözümü", "Mentörlük"]
        ]
    }

    const generateAIContent = async (type) => {
        if (!isPremium) return
        setLoading(true)

        // Simulate AI generation
        await new Promise(resolve => setTimeout(resolve, 1500))

        if (type === 'summary') {
            const randomSummary = aiSuggestions.summary[Math.floor(Math.random() * aiSuggestions.summary.length)]
            setCVData(prev => ({
                ...prev,
                personal: { ...prev.personal, summary: randomSummary }
            }))
        } else if (type === 'skills') {
            const randomSkills = aiSuggestions.skills[Math.floor(Math.random() * aiSuggestions.skills.length)]
            setCVData(prev => ({
                ...prev,
                skills: randomSkills
            }))
        }

        setLoading(false)
    }

    const checkATSScore = async () => {
        if (!isPremium) return
        setLoading(true)

        await new Promise(resolve => setTimeout(resolve, 2000))

        // Calculate mock ATS score based on CV completeness
        let score = 0
        if (cvData.personal.fullName) score += 10
        if (cvData.personal.email) score += 10
        if (cvData.personal.phone) score += 10
        if (cvData.personal.summary && cvData.personal.summary.length > 100) score += 15
        if (cvData.experience.length > 0) score += 20
        if (cvData.education.length > 0) score += 15
        if (cvData.skills.length >= 5) score += 10
        if (cvData.languages?.length > 0) score += 10

        setAtsScore(Math.min(score, 100))
        setLoading(false)
    }

    const features = [
        { id: 'ai', icon: <Sparkles className="w-5 h-5" />, label: 'AI İçerik' },
        { id: 'colors', icon: <Palette className="w-5 h-5" />, label: 'Renk Şeması' },
        { id: 'ats', icon: <BarChart3 className="w-5 h-5" />, label: 'ATS Skoru' },
        { id: 'translate', icon: <Languages className="w-5 h-5" />, label: 'Çeviri' },
    ]

    const renderContent = () => {
        if (!isPremium) {
            return (
                <div className="text-center py-12">
                    <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Premium Özellik</h3>
                    <p className="text-gray-400 mb-6">Bu özelliği kullanmak için Pro veya Kurumsal pakete geçin.</p>
                    <a href="/pricing" className="btn-premium inline-flex items-center gap-2">
                        <Crown className="w-5 h-5" /> Planları Gör
                    </a>
                </div>
            )
        }

        switch (activeFeature) {
            case 'ai':
                return (
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-cyan-400" />
                                AI ile Özet Oluştur
                            </h4>
                            <p className="text-sm text-gray-400 mb-3">
                                Profesyonel bir özet AI tarafından otomatik oluşturulsun.
                            </p>
                            <button
                                onClick={() => generateAIContent('summary')}
                                disabled={loading}
                                className="btn-premium w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                {loading ? 'Oluşturuluyor...' : 'Özet Oluştur'}
                            </button>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-400" />
                                AI ile Yetenek Öner
                            </h4>
                            <p className="text-sm text-gray-400 mb-3">
                                Sektörünüze uygun yetenekler AI tarafından önerilsin.
                            </p>
                            <button
                                onClick={() => generateAIContent('skills')}
                                disabled={loading}
                                className="btn-secondary w-full flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                {loading ? 'Öneriliyor...' : 'Yetenek Öner'}
                            </button>
                        </div>
                    </div>
                )

            case 'colors':
                return (
                    <div>
                        <h4 className="font-semibold mb-4">Renk Şeması Seç</h4>
                        <p className="text-sm text-gray-400 mb-6">
                            CV şablonunuzun renklerini özelleştirin.
                        </p>
                        <div className="grid grid-cols-4 gap-3">
                            {colorSchemes.map(scheme => (
                                <button
                                    key={scheme.id}
                                    onClick={() => setSelectedColor(scheme.id)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedColor === scheme.id
                                            ? 'border-white scale-110'
                                            : 'border-transparent hover:border-white/50'
                                        }`}
                                >
                                    <div
                                        className="w-full h-full"
                                        style={{ background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})` }}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 p-4 glass-card rounded-xl">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-lg"
                                    style={{ background: `linear-gradient(135deg, ${colorSchemes.find(c => c.id === selectedColor)?.primary}, ${colorSchemes.find(c => c.id === selectedColor)?.secondary})` }}
                                />
                                <div>
                                    <div className="font-semibold">{colorSchemes.find(c => c.id === selectedColor)?.name}</div>
                                    <div className="text-sm text-gray-400">Seçili renk şeması</div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                            </div>
                        </div>
                    </div>
                )

            case 'ats':
                return (
                    <div className="text-center">
                        <h4 className="font-semibold mb-4">ATS Uyumluluk Kontrolü</h4>
                        <p className="text-sm text-gray-400 mb-6">
                            CV'nizin ATS (Başvuru Takip Sistemi) tarafından ne kadar iyi okunacağını kontrol edin.
                        </p>

                        {atsScore !== null ? (
                            <div className="mb-6">
                                <div className="relative w-40 h-40 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="12"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke={atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="12"
                                            strokeDasharray={`${atsScore * 4.4} 440`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-bold">{atsScore}</span>
                                    </div>
                                </div>
                                <div className={`text-lg font-semibold ${atsScore >= 80 ? 'text-green-400' :
                                        atsScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                    {atsScore >= 80 ? 'Mükemmel!' :
                                        atsScore >= 60 ? 'İyi, geliştirilebilir' : 'Düşük, iyileştirme gerekli'}
                                </div>
                            </div>
                        ) : (
                            <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center">
                                <BarChart3 className="w-12 h-12 text-gray-500" />
                            </div>
                        )}

                        <button
                            onClick={checkATSScore}
                            disabled={loading}
                            className="btn-premium w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <BarChart3 className="w-4 h-4" />
                            )}
                            {loading ? 'Analiz ediliyor...' : 'ATS Skoru Kontrol Et'}
                        </button>

                        {atsScore !== null && (
                            <div className="mt-6 text-left space-y-2">
                                <h5 className="font-semibold text-sm">İyileştirme Önerileri:</h5>
                                <ul className="space-y-1 text-sm text-gray-400">
                                    {cvData.personal.summary?.length < 100 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400">•</span>
                                            Özet bölümünü en az 100 karakter yapın
                                        </li>
                                    )}
                                    {cvData.skills.length < 5 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400">•</span>
                                            En az 5 yetenek ekleyin
                                        </li>
                                    )}
                                    {cvData.experience.length === 0 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400">•</span>
                                            İş deneyimi ekleyin
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )

            case 'translate':
                return (
                    <div className="text-center">
                        <h4 className="font-semibold mb-4">CV Çevirisi</h4>
                        <p className="text-sm text-gray-400 mb-6">
                            CV'nizi farklı dillere otomatik çevirin.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {['İngilizce', 'Almanca', 'Fransızca', 'İspanyolca'].map(lang => (
                                <button
                                    key={lang}
                                    className="p-4 glass-card rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <Languages className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                                    <span className="text-sm">{lang}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-6">
                            Çeviri özelliği yakında aktif olacak.
                        </p>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center">
                            <Crown className="w-5 h-5 text-slate-900" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Premium Özellikler</h2>
                            <p className="text-xs text-gray-400">
                                {isPremium ? 'Pro Üye' : 'Ücretsiz Hesap'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Feature Tabs */}
                <div className="flex border-b border-white/10">
                    {features.map(feature => (
                        <button
                            key={feature.id}
                            onClick={() => setActiveFeature(feature.id)}
                            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${activeFeature === feature.id
                                    ? 'bg-white/10 text-cyan-400'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {feature.icon}
                            <span className="text-xs">{feature.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}
