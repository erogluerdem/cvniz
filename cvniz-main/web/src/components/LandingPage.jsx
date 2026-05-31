import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, FileText, Download, Zap, Star, Check, ArrowRight, Crown, ChevronDown, ChevronUp, Mail, Shield, Clock, Users, Play, Quote, User, LogOut } from 'lucide-react'

const templates = [
    { id: 'modern', name: 'Modern', description: 'Renkli ve dinamik', isPremium: false, color: 'from-cyan-500 to-blue-600', preview: '🎨' },
    { id: 'minimalist', name: 'Minimalist', description: 'Sade ve profesyonel', isPremium: true, color: 'from-gray-600 to-gray-800', preview: '⚡' },
    { id: 'corporate', name: 'Kurumsal', description: 'Ciddi ve güven veren', isPremium: true, color: 'from-indigo-600 to-purple-700', preview: '🏢' },
    { id: 'creative', name: 'Yaratıcı', description: 'Tasarımcılar için', isPremium: true, color: 'from-pink-500 to-orange-400', preview: '🌈' },
    { id: 'tech', name: 'Teknoloji', description: 'Yazılımcılar için', isPremium: true, color: 'from-slate-800 to-slate-900', preview: '💻' },
    { id: 'executive', name: 'Yönetici', description: 'Üst düzey yöneticiler', isPremium: true, color: 'from-amber-600 to-yellow-500', preview: '👔' },
    { id: 'elegant', name: 'Zarif', description: 'Klasik ve sofistike', isPremium: true, color: 'from-stone-500 to-stone-700', preview: '✨' },
    { id: 'healthcare', name: 'Sağlık', description: 'Doktor ve hemşireler', isPremium: true, color: 'from-teal-500 to-cyan-600', preview: '🏥' },
    { id: 'academic', name: 'Akademik', description: 'Araştırmacılar için', isPremium: true, color: 'from-amber-700 to-amber-900', preview: '📚' },
    { id: 'finance', name: 'Finans', description: 'Bankacılar için', isPremium: true, color: 'from-emerald-700 to-emerald-900', preview: '💰' },
    { id: 'legal', name: 'Hukuk', description: 'Avukatlar için', isPremium: true, color: 'from-stone-700 to-stone-900', preview: '⚖️' },
    { id: 'marketing', name: 'Pazarlama', description: 'Pazarlamacılar için', isPremium: true, color: 'from-fuchsia-500 to-violet-600', preview: '📢' },
    { id: 'engineer', name: 'Mühendis', description: 'Mühendisler için', isPremium: true, color: 'from-zinc-700 to-zinc-900', preview: '⚙️' },
    { id: 'retail', name: 'Satış', description: 'Satış uzmanları', isPremium: true, color: 'from-rose-500 to-pink-600', preview: '🛍️' },
    { id: 'hospitality', name: 'Turizm', description: 'Otelcilik sektörü', isPremium: true, color: 'from-amber-500 to-amber-700', preview: '🏨' },
    { id: 'government', name: 'Kamu', description: 'Devlet memurları', isPremium: true, color: 'from-blue-800 to-blue-900', preview: '🏛️' },
    { id: 'freelancer', name: 'Freelancer', description: 'Serbest çalışanlar', isPremium: true, color: 'from-lime-500 to-green-600', preview: '💼' },
    { id: 'startup', name: 'Startup', description: 'Girişimciler için', isPremium: true, color: 'from-violet-600 to-purple-800', preview: '🚀' },
    { id: 'international', name: 'Uluslararası', description: 'Global kariyer', isPremium: true, color: 'from-sky-600 to-sky-800', preview: '🌍' },
    { id: 'portfolio', name: 'Portfolyo', description: 'Görsel ağırlıklı', isPremium: true, color: 'from-neutral-800 to-neutral-900', preview: '🖼️' }
]

const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'AI Destekli İçerik', description: 'Yapay zeka ile profesyonel özet ve açıklamalar oluşturun' },
    { icon: <FileText className="w-6 h-6" />, title: '20+ Premium Şablon', description: 'Her sektör için özel tasarlanmış profesyonel şablonlar' },
    { icon: <Download className="w-6 h-6" />, title: 'PDF Export', description: 'Yüksek kaliteli PDF dosyası olarak indirin' },
    { icon: <Zap className="w-6 h-6" />, title: 'Gerçek Zamanlı', description: 'Değişiklikleri anında görün ve düzenleyin' }
]

