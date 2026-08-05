import { useState } from 'react'
import { useSalary, SALARY_DATA, CITY_MULTIPLIERS, NEGOTIATION_STRATEGIES } from '../context/SalaryContext'
import { useCV } from '../context/CVContext'
import {
    X, DollarSign, TrendingUp, MapPin, Briefcase, Target,
    Lightbulb, Copy, Check, ChevronRight, MessageSquare, Zap
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

    // Auto-fill from CV
    const autoFillFromCV = () => {
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950/95 backdrop-blur-3xl text-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Maaş Pazarlık Asistanı</h2>
                            <p className="text-sm text-gray-400">
                                {step === 'input' && 'Pozisyon ve deneyim bilgilerinizi girin'}
                                {step === 'result' && 'Piyasa değeriniz belirlendi'}
                                {step === 'negotiate' && 'Pazarlık senaryonuz hazır'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Input Step */}
                    {step === 'input' && (
                        <div className="space-y-6">
                            {/* Auto-fill */}
                            {cvs?.length > 0 && (
                                <button
                                    onClick={autoFillFromCV}
                                    className="w-full p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center gap-2"
                                >
                                    <Zap className="w-4 h-4" />
                                    CV'den Otomatik Doldur
                                </button>
                            )}

                            {/* Position */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Pozisyon</label>
                                <select
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-green-500 outline-none"
                                >
                                    <option value="">Seçin...</option>
                                    {Object.keys(SALARY_DATA).map(pos => (
                                        <option key={pos} value={pos}>{pos}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Level & City */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Deneyim Seviyesi</label>
                                    <select
                                        value={level}
                                        onChange={(e) => setLevel(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-green-500 outline-none"
                                    >
                                        <option value="junior">Junior (0-2 yıl)</option>
                                        <option value="mid">Mid-Level (2-5 yıl)</option>
                                        <option value="senior">Senior (5+ yıl)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Şehir</label>
                                    <select
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-green-500 outline-none"
                                    >
                                        {Object.keys(CITY_MULTIPLIERS).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Toplam Deneyim (Yıl): {yearsExp}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={yearsExp}
                                    onChange={(e) => setYearsExp(parseInt(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Beceriler (virgülle ayırın)</label>
                                <input
                                    type="text"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    placeholder="React, Python, AWS..."
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-green-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Result Step */}
                    {step === 'result' && salaryResult && (
                        <div className="space-y-6">
                            {/* Salary Range */}
                            <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    Piyasa Değeriniz
                                </h3>

                                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <div className="text-sm text-gray-400 mb-1">Minimum</div>
                                        <div className="text-2xl font-bold text-gray-300">₺{salaryResult.min.toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30">
                                        <div className="text-sm text-green-400 mb-1">Ortalama</div>
                                        <div className="text-3xl font-bold text-green-400">₺{salaryResult.avg.toLocaleString()}</div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/5">
                                        <div className="text-sm text-gray-400 mb-1">Maksimum</div>
                                        <div className="text-2xl font-bold text-gray-300">₺{salaryResult.max.toLocaleString()}</div>
                                    </div>
                                </div>

                                {/* Adjustments */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Şehir Faktörü ({city})</span>
                                        <span className="text-white">×{salaryResult.adjustments.cityMultiplier}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Deneyim Bonusu</span>
                                        <span className="text-green-400">+{salaryResult.adjustments.expBonus}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Beceri Bonusu</span>
                                        <span className="text-green-400">+{salaryResult.adjustments.skillsBonus}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Current Offer */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Mevcut Teklif (varsa)</label>
                                <input
                                    type="text"
                                    value={currentOffer}
                                    onChange={(e) => setCurrentOffer(e.target.value)}
                                    placeholder="Ör: 50000"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-green-500 outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Negotiate Step */}
                    {step === 'negotiate' && negotiationScript && (
                        <div className="space-y-6">
                            {/* Strategy Selection */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-3">Pazarlık Stratejisi</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(NEGOTIATION_STRATEGIES).map(([key, strat]) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedStrategy(key)}
                                            className={`p-3 rounded-xl text-left transition-all ${selectedStrategy === key
                                                ? 'bg-green-500/20 border-2 border-green-500'
                                                : 'bg-white/5 border-2 border-transparent'
                                                }`}
                                        >
                                            <div className="font-medium text-sm">{strat.name}</div>
                                            <div className="text-xs text-gray-400">{strat.description}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Strategy Tips */}
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-400" />
                                    {NEGOTIATION_STRATEGIES[selectedStrategy]?.name} İpuçları
                                </h4>
                                <ul className="space-y-1 text-sm text-gray-300">
                                    {NEGOTIATION_STRATEGIES[selectedStrategy]?.tips.map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Generated Script */}
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-400">Açılış</span>
                                        <button
                                            onClick={() => copyScript(negotiationScript.opening)}
                                            className="p-1 rounded hover:bg-white/10"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-300">{negotiationScript.opening}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-sm font-medium text-cyan-400 mb-2">Destekleyici Argümanlar</div>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        {negotiationScript.reasons.map((r, i) => (
                                            <li key={i}>• {r}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-sm font-medium text-purple-400 mb-2">Alternatif Öneriler</div>
                                    <ul className="space-y-1 text-sm text-gray-300">
                                        {negotiationScript.alternatives.map((a, i) => (
                                            <li key={i}>• {a}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 rounded-xl bg-white/5">
                                    <div className="text-sm font-medium text-amber-400 mb-2">Kapanış</div>
                                    <p className="text-sm text-gray-300">{negotiationScript.closing}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between">
                    {step === 'input' && (
                        <>
                            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white/10">
                                İptal
                            </button>
                            <button
                                onClick={handleCalculate}
                                disabled={!position}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold disabled:opacity-50"
                            >
                                Hesapla
                            </button>
                        </>
                    )}

                    {step === 'result' && (
                        <>
                            <button onClick={() => setStep('input')} className="px-6 py-3 rounded-xl bg-white/10">
                                Geri
                            </button>
                            <button
                                onClick={handleNegotiate}
                                disabled={!currentOffer}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold disabled:opacity-50 flex items-center gap-2"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Pazarlık Senaryosu Oluştur
                            </button>
                        </>
                    )}

                    {step === 'negotiate' && (
                        <>
                            <button onClick={() => setStep('result')} className="px-6 py-3 rounded-xl bg-white/10">
                                Geri
                            </button>
                            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold">
                                Tamam
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
