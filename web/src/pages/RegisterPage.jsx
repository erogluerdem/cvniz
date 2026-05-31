import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
    FileText,
    Mail,
    Lock,
    User,
    ArrowRight,
    Eye,
    EyeOff,
    Loader2,
    Sparkles,
    ShieldCheck,
    Zap,
    Award,
    CheckCircle,
    Rocket,
    Gift,
    ChevronRight,
    Fingerprint,
    Sun,
    Moon
} from 'lucide-react'
import { socialProviders } from '../data/authProviders'

const benefits = [
    { icon: Sparkles, title: 'AI CV Sihirbazı', desc: 'Sizin için profesyonel cümleler kurar' },
    { icon: Award, title: 'Premium Şablonlar', desc: 'ATS uyumlu en iyi tasarımlar' },
    { icon: Zap, title: 'Hızlı Export', desc: 'Saniyeler içinde PDF çıktısı' },
    { icon: Gift, title: 'Deneme Süresi', desc: 'Tüm özellikleri ücretsiz deneyin' }
]

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(null)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const { register, socialLogin } = useAuth()
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

    const passwordStrength = () => {
        if (password.length === 0) return { level: 0, text: '', color: 'bg-slate-800' }
        if (password.length < 6) return { level: 1, text: 'Zayıf', color: 'bg-red-500' }
        if (password.length < 10) return { level: 2, text: 'Orta', color: 'bg-amber-500' }
        if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { level: 3, text: 'Güçlü', color: 'bg-emerald-500' }
        }
        return { level: 2, text: 'Orta', color: 'bg-amber-500' }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Şifreler eşleşmiyor')
            return
        }

        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalı')
            return
        }

        if (!acceptTerms) {
            setError('Kullanım şartlarını kabul etmelisiniz')
            return
        }

        setLoading(true)
        const result = await register(name, email, password)
        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.error)
        }
        setLoading(false)
    }

    const handleSocialRegister = async (provider) => {
        setSocialLoading(provider.id)
        setError('')
        await new Promise(resolve => setTimeout(resolve, 800))
        const result = await socialLogin(provider.id, provider.mockUser)
        if (result.success) {
            navigate('/dashboard')
        } else {
            setError('Sosyal kayıt başarısız oldu')
        }
        setSocialLoading(null)
    }

    const strength = passwordStrength()

    return (
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 selection:bg-purple-500/30 ${
            isDayMode 
                ? 'bg-gradient-to-br from-white via-sky-50 to-amber-50 text-slate-900' 
                : 'bg-[#020617] text-white'
        }`}>
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                    isDayMode 
                        ? 'bg-[radial-gradient(circle_at_50%_-20%,#7c3aed10,#ffffff00)]' 
                        : 'bg-[radial-gradient(circle_at_50%_-20%,#7c3aed20,#000000)]'
                }`} />
                
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.3, 0.2],
                        x: [0, -60, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px] ${
                        isDayMode ? 'bg-purple-400/5' : 'bg-purple-500/10'
                    }`} 
                />
                <motion.div 
                    animate={{ 
                        scale: [1.3, 1, 1.3],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 70, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[120px] ${
                        isDayMode ? 'bg-sky-300/5' : 'bg-cyan-600/10'
                    }`} 
                />

                <div className={`absolute inset-0 transition-opacity duration-500 ${isDayMode ? 'opacity-[0.01]' : 'opacity-[0.03]'}`} style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }} />
            </div>

            {/* Floating Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={toggleTheme}
                    className={`p-3 rounded-2xl border transition-all duration-300 shadow-lg backdrop-blur-md flex items-center justify-center ${
                        isDayMode 
                            ? 'bg-white/80 border-slate-200 text-slate-800 hover:bg-slate-100 hover:scale-105' 
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50 hover:scale-105'
                    }`}
                    title={isDayMode ? 'Gece Moduna Geç' : 'Gündüz Moduna Geç'}
                >
                    {isDayMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
                </button>
            </div>

            <main className="relative z-10 flex h-screen overflow-hidden">
                {/* Left Side: Benefits (Desktop) */}
                <div className={`hidden lg:flex flex-col justify-between w-1/2 p-10 xl:p-16 border-r h-full overflow-y-auto backdrop-blur-3xl transition-colors duration-500 ${
                    isDayMode 
                        ? 'border-slate-200/50 bg-slate-50/60' 
                        : 'border-white/5 bg-white/[0.01]'
                }`}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link to="/" className="flex items-center gap-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-purple-500 blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500" />
                                <div className="relative w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <span className={`text-xl font-black tracking-tighter italic ${isDayMode ? 'text-slate-900' : 'text-white'}`}>CVniz</span>
                        </Link>
                    </motion.div>

                    <div className="space-y-8 my-auto py-6">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className={`text-4xl xl:text-5xl font-black leading-[1.1] tracking-tighter mb-4 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                BİZE KATILIN, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500 font-black italic">GELECEĞİNİZİ KURUN.</span>
                            </h1>
                            <p className={`text-sm font-medium leading-relaxed ${isDayMode ? 'text-slate-600' : 'text-slate-300'}`}>
                                En modern CV şablonları ve AI destekli araçlarımızla kariyer basamaklarını hızla tırmanın.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className={`p-4 rounded-xl border transition-all duration-500 ${
                                        isDayMode 
                                            ? 'bg-white border-slate-200/80 shadow-sm' 
                                            : 'bg-white/5 border-white/10'
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                                        <benefit.icon className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className={`text-xs font-black mb-0.5 uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{benefit.title}</div>
                                    <div className="text-[10px] text-slate-500 font-bold leading-normal">{benefit.desc}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                        <span>© 2024 CVNIZ PLATFORM</span>
                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                        <span>PREMIUM EXPERIENCE</span>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 relative h-full overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md h-full lg:h-auto flex flex-col justify-center"
                    >
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className={`text-3xl font-black mb-2 tracking-tight uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Hesap Oluştur</h2>
                            <p className={`${isDayMode ? 'text-slate-500' : 'text-slate-300'} font-medium text-sm`}>Hayalindeki kariyere bugün başla.</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-bold flex items-center gap-2"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tam Adınız</label>
                                <div className="relative group">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-purple-400 ${
                                        isDayMode ? 'text-slate-500' : 'text-slate-300'
                                    }`} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={`w-full border rounded-2xl py-3 pl-11 pr-4 focus:outline-none transition-all text-sm font-medium ${
                                            isDayMode 
                                                ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500' 
                                                : 'bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:bg-white/[0.07]'
                                        } placeholder:text-slate-400`}
                                        placeholder="Ad Soyad"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-Posta</label>
                                <div className="relative group">
                                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-purple-400 ${
                                        isDayMode ? 'text-slate-500' : 'text-slate-300'
                                    }`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full border rounded-2xl py-3 pl-11 pr-4 focus:outline-none transition-all text-sm font-medium ${
                                            isDayMode 
                                                ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500' 
                                                : 'bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:bg-white/[0.07]'
                                        } placeholder:text-slate-400`}
                                        placeholder="ornek@mail.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Şifre</label>
                                    <div className="relative group">
                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-purple-400 ${
                                            isDayMode ? 'text-slate-500' : 'text-slate-300'
                                        }`} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full border rounded-2xl py-3 pl-11 pr-4 focus:outline-none transition-all text-sm font-medium ${
                                                isDayMode 
                                                    ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500' 
                                                    : 'bg-white/5 border-white/10 text-white focus:border-purple-500/50'
                                            } placeholder:text-slate-400`}
                                            placeholder="••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tekrar</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full border rounded-2xl py-3 px-4 focus:outline-none transition-all text-sm font-medium ${
                                            isDayMode 
                                                ? 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white focus:border-purple-500' 
                                                : 'bg-white/5 border-white/10 text-white focus:border-purple-500/50'
                                        } placeholder:text-slate-400`}
                                        placeholder="••••••"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Strength */}
                            {password && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-1">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Şifre Gücü: <span className={`${isDayMode ? 'text-slate-900' : 'text-white'}`}>{strength.text}</span></span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(strength.level / 3) * 100}%` }}
                                            className={`h-full ${strength.color} transition-all duration-500`} 
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer group hover:bg-white/[0.08] transition-all ${
                                isDayMode 
                                    ? 'bg-slate-100 border-slate-200/80 hover:bg-slate-200/50' 
                                    : 'bg-white/5 border-white/5'
                            }`}>
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-white/10 bg-slate-900 text-purple-600 focus:ring-purple-500/50 focus:ring-offset-0 transition-all"
                                />
                                <span className={`text-[11px] font-bold leading-snug ${isDayMode ? 'text-slate-600' : 'text-slate-300'}`}>
                                    <Link to="/terms" className="text-purple-600 hover:underline">Kullanım Şartlarını</Link> ve{' '}
                                    <Link to="/privacy" className="text-purple-600 hover:underline">Gizlilik Politikasını</Link> okudum, kabul ediyorum.
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-600 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Kayıt Ol</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="flex items-center gap-4 mb-6 text-slate-500">
                                <div className="flex-1 h-px bg-white/5" />
                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Veya Sosyal Hesapla</span>
                                <div className="flex-1 h-px bg-white/5" />
                            </div>

                            <div className="flex justify-center gap-3">
                                {socialProviders.map((provider) => {
                                    const Icon = provider.icon
                                    return (
                                        <button
                                            key={provider.id}
                                            onClick={() => handleSocialRegister(provider)}
                                            disabled={socialLoading !== null}
                                            className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300 disabled:opacity-50 group ${
                                                isDayMode 
                                                    ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 hover:border-slate-300' 
                                                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5'
                                            }`}
                                        >
                                            {socialLoading === provider.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-8 text-center text-slate-500 font-medium text-sm">
                            Hesabın var mı?{' '}
                            <Link to="/login" className={`hover:text-purple-400 transition-colors font-black underline decoration-purple-500 underline-offset-8 ${
                                isDayMode ? 'text-slate-900' : 'text-white'
                            }`}>Giriş Yap</Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
