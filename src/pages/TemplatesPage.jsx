import { Link } from 'react-router-dom'
import { Crown } from 'lucide-react'

const templates = [
    { id: 'modern', name: 'Modern', description: 'Renkli ve dinamik', isPremium: false, color: 'from-cyan-500 to-blue-600', preview: '🎨', category: 'Genel' },
    { id: 'minimalist', name: 'Minimalist', description: 'Sade ve profesyonel', isPremium: true, color: 'from-gray-600 to-gray-800', preview: '⚡', category: 'Genel' },
    { id: 'corporate', name: 'Kurumsal', description: 'Ciddi ve güven veren', isPremium: true, color: 'from-indigo-600 to-purple-700', preview: '🏢', category: 'Kurumsal' },
    { id: 'creative', name: 'Yaratıcı', description: 'Tasarımcılar için', isPremium: true, color: 'from-pink-500 to-orange-400', preview: '🌈', category: 'Yaratıcı' },
    { id: 'tech', name: 'Teknoloji', description: 'Yazılımcılar için', isPremium: true, color: 'from-slate-800 to-slate-900', preview: '💻', category: 'Teknoloji' },
    { id: 'executive', name: 'Yönetici', description: 'Üst düzey yöneticiler', isPremium: true, color: 'from-amber-600 to-yellow-500', preview: '👔', category: 'Kurumsal' },
    { id: 'elegant', name: 'Zarif', description: 'Klasik ve sofistike', isPremium: true, color: 'from-stone-500 to-stone-700', preview: '✨', category: 'Yaratıcı' },
    { id: 'healthcare', name: 'Sağlık', description: 'Doktor ve hemşireler', isPremium: true, color: 'from-teal-500 to-cyan-600', preview: '🏥', category: 'Sektörel' },
    { id: 'academic', name: 'Akademik', description: 'Araştırmacılar için', isPremium: true, color: 'from-amber-700 to-amber-900', preview: '📚', category: 'Sektörel' },
    { id: 'finance', name: 'Finans', description: 'Bankacılar için', isPremium: true, color: 'from-emerald-700 to-emerald-900', preview: '💰', category: 'Kurumsal' },
    { id: 'legal', name: 'Hukuk', description: 'Avukatlar için', isPremium: true, color: 'from-stone-700 to-stone-900', preview: '⚖️', category: 'Sektörel' },
    { id: 'marketing', name: 'Pazarlama', description: 'Pazarlamacılar için', isPremium: true, color: 'from-fuchsia-500 to-violet-600', preview: '📢', category: 'Yaratıcı' },
    { id: 'engineer', name: 'Mühendis', description: 'Mühendisler için', isPremium: true, color: 'from-zinc-700 to-zinc-900', preview: '⚙️', category: 'Teknoloji' },
    { id: 'retail', name: 'Satış', description: 'Satış uzmanları', isPremium: true, color: 'from-rose-500 to-pink-600', preview: '🛍️', category: 'Sektörel' },
    { id: 'hospitality', name: 'Turizm', description: 'Otelcilik sektörü', isPremium: true, color: 'from-amber-500 to-amber-700', preview: '🏨', category: 'Sektörel' },
    { id: 'government', name: 'Kamu', description: 'Devlet memurları', isPremium: true, color: 'from-blue-800 to-blue-900', preview: '🏛️', category: 'Sektörel' },
    { id: 'freelancer', name: 'Freelancer', description: 'Serbest çalışanlar', isPremium: true, color: 'from-lime-500 to-green-600', preview: '💼', category: 'Bireysel' },
    { id: 'startup', name: 'Startup', description: 'Girişimciler için', isPremium: true, color: 'from-violet-600 to-purple-800', preview: '🚀', category: 'Bireysel' },
    { id: 'international', name: 'Uluslararası', description: 'Global kariyer', isPremium: true, color: 'from-sky-600 to-sky-800', preview: '🌍', category: 'Bireysel' },
    { id: 'portfolio', name: 'Portfolyo', description: 'Görsel ağırlıklı', isPremium: true, color: 'from-neutral-800 to-neutral-900', preview: '🖼️', category: 'Yaratıcı' },
    // New 20 templates
    { id: 'scientist', name: 'Bilim İnsanı', description: 'Araştırmacılar için', isPremium: true, color: 'from-indigo-800 to-blue-900', preview: '🔬', category: 'Bilim' },
    { id: 'artist', name: 'Sanatçı', description: 'Sanat profesyonelleri', isPremium: true, color: 'from-purple-600 to-pink-600', preview: '🎨', category: 'Yaratıcı' },
    { id: 'teacher', name: 'Öğretmen', description: 'Eğitimciler için', isPremium: true, color: 'from-amber-600 to-orange-600', preview: '📖', category: 'Eğitim' },
    { id: 'chef', name: 'Şef', description: 'Mutfak profesyonelleri', isPremium: true, color: 'from-red-800 to-red-900', preview: '👨‍🍳', category: 'Sektörel' },
    { id: 'photographer', name: 'Fotoğrafçı', description: 'Görsel sanatçılar', isPremium: true, color: 'from-gray-800 to-black', preview: '📷', category: 'Yaratıcı' },
    { id: 'musician', name: 'Müzisyen', description: 'Müzik profesyonelleri', isPremium: true, color: 'from-purple-800 to-purple-950', preview: '🎵', category: 'Yaratıcı' },
    { id: 'athlet', name: 'Sporcu', description: 'Profesyonel sporcular', isPremium: true, color: 'from-orange-500 to-red-600', preview: '🏆', category: 'Spor' },
    { id: 'pilot', name: 'Pilot', description: 'Havacılık profesyonelleri', isPremium: true, color: 'from-sky-800 to-blue-900', preview: '✈️', category: 'Sektörel' },
    { id: 'construction', name: 'İnşaat', description: 'Yapı sektörü', isPremium: true, color: 'from-yellow-600 to-orange-600', preview: '🏗️', category: 'Sektörel' },
    { id: 'environment', name: 'Çevre', description: 'Çevre uzmanları', isPremium: true, color: 'from-emerald-600 to-green-700', preview: '🌱', category: 'Bilim' },
    { id: 'journalist', name: 'Gazeteci', description: 'Medya profesyonelleri', isPremium: true, color: 'from-slate-800 to-slate-900', preview: '📰', category: 'Yaratıcı' },
    { id: 'nurse', name: 'Hemşire', description: 'Sağlık çalışanları', isPremium: true, color: 'from-pink-500 to-rose-600', preview: '💉', category: 'Sektörel' },
    { id: 'logistics', name: 'Lojistik', description: 'Tedarik zinciri', isPremium: true, color: 'from-blue-700 to-indigo-800', preview: '🚚', category: 'Sektörel' },
    { id: 'security', name: 'Güvenlik', description: 'Güvenlik uzmanları', isPremium: true, color: 'from-slate-700 to-slate-900', preview: '🛡️', category: 'Sektörel' },
    { id: 'architect', name: 'Mimar', description: 'Mimarlık profesyonelleri', isPremium: true, color: 'from-neutral-700 to-neutral-900', preview: '🏛️', category: 'Yaratıcı' },
    { id: 'hr', name: 'İnsan Kaynakları', description: 'İK uzmanları', isPremium: true, color: 'from-violet-600 to-purple-700', preview: '👥', category: 'Kurumsal' },
    { id: 'datascience', name: 'Veri Bilimi', description: 'Data scientist', isPremium: true, color: 'from-cyan-600 to-purple-700', preview: '📊', category: 'Teknoloji' },
    { id: 'gamer', name: 'E-Spor', description: 'Oyun profesyonelleri', isPremium: true, color: 'from-purple-700 to-pink-600', preview: '🎮', category: 'Spor' },
    { id: 'consultant', name: 'Danışman', description: 'Danışmanlık uzmanları', isPremium: true, color: 'from-slate-600 to-slate-800', preview: '💡', category: 'Kurumsal' },
    { id: 'beauty', name: 'Güzellik', description: 'Güzellik uzmanları', isPremium: true, color: 'from-rose-400 to-pink-500', preview: '💅', category: 'Sektörel' }
]

