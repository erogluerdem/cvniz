import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { Link } from 'react-router-dom'
import {
    X, DollarSign, TrendingUp, Crown, Lock, Sparkles, MapPin,
    Building, Briefcase, Award, ChevronRight, Loader2, CheckCircle,
    AlertCircle, Target, BarChart2, Zap, GraduationCap
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Sectors
const SECTORS = [
    { id: 'yazilim', name: 'Yazılım / IT', icon: '💻' },
    { id: 'finans', name: 'Finans', icon: '💰' },
    { id: 'pazarlama', name: 'Pazarlama', icon: '📢' },
    { id: 'uretim', name: 'Üretim', icon: '🏭' },
    { id: 'insan_kaynaklari', name: 'İK', icon: '👥' },
    { id: 'satis', name: 'Satış', icon: '🎯' },
    { id: 'saglik', name: 'Sağlık', icon: '🏥' },
    { id: 'genel', name: 'Genel', icon: '📋' }
]

// Locations
const LOCATIONS = [
    { id: 'istanbul', name: 'İstanbul' },
    { id: 'ankara', name: 'Ankara' },
    { id: 'izmir', name: 'İzmir' },
    { id: 'bursa', name: 'Bursa' },
    { id: 'remote', name: 'Remote' }
]

// Company sizes
const COMPANY_SIZES = [
    { id: 'startup', name: 'Startup', multiplier: '0.9x' },
    { id: 'small', name: 'Küçük', multiplier: '0.95x' },
    { id: 'medium', name: 'Orta', multiplier: '1x' },
    { id: 'large', name: 'Büyük', multiplier: '1.1x' },
    { id: 'multinational', name: 'Çok Uluslu', multiplier: '1.25x' }
]

export default function SalaryBenchmark({ isOpen, onClose }) {
    const { isPremium, token } = useAuth()
    const { cvs } = useCV()

    const [step, setStep] = useState('select') // select, result
    const [selectedCV, setSelectedCV] = useState(null)
    const [sector, setSector] = useState('yazilim')
    const [location, setLocation] = useState('istanbul')
    const [companySize, setCompanySize] = useState('medium')
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleAnalyze = async () => {
        if (!selectedCV) return

        // Check premium
        if (!isPremium) {
            setError('premium')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const cv = cvs?.find(c => c.id === selectedCV)
            const response = await fetch(`${API_URL}/salary/benchmark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    cvData: cv?.data || cv,
                    sector,
                    location,
                    companySize
                })
            })

            if (response.ok) {
                const data = await response.json()
                setResult(data.analysis)
                setStep('result')
            } else if (response.status === 403) {
                setError('premium')
            } else {
                setError('generic')
            }
        } catch (err) {
            console.error('Salary benchmark error:', err)
            setError('generic')
        }

        setIsLoading(false)
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
                    className="relative w-full max-w-4xl bg-[#0F1115] border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden my-4 flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent gap-4 relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <DollarSign className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    Salary Benchmark <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                </h2>
                                <p className="text-sm text-gray-400">Senin gerçek değerin ne?</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        
                        <AnimatePresence mode="wait">
                            {/* Premium Gate */}
                            {error === 'premium' && (
                                <motion.div 
                                    key="premium"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-10 max-w-lg mx-auto"
                                >
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] border border-amber-500/20">
                                        <Lock className="w-12 h-12 text-amber-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Premium Özellik</h3>
                                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                        Maaş kıyaslama özelliği sadece Premium üyeler içindir.
                                        Gerçek değerinizi öğrenmek için Pro'ya yükseltin.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                                        <button
                                            onClick={() => { setError(null); setStep('select'); }}
                                            className="px-6 py-4 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                                        >
                                            Geri Dön
                                        </button>
                                        <Link
                                            to="/pricing"
                                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
                                        >
                                            <Crown className="w-5 h-5" />
                                            Premium'a Yükselt
                                        </Link>
                                    </div>

                                    {/* Sample Preview */}
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-left relative overflow-hidden group hover:border-amber-500/30 transition-all">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-amber-400" /> Premium ile göreceğiniz:
                                        </h4>
                                        <ul className="text-sm text-gray-300 space-y-3">
                                            {[
                                                'Sektörel maaş karşılaştırması',
                                                'Beceri bazlı değer hesaplama',
                                                'Sertifika etki analizi',
                                                '%20 daha fazla kazanmak için öneriler',
                                                'Lokasyon bazlı düzeltme'
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <div className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle className="w-3 h-3 text-[#10B981]" />
                                                    </div>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}

                            {/* Selection Step */}
                            {step === 'select' && !error && (
                                <motion.div 
                                    key="select"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    {isLoading ? (
                                        <div className="text-center py-20">
                                            <div className="relative w-20 h-20 mx-auto mb-6">
                                                <div className="absolute inset-0 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin"></div>
                                                <div className="absolute inset-3 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                                                    <DollarSign className="w-8 h-8 text-[#10B981]" />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Maaş Analizi Yapılıyor...</h3>
                                            <p className="text-gray-400">Piyasa verileri karşılaştırılıyor</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* CV Selection */}
                                            <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                    <Briefcase className="w-5 h-5 text-[#10B981]" /> CV Seçin
                                                </label>
                                                <div className="grid md:grid-cols-2 gap-3">
                                                    {cvs?.map(cv => (
                                                        <button
                                                            key={cv.id}
                                                            onClick={() => setSelectedCV(cv.id)}
                                                            className={`p-4 rounded-2xl text-left transition-all flex flex-col gap-1 ${selectedCV === cv.id
                                                                ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                                : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                                                                }`}
                                                        >
                                                            <div className={`font-bold ${selectedCV === cv.id ? 'text-[#10B981]' : 'text-white'}`}>{cv.name}</div>
                                                            <div className="text-xs text-gray-400">Şablon: {cv.template}</div>
                                                        </button>
                                                    ))}
                                                    {(!cvs || cvs.length === 0) && (
                                                        <div className="col-span-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                                            Henüz bir CV'niz bulunmuyor. Lütfen önce bir CV oluşturun.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Sector */}
                                            <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                                <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                    <Target className="w-5 h-5 text-[#10B981]" /> Sektör
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {SECTORS.map(s => (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => setSector(s.id)}
                                                            className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${sector === s.id
                                                                ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                                : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <div className="text-3xl mb-1 drop-shadow-md">{s.icon}</div>
                                                            <div className={`text-xs font-bold truncate w-full text-center ${sector === s.id ? 'text-[#10B981]' : 'text-gray-300'}`}>{s.name}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Location & Company Size */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                        <MapPin className="w-5 h-5 text-[#10B981]" /> Lokasyon
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {LOCATIONS.map(l => (
                                                            <button
                                                                key={l.id}
                                                                onClick={() => setLocation(l.id)}
                                                                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${location === l.id
                                                                    ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981]'
                                                                    : 'bg-white/5 border border-transparent text-gray-300 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                {l.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-black/20 border border-white/5 rounded-3xl p-6">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                                                        <Building className="w-5 h-5 text-[#10B981]" /> Şirket Boyutu
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {COMPANY_SIZES.map(c => (
                                                            <button
                                                                key={c.id}
                                                                onClick={() => setCompanySize(c.id)}
                                                                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${companySize === c.id
                                                                    ? 'bg-[#10B981]/20 border border-[#10B981] text-[#10B981]'
                                                                    : 'bg-white/5 border border-transparent text-gray-300 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                {c.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Error */}
                                            {error === 'generic' && (
                                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                                                    <AlertCircle className="w-5 h-5" />
                                                    Bir hata oluştu. Lütfen tekrar deneyin.
                                                </div>
                                            )}

                                            {/* Analyze Button */}
                                            <div className="text-center pt-4">
                                                <button
                                                    onClick={handleAnalyze}
                                                    disabled={!selectedCV}
                                                    className="w-full md:w-auto md:min-w-[300px] px-8 py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-3 mx-auto hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Sparkles className="w-5 h-5" />
                                                    Değerimi Hesapla
                                                </button>
                                                {!isPremium && (
                                                    <p className="text-xs text-amber-400 mt-4 flex items-center justify-center gap-1.5 bg-amber-500/10 w-fit mx-auto px-3 py-1.5 rounded-lg border border-amber-500/20">
                                                        <Crown className="w-3 h-3" /> Premium özellik
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}

                            {/* Result Step */}
                            {step === 'result' && result && (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Main Salary Display */}
                                    <div className="text-center p-10 rounded-3xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/30 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Senin Gerçek Değerin</div>
                                            <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399] mb-4 drop-shadow-sm">
                                                {result.currentValue.formatted.median}
                                            </div>
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full text-sm font-medium text-gray-300 border border-white/5">
                                                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                                                Aralık: {result.currentValue.formatted.min} - {result.currentValue.formatted.max}
                                            </div>

                                            {/* Market Position */}
                                            <div className="mt-6">
                                                <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold shadow-lg ${result.marketPosition.color === 'green' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' :
                                                    result.marketPosition.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                                                        result.marketPosition.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                            'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    }`}>
                                                    <BarChart2 className="w-5 h-5" />
                                                    {result.marketPosition.percentile} - {result.marketPosition.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Cards */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center flex flex-col items-center justify-center gap-1 hover:border-cyan-500/30 transition-colors">
                                            <Briefcase className="w-6 h-6 text-cyan-400 mb-1" />
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Deneyim</div>
                                            <div className="text-lg font-bold text-white">{result.experienceLevel.years} yıl</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center flex flex-col items-center justify-center gap-1 hover:border-purple-500/30 transition-colors">
                                            <Target className="w-6 h-6 text-purple-400 mb-1" />
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sektör</div>
                                            <div className="text-lg font-bold text-white truncate w-full px-2">{result.sector}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center flex flex-col items-center justify-center gap-1 hover:border-green-500/30 transition-colors">
                                            <MapPin className="w-6 h-6 text-green-400 mb-1" />
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasyon</div>
                                            <div className="text-lg font-bold text-white">{result.location}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-center flex flex-col items-center justify-center gap-1 hover:border-amber-500/30 transition-colors">
                                            <Building className="w-6 h-6 text-amber-400 mb-1" />
                                            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Şirket</div>
                                            <div className="text-lg font-bold text-white truncate w-full px-2">{result.companySize}</div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                            {/* Applied Skills */}
                                            {result.appliedSkills?.length > 0 && (
                                                <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                                        Değer Katan Becerileriniz
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.appliedSkills.map((s, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 rounded-xl text-sm font-medium flex items-center gap-1.5">
                                                                {s.skill} <span className="text-xs opacity-70 bg-[#10B981]/20 px-1.5 py-0.5 rounded-md">{s.impact}</span>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Breakdown */}
                                            <div className="p-6 rounded-3xl bg-black/20 border border-white/5">
                                                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                                    <BarChart2 className="w-5 h-5 text-cyan-400" />
                                                    Hesaplama Detayları
                                                </h3>
                                                <div className="space-y-2 text-sm font-medium">
                                                    <div className="p-3 rounded-xl bg-black/40 flex justify-between items-center border border-white/5">
                                                        <span className="text-gray-400">Baz Maaş</span>
                                                        <span className="text-white">{result.breakdown.baseSalary.median}</span>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-black/40 flex justify-between items-center border border-white/5">
                                                        <span className="text-gray-400">Beceri Etkisi</span>
                                                        <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md">+{result.breakdown.skillMultiplier}</span>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-black/40 flex justify-between items-center border border-white/5">
                                                        <span className="text-gray-400">Lokasyon Etkisi</span>
                                                        <span className="text-white">{result.breakdown.locationMultiplier}</span>
                                                    </div>
                                                    <div className="p-3 rounded-xl bg-black/40 flex justify-between items-center border border-white/5">
                                                        <span className="text-gray-400">Sertifika Bonusu</span>
                                                        <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md">+{result.breakdown.certificationBonus}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Potential Increase */}
                                        {result.recommendations?.potentialIncrease?.amount > 0 && (
                                            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/20 transition-all"></div>
                                                
                                                <div className="flex flex-col gap-6 relative z-10">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center flex-shrink-0 border border-amber-500/30">
                                                            <TrendingUp className="w-7 h-7 text-amber-400" />
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Maaşını Yükselt</div>
                                                            <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                                                +{result.recommendations.potentialIncrease.formatted}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    
                                                    <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                                        {result.recommendations.summary}
                                                    </p>

                                                    <div className="space-y-4">
                                                        {/* Skills to add */}
                                                        {result.recommendations.skills?.length > 0 && (
                                                            <div>
                                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Önerilen Beceriler</div>
                                                                <div className="space-y-2">
                                                                    {result.recommendations.skills.map((s, i) => (
                                                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-amber-500/10">
                                                                            <div className="flex items-center gap-3">
                                                                                <Zap className="w-4 h-4 text-amber-400" />
                                                                                <span className="font-bold text-white text-sm">{s.skill}</span>
                                                                            </div>
                                                                            <span className="text-[#10B981] text-sm font-bold bg-[#10B981]/10 px-2 py-0.5 rounded-md">+{s.potentialIncrease}%</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Certifications to add */}
                                                        {result.recommendations.certifications?.length > 0 && (
                                                            <div>
                                                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Önerilen Sertifikalar</div>
                                                                <div className="space-y-2">
                                                                    {result.recommendations.certifications.map((c, i) => (
                                                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-purple-500/10">
                                                                            <div className="flex items-center gap-3">
                                                                                <GraduationCap className="w-4 h-4 text-purple-400" />
                                                                                <span className="font-bold text-white text-sm line-clamp-1">{c.cert}</span>
                                                                            </div>
                                                                            <span className="text-[#10B981] text-sm font-bold bg-[#10B981]/10 px-2 py-0.5 rounded-md whitespace-nowrap">+{c.bonus?.toLocaleString()}₺</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={() => { setStep('select'); setResult(null); }}
                                            className="w-full py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                                        >
                                            Yeni Hesaplama Yap
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="w-full py-4 rounded-2xl bg-[#10B981] text-black font-bold flex items-center justify-center gap-2 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Analizi Kapat
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
