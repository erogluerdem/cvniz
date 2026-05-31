import { useState } from 'react'
import { useTranslation } from '../context/TranslationContext'
import { useCV } from '../context/CVContext'
import {
    X, Globe2, Languages, ChevronRight, Check, Loader2,
    FileText, ArrowRight, Sparkles, Save
} from 'lucide-react'

export default function CVTranslator({ isOpen, onClose, cv, onSuccess }) {
    const { supportedLanguages, translating, translateCV, saveTranslatedCV } = useTranslation()
    const [selectedLang, setSelectedLang] = useState('en')
    const [step, setStep] = useState(1) // 1: Select Language, 2: Preview, 3: Success
    const [translatedData, setTranslatedData] = useState(null)
    const [saving, setSaving] = useState(false)

    const handleTranslate = async () => {
        if (!cv?.data) return

        const result = await translateCV(cv.data, selectedLang)

        if (result.success) {
            setTranslatedData(result.translatedCV)
            setStep(2)
        }
    }

    const handleSave = async () => {
        if (!translatedData) return

        setSaving(true)
        const result = saveTranslatedCV(translatedData, cv.template, cv.name, selectedLang)

        if (result.success) {
            setStep(3)
            if (onSuccess) onSuccess()
        }
        setSaving(false)
    }

    const handleClose = () => {
        setStep(1)
        setTranslatedData(null)
        setSelectedLang('en')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl glass-card text-white rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-green-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-green-600 flex items-center justify-center">
                                <Languages className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">CV Çevirici</h2>
                                <p className="text-sm text-gray-400">{cv?.name}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-xl hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <p className="text-gray-400 text-center">
                                CV'nizi hangi dile çevirmek istiyorsunuz?
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(supportedLanguages).filter(([code]) => code !== 'tr').map(([code, lang]) => (
                                    <button
                                        key={code}
                                        onClick={() => setSelectedLang(code)}
                                        className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${selectedLang === code
                                            ? 'bg-cyan-500/20 border-cyan-500 text-white'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <span className="text-2xl">{lang.flag}</span>
                                        <div>
                                            <div className="font-medium">{lang.name}</div>
                                            <div className="text-xs text-gray-500">{code.toUpperCase()}</div>
                                        </div>
                                        {selectedLang === code && (
                                            <Check className="w-5 h-5 text-cyan-400 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-center gap-4 py-4">
                                <div className="text-center">
                                    <div className="text-3xl mb-2">🇹🇷</div>
                                    <div className="text-sm text-gray-400">Türkçe</div>
                                </div>
                                <ArrowRight className="w-6 h-6 text-cyan-400" />
                                <div className="text-center">
                                    <div className="text-3xl mb-2">{supportedLanguages[selectedLang]?.flag}</div>
                                    <div className="text-sm text-gray-400">{supportedLanguages[selectedLang]?.name}</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h3 className="font-bold mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-cyan-400" />
                                    Çeviri Önizleme
                                </h3>
                                <div className="space-y-3 text-sm max-h-[300px] overflow-y-auto">
                                    {translatedData?.personal?.title && (
                                        <div>
                                            <span className="text-gray-500">Ünvan:</span>
                                            <span className="ml-2">{translatedData.personal.title}</span>
                                        </div>
                                    )}
                                    {translatedData?.personal?.summary && (
                                        <div>
                                            <span className="text-gray-500">Özet:</span>
                                            <p className="mt-1 text-gray-300">{translatedData.personal.summary.substring(0, 150)}...</p>
                                        </div>
                                    )}
                                    {translatedData?.experience?.[0] && (
                                        <div>
                                            <span className="text-gray-500">Son Deneyim:</span>
                                            <p className="mt-1 text-gray-300">{translatedData.experience[0].position} - {translatedData.experience[0].company}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-center text-gray-500">
                                💡 Çevrilen CV yeni bir dosya olarak kaydedilecek
                            </p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <Check className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Çeviri Tamamlandı!</h3>
                            <p className="text-gray-400 mb-4">
                                CV'niz {supportedLanguages[selectedLang]?.name} diline çevrildi ve kaydedildi.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-sm">
                                <FileText className="w-4 h-4 text-cyan-400" />
                                {cv?.name} ({supportedLanguages[selectedLang]?.name})
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                    {step === 1 && (
                        <div className="flex justify-between">
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleTranslate}
                                disabled={translating}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold flex items-center gap-2 hover:from-blue-400 hover:to-green-500 transition-all disabled:opacity-50"
                            >
                                {translating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Çevriliyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Çevir
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Geri
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center gap-2 hover:from-green-400 hover:to-emerald-500 transition-all disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Kaydet
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <button
                            onClick={handleClose}
                            className="w-full px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors"
                        >
                            Tamam
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
