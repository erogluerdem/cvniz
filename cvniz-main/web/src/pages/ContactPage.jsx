import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Zap } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSent(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20">
                            <MessageSquare className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">İletişim Kanalı</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                            Bir Sorunuz mu Var? <br /> <span className="gradient-text">Bize Ulaşın</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Ekibimiz size en kısa sürede yardımcı olmak için burada. Her türlü soru, görüş ve öneriniz için bize dilediğiniz zaman yazabilirsiniz.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="glass-card rounded-[32px] p-8 border-white/5 space-y-8 h-full">
                                <h3 className="text-2xl font-bold mb-6">İletişim Bilgileri</h3>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">E-posta</p>
                                        <p className="text-lg font-bold">destek@CVniz.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Telefon</p>
                                        <p className="text-lg font-bold">+90 (212) 999 00 00</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Ofis</p>
                                        <p className="text-lg font-bold leading-relaxed">
                                            Levent, Büyükdere Cd. No:123 <br />
                                            İstanbul, Türkiye
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-cyan-400" />
                                        <span className="text-sm text-gray-400">7/24 Yanıt</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-5 h-5 text-cyan-400" />
                                        <span className="text-sm text-gray-400">Çok Dilli Destek</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="lg:col-span-7">
                            <div className="glass-card rounded-[32px] p-8 md:p-12 border-white/5 relative overflow-hidden">
                                {/* Success Message Overlay */}
                                {isSent && (
                                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl z-20 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6">
                                            <Zap className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4 text-white">Mesajınız Alındı!</h3>
                                        <p className="text-gray-400 max-w-xs mx-auto mb-8">
                                            Bizimle paylaştığınız her şey için teşekkürler. Ekibimiz en geç 24 saat içinde size dönecektir.
                                        </p>
                                        <button
                                            onClick={() => setIsSent(false)}
                                            className="btn-premium px-10 py-3"
                                        >
                                            Yeni Mesaj Gönder
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 ml-1">ADINIZ</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                className="input-field"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-400 ml-1">E-POSTA</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                className="input-field"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 ml-1">KONU</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Destek, İş Birliği vb."
                                            className="input-field"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-400 ml-1">MESAJINIZ</label>
                                        <textarea
                                            required
                                            rows="5"
                                            placeholder="Size nasıl yardımcı olabiliriz?"
                                            className="input-field resize-none"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full btn-premium py-5 text-lg font-black tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                GÖNDER <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

