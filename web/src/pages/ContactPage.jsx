import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Zap, Linkedin, Twitter, Github } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSent, setIsSent] = useState(false)
    
    // Theme Management
    const [darkMode, setDarkMode] = useState(true)
    useEffect(() => {
        const checkTheme = (e) => {
            if (e && e.detail) {
                setDarkMode(e.detail === 'night')
            } else {
                const saved = localStorage.getItem('CVniz-home-theme')
                setDarkMode(saved === 'night' || saved === null)
            }
        }
        checkTheme()
        window.addEventListener('CVniz-theme-change', checkTheme)
        return () => window.removeEventListener('CVniz-theme-change', checkTheme)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSent(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
        }, 1500)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' : 'bg-slate-50 text-slate-900'} selection:bg-cyan-500/30`}>
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-700 ${darkMode ? 'bg-cyan-500/10' : 'bg-cyan-400/10'}`}></div>
                <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${darkMode ? 'bg-blue-500/5' : 'bg-blue-400/5'}`}></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12 min-h-screen flex items-center">
                <motion.div 
                    className="max-w-7xl mx-auto relative z-10 w-full"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="text-center max-w-3xl mx-auto mb-16" variants={itemVariants}>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 ${darkMode ? 'border-cyan-500/20' : 'border-cyan-500/30 bg-white/50 backdrop-blur-md shadow-sm'}`}>
                            <MessageSquare className="w-4 h-4 text-cyan-500" />
                            <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">İletişim Kanalı</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                            Bir Sorunuz mu Var? <br /> <span className="gradient-text">Bize Ulaşın</span>
                        </h1>
                        <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                            Ekibimiz size en kısa sürede yardımcı olmak için burada. Her türlü soru, görüş ve öneriniz için bize dilediğiniz zaman yazabilirsiniz.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Info Column */}
                        <motion.div className="lg:col-span-5 space-y-6" variants={itemVariants}>
                            <div className={`glass-card rounded-[32px] p-8 md:p-10 h-full flex flex-col justify-between ${darkMode ? 'border-white/5 bg-slate-900/50' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'}`}>
                                <div>
                                    <h3 className="text-2xl font-bold mb-8">İletişim Bilgileri</h3>

                                    <div className="space-y-8">
                                        <div className="flex items-start gap-5 group cursor-pointer">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${darkMode ? 'bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950' : 'bg-cyan-50 border border-cyan-100 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white shadow-sm'}`}>
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className={`text-sm mb-1 font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>E-posta</p>
                                                <p className={`text-lg font-bold transition-colors ${darkMode ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600'}`}>destek@cvniz.com</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5 group cursor-pointer">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${darkMode ? 'bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950' : 'bg-cyan-50 border border-cyan-100 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white shadow-sm'}`}>
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className={`text-sm mb-1 font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Telefon</p>
                                                <p className={`text-lg font-bold transition-colors ${darkMode ? 'group-hover:text-cyan-400' : 'group-hover:text-cyan-600'}`}>+90 (212) 999 00 00</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5 group cursor-pointer">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${darkMode ? 'bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950' : 'bg-cyan-50 border border-cyan-100 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white shadow-sm'}`}>
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className={`text-sm mb-1 font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Ofis</p>
                                                <p className="text-lg font-bold leading-relaxed">
                                                    Levent, Büyükdere Cd. No:123 <br />
                                                    İstanbul, Türkiye
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 space-y-8">
                                    <div className={`pt-8 border-t grid grid-cols-2 gap-4 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                <Clock className="w-4 h-4 text-cyan-500" />
                                            </div>
                                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>7/24 Yanıt</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                <Globe className="w-4 h-4 text-cyan-500" />
                                            </div>
                                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>Çok Dilli</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-white/5 hover:bg-cyan-500 hover:text-slate-900' : 'bg-slate-100 hover:bg-cyan-500 hover:text-white hover:scale-110'}`}>
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                        <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-white/5 hover:bg-cyan-500 hover:text-slate-900' : 'bg-slate-100 hover:bg-cyan-500 hover:text-white hover:scale-110'}`}>
                                            <Twitter className="w-4 h-4" />
                                        </a>
                                        <a href="#" className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${darkMode ? 'bg-white/5 hover:bg-cyan-500 hover:text-slate-900' : 'bg-slate-100 hover:bg-cyan-500 hover:text-white hover:scale-110'}`}>
                                            <Github className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Form Column */}
                        <motion.div className="lg:col-span-7" variants={itemVariants}>
                            <div className={`glass-card rounded-[32px] p-8 md:p-12 relative overflow-hidden h-full ${darkMode ? 'border-white/5 bg-slate-900/50' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/50'}`}>
                                
                                <AnimatePresence>
                                    {isSent && (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.05 }}
                                            className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8 backdrop-blur-xl ${darkMode ? 'bg-slate-950/90' : 'bg-white/95'}`}
                                        >
                                            <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6">
                                                <Zap className="w-12 h-12 text-green-500" />
                                            </div>
                                            <h3 className="text-3xl font-extrabold mb-4">Mesajınız Alındı!</h3>
                                            <p className={`max-w-md mx-auto mb-8 text-lg ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                                                Bizimle paylaştığınız her şey için teşekkürler. Ekibimiz en geç 24 saat içinde size dönüş yapacaktır.
                                            </p>
                                            <button
                                                onClick={() => setIsSent(false)}
                                                className="btn-premium px-10 py-4 text-sm tracking-wider shadow-xl shadow-cyan-500/20"
                                            >
                                                YENİ MESAJ GÖNDER
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="relative group">
                                            <input
                                                required
                                                type="text"
                                                id="name"
                                                className={`peer w-full px-5 py-4 rounded-xl border-2 bg-transparent outline-none transition-all duration-300 placeholder-transparent ${darkMode ? 'border-white/10 focus:border-cyan-500 text-white' : 'border-slate-200 focus:border-cyan-500 text-slate-900'}`}
                                                placeholder="Adınız"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            <label 
                                                htmlFor="name"
                                                className={`absolute left-5 -top-3 px-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-xs ${darkMode ? 'text-gray-400 peer-focus:text-cyan-400 bg-slate-900' : 'text-slate-500 peer-focus:text-cyan-600 bg-white'}`}
                                            >
                                                Adınız
                                            </label>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                required
                                                type="email"
                                                id="email"
                                                className={`peer w-full px-5 py-4 rounded-xl border-2 bg-transparent outline-none transition-all duration-300 placeholder-transparent ${darkMode ? 'border-white/10 focus:border-cyan-500 text-white' : 'border-slate-200 focus:border-cyan-500 text-slate-900'}`}
                                                placeholder="E-posta"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                            <label 
                                                htmlFor="email"
                                                className={`absolute left-5 -top-3 px-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-xs ${darkMode ? 'text-gray-400 peer-focus:text-cyan-400 bg-slate-900' : 'text-slate-500 peer-focus:text-cyan-600 bg-white'}`}
                                            >
                                                E-posta
                                            </label>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <input
                                            required
                                            type="text"
                                            id="subject"
                                            className={`peer w-full px-5 py-4 rounded-xl border-2 bg-transparent outline-none transition-all duration-300 placeholder-transparent ${darkMode ? 'border-white/10 focus:border-cyan-500 text-white' : 'border-slate-200 focus:border-cyan-500 text-slate-900'}`}
                                            placeholder="Konu"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                        <label 
                                            htmlFor="subject"
                                            className={`absolute left-5 -top-3 px-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-xs ${darkMode ? 'text-gray-400 peer-focus:text-cyan-400 bg-slate-900' : 'text-slate-500 peer-focus:text-cyan-600 bg-white'}`}
                                        >
                                            Konu
                                        </label>
                                    </div>

                                    <div className="relative group flex-1">
                                        <textarea
                                            required
                                            id="message"
                                            rows="6"
                                            className={`peer w-full px-5 py-4 rounded-xl border-2 bg-transparent outline-none transition-all duration-300 placeholder-transparent resize-none ${darkMode ? 'border-white/10 focus:border-cyan-500 text-white' : 'border-slate-200 focus:border-cyan-500 text-slate-900'}`}
                                            placeholder="Mesajınız"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        ></textarea>
                                        <label 
                                            htmlFor="message"
                                            className={`absolute left-5 -top-3 px-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-xs ${darkMode ? 'text-gray-400 peer-focus:text-cyan-400 bg-slate-900' : 'text-slate-500 peer-focus:text-cyan-600 bg-white'}`}
                                        >
                                            Mesajınız
                                        </label>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full btn-premium py-5 text-lg font-black tracking-widest flex items-center justify-center gap-3 disabled:opacity-70 mt-6 shadow-xl shadow-cyan-500/20"
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
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}


