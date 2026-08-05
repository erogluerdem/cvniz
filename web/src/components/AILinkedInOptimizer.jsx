import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Sparkles, Linkedin, Copy, Check, RefreshCw,
    User, Briefcase, FileText, Award, Target, TrendingUp,
    ChevronRight, CheckCircle, AlertCircle, ArrowRight,
    Lightbulb, ExternalLink, Zap
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { aiAPI } from '../services/api'

// Optimizasyon kategorileri
const OPTIMIZATION_CATEGORIES = [
    { id: 'headline', label: 'Başlık (Headline)', icon: User, maxScore: 25 },
    { id: 'summary', label: 'Özet (About)', icon: FileText, maxScore: 25 },
    { id: 'experience', label: 'Deneyim', icon: Briefcase, maxScore: 20 },
    { id: 'skills', label: 'Yetenekler', icon: Award, maxScore: 15 },
    { id: 'keywords', label: 'Anahtar Kelimeler', icon: Target, maxScore: 15 }
]

// Örnek headline önerileri
const generateHeadline = (cv) => {
    const title = cv?.personalInfo?.title || 'Profesyonel'
    const skills = cv?.skills?.slice(0, 2).map(s => s.name).join(' & ') || 'Problem Çözme'
    
    return [
        `${title} | ${skills} Uzmanı | Değer Yaratan Çözümler`,
        `${title} 🚀 | İnovatif ${skills} Çözümleri | Sonuç Odaklı`,
        `${title} | ${skills} | Şirketlerin Büyümesine Yardımcı Oluyorum`,
        `Tutkulu ${title} | ${skills} Deneyimi | Açık Fırsatlara Açığım`
    ]
}

// Özet önerisi
const generateSummary = (cv) => {
    const name = cv?.personalInfo?.name?.split(' ')[0] || 'Profesyonel'
    const title = cv?.personalInfo?.title || 'uzman'
    const experience = cv?.experience?.length || 0
    const topSkills = cv?.skills?.slice(0, 3).map(s => s.name).join(', ') || 'problem çözme, iletişim'
    
    return `Merhaba, ben ${name}! 👋

${experience}+ yıllık ${title} deneyimimle, ${topSkills} alanlarında güçlü bir geçmişe sahibim.

🎯 Ne yapıyorum?
Şirketlerin dijital dönüşüm süreçlerinde karşılaştıkları zorlukları çözüyor, ölçeklenebilir ve sürdürülebilir çözümler sunuyorum.

💡 Neden ben?
• Sonuç odaklı yaklaşım
• Sürekli öğrenme tutkusu
• Takım çalışmasına yatkınlık

🤝 Bağlantı kuralım!
Yeni fırsatlar ve işbirlikleri için mesaj atmaktan çekinmeyin.

#${title.replace(/\s+/g, '')} #OpenToWork #Networking`
}

// Anahtar kelime önerileri
const generateKeywords = (cv) => {
    const baseKeywords = [
        'Problem Solving', 'Team Leadership', 'Agile', 'Scrum',
        'Project Management', 'Data-Driven', 'Innovation', 'Strategy'
    ]
    
    const skillKeywords = cv?.skills?.slice(0, 5).map(s => s.name) || []
    
    return [...skillKeywords, ...baseKeywords].slice(0, 12)
}

// Skor hesaplama
const calculateScore = (cv) => {
    let score = 0
    const details = {}
    
    // Headline kontrolü
    if (cv?.personalInfo?.title) {
        score += 15
        details.headline = { score: 15, max: 25, status: 'good', message: 'Başlık mevcut, ancak optimize edilebilir' }
    } else {
        details.headline = { score: 0, max: 25, status: 'bad', message: 'Başlık eksik' }
    }
    
    // Summary kontrolü
    if (cv?.personalInfo?.summary && cv.personalInfo.summary.length > 100) {
        score += 20
        details.summary = { score: 20, max: 25, status: 'good', message: 'Özet iyi, emojiler eklenebilir' }
    } else if (cv?.personalInfo?.summary) {
        score += 10
        details.summary = { score: 10, max: 25, status: 'medium', message: 'Özet çok kısa' }
    } else {
        details.summary = { score: 0, max: 25, status: 'bad', message: 'Özet eksik' }
    }
    
    // Experience kontrolü
    if (cv?.experience?.length >= 2) {
        score += 15
        details.experience = { score: 15, max: 20, status: 'good', message: 'Deneyimler mevcut' }
    } else if (cv?.experience?.length === 1) {
        score += 8
        details.experience = { score: 8, max: 20, status: 'medium', message: 'Daha fazla deneyim ekleyin' }
    } else {
        details.experience = { score: 0, max: 20, status: 'bad', message: 'Deneyim eksik' }
    }
    
    // Skills kontrolü
    if (cv?.skills?.length >= 5) {
        score += 15
        details.skills = { score: 15, max: 15, status: 'good', message: 'Yeterli yetenek eklendi' }
    } else if (cv?.skills?.length > 0) {
        score += 8
        details.skills = { score: 8, max: 15, status: 'medium', message: 'Daha fazla yetenek ekleyin' }
    } else {
        details.skills = { score: 0, max: 15, status: 'bad', message: 'Yetenek eksik' }
    }
    
    // Keywords
    score += 5
    details.keywords = { score: 5, max: 15, status: 'medium', message: 'Anahtar kelimeler optimize edilebilir' }
    
    return { score, maxScore: 100, details }
}

