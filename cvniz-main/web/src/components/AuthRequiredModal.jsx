import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { X, Cloud, Download, Sparkles, BarChart3, ArrowRight, Crown } from 'lucide-react'

export default function AuthRequiredModal({ isOpen, onClose, featureName = 'Bu özelliği' }) {
    const navigate = useNavigate()
    const [isDayMode, setIsDayMode] = useState(false)

    // Listen for theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return

        const checkTheme = () => {
            const storedTheme = window.localStorage.getItem('CVniz-home-theme')
            setIsDayMode(storedTheme === 'day')
        }

        checkTheme()

        const handleThemeChange = (event) => {
            setIsDayMode(event.detail === 'day')
        }

        window.addEventListener('CVniz-theme-change', handleThemeChange)
        return () => window.removeEventListener('CVniz-theme-change', handleThemeChange)
    }, [])

    if (!isOpen) return null

    const benefits = [
        { icon: <Cloud className={`w-5 h-5 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />, title: 'Bulut Kayıt', desc: 'Verileriniz asla kaybolmaz, her yerden erişin.' },
        { icon: <Download className={`w-5 h-5 ${isDayMode ? 'text-emerald-500' : 'text-emerald-400'}`} />, title: 'Sınırsız PDF', desc: 'Özgeçmişinizi dilediğiniz an profesyonel formatta indirin.' },
        { icon: <Sparkles className={`w-5 h-5 ${isDayMode ? 'text-purple-500' : 'text-purple-400'}`} />, title: 'Yapay Zeka Asistanı', desc: 'AI ile ilgi çekici özetler ve iş tanımları oluşturun.' },
        { icon: <BarChart3 className={`w-5 h-5 ${isDayMode ? 'text-amber-500' : 'text-amber-400'}`} />, title: 'ATS Analizi', desc: 'İşe alım sistemlerine tam uyum için skorunuzu görün.' }
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 backdrop-blur-md animate-in fade-in duration-300 ${isDayMode ? 'bg-slate-900/50' : 'bg-[#0f1115]/80'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDayMode
                    ? 'bg-white border border-slate-200'
                    : 'bg-[#161920] border border-white/5'
                }`}>
                {/* Decorative background */}
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] -mr-32 -mt-32 rounded-full ${isDayMode ? 'bg-sky-200/50' : 'bg-cyan-500/10'
                    }`} />
                <div className={`absolute bottom-0 left-0 w-64 h-64 blur-[100px] -ml-32 -mb-32 rounded-full ${isDayMode ? 'bg-purple-200/50' : 'bg-purple-500/10'
                    }`} />

                <div className="relative p-8 sm:p-12">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className={`absolute top-6 right-6 p-2 rounded-xl transition-colors ${isDayMode
                                ? 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDayMode
                                ? 'bg-sky-100 text-sky-600'
                                : 'bg-cyan-500/10 text-cyan-400'
                            }`}>
                            <Crown className="w-3 h-3" /> Özel Erişim
                        </div>
                        <h2 className={`text-3xl font-black italic leading-tight mb-4 ${isDayMode ? 'text-slate-900' : 'text-white'
                            }`}>
                            {featureName} kullanmak için <br />
                            <span className={isDayMode ? 'text-sky-500' : 'text-cyan-400'}>Ücretsiz Kayıt Olun</span>
                        </h2>
                        <p className={`text-sm font-medium max-w-sm mx-auto ${isDayMode ? 'text-slate-600' : 'text-slate-400'
                            }`}>
                            Profesyonel kariyerinizi bir üst seviyeye taşımak için ihtiyacınız olan tüm araçlar burada.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {benefits.map((benefit, i) => (
                            <div key={i} className={`p-5 rounded-3xl border transition-colors group ${isDayMode
                                    ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                }`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${isDayMode ? 'bg-white shadow-sm' : 'bg-slate-700/50'
                                    }`}>
                                    {benefit.icon}
                                </div>
                                <h3 className={`text-sm font-bold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'
                                    }`}>{benefit.title}</h3>
                                <p className={`text-xs leading-relaxed font-medium ${isDayMode ? 'text-slate-600' : 'text-slate-300'
                                    }`}>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                            className={`flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isDayMode
                                    ? 'bg-sky-500 text-white hover:bg-sky-600'
                                    : 'bg-white text-slate-950 hover:bg-cyan-400'
                                }`}
                        >
                            Giriş Yap veya Kayıt Ol <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/pricing')}
                            className={`flex-1 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${isDayMode
                                    ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                }`}
                        >
                            Fiyatlandırmayı Gör
                        </button>
                    </div>

                    {/* Footer text */}
                    <p className={`text-center mt-8 text-[9px] font-bold uppercase tracking-widest ${isDayMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        Kayıt olmak tamamen ücretsizdir ve sadece 30 saniye sürer.
                    </p>
                </div>
            </div>
        </div>
    )
}
