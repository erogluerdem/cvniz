import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../context/TranslationContext'
import { useCV } from '../context/CVContext'
import {
    X, Globe2, Languages, ChevronRight, Check, Loader2,
    FileText, ArrowRight, Sparkles, Save, Crown, Lock
} from 'lucide-react'

export default function CVTranslator({ isOpen, onClose, cv, onSuccess, isPremium }) {
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
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && handleClose()}
            >
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#0F1115] border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.1)] overflow-hidden my-4"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5 bg-gradient-to-r from-[#10B981]/10 to-transparent relative overflow-hidden">
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Languages className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    CV Çevirici <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                </h2>
                                <p className="text-sm text-gray-400">{cv?.name}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-black text-white mb-2">Hedef Dili Seçin</h3>
                                        <p className="text-gray-400 font-medium">CV'nizi yapay zeka ile profesyonel bir şekilde çevirelim.</p>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {Object.entries(supportedLanguages).filter(([code]) => code !== 'tr').map(([code, lang]) => (
                                            <button
                                                key={code}
                                                onClick={() => setSelectedLang(code)}
                                                disabled={!isPremium}
                                                className={`p-5 rounded-2xl border transition-all text-left flex flex-col items-center justify-center gap-3 relative overflow-hidden group ${selectedLang === code && isPremium
                                                    ? 'bg-[#10B981]/20 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)] text-white'
                                                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                                                    } ${!isPremium ? 'opacity-50 cursor-not-allowed blur-[1px]' : ''}`}
                                            >
                                                <div className="text-4xl drop-shadow-md transition-transform group-hover:scale-110">{lang.flag}</div>
                                                <div className="text-center">
                                                    <div className={`font-bold ${selectedLang === code && isPremium ? 'text-[#10B981]' : 'text-gray-300'}`}>{lang.name}</div>
                                                    <div className="text-xs text-gray-500 font-medium">{code.toUpperCase()}</div>
                                                </div>
                                                {selectedLang === code && isPremium && (
                                                    <div className="absolute top-3 right-3">
                                                        <Check className="w-5 h-5 text-[#10B981]" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    {!isPremium && (
                                        <div className="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 flex flex-col items-center justify-center text-center">
                                            <Lock className="w-8 h-8 text-amber-500 mb-2" />
                                            <h3 className="text-white font-bold mb-1">Premium Özellik</h3>
                                            <p className="text-sm text-gray-400">CV'nizi 50'den fazla dile yapay zeka ile profesyonelce çevirmek için Pro'ya geçin.</p>
                                        </div>
                                    )}
                                    
                                    <div className="pt-8 text-center flex justify-center">
                                        <button
                                            onClick={handleTranslate}
                                            disabled={translating || !isPremium}
                                            className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 ${isPremium ? 'bg-[#10B981] text-black hover:bg-[#059669] hover:text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            {translating ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    Çevriliyor...
                                                </>
                                            ) : !isPremium ? (
                                                <>
                                                    <Lock className="w-6 h-6" />
                                                    PREMIUM GEREKLİ
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-6 h-6" />
                                                    Sihirli Çeviriyi Başlat
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div 
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-center gap-8 py-6">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-black/40 border border-white/5 flex items-center justify-center text-5xl drop-shadow-lg mx-auto mb-3">🇹🇷</div>
                                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Türkçe</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <ArrowRight className="w-8 h-8 text-[#10B981] mb-2" />
                                            <div className="px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-xs font-black text-[#10B981]">YAPAY ZEKA</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-5xl drop-shadow-lg mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.2)]">{supportedLanguages[selectedLang]?.flag}</div>
                                            <div className="text-sm font-bold text-[#10B981] uppercase tracking-widest">{supportedLanguages[selectedLang]?.name}</div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-black/40 border border-white/5">
                                        <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-[#10B981]" />
                                            Kısa Çeviri Önizlemesi
                                        </h3>
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                            {translatedData?.personal?.title && (
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Ünvan</span>
                                                    <span className="font-medium text-white">{translatedData.personal.title}</span>
                                                </div>
                                            )}
                                            {translatedData?.personal?.summary && (
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Özet</span>
                                                    <p className="text-gray-300 font-medium leading-relaxed">{translatedData.personal.summary}</p>
                                                </div>
                                            )}
                                            {translatedData?.experience?.[0] && (
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Son Deneyim</span>
                                                    <p className="text-gray-300 font-medium"><span className="text-white font-bold">{translatedData.experience[0].position}</span> @ {translatedData.experience[0].company}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5"
                                        >
                                            Geri Dön
                                        </button>
                                        <div className="text-center w-full sm:w-auto">
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#10B981] text-black font-black text-lg flex items-center justify-center gap-3 hover:bg-[#059669] hover:text-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Kaydediliyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-5 h-5" />
                                                        Çeviriyi CV Olarak Kaydet
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500 font-medium mt-3">
                                                💡 Çevrilen metin yeni bir CV olarak kaydedilecek, eskisi bozulmayacaktır.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="relative mb-8">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl"></div>
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mx-auto relative z-10 shadow-[0_0_40px_rgba(16,185,129,0.4)] border-4 border-[#0F1115]">
                                            <Check className="w-12 h-12 text-black" />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4">Çeviri Başarıyla Tamamlandı!</h3>
                                    <p className="text-lg text-gray-400 font-medium mb-8">
                                        CV'niz <strong className="text-white">{supportedLanguages[selectedLang]?.name}</strong> diline çevrildi ve yeni bir CV olarak Panonuza eklendi.
                                    </p>
                                    
                                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-black/40 border border-[#10B981]/20 mb-10">
                                        <FileText className="w-6 h-6 text-[#10B981]" />
                                        <span className="font-bold text-white text-lg">{cv?.name} <span className="text-[#10B981]">({supportedLanguages[selectedLang]?.name})</span></span>
                                    </div>

                                    <div>
                                        <button
                                            onClick={handleClose}
                                            className="px-12 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/5"
                                        >
                                            Kapat ve Panoya Dön
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
