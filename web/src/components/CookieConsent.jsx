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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500">
            <div className="relative max-w-lg w-full glass-card rounded-[32px] border-white/10 p-8 md:p-10 shadow-2xl overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-700" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center ring-4 ring-white/5 mb-8 shadow-inner animate-bounce-subtle">
                        <Cookie className="w-10 h-10 text-slate-900" />
                    </div>

                    <h2 className="text-3xl font-black mb-4">
                        Çerez Deneyiminizi <br /> <span className="gradient-text">Kişiselleştirin</span>
                    </h2>

                    <p className="text-gray-400 leading-relaxed mb-8">
                        Size en iyi deneyimi sunmak, sitemizi iyileştirmek ve size özel içerikler göstermek için çerezleri kullanıyoruz. Devam ederek çerez kullanımımızı kabul etmiş olursunuz.
                        Daha fazla bilgi için <Link to="/cookies" className="text-cyan-400 hover:text-cyan-300 font-bold underline decoration-cyan-500/30">Çerez Politikamızı</Link> inceleyebilirsiniz.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <button
                            onClick={handleAccept}
                            className="btn-premium py-4 rounded-2xl font-black tracking-widest flex items-center justify-center gap-2 group/btn shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:shadow-cyan-500/40 transition-all active:scale-95"
                        >
                            <Check className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            KABUL ET
                        </button>
                        <Link
                            to="/cookies"
                            onClick={() => setIsVisible(false)}
                            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-gray-300 hover:text-white active:scale-95"
                        >
                            <Shield className="w-5 h-5" />
                            AYARLARI YÖNET
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="mt-6 text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors underline decoration-gray-800 underline-offset-4"
                    >
                        Daha sonra hatırlat
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}

