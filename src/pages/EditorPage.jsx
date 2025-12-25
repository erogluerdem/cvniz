import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
    ArrowLeft, Download, Eye, Printer, ChevronLeft, ChevronRight, Save, LogIn


} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import CVForm from '../components/CVForm'
import CVPreview from '../components/CVPreview'
import { sampleCVData, emptyCV } from '../data/sampleData'
import { exportToPDF, printCV } from '../utils/pdfExport'

const templates = [
    { id: 'modern', name: 'Modern', isPremium: false, emoji: '🎨' },
    { id: 'minimalist', name: 'Minimalist', isPremium: true, emoji: '⚡' },
    { id: 'corporate', name: 'Kurumsal', isPremium: true, emoji: '🏢' },
    { id: 'creative', name: 'Yaratıcı', isPremium: true, emoji: '🌈' },
    { id: 'tech', name: 'Teknoloji', isPremium: true, emoji: '💻' },
    { id: 'executive', name: 'Yönetici', isPremium: true, emoji: '👔' },
    { id: 'elegant', name: 'Zarif', isPremium: true, emoji: '✨' },
    { id: 'healthcare', name: 'Sağlık', isPremium: true, emoji: '🏥' },
    { id: 'academic', name: 'Akademik', isPremium: true, emoji: '📚' },
    { id: 'finance', name: 'Finans', isPremium: true, emoji: '💰' },
    { id: 'legal', name: 'Hukuk', isPremium: true, emoji: '⚖️' },
    { id: 'marketing', name: 'Pazarlama', isPremium: true, emoji: '📢' },
    { id: 'engineer', name: 'Mühendis', isPremium: true, emoji: '⚙️' },
    { id: 'retail', name: 'Satış', isPremium: true, emoji: '🛍️' },
    { id: 'hospitality', name: 'Turizm', isPremium: true, emoji: '🏨' },
    { id: 'government', name: 'Kamu', isPremium: true, emoji: '🏛️' },
    { id: 'freelancer', name: 'Freelancer', isPremium: true, emoji: '💼' },
    { id: 'startup', name: 'Startup', isPremium: true, emoji: '🚀' },
    { id: 'international', name: 'Uluslararası', isPremium: true, emoji: '🌍' },
    { id: 'portfolio', name: 'Portfolyo', isPremium: true, emoji: '🖼️' },
    // New 20 templates
    { id: 'scientist', name: 'Bilim İnsanı', isPremium: true, emoji: '🔬' },
    { id: 'artist', name: 'Sanatçı', isPremium: true, emoji: '🎨' },
    { id: 'teacher', name: 'Öğretmen', isPremium: true, emoji: '📖' },
    { id: 'chef', name: 'Şef', isPremium: true, emoji: '👨‍🍳' },
    { id: 'photographer', name: 'Fotoğrafçı', isPremium: true, emoji: '📷' },
    { id: 'musician', name: 'Müzisyen', isPremium: true, emoji: '🎵' },
    { id: 'athlet', name: 'Sporcu', isPremium: true, emoji: '🏆' },
    { id: 'pilot', name: 'Pilot', isPremium: true, emoji: '✈️' },
    { id: 'construction', name: 'İnşaat', isPremium: true, emoji: '🏗️' },
    { id: 'environment', name: 'Çevre', isPremium: true, emoji: '🌱' },
    { id: 'journalist', name: 'Gazeteci', isPremium: true, emoji: '📰' },
    { id: 'nurse', name: 'Hemşire', isPremium: true, emoji: '💉' },
    { id: 'logistics', name: 'Lojistik', isPremium: true, emoji: '🚚' },
    { id: 'security', name: 'Güvenlik', isPremium: true, emoji: '🛡️' },
    { id: 'architect', name: 'Mimar', isPremium: true, emoji: '🏛️' },
    { id: 'hr', name: 'İnsan Kaynakları', isPremium: true, emoji: '👥' },
    { id: 'datascience', name: 'Veri Bilimi', isPremium: true, emoji: '📊' },
    { id: 'gamer', name: 'E-Spor', isPremium: true, emoji: '🎮' },
    { id: 'consultant', name: 'Danışman', isPremium: true, emoji: '💡' },
    { id: 'beauty', name: 'Güzellik', isPremium: true, emoji: '💅' }
]

