import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Play, Pause, RotateCcw, X, Settings2 } from 'lucide-react'

export default function CVVoiceReader({ isOpen, onClose, cvData }) {
    const [isReading, setIsReading] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [rate, setRate] = useState(1)
    const [pitch, setPitch] = useState(1)
    const [currentPart, setCurrentPart] = useState('')

    const synth = window.speechSynthesis

    const getCVText = () => {
        if (!cvData) return ''

        let text = `${cvData.personal?.fullName || ''}. ${cvData.personal?.title || ''}. `
        text += `Özet: ${cvData.personal?.summary || ''}. `

        if (cvData.experience?.length > 0) {
            text += 'Deneyimler. '
            cvData.experience.forEach(exp => {
                text += `${exp.position}, ${exp.company} bünyesinde. ${exp.description || ''}. `
            })
        }

        if (cvData.education?.length > 0) {
            text += 'Eğitim. '
            cvData.education.forEach(edu => {
                text += `${edu.school}, ${edu.degree}. `
            })
        }

        if (cvData.skills?.length > 0) {
            text += 'Beceriler. '
            text += cvData.skills.join(', ') + '. '
        }

        return text
    }

    const handleSpeak = () => {
        if (synth.speaking) {
            if (isPaused) {
                synth.resume()
                setIsPaused(false)
                setIsReading(true)
            } else {
                synth.pause()
                setIsPaused(true)
                setIsReading(false)
            }
            return
        }

        const text = getCVText()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'tr-TR'
        utterance.rate = rate
        utterance.pitch = pitch

        utterance.onstart = () => setIsReading(true)
        utterance.onend = () => {
            setIsReading(false)
            setIsPaused(false)
        }
        utterance.onerror = () => {
            setIsReading(false)
            setIsPaused(false)
        }

        synth.speak(utterance)
    }

    const handleStop = () => {
        synth.cancel()
        setIsReading(false)
        setIsPaused(false)
    }

    useEffect(() => {
        return () => synth.cancel()
    }, [])

    if (!isOpen) return null

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 w-72 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <Volume2 className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="font-bold text-sm">Sesli CV Okuyucu</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-md">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 py-2">
                        <button
                            onClick={handleStop}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSpeak}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isReading || isPaused
                                    ? 'bg-purple-500 shadow-lg shadow-purple-500/40'
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            {isReading ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                        </button>
                        <button
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400"
                        >
                            <Settings2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                        <p className="text-xs text-gray-400">
                            {isReading ? 'Özgeçmişiniz okunuyor...' : isPaused ? 'Duraklatıldı' : 'Okumaya hazır'}
                        </p>
                    </div>

                    {/* Settings Sliders */}
                    <div className="space-y-3 pt-2 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                            <span>Okuma Hızı</span>
                            <span>{rate}x</span>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
