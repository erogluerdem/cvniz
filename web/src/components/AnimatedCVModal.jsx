import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Globe, Share2, Eye, Layout, Monitor, Smartphone, Check, Sparkles, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import TemplateSelector from './TemplateSelector'
import { WEB_CV_TEMPLATES } from '../data/webCVTemplates'

export default function AnimatedCVModal({ isOpen, onClose, cv, isPremium }) {
    const [step, setStep] = useState(1) // 1: Select Template, 2: Publish
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [isPublished, setIsPublished] = useState(false)
    const [publishLoading, setPublishLoading] = useState(false)
    const [error, setError] = useState(null)

    const handlePublish = async () => {
        if (!isPremium) return;
        setPublishLoading(true)
        setError(null)
        try {
            // Call API to save animatedTemplate choice
            const res = await fetch(`/api/cv/${cv.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ animatedTemplate: selectedTemplate.id })
            })
            if (!res.ok) throw new Error('Yayınlama başarısız oldu')
            setIsPublished(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setPublishLoading(false)
        }
    }

    const handlePreview = (template) => {
        // Open preview in new tab
        window.open(`/v/${cv?.id}?template=${template.id}`, '_blank')
    }

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template)
    }

    if (!isOpen) return null

    const publicUrl = window.location.origin + '/v/' + cv?.id + (selectedTemplate ? `?template=${selectedTemplate.id}` : '')

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-[#0F1115] border border-[#10B981]/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(16,185,129,0.15)] w-full max-w-6xl overflow-hidden flex flex-col h-[90vh] relative"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none" />

                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                <Zap className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Animated Web CV</h2>
                                <p className="text-[10px] text-[#10B981]/80 font-bold uppercase tracking-widest mt-0.5">
                                    {step === 1 ? 'Şablonunuzu Seçin' : 'Yayınlamaya Hazır'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            {/* Step Indicator */}
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all ${step >= 1 ? 'bg-[#10B981] text-black shadow-[#10B981]/30' : 'bg-white/10 text-gray-500 border border-white/5'}`}>1</div>
                                <div className={`w-10 h-0.5 rounded-full transition-all ${step >= 2 ? 'bg-[#10B981]' : 'bg-white/10'}`} />
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all ${step >= 2 ? 'bg-[#10B981] text-black shadow-[#10B981]/30' : 'bg-white/10 text-gray-500 border border-white/5'}`}>2</div>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition-all">
                                <X className="w-6 h-6 text-gray-400 hover:text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                        {/* Step 1: Template Selection */}
                        {step === 1 && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-black text-white mb-2">30+ Premium Şablon</h3>
                                    <p className="text-gray-400 font-medium">CV'nizi en iyi yansıtacak etkileşimli tasarımı seçin</p>
                                </div>
                                <TemplateSelector
                                    selectedTemplate={selectedTemplate}
                                    onSelect={handleSelectTemplate}
                                    onPreview={handlePreview}
                                />
                            </motion.div>
                        )}

                        {/* Step 2: Publish */}
                        {step === 2 && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto py-10"
                            >
                                {/* Left: Info */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-4xl font-black text-white mb-6 leading-tight">
                                            Özgeçmişinizi <span className="text-[#10B981]">Hayata Geçirin</span>
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed text-lg font-medium">
                                            Seçtiğiniz <strong className="text-white bg-white/5 px-2 py-1 rounded-md">{selectedTemplate?.name}</strong> şablonu ile CV'niz modern, animasyonlu bir web sayfasına dönüşecek.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {!isPublished ? (
                                            <>
                                                {[
                                                    { icon: <Layout className="w-5 h-5 text-[#10B981]" />, text: "30+ Modern Web Şablonu" },
                                                    { icon: <Monitor className="w-5 h-5 text-[#10B981]" />, text: "Responsive & SEO Uyumlu" },
                                                    { icon: <Share2 className="w-5 h-5 text-[#10B981]" />, text: "Özel Link ile Hızlı Paylaşım" },
                                                    { icon: <Globe className="w-5 h-5 text-[#10B981]" />, text: "Kendi Domaininizi Bağlayın" }
                                                ].map((item, i) => (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        key={i} 
                                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 shadow-lg shadow-black/20"
                                                    >
                                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">{item.icon}</div>
                                                        <span className="text-white font-bold">{item.text}</span>
                                                        <Check className="ml-auto w-5 h-5 text-[#10B981]" />
                                                    </motion.div>
                                                ))}
                                            </>
                                        ) : (
                                            <motion.div 
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="p-8 rounded-[2rem] bg-[#10B981]/10 border border-[#10B981]/30 text-center space-y-6 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent pointer-events-none" />
                                                <div className="w-20 h-20 rounded-2xl bg-[#10B981] mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] relative z-10">
                                                    <Globe className="w-10 h-10 text-black" />
                                                </div>
                                                <div className="relative z-10">
                                                    <h4 className="text-2xl font-black text-white mb-2">Tebrikler!</h4>
                                                    <p className="text-sm text-[#10B981]/80 font-bold uppercase tracking-widest">Web CV'niz artık yayında</p>
                                                </div>
                                                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-[#10B981] font-mono text-sm break-all relative z-10 shadow-inner">
                                                    {publicUrl}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(publicUrl);
                                                    }}
                                                    className="inline-block text-[11px] font-black uppercase tracking-widest text-[#10B981] hover:text-white transition-colors relative z-10 bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:bg-white/10"
                                                >
                                                    LİNKİ KOPYALA
                                                </button>
                                            </motion.div>
                                        )}
                                    </div>

                                    {!isPublished ? (
                                        <>
                                        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                                        <button
                                            onClick={handlePublish}
                                            disabled={publishLoading || !isPremium}
                                            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${isPremium ? 'bg-[#10B981] hover:bg-[#059669] text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95' : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10'}`}
                                        >
                                            {publishLoading ? (
                                                <>
                                                    <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                                    YAYINLANIYOR...
                                                </>
                                            ) : (
                                                <>
                                                    {isPremium ? <Sparkles className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                                                    {isPremium ? 'HEMEN YAYINLA' : 'PREMIUM İLE YAYINLA'}
                                                </>
                                            )}
                                        </button>
                                        </>
                                    ) : (
                                        <Link
                                            to={`/v/${cv?.id}?template=${selectedTemplate?.id}`}
                                            target="_blank"
                                            className="w-full py-5 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 text-center flex items-center justify-center gap-3"
                                        >
                                            <Eye className="w-6 h-6" />
                                            CANLI ÖNİZLEME
                                        </Link>
                                    )}
                                </div>

                                {/* Right: Template Preview */}
                                <div className="relative group">
                                    <div className="absolute -inset-4 bg-[#10B981] rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                    <div className="relative bg-black/40 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                        <div className="p-4 bg-black/60 border-b border-white/5 flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                                            <div className="ml-4 flex-1 bg-white/5 border border-white/5 rounded-md px-3 py-1.5 flex items-center">
                                                <Globe className="w-3 h-3 text-gray-500 mr-2" />
                                                <span className="text-[10px] text-gray-400 font-mono font-medium">CVniz.com/v/{cv?.id || 'id'}</span>
                                            </div>
                                        </div>
                                        <img
                                            src={selectedTemplate?.preview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'}
                                            alt={selectedTemplate?.name || 'Template Preview'}
                                            className="w-full h-auto transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-105"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-6">
                            {step === 2 && !isPublished && (
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-sm font-bold text-white"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Şablon Değiştir
                                </button>
                            )}
                            <div className="flex items-center gap-5 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Desktop</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Mobile</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            {step === 1 ? (
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedTemplate}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                                >
                                    DEVAM ET
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <span className="text-[10px] text-[#10B981] font-black uppercase tracking-widest bg-[#10B981]/10 px-3 py-1.5 rounded-lg border border-[#10B981]/20">Premium Özellik</span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

