import { Link } from 'react-router-dom'
import { Sparkles, FileText, Download, Zap, Shield, Clock, Users, Check, Palette, Languages, Share2, TrendingUp, Award, Target, ArrowRight, Rocket, Heart, Play, Minus, X, CheckCircle } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

// Animated Counter
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(null)
    const hasStarted = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasStarted.current) {
                    hasStarted.current = true
                    const start = Date.now()
                    const timer = setInterval(() => {
                        const now = Date.now()
                        const progress = Math.min((now - start) / duration, 1)
                        setCount(Math.floor(end * progress))
                        if (progress === 1) clearInterval(timer)
                    }, 16)
                }
            },
            { threshold: 0.1 }
        )
        if (countRef.current) observer.observe(countRef.current)
        return () => observer.disconnect()
    }, [end, duration])

    return <span ref={countRef}>{count}{suffix}</span>
}

const features = [
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: 'AI Destekli İçerik',
        description: 'Yapay zeka ile profesyonel özet ve iş deneyimi açıklamaları oluşturun. Sektörünüze özel anahtar kelimeler otomatik eklenir.',
        color: 'from-cyan-500 to-slate-800',
        details: 'GPT güçlendirilen metinler'
    },
    {
        icon: <FileText className="w-8 h-8" />,
        title: '65+ Premium Şablon',
        description: 'Her sektör için özel tasarlanmış profesyonel şablonlar. Sağlık, Finans, Teknoloji, Hukuk ve daha fazlası.',
        color: 'from-cyan-400 to-slate-700',
        details: 'ATS uyumlu tasarımlar'
    },
    {
        icon: <Download className="w-8 h-8" />,
        title: 'PDF Dışa Aktar',
        description: '300 DPI kalitesinde, baskıya hazır PDF dosyaları. ATS uyumlu formatlar ile başvurularınız öne çıksın.',
        color: 'from-slate-200 to-cyan-300',
        details: 'Hızlı ve kolay indirme'
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Canlı Önizleme',
        description: 'Değişikliklerinizi anında görün. Split-screen editör ile hızlı ve verimli CV hazırlayın.',
        color: 'from-cyan-300 to-slate-200',
        details: 'Anlık güncellenen tasarım'
    },
    {
        icon: <Palette className="w-8 h-8" />,
        title: 'Renk Özelleştirme',
        description: 'Şablonların renklerini kişiselleştirin. Marka renklerinize uygun CV\'ler oluşturun.',
        color: 'from-cyan-500 to-slate-800',
        details: '100+ renk seçeneği'
    },
    {
        icon: <Languages className="w-8 h-8" />,
        title: 'Çoklu Dil Desteği',
        description: 'Türkçe ve İngilizce CV\'ler oluşturun. Uluslararası iş başvuruları için hazır.',
        color: 'from-cyan-400 to-slate-700',
        details: 'Global standartlara uygun'
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: 'Veri Güvenliği',
        description: 'Tüm verileriniz tarayıcınızda kalır. SSL şifreleme ile %100 gizlilik garantisi.',
        color: 'from-cyan-500 to-slate-800',
        details: 'Gizlilik odaklı altyapı'
    },
    {
        icon: <Share2 className="w-8 h-8" />,
        title: 'Hızlı Paylaşım',
        description: 'CV\'nizi doğrudan e-posta ile gönderin veya link olarak paylaşın.',
        color: 'from-cyan-300 to-slate-200',
        details: 'Sosyal medya entegrasyonu'
    }
]

