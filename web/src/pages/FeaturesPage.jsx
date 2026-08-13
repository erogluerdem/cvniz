import { Link } from 'react-router-dom'
import { Sparkles, FileText, Download, Zap, Shield, Clock, Users, Check, Palette, Languages, Share2, TrendingUp, Award, Target, ArrowRight, Rocket, Heart, Play, Minus, X, CheckCircle } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import VideoPlayerModal from '../components/VideoPlayerModal'

// Custom hook for scroll animations
function useScrollAnimation() {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return [ref, isVisible]
}

// Animated Section Wrapper
function AnimatedSection({ children, className = '', delay = 0 }) {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    )
}

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
        icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
        title: 'AI Destekli İçerik',
        description: 'Yapay zeka ile profesyonel özet ve iş deneyimi açıklamaları oluşturun. Sektörünüze özel anahtar kelimeler otomatik eklenir.',
        color: 'from-cyan-400 to-blue-600',
        details: 'GPT güçlendirilen metinler'
    },
    {
        icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />,
        title: '65+ Premium Şablon',
        description: 'Her sektör için özel tasarlanmış profesyonel şablonlar. Sağlık, Finans, Teknoloji, Hukuk ve daha fazlası.',
        color: 'from-purple-500 to-pink-500',
        details: 'ATS uyumlu tasarımlar'
    },
    {
        icon: <Download className="w-6 h-6 md:w-8 md:h-8" />,
        title: 'PDF Dışa Aktar',
        description: '300 DPI kalitesinde, baskıya hazır PDF dosyaları. ATS uyumlu formatlar ile başvurularınız öne çıksın.',
        color: 'from-amber-400 to-orange-500',
        details: 'Hızlı ve kolay indirme'
    },
    {
        icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
        title: 'Canlı Önizleme',
        description: 'Değişikliklerinizi anında görün. Split-screen editör ile hızlı ve verimli CV hazırlayın.',
        color: 'from-emerald-400 to-teal-500',
        details: 'Anlık güncellenen tasarım'
    },
    {
        icon: <Palette className="w-6 h-6 md:w-8 md:h-8" />,
        title: 'Renk Özelleştirme',
        description: 'Şablonların renklerini kişiselleştirin. Marka renklerinize uygun CV\'ler oluşturun.',
        color: 'from-sky-400 to-indigo-500',
        details: '100+ renk seçeneği'
    },
    {
        icon: <Languages className="w-6 h-6 md:w-8 md:h-8" />,
        title: 'Çoklu Dil Desteği',
        description: 'Türkçe ve İngilizce CV\'ler oluşturun. Uluslararası iş başvuruları için hazır.',
        color: 'from-rose-400 to-red-500',
        details: 'Global standartlara uygun'
    },
    {
        icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
        title: 'Veri Güvenliği',
        description: 'Tüm verileriniz tarayıcınızda kalır. SSL şifreleme ile %100 gizlilik garantisi.',
        color: 'from-blue-400 to-cyan-500',
        details: 'Gizlilik odaklı altyapı'
    },
    {
        icon: <Share2 className="w-6 h-6 md:w-8 md:h-8" />,
        title: 'Hızlı Paylaşım',
        description: 'CV\'nizi doğrudan e-posta ile gönderin veya link olarak paylaşın.',
        color: 'from-fuchsia-400 to-purple-600',
        details: 'Sosyal medya entegrasyonu'
    }
]

