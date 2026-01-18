import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    Star,
    CheckCircle,
    Globe
} from 'lucide-react'
import { socialProviders } from '../data/authProviders'

const features = [
    { icon: Sparkles, text: 'AI-Powered CV Builder' },
    { icon: Globe, text: '40+ Dil Desteği' },
    { icon: ShieldCheck, text: 'KVKK Uyumlu' },
    { icon: Zap, text: 'Anında PDF Export' }
]

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(null)
    const [focusedInput, setFocusedInput] = useState(null)
    const { login, socialLogin } = useAuth()
    const navigate = useNavigate()

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
        const result = socialLogin(provider.id, provider.mockUser)
        if (result.success) {
            navigate('/dashboard')
        } else {
            setError('Sosyal giriş başarısız oldu')
        }
        setSocialLoading(null)
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#030712]">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Primary gradient orbs */}
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-600/20 via-pink-500/10 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />

                {/* Floating particles */}
                <div className="absolute top-20 left-[20%] w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
                <div className="absolute top-40 right-[30%] w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                <div className="absolute bottom-32 left-[40%] w-2 h-2 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
            </div>

            <div className="relative z-10 min-h-screen flex">
                {/* Left Side - Branding & Features */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-2xl">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">CVniz</h1>
                            <p className="text-sm text-slate-400">Kariyer Platformu</p>
                        </div>
                    </Link>

                    {/* Main Heading */}
                    <div className="space-y-6 mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                            <Star className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-cyan-300">250.000+ Mutlu Kullanıcı</span>
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                            Geleceğin CV'sini
                            <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Bugünden Hazırlayın
                            </span>
                        </h2>

                        <p className="text-lg text-slate-400 max-w-md">
                            Yapay zeka destekli araçlarımızla dakikalar içinde profesyonel CV'nizi oluşturun ve kariyer hedeflerinize ulaşın.
                        </p>
                    </div>

                    {/* Feature List */}
                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
                                    <feature.icon className="w-5 h-5 text-cyan-400" />
                                </div>
                                <span className="text-sm font-medium text-slate-300">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Trust badges */}
                    <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm text-slate-400">ISO 27001</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="text-sm text-slate-400">SSL Korumalı</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" />
                            <span className="text-sm text-slate-400">4.9/5 Puan</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">CVniz</span>
                            </Link>
                        </div>

                        {/* Form Card */}
                        <div className="relative">
                            {/* Glow effect behind card */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-[28px] blur-xl opacity-50" />

                            <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-8 shadow-2xl">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz</h3>
                                    <p className="text-slate-400">Hesabınıza giriş yapın</p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                                        <p className="text-sm text-red-400 text-center">{error}</p>
                                    </div>
                                )}

                                {/* Social Login */}
                                <div className="grid grid-cols-4 gap-3 mb-6">
                                    {socialProviders.map((provider) => {
                                        const Icon = provider.icon
                                        return (
                                            <button
                                                key={provider.id}
                                                onClick={() => handleSocialLogin(provider)}
                                                disabled={socialLoading !== null}
                                                className="group relative h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                                                title={`${provider.name} ile devam et`}
                                            >
                                                {socialLoading === provider.id ? (
                                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                                ) : (
                                                    <Icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Divider */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">veya e-posta ile</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">E-posta</label>
                                        <div className={`relative group rounded-xl transition-all duration-300 ${focusedInput === 'email' ? 'ring-2 ring-cyan-500/50' : ''}`}>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Mail className={`w-5 h-5 transition-colors ${focusedInput === 'email' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedInput('email')}
                                                onBlur={() => setFocusedInput(null)}
                                                placeholder="ornek@email.com"
                                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.05] focus:border-cyan-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-300">Şifre</label>
                                            <Link to="/support" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                                                Şifremi Unuttum
                                            </Link>
                                        </div>
                                        <div className={`relative group rounded-xl transition-all duration-300 ${focusedInput === 'password' ? 'ring-2 ring-cyan-500/50' : ''}`}>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Lock className={`w-5 h-5 transition-colors ${focusedInput === 'password' ? 'text-cyan-400' : 'text-slate-500'}`} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                onFocus={() => setFocusedInput('password')}
                                                onBlur={() => setFocusedInput(null)}
                                                placeholder="••••••••"
                                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-12 py-3.5 text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.05] focus:border-cyan-500/50 transition-all"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group relative w-full h-12 rounded-xl font-semibold text-white overflow-hidden disabled:opacity-60 transition-all duration-300"
                                    >
                                        {/* Button gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-105" />

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                        {/* Button content */}
                                        <div className="relative flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Giriş yapılıyor...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Giriş Yap</span>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>

                                {/* Register Link */}
                                <p className="text-center mt-6 text-sm text-slate-400">
                                    Hesabınız yok mu?{' '}
                                    <Link to="/register" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                                        Ücretsiz Kayıt Olun
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-center mt-8 text-xs text-slate-500">
                            Giriş yaparak{' '}
                            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Kullanım Şartları</Link>
                            {' '}ve{' '}
                            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Gizlilik Politikası</Link>
                            'nı kabul etmiş olursunuz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
