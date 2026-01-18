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
    Users,
    CheckCircle2
} from 'lucide-react'
import { socialProviders } from '../data/authProviders'

const heroHighlights = [
    {
        title: 'Proje özet panoları',
        description: 'Ürün stratejisi, sprint notları ve CV taslaklarını aynı brief ekranında toplayın.',
        icon: Sparkles
    },
    {
        title: 'Güvenli proje erişimi',
        description: 'ISO uyumlu paylaşımlar ve rol bazlı izinlerle ekip dışı paylaşımları yönetin.',
        icon: ShieldCheck
    },
    {
        title: 'Ekip senkronizasyonu',
        description: 'Premium hesaplar 5 kişilik proje odalarında gerçek zamanlı düzenleme yapabilir.',
        icon: Users
    },
    {
        title: 'Paneller arası geçiş',
        description: 'Dashboard, Admin ve Enterprise panelleri arasında tek tıkla dolaşın.',
        icon: CheckCircle2
    }
]

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [socialLoading, setSocialLoading] = useState(null)
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'night'
        const stored = window.localStorage.getItem('CVniz-home-theme')
        return stored === 'day' || stored === 'night' ? stored : 'night'
    })
    const { login, socialLogin } = useAuth()
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
        ? 'bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900'
        : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white'
    const glowLayerClass = isDayMode ? 'opacity-40' : 'opacity-30'
    const heroTagClass = isDayMode
        ? 'bg-sky-100 border-sky-200 text-sky-700'
        : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
    const heroParagraphClass = isDayMode ? 'text-slate-600' : 'text-slate-300'
    const highlightCardClass = isDayMode
        ? 'border-slate-200 bg-white/80 text-slate-900'
        : 'border-white/10 bg-white/5 text-white'
    const highlightDescriptionClass = isDayMode ? 'text-slate-600' : 'text-slate-300'
    const highlightIconShell = isDayMode ? 'bg-sky-100 text-sky-600' : 'bg-white/10 text-cyan-300'
    const statsMutedClass = isDayMode ? 'text-slate-400' : 'text-slate-400'
    const statsNumberClass = isDayMode ? 'text-slate-900' : 'text-white'
    const heroLinkShell = isDayMode ? 'bg-white/80 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/80'
    const contentCardGradient = isDayMode
        ? 'bg-gradient-to-br from-white via-slate-50 to-sky-50'
        : 'bg-gradient-to-br from-sky-50 via-white to-indigo-50'
    const dividerBorderClass = isDayMode ? 'border-slate-200' : 'border-white/10'

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
        <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${backgroundClass}`}>
            <div className={`absolute inset-0 pointer-events-none ${glowLayerClass}`}>
                {isDayMode ? (
                    <>
                        <div className="absolute -top-16 -left-10 w-[28rem] h-[28rem] bg-sky-200/60 blur-[180px]" />
                        <div className="absolute top-32 right-0 w-[22rem] h-[22rem] bg-amber-100/50 blur-[160px]" />
                        <div className="absolute bottom-0 left-1/3 w-[26rem] h-[26rem] bg-slate-200/40 blur-[200px]" />
                    </>
                ) : (
                    <>
                        <div className="absolute -top-32 -left-16 w-96 h-96 bg-cyan-500/30 blur-[140px]" />
                        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-blue-600/20 blur-[170px]" />
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
                            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">CVniz Workspace</p>
                            <p className="text-sm text-slate-500">Proje & kariyer platformu</p>
                        </div>
                    </Link>

                    <div className="space-y-5">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm ${heroTagClass}`}>
                            Microsoft Project Workspace hissi
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-semibold leading-tight">
                            Tek oturumla <span className="gradient-text">tüm CVniz ürünlerine</span> erişin
                        </h1>
                        <p className={`text-lg max-w-xl ${heroParagraphClass}`}>
                            Proje panoları, CV editörü ve enterprise raporlarına aynı oturumla bağlanın; tema ve erişim politikaları ekip genelinde otomatik senkronize olsun.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {heroHighlights.map(({ title, description, icon: Icon }) => (
                            <div key={title} className={`rounded-3xl p-5 space-y-2 border ${highlightCardClass}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${highlightIconShell}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <p className="font-semibold">{title}</p>
                                <p className={`text-sm ${highlightDescriptionClass}`}>{description}</p>
                            </div>
                        ))}
                    </div>

                    <div className={`flex flex-wrap items-center gap-6 pt-4 border-t text-sm ${dividerBorderClass}`}>
                        <div>
                            <p className={`text-3xl font-semibold ${statsNumberClass}`}>250K+</p>
                            <p className={`uppercase tracking-[0.4em] text-xs ${statsMutedClass}`}>aktif kullanıcı</p>
                        </div>
                        <div>
                            <p className={`text-3xl font-semibold ${statsNumberClass}`}>9/10</p>
                            <p className={`uppercase tracking-[0.4em] text-xs ${statsMutedClass}`}>memnuniyet</p>
                        </div>
                        <div className={`flex items-center gap-3 ${heroParagraphClass}`}>
                            <ShieldCheck className={`w-5 h-5 ${isDayMode ? 'text-emerald-500' : 'text-emerald-300'}`} />
                            <span>ISO 27001 uyumlu şifreleme</span>
                        </div>
                    </div>
                </section>

                <section className="flex-1 w-full">
                    <div className="bg-white text-slate-900 rounded-[32px] p-10 shadow-[0_40px_120px_-60px_rgba(15,23,42,0.8)] relative overflow-hidden">
                        <div className={`absolute inset-0 ${contentCardGradient}`} />
                        <div className="absolute right-6 top-6 w-20 h-20 bg-gradient-to-br from-sky-400/30 to-indigo-500/30 blur-3xl" />
                        <div className="relative space-y-8">
                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-[0.5em] text-slate-500">CVniz identity</p>
                                <h2 className="text-3xl font-semibold">Giriş paneli</h2>
                                <p className="text-slate-500">Kurumsal hesabınızla devam edin veya sosyal oturum açmayı kullanın.</p>
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
                                            onClick={() => handleSocialLogin(provider)}
                                            disabled={socialLoading !== null}
                                            className={`h-12 rounded-2xl border text-sm font-medium flex items-center justify-center transition ${provider.bgColor} ${provider.textColor} disabled:opacity-50`}
                                            title={`${provider.name} ile devam et`}
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

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <label className="font-medium text-slate-600">Şifre</label>
                                        <Link to="/support" className="text-sky-600 hover:text-sky-500">Şifremi unuttum</Link>
                                    </div>
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold py-3 flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 disabled:opacity-60"
                                >
                                    {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>

                            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-700">Admin demo</p>
                                    <p className="text-xs">admin@CVniz.com / admin123</p>
                                </div>
                                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Sadece test</span>
                            </div>

                            <p className="text-center text-sm text-slate-500">
                                Hesabınız yok mu?{' '}
                                <Link to="/register" className="text-sky-600 font-semibold">Kayıt olun</Link>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

