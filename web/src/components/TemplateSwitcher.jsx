import { useState, useMemo } from 'react'
import { X, Search, Crown, Check, Layout, Sparkles } from 'lucide-react'
import { templates } from '../data/templates'

export default function TemplateSwitcher({
    isOpen,
    onClose,
    selectedTemplate,
    onSelect,
    isPremium
}) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('All')

    const categories = ['All', 'Professional', 'Modern', 'Creative', 'Tech', 'Industry']

    const filteredTemplates = useMemo(() => {
        return templates.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = filter === 'All' || t.category === filter
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, filter])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-12 overflow-hidden animate-in fade-in duration-300">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-full max-h-[85vh] bg-[#0f1115] border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <header className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
                            <Layout className="w-8 h-8 text-cyan-400" />
                            Elite Şablon Galerisi
                        </h2>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">40+ Premium Tasarım // Tasarımı Anında Değiştir</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Şablon ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 w-full md:w-64"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                {/* Filters */}
                <div className="px-8 py-4 border-b border-white/5 flex items-center gap-3 overflow-x-auto shrink-0 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat
                                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                                    : 'bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10 border border-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#090a0d]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTemplates.map(t => (
                            <div
                                key={t.id}
                                onClick={() => onSelect(t.id)}
                                className={`group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${selectedTemplate === t.id
                                        ? 'ring-2 ring-cyan-500 ring-offset-4 ring-offset-[#090a0d] scale-[1.02]'
                                        : 'hover:scale-[1.02]'
                                    }`}
                            >
                                {/* Preview Card */}
                                <div className="aspect-[3/4] bg-[#0d0f12] border border-white/5 rounded-3xl p-4 flex flex-col gap-4 relative overflow-hidden group-hover:border-white/20 transition-all">
                                    {/* Mock CV Preview Lines */}
                                    <div className="w-full h-8 bg-white/5 rounded-lg flex items-center px-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-lg">{t.emoji}</div>
                                        <div className="ml-3 h-2 w-20 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-full bg-white/5 rounded-full" />
                                        <div className="h-1.5 w-[80%] bg-white/5 rounded-full" />
                                        <div className="h-1.5 w-[90%] bg-white/5 rounded-full" />
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.category}</span>
                                            {t.isPremium && !isPremium && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                                        </div>
                                    </div>

                                    {/* Selected Overlay */}
                                    {selectedTemplate === t.id && (
                                        <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                                            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center shadow-xl shadow-cyan-500/20">
                                                <Check className="w-7 h-7 text-slate-950 stroke-[3]" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Hover Action */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                                        <button className="w-full py-3 rounded-2xl bg-white text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-xl">
                                            Şablonu Seç
                                        </button>
                                    </div>
                                </div>

                                {/* Label */}
                                <div className="mt-4 px-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{t.name}</h3>
                                        {t.isPremium && <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 uppercase italic">Şablon Bulunamadı</h3>
                            <p className="text-slate-500 text-sm font-medium">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="p-8 border-t border-white/5 bg-[#0f1115] shrink-0 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Elite Template System v2.0 // Fully Responsive</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                            <Crown className="w-4 h-4" /> Premium Unlocked
                        </div>
                        <button
                            onClick={onClose}
                            className="btn-premium px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                        >
                            TAMAMLANDI
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
}
