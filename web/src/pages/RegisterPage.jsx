import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    Star
} from 'lucide-react'
import { socialProviders } from '../data/authProviders'

const benefits = [
    { icon: Sparkles, title: 'AI CV Builder', desc: 'Yapay zeka ile saniyeler içinde CV' },
    { icon: Award, title: '50+ Şablon', desc: 'Profesyonel ve modern tasarımlar' },
    { icon: Zap, title: 'Hızlı Export', desc: 'PDF, DOCX, HTML formatları' },
    { icon: ShieldCheck, title: 'Güvenli', desc: 'Verileriniz %100 korunur' }
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
    const [focusedInput, setFocusedInput] = useState(null)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const { register, socialLogin } = useAuth()
    const navigate = useNavigate()

    const passwordStrength = () => {
        if (password.length === 0) return { level: 0, text: '', color: '' }
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
        const result = socialLogin(provider.id, provider.mockUser)
        if (result.success) {
            navigate('/dashboard')
        } else {
            setError('Sosyal kayıt başarısız oldu')
        }
        setSocialLoading(null)
    }

    const strength = passwordStrength()

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#030712]">
            {/* Animated Background */}
            <div className="absolute inset-0">
                {/* Primary gradient orbs */}
                <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-bl from-purple-600/20 via-pink-500/10 to-transparent rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }} />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }} />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />

                {/* Floating particles */}
                <div className="absolute top-32 right-[25%] w-2 h-2 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
                <div className="absolute top-60 left-[15%] w-1.5 h-1.5 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
                <div className="absolute bottom-40 right-[35%] w-2 h-2 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
            </div>

            <div className="relative z-10 min-h-screen flex">
                {/* Left Side - Branding & Benefits */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                            <Rocket className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-purple-300">14 Gün Ücretsiz Premium</span>
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                            Kariyer Yolculuğunuz
                            <span className="block mt-2 bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                                Burada Başlıyor
                            </span>
                        </h2>

                        <p className="text-lg text-slate-400 max-w-md">
                            Binlerce profesyonelin tercih ettiği CVniz ile öne çıkan bir CV oluşturun ve hayalinizdeki işe kavuşun.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm hover:bg-white/[0.05] hover:border-purple-500/30 transition-all duration-300 group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-3 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all">
                                    <benefit.icon className="w-5 h-5 text-purple-400" />
                                </div>
                                <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                                <p className="text-sm text-slate-400">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/[0.06]">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">250K+</p>
                            <p className="text-sm text-slate-400">Kullanıcı</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">1M+</p>
                            <p className="text-sm text-slate-400">CV Oluşturuldu</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                <p className="text-3xl font-bold text-white">4.9</p>
                            </div>
                            <p className="text-sm text-slate-400">Değerlendirme</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-8">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <Link to="/" className="inline-flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">CVniz</span>
                            </Link>
                        </div>

                        {/* Form Card */}
                        <div className="relative">
                            {/* Glow effect behind card */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-[28px] blur-xl opacity-50" />

                            <div className="relative bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-8 shadow-2xl">
                                {/* Header */}
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">Hesap Oluşturun</h3>
                                    <p className="text-slate-400">Ücretsiz başlayın, premium özellikleri deneyin</p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                                        <p className="text-sm text-red-400 text-center">{error}</p>
                                    </div>
                                )}

                                {/* Social Login */}
                                <div className="grid grid-cols-4 gap-3 mb-5">
                                    {socialProviders.map((provider) => {
                                        const Icon = provider.icon
                                        return (
                                            <button
                                                key={provider.id}
                                                onClick={() => handleSocialRegister(provider)}
                                                disabled={socialLoading !== null}
                                                className="group relative h-11 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] hover:border-purple-500/30 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                                                title={`${provider.name} ile kayıt ol`}
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
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">veya</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                </div>

                                {/* Register Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name Field */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-300">Ad Soyad</label>
                                        <div className={`relative rounded-xl transition-all duration-300 ${focusedInput === 'name' ? 'ring-2 ring-purple-500/50' : ''}`}>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <User className={`w-5 h-5 transition-colors ${focusedInput === 'name' ? 'text-purple-400' : 'text-slate-500'}`} />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onFocus={() => setFocusedInput('name')}
                                                onBlur={() => setFocusedInput(null)}
                                                placeholder="Adınız Soyadınız"
                                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.05] focus:border-purple-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-300">E-posta</label>
                                        <div className={`relative rounded-xl transition-all duration-300 ${focusedInput === 'email' ? 'ring-2 ring-purple-500/50' : ''}`}>
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <Mail className={`w-5 h-5 transition-colors ${focusedInput === 'email' ? 'text-purple-400' : 'text-slate-500'}`} />
                                            </div>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedInput('email')}
                                                onBlur={() => setFocusedInput(null)}
                                                placeholder="ornek@email.com"
                                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.05] focus:border-purple-500/50 transition-all"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-300">Şifre</label>
                                            <div className={`relative rounded-xl transition-all duration-300 ${focusedInput === 'password' ? 'ring-2 ring-purple-500/50' : ''}`}>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <Lock className={`w-5 h-5 transition-colors ${focusedInput === 'password' ? 'text-purple-400' : 'text-slate-500'}`} />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onFocus={() => setFocusedInput('password')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-10 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.05] focus:border-purple-500/50 transition-all"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-slate-300">Tekrar</label>
                                            <div className={`relative rounded-xl transition-all duration-300 ${focusedInput === 'confirm' ? 'ring-2 ring-purple-500/50' : ''}`}>
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <Lock className={`w-5 h-5 transition-colors ${focusedInput === 'confirm' ? 'text-purple-400' : 'text-slate-500'}`} />
                                                </div>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    onFocus={() => setFocusedInput('confirm')}
                                                    onBlur={() => setFocusedInput(null)}
                                                    placeholder="••••••••"
                                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:bg-white/[0.05] focus:border-purple-500/50 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Strength Indicator */}
                                    {password.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 flex gap-1">
                                                {[1, 2, 3].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 flex-1 rounded-full transition-all ${level <= strength.level ? strength.color : 'bg-white/10'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`text-xs ${strength.level === 3 ? 'text-emerald-400' : strength.level === 2 ? 'text-amber-400' : 'text-red-400'}`}>
                                                {strength.text}
                                            </span>
                                        </div>
                                    )}

                                    {/* Terms Checkbox */}
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative mt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={acceptTerms}
                                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${acceptTerms
                                                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-transparent'
                                                    : 'border-white/20 group-hover:border-purple-500/50'
                                                }`}>
                                                {acceptTerms && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-sm text-slate-400">
                                            <Link to="/terms" className="text-purple-400 hover:text-purple-300">Kullanım Şartları</Link>
                                            {' '}ve{' '}
                                            <Link to="/privacy" className="text-purple-400 hover:text-purple-300">KVKK Politikası</Link>
                                            'nı kabul ediyorum
                                        </span>
                                    </label>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading || !acceptTerms}
                                        className="group relative w-full h-12 rounded-xl font-semibold text-white overflow-hidden disabled:opacity-60 transition-all duration-300"
                                    >
                                        {/* Button gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 transition-all duration-300 group-hover:scale-105" />

                                        {/* Shine effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                        {/* Button content */}
                                        <div className="relative flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Hesap oluşturuluyor...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Ücretsiz Başla</span>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>

                                {/* Login Link */}
                                <p className="text-center mt-6 text-sm text-slate-400">
                                    Zaten hesabınız var mı?{' '}
                                    <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                                        Giriş Yapın
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer - Trust Badges */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-slate-500">SSL</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs text-slate-500">KVKK</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-400" />
                                <span className="text-xs text-slate-500">4.9/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
