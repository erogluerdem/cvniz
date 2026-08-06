import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { Link } from 'react-router-dom'
import {
    X, Link2, Target, Sparkles, Loader2, CheckCircle, AlertCircle,
    FileText, ChevronRight, Zap, CreditCard, ExternalLink, Award,
    Copy, Download, ArrowRight, Tag, Briefcase, Building, Crown
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
const CREDIT_PRICE = 49.90

export default function TargetFitAI({ isOpen, onClose }) {
    const { token } = useAuth()
    const { cvs, refreshCVs } = useCV()

    const [step, setStep] = useState('input') // input, analyzing, preview, success
    const [selectedCV, setSelectedCV] = useState(null)
    const [jobUrl, setJobUrl] = useState('')
    const [jobText, setJobText] = useState('')
    const [inputMode, setInputMode] = useState('url') // url, text
    const [isLoading, setIsLoading] = useState(false)
    const [jobData, setJobData] = useState(null)
    const [credits, setCredits] = useState(0)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen && token) {
            fetchCredits()
        }
    }, [isOpen, token])

    const fetchCredits = async () => {
        try {
            const response = await fetch(`${API_URL}/target-fit/credits`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setCredits(data.credits)
            }
        } catch (err) {
            console.error('Credits fetch error:', err)
        }
    }

    const handleAnalyze = async () => {
        if (!selectedCV) {
            setError('Lütfen bir CV seçin')
            return
        }
        if (inputMode === 'url' && !jobUrl.trim()) {
            setError('Lütfen iş ilanı linkini girin')
            return
        }
        if (inputMode === 'text' && !jobText.trim()) {
            setError('Lütfen iş ilanı metnini girin')
            return
        }

        setIsLoading(true)
        setError(null)
        setStep('analyzing')

        try {
            const response = await fetch(`${API_URL}/target-fit/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    jobUrl: inputMode === 'url' ? jobUrl : null,
                    jobText: inputMode === 'text' ? jobText : null
                })
            })

            if (response.ok) {
                const data = await response.json()
                setJobData(data.jobData)
                setStep('preview')
            } else {
                const data = await response.json()
                setError(data.error || 'İlan analiz edilemedi')
                setStep('input')
            }
        } catch (err) {
            console.error('Analysis error:', err)
            setError('Bağlantı hatası')
            setStep('input')
        }

        setIsLoading(false)
    }

    const handleTailor = async () => {
        if (credits < 1) {
            setError('credits')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_URL}/target-fit/tailor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cvId: selectedCV,
                    jobUrl: inputMode === 'url' ? jobUrl : null,
                    jobText: inputMode === 'text' ? jobText : null,
                    jobData
                })
            })

            if (response.ok) {
                const data = await response.json()
                setResult(data)
                setCredits(data.creditsRemaining)
                setStep('success')
                refreshCVs?.()
            } else if (response.status === 403) {
                setError('credits')
            } else {
                const data = await response.json()
                setError(data.error || 'CV düzenlenemedi')
            }
        } catch (err) {
            console.error('Tailoring error:', err)
            setError('Bağlantı hatası')
        }

        setIsLoading(false)
    }

    const resetFlow = () => {
        setStep('input')
        setJobData(null)
        setResult(null)
        setError(null)
        setJobUrl('')
        setJobText('')
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/90 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-3xl bg-[#0F1115] border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
                                <Target className="text-white" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">Target-Fit AI <Sparkles size={16} className="text-[#10B981]" /></h2>
                                <p className="text-sm text-gray-400">İlana özel, anahtar kelime optimizasyonlu CV oluştur</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 bg-black/40 border border-[#10B981]/30 rounded-xl flex items-center gap-2">
                                <CreditCard size={16} className="text-[#10B981]" />
                                <span className="font-bold text-white">{credits} Kredi</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative z-10"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    {(step === 'input' || step === 'preview' || step === 'success') && (
                        <div className="px-6 py-4 border-b border-white/5 bg-black/40">
                            <div className="flex items-center gap-4 max-w-sm">
                                {[1, 2, 3].map((s) => {
                                    const isActive = (s === 1 && step === 'input') || 
                                                     (s === 2 && step === 'preview') || 
                                                     (s === 3 && step === 'success') ||
                                                     (step === 'success' && s < 3) ||
                                                     (step === 'preview' && s < 2);
                                                     
                                    return (
                                        <div key={s} className="flex items-center flex-1 last:flex-none">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                                isActive
                                                    ? 'bg-[#10B981] text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                                    : 'bg-white/5 text-gray-500'
                                            }`}>
                                                {s}
                                            </div>
                                            {s < 3 && (
                                                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                                                    (step === 'preview' && s === 1) || (step === 'success') ? 'bg-[#10B981]' : 'bg-white/10'
                                                }`} />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-[#10B981]/30 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            
                            {/* STEP 1: Input */}
                            {step === 'input' && (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* How it works Banner */}
                                    <div className="bg-gradient-to-br from-black/40 to-[#10B981]/5 border border-[#10B981]/20 rounded-2xl p-5">
                                        <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                            <Sparkles size={18} className="text-[#10B981]" />
                                            Nasıl Çalışır?
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            1. İş ilanı linkini yapıştırın → 2. AI ilanı analiz eder → 3. CV'niz, iş ilanındaki gereksinimlere ve anahtar kelimelere göre saniyeler içinde mükemmel uyumlu hale getirilerek baştan yazılır (1 Kredi).
                                        </p>
                                    </div>

                                    {error && error !== 'credits' && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                                            <AlertCircle size={20} />
                                            {error}
                                        </div>
                                    )}

                                    {/* CV Selection */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                            <FileText size={16} className="text-[#10B981]" /> Düzenlenecek CV
                                        </label>
                                        <select
                                            value={selectedCV || ''}
                                            onChange={(e) => setSelectedCV(e.target.value)}
                                            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                        >
                                            <option value="">CV Seçiniz...</option>
                                            {cvs?.map(cv => (
                                                <option key={cv.id || cv._id} value={cv.id || cv._id} className="bg-[#0F1115]">
                                                    {cv.name || 'İsimsiz CV'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Job Input */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                                            <Target size={16} className="text-[#10B981]" /> İş İlanı
                                        </label>
                                        
                                        <div className="flex gap-2 mb-3">
                                            <button
                                                onClick={() => setInputMode('url')}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                                    inputMode === 'url'
                                                        ? 'bg-[#10B981] text-black'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <Link2 size={16} /> Link ile
                                            </button>
                                            <button
                                                onClick={() => setInputMode('text')}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                                    inputMode === 'text'
                                                        ? 'bg-[#10B981] text-black'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <FileText size={16} /> Metin ile
                                            </button>
                                        </div>

                                        {inputMode === 'url' ? (
                                            <input
                                                type="url"
                                                value={jobUrl}
                                                onChange={(e) => setJobUrl(e.target.value)}
                                                placeholder="https://kariyer.net/is-ilani/..."
                                                className="w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                            />
                                        ) : (
                                            <textarea
                                                value={jobText}
                                                onChange={(e) => setJobText(e.target.value)}
                                                placeholder="İş ilanının tamamını buraya yapıştırın..."
                                                className="w-full h-32 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all resize-none"
                                            />
                                        )}
                                        {inputMode === 'url' && (
                                            <p className="text-xs text-gray-500 mt-2">Desteklenen siteler: Kariyer.net, LinkedIn, Indeed, vb.</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isLoading}
                                        className="w-full py-4 mt-6 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#10B981]/20 transition-all group"
                                    >
                                        <Target size={20} className="group-hover:scale-110 transition-transform" /> 
                                        İlanı Analiz Et
                                    </button>
                                    <p className="text-center text-xs text-gray-500">Analiz ücretsiz • Düzenleme 1 kredi</p>
                                </motion.div>
                            )}

                            {/* STEP 2: Analyzing Loading */}
                            {step === 'analyzing' && (
                                <motion.div
                                    key="analyzing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-12"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-white/10 rounded-full"></div>
                                        <div className="w-20 h-20 border-4 border-[#10B981] rounded-full border-t-transparent animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Target className="text-[#10B981]" size={24} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mt-6 mb-2">İlan Analiz Ediliyor</h3>
                                    <p className="text-gray-400 max-w-sm text-center">Yapay zeka iş ilanını okuyor ve anahtar kelimeleri çıkarıyor...</p>
                                </motion.div>
                            )}

                            {/* STEP 3: Preview */}
                            {step === 'preview' && jobData && (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white mb-1">{jobData.title || 'Pozisyon'}</h3>
                                                <p className="text-gray-400 flex items-center gap-2">
                                                    <Building size={16} /> {jobData.company || 'Şirket'}
                                                </p>
                                            </div>
                                            <div className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] rounded-full text-sm font-bold flex items-center gap-1">
                                                <CheckCircle size={14} /> Analiz Tamamlandı
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                                                    <Tag size={16} className="text-[#10B981]" /> Aranan Anahtar Kelimeler
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {jobData.skills?.length > 0 ? jobData.skills.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                                                            {skill}
                                                        </span>
                                                    )) : (
                                                        <span className="text-gray-500 text-sm">Belirgin bir kelime bulunamadı.</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                                                    <Briefcase size={16} className="text-[#10B981]" /> Gereksinimler
                                                </h4>
                                                <ul className="space-y-2">
                                                    {jobData.requirements?.length > 0 ? jobData.requirements.map((req, i) => (
                                                        <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 flex-shrink-0" />
                                                            {req}
                                                        </li>
                                                    )) : (
                                                        <span className="text-gray-500 text-sm">Gereksinim listesi okunamadı.</span>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {error === 'credits' && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <AlertCircle size={20} />
                                                <span>Yeterli krediniz yok (Kalan: {credits})</span>
                                            </div>
                                            <Link to="/pricing" className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors text-sm">
                                                Kredi Al
                                            </Link>
                                        </div>
                                    )}

                                    {error && error !== 'credits' && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                                            <AlertCircle size={20} />
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setStep('input')}
                                            className="px-6 py-4 bg-white/5 text-gray-300 font-bold rounded-2xl hover:bg-white/10 transition-colors"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            onClick={handleTailor}
                                            disabled={isLoading}
                                            className="flex-1 py-4 bg-[#10B981] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <><Loader2 size={20} className="animate-spin" /> Düzenleniyor...</>
                                            ) : (
                                                <><Sparkles size={20} /> CV'yi İlana Uyarla (1 Kredi)</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: Success */}
                            {step === 'success' && result && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#10B981]/20 to-transparent border border-[#10B981]/30 rounded-3xl text-center">
                                        <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                                            <CheckCircle className="text-black" size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Başarıyla Uyarlanıp Kaydedildi!</h3>
                                        <p className="text-[#10B981] font-medium">Yeni CV taslağınız CV'lerim arasına eklendi.</p>
                                    </div>

                                    <div className="bg-black/40 border border-white/5 rounded-3xl p-6">
                                        <h4 className="font-bold text-white mb-4">Neler Değişti?</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <FileText size={12} className="text-[#10B981]" />
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed">Özet alanınız (Summary) ilandaki anahtar kelimelerle zenginleştirilerek baştan yazıldı.</p>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                                                    <Briefcase size={12} className="text-[#10B981]" />
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed">Deneyimlerinizdeki maddeler, ilanın gereksinimlerine göre vurgulanıp optimize edildi.</p>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={resetFlow}
                                            className="px-6 py-4 bg-white/5 text-gray-300 font-bold rounded-2xl hover:bg-white/10 transition-colors"
                                        >
                                            Yeni İlan
                                        </button>
                                        <Link
                                            to={`/cv/${result.tailoredCV?._id}`}
                                            className="flex-1 py-4 bg-[#10B981] text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                        >
                                            Uyarlanmış CV'yi Görüntüle <ChevronRight size={20} />
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
