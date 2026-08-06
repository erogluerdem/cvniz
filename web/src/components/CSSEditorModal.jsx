import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, RefreshCw, Eye, Code, Palette, AlertCircle, Lock } from 'lucide-react'

export default function CSSEditorModal({ isOpen, onClose, cv, onSave, isPremium }) {
    const [cssCode, setCssCode] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')
    const [error, setError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (cv) {
            setCssCode(cv.customStyles || '/* Buraya özel CSS kodlarınızı ekleyin */\n\n.cv-template {\n  /* Örnek: font-family: "Inter", sans-serif; */\n}\n\n.section-title {\n  /* border-bottom: 2px solid #10B981; */\n}')
            setPreviewUrl(`${window.location.origin}/preview/${cv.id}`)
        }
    }, [cv])

    const handleSave = async () => {
        if (!isPremium) return;
        setIsSaving(true)
        setError(null)
        try {
            await onSave(cv.id, cssCode)
            setIsSaving(false)
        } catch (err) {
            setError('Kaydetme sırasında bir hata oluştu.')
            setIsSaving(false)
        }
    }

    if (!isOpen || !cv) return null

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
                    className="bg-[#0F1115] text-white rounded-[2rem] w-full max-w-6xl h-[85vh] flex overflow-hidden border border-[#10B981]/20 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />

                    {/* Editor Section */}
                    <div className="flex-1 flex flex-col border-r border-white/5 relative z-10">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                    <Code className="w-5 h-5 text-[#10B981]" />
                                </div>
                                <div>
                                    <span className="block font-black text-white leading-tight">Canlı CSS Editörü</span>
                                    <span className="text-[10px] text-[#10B981]/80 font-bold uppercase tracking-widest">Özel Stil Tasarımı</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || !isPremium}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-sm font-black disabled:opacity-50 ${isPremium ? 'bg-[#10B981] hover:bg-[#059669] text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : (!isPremium ? <Lock className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
                                    {isPremium ? 'Kaydet' : 'Premium'}
                                </button>
                                <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 relative font-mono text-sm bg-black/30">
                            {!isPremium && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <div className="w-16 h-16 rounded-full bg-[#10B981]/20 flex items-center justify-center mb-4 border border-[#10B981]/30">
                                        <Lock className="w-8 h-8 text-[#10B981]" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">Premium Özellik</h3>
                                    <p className="text-gray-400 max-w-md text-center">Özel CSS yazarak CV'nizi tamamen özelleştirmek için Premium plana geçin.</p>
                                    <button className="mt-6 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-black rounded-xl font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                                        Planları İncele
                                    </button>
                                </div>
                            )}
                            <textarea
                                value={cssCode}
                                onChange={(e) => setCssCode(e.target.value)}
                                disabled={!isPremium}
                                className="absolute inset-0 w-full h-full p-6 bg-transparent resize-none outline-none text-[#10B981] placeholder-[#10B981]/30 selection:bg-[#10B981]/30 leading-relaxed font-medium disabled:opacity-50"
                                spellCheck="false"
                            />
                            <div className="absolute top-4 right-6 px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[10px] border border-[#10B981]/20 rounded-full uppercase font-black tracking-widest pointer-events-none">
                                CSS Modu
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="p-4 bg-red-500/10 border-t border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Preview Section */}
                    <div className="hidden lg:flex w-[400px] flex-col bg-white/5 backdrop-blur-md relative z-10">
                        <div className="p-5 border-b border-white/5 flex items-center gap-3 bg-black/20">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-gray-300" />
                            </div>
                            <div>
                                <span className="block font-black text-white leading-tight">Canlı Önizleme</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gerçek Zamanlı Sonuç</span>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 overflow-y-auto p-4">
                            <div className="w-full h-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 relative">
                                <iframe
                                    src={previewUrl}
                                    className="w-full h-full border-none absolute inset-0"
                                    title="CV Preview"
                                />
                            </div>
                        </div>
                        {/* Style inject dummy */}
                        <style>{cssCode}</style>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