export default function AILinkedInOptimizer({ isOpen, onClose }) {
    const { isPremium } = useAuth()
    const { cvData } = useCV()
    const [activeTab, setActiveTab] = useState('score')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)
    const [selectedHeadline, setSelectedHeadline] = useState(null)
    const [copied, setCopied] = useState(null)
    const [generatedContent, setGeneratedContent] = useState({
        headlines: [],
        summary: '',
        keywords: []
    })

    const handleAnalyze = async () => {
        setIsAnalyzing(true)
        
        try {
            const response = await aiAPI.optimizeLinkedIn(cvData);
            if (response.success && response.data) {
                setAnalysisResult(response.data.score || calculateScore(cvData));
                setGeneratedContent({
                    headlines: response.data.content?.headlines || generateHeadline(cvData),
                    summary: response.data.content?.summary || generateSummary(cvData),
                    keywords: response.data.content?.keywords || generateKeywords(cvData)
                });
            } else {
                throw new Error("API returned no data");
            }
        } catch (error) {
            console.warn("LinkedIn Optimizer API failed, using fallback.", error);
            // Simüle analiz
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            const result = calculateScore(cvData)
            setAnalysisResult(result)
            
            setGeneratedContent({
                headlines: generateHeadline(cvData),
                summary: generateSummary(cvData),
                keywords: generateKeywords(cvData)
            })
        }
        
        setIsAnalyzing(false)
    }

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-500'
        if (score >= 50) return 'from-yellow-500 to-orange-500'
        return 'from-red-500 to-rose-500'
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'good': return 'text-green-400'
            case 'medium': return 'text-yellow-400'
            case 'bad': return 'text-red-400'
            default: return 'text-gray-400'
        }
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'good': return <CheckCircle size={16} className="text-green-400" />
            case 'medium': return <AlertCircle size={16} className="text-yellow-400" />
            case 'bad': return <X size={16} className="text-red-400" />
            default: return null
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                                    <Linkedin className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">LinkedIn Optimizer</h2>
                                    <p className="text-gray-400 text-sm">CV'nizden LinkedIn profilinizi optimize edin</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        {analysisResult && (
                            <div className="flex gap-2 mt-4">
                                {['score', 'headline', 'summary', 'keywords'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                            activeTab === tab
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                    >
                                        {tab === 'score' && 'Puan'}
                                        {tab === 'headline' && 'Başlık'}
                                        {tab === 'summary' && 'Özet'}
                                        {tab === 'keywords' && 'Kelimeler'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        {/* Initial State - Analyze Button */}
                        {!analysisResult && !isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center">
                                    <Linkedin size={48} className="text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">LinkedIn Profilinizi Optimize Edin</h3>
                                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                                    CV bilgilerinizi kullanarak LinkedIn profilinizi analiz edin ve 
                                    daha fazla işe alım yöneticisinin dikkatini çekin.
                                </p>
                                <button
                                    onClick={handleAnalyze}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl flex items-center justify-center gap-3 mx-auto hover:opacity-90 transition-opacity"
                                >
                                    <Sparkles size={20} />
                                    Analiz Et ve Optimize Et
                                </button>
                            </motion.div>
                        )}

                        {/* Analyzing State */}
                        {isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Analiz Ediliyor...</h3>
                                <p className="text-gray-400">CV'niz inceleniyor ve öneriler hazırlanıyor</p>
                            </motion.div>
                        )}

                        {/* Analysis Results */}
                        {analysisResult && (
                            <>
                                {/* Score Tab */}
                                {activeTab === 'score' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        {/* Score Circle */}
                                        <div className="text-center mb-8">
                                            <div className="relative w-40 h-40 mx-auto mb-4">
                                                <svg className="w-40 h-40 -rotate-90">
                                                    <circle
                                                        cx="80" cy="80" r="70"
                                                        className="fill-none stroke-gray-700"
                                                        strokeWidth="12"
                                                    />
                                                    <circle
                                                        cx="80" cy="80" r="70"
                                                        className={`fill-none stroke-current ${
                                                            analysisResult.score >= 80 ? 'text-green-500' :
                                                            analysisResult.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                                                        }`}
                                                        strokeWidth="12"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${(analysisResult.score / 100) * 440} 440`}
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-4xl font-bold text-white">{analysisResult.score}</span>
                                                    <span className="text-gray-400 text-sm">/ 100</span>
                                                </div>
                                            </div>
                                            <p className={`font-semibold ${
                                                analysisResult.score >= 80 ? 'text-green-400' :
                                                analysisResult.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                                            }`}>
                                                {analysisResult.score >= 80 ? 'Mükemmel!' :
                                                 analysisResult.score >= 50 ? 'İyi, ama geliştirilebilir' : 'Optimizasyon gerekli'}
                                            </p>
                                        </div>

                                        {/* Category Breakdown */}
                                        <div className="space-y-3">
                                            {Object.entries(analysisResult.details).map(([key, detail]) => (
                                                <div key={key} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            {getStatusIcon(detail.status)}
                                                            <span className="text-white font-medium capitalize">{key}</span>
                                                        </div>
                                                        <span className={getStatusColor(detail.status)}>
                                                            {detail.score}/{detail.max}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full transition-all ${
                                                                detail.status === 'good' ? 'bg-green-500' :
                                                                detail.status === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                            style={{ width: `${(detail.score / detail.max) * 100}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-gray-400 text-sm mt-2">{detail.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Headline Tab */}
                                {activeTab === 'headline' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h3 className="text-lg font-semibold text-white mb-4">LinkedIn Başlık Önerileri</h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Dikkat çekici bir başlık ile daha fazla profil ziyareti alın
                                        </p>

                                        <div className="space-y-3">
                                            {generatedContent.headlines.map((headline, i) => (
                                                <div 
                                                    key={i}
                                                    className={`bg-gray-800/50 rounded-xl p-4 border transition-all cursor-pointer ${
                                                        selectedHeadline === i
                                                            ? 'border-blue-500 bg-blue-500/10'
                                                            : 'border-gray-700 hover:border-gray-600'
                                                    }`}
                                                    onClick={() => setSelectedHeadline(i)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-white">{headline}</p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleCopy(headline, `headline-${i}`)
                                                            }}
                                                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                                        >
                                                            {copied === `headline-${i}` 
                                                                ? <Check size={18} className="text-green-400" />
                                                                : <Copy size={18} className="text-gray-400" />
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <Lightbulb className="text-blue-400 mt-0.5" size={20} />
                                                <div>
                                                    <p className="text-blue-300 font-medium text-sm">Başlık İpuçları</p>
                                                    <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                                        <li>• 120 karakter sınırını aşmayın</li>
                                                        <li>• Emojiler dikkat çeker ama abartmayın</li>
                                                        <li>• Değer önerinizi net belirtin</li>
                                                        <li>• Anahtar kelimeleri dahil edin</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Summary Tab */}
                                {activeTab === 'summary' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-white">LinkedIn Özet (About)</h3>
                                            <button
                                                onClick={() => handleCopy(generatedContent.summary, 'summary')}
                                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                {copied === 'summary' 
                                                    ? <><Check size={18} className="text-green-400" /> Kopyalandı</>
                                                    : <><Copy size={18} className="text-gray-400" /> Kopyala</>
                                                }
                                            </button>
                                        </div>

                                        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 mb-6">
                                            <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                                {generatedContent.summary}
                                            </pre>
                                        </div>

                                        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <Lightbulb className="text-blue-400 mt-0.5" size={20} />
                                                <div>
                                                    <p className="text-blue-300 font-medium text-sm">Özet İpuçları</p>
                                                    <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                                        <li>• İlk 3 satır görünür, etkileyici olsun</li>
                                                        <li>• Kişisel bir dokunuş ekleyin</li>
                                                        <li>• Call-to-action ile bitirin</li>
                                                        <li>• Hashtag'leri akıllıca kullanın</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Keywords Tab */}
                                {activeTab === 'keywords' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <h3 className="text-lg font-semibold text-white mb-4">Anahtar Kelime Önerileri</h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Bu kelimeleri profilinize dahil ederek aramalarda üst sıralarda çıkın
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {generatedContent.keywords.map((keyword, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleCopy(keyword, `keyword-${i}`)}
                                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-white text-sm transition-all flex items-center gap-2 group"
                                                >
                                                    {keyword}
                                                    {copied === `keyword-${i}` 
                                                        ? <Check size={14} className="text-green-400" />
                                                        : <Copy size={14} className="text-gray-500 group-hover:text-gray-300" />
                                                    }
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handleCopy(generatedContent.keywords.join(', '), 'all-keywords')}
                                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                                        >
                                            {copied === 'all-keywords' 
                                                ? <><Check size={18} /> Tümü Kopyalandı</>
                                                : <><Copy size={18} /> Tümünü Kopyala</>
                                            }
                                        </button>

                                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <Lightbulb className="text-blue-400 mt-0.5" size={20} />
                                                <div>
                                                    <p className="text-blue-300 font-medium text-sm">Nerede Kullanmalı?</p>
                                                    <ul className="text-gray-400 text-sm mt-2 space-y-1">
                                                        <li>• Headline (Başlık)</li>
                                                        <li>• About (Özet) bölümü</li>
                                                        <li>• Experience açıklamaları</li>
                                                        <li>• Skills (Yetenekler) bölümü</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer with LinkedIn Link */}
                    <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4">
                        <a
                            href="https://www.linkedin.com/in/edit/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                        >
                            <Linkedin size={20} />
                            LinkedIn Profilimi Düzenle
                            <ExternalLink size={16} />
                        </a>
                    </div>

                    {/* Premium Badge */}
                    {!isPremium && (
                        <div className="absolute top-4 right-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PRO
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
