import { useNavigate } from 'react-router-dom'
import { X, Cloud, Download, Sparkles, BarChart3, ArrowRight, Crown } from 'lucide-react'

export default function AuthRequiredModal({ isOpen, onClose, featureName = 'Bu özelliği' }) {
    const navigate = useNavigate()

    if (!isOpen) return null

    const benefits = [
        { icon: <Cloud className="w-5 h-5 text-cyan-400" />, title: 'Bulut Kayıt', desc: 'Verileriniz asla kaybolmaz, her yerden erişin.' },
        { icon: <Download className="w-5 h-5 text-emerald-400" />, title: 'Sınırsız PDF', desc: 'Özgeçmişinizi dilediğiniz an profesyonel formatta indirin.' },
        { icon: <Sparkles className="w-5 h-5 text-purple-400" />, title: 'Yapay Zeka Asistanı', desc: 'AI ile ilgi çekici özetler ve iş tanımları oluşturun.' },
        { icon: <BarChart3 className="w-5 h-5 text-amber-400" />, title: 'ATS Analizi', desc: 'İşe alım sistemlerine tam uyum için skorunuzu görün.' }
    ]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-[#0f1115]/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl bg-[#161920] border border-white/5 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -ml-32 -mb-32 rounded-full" />

                <div className="relative p-8 sm:p-12">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Crown className="w-3 h-3" /> Özel Erişim
                        </div>
                        <h2 className="text-3xl font-black text-white italic leading-tight mb-4">
                            {featureName} kullanmak için <br /> <span className="text-cyan-400">Ücretsiz Kayıt Olun</span>
                        </h2>
                        <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto">
                            Profesyonel kariyerinizi bir üst seviyeye taşımak için ihtiyacınız olan tüm araçlar burada.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">{benefit.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate('/login', { state: { from: window.location.pathname } })}
                            className="flex-1 py-5 bg-white text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all flex items-center justify-center gap-2"
                        >
                            Giriş Yap veya Kayıt Ol <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10"
                        >
                            Fiyatlandırmayı Gör
                        </button>
                    </div>

                    <p className="text-center mt-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        Kayıt olmak tamamen ücretsizdir ve sadece 30 saniye sürer.
                    </p>
                </div>
            </div>
        </div>
    )
}
