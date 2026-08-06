import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReview, REVIEW_TYPES } from '../context/ReviewContext'
import {
    X, Check, Zap, User, Crown, Star, Clock, CreditCard,
    FileText, AlertCircle, ChevronRight, Loader2, Target, CheckCircle
} from 'lucide-react'

export default function CVReviewRequest({ isOpen, onClose, cv }) {
    const { requestReview, getUserReviews } = useReview() || {}
    const [step, setStep] = useState(1)
    const [selectedType, setSelectedType] = useState('ai')
    const [notes, setNotes] = useState('')
    const [processing, setProcessing] = useState(false)
    const [completedReview, setCompletedReview] = useState(null)

    const handleRequest = async () => {
        if (!cv?.data || !requestReview) return

        setProcessing(true)
        const result = requestReview(cv.id, cv.data, selectedType, notes)

        if (result.success) {
            setCompletedReview(result.review)
            setStep(3)

            // For AI reviews, wait for completion
            if (selectedType === 'ai') {
                setTimeout(() => {
                    const reviews = getUserReviews?.() || []
                    const updated = reviews.find(r => r.id === result.review.id)
                    if (updated) setCompletedReview(updated)
                }, 3000)
            }
        }

        setProcessing(false)
    }

    if (!isOpen) return null

    const types = Object.values(REVIEW_TYPES)

    // Helper for score colors
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-[#10B981]' // Neon Green
        if (score >= 60) return 'text-cyan-400'
        if (score >= 40) return 'text-amber-400'
        return 'text-red-400'
    }
    
    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-[#10B981]'
        if (score >= 60) return 'bg-cyan-500'
        if (score >= 40) return 'bg-amber-500'
        return 'bg-red-500'
    }

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-3xl bg-[#0F1115] border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden my-4 flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent gap-4 relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <FileText className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    CV İnceleme Servisi <span className="text-xs font-bold text-black bg-[#10B981] px-2 py-0.5 rounded-md shadow-sm">PRO</span>
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {cv?.name || 'CV'} • {step === 1 ? 'Paket Seçimi' : step === 2 ? 'Onay' : 'Sonuç'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-black/40 border-b border-white/5 p-4 flex flex-col gap-2 relative z-10">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400 px-2">
                            <span className={step >= 1 ? 'text-[#10B981]' : ''}>1. Seçim</span>
                            <span className={step >= 2 ? 'text-[#10B981]' : ''}>2. Notlar</span>
                            <span className={step >= 3 ? 'text-[#10B981]' : ''}>3. Sonuç</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399]"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            
                            {/* Step 1: Select Type */}
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Target className="w-6 h-6 text-[#10B981]" />
                                        <h3 className="text-2xl font-black text-white">İnceleme Paketi Seçin</h3>
                                    </div>

                                    <div className="grid gap-4">
                                        {types.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedType(type.id)}
                                                className={`w-full p-6 rounded-3xl text-left transition-all relative overflow-hidden group ${selectedType === type.id
                                                    ? 'bg-[#10B981]/10 border border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                    : 'bg-black/20 border border-white/5 hover:bg-white/5'
                                                    }`}
                                            >
                                                {selectedType === type.id && (
                                                    <div className="absolute top-6 right-6">
                                                        <CheckCircle className="w-6 h-6 text-[#10B981]" />
                                                    </div>
                                                )}
                                                
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${type.id === 'ai' ? 'bg-[#10B981]/20 border border-[#10B981]/30' :
                                                        type.id === 'expert' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-amber-500/20 border border-amber-500/30'
                                                        }`}>
                                                        {type.id === 'ai' ? <Zap className={`w-8 h-8 ${selectedType === type.id ? 'text-[#10B981]' : 'text-gray-400'}`} /> :
                                                            type.id === 'expert' ? <User className={`w-8 h-8 ${selectedType === type.id ? 'text-cyan-400' : 'text-gray-400'}`} /> :
                                                                <Crown className={`w-8 h-8 ${selectedType === type.id ? 'text-amber-400' : 'text-gray-400'}`} />}
                                                    </div>
                                                    
                                                    <div className="flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                            <span className={`text-xl font-bold ${selectedType === type.id ? 'text-[#10B981]' : 'text-white'}`}>{type.name}</span>
                                                            <span className={`text-2xl font-black ${selectedType === type.id ? 'text-[#10B981]' : 'text-gray-300'}`}>₺{type.price}</span>
                                                        </div>
                                                        <p className="text-gray-400 mb-4 font-medium leading-relaxed pr-8">{type.description}</p>
                                                        
                                                        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-bold text-gray-500">
                                                            <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                                                <Clock className="w-4 h-4" />
                                                                {type.duration}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap gap-2">
                                                            {type.features.map((f, i) => (
                                                                <span key={i} className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${selectedType === type.id ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-gray-400'}`}>
                                                                    <Check className="w-3 h-3" /> {f}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="w-full md:w-auto px-10 py-4 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] group"
                                        >
                                            Devam Et <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 2: Notes & Confirm */}
                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 max-w-2xl mx-auto"
                                >
                                    <div className="p-6 rounded-3xl bg-gradient-to-r from-[#10B981]/10 to-transparent border border-[#10B981]/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-bold text-[#10B981] uppercase tracking-widest mb-1">Seçilen Paket</div>
                                                <div className="text-2xl font-black text-white">{REVIEW_TYPES[selectedType].name}</div>
                                                <p className="text-sm text-gray-400 mt-2 font-medium">{REVIEW_TYPES[selectedType].description}</p>
                                            </div>
                                            <div className="text-4xl font-black text-[#10B981] bg-black/40 px-6 py-4 rounded-2xl border border-white/5">
                                                ₺{REVIEW_TYPES[selectedType].price}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                            <FileText className="w-5 h-5 text-[#10B981]" /> Özel Notlarınız <span className="text-xs text-gray-500 font-normal ml-auto">(İsteğe bağlı)</span>
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={5}
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none resize-none text-white placeholder-gray-600 transition-all shadow-inner leading-relaxed"
                                            placeholder="Özellikle dikkat edilmesini istediğiniz noktalar, başvuracağınız pozisyonlar veya hedefleriniz..."
                                        />
                                    </div>

                                    <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-amber-500 mb-1">Ödeme Bilgisi (Demo Modu)</h4>
                                                <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                                    Şu an demo modundasınız, gerçek bir ücretlendirme yapılmayacaktır. Sistem size sürecin nasıl işlediğini göstermek için tasarlanmıştır.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5"
                                        >
                                            Geri
                                        </button>
                                        <button
                                            onClick={handleRequest}
                                            disabled={processing}
                                            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <><Loader2 className="w-6 h-6 animate-spin" /> İşleniyor...</>
                                            ) : (
                                                <><CreditCard className="w-6 h-6" /> ₺{REVIEW_TYPES[selectedType].price} Öde ve Başla</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 3: Result / Loading */}
                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="max-w-3xl mx-auto"
                                >
                                    {completedReview?.status === 'completed' && completedReview.feedback ? (
                                        <div className="space-y-8">
                                            {/* Score Header */}
                                            <div className="relative p-8 rounded-3xl border bg-[#10B981]/10 border-[#10B981]/30 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#10B981]/20 rounded-full blur-3xl"></div>
                                                
                                                <div className="relative z-10 flex items-center gap-6 flex-col md:flex-row">
                                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] border-4 border-[#0F1115]">
                                                        <Check className="w-12 h-12 text-black" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-[#10B981] uppercase tracking-widest mb-2">Analiz Tamamlandı</div>
                                                        <h3 className="text-3xl font-black text-white">Sonuç Raporu Hazır</h3>
                                                    </div>
                                                </div>

                                                <div className="relative z-10 flex flex-col items-center justify-center bg-black/40 px-8 py-6 rounded-3xl border border-white/5 shadow-inner">
                                                    <div className={`text-6xl font-black drop-shadow-md mb-2 ${getScoreColor(completedReview.feedback.overallScore)}`}>
                                                        {completedReview.feedback.overallScore}
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Genel Puan</div>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Sections */}
                                                <div className="space-y-4">
                                                    <h4 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                                                        <Target className="w-5 h-5 text-[#10B981]" /> Kategori Puanları
                                                    </h4>
                                                    {completedReview.feedback.sections?.map((section, i) => (
                                                        <div key={i} className="p-5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="font-bold text-white">{section.name}</span>
                                                                <span className={`font-black text-lg ${getScoreColor(section.score)}`}>
                                                                    {section.score}/100
                                                                </span>
                                                            </div>
                                                            <div className="h-2.5 bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5 mb-3">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${section.score}%` }}
                                                                    transition={{ duration: 1, delay: 0.2 }}
                                                                    className={`h-full rounded-full ${getScoreBg(section.score)}`}
                                                                />
                                                            </div>
                                                            {section.issues.length > 0 && (
                                                                <div className="text-sm text-gray-400 font-medium flex items-start gap-2 bg-black/40 p-3 rounded-xl border border-red-500/10">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                                                                    {section.issues[0]}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Top Suggestions */}
                                                <div className="h-full">
                                                    <div className="p-6 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 h-full flex flex-col">
                                                        <h4 className="font-bold text-cyan-400 mb-6 flex items-center gap-2 text-lg">
                                                            <Zap className="w-5 h-5 fill-current" />
                                                            Kritik İyileştirme Önerileri
                                                        </h4>
                                                        <ul className="space-y-4 text-sm text-gray-300 font-medium flex-1">
                                                            {completedReview.feedback.topSuggestions?.map((s, i) => (
                                                                <li key={i} className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-cyan-500/10">
                                                                    <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                                                    <span className="leading-relaxed">{s}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-center pt-8 border-t border-white/5">
                                                <button
                                                    onClick={onClose}
                                                    className="px-12 py-4 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                >
                                                    Paneli Kapat <CheckCircle className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center flex flex-col items-center justify-center">
                                            <div className="relative mb-8">
                                                <div className="w-24 h-24 rounded-full border-4 border-[#10B981]/20 border-t-[#10B981] animate-spin"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    {selectedType === 'ai' ? <Zap className="w-8 h-8 text-[#10B981]" /> : <User className="w-8 h-8 text-cyan-400" />}
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-4">
                                                {selectedType === 'ai' ? 'Yapay Zeka İnceliyor...' : 'Talebiniz Alındı!'}
                                            </h3>
                                            <p className="text-lg text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
                                                {selectedType === 'ai'
                                                    ? 'CV\'niz milyonlarca veri noktası üzerinden analiz ediliyor. Lütfen bekleyin.'
                                                    : `Uzmanımız ${REVIEW_TYPES[selectedType].duration} içinde belirttiğiniz detaylar üzerinden sizinle iletişime geçecek.`
                                                }
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
