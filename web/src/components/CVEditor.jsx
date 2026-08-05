import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Eye, Printer, ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import CVForm from './CVForm'
import CVPreview from './CVPreview'
import { sampleCVData, emptyCV } from '../data/sampleData'
import { exportToPDF, printCV } from '../utils/pdfExport'
import toast from 'react-hot-toast'

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
    { id: 'portfolio', name: 'Portfolyo', isPremium: true, emoji: '🖼️' }
]

export default function CVEditor({ selectedTemplate, setSelectedTemplate, onBackToHome }) {
    const [cvData, setCvData] = useState(sampleCVData)
    const [showPreview, setShowPreview] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [isPremiumUser, setIsPremiumUser] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [zoom, setZoom] = useState(100)

    const currentTemplate = templates.find(t => t.id === selectedTemplate)
    const needsPayment = currentTemplate?.isPremium && !isPremiumUser

    const handleExportPDF = async () => {
        if (needsPayment) {
            setShowPaymentModal(true)
            return
        }

        setIsExporting(true)
        try {
            await exportToPDF('cv-preview', `${cvData.personal.fullName || 'cv'}.pdf`, isPremiumUser)
            toast.success("PDF başarıyla indirildi!")
        } catch (error) {
            console.error('Export failed:', error)
            toast.error("PDF oluşturulurken bir hata oluştu.")
        }
        setIsExporting(false)
    }

    const handlePrint = () => {
        printCV('cv-preview')
        toast.success("Yazdırma penceresi açıldı.")
    }

    const handleLoadSample = () => {
        setCvData(sampleCVData)
    }

    const handleClearAll = () => {
        setCvData(emptyCV)
    }

    const handleUnlockPremium = () => {
        // In production, this would open a payment flow
        setIsPremiumUser(true)
        setShowPaymentModal(false)
        toast.success('Premium şablonların kilidi açıldı! (Demo)')
    }

    return (
        <div className={`min-h-screen ${isFullscreen ? 'bg-slate-950/95 fixed inset-0 z-[100] overflow-hidden' : ''}`}>
            {/* Header */}
            {!isFullscreen && (
                <header className="fixed top-0 left-0 right-0 z-50 glass">
                    <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBackToHome}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">Geri</span>
                            </button>
                            <div className="h-6 w-px bg-white/20"></div>
                            <h1 className="font-semibold gradient-text">CV Editör</h1>
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
                                <span className="text-sm">{currentTemplate?.name}</span>
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
                                onClick={() => setShowPreview(!showPreview)}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors md:hidden"
                                title="Önizleme"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors hidden sm:flex"
                                title="Yazdır"
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
                                    {isExporting ? 'İşleniyor...' : 'PDF İndir'}
                                </span>
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <div className={`${isFullscreen ? 'h-full p-4 flex flex-col' : 'pt-20 pb-8 px-4'}`}>
                <div className={`${isFullscreen ? 'flex-1 overflow-hidden flex flex-col' : 'max-w-[1800px] mx-auto'}`}>
                    <div className={`flex flex-col lg:flex-row gap-6 ${isFullscreen ? 'h-full' : ''}`}>
                        {/* Left Side - Form */}
                        {!isFullscreen && (
                            <div className={`lg:w-[45%] ${!showPreview ? 'w-full' : 'hidden lg:block'}`}>
                                <div className="glass-card rounded-2xl p-6 sticky top-24">
                                {/* Quick Actions */}
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
                        )}

                        {/* Right Side - Preview */}
                        <div className={`${isFullscreen ? 'w-full flex-1 flex flex-col' : `lg:w-[55%] ${showPreview ? 'w-full' : 'hidden lg:block'}`}`}>
                            {/* Toolbar (Zoom & Fullscreen) */}
                            <div className="flex items-center justify-between mb-4 glass rounded-2xl p-2 border border-white/5 sticky top-24 z-10">
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                        title="Uzaklaş"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-300 w-12 text-center">{zoom}%</span>
                                    <button 
                                        onClick={() => setZoom(Math.min(150, zoom + 10))}
                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                        title="Yakınlaş"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                                    <button 
                                        onClick={() => setZoom(100)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                        title="Sıfırla"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    className="p-2 hover:bg-white/10 rounded-lg text-cyan-400 transition-colors flex items-center gap-2 px-3"
                                >
                                    {isFullscreen ? (
                                        <><Minimize2 className="w-4 h-4" /><span className="text-xs font-bold hidden sm:inline">Küçült</span></>
                                    ) : (
                                        <><Maximize2 className="w-4 h-4" /><span className="text-xs font-bold hidden sm:inline">Tam Ekran</span></>
                                    )}
                                </button>
                            </div>

                            <div className={`${isFullscreen ? 'flex-1 overflow-auto flex justify-center custom-scrollbar pb-10' : 'sticky top-40'}`}>
                                <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
                                    <CVPreview
                                        cvData={cvData}
                                        template={selectedTemplate}
                                        showWatermark={!isPremiumUser}
                                    />
                                </div>
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

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 p-8 max-w-md w-full animate-slide-up">
                        <h3 className="text-2xl font-bold mb-4 gradient-text">Premium Şablonu Aç</h3>
                        <p className="text-gray-400 mb-6">
                            Bu şablonu kullanmak ve watermark'sız PDF indirmek için Pro sürüme yükseltin.
                        </p>

                        <div className="glass rounded-xl p-6 mb-6">
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-4xl font-bold gradient-text">29₺</span>
                                <span className="text-gray-400">tek seferlik</span>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>✓ Tüm Premium Şablonlar</li>
                                <li>✓ Watermark'sız PDF</li>
                                <li>✓ 1 CV İndirme Hakkı</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={handleUnlockPremium}
                                className="flex-1 btn-premium"
                            >
                                Satın Al
                            </button>
                        </div>

                        {/* Demo Mode Notice */}
                        <p className="text-xs text-gray-500 text-center mt-4">
                            Demo: "Satın Al" butonuna tıklayarak test edebilirsiniz
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
