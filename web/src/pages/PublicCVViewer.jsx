import { useParams, useSearchParams } from 'react-router-dom'
import { useCV } from '../context/CVContext'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTemplateById } from '../data/webCVTemplates'
import { Download, Share2, Printer, Check, Link as LinkIcon, X } from 'lucide-react'

// Modular Web Templates
import MinimalWebTemplate from '../templates/web/MinimalWebTemplate'
import DarkWebTemplate from '../templates/web/DarkWebTemplate'
import GlassWebTemplate from '../templates/web/GlassWebTemplate'
import GradientWebTemplate from '../templates/web/GradientWebTemplate'
import CreativeWebTemplate from '../templates/web/CreativeWebTemplate'
import CorporateWebTemplate from '../templates/web/CorporateWebTemplate'
// NEW Templates
import NeonWebTemplate from '../templates/web/NeonWebTemplate'
import TerminalWebTemplate from '../templates/web/TerminalWebTemplate'
import RetroWaveWebTemplate from '../templates/web/RetroWaveWebTemplate'
import MagazineWebTemplate from '../templates/web/MagazineWebTemplate'
import PortfolioWebTemplate from '../templates/web/PortfolioWebTemplate'
import PaperWebTemplate from '../templates/web/PaperWebTemplate'

// ============ MAIN COMPONENT ============
export default function PublicCVViewer() {
    const { cvId } = useParams()
    const [searchParams] = useSearchParams()
    const { cvs } = useCV()
    const [cv, setCv] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [showShareModal, setShowShareModal] = useState(false)
    const [copied, setCopied] = useState(false)

    const templateId = searchParams.get('template')
    const template = templateId ? getTemplateById(templateId) : null
    const category = template?.category || 'dark'

    useEffect(() => {
        const found = cvs.find(c => c.id === cvId)
        if (found) {
            setCv(found)
            setTimeout(() => setIsLoading(false), 1500)
        } else if (cvs.length > 0) {
            // If cvs loaded but CV not found, stop loading
            setTimeout(() => setIsLoading(false), 500)
        }
    }, [cvId, cvs])

    const handlePrint = () => {
        window.print()
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${cv?.personalInfo?.fullName} - Özgeçmiş`,
                text: `${cv?.personalInfo?.title} olarak profesyonel özgeçmişim.`,
                url: window.location.href
            }).catch(console.error)
        } else {
            setShowShareModal(true)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Loading Screen
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-[#0a0a0f] z-[200] flex flex-col items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mb-6"
                />
                <p className="text-white text-lg font-medium tracking-wide">Hazırlanıyor...</p>
            </div>
        )
    }

    if (!cv) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <p className="text-slate-400">CV bulunamadı</p>
            </div>
        )
    }

    // Prepare props
    const props = { cv, template: template || { category: 'dark', colors: {}, styles: {} } }

    const renderTemplate = () => {
        switch (category) {
            case 'minimal': return <MinimalWebTemplate {...props} />
            case 'dark': return <DarkWebTemplate {...props} />
            case 'glass': return <GlassWebTemplate {...props} />
            case 'gradient': return <GradientWebTemplate {...props} />
            case 'creative': return <CreativeWebTemplate {...props} />
            case 'corporate': return <CorporateWebTemplate {...props} />
            // NEW Categories
            case 'neon': return <NeonWebTemplate {...props} />
            case 'terminal': return <TerminalWebTemplate {...props} />
            case 'retrowave': return <RetroWaveWebTemplate {...props} />
            case 'magazine': return <MagazineWebTemplate {...props} />
            case 'portfolio': return <PortfolioWebTemplate {...props} />
            case 'paper': return <PaperWebTemplate {...props} />
            default: return <DarkWebTemplate {...props} />
        }
    }

    return (
        <div className="relative min-h-screen">
            {/* The Main CV Content */}
            <div className="print:m-0">
                {renderTemplate()}
            </div>

            {/* Floating Action Bar (Hidden when printing) */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl print:hidden"
            >
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-950 rounded-full font-bold text-sm hover:bg-cyan-500 hover:text-white transition-all active:scale-95"
                >
                    <Download className="w-4 h-4" />
                    <span>PDF İNDİR</span>
                </button>

                <div className="w-px h-6 bg-white/20" />

                <button
                    onClick={handleShare}
                    className="p-2 text-white hover:bg-white/10 rounded-full transition-all active:scale-95 group"
                    title="Paylaş"
                >
                    <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </motion.div>

            {/* Simple Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowShareModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-slate-900 border border-white/10 p-8 rounded-[2rem] w-full max-w-md shadow-2xl"
                        >
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            <h3 className="text-2xl font-bold text-white mb-6">CV'nizi Paylaşın</h3>

                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <LinkIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        <p className="text-sm text-gray-400 truncate">{window.location.href}</p>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`ml-4 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-cyan-500 text-slate-950 hover:bg-cyan-600'
                                            }`}
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : 'KOPYALA'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] font-bold text-sm hover:bg-[#1877F2]/20 transition-all">
                                        Facebook
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] font-bold text-sm hover:bg-[#1DA1F2]/20 transition-all">
                                        Twitter
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; }
                    .print-hidden { display: none !important; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                }
            `}} />
        </div>
    )
}
