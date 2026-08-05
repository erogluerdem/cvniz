import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X, Check, Shield } from 'lucide-react'

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('CVniz_cookie_consent')
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 1500) // 1.5 saniye sonra çıksın
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('CVniz_cookie_consent', 'accepted')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-24 left-4 z-[100] max-w-[340px] w-[calc(100%-2rem)] animate-in slide-in-from-bottom-8 duration-500">
            <div className="relative w-full glass-card rounded-2xl border border-white/10 p-5 shadow-2xl overflow-hidden group bg-slate-900/90 backdrop-blur-xl">
                <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center ring-1 ring-white/10 shadow-inner">
                            <Cookie className="w-5 h-5 text-slate-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">
                                Çerez Deneyimi
                            </h2>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Size en iyi deneyimi sunmak için çerezleri kullanıyoruz. <Link to="/cookies" className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/30">Detaylar</Link>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <button
                            onClick={handleAccept}
                            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                        >
                            KABUL ET
                        </button>
                        <Link
                            to="/cookies"
                            onClick={() => setIsVisible(false)}
                            className="flex-1 text-center bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95"
                        >
                            AYARLAR
                        </Link>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

