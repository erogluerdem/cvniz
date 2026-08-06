import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    FileText,
    Mail,
    Lock,
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
    Sparkles,
    Zap,
    Users,
    Briefcase,
    Target,
    ChevronRight,
    Fingerprint,
    Globe,
    Award,
    Sun,
    Moon
} from 'lucide-react'
import { socialProviders } from '../data/authProviders'

const stats = [
    { number: '250K+', label: 'Kullanıcı', icon: Users },
    { number: '50K+', label: 'CV Hazır', icon: Briefcase },
    { number: '95%', label: 'Başarı', icon: Target },
    { number: '24/7', label: 'AI Destek', icon: Sparkles }
]

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(null)
    const { login, socialLogin } = useAuth()
    const navigate = useNavigate()

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem('CVniz-home-theme') || 'day'
        }
        return 'day'
    })
    const isDayMode = theme === 'day'

    const toggleTheme = () => {
        const nextTheme = isDayMode ? 'night' : 'day'
        setTheme(nextTheme)
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('CVniz-home-theme', nextTheme)
            window.dispatchEvent(new CustomEvent('CVniz-theme-change', { detail: nextTheme }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const result = await login(email, password)
        if (result.success) {
            navigate(result.user.role === 'admin' ? '/admin' : '/dashboard')
        } else {
            setError(result.error)
        }
        setLoading(false)
    }

    const handleSocialLogin = async (provider) => {
        setSocialLoading(provider.id)
        setError('')
        await new Promise(resolve => setTimeout(resolve, 800))
        const result = await socialLogin(provider.id, provider.mockUser)
        if (result.success) {
            navigate('/dashboard')
        } else {
            setError('Sosyal giriş başarısız oldu')
        }
        setSocialLoading(null)
    }

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 selection:bg-cyan-500/30 ${
            isDayMode 
                ? 'bg-gradient-to-br from-white via-sky-50 to-amber-50 text-slate-900' 
                : 'bg-[#020617] text-white'
        }`}>
            {/* Cinematic Animated Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    isDayMode 
                        ? 'bg-[radial-gradient(circle_at_50%_-20%,#0ea5e915,#ffffff00)]' 
                        : 'bg-[radial-gradient(circle_at_50%_-20%,#3b82f630,#000000)]'
                }`} />
                
                {/* Dynamic Orbs */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[120px] ${
                        isDayMode ? 'bg-sky-400/5' : 'bg-cyan-500/10'
                    }`} 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.3, 0.1],
                        x: [0, -40, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px] ${
                        isDayMode ? 'bg-amber-300/5' : 'bg-purple-600/10'
                    }`} 
                />

                {/* Grid Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${isDayMode ? 'opacity-[0.02]' : 'opacity-[0.05]'}`} style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Floating Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className={`p-3 rounded-2xl border transition-all duration-300 shadow-lg backdrop-blur-md flex items-center justify-center ${
                        isDayMode 
                            ? 'bg-white/80 border-slate-200 text-slate-800 hover:bg-slate-100 hover:scale-105' 
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-cyan-500/50 hover:scale-105'
                    }`}
                    title={isDayMode ? 'Gece Moduna Geç' : 'Gündüz Moduna Geç'}
                >
                    {isDayMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
                </button>
            </div>

            <main className="relative z-10 flex h-screen overflow-hidden">
                {/* Left Side: Branding (Desktop Only) */}
                <div className={`hidden lg:flex flex-col items-center justify-center w-1/2 p-10 xl:p-16 border-r h-full overflow-y-auto backdrop-blur-3xl transition-colors duration-500 ${
                    isDayMode 
                        ? 'border-slate-200/50 bg-slate-50/60' 
                        : 'border-white/5 bg-white/[0.02]'
                }`}>
                    <div className="w-full max-w-lg h-full flex flex-col justify-between">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                        <Link to="/" className="flex items-center group">
                            <img src="/logo.jpg" alt="CVniz Logo" className="w-auto h-10 rounded-xl border border-white/10 shadow-lg group-hover:scale-105 transition-all duration-300 object-contain bg-white" />
                        </Link>
                    </motion.div>

                    <div className="space-y-8 my-auto py-6">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <h1 className={`text-4xl xl:text-5xl font-black leading-none tracking-tighter mb-4 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                KARİYERİNİ <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">MODERNLEŞTİR.</span>
                            </h1>
                            <p className={`text-sm font-medium leading-relaxed ${isDayMode ? 'text-slate-600' : 'text-slate-300'}`}>
                                Yapay zeka gücüyle dakikalar içinde profesyonel bir CV oluşturun ve istediğiniz pozisyona bir adım daha yaklaşın.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    className={`p-6 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${
                                        isDayMode 
                                            ? 'bg-white/60 backdrop-blur-xl border-white/80 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/90 hover:border-cyan-200/50' 
                                            : 'bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-900/20'
                                    }`}
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 transition-transform duration-500 group-hover:scale-110 ${isDayMode ? 'bg-gradient-to-br from-cyan-100 to-transparent' : 'bg-gradient-to-br from-cyan-900 to-transparent'}`} />
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-inner ring-1 ring-white/20">
                                            <stat.icon className="w-6 h-6 text-cyan-500" />
                                        </div>
                                        <div className={`text-3xl font-black tracking-tight mb-1 transition-colors ${isDayMode ? 'text-slate-900 group-hover:text-cyan-600' : 'text-white group-hover:text-cyan-400'}`}>{stat.number}</div>
                                        <div className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex items-center gap-4"
                        >
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border ${isDayMode ? 'border-emerald-500/20' : 'border-emerald-500/20'}`}>
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">SSL Güvenli</span>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border ${isDayMode ? 'border-blue-500/20' : 'border-blue-500/20'}`}>
                                <Globe className="w-4 h-4 text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Global Standart</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 relative h-full overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-md"
                    >
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-12">
                            <Link to="/" className="flex items-center">
                                <img src="/logo.jpg" alt="CVniz Logo" className="w-auto h-12 rounded-xl border border-white/10 shadow-lg object-contain bg-white" />
                            </Link>
                        </div>

                        <div className="mb-10 text-center lg:text-left">
                            <h2 className={`text-4xl font-black mb-2 tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Tekrar Hoş Geldin!</h2>
                            <p className={`${isDayMode ? 'text-slate-500' : 'text-slate-300'} font-medium`}>Hesabına erişmek için bilgilerini gir.</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3"
                            >
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">E-Posta Adresi</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-cyan-400 ${
                                        isDayMode ? 'text-slate-500' : 'text-slate-300'
                                    }`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full border rounded-2xl py-4 pl-12 pr-4 focus:outline-none transition-all duration-300 font-medium ${
                                            isDayMode 
                                                ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-cyan-500' 
                                                : 'bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:bg-white/[0.08]'
                                        } placeholder:text-slate-400`}
                                        placeholder="ornek@mail.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Şifre</label>
                                    <Link to="/support" className="text-[10px] font-black text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em]">Şifremi Unuttum</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-cyan-400 ${
                                        isDayMode ? 'text-slate-500' : 'text-slate-300'
                                    }`} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full border rounded-2xl py-4 pl-12 pr-12 focus:outline-none transition-all duration-300 font-medium ${
                                            isDayMode 
                                                ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-cyan-500' 
                                                : 'bg-white/5 border-white/10 text-white focus:border-cyan-500/50 focus:bg-white/[0.08]'
                                        } placeholder:text-slate-400`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                                            isDayMode ? 'text-slate-500 hover:text-cyan-500' : 'text-slate-300 hover:text-cyan-400'
                                        }`}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50 overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12" />
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10">Giriş Yap</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1 h-px bg-white/10" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hızlı Erişim</span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>

                            <div className="flex justify-center gap-4">
                                {socialProviders.map((provider) => {
                                    const Icon = provider.icon
                                    return (
                                        <button
                                            key={provider.id}
                                            onClick={() => handleSocialLogin(provider)}
                                            disabled={socialLoading !== null}
                                            className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 disabled:opacity-50 group ${
                                                isDayMode 
                                                    ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 hover:border-slate-300' 
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/5'
                                            }`}
                                            title={provider.name}
                                        >
                                            {socialLoading === provider.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <p className={`${isDayMode ? 'text-slate-500' : 'text-slate-300'} font-medium`}>
                                Hesabın yok mu?{' '}
                                <Link to="/register" className={`hover:text-cyan-500 transition-colors font-black underline decoration-cyan-500 underline-offset-8 ${
                                    isDayMode ? 'text-slate-900' : 'text-white'
                                }`}>Yeni Hesap Oluştur</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