export default function FeaturesPage() {
    const [theme, setTheme] = useState('day')
    const [videoModalOpen, setVideoModalOpen] = useState(false)
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
        ? 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-200 text-sky-600 shadow-sm'
        : 'inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-cyan-500/20 text-cyan-300'
    const secondaryCtaClasses = isDayMode
        ? 'px-10 py-4 rounded-xl md:rounded-[1.25rem] font-bold border-2 border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-600 hover:shadow-lg transition-all flex items-center gap-2 justify-center w-full sm:w-auto'
        : 'px-10 py-4 rounded-xl md:rounded-[1.25rem] font-bold border-2 border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 hover:border-cyan-500/30 text-white justify-center w-full sm:w-auto'

    return (
        <div className={`min-h-screen selection:bg-cyan-500/30 overflow-x-hidden transition-colors duration-500 ${isDayMode ? 'bg-slate-50 text-slate-900' : 'bg-[#0B1120] text-white'}`}>
            
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
                {/* Modern Orbs */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-60 ${isDayMode ? 'bg-sky-200' : 'bg-cyan-900/30'}`}></div>
                <div className={`absolute top-40 left-0 w-[400px] h-[400px] rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-60 ${isDayMode ? 'bg-amber-200' : 'bg-purple-900/20'}`}></div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <AnimatedSection className="fade-in">
                            <div className={`${heroBadgeClasses} mb-6 text-sm font-bold uppercase tracking-wider`}>
                                <Sparkles className={`w-4 h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                                <span>Geleceğin CV Platformu</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
                                <span className={isDayMode ? 'text-slate-900' : 'text-white'}>Kariyerinizi </span>
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-700' : 'from-cyan-400 to-purple-500'}`}>Yapay Zeka</span>
                                <span className={isDayMode ? 'text-slate-900' : 'text-white'}> İle Tasarlayın</span>
                            </h1>
                            <p className={`text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-xl ${mutedText}`}>
                                CVniz, geleneksel özgeçmiş hazırlama sürecini modern teknolojiyle birleştirir.
                                En iyi sonuçlar için optimize edilmiş profesyonel araçlarla öne çıkın.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/editor" className={`text-lg font-bold px-10 py-4 flex items-center justify-center gap-2 group transition-all duration-300 hover:scale-105 hover:-translate-y-1 rounded-xl md:rounded-[1.25rem] w-full sm:w-auto ${isDayMode ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_15px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_25px_50px_rgba(14,165,233,0.4)]' : 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50'}`}>
                                    <Rocket className="w-5 h-5" /> Ücretsiz Başla
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button onClick={() => setVideoModalOpen(true)} className={secondaryCtaClasses}>
                                    <Play className={`w-5 h-5 ${isDayMode ? 'text-sky-500 fill-sky-500' : 'text-cyan-400 fill-cyan-400'}`} />
                                    <span>Tanıtımı İzle</span>
                                </button>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection delay={200} className="relative group perspective-1000 hidden lg:block">
                            <div className="relative z-10 animate-float">
                                <div className={`p-2 rounded-[2.5rem] shadow-2xl transition-all duration-500 ${isDayMode ? 'bg-white border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.1)]' : 'glass-card border border-cyan-500/20'}`}>
                                    <img
                                        src="/images/resume474544.png"
                                        alt="CV Template"
                                        className="rounded-[2rem] w-full h-auto group-hover:-rotate-y-6 transition-transform duration-700"
                                    />
                                </div>
                                <div className={`absolute -bottom-6 -left-6 p-6 rounded-2xl animate-float-delayed shadow-2xl transition-colors duration-500 ${isDayMode ? 'bg-white border border-slate-200 shadow-[0_20px_40px_rgba(15,23,42,0.08)]' : 'glass-card border border-cyan-500/20'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg ${isDayMode ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-sky-500/30' : 'bg-cyan-500 text-slate-950'}`}>
                                            AI
                                        </div>
                                        <div>
                                            <p className={`font-black ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Akıllı İçerik</p>
                                            <p className={`text-sm font-bold ${isDayMode ? 'text-sky-600' : 'text-cyan-400'}`}>Yazım Desteği Aktif</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Template Gallery */}
            <AnimatedSection className={`py-24 px-6 lg:px-12 ${isDayMode ? 'bg-white border-y border-slate-200/70 shadow-sm' : 'border-y border-white/10'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-purple-400 to-pink-500'}`}>Profesyonel Şablon Galerisi</span>
                        </h2>
                        <p className={`${mutedText} max-w-2xl mx-auto text-lg font-medium`}>
                            Her sektör ve deneyim seviyesi için özenle hazırlanmış 40'tan fazla ATS uyumlu premium tasarım.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                                className={`group relative rounded-2xl md:rounded-[2rem] overflow-hidden aspect-[3/4] transition-all duration-500 hover:-translate-y-2 shadow-lg ${isDayMode ? 'border-[4px] border-slate-100 bg-white hover:shadow-[0_20px_40px_rgba(15,23,42,0.1)] hover:border-purple-200' : 'border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-black/50'}`}
                            >
                                <img src={src} alt={`Template ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 ${isDayMode ? 'bg-gradient-to-t from-white/90 via-white/50 to-transparent' : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'}`}>
                                    <Link to="/editor" className={`w-full py-3 md:py-4 font-bold rounded-xl text-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform text-sm md:text-base ${isDayMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'}`}>
                                        Bu Şablonu Kullan
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Stats Block */}
            <AnimatedSection className={`py-20 ${isDayMode ? 'bg-gradient-to-b from-white via-sky-50/50 to-transparent' : ''}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { label: 'Başarılı Üye', value: 50000, suffix: '+' },
                            { label: 'Memnuniyet', value: 95, suffix: '%' },
                            { label: 'Premium Şablon', value: 40, suffix: '+' },
                            { label: 'Hazırlama Süresi', value: 3, suffix: ' dk' }
                        ].map((stat, i) => (
                            <div key={i} className={`text-center p-6 rounded-3xl transition-all duration-300 ${isDayMode ? 'hover:bg-white hover:shadow-lg hover:shadow-slate-200/50' : 'hover:bg-white/5 hover:shadow-lg'}`}>
                                <div className={`text-4xl md:text-5xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-700' : 'from-cyan-400 to-purple-500'}`}>
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className={`${isDayMode ? 'text-slate-500' : 'text-gray-400'} font-bold tracking-widest uppercase text-[10px] md:text-xs`}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Features Grid */}
            <AnimatedSection className="py-24 px-6 lg:px-12 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-700' : 'from-cyan-400 to-purple-500'}`}>Güçlü Özellikler</span>
                        </h2>
                        <p className={`${mutedText} max-w-2xl mx-auto text-lg font-medium leading-relaxed`}>
                            Kariyerinizde fark yaratacak, her aşaması düşünülmüş profesyonel araç seti.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <AnimatedSection
                                key={index}
                                delay={index * 50}
                                className={`group rounded-[2rem] p-6 md:p-8 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${isDayMode ? 'bg-white border border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:border-sky-200' : 'glass-card border border-white/5 hover:border-cyan-500/30'}`}
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg ${isDayMode ? 'text-white' : 'text-white'}`}>
                                    {feature.icon}
                                </div>
                                <h3 className={`text-lg md:text-xl font-black mb-3 transition-colors ${isDayMode ? 'text-slate-800 group-hover:text-blue-700' : 'text-white group-hover:text-cyan-400'}`}>{feature.title}</h3>
                                <p className={`${mutedText} leading-relaxed mb-6 text-sm font-medium`}>{feature.description}</p>
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg border w-fit transition-colors ${isDayMode ? 'text-sky-600 bg-sky-50 border-sky-100 group-hover:bg-sky-100' : 'text-cyan-400 bg-cyan-500/5 border-cyan-500/10'}`}>
                                    <CheckCircle className="w-3 h-3" />
                                    {feature.details}
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* AI Spotlight */}
            <AnimatedSection className={`py-28 px-6 lg:px-12 relative overflow-hidden ${isDayMode ? 'bg-slate-100/50' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className={`absolute -inset-4 md:-inset-6 rounded-[3rem] blur-2xl transition-all duration-700 opacity-60 ${isDayMode ? 'bg-gradient-to-r from-sky-300 to-blue-300' : 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30'}`}></div>
                            <div className={`rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-2xl transition-colors duration-500 ${isDayMode ? 'bg-white border border-slate-200' : 'glass-card border border-cyan-500/20'}`}>
                                <div className="space-y-6 relative z-10">
                                    <div className={`flex items-center gap-3 border-b pb-4 ${isDayMode ? 'border-slate-100' : 'border-white/10'}`}>
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className={`h-4 rounded-full w-3/4 animate-pulse ${isDayMode ? 'bg-slate-200' : 'bg-white/5'}`}></div>
                                        <div className={`h-4 rounded-full w-full ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}></div>
                                        <div className={`h-4 rounded-full w-4/5 border ${isDayMode ? 'bg-sky-50 border-sky-100' : 'bg-cyan-500/20 border-cyan-500/30'}`}></div>
                                        <div className={`h-4 rounded-full w-2/3 ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}></div>
                                    </div>
                                    <div className={`pt-6 border-t ${isDayMode ? 'border-slate-100' : 'border-white/10'}`}>
                                        <div className={`flex items-center gap-4 rounded-2xl p-4 border ${isDayMode ? 'bg-sky-50 border-sky-100' : 'bg-cyan-500/10 border-cyan-500/20'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDayMode ? 'bg-sky-500 text-white' : 'bg-cyan-500 text-slate-950'}`}>
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className={`text-[10px] font-black mb-1 uppercase tracking-tighter ${isDayMode ? 'text-sky-600' : 'text-cyan-300'}`}>AI Özet Oluşturuluyor</div>
                                                <div className={`h-1.5 rounded-full w-32 overflow-hidden ${isDayMode ? 'bg-sky-200' : 'bg-cyan-400/30'}`}>
                                                    <div className={`h-full w-1/2 animate-shimmer ${isDayMode ? 'bg-sky-500' : 'bg-cyan-400'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 font-bold text-[10px] md:text-xs uppercase tracking-widest ${isDayMode ? 'bg-sky-100 border border-sky-200 text-sky-600 shadow-sm' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'}`}>
                                TECHNOLOGY
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">
                                Akıllı <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-cyan-600 to-blue-700' : 'from-cyan-400 to-purple-500'}`}>İçerik Üretimi</span><br />
                                İle Saniyeler İçinde
                            </h2>
                            <p className={`text-base md:text-lg ${mutedText} mb-8 md:mb-10 font-medium leading-relaxed`}>
                                Yapay zeka teknolojimiz, iş geçmişinizi analiz eder ve sizi işverenlerin gözünde en iyi şekilde temsil edecek
                                anahtar kelimelerle dolu, profesyonel bir özet hazırlar.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                                {[
                                    { title: 'Sektör Odaklı', text: '40’tan fazla sektöre özel metin kütüphanesi.' },
                                    { title: 'Otomatik Düzenleme', text: 'Dilbilgisi ve üslup hatalarını anında giderir.' },
                                    { title: 'Farklı Üsluplar', text: 'Yaratıcı, kurumsal veya teknik ton seçimi.' },
                                    { title: 'Kişisel Veri', text: 'Sizin verilerinizle beslenen özel öneriler.' }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className={`font-black flex items-center gap-2 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                            <Target className={`w-4 h-4 md:w-5 md:h-5 ${isDayMode ? 'text-sky-500' : 'text-cyan-500'}`} /> {item.title}
                                        </div>
                                        <p className={`text-sm ${mutedText} font-medium`}>{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Category Explorer */}
            <AnimatedSection className={`py-24 px-6 lg:px-12 ${isDayMode ? 'bg-white border-y border-slate-200/70 shadow-sm' : 'bg-white/[0.01]'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Kategoriler ile Keşfedin</h2>
                        <div className={`w-24 h-1.5 mx-auto rounded-full ${isDayMode ? 'bg-gradient-to-r from-sky-400 to-blue-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 md:gap-10">
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
                            <div key={i} className={`group rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:-translate-y-2 ${isDayMode ? 'bg-white border border-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] hover:border-sky-200' : 'glass-card border-white/5 hover:border-cyan-500/30'}`}>
                                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform ${isDayMode ? 'bg-gradient-to-br from-sky-50 to-blue-50 text-sky-600 border-sky-100 shadow-md' : 'bg-slate-900 border-white/10 text-cyan-400'}`}>
                                    {cat.icon}
                                </div>
                                <h3 className={`text-xl md:text-2xl font-black mb-4 ${isDayMode ? 'text-slate-800' : 'text-white'}`}>{cat.title}</h3>
                                <p className={`${mutedText} mb-8 text-sm md:text-base font-medium leading-relaxed`}>{cat.description}</p>
                                <ul className="space-y-4">
                                    {cat.features.map((f, j) => (
                                        <li key={j} className={`flex items-center gap-4 ${isDayMode ? 'text-slate-600' : 'text-gray-300'}`}>
                                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${isDayMode ? 'bg-sky-100 text-sky-600' : 'bg-cyan-500/20'}`}>
                                                <Check className={`w-3 h-3 md:w-4 md:h-4 ${isDayMode ? '' : 'text-cyan-400'}`} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm md:text-base font-bold">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Comparison */}
            <AnimatedSection className={`py-24 md:py-28 px-6 lg:px-12 ${isDayMode ? 'bg-slate-50 border-y border-slate-200/70' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 md:mb-20">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-cyan-400 to-purple-500'}`}>Neden CVniz?</span>
                        </h2>
                        <p className={`${mutedText} max-w-2xl mx-auto text-lg font-medium`}>
                            Eski yöntemlerle zaman kaybetmeyin. Profesyonel bir CV hazırlamanın en etkili yolu.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                        <div className={`rounded-[2.5rem] p-8 md:p-10 transition-all ${isDayMode ? 'bg-white border border-slate-200/70 shadow-[0_15px_40px_rgba(15,23,42,0.06)] hover:border-red-300' : 'glass-card border-red-500/10 group hover:border-red-500/20'}`}>
                            <h3 className={`text-xl md:text-2xl font-black mb-8 flex items-center gap-3 ${isDayMode ? 'text-rose-600' : 'text-red-400'}`}>
                                <X className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} /> Eski Yöntemler
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    'Karmaşık dosya formatlarıyla saatlerce uğraşmak',
                                    'Sürekli kayan tasarım ve format hataları',
                                    'ATS sistemlerinden geçemeyen zayıf şablonlar',
                                    'Kendini ifade etmekte zorlanan statik metinler'
                                ].map((item, i) => (
                                    <li key={i} className={`flex items-start gap-4 text-sm md:text-base font-medium ${isDayMode ? 'text-slate-600' : 'text-gray-500'}`}>
                                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDayMode ? 'bg-rose-100 text-rose-600' : 'bg-red-500/10'}`}>
                                            <Minus className={`w-3 h-3 md:w-4 md:h-4 ${isDayMode ? '' : 'text-red-500/50'}`} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={`rounded-[2.5rem] p-8 md:p-10 group transition-all shadow-xl ${isDayMode ? 'bg-white border-[3px] border-purple-100 shadow-[0_20px_50px_rgba(168,85,247,0.1)] hover:border-purple-300' : 'glass-card border border-cyan-500/30 bg-cyan-500/[0.03] hover:border-cyan-500/50'}`}>
                            <h3 className={`text-xl md:text-2xl font-black mb-8 flex items-center gap-3 ${isDayMode ? 'text-purple-600' : 'text-cyan-400'}`}>
                                <Check className="w-6 h-6 md:w-7 md:h-7" strokeWidth={3} /> CVniz İle
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    '5 dakikada profesyonel ve modern bir tasarım',
                                    'Akıllı editör ile hatasız ve kusursuz format',
                                    '%100 ATS uyumlu, işveren onaylı şablonlar',
                                    'AI desteğiyle hazırlanan güçlü ve ikna edici içerikler'
                                ].map((item, i) => (
                                    <li key={i} className={`flex items-start gap-4 text-sm md:text-base font-bold ${isDayMode ? 'text-slate-700' : 'text-white'}`}>
                                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDayMode ? 'bg-purple-100 text-purple-600' : 'bg-cyan-500/20'}`}>
                                            <Check className={`w-3 h-3 md:w-4 md:h-4 ${isDayMode ? '' : 'text-cyan-400'}`} strokeWidth={3} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Trust Section */}
            <AnimatedSection className={`py-20 md:py-24 border-y ${isDayMode ? 'bg-white border-slate-200/70' : 'border-white/5 bg-black/20'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <p className={`text-center text-[10px] font-black tracking-[0.3em] uppercase mb-12 md:mb-16 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        KULLANICILARIMIZ DÜNYANIN EN İYİLERİNDE
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        {['Google', 'Netflix', 'Amazon', 'Meta', 'Microsoft', 'Tesla'].map((brand, i) => (
                            <span key={i} className={`text-xl md:text-3xl font-black transition-colors cursor-default tracking-tighter italic ${isDayMode ? 'text-slate-400 hover:text-slate-800' : 'text-white hover:text-cyan-400'}`}>
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Final CTA */}
            <AnimatedSection className={`py-28 md:py-32 px-6 lg:px-12 relative overflow-hidden ${isDayMode ? 'bg-gradient-to-b from-slate-50 to-white' : ''}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] rounded-full blur-[140px] -z-10 animate-pulse ${isDayMode ? 'bg-purple-500/10' : 'bg-cyan-500/10'}`}></div>
                <div className="max-w-5xl mx-auto">
                    <div className={`rounded-[3rem] md:rounded-[4rem] p-10 md:p-24 relative overflow-hidden text-center shadow-2xl transition-all ${isDayMode ? 'bg-white border border-slate-200/70 shadow-[0_30px_60px_rgba(168,85,247,0.15)]' : 'glass-card border-cyan-500/30'}`}>
                        {/* Background Mesh/Patterns */}
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPC9zdmc+')" }}></div>
                        
                        <div className="relative z-10">
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-8 md:mb-10 shadow-xl border ${isDayMode ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-white text-white shadow-purple-500/30' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                                <Award className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 leading-tight">
                                Kariyerinizde <br />
                                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDayMode ? 'from-purple-600 to-pink-600' : 'from-cyan-400 to-blue-400'}`}>Yeni Bir Bölüm</span>
                            </h2>
                            <p className={`text-lg md:text-xl ${mutedText} mb-10 md:mb-12 max-w-2xl mx-auto font-medium`}>
                                Profesyoneller tarafından onaylanmış bir özgeçmişle hayalinizdeki işe bir adım daha yaklaşın.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <Link to="/editor" className={`text-lg font-bold px-10 py-5 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 hover:-translate-y-1 w-full sm:w-auto shadow-2xl ${isDayMode ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-purple-500/30 hover:shadow-purple-500/40' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}>
                                    <Heart className="w-6 h-6" /> Ücretsiz Oluştur
                                    <ArrowRight className="w-6 h-6 transition-transform" />
                                </Link>
                                <Link to="/templates" className={`text-lg font-bold px-10 py-5 rounded-2xl md:rounded-[1.25rem] flex items-center justify-center gap-3 transition-all duration-300 w-full sm:w-auto border-2 ${isDayMode ? 'border-slate-200 text-slate-700 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50' : 'border-white/20 text-gray-300 hover:text-white hover:border-white/40'}`}>
                                    Şablonları İncele <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
            <VideoPlayerModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} />
        </div>
    )
}
