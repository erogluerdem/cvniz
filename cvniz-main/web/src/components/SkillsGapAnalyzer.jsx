import { useState } from 'react'
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
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-amber-400'
        return 'text-red-400'
    }

    // Get impact color
    const getImpactColor = (impact) => {
        if (impact >= 40) return 'bg-green-500'
        if (impact >= 25) return 'bg-amber-500'
        return 'bg-blue-500'
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-red-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Beceri Açığı Analizi & Yol Haritası</h2>
                            <p className="text-sm text-gray-400">
                                {step === 'select' && 'CV ve hedef pozisyon seçin'}
                                {step === 'result' && 'Analiz sonuçları & kurs önerileri'}
                                {step === 'roadmap' && `${targetYears} yıllık kariyer yol haritası`}
                                {step === 'plan' && 'Öğrenme planınız'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Loading */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-4" />
                            <p className="text-gray-400">AI analiz yapıyor...</p>
                        </div>
                    )}

                    {/* Selection */}
                    {step === 'select' && !isLoading && (
                        <div className="space-y-8">
                            {/* CV Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-4">📄 CV Seçin</label>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {cvs?.map(cv => (
                                        <button
                                            key={cv.id}
                                            onClick={() => setSelectedCV(cv.id)}
                                            className={`p-4 rounded-xl text-left transition-all ${selectedCV === cv.id
                                                ? 'bg-orange-500/20 border-2 border-orange-500 ring-2 ring-orange-500/20'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium">{cv.name}</div>
                                            <div className="text-sm text-gray-400">{cv.template}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Position */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-4">🎯 Hedef Pozisyon</label>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {Object.keys(POSITION_REQUIREMENTS).map(pos => (
                                        <button
                                            key={pos}
                                            onClick={() => setTargetPosition(pos)}
                                            className={`p-4 rounded-xl text-left transition-all ${targetPosition === pos
                                                ? 'bg-orange-500/20 border-2 border-orange-500 ring-2 ring-orange-500/20'
                                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="font-medium text-white">{pos}</div>
                                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                {POSITION_REQUIREMENTS[pos].required.slice(0, 3).join(', ')}...
                                            </div>
                                            {POSITION_REQUIREMENTS[pos].certifications && (
                                                <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
                                                    <Award className="w-3 h-3" />
                                                    {POSITION_REQUIREMENTS[pos].certifications.length} sertifika
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Years Goal */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-4">
                                    ⏱️ Hedefe Ulaşma Süresi: <span className="text-orange-400">{targetYears} yıl</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={targetYears}
                                    onChange={(e) => setTargetYears(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>1 yıl</span>
                                    <span>5 yıl</span>
                                    <span>10 yıl</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {step === 'result' && analysis && !isLoading && (
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-400 mb-1">Uyumluluk Skoru</div>
                                        <div className={`text-5xl font-black ${getScoreColor(analysis.score || analysis.matchScore)}`}>
                                            {analysis.score || analysis.matchScore}%
                                        </div>
                                        <p className="text-gray-400 mt-2 text-sm">
                                            {(analysis.score || analysis.matchScore) >= 80 ? '✨ Mükemmel uyum! Bu pozisyon için hazırsınız.' :
                                                (analysis.score || analysis.matchScore) >= 60 ? '👍 İyi bir başlangıç. Birkaç beceri geliştirin.' :
                                                    '📚 Biraz çalışma gerekiyor. Endişelenmeyin, planınız hazır!'}
                                        </p>
                                    </div>
                                    {analysis.potentialImpact && (
                                        <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                                            <div className="text-3xl font-bold text-green-400">+{analysis.potentialImpact}%</div>
                                            <div className="text-xs text-gray-400">Potansiyel Artış</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Skills Breakdown */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Required Skills */}
                                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-red-400" />
                                        Zorunlu Beceriler
                                    </h3>
                                    <div className="space-y-2">
                                        {analysis.required.met.map(skill => (
                                            <div key={skill} className="flex items-center gap-2 text-green-400">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>{skill}</span>
                                            </div>
                                        ))}
                                        {analysis.required.missing.map(skill => (
                                            <div key={skill} className="flex items-center justify-between p-2 rounded-lg bg-red-500/10">
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{skill}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToLearning(skill)}
                                                    className="p-1 rounded hover:bg-white/10 text-white"
                                                    title="Öğrenme planına ekle"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preferred Skills */}
                                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-amber-400" />
                                        Tercih Edilen / Sertifikalar
                                    </h3>
                                    <div className="space-y-2">
                                        {analysis.preferred.met.map(skill => (
                                            <div key={skill} className="flex items-center gap-2 text-green-400">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>{skill}</span>
                                            </div>
                                        ))}
                                        {analysis.preferred.missing.map(skill => (
                                            <div key={skill} className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10">
                                                <div className="flex items-center gap-2 text-amber-400">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>{skill}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleAddToLearning(skill)}
                                                    className="p-1 rounded hover:bg-white/10 text-white"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Course Recommendations */}
                            <div>
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                                    Önerilen Kurslar
                                    <span className="text-xs font-normal text-gray-500">(Affiliate Linkler)</span>
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {(analysis.courseRecommendations || analysis.recommendations || []).slice(0, 6).map((rec, i) => {
                                        const skill = rec.skill
                                        const resources = rec.courses || rec.resources || LEARNING_RESOURCES[skill] || []
                                        const bestCourse = resources[0]

                                        return (
                                            <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all">
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                                                            }`}>
                                                            {rec.priority === 'high' ? '🔥 Öncelikli' : '⭐ Önerilen'}
                                                        </span>
                                                        <h4 className="font-bold text-white">{skill}</h4>
                                                    </div>
                                                    {rec.impact && (
                                                        <div className={`px-2 py-1 rounded-lg text-xs font-bold text-white ${getImpactColor(rec.impact)}`}>
                                                            +{rec.impact}% şans
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                <p className="text-xs text-gray-400 mb-3">
                                                    {rec.description || rec.reason || `${skill} öğrenerek iş bulma şansınızı artırın`}
                                                </p>

                                                {/* Best Course */}
                                                {bestCourse && (
                                                    <a
                                                        href={bestCourse.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xs font-semibold text-cyan-400">{bestCourse.provider || 'Udemy'}</span>
                                                            {bestCourse.rating && (
                                                                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                                                    <Star className="w-3 h-3 fill-current" />
                                                                    {bestCourse.rating}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="font-medium text-white text-sm">{bestCourse.name || bestCourse.title}</div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className={`text-xs font-bold ${bestCourse.type === 'free' ? 'text-green-400' : 'text-orange-400'}`}>
                                                                {bestCourse.price || (bestCourse.type === 'free' ? 'Ücretsiz' : 'Ücretli')}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-cyan-400 text-xs">
                                                                Kursa Git <ExternalLink className="w-3 h-3" />
                                                            </span>
                                                        </div>
                                                    </a>
                                                )}

                                                {/* Add to plan */}
                                                <button
                                                    onClick={() => handleAddToLearning(skill)}
                                                    className="w-full mt-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Öğrenme Planına Ekle
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Roadmap */}
                    {step === 'roadmap' && !isLoading && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    🗺️ {targetPosition} Yol Haritası
                                </h3>
                                <p className="text-gray-400">
                                    {targetYears} yılda hedefinize ulaşmak için izlemeniz gereken adımlar
                                </p>
                            </div>

                            {/* Timeline */}
                            <div className="relative">
                                {/* Line */}
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-amber-500 to-green-500" />

                                {/* Steps */}
                                <div className="space-y-8">
                                    {(roadmap?.timeline || []).map((step, index) => (
                                        <div key={index} className="relative flex gap-6">
                                            {/* Circle */}
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${index === 0 ? 'bg-orange-500' :
                                                index === (roadmap?.timeline?.length || 0) - 1 ? 'bg-green-500' :
                                                    'bg-amber-500'
                                                }`}>
                                                <span className="text-white font-bold">{step.year}Y</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 pb-8">
                                                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                                    <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>

                                                    {/* Skills */}
                                                    <div className="mb-3">
                                                        <div className="text-xs text-gray-500 mb-2">Kazanılacak Beceriler:</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {step.skills?.map((skill, i) => (
                                                                <span key={i} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-lg">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Certifications */}
                                                    {step.certifications?.length > 0 && (
                                                        <div className="mb-3">
                                                            <div className="text-xs text-gray-500 mb-2">Önerilen Sertifikalar:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {step.certifications.map((cert, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-lg flex items-center gap-1">
                                                                        <Award className="w-3 h-3" />
                                                                        {cert}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Salary */}
                                                    {step.salary_range && (
                                                        <div className="flex items-center gap-2 text-green-400 text-sm">
                                                            <DollarSign className="w-4 h-4" />
                                                            ₺{step.salary_range.min?.toLocaleString()} - ₺{step.salary_range.max?.toLocaleString()}/ay
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Learning Plan */}
                    {step === 'plan' && !isLoading && (
                        <div className="space-y-4">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-purple-400" />
                                Öğrenme Planım
                            </h3>
                            {learningPlan.length > 0 ? learningPlan.map(item => (
                                <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium">{item.skill}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            item.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-400' :
                                                'bg-white/10 text-gray-400'
                                            }`}>
                                            {item.status === 'completed' ? 'Tamamlandı' :
                                                item.status === 'in-progress' ? 'Devam Ediyor' : 'Planlandı'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all"
                                                style={{ width: `${item.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-cyan-400">{item.progress}%</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={item.progress}
                                            onChange={(e) => updateLearningProgress?.(item.id, parseInt(e.target.value))}
                                            className="w-20 accent-cyan-500"
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-gray-500">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p className="font-medium">Henüz öğrenme planınıza bir şey eklemediniz.</p>
                                    <p className="text-sm mt-1">Analiz sonuçlarından beceri ekleyin.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-between bg-white/[0.02]">
                    {step === 'select' && (
                        <>
                            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                İptal
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={!selectedCV || !targetPosition || isLoading}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold disabled:opacity-50 flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                            >
                                <Sparkles className="w-5 h-5" />
                                AI ile Analiz Et
                            </button>
                        </>
                    )}

                    {step === 'result' && (
                        <>
                            <button onClick={() => setStep('select')} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                Yeni Analiz
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleViewRoadmap}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400 font-bold flex items-center gap-2 hover:bg-purple-500/30 transition-colors"
                                >
                                    <Map className="w-5 h-5" />
                                    Yol Haritası
                                </button>
                                <button
                                    onClick={() => setStep('plan')}
                                    className="px-6 py-3 rounded-xl bg-white/10 flex items-center gap-2 hover:bg-white/20 transition-colors"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Planım ({learningPlan.length})
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'roadmap' && (
                        <>
                            <button onClick={() => setStep('result')} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                Geri
                            </button>
                            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold">
                                Tamam
                            </button>
                        </>
                    )}

                    {step === 'plan' && (
                        <>
                            <button onClick={() => setStep('result')} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                Geri
                            </button>
                            <button onClick={onClose} className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors">
                                Kapat
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
