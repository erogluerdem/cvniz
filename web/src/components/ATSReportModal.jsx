import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
    X, FileText, Download, Sparkles, CheckCircle, AlertTriangle, XCircle,
    User, Briefcase, GraduationCap, Wrench, Mail, Phone, MapPin,
    TrendingUp, Target, Award, Loader2, FileDown, Crown, Lock,
    Tag, BarChart3, Zap, AlertCircle, ChevronRight
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// ATS Report Categories with icons
const ATS_CATEGORIES = {
    contact: { name: 'İletişim Bilgileri', weight: 10, icon: User },
    summary: { name: 'Profesyonel Özet', weight: 10, icon: FileText },
    experience: { name: 'İş Deneyimi', weight: 25, icon: Briefcase },
    education: { name: 'Eğitim', weight: 10, icon: GraduationCap },
    skills: { name: 'Beceriler', weight: 15, icon: Wrench },
    keywords: { name: 'Anahtar Kelimeler', weight: 20, icon: Tag },
    formatting: { name: 'Format & Yapı', weight: 10, icon: Target }
}

// Sectors
const SECTORS = [
    { id: 'yazilim', name: 'Yazılım / IT', icon: '💻' },
    { id: 'finans', name: 'Finans / Bankacılık', icon: '💰' },
    { id: 'pazarlama', name: 'Pazarlama / Dijital', icon: '📢' },
    { id: 'uretim', name: 'Üretim / Mühendislik', icon: '🏭' },
    { id: 'insan_kaynaklari', name: 'İnsan Kaynakları', icon: '👥' },
    { id: 'satis', name: 'Satış / BD', icon: '🎯' },
    { id: 'saglik', name: 'Sağlık', icon: '🏥' },
    { id: 'genel', name: 'Genel', icon: '📋' }
]

