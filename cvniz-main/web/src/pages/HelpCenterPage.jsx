import { Search, HelpCircle, BookOpen, Settings, Shield, User, CreditCard, MessageCircle, ArrowRight, Zap, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const categories = [
    {
        icon: <User className="w-8 h-8" />,
        title: "Hesap İşlemleri",
        description: "Üyelik, şifre sıfırlama ve profil yönetimi hakkında her şey.",
        count: 12
    },
    {
        icon: <BookOpen className="w-8 h-8" />,
        title: "CV Düzenleme",
        description: "AI editörü kullanımı, şablon özelleştirme ve PDF dışa aktarma.",
        count: 24
    },
    {
        icon: <CreditCard className="w-8 h-8" />,
        title: "Ödeme ve Faturalar",
        description: "Pro planlar, fatura talepleri ve iade süreçleri bilgilendirmesi.",
        count: 8
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Güvenlik ve Gizlilik",
        description: "Veri güvenliği, hesap koruması ve KVKK süreçlerimiz.",
        count: 6
    },
    {
        icon: <Settings className="w-8 h-8" />,
        title: "Teknik Sorunlar",
        description: "Tarayıcı uyumluluğu ve PDF görüntüleme sorunları çözümü.",
        count: 9
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: "AI & Özellikler",
        description: "Akıllı içerik oluşturucu ve gelişmiş AI araçları rehberi.",
        count: 15
    }
]

const popularTopics = [
    "CV'mi nasıl PDF olarak indirebilirim?",
    "Hangi şablon ATS sistemleriyle tam uyumludur?",
    "Aboneliğimi nasıl iptal edebilirim?",
    "AI asistanı CV içeriğini nasıl optimize ediyor?",
    "Ücretsiz ve Pro plan arasındaki farklar nelerdir?",
    "Hesabımı ve verilerimi nasıl tamamen silebilirim?"
]

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/5 rounded-full blur-[180px]"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20">
                            <HelpCircle className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">Yardım & Bilgi Bankası</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                            Yardım <span className="gradient-text">Merkezi</span>
                        </h1>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative group mt-12">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-all duration-500"></div>
                            <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-5 shadow-2xl">
                                <Search className="w-6 h-6 text-cyan-500 mr-4" />
                                <input
                                    type="text"
                                    placeholder="Nasıl yardımcı olabiliriz? Bir konu veya hata kodu arayın..."
                                    className="bg-transparent border-none outline-none w-full text-lg placeholder:text-gray-500 font-medium"
                                />
                                <button className="hidden sm:block btn-premium px-6 py-2 text-sm rounded-xl">ARA</button>
                            </div>
                        </div>
                    </div>

                    {/* Category Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                        {categories.map((cat, i) => (
                            <Link
                                key={i}
                                to="#"
                                className="group glass-card rounded-[32px] p-8 border-white/5 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500 shadow-inner">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                    {cat.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{cat.count} Makale</span>
                                    <ArrowRight className="w-5 h-5 text-cyan-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all cursor-pointer" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Featured/Popular Section */}
                    <div className="grid lg:grid-cols-12 gap-12 mb-24">
                        <div className="lg:col-span-8">
                            <div className="glass-card rounded-[40px] p-10 md:p-14 border-white/5">
                                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-cyan-400" /> En Çok Aranan Konular
                                </h2>
                                <div className="grid gap-4">
                                    {popularTopics.map((topic, i) => (
                                        <button
                                            key={i}
                                            className="group flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyan-500/20 transition-all text-left"
                                        >
                                            <span className="font-bold text-gray-200 group-hover:text-white transition-colors">{topic}</span>
                                            <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-card rounded-[32px] p-10 border-white/5 text-center">
                                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-8">
                                    <MessageSquare className="w-10 h-10 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Canlı Destek</h3>
                                <p className="text-gray-400 text-sm mb-10 leading-relaxed">
                                    Hala cevap bulamadınız mı? Profesyonel destek ekibimizle anında iletişime geçin.
                                </p>
                                <Link to="/contact" className="btn-premium w-full py-4 text-sm font-black tracking-widest">
                                    DESTEK EKİBİNE YAZIN
                                </Link>
                            </div>

                            <div className="p-10 rounded-[32px] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 text-center flex flex-col items-center">
                                <Settings className="w-12 h-12 text-cyan-400 mb-6 animate-spin-slow" />
                                <h3 className="text-xl font-bold mb-2">Sistem Durumu</h3>
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase text-green-400 tracking-widest">Aktif ve Stabil</span>
                                </div>
                                <Link to="#" className="text-sm text-cyan-400 hover:text-white transition-colors underline decoration-cyan-500/30">Durum sayfasını görüntüle</Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Çözümlenen Bilet", value: "35k+" },
                            { label: "Bilgi Makalesi", value: "250+" },
                            { label: "Mutluluk Oranı", value: "%99.4" },
                            { label: "Yanıt Süresi", value: "< 2sa" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-3xl md:text-5xl font-black gradient-text mb-2 group-hover:scale-110 transition-transform duration-500 inline-block">{stat.value}</div>
                                <div className="text-xs font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
