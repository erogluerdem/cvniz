import { useState, useEffect } from 'react'
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

    const getColorClass = (color) => {
        const colors = {
            green: 'text-green-400',
            cyan: 'text-cyan-400',
            amber: 'text-amber-400',
            red: 'text-red-400'
        }
        return colors[color] || 'text-white'
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl glass-card rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Salary Benchmark
                                    <Crown className="w-5 h-5 text-amber-400" />
                                </h2>
                                <p className="text-sm text-gray-400">Senin değerin ne?</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Premium Gate */}
                    {error === 'premium' && (
                        <div className="text-center py-10">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
                                <Lock className="w-12 h-12 text-amber-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Premium Özellik</h3>
                            <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                Maaş kıyaslama özelliği sadece Premium üyeler içindir.
                                Gerçek değerinizi öğrenmek için Pro'ya yükseltin.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    to="/pricing"
                                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                                >
                                    <Crown className="w-5 h-5" />
                                    Premium'a Yükselt
                                </Link>
                                <button
                                    onClick={() => { setError(null); setStep('select'); }}
                                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    Geri Dön
                                </button>
                            </div>

                            {/* Sample Preview */}
                            <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto">
                                <h4 className="font-bold mb-4 text-left">Premium ile göreceğiniz:</h4>
                                <ul className="text-left text-sm text-gray-400 space-y-2">
                                    {[
                                        'Sektörel maaş karşılaştırması',
                                        'Beceri bazlı değer hesaplama',
                                        'Sertifika etki analizi',
                                        '%20 daha fazla kazanmak için öneriler',
                                        'Lokasyon bazlı düzeltme'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Selection Step */}
                    {step === 'select' && !error && (
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="text-center py-16">
                                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-green-400 animate-spin" />
                                    <h3 className="text-lg font-bold mb-2">Maaş Analizi Yapılıyor...</h3>
                                    <p className="text-gray-400">Piyasa verileri karşılaştırılıyor</p>
                                </div>
                            ) : (
                                <>
                                    {/* CV Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                                            📄 CV Seçin
                                        </label>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {cvs?.map(cv => (
                                                <button
                                                    key={cv.id}
                                                    onClick={() => setSelectedCV(cv.id)}
                                                    className={`p-4 rounded-xl text-left transition-all ${selectedCV === cv.id
                                                        ? 'bg-green-500/20 border-2 border-green-500'
                                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="font-medium">{cv.name}</div>
                                                    <div className="text-sm text-gray-400">{cv.template}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sector */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                                            🎯 Sektör
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {SECTORS.map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setSector(s.id)}
                                                    className={`p-3 rounded-xl text-center transition-all ${sector === s.id
                                                        ? 'bg-green-500/20 border-2 border-green-500'
                                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{s.icon}</div>
                                                    <div className="text-xs font-medium truncate">{s.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location & Company Size */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                                <MapPin className="w-4 h-4 inline mr-1" /> Lokasyon
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {LOCATIONS.map(l => (
                                                    <button
                                                        key={l.id}
                                                        onClick={() => setLocation(l.id)}
                                                        className={`px-4 py-2 rounded-lg transition-all ${location === l.id
                                                            ? 'bg-green-500/20 border border-green-500 text-green-400'
                                                            : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {l.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-3">
                                                <Building className="w-4 h-4 inline mr-1" /> Şirket Boyutu
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {COMPANY_SIZES.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => setCompanySize(c.id)}
                                                        className={`px-3 py-2 rounded-lg transition-all text-sm ${companySize === c.id
                                                            ? 'bg-green-500/20 border border-green-500 text-green-400'
                                                            : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {c.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analyze Button */}
                                    <div className="text-center pt-4">
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={!selectedCV}
                                            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-green-500/20 transition-all disabled:opacity-50"
                                        >
                                            <Sparkles className="w-6 h-6" />
                                            Değerimi Hesapla
                                        </button>
                                        {!isPremium && (
                                            <p className="text-xs text-amber-400 mt-3 flex items-center justify-center gap-1">
                                                <Crown className="w-3 h-3" /> Premium özellik
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Result Step */}
                    {step === 'result' && result && (
                        <div className="space-y-6">
                            {/* Main Salary Display */}
                            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                                <div className="text-sm text-gray-400 mb-2">Senin Değerin</div>
                                <div className="text-5xl font-black text-green-400 mb-2">
                                    {result.currentValue.formatted.median}
                                </div>
                                <div className="text-sm text-gray-400">
                                    Aralık: {result.currentValue.formatted.min} - {result.currentValue.formatted.max}
                                </div>

                                {/* Market Position */}
                                <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${result.marketPosition.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                    result.marketPosition.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                                        result.marketPosition.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    <BarChart2 className="w-4 h-4" />
                                    {result.marketPosition.percentile} - {result.marketPosition.label}
                                </div>
                            </div>

                            {/* Info Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="p-3 rounded-xl bg-white/5 text-center">
                                    <Briefcase className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                                    <div className="text-xs text-gray-500">Deneyim</div>
                                    <div className="text-sm font-bold">{result.experienceLevel.years} yıl</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 text-center">
                                    <Target className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                                    <div className="text-xs text-gray-500">Sektör</div>
                                    <div className="text-sm font-bold truncate">{result.sector}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 text-center">
                                    <MapPin className="w-5 h-5 mx-auto mb-1 text-green-400" />
                                    <div className="text-xs text-gray-500">Lokasyon</div>
                                    <div className="text-sm font-bold">{result.location}</div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 text-center">
                                    <Building className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                                    <div className="text-xs text-gray-500">Şirket</div>
                                    <div className="text-sm font-bold truncate">{result.companySize}</div>
                                </div>
                            </div>

                            {/* Applied Skills */}
                            {result.appliedSkills?.length > 0 && (
                                <div className="p-4 rounded-xl bg-white/5">
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        Değer Katan Becerileriniz
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.appliedSkills.map((s, i) => (
                                            <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-1">
                                                {s.skill} <span className="text-xs opacity-70">{s.impact}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Potential Increase */}
                            {result.recommendations?.potentialIncrease?.amount > 0 && (
                                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-7 h-7 text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-amber-400 mb-1">
                                                +{result.recommendations.potentialIncrease.formatted} daha kazanabilirsin!
                                            </h3>
                                            <p className="text-sm text-gray-400 mb-4">
                                                {result.recommendations.summary}
                                            </p>

                                            {/* Skills to add */}
                                            {result.recommendations.skills?.length > 0 && (
                                                <div className="space-y-2 mb-3">
                                                    {result.recommendations.skills.map((s, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                                                            <div className="flex items-center gap-2">
                                                                <Zap className="w-4 h-4 text-amber-400" />
                                                                <span className="font-medium">{s.skill}</span>
                                                            </div>
                                                            <span className="text-green-400 text-sm">+{s.potentialIncrease}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Certifications to add */}
                                            {result.recommendations.certifications?.length > 0 && (
                                                <div className="space-y-2">
                                                    {result.recommendations.certifications.map((c, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/20">
                                                            <div className="flex items-center gap-2">
                                                                <GraduationCap className="w-4 h-4 text-purple-400" />
                                                                <span className="font-medium">{c.cert}</span>
                                                            </div>
                                                            <span className="text-green-400 text-sm">+{c.bonus?.toLocaleString()}₺</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Breakdown */}
                            <div className="p-4 rounded-xl bg-white/5">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5 text-cyan-400" />
                                    Hesaplama Detayları
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="p-2 rounded-lg bg-black/20 flex justify-between">
                                        <span className="text-gray-400">Baz Maaş</span>
                                        <span className="font-medium">{result.breakdown.baseSalary.median}</span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-black/20 flex justify-between">
                                        <span className="text-gray-400">Beceri Etkisi</span>
                                        <span className="font-medium text-green-400">+{result.breakdown.skillMultiplier}</span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-black/20 flex justify-between">
                                        <span className="text-gray-400">Lokasyon Etkisi</span>
                                        <span className="font-medium">{result.breakdown.locationMultiplier}</span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-black/20 flex justify-between">
                                        <span className="text-gray-400">Sertifika Bonusu</span>
                                        <span className="font-medium text-green-400">+{result.breakdown.certificationBonus}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {step === 'result' && result && (
                    <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between">
                        <button
                            onClick={() => { setStep('select'); setResult(null); }}
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            Yeni Hesaplama
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
                        >
                            Tamam
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
