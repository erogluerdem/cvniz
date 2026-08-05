import { Link, useNavigate } from 'react-router-dom'
import { Check, Star, Crown, ShieldCheck, Zap, Heart, MessageCircle, HelpCircle, ArrowRight, Minus, Plus, Award, Infinity } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const pricingPlans = [
    {
        name: 'Ücretsiz',
        price: { monthly: '0', yearly: '0' },
        period: '',
        description: 'CVniz dünyasını keşfetmek için mükemmel bir başlangıç.',
        features: [
            { text: '1 Temel Şablon (Modern)', included: true },
            { text: 'Watermark\'lı PDF Çıktısı', included: true },
            { text: 'Temel Düzenleme Paneli', included: true },
            { text: 'Tarayıcıda Otomatik Kayıt', included: true },
            { text: 'Premium Şablonlar', included: false },
            { text: 'AI İçerik Oluşturma', included: false },
            { text: 'Sınırsız İndirme', included: false },
            { text: 'Öncelikli Destek', included: false }
        ],
        buttonText: 'Hemen Başla',
        buttonLink: '/editor',
        highlighted: false,
        color: 'slate'
    },
    {
        name: 'Pro',
        id: 'pro',
        price: { monthly: '49', yearly: '29', lifetime: '149' },
        period: ' / ay',
        description: 'Kariyerini bir üst seviyeye taşımak isteyenler için.',
        features: [
            { text: '200+ Premium Şablon', included: true },
            { text: 'Watermark\'sız PDF Çıktısı', included: true },
            { text: 'Gelişmiş Düzenleme Araçları', included: true },
            { text: 'Sınırsız İndirme', included: true },
            { text: 'AI Akıllı İçerik Desteği', included: true },
            { text: 'E-posta Desteği', included: true },
            { text: 'Bulut Yedekleme', included: true },
            { text: 'Öncelikli Başvuru Desteği', included: false }
        ],
        buttonText: 'Pro\'ya Geç',
        buttonAction: 'checkout',
        highlighted: true,
        color: 'cyan'
    },
    {
        name: 'Kurumsal',
        price: { monthly: '149', yearly: '99' },
        period: ' / ay',
        description: 'Okullar ve danışmanlık firmaları için özel çözümler.',
        features: [
            { text: 'Tüm Pro Özellikleri', included: true },
            { text: 'Sınırsız Kullanıcı Yönetimi', included: true },
            { text: 'Özel Şablon Tasarımı', included: true },
            { text: 'API Erişimi & Entegrasyon', included: true },
            { text: '7/24 Öncelikli Telefon Desteği', included: true },
            { text: 'Dedicated Account Manager', included: true },
            { text: 'Özel Logo & Branding', included: true },
            { text: 'SLA Garantisi', included: true }
        ],
        buttonText: 'Bize Ulaşın',
        buttonLink: '/contact',
        highlighted: false,
        color: 'slate'
    }
]

const faqs = [
    {
        q: 'Ödeme yaptıktan sonra ne olur?',
        a: 'Ödemeniz onaylandığı anda hesabınız Pro seviyesine yükseltilir. Tüm kilitli şablonlar açılır ve AI özellikleri aktif hale gelir.'
    },
    {
        q: 'İade politikanız nedir?',
        a: 'Satın alma işleminizden sonraki 7 gün içinde memnun kalmazsanız, hiçbir gerekçe göstermeden iade talebinde bulunabilirsiniz.'
    },
    {
        q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        a: 'Tüm yerli ve yabancı kredi kartları, banka kartları ve iyzico güvencesiyle ödeme yapabilirsiniz.'
    },
    {
        q: 'Aboneliğimi ne zaman iptal edebilirim?',
        a: 'Dilediğiniz zaman aboneliğinizi iptal edebilirsiniz. İptal sonrası fatura dönemi sonuna kadar Pro özelliklerini kullanmaya devam edersiniz.'
    }
]

// Scroll Animation Hook
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

