import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
    X, FileText, Download, Sparkles, CheckCircle, AlertTriangle, XCircle,
    User, Briefcase, GraduationCap, Wrench, Mail, Phone, MapPin,
    TrendingUp, Target, Award, Loader2, FileDown, Crown, Lock,
    Tag, BarChart3, Zap, AlertCircle, ChevronRight, RotateCcw
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

export default function ATSReportModal({ isOpen, onClose, cvData, cvName, isPremium }) {
    const { token } = useAuth()
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

        setTimeout(() => setIsAnalyzing(false), 1500) // Give time for spin animation
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
        scores.keywords = { score: 50, found: { critical: ['React', 'JavaScript'], important: ['HTML'], bonus: [] }, missing: { critical: ['Node.js'], important: ['TypeScript'], bonus: [] } }

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
            sector: 'Genel',
            keywordAnalysis: scores.keywords // Ensure mock keyword analysis is passed
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
                    h1 { color: #10B981; border-bottom: 2px solid #10B981; padding-bottom: 10px; }
                    h2 { color: #475569; margin-top: 30px; }
                    .score-circle { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #10B981, #059669); color: white; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; margin: 20px auto; }
                    .grade { text-align: center; font-size: 24px; font-weight: bold; color: #059669; }
                    .category { padding: 15px; margin: 10px 0; background: #f8fafc; border-radius: 8px; }
                    .category-name { font-weight: bold; }
                    .category-score { float: right; color: #10B981; }
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
        if (score >= 80) return 'text-[#10B981]' // Neon Green
        if (score >= 60) return 'text-cyan-400'
        if (score >= 40) return 'text-amber-400'
        return 'text-red-400'
    }

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-[#10B981]'
        if (score >= 60) return 'bg-cyan-500'
        if (score >= 40) return 'bg-amber-500'
        return 'bg-red-500'
    }
    
    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-[#10B981] to-[#059669]'
        if (score >= 60) return 'from-cyan-400 to-blue-500'
        if (score >= 40) return 'from-amber-400 to-orange-500'
        return 'from-red-400 to-red-600'
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'critical': return <XCircle className="w-5 h-5 text-red-500" />
            case 'high': return <AlertTriangle className="w-5 h-5 text-amber-500" />
            case 'medium': return <AlertCircle className="w-5 h-5 text-blue-500" />
            default: return <CheckCircle className="w-5 h-5 text-[#10B981]" />
        }
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
                    ref={reportRef}
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent gap-4 relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Target className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    ATS & Skill Scorer <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                </h2>
                                <p className="text-sm text-gray-400">{cvName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 z-10">
                            {/* Usage indicator */}
                            {!isPremium && (
                                <div className="text-right bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">Kalan Hak</div>
                                    <div className="text-sm font-black text-[#10B981]">
                                        {usage.remaining === 'unlimited' ? '∞' : usage.remaining} / 3
                                    </div>
                                </div>
                            )}
                            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            
                            {/* Upgrade Modal */}
                            {showUpgrade && (
                                <motion.div 
                                    key="upgrade"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="text-center py-12 max-w-lg mx-auto"
                                >
                                    <div className="relative mb-6">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto relative z-10 shadow-[0_0_40px_rgba(251,191,36,0.4)] border-4 border-[#0F1115]">
                                            <Crown className="w-12 h-12 text-black" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-3">Ücretsiz Tarama Hakkınız Doldu</h3>
                                    <p className="text-lg text-gray-400 font-medium mb-8">
                                        Sınırsız ATS tarama ve yapay zeka analizleri için hesabınızı Pro'ya yükseltin.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={() => setShowUpgrade(false)}
                                            className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5"
                                        >
                                            Geri Dön
                                        </button>
                                        <Link
                                            to="/pricing"
                                            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all"
                                        >
                                            <Crown className="w-5 h-5" />
                                            Sınırsız Tara (Pro)
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {!report && !showUpgrade && (
                                <motion.div 
                                    key="analyze"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8 max-w-3xl mx-auto"
                                >
                                    {isAnalyzing ? (
                                        <div className="text-center py-20 flex flex-col items-center justify-center">
                                            <div className="relative mb-8">
                                                <div className="w-24 h-24 rounded-full border-4 border-[#10B981]/20 border-t-[#10B981] animate-spin"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Target className="w-8 h-8 text-[#10B981]" />
                                                </div>
                                            </div>
                                            <h3 className="text-3xl font-black text-white mb-4">ATS Uyumluluğu Ölçülüyor...</h3>
                                            <p className="text-lg text-gray-400 font-medium">Sektörel anahtar kelimeler ve format yapısı analiz ediliyor.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Sector Selection */}
                                            <div className="bg-black/20 border border-white/5 rounded-3xl p-6 md:p-8">
                                                <label className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                                                    <Target className="w-6 h-6 text-[#10B981]" /> Hedef Sektör Seçin
                                                </label>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {SECTORS.map(sector => (
                                                        <button
                                                            key={sector.id}
                                                            onClick={() => setSelectedSector(sector.id)}
                                                            className={`p-4 rounded-2xl text-center transition-all relative overflow-hidden group ${selectedSector === sector.id
                                                                ? 'bg-[#10B981]/20 border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                                                : 'bg-white/5 border border-transparent hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <div className="text-3xl mb-2 drop-shadow-md">{sector.icon}</div>
                                                            <div className={`text-sm font-bold truncate ${selectedSector === sector.id ? 'text-[#10B981]' : 'text-gray-300'}`}>{sector.name}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Info Card */}
                                            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#10B981]/10 to-transparent border border-[#10B981]/20 relative overflow-hidden">
                                                <div className="absolute right-0 top-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                                <div className="flex items-start gap-4 relative z-10">
                                                    <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 border border-[#10B981]/30">
                                                        <BarChart3 className="w-6 h-6 text-[#10B981]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white mb-2">ATS Nedir?</h4>
                                                        <p className="text-gray-400 font-medium leading-relaxed">
                                                            Şirketlerin <strong>%90'ı</strong> CV'leri ATS (Applicant Tracking System) ile otomatik filtreler.
                                                            Sektörel anahtar kelimeleriniz eksik veya CV formatınız hatalıysa, özgeçmişiniz insan kaynakları uzmanına ulaşmadan sistem tarafından elenebilir.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Analyze Button */}
                                            <div className="flex flex-col items-center justify-center pt-4">
                                                <button
                                                    onClick={analyzeCV}
                                                    className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#10B981] text-black font-black text-xl flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] group"
                                                >
                                                    <Sparkles className="w-6 h-6" />
                                                    Analizi Başlat
                                                </button>
                                                {!isPremium && (
                                                    <p className="text-sm font-bold text-gray-500 mt-4 flex items-center gap-2">
                                                        <span className="text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">{usage.remaining}</span> ücretsiz hak kaldı • Sınırsız için <Link to="/pricing" className="text-[#10B981] hover:underline underline-offset-4 decoration-[#10B981]/50">Pro'ya Yükselt</Link>
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}
                            
                            {/* Report Result */}
                            {report && !showUpgrade && (
                                <motion.div 
                                    key="report"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-8"
                                >
                                    {/* Score Header */}
                                    <div className="relative p-8 rounded-3xl border bg-black/40 border-white/5 overflow-hidden flex flex-col md:flex-row items-center gap-8 justify-center lg:justify-start">
                                        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 ${getScoreBg(report.totalScore)}`}></div>
                                        
                                        {/* Circular Score */}
                                        <div className="relative w-48 h-48 flex-shrink-0">
                                            <svg className="w-full h-full -rotate-90 drop-shadow-xl">
                                                <circle cx="96" cy="96" r="84" fill="none" stroke="currentColor" strokeWidth="16" className="text-white/5" />
                                                <motion.circle 
                                                    cx="96" cy="96" r="84" 
                                                    fill="none" stroke="currentColor" strokeWidth="16" 
                                                    strokeDasharray={527.7} 
                                                    initial={{ strokeDashoffset: 527.7 }}
                                                    animate={{ strokeDashoffset: 527.7 - (527.7 * report.totalScore) / 100 }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    className={`${getScoreColor(report.totalScore)}`} 
                                                    strokeLinecap="round" 
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className={`text-6xl font-black drop-shadow-md ${getScoreColor(report.totalScore)}`}>
                                                    {report.totalScore}
                                                </span>
                                                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">/ 100</span>
                                            </div>
                                        </div>

                                        {/* Grade Info */}
                                        <div className="text-center md:text-left relative z-10 flex-1">
                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-2">
                                                <Target className="w-4 h-4 text-[#10B981]" /> Hedef Sektör: {report.sector}
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                                <div className={`text-7xl font-black ${getScoreColor(report.totalScore)} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                                                    {report.grade?.letter}
                                                </div>
                                                <div className={`px-4 py-2 rounded-xl text-xl font-bold border ${getScoreBg(report.totalScore)} ${getScoreColor(report.totalScore).replace('text-', 'border-').replace('400', '500/30')}`}>
                                                    {report.grade?.label}
                                                </div>
                                            </div>
                                            <p className="text-gray-400 font-medium">ATS uyumluluk dereceniz ve mülakata çağrılma potansiyeliniz.</p>
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 space-y-6">
                                            {/* Category Scores */}
                                            <div className="bg-black/20 rounded-3xl p-6 border border-white/5">
                                                <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                                                    <BarChart3 className="w-5 h-5 text-[#10B981]" /> Kategori Kırılımı
                                                </h3>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {Object.entries(ATS_CATEGORIES).map(([key, category]) => {
                                                        const Icon = category.icon
                                                        const score = report.scores[key]?.score || 0
                                                        return (
                                                            <div key={key} className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-10 h-10 rounded-xl bg-black/60 border border-white/5 flex items-center justify-center`}>
                                                                            <Icon className={`w-5 h-5 ${getScoreColor(score)}`} />
                                                                        </div>
                                                                        <span className="font-bold text-white text-sm">{category.name}</span>
                                                                    </div>
                                                                    <span className={`text-lg font-black ${getScoreColor(score)}`}>{score}%</span>
                                                                </div>
                                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                                                                    <motion.div 
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${score}%` }}
                                                                        transition={{ duration: 1, delay: 0.5 }}
                                                                        className={`h-full bg-gradient-to-r ${getScoreGradient(score)}`} 
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Keyword Analysis */}
                                            {report.keywordAnalysis && (
                                                <div className="bg-black/20 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                                                    <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2 relative z-10">
                                                        <Tag className="w-5 h-5 text-cyan-400" /> Sektörel Anahtar Kelimeler
                                                    </h3>
                                                    
                                                    <div className={`grid sm:grid-cols-2 gap-4 ${!isPremium ? 'blur-sm select-none opacity-50' : ''}`}>
                                                        {/* Found */}
                                                        <div className="p-5 rounded-2xl bg-black/40 border border-[#10B981]/20">
                                                            <div className="text-sm font-bold text-[#10B981] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                                                                <CheckCircle className="w-4 h-4" /> Bulunan Kelimeler
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {report.keywordAnalysis.found?.critical?.map((k, i) => (
                                                                    <span key={i} className="px-3 py-1.5 bg-[#10B981]/10 text-[#10B981] font-bold text-xs rounded-xl border border-[#10B981]/20">{k}</span>
                                                                ))}
                                                                {report.keywordAnalysis.found?.important?.slice(0, 3).map((k, i) => (
                                                                    <span key={i} className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 font-bold text-xs rounded-xl border border-cyan-500/20">{k}</span>
                                                                ))}
                                                                {(report.keywordAnalysis.found?.critical?.length === 0 && report.keywordAnalysis.found?.important?.length === 0) && (
                                                                    <span className="text-gray-500 text-sm font-medium">Kritik kelime bulunamadı.</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Missing */}
                                                        <div className="p-5 rounded-2xl bg-black/40 border border-red-500/20">
                                                            <div className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                                                                <XCircle className="w-4 h-4" /> Eksik Kelimeler
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {report.keywordAnalysis.missing?.critical?.slice(0, 5).map((k, i) => (
                                                                    <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 font-bold text-xs rounded-xl border border-red-500/20">{k}</span>
                                                                ))}
                                                                {report.keywordAnalysis.missing?.important?.slice(0, 3).map((k, i) => (
                                                                    <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/20">{k}</span>
                                                                ))}
                                                                 {(report.keywordAnalysis.missing?.critical?.length === 0 && report.keywordAnalysis.missing?.important?.length === 0) && (
                                                                    <span className="text-[#10B981] text-sm font-medium">Eksik kritik kelime yok.</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {!isPremium && (
                                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                            <Lock className="w-8 h-8 text-amber-500 mb-2" />
                                                            <div className="text-white font-bold text-lg mb-1">Premium Özellik</div>
                                                            <p className="text-gray-300 text-sm px-4 text-center">Anahtar kelime analizini görmek için Pro'ya geçin.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Suggestions Sidebar */}
                                        <div className="space-y-4">
                                            {report.suggestions?.length > 0 ? (
                                                <div className="bg-amber-500/5 rounded-3xl p-6 border border-amber-500/10 h-full flex flex-col relative overflow-hidden">
                                                    <h3 className="font-bold text-xl text-amber-500 mb-6 flex items-center gap-2 relative z-10">
                                                        <Sparkles className="w-5 h-5 fill-current" />
                                                        İyileştirme Önerileri
                                                    </h3>
                                                    <div className={`space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent ${!isPremium ? 'blur-sm select-none opacity-50' : ''}`}>
                                                        {report.suggestions.map((suggestion, i) => (
                                                            <div key={i} className={`p-4 rounded-2xl border flex items-start gap-3 bg-black/40 ${suggestion.priority === 'critical' ? 'border-red-500/30' :
                                                                suggestion.priority === 'high' ? 'border-amber-500/30' :
                                                                    'border-blue-500/30'
                                                                }`}>
                                                                <div className="mt-0.5">{getPriorityIcon(suggestion.priority)}</div>
                                                                <div>
                                                                    <div className="text-sm text-gray-200 font-medium leading-relaxed">{suggestion.text}</div>
                                                                    {suggestion.impact && (
                                                                        <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400">
                                                                            Etki: +{suggestion.impact} Puan
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    
                                                    {!isPremium && (
                                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                                            <Lock className="w-8 h-8 text-amber-500 mb-2" />
                                                            <div className="text-white font-bold text-lg mb-1">Premium Özellik</div>
                                                            <p className="text-gray-300 text-sm px-4 text-center">Önerileri görmek için Pro'ya geçin.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="bg-[#10B981]/10 rounded-3xl p-8 border border-[#10B981]/20 h-full flex flex-col items-center justify-center text-center">
                                                    <div className="w-20 h-20 bg-[#10B981]/20 rounded-full flex items-center justify-center mb-4">
                                                        <CheckCircle className="w-10 h-10 text-[#10B981]" />
                                                    </div>
                                                    <h3 className="text-xl font-black text-[#10B981] mb-2">Kusursuz!</h3>
                                                    <p className="text-sm font-medium text-gray-300">CV'niz hedef sektörünüzdeki ATS filtreleri için harika bir şekilde optimize edilmiş durumda.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-white/5">
                                        <button onClick={() => setReport(null)} className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5 flex items-center justify-center gap-2">
                                            <RotateCcw className="w-5 h-5" /> Yeniden Analiz
                                        </button>
                                        <button onClick={exportToPDF} disabled={isExporting} className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50">
                                            {isExporting ? (
                                                <><Loader2 className="w-5 h-5 animate-spin" /> İndiriliyor...</>
                                            ) : (
                                                <><FileDown className="w-5 h-5" /> PDF Raporu İndir</>
                                            )}
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
