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
    Layers,
    Globe2,
    ShieldCheck
} from 'lucide-react'
import { socialProviders } from '../data/authProviders'

const onboardingHighlights = [
    {
        title: 'Proje brief sihirbazı',
        description: 'AI destekli sorularla projelerinizin kapsamını, katkılarınızı ve metrikleri çıkarın.',
        icon: Sparkles
    },
    {
        title: 'Sprint uyumlu panolar',
        description: 'Her CV taslağını sprint notları, görev listeleri ve tasarım onaylarıyla bağlayın.',
        icon: Layers
    },
    {
        title: 'Global proje kitleri',
        description: '40+ dilde hazır proje özetleri, OKR blokları ve sektör bazlı başarı hikayeleri.',
        icon: Globe2
    },
    {
        title: 'Güvenli teslim',
        description: 'Sıfır bilgi şifreleme, yerel önbellek ve zaman damgalı paylaşım linkleri.',
        icon: ShieldCheck
    }
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
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'night'
        const stored = window.localStorage.getItem('CVniz-home-theme')
        return stored === 'day' || stored === 'night' ? stored : 'night'
    })
    const { register, socialLogin } = useAuth()
    const navigate = useNavigate()
    const isDayMode = theme === 'day'

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem('CVniz-home-theme')
        if (stored === 'day' || stored === 'night') {
            setTheme(stored)
        }
        const handleThemeChange = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handleThemeChange)
        return () => window.removeEventListener('CVniz-theme-change', handleThemeChange)
    }, [])

    const backgroundClass = isDayMode
        ? 'bg-gradient-to-br from-slate-50 via-white to-rose-50 text-slate-900'
        : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
    const glowLayerClass = isDayMode ? 'opacity-45' : 'opacity-30'
    const heroLinkShell = isDayMode ? 'bg-white/80 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/80'
    const heroTagClass = isDayMode ? 'bg-rose-100 border-rose-200 text-rose-700' : 'bg-white/10 border-white/20 text-white/80'
    const heroParagraphClass = isDayMode ? 'text-slate-600' : 'text-slate-300'
    const highlightCardClass = isDayMode ? 'border-slate-200 bg-white/80 text-slate-900' : 'border-white/10 bg-white/5 text-white'
    const highlightIconShell = isDayMode ? 'bg-rose-100 text-rose-600' : 'bg-white/10 text-cyan-300'
    const highlightDescriptionClass = isDayMode ? 'text-slate-600' : 'text-slate-300'
    const chipClass = isDayMode ? 'border-slate-200 bg-white/80 text-slate-600' : 'border-white/10 bg-white/5 text-slate-300'
    const dividerBorderClass = isDayMode ? 'border-slate-200' : 'border-white/10'
    const contentCardGradient = isDayMode
        ? 'bg-gradient-to-br from-white via-slate-50 to-sky-50'
        : 'bg-gradient-to-br from-white via-slate-50 to-sky-50'

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

    return (
        <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${backgroundClass}`}>
            <div className={`absolute inset-0 pointer-events-none ${glowLayerClass}`}>
                {isDayMode ? (
                    <>
                        <div className="absolute top-12 right-0 w-[30rem] h-[30rem] bg-rose-100/70 blur-[210px]" />
                        <div className="absolute -bottom-20 -left-10 w-[26rem] h-[26rem] bg-sky-200/60 blur-[170px]" />
                    </>
                ) : (
                    <>
                        <div className="absolute top-10 right-0 w-[34rem] h-[34rem] bg-purple-600/20 blur-[200px]" />
                        <div className="absolute -bottom-24 -left-10 w-[28rem] h-[28rem] bg-cyan-500/25 blur-[150px]" />
                    </>
                )}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
                <section className="flex-1 space-y-10">
                    <Link to="/" className={`inline-flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur border ${heroLinkShell}`}>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-900" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">CVniz Teams</p>
                            <p className="text-sm text-slate-500">Kariyer proje alanı</p>
                        </div>
                    </Link>

                    <div className="space-y-5">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm ${heroTagClass}`}>
                            Proje odaklı onboarding
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
                            <span className="gradient-text">Microsoft 365</span> ruhunu taşıyan kayıt deneyimi
                        </h1>
                        <p className={`text-lg max-w-xl ${heroParagraphClass}`}>
                            CVniz Proje Alanınızı açın, tema tercihini senkronize edin ve tüm ürünlerde tek kimlikle ilerleyin. Sprint notlarınızı, proje ölçümlerinizi ve başarı hikayelerinizi aynı yerde düzenleyin.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {onboardingHighlights.map(({ title, description, icon: Icon }) => (
                            <div key={title} className={`rounded-3xl p-5 space-y-2 border ${highlightCardClass}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${highlightIconShell}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p className="font-semibold">{title}</p>
                                <p className={`text-sm ${highlightDescriptionClass}`}>{description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className={`px-4 py-2 rounded-2xl border ${chipClass}`}>
                            Global 200+ şirket tarafından tercih edildi
                        </div>
                        <div className={`px-4 py-2 rounded-2xl border ${chipClass}`}>
                            14 gün premium deneme otomatik başlar
                        </div>
                    </div>
                </section>

                <section className="flex-1 w-full">
                    <div className="bg-white text-slate-900 rounded-[32px] p-10 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.8)] relative overflow-hidden">
                        <div className={`absolute inset-0 ${contentCardGradient}`} />
                        <div className="absolute -left-6 -top-6 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-sky-400/30 blur-3xl" />
                        <div className="relative space-y-8">
                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-[0.5em] text-slate-500">CVniz identity</p>
                                <h2 className="text-3xl font-semibold">Hesap oluştur</h2>
                                <p className="text-slate-500">Kurumsal e-posta veya sosyal hesapla 1 dakikada kayıt ol.</p>
                            </div>

                            {error && (
                                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-4 gap-3">
                                {socialProviders.map((provider) => {
                                    const Icon = provider.icon
                                    return (
                                        <button
                                            key={provider.id}
                                            onClick={() => handleSocialRegister(provider)}
                                            disabled={socialLoading !== null}
                                            className={`h-12 rounded-2xl border text-sm font-medium flex items-center justify-center transition ${provider.bgColor} ${provider.textColor} disabled:opacity-50`}
                                            title={`${provider.name} ile kayıt ol`}
                                        >
                                            {socialLoading === provider.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon />}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-400">
                                <div className="h-px flex-1 bg-slate-200" />
                                <span className="tracking-[0.3em] uppercase">veya mail ile</span>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600">Ad Soyad</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Adınız Soyadınız"
                                            className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-600">E-posta</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ad.soyad@firma.com"
                                            className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600">Şifre</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-600">Şifre Tekrar</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold py-3 flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 disabled:opacity-60"
                                >
                                    {loading ? 'Kayıt olunuyor…' : 'Kayıt Ol'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>

                            <p className="text-xs text-slate-400 text-center">
                                Kayıt olarak Hizmet Şartları ve KVKK politikasını kabul etmiş olursunuz.
                            </p>

                            <p className="text-center text-sm text-slate-500">
                                Zaten hesabınız var mı?{' '}
                                <Link to="/login" className="text-sky-600 font-semibold">Giriş yapın</Link>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

