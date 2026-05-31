import React, { useState, useEffect, useMemo } from 'react'
import { 
    Activity, CheckCircle, AlertCircle, Sparkles,
    ChevronDown, ChevronUp, RefreshCw, Target
} from 'lucide-react'

/**
 * RealTimeATSPanel - Faz 4: Gerçek Zamanlı ATS Skoru
 * Anlık skor göstergesi, keyword önerileri, okunabilirlik analizi
 */
export default function RealTimeATSPanel({
    cvData,
    isDayMode = false,
    targetJobDescription = '',
    onOptimize
}) {
    const [score, setScore] = useState(0)
    const [lastUpdated, setLastUpdated] = useState(Date.now())
    const [expanded, setExpanded] = useState(false) // Varsayılan olarak daraltılmış

    // Calculate ATS score in real-time
    const analysis = useMemo(() => {
        const checks = {
            summary: {
                label: 'Profesyonel Özet',
                weight: 20,
                check: () => cvData?.personal?.summary?.length > 100,
                tip: 'Özetinizi 100+ karakter yapın'
            },
            skills: {
                label: 'Teknik Beceriler',
                weight: 20,
                check: () => (cvData?.skills?.length || 0) >= 5,
                tip: 'En az 5 beceri ekleyin'
            },
            experience: {
                label: 'İş Deneyimi',
                weight: 25,
                check: () => {
                    const hasExp = (cvData?.experience?.length || 0) > 0
                    const hasMetrics = cvData?.experience?.some(e => 
                        /\d+%|\d+\s*yıl|\d+\s*kişi|\$\d+/i.test(e.description || '')
                    )
                    return hasExp && hasMetrics
                },
                tip: 'Deneyimlerinize sayısal veriler ekleyin'
            },
            contact: {
                label: 'İletişim Bilgileri',
                weight: 15,
                check: () => cvData?.personal?.email && cvData?.personal?.phone,
                tip: 'Email ve telefon ekleyin'
            },
            education: {
                label: 'Eğitim',
                weight: 10,
                check: () => (cvData?.education?.length || 0) > 0,
                tip: 'Eğitim bilgilerini ekleyin'
            },
            actionVerbs: {
                label: 'Eylem Fiilleri',
                weight: 10,
                check: () => {
                    const verbs = ['geliştirdim', 'optimize', 'yönettim', 'başlattım', 'artırdım', 'azalttım', 'kurulum', 'entegre']
                    const text = JSON.stringify(cvData).toLowerCase()
                    return verbs.some(v => text.includes(v))
                },
                tip: 'Aktif eylem fiilleri kullanın'
            }
        }

        let totalScore = 0
        let maxScore = 0
        const results = []

        Object.entries(checks).forEach(([key, item]) => {
            const passed = item.check()
            totalScore += passed ? item.weight : 0
            maxScore += item.weight
            results.push({
                id: key,
                ...item,
                passed,
                score: passed ? item.weight : 0
            })
        })

        const percentage = Math.round((totalScore / maxScore) * 100)

        return {
            score: percentage,
            checks: results,
            passed: results.filter(r => r.passed).length,
            total: results.length,
            tips: results.filter(r => !r.passed).map(r => r.tip)
        }
    }, [cvData, lastUpdated])

    // Keyword analysis
    const keywordAnalysis = useMemo(() => {
        if (!targetJobDescription) return null

        const commonKeywords = [
            'javascript', 'react', 'node.js', 'python', 'sql', 'aws', 'docker',
            'agile', 'scrum', 'leadership', 'communication', 'problem solving',
            'project management', 'data analysis', 'machine learning', 'api'
        ]

        const jobText = targetJobDescription.toLowerCase()
        const cvText = JSON.stringify(cvData).toLowerCase()

        const found = commonKeywords.filter(kw => 
            jobText.includes(kw) && cvText.includes(kw)
        )

        const missing = commonKeywords.filter(kw => 
            jobText.includes(kw) && !cvText.includes(kw)
        ).slice(0, 5)

        return { found, missing, matchRate: Math.round((found.length / (found.length + missing.length)) * 100) }
    }, [cvData, targetJobDescription])

    // Auto refresh every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdated(Date.now())
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        setScore(analysis.score)
    }, [analysis])

    const getScoreColor = (s) => {
        if (s >= 80) return 'text-emerald-400'
        if (s >= 60) return 'text-cyan-400'
        if (s >= 40) return 'text-amber-400'
        return 'text-red-400'
    }

    const getScoreBg = (s) => {
        if (s >= 80) return 'bg-emerald-500'
        if (s >= 60) return 'bg-cyan-500'
        if (s >= 40) return 'bg-amber-500'
        return 'bg-red-500'
    }

    return (
        <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
            isDayMode ? 'bg-white border-slate-200' : 'bg-[#161920] border-white/10'
        } ${expanded ? 'p-4' : 'p-3'}`}>
            {/* Compact Header - Always Visible */}
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    {/* Mini Score Ring */}
                    <div className="relative w-12 h-12">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="24" cy="24" r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className={isDayMode ? 'text-slate-100' : 'text-white/10'}
                            />
                            <circle
                                cx="24" cy="24" r="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={126}
                                strokeDashoffset={126 - (126 * score) / 100}
                                className={`${getScoreBg(score)} transition-all duration-1000`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-sm font-black ${getScoreColor(score)}`}>
                                {score}
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className={`font-bold text-sm ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                            ATS Uyumluluk
                        </h3>
                        <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {analysis.passed}/{analysis.total} kriter • {score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setLastUpdated(Date.now())
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isDayMode ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-slate-500'
                        }`}
                        title="Yenile"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    {expanded ? (
                        <ChevronUp className={`w-4 h-4 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    ) : (
                        <ChevronDown className={`w-4 h-4 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
                <>
                    {/* Score Details */}
                    <div className={`mt-4 pt-4 border-t border-dashed ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
                        <p className={`text-sm font-medium mb-3 ${isDayMode ? 'text-slate-700' : 'text-slate-300'}`}>
                            {score >= 80 ? '🎉 Mükemmel!' : score >= 60 ? '👍 İyi gidiyor' : '💪 Geliştirme gerekli'}
                            <span className="text-xs font-normal ml-2 opacity-70">
                                ({score}/100)
                            </span>
                        </p>
                        
                        {/* Progress Bars */}
                        <div className="space-y-2 mb-4">
                            {analysis.checks.map((check) => (
                                <div key={check.id} className="flex items-center gap-2">
                                    {check.passed ? (
                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                    )}
                                    <span className={`flex-1 text-xs ${
                                        isDayMode ? 'text-slate-600' : 'text-slate-400'
                                    }`}>
                                        {check.label}
                                    </span>
                                    <span className={`text-[10px] font-bold ${
                                        check.passed ? 'text-emerald-400' : 'text-red-400'
                                    }`}>
                                        +{check.score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Tips - Only when expanded */}
            {expanded && analysis.tips.length > 0 && (
                <div className={`mt-3 p-3 rounded-lg ${
                    isDayMode ? 'bg-amber-50/80 border border-amber-100' : 'bg-amber-500/10 border border-amber-500/20'
                }`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                        isDayMode ? 'text-amber-700' : 'text-amber-400'
                    }`}>
                        İyileştirme Önerileri
                    </p>
                    <ul className="space-y-1">
                        {analysis.tips.slice(0, 2).map((tip, i) => (
                            <li key={i} className={`flex items-center gap-1.5 text-xs ${
                                isDayMode ? 'text-amber-700' : 'text-amber-400'
                            }`}>
                                <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Keyword Suggestions - Only when expanded */}
            {expanded && keywordAnalysis?.missing?.length > 0 && (
                <div className={`mt-3 p-3 rounded-lg ${
                    isDayMode ? 'bg-cyan-50/80 border border-cyan-100' : 'bg-cyan-500/10 border border-cyan-500/20'
                }`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
                        isDayMode ? 'text-cyan-700' : 'text-cyan-400'
                    }`}>
                        Eksik Anahtar Kelimeler ({keywordAnalysis.matchRate}% eşleşme)
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {keywordAnalysis.missing.slice(0, 4).map((kw, i) => (
                            <span key={i} className={`px-2 py-0.5 rounded text-[10px] ${
                                isDayMode ? 'bg-white text-cyan-700 border border-cyan-200' : 'bg-white/10 text-cyan-300 border border-white/10'
                            }`}>
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Optimize Button - Only when expanded */}
            {expanded && score < 80 && onOptimize && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onOptimize()
                    }}
                    className="w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI ile Optimize Et
                </button>
            )}
        </div>
    )
}
