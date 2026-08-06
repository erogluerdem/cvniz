import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles, Palette, BarChart3, FileText, Wand2, Lock, Crown,
    Languages, Target, RefreshCw, CheckCircle, Copy, X, ChevronRight
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
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-10 relative overflow-hidden"
                >
                    {/* Background glowing blobs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/5 flex items-center justify-center shadow-xl shadow-cyan-500/5 relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                            <Lock className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        </div>
                        <h3 className="text-2xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                            Premium Özellik
                        </h3>
                        <p className="text-slate-400 mb-8 max-w-[280px] text-sm leading-relaxed">
                            Bu özelliği kullanmak ve CV'nizi bir üst seviyeye taşımak için Pro veya Kurumsal pakete geçin.
                        </p>
                        <a 
                            href="/pricing" 
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 group"
                        >
                            <Crown className="w-5 h-5" /> 
                            <span>Planları Görüntüle</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </motion.div>
            )
        }

        switch (activeFeature) {
            case 'ai':
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="space-y-6"
                    >
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-cyan-400" />
                                AI ile Özet Oluştur
                            </h4>
                            <p className="text-sm text-slate-400 mb-3">
                                Profesyonel bir özet AI tarafından otomatik oluşturulsun.
                            </p>
                            <button
                                onClick={() => generateAIContent('summary')}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                {loading ? 'Oluşturuluyor...' : 'Özet Oluştur'}
                            </button>
                        </div>

                        <div className="border-t border-white/5 pt-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-purple-400" />
                                AI ile Yetenek Öner
                            </h4>
                            <p className="text-sm text-slate-400 mb-3">
                                Sektörünüze uygun yetenekler AI tarafından önerilsin.
                            </p>
                            <button
                                onClick={() => generateAIContent('skills')}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                {loading ? 'Öneriliyor...' : 'Yetenek Öner'}
                            </button>
                        </div>
                    </motion.div>
                )

            case 'colors':
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h4 className="font-semibold mb-4">Renk Şeması Seç</h4>
                        <p className="text-sm text-slate-400 mb-6">
                            CV şablonunuzun renklerini özelleştirin.
                        </p>
                        <div className="grid grid-cols-4 gap-3">
                            {colorSchemes.map(scheme => (
                                <button
                                    key={scheme.id}
                                    onClick={() => setSelectedColor(scheme.id)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedColor === scheme.id
                                            ? 'border-white scale-110 shadow-lg shadow-cyan-500/20'
                                            : 'border-transparent hover:border-white/30 hover:scale-105'
                                        }`}
                                >
                                    <div
                                        className="w-full h-full"
                                        style={{ background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})` }}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-white/5 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-lg shadow-md"
                                    style={{ background: `linear-gradient(135deg, ${colorSchemes.find(c => c.id === selectedColor)?.primary}, ${colorSchemes.find(c => c.id === selectedColor)?.secondary})` }}
                                />
                                <div>
                                    <div className="font-semibold text-slate-200">{colorSchemes.find(c => c.id === selectedColor)?.name}</div>
                                    <div className="text-xs text-slate-400 mt-1">Seçili renk şeması</div>
                                </div>
                                <CheckCircle className="w-6 h-6 text-emerald-400 ml-auto" />
                            </div>
                        </div>
                    </motion.div>
                )

            case 'ats':
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center"
                    >
                        <h4 className="font-semibold mb-4">ATS Uyumluluk Kontrolü</h4>
                        <p className="text-sm text-slate-400 mb-6">
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
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth="12"
                                        />
                                        <motion.circle
                                            initial={{ strokeDasharray: "0 440" }}
                                            animate={{ strokeDasharray: `${atsScore * 4.4} 440` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke={atsScore >= 80 ? '#10b981' : atsScore >= 60 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-extrabold">{atsScore}</span>
                                    </div>
                                </div>
                                <div className={`text-lg font-bold ${atsScore >= 80 ? 'text-emerald-400' :
                                        atsScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                                    }`}>
                                    {atsScore >= 80 ? 'Mükemmel!' :
                                        atsScore >= 60 ? 'İyi, geliştirilebilir' : 'Düşük, iyileştirme gerekli'}
                                </div>
                            </div>
                        ) : (
                            <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center bg-slate-900/30">
                                <BarChart3 className="w-12 h-12 text-slate-600" />
                            </div>
                        )}

                        <button
                            onClick={checkATSScore}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <BarChart3 className="w-4 h-4" />
                            )}
                            {loading ? 'Analiz ediliyor...' : 'ATS Skoru Kontrol Et'}
                        </button>

                        {atsScore !== null && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 text-left space-y-3 bg-slate-900/50 p-5 rounded-xl border border-white/5"
                            >
                                <h5 className="font-semibold text-sm text-slate-300">İyileştirme Önerileri:</h5>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    {cvData.personal.summary?.length < 100 && (
                                        <li className="flex items-start gap-3 bg-white/5 p-2 rounded-lg">
                                            <span className="text-amber-400 mt-0.5">•</span>
                                            <span>Özet bölümünü en az 100 karakter yapın</span>
                                        </li>
                                    )}
                                    {cvData.skills.length < 5 && (
                                        <li className="flex items-start gap-3 bg-white/5 p-2 rounded-lg">
                                            <span className="text-amber-400 mt-0.5">•</span>
                                            <span>En az 5 yetenek ekleyin</span>
                                        </li>
                                    )}
                                    {cvData.experience.length === 0 && (
                                        <li className="flex items-start gap-3 bg-white/5 p-2 rounded-lg">
                                            <span className="text-rose-400 mt-0.5">•</span>
                                            <span>İş deneyimi ekleyin</span>
                                        </li>
                                    )}
                                    {cvData.personal.summary?.length >= 100 && cvData.skills.length >= 5 && cvData.experience.length > 0 && (
                                        <li className="flex items-start gap-3 bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">
                                            <CheckCircle className="w-4 h-4 mt-0.5" />
                                            <span>CV'niz temel ATS gereksinimlerini karşılıyor!</span>
                                        </li>
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </motion.div>
                )

            case 'translate':
                return (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center"
                    >
                        <h4 className="font-semibold mb-4">CV Çevirisi</h4>
                        <p className="text-sm text-slate-400 mb-6">
                            CV'nizi farklı dillere otomatik çevirin.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {['İngilizce', 'Almanca', 'Fransızca', 'İspanyolca'].map(lang => (
                                <button
                                    key={lang}
                                    className="p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
                                >
                                    <Languages className="w-6 h-6 mx-auto mb-2 text-cyan-500 group-hover:scale-110 transition-transform duration-300" />
                                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{lang}</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium border border-cyan-500/20">
                            <Sparkles className="w-3 h-3" />
                            <span>Çeviri özelliği yakında aktif olacak</span>
                        </div>
                    </motion.div>
                )

            default:
                return null
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                className="relative bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl ring-1 ring-white/5 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-white">Premium Özellikler</h2>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-500'}`}></div>
                                <p className="text-xs font-medium text-slate-400">
                                    {isPremium ? 'Pro Üye' : 'Ücretsiz Hesap'}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Feature Tabs */}
                <div className="flex border-b border-white/5 overflow-x-auto hide-scrollbar">
                    {features.map(feature => {
                        const isActive = activeFeature === feature.id;
                        return (
                            <button
                                key={feature.id}
                                onClick={() => setActiveFeature(feature.id)}
                                className={`flex-1 min-w-[100px] py-4 flex flex-col items-center gap-2 transition-all duration-300 relative ${isActive
                                        ? 'text-cyan-400'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <motion.div
                                    animate={{ scale: isActive ? 1.1 : 1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <span className="text-xs font-medium">{feature.label}</span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTabIndicator"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8 overflow-y-auto max-h-[50vh] custom-scrollbar text-white">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