const categories = ['Tümü', 'Genel', 'Kurumsal', 'Yaratıcı', 'Teknoloji', 'Sektörel', 'Bireysel', 'Bilim', 'Eğitim', 'Spor']

import { useState } from 'react'

export default function TemplatesPage() {
    const [activeCategory, setActiveCategory] = useState('Tümü')

    const filteredTemplates = activeCategory === 'Tümü'
        ? templates
        : templates.filter(t => t.category === activeCategory)

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">40+ Profesyonel Şablon</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Her sektör ve kariyer seviyesi için özel tasarlanmış premium şablonlar
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${activeCategory === cat
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTemplates.map((template) => (
                        <Link
                            key={template.id}
                            to={`/editor?template=${template.id}`}
                            className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
                        >
                            <div className={`h-40 bg-gradient-to-br ${template.color} flex items-center justify-center relative`}>
                                <span className="text-6xl opacity-60">{template.preview}</span>
                                {template.isPremium && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 rounded-full">
                                        <Crown className="w-3 h-3" />
                                        <span className="text-xs font-bold">PRO</span>
                                    </div>
                                )}
                                {!template.isPremium && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 px-2 py-1 rounded-full">
                                        <span className="text-xs font-bold">FREE</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="btn-premium text-sm py-2 px-6">Kullan</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold mb-1">{template.name}</h3>
                                <p className="text-gray-400 text-sm">{template.description}</p>
                                <span className="inline-block mt-2 text-xs px-2 py-1 bg-white/10 rounded-full text-gray-400">
                                    {template.category}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <p className="text-gray-400 mb-4">Tüm şablonları denemek ister misiniz?</p>
                    <Link to="/pricing" className="btn-premium">
                        Pro'ya Yükselt
                    </Link>
                </div>
            </div>
        </div>
    )
}
