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
    { name: 'Ahmet Yılmaz', role: 'Yazılım Mühendisi', company: 'Google', content: 'CVify sayesinde hayallerindeki işi buldum. Teknoloji şablonu tam da aradığım şeydi!', rating: 5, avatar: '👨‍💻' },
    { name: 'Elif Kaya', role: 'Pazarlama Müdürü', company: 'Microsoft', content: 'Dakikalar içinde profesyonel bir CV hazırladım. Şablonlar gerçekten çok kaliteli.', rating: 5, avatar: '👩‍💼' },
    { name: 'Mehmet Demir', role: 'Finans Uzmanı', company: 'JPMorgan', content: 'Finans şablonu tam sektöre uygun. İK uzmanlarından çok olumlu geri dönüşler aldım.', rating: 5, avatar: '👨‍💼' },
    { name: 'Zeynep Aksoy', role: 'Doktor', company: 'Acıbadem', content: 'Sağlık sektörüne özel şablon harika! Uzmanlık alanlarımı çok güzel yansıttı.', rating: 5, avatar: '👩‍⚕️' }
]

const faqs = [
    { question: 'CVify ücretsiz mi?', answer: 'Evet! Modern şablonumuzu tamamen ücretsiz kullanabilirsiniz. Premium şablonlar için tek seferlik 29₺ ödeme yapmanız yeterli.' },
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
        <div className="min-h-screen">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">CVify</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">Özellikler</a>
                        <a href="#templates" className="text-gray-300 hover:text-white transition-colors">Şablonlar</a>
                        <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Yorumlar</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Fiyatlar</a>
                        <a href="#faq" className="text-gray-300 hover:text-white transition-colors">SSS</a>
                    </nav>
                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <Link
                                    to={isAdmin ? '/admin' : '/dashboard'}
                                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="hidden sm:inline">{user.name?.split(' ')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    title="Çıkış Yap"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors hidden sm:block">
                                    Giriş Yap
                                </Link>
                                <Link to="/editor" className="btn-premium text-sm">
                                    CV Oluştur
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 fade-in">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">🎉 Yeni: 20 Profesyonel Şablon!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 fade-in">
                        <span className="gradient-text">Profesyonel CV'nizi</span>
                        <br />
                        <span className="text-white">Dakikalar İçinde Oluşturun</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 fade-in">
                        AI destekli 20+ şablonla öne çıkan özgeçmişler hazırlayın.
                        <span className="text-cyan-400 font-semibold"> %95 müşteri memnuniyeti!</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
                        <button onClick={() => handleStartCreating('modern')} className="btn-premium text-lg flex items-center justify-center gap-2 group">
                            Ücretsiz Başla <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Play className="w-5 h-5" /> Demo İzle
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16 fade-in">
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">10K+</div>
                            <div className="text-gray-400 text-sm">CV Oluşturuldu</div>
                        </div>
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">95%</div>
                            <div className="text-gray-400 text-sm">Memnuniyet</div>
                        </div>
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">20+</div>
                            <div className="text-gray-400 text-sm">Şablon</div>
                        </div>
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">5 dk</div>
                            <div className="text-gray-400 text-sm">Ortalama Süre</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Logos */}
            <section className="py-12 px-6 border-y border-white/10">
                <div className="max-w-6xl mx-auto">
                    <p className="text-center text-gray-500 text-sm mb-6">Kullanıcılarımız bu şirketlerde çalışıyor</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {companyLogos.map((logo, i) => (
                            <span key={i} className="text-xl font-bold text-gray-600 hover:text-gray-400 transition-colors">{logo}</span>
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
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="text-gray-400">{item.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                        <ArrowRight className="w-8 h-8 text-cyan-500/50" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="gradient-text">Neden CVify?</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            İş arama sürecinizi kolaylaştıran güçlü özellikler
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300 group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="text-sm">SSL Güvenlik</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-5 h-5 text-cyan-400" />
                            <span className="text-sm">7/24 Erişim</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-5 h-5 text-purple-400" />
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
                                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 rounded-full">
                                            <Crown className="w-2.5 h-2.5" />
                                            <span className="text-[10px] font-bold">PRO</span>
                                        </div>
                                    )}
                                    {!template.isPremium && (
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 px-1.5 py-0.5 rounded-full">
                                            <span className="text-[10px] font-bold">FREE</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-xs font-semibold bg-white text-black px-3 py-1 rounded-full">Kullan</span>
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
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
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
                            <div key={index} className="glass-card rounded-2xl p-6 relative">
                                <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-500/20" />
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-2xl">
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
                                    ? 'bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border-2 border-cyan-500/50 scale-105'
                                    : 'glass-card'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
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
                                            <Check className="w-5 h-5 text-green-400" />
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
                                        ? 'btn-premium'
                                        : 'border border-white/20 hover:bg-white/10'
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
                    <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10"></div>
                        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-600/30 rounded-full blur-3xl"></div>

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
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
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
                <div className="max-w-4xl mx-auto text-center">
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
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold gradient-text">CVify</span>
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
                            © 2024 CVify. Tüm hakları saklıdır.
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
