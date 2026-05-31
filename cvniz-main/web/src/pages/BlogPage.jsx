import { Calendar, Clock, User, ArrowRight, Share2, Bookmark, Filter, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const blogPosts = [
    {
        id: 1,
        title: "2025'te Kariyerinizi Değiştirecek 10 CV İpucu",
        excerpt: "Yapay zeka çağında iş arama süreçleri değişiyor. ATS sistemlerini nasıl geçersiniz ve AI sizi nasıl fark eder?",
        category: "Kariyer",
        author: "Melis Erten",
        date: "25 Ara 2024",
        readTime: "8 dk",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "AI Destekli Önyazı Yazmanın İncelikleri",
        excerpt: "Kendinizi en iyi şekilde ifade etmek için yapay zekayı nasıl bir asistan olarak kullanabilirsiniz?",
        category: "Teknoloji",
        author: "Kaan Yılmaz",
        date: "20 Ara 2024",
        readTime: "5 dk",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Modern İş Görüşmelerinde Yapılan 5 Kritik Hata",
        excerpt: "Video mülakatlardan teknik zorluklara kadar, yeni nesil iş görüşmelerinde dikkat etmeniz gerekenler.",
        category: "Rehber",
        author: "Zeynep Aksoy",
        date: "15 Ara 2024",
        readTime: "12 dk",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "LinkedIn Profiliniz Neden Önemli?",
        excerpt: "Sadece bir CV yetmez. LinkedIn profilinizi nasıl bir mıknatısa dönüştüreceğinizi keşfedin.",
        category: "Networking",
        author: "Burak Çetin",
        date: "10 Ara 2024",
        readTime: "6 dk",
        image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=800"
    }
]

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">Blog & Kariyer</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                            Kariyer <span className="gradient-text">Akademisi</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Profesyonel hayata dair en güncel ipuçları, teknoloji haberleri ve CV oluşturma rehberleri tek bir noktada.
                        </p>
                    </div>

                    {/* Blog Search & Filter */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                        <div className="flex flex-wrap gap-3">
                            {['Hepsi', 'Kariyer', 'Teknoloji', 'Rehber', 'Networking'].map((tag, i) => (
                                <button
                                    key={i}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold border transition-all ${i === 0 ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Filter className="w-4 h-4" />
                            <span>Sırala:</span>
                            <select className="bg-transparent border-none outline-none font-bold text-white cursor-pointer">
                                <option className="bg-slate-900">En Yeni</option>
                                <option className="bg-slate-900">En Çok Okunan</option>
                            </select>
                        </div>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article
                                key={post.id}
                                className="group flex flex-col glass-card rounded-[32px] border-white/5 overflow-hidden transition-all duration-500 hover:border-cyan-500/30 hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 rounded-full bg-cyan-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xl">
                                            {post.category}
                                        </span>
                                    </div>
                                    <button className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-950/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Bookmark className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 font-bold mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {post.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {post.readTime}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-snug group-hover:text-cyan-400 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-black">
                                                {post.author.charAt(0)}
                                            </div>
                                            <span className="text-xs font-bold text-gray-200">{post.author}</span>
                                        </div>
                                        <button className="text-cyan-400 hover:text-white transition-colors flex items-center gap-2 font-bold group/btn">
                                            <span className="text-sm">OKU</span>
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-20 flex justify-center items-center gap-4">
                        <button className="w-12 h-12 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center text-gray-500 cursor-not-allowed">
                            1
                        </button>
                        <button className="w-12 h-12 rounded-xl border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all">
                            2
                        </button>
                        <button className="w-12 h-12 rounded-xl border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all">
                            3
                        </button>
                        <span className="text-gray-600">...</span>
                        <button className="w-12 h-12 rounded-xl border border-white/10 hover:bg-white/10 flex items-center justify-center transition-all font-bold">
                            12
                        </button>
                    </div>

                    {/* Newsletter Call to Action */}
                    <div className="mt-32 glass-card rounded-[48px] p-12 md:p-16 border-white/10 relative overflow-hidden text-center">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black mb-6">Yeni İçerikleri Kaçırma</h2>
                            <p className="text-gray-400 text-lg mb-12">
                                En yeni kariyer fırsatları ve CV ipuçları her hafta e-posta kutuna gelsin.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                                <input
                                    type="email"
                                    placeholder="E-posta adresinizi girin"
                                    className="flex-1 bg-transparent px-6 py-4 outline-none text-lg"
                                />
                                <button className="btn-premium px-10 py-4 font-black tracking-widest">
                                    ABONE OL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
