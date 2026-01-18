import { useState, useEffect } from 'react'
import { X, Save, RefreshCw, Eye, Code, Palette, AlertCircle } from 'lucide-react'

export default function CSSEditorModal({ isOpen, onClose, cv, onSave }) {
    const [cssCode, setCssCode] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')
    const [error, setError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (cv) {
            setCssCode(cv.customStyles || '/* Buraya özel CSS kodlarınızı ekleyin */\n\n.cv-template {\n  /* Örnek: font-family: "Inter", sans-serif; */\n}\n\n.section-title {\n  /* border-bottom: 2px solid cyan; */\n}')
            setPreviewUrl(`${window.location.origin}/preview/${cv.id}`)
        }
    }, [cv])

    const handleSave = async () => {
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 text-white rounded-3xl w-full max-w-6xl h-[85vh] flex overflow-hidden border border-white/10 shadow-2xl">
                {/* Editor Section */}
                <div className="flex-1 flex flex-col border-r border-white/10">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                <Code className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold">Canlı CSS Editörü</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-sm font-bold disabled:opacity-50"
                            >
                                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Kaydet
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative font-mono text-sm">
                        <textarea
                            value={cssCode}
                            onChange={(e) => setCssCode(e.target.value)}
                            className="absolute inset-0 w-full h-full p-6 bg-transparent resize-none outline-none text-blue-300 placeholder-blue-900/50 selection:bg-blue-500/30"
                            spellCheck="false"
                        />
                        <div className="absolute top-2 right-4 text-[10px] text-gray-500 uppercase font-bold pointer-events-none">
                            CSS Mode
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border-t border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Preview Section */}
                <div className=" hidden lg:flex w-[400px] flex-col bg-slate-900">
                    <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-white/5">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-400">Canlı Önizleme</span>
                    </div>
                    <div className="flex-1 bg-white overflow-y-auto">
                        <iframe
                            src={previewUrl}
                            className="w-full h-full border-none"
                            title="CV Preview"
                        />
                    </div>
                    {/* Style inject dummy */}
                    <style>{cssCode}</style>
                </div>
            </div>
        </div>
    )
}
