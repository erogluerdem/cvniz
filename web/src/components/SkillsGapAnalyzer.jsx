import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSkillsGap, POSITION_REQUIREMENTS, LEARNING_RESOURCES } from '../context/SkillsGapContext'
import { useCV } from '../context/CVContext'
import { useAuth } from '../context/AuthContext'
import {
    X, Target, TrendingUp, CheckCircle, AlertCircle, BookOpen,
    Plus, ExternalLink, Zap, ChevronRight, BarChart3, Map, Award,
    Clock, DollarSign, Star, Sparkles, ArrowRight, GraduationCap
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function SkillsGapAnalyzer({ isOpen, onClose }) {
    const {
        analyzeGap, addToLearningPlan, updateLearningProgress,
        removeFromLearningPlan, getUserLearningPlan
    } = useSkillsGap() || {}
    const { cvs } = useCV()
    const { token } = useAuth()

    const [step, setStep] = useState('select') // select, result, roadmap, plan
    const [selectedCV, setSelectedCV] = useState(null)
    const [targetPosition, setTargetPosition] = useState('')
    const [targetYears, setTargetYears] = useState(5)
    const [analysis, setAnalysis] = useState(null)
    const [roadmap, setRoadmap] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const learningPlan = getUserLearningPlan?.() || []

    // Run analysis
    const handleAnalyze = async () => {
        if (!selectedCV || !targetPosition) return
        setIsLoading(true)

        try {
            // Try backend API first
            const cv = cvs?.find(c => c.id === selectedCV)
            const response = await fetch(`${API_URL}/skill-gap/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    cvData: cv?.data || cv,
                    targetPosition,
                    currentTitle: cv?.data?.personalInfo?.title
                })
            })

            if (response.ok) {
                const data = await response.json()
                setAnalysis(data.analysis)
                if (data.analysis.roadmap) {
                    setRoadmap(data.analysis.roadmap)
                }
            } else {
                // Fallback to local analysis
                const result = analyzeGap?.(selectedCV, targetPosition)
                setAnalysis(result)
            }
        } catch (error) {
            console.error('Analysis error:', error)
            // Fallback to local
            const result = analyzeGap?.(selectedCV, targetPosition)
            setAnalysis(result)
        }

        setStep('result')
        setIsLoading(false)
    }

    // Fetch career roadmap
    const handleViewRoadmap = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/skill-gap/roadmap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    targetPosition,
                    yearsToGoal: targetYears
                })
            })

            if (response.ok) {
                const data = await response.json()
                setRoadmap(data.roadmap)
            }
        } catch (error) {
            console.error('Roadmap error:', error)
        }
        setStep('roadmap')
        setIsLoading(false)
    }

    // Add skill to learning plan
    const handleAddToLearning = (skill) => {
        addToLearningPlan?.(skill)
    }

    // Get score color
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-[#10B981]'
        if (score >= 60) return 'text-amber-400'
        return 'text-red-400'
    }

    // Get impact color
    const getImpactColor = (impact) => {
        if (impact >= 40) return 'bg-[#10B981] text-black'
        if (impact >= 25) return 'bg-amber-500 text-black'
        return 'bg-blue-500 text-white'
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#0F1115] text-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative"
                >
                    {/* Glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-gradient-to-r from-[#10B981]/10 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <BarChart3 className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                    Beceri Analizi & Yol Haritası
                                </h2>
                                <p className="text-sm font-medium text-gray-400">
                                    {step === 'select' && 'CV ve hedef pozisyon seçin'}
                                    {step === 'result' && <span className="text-[#10B981]">Yapay Zeka Analiz Sonuçları</span>}
                                    {step === 'roadmap' && <span className="text-amber-400">{targetYears} yıllık kariyer yol haritası</span>}
                                    {step === 'plan' && <span className="text-purple-400">Kişisel Öğrenme Planınız</span>}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {/* Loading */}
                            {isLoading && (
                                <motion.div 
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20 h-full"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="w-8 h-8 text-[#10B981] animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mt-6 text-white">Yapay Zeka Analiz Ediyor</h3>
                                    <p className="text-gray-400 mt-2">Becerileriniz eşleştiriliyor...</p>
                                </motion.div>
                            )}

                            {/* Selection */}
                            {step === 'select' && !isLoading && (
                                <motion.div 
                                    key="select"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    {/* CV Selection */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">
                                            <span className="w-6 h-6 rounded bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">1</span>
                                            KAYNAK CV'Yİ SEÇİN
                                        </label>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {cvs?.map(cv => (
                                                <button
                                                    key={cv.id}
                                                    onClick={() => setSelectedCV(cv.id)}
                                                    className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden group ${selectedCV === cv.id
                                                        ? 'bg-[#10B981]/10 border border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                        : 'bg-black/40 border border-white/5 hover:border-white/20'
                                                        }`}
                                                >
                                                    {selectedCV === cv.id && (
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#10B981]/40 to-transparent blur-xl"></div>
                                                    )}
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <div>
                                                            <div className={`font-bold text-lg mb-1 ${selectedCV === cv.id ? 'text-[#10B981]' : 'text-white'}`}>{cv.name}</div>
                                                            <div className="text-xs text-gray-500 font-medium bg-white/5 inline-flex px-2 py-1 rounded">{cv.template}</div>
                                                        </div>
                                                        {selectedCV === cv.id && <CheckCircle className="w-6 h-6 text-[#10B981]" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Target Position */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">
                                            <span className="w-6 h-6 rounded bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">2</span>
                                            HEDEF POZİSYON
                                        </label>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {Object.keys(POSITION_REQUIREMENTS).map(pos => (
                                                <button
                                                    key={pos}
                                                    onClick={() => setTargetPosition(pos)}
                                                    className={`p-5 rounded-2xl text-left transition-all relative overflow-hidden group ${targetPosition === pos
                                                        ? 'bg-[#10B981]/10 border border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                                                        : 'bg-black/40 border border-white/5 hover:border-[#10B981]/30 hover:bg-white/5'
                                                        }`}
                                                >
                                                    <div className="relative z-10">
                                                        <div className={`font-bold text-base mb-2 ${targetPosition === pos ? 'text-[#10B981]' : 'text-white group-hover:text-[#10B981]'}`}>{pos}</div>
                                                        <div className="text-xs text-gray-500 line-clamp-1 mb-3 bg-white/5 inline-flex px-2 py-1 rounded w-full">
                                                            {POSITION_REQUIREMENTS[pos].required.slice(0, 3).join(', ')}...
                                                        </div>
                                                        {POSITION_REQUIREMENTS[pos].certifications && (
                                                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-amber-400">
                                                                <Award className="w-3 h-3" />
                                                                {POSITION_REQUIREMENTS[pos].certifications.length} Sertifika Gereksinimi
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Years Goal */}
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                                        <div className="flex items-center justify-between mb-6">
                                            <label className="flex items-center gap-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
                                                <span className="w-6 h-6 rounded bg-[#10B981]/20 text-[#10B981] flex items-center justify-center">3</span>
                                                HEDEF SÜRESİ
                                            </label>
                                            <span className="px-4 py-1.5 rounded-xl bg-[#10B981]/20 text-[#10B981] font-black border border-[#10B981]/30">
                                                {targetYears} YIL
                                            </span>
                                        </div>
                                        
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={targetYears}
                                            onChange={(e) => setTargetYears(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#10B981] [&::-webkit-slider-thumb]:rounded-full cursor-pointer outline-none shadow-inner"
                                        />
                                        <div className="flex justify-between text-xs font-bold text-gray-500 mt-3">
                                            <span>1 YIL</span>
                                            <span>5 YIL</span>
                                            <span>10 YIL</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Results */}
                            {step === 'result' && analysis && !isLoading && (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-8"
                                >
                                    {/* Score Card */}
                                    <div className="p-8 rounded-3xl bg-gradient-to-r from-[#10B981]/10 to-transparent border border-[#10B981]/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                                        
                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="text-sm font-bold uppercase tracking-widest text-[#10B981] mb-2 flex items-center justify-center md:justify-start gap-2">
                                                    <Target className="w-4 h-4" /> UYUMLULUK SKORU
                                                </div>
                                                <div className="flex items-end justify-center md:justify-start gap-4">
                                                    <div className={`text-6xl md:text-7xl font-black tracking-tighter ${getScoreColor(analysis.score || analysis.matchScore)} drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]`}>
                                                        {analysis.score || analysis.matchScore}%
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 mt-4 text-base font-medium">
                                                    {(analysis.score || analysis.matchScore) >= 80 ? '✨ Mükemmel uyum! Bu pozisyon için aranan niteliklerin çoğuna sahipsiniz.' :
                                                        (analysis.score || analysis.matchScore) >= 60 ? '👍 İyi bir başlangıç. Birkaç kilit beceriyi geliştirerek harika bir aday olabilirsiniz.' :
                                                            '📚 Biraz çalışma gerekiyor. Endişelenmeyin, size özel bir öğrenme planı hazırladık!'}
                                                </p>
                                            </div>

                                            {analysis.potentialImpact && (
                                                <div className="flex-shrink-0 text-center p-6 bg-[#10B981]/20 rounded-3xl border border-[#10B981]/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                                    <div className="text-xs font-bold uppercase tracking-widest text-[#10B981] mb-2">POTANSİYEL ARTIŞ</div>
                                                    <div className="text-5xl font-black text-white">+{analysis.potentialImpact}%</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Skills Breakdown */}
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        {/* Required Skills */}
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
                                            <h3 className="font-black text-xl mb-6 flex items-center gap-3 text-white">
                                                <AlertCircle className="w-6 h-6 text-red-400" />
                                                Zorunlu Beceriler
                                            </h3>
                                            <div className="space-y-3 relative z-10">
                                                {analysis.required.met.map(skill => (
                                                    <div key={skill} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                                                        <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center border border-[#10B981]/30">
                                                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                                                        </div>
                                                        <span className="font-semibold text-gray-300">{skill}</span>
                                                    </div>
                                                ))}
                                                {analysis.required.missing.map(skill => (
                                                    <div key={skill} className="flex items-center justify-between p-3 rounded-2xl bg-red-500/10 border border-red-500/20 group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                                                <X className="w-4 h-4 text-red-400" />
                                                            </div>
                                                            <span className="font-semibold text-white">{skill}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddToLearning(skill)}
                                                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Plus className="w-3 h-3" /> Ekle
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Preferred Skills */}
                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                                            <h3 className="font-black text-xl mb-6 flex items-center gap-3 text-white">
                                                <TrendingUp className="w-6 h-6 text-amber-400" />
                                                Tercih Edilen / Sertifikalar
                                            </h3>
                                            <div className="space-y-3 relative z-10">
                                                {analysis.preferred.met.map(skill => (
                                                    <div key={skill} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                                                        <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center border border-[#10B981]/30">
                                                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                                                        </div>
                                                        <span className="font-semibold text-gray-300">{skill}</span>
                                                    </div>
                                                ))}
                                                {analysis.preferred.missing.map(skill => (
                                                    <div key={skill} className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                                                                <AlertCircle className="w-4 h-4 text-amber-400" />
                                                            </div>
                                                            <span className="font-semibold text-white">{skill}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleAddToLearning(skill)}
                                                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Plus className="w-3 h-3" /> Ekle
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course Recommendations */}
                                    <div>
                                        <h3 className="font-black text-2xl mb-6 flex items-center gap-3 text-white">
                                            <GraduationCap className="w-7 h-7 text-[#10B981]" />
                                            Yapay Zeka Kurs Önerileri
                                        </h3>
                                        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                                            {(analysis.courseRecommendations || analysis.recommendations || []).slice(0, 6).map((rec, i) => {
                                                const skill = rec.skill
                                                const resources = rec.courses || rec.resources || LEARNING_RESOURCES[skill] || []
                                                const bestCourse = resources[0]

                                                return (
                                                    <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#10B981]/50 hover:bg-[#10B981]/5 transition-all group flex flex-col h-full relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-b from-[#10B981]/0 to-[#10B981]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                        
                                                        <div className="flex items-start justify-between mb-4 relative z-10">
                                                            <div>
                                                                <span className={`inline-block px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 border ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                                                    {rec.priority === 'high' ? 'Kritik Eksik' : 'Önerilen'}
                                                                </span>
                                                                <h4 className="font-black text-lg text-white group-hover:text-[#10B981] transition-colors">{skill}</h4>
                                                            </div>
                                                            {rec.impact && (
                                                                <div className={`px-2 py-1 rounded-xl text-xs font-black shadow-lg ${getImpactColor(rec.impact)}`}>
                                                                    +{rec.impact}% Şans
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-sm text-gray-400 mb-5 flex-1 relative z-10 font-medium">
                                                            {rec.description || rec.reason || `${skill} öğrenerek mülakatlarda avantaj sağlayın.`}
                                                        </p>

                                                        {bestCourse && (
                                                            <a
                                                                href={bestCourse.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block p-4 rounded-xl bg-black/60 hover:bg-black border border-white/5 hover:border-[#10B981]/30 transition-all mb-4 relative z-10"
                                                            >
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-xs font-black text-[#10B981] uppercase tracking-wider">{bestCourse.provider || 'Udemy'}</span>
                                                                    {bestCourse.rating && (
                                                                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                                                                            <Star className="w-3 h-3 fill-current" />
                                                                            {bestCourse.rating}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="font-bold text-white text-sm line-clamp-2 leading-snug">{bestCourse.name || bestCourse.title}</div>
                                                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                                                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-lg ${bestCourse.type === 'free' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-amber-500/20 text-amber-400'}`}>
                                                                        {bestCourse.price || (bestCourse.type === 'free' ? 'Ücretsiz' : 'Ücretli')}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-gray-400 text-xs font-bold group-hover:text-white transition-colors">
                                                                        İncele <ExternalLink className="w-3 h-3" />
                                                                    </span>
                                                                </div>
                                                            </a>
                                                        )}

                                                        <button
                                                            onClick={() => handleAddToLearning(skill)}
                                                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-[#10B981] hover:text-black hover:border-[#10B981] transition-all flex items-center justify-center gap-2 relative z-10"
                                                        >
                                                            <Plus className="w-4 h-4" /> Öğrenme Planına Ekle
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Roadmap and Learning Plan components continue with same UI upgrade... */}
                            {/* Roadmap */}
                            {step === 'roadmap' && !isLoading && (
                                <motion.div 
                                    key="roadmap"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center mb-12 p-8 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#10B981]/10 rounded-full blur-3xl"></div>
                                        <h3 className="text-3xl font-black text-white mb-3 relative z-10 flex items-center justify-center gap-3">
                                            <Map className="w-8 h-8 text-[#10B981]" /> {targetPosition} Yol Haritası
                                        </h3>
                                        <p className="text-gray-400 font-medium relative z-10">
                                            <span className="text-[#10B981] font-bold">{targetYears} yılda</span> hedefinize ulaşmak için izlemeniz gereken stratejik adımlar.
                                        </p>
                                    </div>

                                    <div className="relative max-w-3xl mx-auto">
                                        <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[#10B981] via-amber-500 to-[#059669] rounded-full" />

                                        <div className="space-y-10">
                                            {(roadmap?.timeline || []).map((step, index) => (
                                                <div key={index} className="relative flex gap-8">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 shadow-lg border-2 border-black ${
                                                        index === 0 ? 'bg-[#10B981] text-black' :
                                                        index === (roadmap?.timeline?.length || 0) - 1 ? 'bg-[#059669] text-white' :
                                                        'bg-amber-500 text-black'
                                                    }`}>
                                                        <span className="font-black text-lg">{step.year}Y</span>
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="p-6 rounded-3xl bg-black/40 border border-white/10 hover:border-[#10B981]/30 transition-colors">
                                                            <h4 className="text-xl font-black text-white mb-4">{step.title}</h4>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Kazanılacak Beceriler</div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {step.skills?.map((skill, i) => (
                                                                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {step.certifications?.length > 0 && (
                                                                    <div>
                                                                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Önerilen Sertifikalar</div>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {step.certifications.map((cert, i) => (
                                                                                <span key={i} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium rounded-xl flex items-center gap-1.5">
                                                                                    <Award className="w-4 h-4" /> {cert}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {step.salary_range && (
                                                                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-2 text-[#10B981] font-black text-lg">
                                                                        <DollarSign className="w-5 h-5" />
                                                                        ₺{step.salary_range.min?.toLocaleString()} - ₺{step.salary_range.max?.toLocaleString()}<span className="text-sm font-medium text-gray-500">/ay</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Learning Plan */}
                            {step === 'plan' && !isLoading && (
                                <motion.div 
                                    key="plan"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6 max-w-3xl mx-auto"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-black text-2xl flex items-center gap-3 text-white">
                                            <BookOpen className="w-7 h-7 text-[#10B981]" />
                                            Kişisel Öğrenme Planım
                                        </h3>
                                        <span className="px-4 py-1.5 rounded-xl bg-white/10 text-white font-bold">{learningPlan.length} Beceri</span>
                                    </div>
                                    
                                    {learningPlan.length > 0 ? (
                                        <div className="space-y-4">
                                            {learningPlan.map(item => (
                                                <div key={item.id} className="p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="font-bold text-lg text-white">{item.skill}</span>
                                                        <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider border ${
                                                            item.status === 'completed' ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/30' :
                                                            item.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                            'bg-white/10 text-gray-400 border-white/20'
                                                        }`}>
                                                            {item.status === 'completed' ? 'Tamamlandı' :
                                                                item.status === 'in-progress' ? 'Devam Ediyor' : 'Planlandı'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1 h-3 rounded-full bg-black/60 border border-white/5 overflow-hidden shadow-inner relative">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all"
                                                                style={{ width: `${item.progress}%` }}
                                                            >
                                                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -translate-x-full"></div>
                                                            </div>
                                                        </div>
                                                        <span className="text-lg font-black text-[#10B981] w-12 text-right">{item.progress}%</span>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={item.progress}
                                                            onChange={(e) => updateLearningProgress?.(item.id, parseInt(e.target.value))}
                                                            className="w-24 h-2 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#10B981] [&::-webkit-slider-thumb]:rounded-full cursor-pointer outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 px-6 rounded-3xl bg-black/40 border border-white/5 border-dashed">
                                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                                <BookOpen className="w-10 h-10 text-gray-600" />
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-2">Henüz planınız boş</h4>
                                            <p className="text-gray-400 font-medium max-w-md mx-auto">Analiz sonuçlarından beceriler ekleyerek kendi çalışma rotanızı oluşturabilirsiniz.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 backdrop-blur-xl relative z-10">
                        {step === 'select' && (
                            <>
                                <button onClick={onClose} className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                                    İptal
                                </button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={!selectedCV || !targetPosition || isLoading}
                                    className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-black disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Yapay Zeka ile Analiz Et
                                </button>
                            </>
                        )}

                        {step === 'result' && (
                            <>
                                <button onClick={() => setStep('select')} className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors flex items-center justify-center gap-2">
                                    <RotateCcw className="w-4 h-4" /> Yeni Analiz
                                </button>
                                <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
                                    <button
                                        onClick={handleViewRoadmap}
                                        className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-black border border-[#10B981]/50 text-[#10B981] font-black flex items-center justify-center gap-2 hover:bg-[#10B981]/10 transition-colors"
                                    >
                                        <Map className="w-5 h-5" />
                                        Yol Haritası
                                    </button>
                                    <button
                                        onClick={() => setStep('plan')}
                                        className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-black flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        Planım ({learningPlan.length})
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 'roadmap' && (
                            <>
                                <button onClick={() => setStep('result')} className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                                    Geri Dön
                                </button>
                                <button onClick={onClose} className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-black hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                                    Harikaymış, Kapat
                                </button>
                            </>
                        )}

                        {step === 'plan' && (
                            <>
                                <button onClick={() => setStep('result')} className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">
                                    Geri Dön
                                </button>
                                <button onClick={onClose} className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-black hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                                    Planı Kaydet & Kapat
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