export default function EditorPage() {
    const { cvId } = useParams()
    const navigate = useNavigate()
    const { user, isPremium } = useAuth()
    const { cvs, saveCV, updateCV } = useCV()

    const [cvData, setCvData] = useState(emptyCV)
    const [selectedTemplate, setSelectedTemplate] = useState('modern')
    const [cvName, setCvName] = useState('Yeni CV')
    const [showPreview, setShowPreview] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        if (cvId && cvs.length > 0) {
            const existingCV = cvs.find(c => c.id === cvId)
            if (existingCV) {
                setCvData(existingCV.data)
                setSelectedTemplate(existingCV.template)
                setCvName(existingCV.name)
            }
        }
    }, [cvId, cvs])

    const currentTemplate = templates.find(t => t.id === selectedTemplate)
    const needsPayment = currentTemplate?.isPremium && !isPremium

    const handleExportPDF = async () => {
        if (needsPayment) {
            setShowPaymentModal(true)
            return
        }

        setIsExporting(true)
        try {
            await exportToPDF('cv-preview', `${cvData.personal.fullName || 'cv'}.pdf`, isPremium)
        } catch (error) {
            console.error('Export failed:', error)
        }
        setIsExporting(false)
    }

    const handleSave = () => {
        if (!user) {
            setShowSaveModal(true)
            return
        }

        let result
        if (cvId) {
            result = updateCV(cvId, { data: cvData, template: selectedTemplate, name: cvName })
        } else {
            result = saveCV(cvData, selectedTemplate, cvName)
        }

        if (result.success) {
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
            if (!cvId && result.cv) {
                navigate(`/editor/${result.cv.id}`, { replace: true })
            }
        }
    }

    const handleLoadSample = () => {
        setCvData(sampleCVData)
    }

    const handleClearAll = () => {
        setCvData(emptyCV)
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(user ? '/dashboard' : '/')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Geri</span>
                        </button>
                        <div className="h-6 w-px bg-white/20"></div>
                        <input
                            type="text"
                            value={cvName}
                            onChange={(e) => setCvName(e.target.value)}
                            className="bg-transparent border-none text-white font-semibold focus:outline-none max-w-[150px]"
                        />
                    </div>

                    {/* Template Selector */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const currentIndex = templates.findIndex(t => t.id === selectedTemplate)
                                const prevIndex = (currentIndex - 1 + templates.length) % templates.length
                                setSelectedTemplate(templates[prevIndex].id)
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card">
                            <span className="text-lg">{currentTemplate?.emoji}</span>
                            <span className="text-sm hidden sm:block">{currentTemplate?.name}</span>
                            {currentTemplate?.isPremium && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
                                    PRO
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                const currentIndex = templates.findIndex(t => t.id === selectedTemplate)
                                const nextIndex = (currentIndex + 1) % templates.length
                                setSelectedTemplate(templates[nextIndex].id)
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            className={`p-2 rounded-lg transition-colors hidden sm:flex items-center gap-2 ${saveSuccess ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10'
                                }`}
                            title="Kaydet"
                        >
                            <Save className="w-5 h-5" />
                            {saveSuccess && <span className="text-sm">Kaydedildi!</span>}
                        </button>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => printCV('cv-preview')}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:flex"
                        >
                            <Printer className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="btn-premium text-sm flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {isExporting ? 'İşleniyor...' : 'PDF'}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-20 pb-8 px-4">
                <div className="max-w-[1800px] mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Side - Form */}
                        <div className={`lg:w-[45%] ${!showPreview ? 'w-full' : 'hidden lg:block'}`}>
                            <div className="glass-card rounded-2xl p-6 sticky top-24">
                                <div className="flex gap-2 mb-6">
                                    <button
                                        onClick={handleLoadSample}
                                        className="flex-1 py-2 px-4 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition-colors"
                                    >
                                        Örnek Yükle
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="flex-1 py-2 px-4 rounded-lg border border-white/20 text-sm hover:bg-white/10 transition-colors"
                                    >
                                        Temizle
                                    </button>
                                </div>
                                <CVForm cvData={cvData} setCvData={setCvData} />
                            </div>
                        </div>

                        {/* Right Side - Preview */}
                        <div className={`lg:w-[55%] ${showPreview ? 'w-full' : 'hidden lg:block'}`}>
                            <div className="sticky top-24">
                                <CVPreview
                                    cvData={cvData}
                                    template={selectedTemplate}
                                    showWatermark={!isPremium && currentTemplate?.isPremium}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Preview Toggle */}
            <button
                onClick={() => setShowPreview(!showPreview)}
                className="fixed bottom-6 right-6 lg:hidden btn-premium rounded-full p-4 shadow-2xl"
            >
                <Eye className="w-6 h-6" />
            </button>

            {/* Save Modal - Not logged in */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-8 max-w-md w-full">
                        <LogIn className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-center mb-2">Kaydetmek için Giriş Yapın</h3>
                        <p className="text-gray-400 text-center mb-6">
                            CV'nizi kaydetmek ve daha sonra erişmek için hesabınıza giriş yapın.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <Link
                                to="/login"
                                className="flex-1 py-3 rounded-xl btn-premium text-center"
                            >
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-8 max-w-md w-full animate-slide-up">
                        <h3 className="text-2xl font-bold mb-4 gradient-text">Premium Şablonu Aç</h3>
                        <p className="text-gray-400 mb-6">
                            Bu şablonu kullanmak için Pro sürüme yükseltin.
                        </p>

                        <div className="glass rounded-xl p-6 mb-6">
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold gradient-text">29₺</span>
                                <span className="text-gray-400">tek seferlik</span>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>✓ Tüm 40 Premium Şablon</li>
                                <li>✓ Watermark'sız PDF</li>
                                <li>✓ Sınırsız Düzenleme</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <Link to="/pricing" className="flex-1 btn-premium text-center py-3 rounded-xl">
                                Satın Al
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
