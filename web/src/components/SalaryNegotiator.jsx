import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSalary, SALARY_DATA, CITY_MULTIPLIERS, NEGOTIATION_STRATEGIES } from '../context/SalaryContext'
import { useCV } from '../context/CVContext'
import {
    X, DollarSign, TrendingUp, MapPin, Briefcase, Target,
    Lightbulb, Copy, Check, ChevronRight, MessageSquare, Zap, Crown
} from 'lucide-react'

export default function SalaryNegotiator({ isOpen, onClose }) {
    const {
        calculateSalaryRange, generateNegotiationScript,
        calculateCounterOffer, NEGOTIATION_PHRASES
    } = useSalary() || {}
    const { cvs } = useCV()

    const [step, setStep] = useState('input') // input, result, negotiate
    const [position, setPosition] = useState('')
    const [level, setLevel] = useState('mid')
    const [city, setCity] = useState('İstanbul')
    const [yearsExp, setYearsExp] = useState(3)
    const [skills, setSkills] = useState('')
    const [currentOffer, setCurrentOffer] = useState('')
    const [salaryResult, setSalaryResult] = useState(null)
    const [negotiationScript, setNegotiationScript] = useState(null)
    const [copied, setCopied] = useState(false)
    const [selectedStrategy, setSelectedStrategy] = useState('value')
    const [isAutoFilling, setIsAutoFilling] = useState(false)

    // Auto-fill from CV
    const autoFillFromCV = () => {
        setIsAutoFilling(true)
        setTimeout(() => {
            const primaryCV = cvs?.find(cv => cv.isPrimary) || cvs?.[0]
            if (primaryCV?.personalInfo) {
                if (primaryCV.personalInfo.title) setPosition(primaryCV.personalInfo.title)
                if (primaryCV.personalInfo.city) setCity(primaryCV.personalInfo.city)
            }
            if (primaryCV?.skills) {
                setSkills(primaryCV.skills.map(s => s.name || s).join(', '))
            }
            if (primaryCV?.experience?.length > 0) {
                // Calculate total years of experience
                const totalYears = primaryCV.experience.reduce((sum, exp) => {
                    if (exp.startDate && exp.endDate) {
                        const start = new Date(exp.startDate)
                        const end = exp.endDate === 'Present' ? new Date() : new Date(exp.endDate)
                        return sum + Math.round((end - start) / (1000 * 60 * 60 * 24 * 365))
                    }
                    return sum
                }, 0)
                setYearsExp(Math.max(1, totalYears))
            }
            setIsAutoFilling(false)
        }, 600)
    }

    // Calculate salary
    const handleCalculate = () => {
        if (!position || !calculateSalaryRange) return

        const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean)
        const result = calculateSalaryRange(position, level, city, yearsExp, skillsList)
        setSalaryResult(result)
        setStep('result')
    }

    // Generate negotiation script
    const handleNegotiate = () => {
        if (!currentOffer || !salaryResult || !generateNegotiationScript) return

        const offer = parseInt(currentOffer.replace(/\D/g, ''))
        const target = salaryResult.avg
        const script = generateNegotiationScript(offer, target)
        setNegotiationScript(script)
        setStep('negotiate')
    }

    // Copy to clipboard
    const copyScript = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!isOpen) return null

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
                                <DollarSign className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    Maaş Pazarlık Asistanı <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {step === 'input' && 'Pozisyon ve deneyim bilgilerinizi girin'}
                                    {step === 'result' && 'Piyasa değeriniz belirlendi'}
                                    {step === 'negotiate' && 'Pazarlık senaryonuz hazır'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            
                            {/* Input Step */}
                            {step === 'input' && (
                                <motion.div 
                                    key="input"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Auto-fill */}
                                    {cvs?.length > 0 && (
                                        <button
                                            onClick={autoFillFromCV}
                                            disabled={isAutoFilling}
                                            className="w-full p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center gap-2 font-bold hover:bg-cyan-500/20 transition-all shadow-inner disabled:opacity-50"
                                        >
                                            {isAutoFilling ? (
                                                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Zap className="w-5 h-5 fill-current" />
                                            )}
                                            {isAutoFilling ? "Bilinçaltından veriler çekiliyor..." : "CV'den Otomatik Doldur"}
                                        </button>
                                    )}

                                    {/* Position */}
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                            <Briefcase className="w-5 h-5 text-[#10B981]" /> Pozisyon
                                        </label>
                                        <select
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="" className="bg-gray-900">Seçin...</option>
                                            {Object.keys(SALARY_DATA).map(pos => (
                                                <option key={pos} value={pos} className="bg-gray-900">{pos}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Level & City */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                <Target className="w-5 h-5 text-[#10B981]" /> Deneyim Seviyesi
                                            </label>
                                            <select
                                                value={level}
                                                onChange={(e) => setLevel(e.target.value)}
                                                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all cursor-pointer appearance-none"
                                            >
                                                <option value="junior" className="bg-gray-900">Junior (0-2 yıl)</option>
                                                <option value="mid" className="bg-gray-900">Mid-Level (2-5 yıl)</option>
                                                <option value="senior" className="bg-gray-900">Senior (5+ yıl)</option>
                                            </select>
                                        </div>
                                        <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                            <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                <MapPin className="w-5 h-5 text-[#10B981]" /> Şehir
                                            </label>
                                            <select
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all cursor-pointer appearance-none"
                                            >
                                                {Object.keys(CITY_MULTIPLIERS).map(c => (
                                                    <option key={c} value={c} className="bg-gray-900">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Experience Slider */}
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center justify-between text-sm font-bold text-white mb-4">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-[#10B981]" /> Toplam Deneyim
                                            </div>
                                            <span className="text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-lg border border-[#10B981]/20">
                                                {yearsExp} Yıl
                                            </span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="20"
                                            value={yearsExp}
                                            onChange={(e) => setYearsExp(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                                        />
                                    </div>

                                    {/* Skills */}
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                            <Zap className="w-5 h-5 text-[#10B981]" /> Beceriler <span className="text-xs text-gray-500 font-normal ml-auto">(virgülle ayırın)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                            placeholder="React, Python, AWS..."
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={handleCalculate}
                                            disabled={!position}
                                            className="w-full md:w-auto px-10 py-4 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            Değerimi Hesapla
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Result Step */}
                            {step === 'result' && salaryResult && (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Salary Range */}
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#10B981]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        
                                        <div className="relative z-10 text-center mb-8">
                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Piyasa Değeriniz</div>
                                            <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399] drop-shadow-sm">
                                                ₺{salaryResult.avg.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-center mb-6 max-w-md mx-auto relative z-10">
                                            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Minimum</div>
                                                <div className="text-2xl font-bold text-gray-300">₺{salaryResult.min.toLocaleString()}</div>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-black/40 border border-white/5">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Maksimum</div>
                                                <div className="text-2xl font-bold text-gray-300">₺{salaryResult.max.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        {/* Adjustments */}
                                        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 relative z-10 grid gap-2 sm:grid-cols-3 text-sm font-medium">
                                            <div className="flex justify-between sm:flex-col sm:items-center p-3 rounded-xl bg-black/40 border border-white/5">
                                                <span className="text-gray-400 text-xs uppercase">Şehir Faktörü</span>
                                                <span className="text-white mt-1">×{salaryResult.adjustments.cityMultiplier}</span>
                                            </div>
                                            <div className="flex justify-between sm:flex-col sm:items-center p-3 rounded-xl bg-black/40 border border-white/5">
                                                <span className="text-gray-400 text-xs uppercase">Deneyim Bonusu</span>
                                                <span className="text-[#10B981] mt-1 bg-[#10B981]/10 px-2 py-0.5 rounded-md">+{salaryResult.adjustments.expBonus}%</span>
                                            </div>
                                            <div className="flex justify-between sm:flex-col sm:items-center p-3 rounded-xl bg-black/40 border border-white/5">
                                                <span className="text-gray-400 text-xs uppercase">Beceri Bonusu</span>
                                                <span className="text-[#10B981] mt-1 bg-[#10B981]/10 px-2 py-0.5 rounded-md">+{salaryResult.adjustments.skillsBonus}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Offer */}
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                            <MessageSquare className="w-5 h-5 text-[#10B981]" /> Mevcut Teklif <span className="text-xs text-gray-500 font-normal ml-auto">(Size Sunulan)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={currentOffer}
                                            onChange={(e) => setCurrentOffer(e.target.value)}
                                            placeholder="Ör: 50000"
                                            className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-white/5">
                                        <button onClick={() => setStep('input')} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5">
                                            Geri
                                        </button>
                                        <button
                                            onClick={handleNegotiate}
                                            disabled={!currentOffer}
                                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                            Pazarlık Senaryosu Oluştur
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Negotiate Step */}
                            {step === 'negotiate' && negotiationScript && (
                                <motion.div 
                                    key="negotiate"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Strategy Selection */}
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                        <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                            <Target className="w-5 h-5 text-[#10B981]" /> Pazarlık Stratejisi
                                        </label>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {Object.entries(NEGOTIATION_STRATEGIES).map(([key, strat]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setSelectedStrategy(key)}
                                                    className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden group ${selectedStrategy === key
                                                        ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    {selectedStrategy === key && (
                                                        <div className="absolute top-4 right-4">
                                                            <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                                        </div>
                                                    )}
                                                    <div className={`font-bold text-lg mb-1 pr-8 ${selectedStrategy === key ? 'text-[#10B981]' : 'text-white'}`}>{strat.name}</div>
                                                    <div className="text-xs text-gray-400 font-medium leading-relaxed">{strat.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Strategy Tips */}
                                    <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20">
                                        <h4 className="font-bold text-amber-500 mb-3 flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 fill-current" />
                                            {NEGOTIATION_STRATEGIES[selectedStrategy]?.name} İpuçları
                                        </h4>
                                        <ul className="space-y-2 text-sm text-gray-300">
                                            {NEGOTIATION_STRATEGIES[selectedStrategy]?.tips.map((tip, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-amber-500/10">
                                                    <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                                    <span className="font-medium leading-relaxed">{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Generated Script */}
                                    <div className="space-y-4">
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                                                <span className="text-sm font-bold text-[#10B981] uppercase tracking-widest flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4" /> Açılış Mesajı
                                                </span>
                                                <button
                                                    onClick={() => copyScript(negotiationScript.opening)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${copied ? 'bg-[#10B981] text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                                >
                                                    {copied ? <><Check className="w-3 h-3" /> Kopyalandı</> : <><Copy className="w-3 h-3" /> Kopyala</>}
                                                </button>
                                            </div>
                                            <p className="text-gray-300 font-medium leading-relaxed">{negotiationScript.opening}</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="p-6 rounded-3xl bg-black/40 border border-white/5 h-full">
                                                <div className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> Destekleyici Argümanlar
                                                </div>
                                                <ul className="space-y-3 text-sm text-gray-300 font-medium">
                                                    {negotiationScript.reasons.map((r, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></div>
                                                            <span className="leading-relaxed">{r}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="p-6 rounded-3xl bg-black/40 border border-white/5 h-full">
                                                <div className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Zap className="w-4 h-4" /> Alternatif Öneriler
                                                </div>
                                                <ul className="space-y-3 text-sm text-gray-300 font-medium">
                                                    {negotiationScript.alternatives.map((a, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                                                            <span className="leading-relaxed">{a}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                                            <div className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3 border-b border-white/5 pb-3">
                                                Kapanış
                                            </div>
                                            <p className="text-gray-300 font-medium leading-relaxed">{negotiationScript.closing}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-white/5">
                                        <button onClick={() => setStep('result')} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5">
                                            Geri
                                        </button>
                                        <button onClick={onClose} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                            <CheckCircle className="w-5 h-5" />
                                            Paneli Kapat
                                        </button>
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
