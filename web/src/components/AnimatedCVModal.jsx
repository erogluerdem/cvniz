import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Zap, Globe, Share2, Eye, Layout, Monitor, Smartphone, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import TemplateSelector from './TemplateSelector'
import { WEB_CV_TEMPLATES } from '../data/webCVTemplates'

export default function AnimatedCVModal({ isOpen, onClose, cv }) {
    const [step, setStep] = useState(1) // 1: Select Template, 2: Publish
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [isPublished, setIsPublished] = useState(false)
    const [publishLoading, setPublishLoading] = useState(false)

    const handlePublish = async () => {
        setPublishLoading(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsPublished(true)
        setPublishLoading(false)
    }

    const handlePreview = (template) => {
        // Open preview in new tab (for now just open the viewer)
        window.open(`/v/${cv?.id}?template=${template.id}`, '_blank')
    }

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template)
    }

    if (!isOpen) return null

    const publicUrl = window.location.origin + '/v/' + cv?.id + (selectedTemplate ? `?template=${selectedTemplate.id}` : '')

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 w-full max-w-6xl overflow-hidden flex flex-col h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Animated Web CV</h2>
                            <p className="text-gray-400 text-sm">
                                {step === 1 ? 'Şablonunuzu seçin' : 'Yayınlamaya hazır'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Step Indicator */}
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-500'}`}>1</div>
                            <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-cyan-500' : 'bg-white/10'}`} />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-500'}`}>2</div>
                        </div>
                        <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                            <X className="w-6 h-6 text-gray-500 hover:text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {/* Step 1: Template Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold text-white mb-2">30+ Premium Şablon</h3>
                                <p className="text-slate-400">CV'nizi en iyi yansıtacak tasarımı seçin</p>
                            </div>
                            <TemplateSelector
                                selectedTemplate={selectedTemplate}
                                onSelect={handleSelectTemplate}
                                onPreview={handlePreview}
                            />
                        </div>
                    )}

                    {/* Step 2: Publish */}
                    {step === 2 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                            {/* Left: Info */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
                                        Özgeçmişinizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Hayata Geçirin</span>
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed text-lg">
                                        Seçtiğiniz <strong className="text-white">{selectedTemplate?.name}</strong> şablonu ile CV'niz modern bir web sayfasına dönüşecek.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {!isPublished ? (
                                        <>
                                            {[
                                                { icon: <Layout className="w-5 h-5 text-purple-400" />, text: "30+ Modern Web Şablonu" },
                                                { icon: <Monitor className="w-5 h-5 text-blue-400" />, text: "Responsive & SEO Uyumlu" },
                                                { icon: <Share2 className="w-5 h-5 text-pink-400" />, text: "Özel Link ile Hızlı Paylaşım" },
                                                { icon: <Globe className="w-5 h-5 text-emerald-400" />, text: "Kendi Domaininizi Bağlayın" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div className="flex-shrink-0">{item.icon}</div>
                                                    <span className="text-white font-medium">{item.text}</span>
                                                    <Check className="ml-auto w-4 h-4 text-emerald-500" />
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-center space-y-4 animate-scale-in">
                                            <div className="w-16 h-16 rounded-full bg-cyan-500 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                                <Globe className="w-8 h-8 text-white" />
                                            </div>
                                            <h4 className="text-xl font-bold text-white">Tebrikler!</h4>
                                            <p className="text-sm text-slate-400">Web CV'niz artık yayında ve paylaşıma hazır.</p>
                                            <div className="p-3 rounded-xl bg-slate-950 border border-white/10 text-cyan-400 font-mono text-sm break-all">
                                                {publicUrl}
                                            </div>
                                            <button
                                                onClick={() => navigator.clipboard.writeText(publicUrl)}
                                                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                                            >
                                                Linki Kopyala
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {!isPublished ? (
                                    <button
                                        onClick={handlePublish}
                                        disabled={publishLoading}
                                        className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-purple-500/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {publishLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                YAYINLANIYOR...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-6 h-6" />
                                                HEMEN YAYINLA
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        to={`/v/${cv?.id}?template=${selectedTemplate?.id}`}
                                        target="_blank"
                                        className="w-full py-5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-2xl font-black text-lg transition-all shadow-xl shadow-cyan-500/30 active:scale-95 text-center block"
                                    >
                                        CANLI ÖNİZLEME
                                    </Link>
                                )}
                            </div>

                            {/* Right: Template Preview */}
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative glass-card border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                    <img
                                        src={selectedTemplate?.preview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'}
                                        alt={selectedTemplate?.name || 'Template Preview'}
                                        className="w-full h-auto transition-all duration-700"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black to-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                            <span className="ml-2 text-xs text-gray-400 font-mono">CVniz.com/v/{cv?.id || 'id'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {step === 2 && !isPublished && (
                            <button
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Şablon Değiştir
                            </button>
                        )}
                        <div className="flex items-center gap-4 text-gray-500">
                            <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span className="text-xs uppercase font-bold">Desktop</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4" />
                                <span className="text-xs uppercase font-bold">Mobile</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {step === 1 && (
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedTemplate}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Devam Et
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Premium Feature</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

