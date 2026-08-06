import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, RotateCcw, X, Settings2, Activity, Lock, Crown } from 'lucide-react'

export default function CVVoiceReader({ isOpen, onClose, cvData, isPremium }) {
    const [isReading, setIsReading] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [rate, setRate] = useState(1)
    const [pitch, setPitch] = useState(1)
    const [currentPart, setCurrentPart] = useState('')
    const [showSettings, setShowSettings] = useState(false)
    const audioBarsRef = useRef(null)

    const synth = window.speechSynthesis
    const utteranceRef = useRef(null)

    const stopSpeaking = () => {
        synth.cancel()
        setIsReading(false)
        setIsPaused(false)
        setCurrentPart('')
    }

    useEffect(() => {
        if (!isOpen) {
            stopSpeaking()
        }
        return () => stopSpeaking()
    }, [isOpen])

    const processText = () => {
        if (!cvData) return 'CV verisi bulunamadı.'

        let text = 'Özgeçmişiniz okunuyor. '
        
        if (cvData.personalInfo) {
            text += `Kişisel Bilgiler: ${cvData.personalInfo.fullName || ''}, ${cvData.personalInfo.title || ''}. `
            text += `${cvData.personalInfo.about || ''}. `
        }

        if (cvData.experience && cvData.experience.length > 0) {
            text += 'Deneyimler. '
            cvData.experience.forEach(exp => {
                text += `${exp.title || ''}, ${exp.company || ''}. `
                text += `${exp.description || ''}. `
            })
        }

        if (cvData.education && cvData.education.length > 0) {
            text += 'Eğitim Bilgileri. '
            cvData.education.forEach(edu => {
                text += `${edu.school || ''}, ${edu.degree || ''}. `
            })
        }

        if (cvData.skills && cvData.skills.length > 0) {
            text += 'Yetenekler. '
            text += cvData.skills.map(s => s.name || s).join(', ') + '. '
        }

        return text
    }

    const togglePlay = () => {
        if (isReading && !isPaused) {
            synth.pause()
            setIsPaused(true)
        } else if (isReading && isPaused) {
            synth.resume()
            setIsPaused(false)
        } else {
            stopSpeaking()
            const textToRead = processText()
            utteranceRef.current = new SpeechSynthesisUtterance(textToRead)
            
            utteranceRef.current.lang = 'tr-TR'
            utteranceRef.current.rate = rate
            utteranceRef.current.pitch = pitch

            utteranceRef.current.onstart = () => {
                setIsReading(true)
                setIsPaused(false)
                setCurrentPart('Okunuyor...')
            }
            
            utteranceRef.current.onend = () => {
                setIsReading(false)
                setIsPaused(false)
                setCurrentPart('Okuma tamamlandı.')
            }

            utteranceRef.current.onerror = (e) => {
                console.error('Speech synthesis error', e)
                stopSpeaking()
            }

            synth.speak(utteranceRef.current)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[70]"
            >
                <div className="bg-[#0F1115]/95 backdrop-blur-2xl border border-[#10B981]/20 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] p-5 w-80 relative overflow-hidden">
                    
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#10B981]/10 rounded-full blur-3xl"></div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center relative overflow-hidden group">
                                <Activity className={`w-5 h-5 text-[#10B981] transition-transform ${isReading ? 'animate-pulse' : ''}`} />
                            </div>
                            <div>
                                <span className="font-black text-white flex items-center gap-1.5 leading-tight">AI Okuyucu {isPremium && <Crown className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />}</span>
                                <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-widest">Canlı Dinle</span>
                            </div>
                        </div>
                        <button onClick={() => { stopSpeaking(); onClose(); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Controls */}
                    {isPremium ? (
                        <>
                            <div className="flex items-center justify-between gap-4 py-2 relative z-10">
                                <button
                                    onClick={stopSpeaking}
                                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                                    title="Başa Sar"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </button>
                                
                                <div className="relative">
                                    {isReading && (
                                        <div className="absolute inset-0 bg-[#10B981] rounded-full blur-xl opacity-40 animate-pulse"></div>
                                    )}
                                    <button
                                        onClick={togglePlay}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all relative z-10 ${
                                            isReading || isPaused
                                                ? 'bg-[#10B981] text-black shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:bg-[#059669] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]'
                                                : 'bg-white/10 text-white hover:bg-[#10B981] hover:text-black border border-white/10 hover:border-[#10B981]'
                                            }`}
                                    >
                                        {isReading && !isPaused ? (
                                            <Pause className="w-7 h-7 fill-current" />
                                        ) : (
                                            <Play className="w-7 h-7 fill-current ml-1" />
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowSettings(!showSettings)}
                                    className={`p-3.5 rounded-2xl transition-all border ${showSettings ? 'bg-[#10B981]/20 border-[#10B981]/30 text-[#10B981]' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5'}`}
                                    title="Ayarlar"
                                >
                                    <Settings2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Status indicator */}
                            <div className="text-center mt-5 mb-2 relative z-10 h-6 flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={isReading && !isPaused ? 'reading' : isPaused ? 'paused' : 'ready'}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        {isReading && !isPaused && (
                                            <div className="flex gap-1 items-center">
                                                <div className="w-1 h-3 bg-[#10B981] rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                                                <div className="w-1 h-4 bg-[#10B981] rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                                                <div className="w-1 h-2 bg-[#10B981] rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                                            </div>
                                        )}
                                        <span className={`text-xs font-bold uppercase tracking-widest ${isReading && !isPaused ? 'text-[#10B981]' : isPaused ? 'text-amber-500' : 'text-gray-500'}`}>
                                            {isReading && !isPaused ? 'Yapay Zeka Okuyor' : isPaused ? 'Duraklatıldı' : 'Okumaya Hazır'}
                                        </span>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="py-4 flex flex-col items-center justify-center text-center relative z-10">
                            <Lock className="w-10 h-10 text-amber-500 mb-3 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                            <h3 className="text-white font-bold mb-1">Premium Özellik</h3>
                            <p className="text-xs text-gray-400">CV'nizi sesli dinlemek ve okuma ayarlarını yönetmek için Pro'ya geçin.</p>
                        </div>
                    )}

                    {/* Settings Sliders - Expanding Panel */}
                    <AnimatePresence>
                        {showSettings && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-4 p-4 rounded-2xl bg-black/40 border border-white/5 relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                            <span>Okuma Hızı</span>
                                            <span className="text-[#10B981]">{rate}x</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2"
                                            step="0.1"
                                            value={rate}
                                            onChange={(e) => setRate(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#10B981] [&::-webkit-slider-thumb]:rounded-full cursor-pointer outline-none"
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                                            <span>Ses Tonu</span>
                                            <span className="text-[#10B981]">{pitch}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0.5"
                                            max="2"
                                            step="0.1"
                                            value={pitch}
                                            onChange={(e) => setPitch(parseFloat(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#10B981] [&::-webkit-slider-thumb]:rounded-full cursor-pointer outline-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
