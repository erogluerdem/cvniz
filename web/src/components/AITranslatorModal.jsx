import React, { useState } from 'react'
import { Languages, X, Sparkles, AlertCircle } from 'lucide-react'
import { translateCV } from '../services/AIService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AITranslatorModal({ isOpen, onClose, cvData, onTranslate }) {
    const { isPremium } = useAuth()
    const { toast } = useToast()
    const [isTranslating, setIsTranslating] = useState(false)
    const [targetLanguage, setTargetLanguage] = useState('English')
    
    if (!isOpen) return null

    const languages = [
        { code: 'English', label: 'İngilizce', flag: '🇬🇧' },
        { code: 'German', label: 'Almanca', flag: '🇩🇪' },
        { code: 'French', label: 'Fransızca', flag: '🇫🇷' },
        { code: 'Spanish', label: 'İspanyolca', flag: '🇪🇸' },
        { code: 'Italian', label: 'İtalyanca', flag: '🇮🇹' },
        { code: 'Turkish', label: 'Türkçe', flag: '🇹🇷' }
    ]

    const handleTranslate = async () => {
        if (!isPremium) {
            toast.error('AI Çeviri özelliği sadece Premium üyeler içindir.')
            return
        }

        setIsTranslating(true)
        try {
            const translatedData = await translateCV(cvData, targetLanguage)
            onTranslate(translatedData)
            toast.success(`${targetLanguage} çevirisi başarıyla tamamlandı!`)
            onClose()
        } catch (error) {
            toast.error('Çeviri sırasında bir hata oluştu: ' + error.message)
        } finally {
            setIsTranslating(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] w-full max-w-md shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                            <Languages className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                AI Çoklu Dil Çeviri
                                <Sparkles className="w-4 h-4 text-amber-400" />
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">CV'nizi tek tıkla hedef dile çevirin.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {!isPremium && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-400">Premium Özellik</h4>
                                <p className="text-xs text-amber-400/80 mt-1">
                                    AI destekli dil çevirisi Premium üyelerimize özeldir. Devam etmek için yükseltme yapın.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300">Hedef Dil Seçin</label>
                        <div className="grid grid-cols-2 gap-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => setTargetLanguage(lang.code)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                        targetLanguage === lang.code
                                            ? 'bg-blue-500/20 border-blue-500/50 text-white'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                                    }`}
                                >
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="text-sm font-semibold">{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed text-center">
                        Yapay zeka asistanımız, mesleki terimleri, proje açıklamalarınızı ve yeteneklerinizi seçtiğiniz dile %100 uyumlu ve profesyonel bir üslupla çevirecektir.
                    </p>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleTranslate}
                        disabled={isTranslating}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white flex items-center gap-2 transition-all ${
                            isTranslating 
                                ? 'bg-blue-600/50 cursor-not-allowed' 
                                : isPremium 
                                    ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25'
                                    : 'bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/25 text-amber-950'
                        }`}
                    >
                        {isTranslating ? (
                            <>
                                <Sparkles className="w-4 h-4 animate-spin" />
                                Çevriliyor...
                            </>
                        ) : isPremium ? (
                            <>
                                <Languages className="w-4 h-4" />
                                CV'yi Çevir
                            </>
                        ) : (
                            <>
                                <AlertCircle className="w-4 h-4" />
                                Premium'a Geç
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