export default function ATSReportModal({ isOpen, onClose, cvData, cvName }) {
    const { isPremium, token } = useAuth()
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [report, setReport] = useState(null)
    const [isExporting, setIsExporting] = useState(false)
    const [selectedSector, setSelectedSector] = useState('genel')
    const [usage, setUsage] = useState({ used: 0, limit: 3, remaining: 3 })
    const [showUpgrade, setShowUpgrade] = useState(false)
    const reportRef = useRef(null)

    // Fetch usage on mount
    useEffect(() => {
        if (isOpen && token) {
            fetchUsage()
        }
    }, [isOpen, token])

    const fetchUsage = async () => {
        try {
            const response = await fetch(`${API_URL}/ats/usage`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setUsage(data.usage)
            }
        } catch (error) {
            console.error('Usage fetch error:', error)
        }
    }

    const analyzeCV = async () => {
        // Check limit
        if (!isPremium && usage.remaining <= 0) {
            setShowUpgrade(true)
            return
        }

        setIsAnalyzing(true)
        setReport(null)

        try {
            const response = await fetch(`${API_URL}/ats/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    cvData,
                    sector: selectedSector
                })
            })

            if (response.ok) {
                const data = await response.json()
                setReport(data.analysis)
                if (data.usageInfo) {
                    setUsage(prev => ({
                        ...prev,
                        used: data.usageInfo.used,
                        remaining: isPremium ? 'unlimited' : Math.max(0, 3 - data.usageInfo.used)
                    }))
                }
            } else if (response.status === 403) {
                setShowUpgrade(true)
            } else {
                // Fallback to local analysis
                performLocalAnalysis()
            }
        } catch (error) {
            console.error('ATS API error:', error)
            performLocalAnalysis()
        }

        setIsAnalyzing(false)
    }

    // Local fallback analysis
    const performLocalAnalysis = () => {
        const scores = {}
        const suggestions = []

        // Contact Analysis
        const hasEmail = !!cvData?.personal?.email
        const hasPhone = !!cvData?.personal?.phone
        const hasLocation = !!cvData?.personal?.location
        const hasName = !!cvData?.personal?.fullName

        let contactScore = 0
        if (hasName) contactScore += 25
        if (hasEmail) contactScore += 25
        if (hasPhone) contactScore += 25
        if (hasLocation) contactScore += 25
        scores.contact = { score: contactScore }

        if (!hasEmail) suggestions.push({ category: 'contact', text: 'E-posta adresi ekleyin', priority: 'critical' })
        if (!hasPhone) suggestions.push({ category: 'contact', text: 'Telefon numarası ekleyin', priority: 'high' })

        // Summary Analysis
        const summary = cvData?.personal?.summary || cvData?.summary || ''
        const summaryLength = summary.length
        let summaryScore = summaryLength >= 150 ? 100 : summaryLength >= 100 ? 75 : summaryLength >= 50 ? 50 : 25
        scores.summary = { score: summaryScore }

        if (summaryLength < 100) {
            suggestions.push({ category: 'summary', text: 'Profesyonel özetinizi en az 100 karakter yapın', priority: 'high' })
        }

        // Experience
        const exp = cvData?.experience || []
        let expScore = exp.length >= 3 ? 100 : exp.length >= 2 ? 75 : exp.length >= 1 ? 50 : 0
        scores.experience = { score: expScore }

        if (exp.length === 0) {
            suggestions.push({ category: 'experience', text: 'En az bir iş deneyimi ekleyin', priority: 'critical' })
        }

        // Education
        const edu = cvData?.education || []
        scores.education = { score: edu.length >= 1 ? 100 : 0 }

        // Skills
        const skills = cvData?.skills || []
        let skillScore = skills.length >= 10 ? 100 : skills.length >= 5 ? 70 : skills.length >= 3 ? 50 : 25
        scores.skills = { score: skillScore }

        if (skills.length < 5) {
            suggestions.push({ category: 'skills', text: 'En az 5 teknik beceri ekleyin', priority: 'high' })
        }

        // Keywords (basic)
        scores.keywords = { score: 50, found: { critical: [], important: [], bonus: [] }, missing: { critical: [], important: [], bonus: [] } }

        // Formatting
        scores.formatting = { score: 80 }

        // Calculate total
        let total = 0
        Object.entries(ATS_CATEGORIES).forEach(([key, cat]) => {
            total += (scores[key]?.score || 0) * (cat.weight / 100)
        })

        setReport({
            totalScore: Math.round(total),
            grade: { letter: total >= 80 ? 'A' : total >= 60 ? 'B' : 'C', label: total >= 80 ? 'Çok İyi' : total >= 60 ? 'İyi' : 'Orta' },
            scores,
            suggestions,
            sector: 'Genel'
        })
    }

    const exportToPDF = async () => {
        setIsExporting(true)

        const printContent = `
            <html>
            <head>
                <title>ATS Raporu - ${cvName}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                    h1 { color: #0891b2; border-bottom: 2px solid #0891b2; padding-bottom: 10px; }
                    h2 { color: #475569; margin-top: 30px; }
                    .score-circle { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: white; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; margin: 20px auto; }
                    .grade { text-align: center; font-size: 24px; font-weight: bold; color: #059669; }
                    .category { padding: 15px; margin: 10px 0; background: #f8fafc; border-radius: 8px; }
                    .category-name { font-weight: bold; }
                    .category-score { float: right; color: #0891b2; }
                    .suggestion { padding: 10px 15px; margin: 5px 0; border-left: 4px solid; border-radius: 4px; }
                    .critical { border-color: #ef4444; background: #fef2f2; }
                    .high { border-color: #f59e0b; background: #fffbeb; }
                    .medium { border-color: #3b82f6; background: #eff6ff; }
                    .keyword-section { margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; }
                    .keyword { display: inline-block; padding: 4px 8px; margin: 2px; background: #e0f2fe; border-radius: 4px; font-size: 12px; }
                    .missing { background: #fee2e2; color: #dc2626; }
                    .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>📊 ATS Uyumluluk Raporu</h1>
                <p><strong>CV:</strong> ${cvName}</p>
                <p><strong>Sektör:</strong> ${report.sector}</p>
                <p><strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}</p>
                
                <div class="score-circle">${report.totalScore}</div>
                <div class="grade">${report.grade?.letter} - ${report.grade?.label}</div>
                <p style="text-align: center; color: #64748b;">Genel ATS Skoru (100 üzerinden)</p>
                
                <h2>📋 Kategori Puanları</h2>
                ${Object.entries(ATS_CATEGORIES).map(([key, cat]) => `
                    <div class="category">
                        <span class="category-name">${cat.name}</span>
                        <span class="category-score">${report.scores[key]?.score || 0}%</span>
                    </div>
                `).join('')}
                
                ${report.keywordAnalysis ? `
                    <h2>🔑 Anahtar Kelime Analizi</h2>
                    <div class="keyword-section">
                        <p><strong>Bulunan Kritik Kelimeler:</strong></p>
                        ${(report.keywordAnalysis.found?.critical || []).map(k => `<span class="keyword">${k}</span>`).join('')}
                        <p style="margin-top: 10px;"><strong>Eksik Kritik Kelimeler:</strong></p>
                        ${(report.keywordAnalysis.missing?.critical || []).map(k => `<span class="keyword missing">${k}</span>`).join('')}
                    </div>
                ` : ''}
                
                <h2>💡 İyileştirme Önerileri</h2>
                ${report.suggestions.map(s => `
                    <div class="suggestion ${s.priority}">
                        ${s.text}
                    </div>
                `).join('')}
                
                <div class="footer">
                    <p>Bu rapor CVniz tarafından oluşturulmuştur.</p>
                    <p>www.CVniz.com</p>
                </div>
            </body>
            </html>
        `

        const printWindow = window.open('', '_blank')
        printWindow.document.write(printContent)
        printWindow.document.close()
        printWindow.focus()

        setTimeout(() => {
            printWindow.print()
            setIsExporting(false)
        }, 500)
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-cyan-400'
        if (score >= 40) return 'text-amber-400'
        return 'text-red-400'
    }

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-500/20'
        if (score >= 60) return 'bg-cyan-500/20'
        if (score >= 40) return 'bg-amber-500/20'
        return 'bg-red-500/20'
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'critical': return <XCircle className="w-4 h-4 text-red-500" />
            case 'high': return <AlertTriangle className="w-4 h-4 text-amber-400" />
            case 'medium': return <AlertCircle className="w-4 h-4 text-blue-400" />
            default: return <CheckCircle className="w-4 h-4 text-green-400" />
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-3xl bg-slate-950/95 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 rounded-[2rem] overflow-hidden my-4" ref={reportRef}>
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">ATS & Skill Scorer</h2>
                                <p className="text-sm text-gray-400">{cvName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Usage indicator */}
                            {!isPremium && (
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">Kalan Hak</div>
                                    <div className="text-sm font-bold text-cyan-400">
                                        {usage.remaining === 'unlimited' ? '∞' : usage.remaining} / 3
                                    </div>
                                </div>
                            )}
                            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Upgrade Modal */}
                    {showUpgrade && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                                <Crown className="w-10 h-10 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Ücretsiz Tarama Hakkınız Doldu</h3>
                            <p className="text-gray-400 mb-6">
                                Sınırsız ATS tarama için Pro'ya yükseltin
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    to="/pricing"
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold flex items-center justify-center gap-2"
                                >
                                    <Crown className="w-5 h-5" />
                                    449₺ ile Sınırsız Tara
                                </Link>
                                <button
                                    onClick={() => setShowUpgrade(false)}
                                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                >
                                    Geri Dön
                                </button>
                            </div>
                        </div>
                    )}

                    {!report && !showUpgrade ? (
                        <div className="space-y-6">
                            {isAnalyzing ? (
                                <div className="text-center py-12">
                                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-spin" />
                                    <h3 className="text-lg font-bold mb-2">CV Analiz Ediliyor...</h3>
                                    <p className="text-gray-400">Sektörel anahtar kelimeler taranıyor</p>
                                </div>
                            ) : (
                                <>
                                    {/* Sector Selection */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-3">
                                            🎯 Hedef Sektör Seçin
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {SECTORS.map(sector => (
                                                <button
                                                    key={sector.id}
                                                    onClick={() => setSelectedSector(sector.id)}
                                                    className={`p-3 rounded-xl text-left transition-all ${selectedSector === sector.id
                                                        ? 'bg-cyan-500/20 border-2 border-cyan-500'
                                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{sector.icon}</div>
                                                    <div className="text-xs font-medium truncate">{sector.name}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Info Card */}
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                                        <div className="flex items-start gap-3">
                                            <BarChart3 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-bold text-white mb-1">ATS Nedir?</h4>
                                                <p className="text-sm text-gray-400">
                                                    Şirketlerin %90'ı CV'leri ATS (Applicant Tracking System) ile filtreler.
                                                    Sektörel anahtar kelimeler eksikse CV'niz görüşmeye dahi çağrılmaz.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analyze Button */}
                                    <div className="text-center">
                                        <button
                                            onClick={analyzeCV}
                                            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold flex items-center gap-3 mx-auto hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                                        >
                                            <Sparkles className="w-6 h-6" />
                                            Analizi Başlat
                                        </button>
                                        {!isPremium && (
                                            <p className="text-xs text-gray-500 mt-3">
                                                {usage.remaining} ücretsiz hak kaldı • Sınırsız için <Link to="/pricing" className="text-cyan-400 hover:underline">Pro</Link>
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : report && (
                        <div className="space-y-6">
                            {/* Score Display */}
                            <div className="flex items-center justify-center gap-8">
                                {/* Score Circle */}
                                <div className="relative w-36 h-36">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/10" />
                                        <circle cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray={402} strokeDashoffset={402 - (402 * report.totalScore) / 100} className={`${getScoreColor(report.totalScore)} transition-all duration-1000`} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-4xl font-black ${getScoreColor(report.totalScore)}`}>
                                            {report.totalScore}
                                        </span>
                                        <span className="text-xs text-gray-500">/ 100</span>
                                    </div>
                                </div>

                                {/* Grade */}
                                <div className="text-center">
                                    <div className={`text-6xl font-black ${getScoreColor(report.totalScore)}`}>
                                        {report.grade?.letter}
                                    </div>
                                    <div className="text-sm text-gray-400">{report.grade?.label}</div>
                                    <div className="text-xs text-gray-500 mt-2">Sektör: {report.sector}</div>
                                </div>
                            </div>

                            {/* Category Scores */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(ATS_CATEGORIES).map(([key, category]) => {
                                    const Icon = category.icon
                                    const score = report.scores[key]?.score || 0
                                    return (
                                        <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-8 h-8 rounded-lg ${getScoreBg(score)} flex items-center justify-center`}>
                                                    <Icon className={`w-4 h-4 ${getScoreColor(score)}`} />
                                                </div>
                                                <span className="text-sm font-medium">{category.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-cyan-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'} transition-all duration-500`} style={{ width: `${score}%` }} />
                                                </div>
                                                <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Keyword Analysis */}
                            {report.keywordAnalysis && (
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Tag className="w-5 h-5 text-cyan-400" />
                                        Anahtar Kelime Analizi
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Found */}
                                        <div>
                                            <div className="text-sm font-medium text-green-400 mb-2 flex items-center gap-1">
                                                <CheckCircle className="w-4 h-4" /> Bulunan ({report.keywordAnalysis.found?.critical?.length || 0} kritik)
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {report.keywordAnalysis.found?.critical?.map((k, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">{k}</span>
                                                ))}
                                                {report.keywordAnalysis.found?.important?.slice(0, 3).map((k, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Missing */}
                                        <div>
                                            <div className="text-sm font-medium text-red-400 mb-2 flex items-center gap-1">
                                                <XCircle className="w-4 h-4" /> Eksik ({report.keywordAnalysis.missing?.critical?.length || 0} kritik)
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {report.keywordAnalysis.missing?.critical?.slice(0, 5).map((k, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">{k}</span>
                                                ))}
                                                {report.keywordAnalysis.missing?.important?.slice(0, 3).map((k, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {report.suggestions?.length > 0 && (
                                <div>
                                    <h3 className="font-bold mb-3 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-400" />
                                        İyileştirme Önerileri ({report.suggestions.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {report.suggestions.slice(0, 8).map((suggestion, i) => (
                                            <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 ${suggestion.priority === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                                                suggestion.priority === 'high' ? 'bg-amber-500/10 border-amber-500/30' :
                                                    'bg-blue-500/10 border-blue-500/30'
                                                }`}>
                                                {getPriorityIcon(suggestion.priority)}
                                                <div>
                                                    <span className="text-sm">{suggestion.text}</span>
                                                    {suggestion.impact && (
                                                        <span className="ml-2 text-xs text-gray-500">+{suggestion.impact} puan</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {report.suggestions?.length === 0 && (
                                <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                                    <p className="text-green-400 font-bold">Harika! CV'niz ATS için optimize edilmiş durumda.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {report && !showUpgrade && (
                    <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between">
                        <button onClick={() => setReport(null)} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                            Yeniden Analiz
                        </button>
                        <button onClick={exportToPDF} disabled={isExporting} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold flex items-center gap-2 hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50">
                            {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
                            PDF İndir
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

