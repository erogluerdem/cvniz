import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Linkedin, Copy, Check, RefreshCw,
    Briefcase, FileText, Award, Target,
    ChevronRight, CheckCircle, ArrowRight,
    Loader2, Bot, Zap, Crown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { aiAPI } from '../services/api'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AILinkedInOptimizer({ isOpen, onClose }) {
    const { isPremium } = useAuth()
    const { cvs } = useCV()

    const [selectedCV, setSelectedCV] = useState(null)
    const [step, setStep] = useState(1) // 1: Select CV, 2: Loading/Analyzing, 3: Results
    
    // AI Response State
    const [optimizationData, setOptimizationData] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [copiedStates, setCopiedStates] = useState({}) // { 'headline_1': true }

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text)
        setCopiedStates(prev => ({ ...prev, [key]: true }))
        toast.success('Kopyalandı!')
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [key]: false }))
        }, 2000)
    }

    const handleAnalyze = async () => {
        if (!selectedCV) {
            toast.error('Lütfen bir CV seçin');
            return;
        }

        if (!isPremium) {
            toast.error('Bu özellik Premium kullanıcılara özeldir');
            return;
        }

        setIsAnalyzing(true)
        setStep(2)
        
        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const cvData = cv?.data || cv

            const response = await aiAPI.optimizeLinkedIn({ cvData });
            
            if (response.success && response.data) {
                let parsedData = response.data;
                if (typeof parsedData === 'string') {
                    try {
                        parsedData = JSON.parse(parsedData);
                    } catch (e) {
                        const jsonStr = parsedData.substring(parsedData.indexOf('{'), parsedData.lastIndexOf('}') + 1);
                        parsedData = JSON.parse(jsonStr);
                    }
                }
                setOptimizationData(parsedData);
                setStep(3);
            } else {
                toast.error(response.error || 'Optimizasyon başarısız oldu.');
                setStep(1);
            }
        } catch (error) {
            console.error('LinkedIn optimization error:', error)
            toast.error('Bağlantı hatası oluştu.')
            setStep(1);
        } finally {
            setIsAnalyzing(false)
        }
    }

    if (!isOpen) return null

    // Determine color based on score
    const getScoreColor = (score) => {
        if (!score) return 'text-gray-400 border-gray-400';
        if (score >= 80) return 'text-emerald-400 border-emerald-400';
        if (score >= 60) return 'text-amber-400 border-amber-400';
        return 'text-rose-400 border-rose-400';
    }

    const getScoreLabel = (score) => {
        if (!score) return '';
        if (score >= 80) return 'Mükemmel';
        if (score >= 60) return 'Geliştirilebilir';
        return 'Zayıf';
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/80 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#0F172A] border border-[#0A66C2]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-[#0A66C2]/20 to-transparent relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A66C2]/10 blur-[100px] rounded-full"></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center shadow-lg shadow-[#0A66C2]/30">
                                <Linkedin className="text-white" size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">LinkedIn Optimizer</h2>
                                <p className="text-sm text-gray-400 mt-1">Yapay zeka ile profilinizi aramalarda üst sıralara taşıyın</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors relative z-10"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-[#0A66C2]/30 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: CV Selection */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="max-w-2xl mx-auto space-y-8 py-8"
                                >
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto bg-[#0A66C2]/10 rounded-full flex items-center justify-center mb-6">
                                            <Linkedin size={48} className="text-[#0A66C2]" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">LinkedIn Profilinizi Uçurun</h3>
                                        <p className="text-gray-400 text-lg">CV verilerinizi kullanarak LinkedIn algoritmasına uygun başlıklar, anahtar kelimeler ve özet metinleri üreteceğiz.</p>
                                    </div>

                                    {!isPremium && (
                                        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                                                    <Crown className="text-white" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">Pro Özellik</h3>
                                                    <p className="text-amber-200/80 text-sm">LinkedIn Optimizasyonu sadece Premium kullanıcılara özeldir.</p>
                                                </div>
                                            </div>
                                            <Link to="/pricing" className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center font-bold rounded-xl hover:opacity-90 transition-opacity">
                                                Hemen Yükselt
                                            </Link>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <label className="block text-white font-medium mb-2 text-lg">Analiz Edilecek CV'yi Seçin</label>
                                        <select
                                            value={selectedCV || ''}
                                            onChange={(e) => setSelectedCV(e.target.value)}
                                            disabled={!isPremium}
                                            className="w-full px-5 py-4 bg-black/40 border border-[#0A66C2]/30 rounded-2xl text-white focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] outline-none text-lg transition-all"
                                        >
                                            <option value="">CV Seçiniz...</option>
                                            {cvs?.map(cv => (
                                                <option key={cv.id} value={cv.id} className="bg-slate-900">
                                                    {cv.name || 'İsimsiz CV'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!selectedCV || !isPremium}
                                        className="w-full py-4 bg-[#0A66C2] text-white font-bold rounded-2xl text-lg flex items-center justify-center gap-3 hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(10,102,194,0.3)]"
                                    >
                                        <Bot size={24} /> Analiz Et ve Optimize Et
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2: Loading State */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20"
                                >
                                    <div className="w-32 h-32 relative flex items-center justify-center mb-8">
                                        <div className="absolute inset-0 rounded-full border-4 border-[#0A66C2]/20 border-t-[#0A66C2] animate-spin"></div>
                                        <Linkedin size={40} className="text-[#0A66C2] animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Profiliniz Analiz Ediliyor</h3>
                                    <p className="text-gray-400">Yapay zeka CV'nizi okuyor ve LinkedIn algoritmalarına uygun hale getiriyor...</p>
                                </motion.div>
                            )}

                            {/* STEP 3: Results */}
                            {step === 3 && optimizationData && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    {/* Score Card */}
                                    <div className="bg-gradient-to-br from-[#0A66C2]/10 to-transparent border border-[#0A66C2]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                                        <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center shrink-0 ${getScoreColor(optimizationData.score)} bg-[#0F172A] shadow-[0_0_50px_rgba(10,102,194,0.15)]`}>
                                            <span className="text-4xl font-black">{optimizationData.score}</span>
                                            <span className="text-xs font-medium opacity-80 uppercase tracking-widest mt-1">Skor</span>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-3xl font-bold text-white mb-2">Profil Gücünüz: <span className={getScoreColor(optimizationData.score).split(' ')[0]}>{getScoreLabel(optimizationData.score)}</span></h3>
                                            <p className="text-gray-400 text-lg">Bu skor, profilinizin ne kadar dikkat çekici olduğunu ve SEO (arama) uyumluluğunu gösterir. Aşağıdaki önerilerle bu skoru 100'e taşıyabilirsiniz.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Left Column */}
                                        <div className="space-y-8">
                                            {/* Headlines */}
                                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 bg-[#0A66C2]/20 rounded-xl flex items-center justify-center">
                                                        <User size={20} className="text-[#0A66C2]" />
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white">Çarpıcı Başlıklar (Headline)</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    {optimizationData.headlines?.map((hl, idx) => (
                                                        <div key={idx} className="group flex gap-3 items-start bg-black/40 p-4 rounded-2xl hover:bg-black/60 transition-colors border border-transparent hover:border-white/5">
                                                            <div className="flex-1 text-gray-300">{hl}</div>
                                                            <button
                                                                onClick={() => handleCopy(hl, `headline_${idx}`)}
                                                                className="p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-[#0A66C2] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                                title="Kopyala"
                                                            >
                                                                {copiedStates[`headline_${idx}`] ? <Check size={16} /> : <Copy size={16} />}
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Keywords */}
                                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 bg-[#0A66C2]/20 rounded-xl flex items-center justify-center">
                                                        <Target size={20} className="text-[#0A66C2]" />
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white">Anahtar Kelimeler</h4>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-4">Bu kelimeleri özetinizde ve deneyimlerinizde mutlaka kullanın:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {optimizationData.keywords?.map((kw, idx) => (
                                                        <span key={idx} className="px-4 py-2 bg-black/40 border border-[#0A66C2]/30 rounded-full text-sm text-[#0A66C2] font-medium flex items-center gap-1">
                                                            <Zap size={14} /> {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-8">
                                            {/* Summary */}
                                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-full flex flex-col">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#0A66C2]/20 rounded-xl flex items-center justify-center">
                                                            <FileText size={20} className="text-[#0A66C2]" />
                                                        </div>
                                                        <h4 className="text-xl font-bold text-white">Hakkında (About) Özeti</h4>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopy(optimizationData.summary, 'summary')}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2]/10 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white rounded-xl transition-all text-sm font-medium"
                                                    >
                                                        {copiedStates['summary'] ? <Check size={16} /> : <Copy size={16} />}
                                                        {copiedStates['summary'] ? 'Kopyalandı' : 'Kopyala'}
                                                    </button>
                                                </div>
                                                <div className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-6 whitespace-pre-wrap text-gray-300 leading-relaxed font-serif text-lg">
                                                    {optimizationData.summary}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actionable Tips */}
                                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                                <Lightbulb size={20} className="text-emerald-400" />
                                            </div>
                                            <h4 className="text-xl font-bold text-white">Özel İpuçları</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {optimizationData.tips?.map((tip, idx) => (
                                                <div key={idx} className="flex gap-3 items-start bg-black/20 p-4 rounded-xl border border-white/5">
                                                    <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                                                    <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    {step === 3 && (
                        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-between items-center">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                            >
                                Başka CV Seç
                            </button>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#0A66C2]/20"
                            >
                                LinkedIn Profilimi Düzenle <ExternalLink size={18} />
                            </a>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