const howItWorks = [
    { step: '01', title: 'Şablon Seçin', description: '20+ profesyonel şablon arasından size uygun olanı seçin', icon: <FileText className="w-8 h-8" /> },
    { step: '02', title: 'Bilgilerinizi Girin', description: 'Kişisel bilgiler, deneyim ve yeteneklerinizi ekleyin', icon: <Users className="w-8 h-8" /> },
    { step: '03', title: 'PDF Olarak İndirin', description: 'CV\'nizi profesyonel PDF formatında indirin', icon: <Download className="w-8 h-8" /> }
]

const testimonials = [
    { name: 'Ahmet Yılmaz', role: 'Yazılım Mühendisi', company: 'Google', content: 'CVniz sayesinde hayallerindeki işi buldum. Teknoloji şablonu tam da aradığım şeydi!', rating: 5, avatar: '👨‍💻' },
    { name: 'Elif Kaya', role: 'Pazarlama Müdürü', company: 'Microsoft', content: 'Dakikalar içinde profesyonel bir CV hazırladım. Şablonlar gerçekten çok kaliteli.', rating: 5, avatar: '👩‍💼' },
    { name: 'Mehmet Demir', role: 'Finans Uzmanı', company: 'JPMorgan', content: 'Finans şablonu tam sektöre uygun. İK uzmanlarından çok olumlu geri dönüşler aldım.', rating: 5, avatar: '👨‍💼' },
    { name: 'Zeynep Aksoy', role: 'Doktor', company: 'Acıbadem', content: 'Sağlık sektörüne özel şablon harika! Uzmanlık alanlarımı çok güzel yansıttı.', rating: 5, avatar: '👩‍⚕️' }
]

const faqs = [
    { question: 'CVniz ücretsiz mi?', answer: 'Evet! Modern şablonumuzu tamamen ücretsiz kullanabilirsiniz. Premium şablonlar için tek seferlik 29₺ ödeme yapmanız yeterli.' },
    { question: 'CV\'mi kaç kez indirebilirim?', answer: 'Pro paketi ile 1 adet watermark\'sız PDF indirebilirsiniz. Kurumsal paket ile sınırsız indirme hakkınız vardır.' },
    { question: 'PDF kalitesi nasıl?', answer: 'Tüm CV\'ler 300 DPI çözünürlükte, baskıya hazır kalitede PDF olarak dışa aktarılır.' },
    { question: 'Verilerim güvende mi?', answer: 'Evet, tüm verileriniz tarayıcınızda kalır ve sunucularımıza gönderilmez. %100 gizlilik garantisi.' },
    { question: 'İade politikanız nedir?', answer: '7 gün içinde memnun kalmazsanız, hiçbir soru sorulmadan paranızı iade ediyoruz.' }
]

const pricingPlans = [
    { name: 'Ücretsiz', price: '0', period: '', features: ['1 Temel Şablon', 'Watermark\'lı PDF', 'Sınırlı Düzenleme'], notIncluded: ['Premium Şablonlar', 'AI İçerik', 'Sınırsız İndirme'], buttonText: 'Ücretsiz Başla', highlighted: false },
    { name: 'Pro', price: '29', period: 'tek seferlik', features: ['Tüm 40 Şablon', 'Watermark\'sız PDF', 'Sınırsız Düzenleme', '1 CV İndirme'], notIncluded: [], buttonText: 'Hemen Satın Al', highlighted: true },
    { name: 'Kurumsal', price: '99', period: '/ay', features: ['Tüm Pro Özellikleri', 'Sınırsız İndirme', 'Öncelikli Destek', 'Takım Yönetimi', 'API Erişimi'], notIncluded: [], buttonText: 'İletişime Geç', highlighted: false }
]

const companyLogos = ['LinkedIn', 'Indeed', 'Kariyer.net', 'Glassdoor', 'Monster']

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border-b border-white/10">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left">
                <span className="text-lg font-medium text-white">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {isOpen && <p className="pb-5 text-gray-400 leading-relaxed">{answer}</p>}
        </div>
    )
}