export default function PricingPage() {
    const { isPremium } = useAuth()
    const navigate = useNavigate()
    const [isYearly, setIsYearly] = useState(true)
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
        const handler = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handler)
        return () => window.removeEventListener('CVniz-theme-change', handler)
    }, [])

    const handlePlanSelect = (plan) => {
        if (plan.buttonAction === 'checkout') {
            navigate(`/checkout?plan=${plan.id}&cycle=${isYearly ? 'yearly' : 'monthly'}`)
        } else if (plan.buttonLink) {
            navigate(plan.buttonLink)
        }
    }

    const mutedText = isDayMode ? 'text-slate-600' : 'text-gray-400'
    const subtleText = isDayMode ? 'text-slate-500' : 'text-gray-500'
    const panelBorder = isDayMode ? 'border-slate-200/70' : 'border-white/5'
    const sectionBackground = isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white' : ''
    const heroBadgeClasses = isDayMode
        ? 'inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-slate-200/70 bg-white/90 text-sky-600 shadow-day'
        : 'inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20 text-cyan-200'
    const nonIncludedText = isDayMode ? 'text-slate-400' : 'text-gray-600'

    return (
        <div className={`min-h-screen overflow-x-hidden ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 selection:bg-sky-200/60' : 'bg-slate-950 text-white selection:bg-cyan-500/30'}`}>
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] animate-pulse ${isDayMode ? 'bg-sky-100' : 'bg-cyan-500/10'}`}></div>
                <div className={`absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] ${isDayMode ? 'bg-rose-100/70' : 'bg-blue-500/5'}`}></div>
            </div>

            {/* Hero Section */}
            <AnimatedSection className={`relative pt-32 pb-20 px-6 lg:px-12 text-center ${sectionBackground}`}>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className={heroBadgeClasses}>
                        <Zap className={`w-4 h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                        <span className="text-xs font-black uppercase tracking-widest">Kariyer Yatırımı</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                        Şeffaf ve <span className="gradient-text">Adil</span> <br /> Fiyatlandırma
                    </h1>
                    <p className={`text-xl ${mutedText} mb-12 max-w-2xl mx-auto leading-relaxed`}>
                        Kariyer hedeflerinize en uygun planı seçin. İstediğiniz zaman iptal edin,
                        gizli ücretlerle karşılaşmayın.
                    </p>

                    {/* Pricing Toggle */}
                    <div className="flex items-center justify-center gap-6 mb-16">
                        <span className={`text-sm font-bold transition-colors ${!isYearly ? (isDayMode ? 'text-slate-900' : 'text-white') : subtleText}`}>AYLIK</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className={`relative w-16 h-8 rounded-full p-1 transition-all border ${isDayMode ? 'bg-white border-slate-200/70 shadow-day' : 'bg-slate-800 border-white/10'}`}
                        >
                            <div className={`absolute top-1 bottom-1 w-6 rounded-full transition-all duration-300 ${isDayMode ? 'bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'} ${isYearly ? 'left-9' : 'left-1'}`}></div>
                        </button>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold transition-colors ${isYearly ? (isDayMode ? 'text-slate-900' : 'text-white') : subtleText}`}>YILLIK</span>
                            <span className={`${isDayMode ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-day' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'} text-[10px] font-black px-2 py-1 rounded-md`}>
                                %40 TASARRUF
                            </span>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* Pricing Grid */}
            <section className="pb-24 px-6 lg:px-12 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <AnimatedSection
                                key={index}
                                delay={index * 150}
                                className={`relative group transition-all duration-500 ${plan.highlighted ? 'lg:-translate-y-4' : ''}`}
                            >
                                {plan.highlighted && (
                                    <div className={`absolute -inset-[2px] rounded-[34px] blur-md opacity-25 group-hover:opacity-100 transition-opacity ${isDayMode ? 'bg-gradient-to-r from-sky-200 to-cyan-100' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}></div>
                                )}

                                <div className={`h-full rounded-[32px] p-10 flex flex-col relative overflow-hidden transition-colors ${isDayMode
                                    ? `bg-white border border-slate-200/70 shadow-day ${plan.highlighted ? 'ring-1 ring-sky-200/80' : ''}`
                                    : `glass-card border-white/5 bg-slate-950/40 backdrop-blur-3xl ${plan.highlighted ? 'border-cyan-500/50' : ''}`
                                    }`}>
                                    {plan.highlighted && (
                                        <div className="absolute top-0 right-0 p-8">
                                            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xl ${isDayMode ? 'bg-gradient-to-r from-sky-200 to-slate-50 text-slate-800 border border-slate-100' : 'bg-gradient-to-r from-cyan-300 to-slate-200 text-slate-950'}`}>
                                                En İyi Değer
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-10">
                                        <h3 className="text-2xl font-black mb-3">{plan.name}</h3>
                                        <p className={`${mutedText} text-sm leading-relaxed`}>{plan.description}</p>
                                    </div>

                                    <div className="mb-10 flex items-baseline gap-1">
                                        <span className="text-5xl font-black tracking-tighter">
                                            {isYearly ? plan.price.yearly : plan.price.monthly}₺
                                        </span>
                                        <span className={`${subtleText} font-bold`}>{plan.period}</span>
                                    </div>

                                    <button
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all mb-10 text-center ${plan.highlighted
                                            ? 'btn-premium shadow-[0_20px_40px_-15px_rgba(6,182,212,0.5)]'
                                            : isDayMode
                                                ? 'bg-slate-100 text-slate-700 border border-slate-200/70 hover:border-sky-200 hover:text-slate-900 shadow-sm'
                                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {isPremium && plan.name === 'Pro' ? 'Aktif Plan' : plan.buttonText}
                                    </button>

                                    <div className="space-y-5 flex-grow">
                                        <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${subtleText}`}>NELER DAHİL?</div>
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className={`flex items-start gap-4 text-sm ${feature.included ? (isDayMode ? 'text-slate-700' : 'text-gray-300') : nonIncludedText}`}>
                                                {feature.included ? (
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDayMode ? 'bg-sky-100 text-sky-600 ring-1 ring-sky-200/70' : 'bg-cyan-500/20'}`}>
                                                        <Check className={`w-3 h-3 ${isDayMode ? '' : 'text-cyan-400'}`} />
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Minus className={`w-3 h-3 ${isDayMode ? 'text-slate-300' : 'opacity-30'}`} />
                                                    </div>
                                                )}
                                                <span className={`${!feature.included ? 'line-through opacity-50' : ''}`}>{feature.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table Section */}
            <AnimatedSection className={`py-24 px-6 lg:px-12 ${isDayMode ? 'bg-white border-y border-slate-200/70' : 'bg-white/[0.01] border-y border-white/5'}`}>
                <div className="max-w-5xl mx-auto">
                    <h2 className={`text-3xl font-black text-center mb-16 uppercase tracking-[0.2em] ${isDayMode ? 'text-slate-500' : 'text-gray-600'}`}>Detaylı Karşılaştırma</h2>
                    <div className={`rounded-[32px] overflow-hidden ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day' : 'glass-card border-white/5'}`}>
                        <table className="w-full text-left">
                            <thead>
                                <tr className={`border-b ${panelBorder}`}>
                                    <th className={`p-8 text-xs font-black uppercase tracking-widest ${subtleText}`}>Özellik</th>
                                    <th className={`p-8 text-center text-xs font-black uppercase tracking-widest ${subtleText}`}>Ücretsiz</th>
                                    <th className="p-8 text-center text-xs font-black uppercase tracking-widest text-cyan-400">Pro</th>
                                    <th className={`p-8 text-center text-xs font-black uppercase tracking-widest ${subtleText}`}>Kurumsal</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${panelBorder}`}>
                                {[
                                    { f: 'PDF İndirme', free: 'Watermark\'lı', pro: 'Sınırsız', corp: 'Sınırsız' },
                                    { f: 'Şablon Sayısı', free: '1', pro: '65+', corp: 'Sınırsız/Özel' },
                                    { f: 'AI İçerik Desteği', free: 'Yok', pro: 'Var (GPT-4)', corp: 'Var (Custom)' },
                                    { f: 'Düzenleme', free: 'Temel', pro: 'Gelişmiş', corp: 'Gelişmiş' },
                                    { f: 'Destek', free: 'Topluluk', pro: 'E-posta', corp: '7/24 Telefon' },
                                ].map((row, i) => (
                                    <tr key={i} className={`group transition-colors ${isDayMode ? 'hover:bg-slate-50/80' : 'hover:bg-white/[0.02]'}`}>
                                        <td className={`p-8 font-bold ${mutedText}`}>{row.f}</td>
                                        <td className={`p-8 text-center text-sm ${subtleText}`}>{row.free}</td>
                                        <td className="p-8 text-center text-sm font-bold text-cyan-400">{row.pro}</td>
                                        <td className={`p-8 text-center text-sm ${isDayMode ? 'text-slate-800' : 'text-gray-300'}`}>{row.corp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AnimatedSection>

            {/* Testimonial & Social Proof */}
            <AnimatedSection className={`py-24 px-6 lg:px-12 ${isDayMode ? 'bg-gradient-to-b from-slate-50 to-white' : ''}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDayMode ? 'bg-sky-100 border-sky-200 text-sky-500' : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400'}`}>
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <h2 className="text-4xl font-black leading-tight">
                                Profesyoneller <br /> <span className="gradient-text">CVniz</span>'ı Tercih Ediyor
                            </h2>
                            <p className={`${mutedText} text-lg leading-relaxed`}>
                                "CVniz Pro planına geçtikten sonra başvurularımdan aldığım yanıt oranı %300 arttı.
                                Şablon kalitesi ve AI desteği gerçekten fark yaratıyor."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-[2px]">
                                    <div className={`w-full h-full rounded-full flex items-center justify-center font-bold ${isDayMode ? 'bg-white text-slate-900 shadow-day' : 'bg-slate-950'}`}>AK</div>
                                </div>
                                <div>
                                    <div className="font-bold">Ahmet Kaya</div>
                                    <div className={`text-sm ${subtleText}`}>Senior Yazılım Mühendisi</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Mutlu Kullanıcı', val: '50K+' },
                                { label: 'Şablon Kullanımı', val: '1M+' },
                                { label: 'Ülke', val: '120+' },
                                { label: 'İş Alımı', val: '15K+' },
                            ].map((stat, i) => (
                                <AnimatedSection key={i} delay={i * 100} className={`rounded-[24px] p-8 transition-all ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day hover:border-sky-200' : 'glass-card border-white/5 hover:border-cyan-500/20'}`}>
                                    <div className="text-4xl font-black gradient-text mb-2">{stat.val}</div>
                                    <div className={`text-xs font-black uppercase tracking-widest ${subtleText}`}>{stat.label}</div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* FAQ Section */}
            <AnimatedSection className={`py-24 px-6 lg:px-12 relative overflow-hidden ${isDayMode ? 'bg-white' : ''}`}>
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <HelpCircle className={`w-12 h-12 mx-auto mb-6 opacity-30 ${isDayMode ? 'text-sky-500' : 'text-cyan-500'}`} />
                        <h2 className="text-4xl font-black mb-4">Sık Sorulan Sorular</h2>
                        <p className={subtleText}>Aklınıza takılan bir şey mi var? İşte en yaygın cevaplar.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className={`rounded-[28px] p-8 transition-all ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day hover:border-sky-200/70' : 'glass-card border-white/5 hover:bg-white/[0.03]'}`}>
                                <h3 className="text-lg font-bold mb-4 flex items-start gap-3">
                                    <Plus className={`w-5 h-5 flex-shrink-0 mt-1 ${isDayMode ? 'text-sky-500' : 'text-cyan-500'}`} />
                                    {faq.q}
                                </h3>
                                <p className={`${mutedText} text-sm leading-relaxed pl-8`}>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </AnimatedSection>

            {/* Final Guarantee */}
            <AnimatedSection className={`py-24 px-6 lg:px-12 ${isDayMode ? 'bg-gradient-to-b from-slate-50 to-white' : ''}`}>
                <div className={`max-w-4xl mx-auto rounded-[48px] p-16 md:p-24 text-center relative overflow-hidden ${isDayMode ? 'bg-white border border-slate-200/70 shadow-day' : 'glass-card border-emerald-500/20'}`}>
                    <div className={`absolute inset-0 -z-10 ${isDayMode ? 'bg-gradient-to-br from-emerald-50 via-white to-slate-50' : 'bg-emerald-500/[0.02]'}`}></div>
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-10 border ${isDayMode ? 'bg-white border-slate-200/70 text-emerald-500 shadow-day' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8">Riske Girmeyin</h2>
                    <p className={`text-xl ${mutedText} mb-12`}>
                        7 gün koşulsuz şartsız para iade garantisi veriyoruz.
                        Memnun kalmazsanız paranız anında hesabınızda.
                    </p>
                    <Link to="/editor" className="btn-premium px-12 py-5 text-xl">
                        Hemen Deneyin
                    </Link>
                </div>
            </AnimatedSection>
        </div>
    )
}