export default function FeaturesPage() {
    const [theme, setTheme] = useState('day')
    const isDayMode = theme === 'day'

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem('CVniz-home-theme')
        if (stored === 'day' || stored === 'night') {
            setTheme(stored)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const handleThemeChange = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handleThemeChange)
        return () => window.removeEventListener('CVniz-theme-change', handleThemeChange)
    }, [])

    const mutedText = isDayMode ? 'text-slate-600' : 'text-gray-400'
    const heroBadgeClasses = isDayMode
        ? 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-sky-200 text-sky-600 shadow-sm'
        : 'inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-cyan-500/20 text-cyan-300'
    const secondaryCtaClasses = isDayMode
        ? 'px-10 py-4 rounded-xl border border-slate-200 bg-white/90 text-slate-800 hover:border-sky-300 hover:shadow-lg transition-all flex items-center gap-2'
        : 'px-10 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 hover:border-cyan-500/30'

    return (
        <div className={`min-h-screen selection:bg-cyan-500/30 overflow-x-hidden ${isDayMode ? 'bg-gradient-to-b from-sky-50 via-white to-amber-50 text-slate-900' : 'bg-slate-950 text-white'}`}>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] -z-10 animate-pulse ${isDayMode ? 'bg-sky-200/60' : 'bg-cyan-500/10'}`}></div>
                <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] -z-10 ${isDayMode ? 'bg-amber-100/60' : 'bg-cyan-500/5'}`}></div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="fade-in">
                            <div className={`${heroBadgeClasses} mb-6 text-sm font-semibold uppercase tracking-wider`}>
                                <Sparkles className={`w-4 h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                                <span>Geleceğin CV Platformu</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
                                <span className={isDayMode ? 'text-slate-900' : 'text-white'}>Kariyerinizi </span>
                                <span className="gradient-text">Yapay Zeka</span>
                                <span className={isDayMode ? 'text-slate-900' : 'text-white'}> İle Tasarlayın</span>
                            </h1>
                            <p className={`text-xl mb-10 leading-relaxed max-w-xl ${mutedText}`}>
                                CVniz, geleneksel özgeçmiş hazırlama sürecini modern teknolojiyle birleştirir.
                                En iyi sonuçlar için optimize edilmiş profesyonel araçlarla öne çıkın.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/editor" className="btn-premium text-lg px-10 py-4 flex items-center gap-2 group">
                                    <Rocket className="w-5 h-5" /> Ücretsiz Başla
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button className={secondaryCtaClasses}>
                                    <Play className={`w-5 h-5 ${isDayMode ? 'text-sky-500 fill-sky-500' : 'text-cyan-400 fill-cyan-400'}`} />
                                    <span className="font-semibold">Tanıtımı İzle</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative group perspective-1000 hidden lg:block">
                            <div className="relative z-10 animate-float">
                                <div className="glass-card p-2 rounded-[2rem] border-cyan-500/20 shadow-2xl">
                                    <img
                                        src="/images/resume474544.png"
                                        alt="CV Template"
                                        className="rounded-[1.5rem] w-full h-auto group-hover:rotate-y-6 transition-transform duration-700"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 glass-card p-6 rounded-2xl animate-float-delayed shadow-2xl border-cyan-500/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xl">
                                            AI
                                        </div>
                                        <div>
                                            <p className="font-bold">Akıllı İçerik</p>
                                            <p className="text-sm text-cyan-400">Yazım Desteği Aktif</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -inset-10 bg-cyan-500/10 blur-[100px] -z-10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Template Gallery */}
            <section className={`py-24 px-6 lg:px-12 ${isDayMode ? 'bg-white/90 border-y border-slate-200/70 shadow-day' : 'bg-white/[0.01] border-y border-white/5'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="gradient-text">Profesyonel Şablon Galerisi</span>
                        </h2>
                        <p className={`${mutedText} max-w-2xl mx-auto text-lg`}>
                            Her sektör ve deneyim seviyesi için özenle hazırlanmış 40'tan fazla ATS uyumlu premium tasarım.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            '/images/resume689896.png',
                            '/images/resume656564.png',
                            '/images/resume565656.png',
                            '/images/resume457874.png',
                            '/images/resume65677.png',
                            '/images/resume98956.png',
                            '/images/resume6544.png',
                            '/images/resume689.png'
                        ].map((src, i) => (
                            <div
                                key={i}
                                className={`group relative rounded-xl overflow-hidden aspect-[3/4] transition-all hover:scale-[1.02] shadow-xl border ${isDayMode ? 'border-slate-200/70 hover:border-sky-300 bg-white' : 'border-white/10 hover:border-cyan-500/50'}`}
                            >
                                <img src={src} alt="Template" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 ${isDayMode ? 'bg-gradient-to-t from-white via-white/70 to-transparent' : 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent'}`}>
                                    <Link to="/editor" className="w-full py-4 bg-cyan-500 text-slate-950 font-bold rounded-xl text-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        Bu Şablonu Kullan
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Block */}
            <section className={`py-20 ${isDayMode ? 'bg-gradient-to-b from-white via-sky-50/70 to-transparent' : ''}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { label: 'Başarılı Üye', value: 50000, suffix: '+' },
                            { label: 'Memnuniyet', value: 95, suffix: '%' },
                            { label: 'Premium Şablon', value: 40, suffix: '+' },
                            { label: 'Hazırlama Süresi', value: 3, suffix: ' dk' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold gradient-text mb-3">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className={`${isDayMode ? 'text-slate-500' : 'text-gray-500'} font-bold tracking-widest uppercase text-xs`}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="gradient-text">Güçlü Özellikler</span>
                        </h2>
                        <p className={`${mutedText} max-w-2xl mx-auto text-lg leading-relaxed`}>
                            Kariyerinizde fark yaratacak, her aşaması düşünülmüş profesyonel araç seti.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group glass-card rounded-2xl p-8 hover:bg-white/[0.04] transition-all duration-500 border-white/5 hover:border-cyan-500/30"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 ring-1 ring-white/10 group-hover:scale-110 transition-transform`}>
                                    <div className="text-slate-950">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-4 group-hover:text-cyan-300 transition-colors">{feature.title}</h3>
                                <p className={`${mutedText} leading-relaxed mb-6 text-sm`}>{feature.description}</p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/5 px-3 py-2 rounded-lg border border-cyan-500/10 w-fit">
                                    <CheckCircle className="w-3 h-3" />
                                    {feature.details}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Spotlight */}
            <section className="py-28 px-6 lg:px-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="glass-card rounded-[32px] p-8 border-cyan-500/20 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-white/5 rounded-full w-full"></div>
                                        <div className="h-4 bg-cyan-500/20 rounded-full w-4/5 border border-cyan-500/30"></div>
                                        <div className="h-4 bg-white/5 rounded-full w-2/3"></div>
                                    </div>
                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-4 bg-cyan-500/10 rounded-2xl p-4 border border-cyan-500/20">
                                            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-cyan-300 font-black mb-1 uppercase tracking-tighter">AI Özet Oluşturuluyor</div>
                                                <div className="h-1.5 bg-cyan-400/30 rounded-full w-32 overflow-hidden">
                                                    <div className="h-full bg-cyan-400 w-1/2 animate-shimmer"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 font-bold text-[10px] uppercase tracking-widest ${isDayMode ? 'bg-white/80 border border-slate-200 text-sky-600 shadow-sm' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'}`}>
                                TECHNOLOGY
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                                Akıllı <span className="gradient-text">İçerik Üretimi</span><br />
                                İle Saniyeler İçinde
                            </h2>
                            <p className={`text-lg ${mutedText} mb-10 leading-relaxed`}>
                                Yapay zeka teknolojimiz, iş geçmişinizi analiz eder ve sizi işverenlerin gözünde en iyi şekilde temsil edecek
                                anahtar kelimelerle dolu, profesyonel bir özet hazırlar.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8">
                                {[
                                    { title: 'Sektör Odaklı', text: '40’tan fazla sektöre özel metin kütüphanesi.' },
                                    { title: 'Otomatik Düzenleme', text: 'Dilbilgisi ve üslup hatalarını anında giderir.' },
                                    { title: 'Farklı Üsluplar', text: 'Yaratıcı, kurumsal veya teknik ton seçimi.' },
                                    { title: 'Kişisel Veri', text: 'Sizin verilerinizle beslenen özel öneriler.' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className={`font-bold flex items-center gap-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                            <Target className="w-4 h-4 text-cyan-500" /> {item.title}
                                        </div>
                                        <p className={`text-sm ${mutedText}`}>{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Explorer */}
            <section className={`py-24 px-6 lg:px-12 ${isDayMode ? 'bg-white border-y border-slate-200/70 shadow-day' : 'bg-white/[0.01]'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Kategoriler ile Keşfedin</h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                title: 'Tasarım & Estetik',
                                icon: <Palette className="w-8 h-8" />,
                                description: 'Sanatsal dokunuşlar ve modern estetik ile diğerlerinden ayrılın.',
                                features: ['Dinamik Renk Paletleri', 'Özel Tipografi', 'Yüksek Çözünürlüklü Çıktı']
                            },
                            {
                                title: 'Akıllı Yazım',
                                icon: <Sparkles className="w-8 h-8" />,
                                description: 'AI ile güçlendirilmiş metinlerle profesyonelliğinizi yansıtın.',
                                features: ['Akıllı Özet Oluşturucu', 'Sektöre Özel Terimler', 'Otomatik Yazım Denetimi']
                            },
                            {
                                title: 'Güvenli Paylaşım',
                                icon: <Shield className="w-8 h-8" />,
                                description: 'Verileriniz güvende, CV\'niz her an her yerde ulaşılabilir.',
                                features: ['Uçtan Uca Şifreleme', 'Hızlı Link Paylaşımı', 'Bulut Senkronizasyonu']
                            }
                        ].map((cat, i) => (
                            <div key={i} className={`group glass-card rounded-[32px] p-10 hover:border-cyan-500/30 transition-all duration-500 ${isDayMode ? 'border-slate-200/70' : 'border-white/5'}`}>
                                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${isDayMode ? 'bg-white text-sky-600 border-slate-200/70 shadow-day' : 'bg-slate-900 border-white/10 text-cyan-400'}`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{cat.title}</h3>
                                <p className={`${mutedText} mb-8 text-sm leading-relaxed`}>{cat.description}</p>
                                <ul className="space-y-4">
                                    {cat.features.map((f, j) => (
                                        <li key={j} className={`flex items-center gap-4 ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDayMode ? 'bg-sky-100 text-sky-600' : 'bg-cyan-500/20'}`}>
                                                <Check className={`w-3 h-3 ${isDayMode ? '' : 'text-cyan-400'}`} />
                                            </div>
                                            <span className="text-sm font-medium">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className={`py-28 px-6 lg:px-12 ${isDayMode ? 'bg-slate-50 border-y border-slate-200/70' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="gradient-text">Neden CVniz?</span>
                        </h2>
                        <p className={`${mutedText} max-w-2xl mx-auto text-lg`}>
                            Eski yöntemlerle zaman kaybetmeyin. Profesyonel bir CV hazırlamanın en etkili yolu.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className={`glass-card rounded-[32px] p-10 transition-all ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day hover:border-red-400/40' : 'border-red-500/10 group hover:border-red-500/20'}`}>
                            <h3 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDayMode ? 'text-rose-500' : 'text-red-400'}`}>
                                <X className="w-6 h-6" /> Eski Yöntemler
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    'Karmaşık dosya formatlarıyla saatlerce uğraşmak',
                                    'Sürekli kayan tasarım ve format hataları',
                                    'ATS sistemlerinden geçemeyen zayıf şablonlar',
                                    'Kendini ifade etmekte zorlanan statik metinler'
                                ].map((item, i) => (
                                    <li key={i} className={`flex items-start gap-4 text-sm ${isDayMode ? 'text-slate-600' : 'text-gray-500'}`}>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDayMode ? 'bg-rose-100 text-rose-500' : 'bg-red-500/10'}`}>
                                            <Minus className={`w-3 h-3 ${isDayMode ? '' : 'text-red-500/50'}`} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={`glass-card rounded-[32px] p-10 group transition-all shadow-2xl ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day hover:border-cyan-500/40' : 'border-cyan-500/30 bg-cyan-500/[0.03] hover:border-cyan-500/50'}`}>
                            <h3 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${isDayMode ? 'text-sky-600' : 'text-cyan-400'}`}>
                                <Check className="w-6 h-6" /> CVniz İle
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    '5 dakikada profesyonel ve modern bir tasarım',
                                    'Akıllı editör ile hatasız ve kusursuz format',
                                    '%100 ATS uyumlu, işveren onaylı şablonlar',
                                    'AI desteğiyle hazırlanan güçlü ve ikna edici içerikler'
                                ].map((item, i) => (
                                    <li key={i} className={`flex items-start gap-4 text-sm ${isDayMode ? 'text-slate-700' : 'text-white'}`}>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDayMode ? 'bg-sky-100 text-sky-600' : 'bg-cyan-500/20'}`}>
                                            <Check className={`w-3 h-3 ${isDayMode ? '' : 'text-cyan-400'}`} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className={`py-24 border-y ${isDayMode ? 'bg-white border-slate-200/70' : 'border-white/5 bg-black/20'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <p className={`text-center text-[10px] font-black tracking-[0.3em] uppercase mb-16 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        KULLANICILARIMIZ DÜNYANIN EN İYİLERİNDE
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {['Google', 'Netflix', 'Amazon', 'Meta', 'Microsoft', 'Tesla'].map((brand, i) => (
                            <span key={i} className={`text-2xl font-black transition-colors cursor-default tracking-tighter italic ${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-white hover:text-cyan-400'}`}>
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className={`py-32 px-6 lg:px-12 relative overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-slate-50 to-white border-t border-slate-200/70' : ''}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[140px] -z-10 animate-pulse ${isDayMode ? 'bg-cyan-500/5' : 'bg-cyan-500/10'}`}></div>
                <div className="max-w-5xl mx-auto">
                    <div className={`glass-card rounded-[48px] p-16 md:p-24 relative overflow-hidden text-center shadow-2xl ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day' : 'border-cyan-500/30'}`}>
                        <div className={`absolute inset-0 -z-10 ${isDayMode ? 'bg-gradient-to-br from-white via-slate-50 to-white' : 'bg-gradient-to-br from-slate-950 to-slate-900'}`}></div>
                        <div className="relative z-10">
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl border ${isDayMode ? 'bg-sky-50 border-slate-200/70 text-sky-600 shadow-day' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                                <Award className="w-10 h-10" />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                                Kariyerinizde <br />
                                <span className="gradient-text">Yeni Bir Bölüm</span>
                            </h2>
                            <p className={`text-xl ${mutedText} mb-12 max-w-2xl mx-auto`}>
                                Profesyoneller tarafından onaylanmış bir özgeçmişle hayalinizdeki işe bir adım daha yaklaşın.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link to="/editor" className="btn-premium text-xl px-12 py-5 inline-flex items-center gap-3 group w-full sm:w-auto shadow-2xl">
                                    <Heart className="w-6 h-6" /> Ücretsiz Oluştur
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/templates" className={`transition-colors flex items-center gap-2 group text-lg font-semibold px-8 py-4 ${isDayMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}>
                                    Şablonları İncele <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