export default function LandingPage() {
    const [email, setEmail] = useState('')
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()

    const handleStartCreating = (templateId) => {
        navigate(`/editor?template=${templateId}`)
    }

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
            <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 15% 20%, rgba(34,211,238,0.12), transparent 35%), radial-gradient(circle at 85% 10%, rgba(226,232,240,0.14), transparent 32%), radial-gradient(circle at 65% 70%, rgba(148,163,184,0.08), transparent 28%)'
                }}
            />
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center ring-1 ring-white/10">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
                        </div>
                        <span className="text-lg sm:text-xl font-bold gradient-text">CVniz</span>
                    </Link>
                    <nav className="hidden lg:flex items-center gap-1">
                        <a href="#features" className="text-sm px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Özellikler</a>
                        <a href="#templates" className="text-sm px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Şablonlar</a>
                        <a href="#testimonials" className="text-sm px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Yorumlar</a>
                        <a href="#pricing" className="text-sm px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Fiyatlar</a>
                        <a href="#faq" className="text-sm px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-colors">SSS</a>
                    </nav>
                    <div className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <>
                                <Link
                                    to={isAdmin ? '/admin' : '/dashboard'}
                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden xs:inline text-sm sm:text-base">{user.name?.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
                                    title="Çıkış Yap"
                                >
                                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors hidden xs:block text-sm sm:text-base">
                                    Giriş Yap
                                </Link>
                                <Link to="/editor" className="btn-premium !rounded-full px-2.5 sm:px-5 py-1 sm:py-2 text-[10px] sm:text-sm group flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95">
                                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 group-hover:animate-spin shrink-0" />
                                    <span className="font-bold whitespace-nowrap">CV Oluştur</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-28 px-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute -top-24 left-10 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-[28rem] h-[28rem] bg-slate-200/10 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/30 via-transparent to-transparent"></div>
                <div
                    className="absolute inset-x-0 -top-10 h-64 opacity-70"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), transparent 30%), radial-gradient(circle at 70% 30%, rgba(34,211,238,0.16), transparent 32%), radial-gradient(circle at 50% 80%, rgba(148,163,184,0.12), transparent 30%)'
                    }}
                ></div>

                <div className="max-w-5xl mx-auto relative z-10 px-2 sm:px-0">
                    <div className="glass-card rounded-[24px] sm:rounded-[32px] border border-white/15 p-6 sm:p-10 md:p-14 text-center shadow-[0_45px_140px_-80px_rgba(226,232,240,0.8)] relative overflow-hidden">
                        <div className="absolute inset-x-10 inset-y-0 bg-gradient-to-b from-white/5 via-transparent to-transparent blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card mb-6 sm:mb-8 fade-in ring-1 ring-white/10">
                                <Sparkles className="w-3.5 h-3.5 sm:w-4 h-4 text-cyan-300" />
                                <span className="text-[10px] sm:text-sm text-gray-200">Yeni: 20 Profesyonel Şablon</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-6 fade-in leading-tight">
                                <span className="gradient-text">Profesyonel CV'nizi</span>
                                <br />
                                <span className="text-white">Hızlıca Oluşturun</span>
                            </h1>

                            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10 fade-in px-4">
                                AI destekli 20+ şablonla öne çıkan özgeçmişler hazırlayın.
                                <span className="text-cyan-300 font-semibold block sm:inline"> %95 müşteri memnuniyeti!</span>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center fade-in px-4">
                                <button onClick={() => handleStartCreating('modern')} className="btn-premium !rounded-full w-full sm:w-auto text-sm sm:text-lg px-8 py-3 md:py-4 flex items-center justify-center gap-2 group shadow-[0_20px_50px_-15px_rgba(34,211,238,0.55)] transition-all hover:scale-105 active:scale-95">
                                    Ücretsiz Başla <ArrowRight className="w-4 h-4 sm:w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="btn-secondary w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 text-sm sm:text-base">
                                    <Play className="w-4 h-4 sm:w-5 h-5" /> Demo İzle
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto mt-12 sm:mt-16 fade-in px-2">
                                {[
                                    { label: 'CV Oluşturuldu', value: '10K+' },
                                    { label: 'Memnuniyet', value: '95%' },
                                    { label: 'Premium Şablon', value: '20+' },
                                    { label: 'Ortalama Süre', value: '5 dk' }
                                ].map((stat) => (
                                    <div key={stat.label} className="glass-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10 shadow-[0_10px_30px_-15px_rgba(34,211,238,0.4)]">
                                        <div className="text-xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                                        <div className="text-gray-400 text-[10px] sm:text-sm">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Floating micro-cards */}
                        <div className="hidden lg:flex absolute right-8 top-12 glass-card rounded-2xl px-5 py-4 items-center gap-4 border border-white/10 shadow-[0_25px_80px_-40px_rgba(226,232,240,0.35)]">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-300 to-slate-100 text-slate-900 flex items-center justify-center ring-1 ring-white/20">
                                <Star className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm text-gray-300">AI Skoru</div>
                                <div className="text-xl font-bold gradient-text">92 / 100</div>
                                <div className="text-xs text-gray-500">ATS uyumlu öneri</div>
                            </div>
                        </div>
                        <div className="hidden lg:flex absolute left-8 bottom-12 glass-card rounded-2xl px-5 py-4 items-start gap-4 border border-white/10 shadow-[0_25px_80px_-40px_rgba(34,211,238,0.45)]">
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-gray-400">Canlı</span>
                                <span className="text-2xl font-bold gradient-text">58</span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm text-gray-300 font-semibold">Aktif işe alım uzmanı</p>
                                <p className="text-xs text-gray-500">CVniz kullanıcılarını inceliyor</p>
                            </div>
                        </div>
                        <div className="hidden xl:block absolute -right-24 top-1/2 -translate-y-1/2 w-64 bg-white/95 text-slate-900 rounded-3xl shadow-[0_30px_120px_-70px_rgba(15,23,42,0.9)] border border-white/60 p-6 animate-float">
                            <div className="h-10 rounded-2xl bg-gradient-to-r from-cyan-400 to-slate-200 mb-5"></div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Deneyim</span>
                                    <span className="text-[10px] font-semibold text-slate-500">%86</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-200">
                                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-slate-500 w-4/5"></div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <span>Yetkinlik</span>
                                    <span>8/10</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-700">
                                    <div className="rounded-xl border border-slate-200 px-3 py-2">React</div>
                                    <div className="rounded-xl border border-slate-200 px-3 py-2">Fintech</div>
                                    <div className="rounded-xl border border-slate-200 px-3 py-2">SEO</div>
                                    <div className="rounded-xl border border-slate-200 px-3 py-2">UI/UX</div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block absolute -left-12 top-10 h-32 w-px bg-gradient-to-b from-transparent via-cyan-200/70 to-transparent animate-pulse"></div>
                        <div className="hidden lg:block absolute -right-12 bottom-10 h-40 w-px bg-gradient-to-b from-transparent via-slate-100/70 to-transparent animate-pulse"></div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-[10px] tracking-[0.4em] uppercase text-gray-500">
                    Aşağı Kaydır
                    <div className="w-px h-10 mt-2 bg-gradient-to-b from-transparent via-white/60 to-white/5"></div>
                </div>
            </section>

            {/* Company Logos */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto glass-card rounded-3xl border border-white/10 px-8 py-10 text-center shadow-[0_30px_120px_-80px_rgba(226,232,240,0.7)]">
                    <p className="text-center text-gray-400 text-xs uppercase tracking-[0.4em] mb-8">Kullanıcılarımız bu şirketlerde</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {companyLogos.map((logo, i) => (
                            <span key={i} className="text-xl font-semibold tracking-[0.15em] text-slate-200/70 hover:text-white transition-colors">{logo}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">Nasıl Çalışır?</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            3 kolay adımda profesyonel CV'nizi oluşturun
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="glass-card rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
                                    <div className="text-6xl font-extrabold text-white/10 absolute top-4 right-6">{item.step}</div>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-300 to-slate-200 flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10 text-slate-950">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-400">{item.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-8 transform -translate-y-1/2 items-center gap-2">
                                        <div className="w-10 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-white/60"></div>
                                        <ArrowRight className="w-8 h-8 text-cyan-400/70" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(120deg, rgba(148,163,184,0.2) 0%, transparent 35%), linear-gradient(300deg, rgba(34,211,238,0.2) 0%, transparent 40%)' }}
                ></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">Neden CVniz?</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            İş arama sürecinizi kolaylaştıran güçlü özellikler
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300 group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-300 to-slate-200 text-slate-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ring-1 ring-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-6 mt-12">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Shield className="w-5 h-5 text-cyan-300" />
                            <span className="text-sm">SSL Güvenlik</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-5 h-5 text-cyan-400" />
                            <span className="text-sm">7/24 Erişim</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-5 h-5 text-slate-200" />
                            <span className="text-sm">10K+ Kullanıcı</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Templates Section */}
            <section id="templates" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">20+ Profesyonel Şablon</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Her sektör için özel tasarlanmış premium şablonlar
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-[0_30px_90px_-50px_rgba(226,232,240,0.45)]">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group"
                                    onClick={() => handleStartCreating(template.id)}
                                >
                                    <div className={`h-28 bg-gradient-to-br ${template.color} flex items-center justify-center relative`}>
                                        <span className="text-4xl opacity-60">{template.preview}</span>
                                        {template.isPremium && (
                                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-cyan-300 to-slate-200 text-slate-950 px-1.5 py-0.5 rounded-full ring-1 ring-white/10">
                                                <Crown className="w-2.5 h-2.5" />
                                                <span className="text-[10px] font-bold">PRO</span>
                                            </div>
                                        )}
                                        {!template.isPremium && (
                                            <div className="absolute top-2 right-2 bg-white/85 text-slate-950 px-1.5 py-0.5 rounded-full ring-1 ring-black/10">
                                                <span className="text-[10px] font-bold">FREE</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="btn-premium text-xs py-2 px-4">Kullan</span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-sm">{template.name}</h3>
                                        <p className="text-gray-500 text-xs">{template.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">Müşterilerimiz Ne Diyor?</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Binlerce kullanıcımızdan gelen gerçek yorumlar
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {testimonials.map((item, index) => (
                            <div key={index} className="glass-card rounded-2xl p-6 relative border border-white/10 shadow-[0_20px_70px_-40px_rgba(34,211,238,0.55)]">
                                <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-500/20" />
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-300 to-slate-200 text-slate-950 flex items-center justify-center text-2xl ring-1 ring-white/10">
                                        {item.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{item.name}</h4>
                                        <p className="text-gray-400 text-sm">{item.role}, {item.company}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 mb-4 italic">"{item.content}"</p>
                                <div className="flex gap-1">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">Basit Fiyatlandırma</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Gizli ücret yok. İhtiyacınıza uygun planı seçin.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`rounded-2xl p-8 relative ${plan.highlighted
                                    ? 'bg-gradient-to-br from-cyan-500/20 to-slate-200/10 border-2 border-cyan-300/40 scale-105'
                                    : 'glass-card'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-cyan-300 to-slate-200 text-slate-950 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ring-1 ring-white/10">
                                            <Star className="w-4 h-4" /> En Popüler
                                        </div>
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-5xl font-extrabold gradient-text">{plan.price}₺</span>
                                    <span className="text-gray-400 ml-2">{plan.period}</span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="w-5 h-5 text-cyan-300" />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.notIncluded.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 opacity-50">
                                            <span className="w-5 h-5 text-center">✕</span>
                                            <span className="text-gray-500 line-through">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleStartCreating('modern')}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.highlighted
                                        ? 'btn-premium shadow-[0_20px_70px_-35px_rgba(34,211,238,0.9)]'
                                        : 'btn-secondary'
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">Sık Sorulan Sorular</span>
                        </h2>
                        <p className="text-gray-400">
                            Aklınıza takılan soruların cevapları
                        </p>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden border border-white/10 shadow-[0_25px_80px_-45px_rgba(226,232,240,0.45)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-slate-200/10"></div>
                        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/25 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-32 h-32 bg-slate-200/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <Mail className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                            <h2 className="text-3xl font-bold mb-4">
                                Kariyer İpuçları & Güncellemeler
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                Yeni şablonlar, kariyer ipuçları ve özel tekliflerden haberdar olun.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-posta adresiniz"
                                    className="input-field flex-1"
                                />
                                <button className="btn-premium whitespace-nowrap">
                                    Abone Ol
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">Spam göndermiyoruz. İstediğiniz zaman abonelikten çıkabilirsiniz.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center glass-card rounded-3xl border border-white/10 p-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-slate-200/10"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Hayalinizdeki <span className="gradient-text">Kariyere</span> Bir Adım Daha Yakın
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Hemen ücretsiz başlayın ve profesyonel CV'nizi dakikalar içinde oluşturun.
                        </p>
                        <button onClick={() => handleStartCreating('modern')} className="btn-premium text-lg px-10">
                            Ücretsiz CV Oluştur
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-slate-200 flex items-center justify-center ring-1 ring-white/10">
                                    <FileText className="w-4 h-4 text-slate-900" />
                                </div>
                                <span className="font-bold gradient-text">CVniz</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                AI destekli profesyonel CV oluşturucu. Kariyerinizi bir üst seviyeye taşıyın.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Ürün</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Özellikler</a></li>
                                <li><a href="#templates" className="hover:text-white transition-colors">Şablonlar</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Fiyatlar</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Destek</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#faq" className="hover:text-white transition-colors">SSS</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Destek</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Yasal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Kullanım Şartları</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">KVKK</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-gray-500 text-sm">
                            © 2024 CVniz. Tüm hakları saklıdır.
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">Türkiye'de 🇹🇷 ❤️ ile yapıldı</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

