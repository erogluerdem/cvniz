import { useState, useEffect } from 'react'
import {
    BookOpen, Search, Filter, Plus, Edit3, Trash2, Eye,
    MoreVertical, CheckCircle2, Clock, BarChart3, TrendingUp, Image as ImageIcon
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

import { adminAPI } from '../../services/api'
import Modal from '../../components/admin/Modal'

export default function BlogPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPost, setEditingPost] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        status: 'published'
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await adminAPI.getBlogPosts()
                if (response.success) {
                    setPosts(response.posts)
                }
            } catch (error) {
                toast.error("Blog yazıları getirilemedi.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchPosts()
    }, [toast])

    const handleDelete = async (id) => {
        if (window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
            try {
                const res = await adminAPI.deleteBlogPost(id)
                if (res.success) {
                    setPosts(posts.filter(p => p._id !== id))
                    toast.success("Blog yazısı başarıyla silindi.")
                }
            } catch (error) {
                toast.error("Silme işlemi başarısız oldu.")
            }
        }
    }

    const openModal = (post = null) => {
        if (post) {
            setEditingPost(post)
            setFormData({
                title: post.title || '',
                content: post.content || '',
                category: post.category || '',
                status: post.status || 'published'
            })
        } else {
            setEditingPost(null)
            setFormData({
                title: '',
                content: '',
                category: '',
                status: 'published'
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingPost) {
                const res = await adminAPI.updateBlogPost(editingPost._id, formData)
                if (res.success) {
                    setPosts(posts.map(p => p._id === editingPost._id ? res.post : p))
                    toast.success("Yazı güncellendi.")
                }
            } else {
                const res = await adminAPI.createBlogPost(formData)
                if (res.success) {
                    setPosts([res.post, ...posts])
                    toast.success("Yeni yazı eklendi.")
                }
            }
            setIsModalOpen(false)
        } catch (error) {
            toast.error("İşlem başarısız oldu.")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8 font-primary">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                        <BookOpen className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Blog Yönetimi</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>İçerik Stratejisi ve Yayımlama</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => openModal()}
                        className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg ${
                        isDayMode ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800' : 'bg-white text-slate-900 shadow-white/10 hover:bg-gray-100'
                    }`}>
                        <Plus className="w-4 h-4" />
                        YENİ YAZI EKLE
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'TOPLAM YAZI', value: '156', icon: BookOpen, color: 'indigo', growth: '+12%', sub: 'Bu ay +8 yeni' },
                    { label: 'YAYINDA OLAN', value: '142', icon: CheckCircle2, color: 'emerald', growth: '+5%', sub: 'Aktif içerikler' },
                    { label: 'TASLAKLAR', value: '14', icon: Clock, color: 'amber', growth: '-2%', sub: 'Onay bekleyen' },
                    { label: 'TOPLAM OKUNMA', value: '1.2M', icon: Eye, color: 'cyan', growth: '+24%', sub: 'Son 30 günde 45K' }
                ].map((stat, i) => (
                    <div key={i} className={`rounded-3xl p-7 border relative group overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                        isDayMode ? 'bg-white border-slate-200 shadow-sm hover:shadow-md' : 'glass-card border-white/5 hover:border-white/10'
                    }`}>
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 blur-3xl group-hover:scale-150 transition-all duration-700`}></div>
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3.5 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                                stat.growth.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                                {stat.growth.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                                {stat.growth}
                            </div>
                        </div>

                        <div className="space-y-1.5 relative z-10">
                            <span className={`text-[11px] font-bold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</span>
                            <div className={`text-3xl font-extrabold tracking-tight ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>{stat.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Table */}
            <div className={`rounded-3xl border overflow-hidden transition-colors ${
                isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'
            }`}>
                {/* Table Toolbar */}
                <div className={`p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isDayMode ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-white/[0.02]'
                }`}>
                    <div className="relative group max-w-md w-full">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                            isDayMode ? 'text-slate-400 group-focus-within:text-indigo-600' : 'text-gray-500 group-focus-within:text-indigo-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Yazı ara (Başlık veya yazar)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-white border border-slate-200 text-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                    : 'bg-black/20 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className={`px-4 py-3 rounded-2xl border flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                            isDayMode 
                                ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
                                : 'bg-black/20 border-white/10 text-gray-300 hover:bg-white/5'
                        }`}>
                            <Filter className="w-4 h-4" />
                            Filtrele
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${isDayMode ? 'border-slate-100' : 'border-white/5'}`}>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Yazı Bilgisi</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Kategori</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Durum</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>İstatistik</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] text-right ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-sm font-semibold text-gray-500">Yükleniyor...</td>
                                </tr>
                            ) : posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((post) => (
                                <tr key={post._id} className={`border-b last:border-0 transition-colors group ${
                                    isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                                }`}>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} className="w-16 h-12 rounded-xl object-cover border border-white/10 shadow-sm group-hover:shadow-md transition-shadow" />
                                            ) : (
                                                <div className={`w-16 h-12 rounded-xl flex items-center justify-center border ${
                                                    isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                                                }`}>
                                                    <ImageIcon className={`w-5 h-5 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`} />
                                                </div>
                                            )}
                                            <div>
                                                <div className={`font-bold text-sm mb-0.5 line-clamp-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                                    {post.title}
                                                </div>
                                                <div className={`text-[11px] font-semibold tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                                    {post.author?.name || 'Bilinmiyor'} • {new Date(post.createdAt || new Date()).toLocaleDateString('tr-TR')}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider border ${
                                            isDayMode 
                                                ? 'bg-slate-100 text-slate-600 border-slate-200' 
                                                : 'bg-white/5 text-gray-300 border-white/10'
                                        }`}>
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {post.status === 'published' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                                <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Yayında</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
                                                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Taslak</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1.5">
                                            <Eye className={`w-4 h-4 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`} />
                                            <span className={`text-xs font-bold ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                                {post.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openModal(post)}
                                                className={`p-2 rounded-xl transition-all ${
                                                isDayMode ? 'hover:bg-indigo-50 text-slate-400 hover:text-indigo-600' : 'hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400'
                                            }`} title="Düzenle">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(post._id)}
                                                className={`p-2 rounded-xl transition-all ${
                                                    isDayMode ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' : 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'
                                                }`} title="Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className={`p-2 rounded-xl transition-all ${
                                                isDayMode ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-white/10 text-gray-500 hover:text-white'
                                            }`}>
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-4 ${
                                            isDayMode ? 'bg-slate-100' : 'bg-white/5'
                                        }`}>
                                            <Search className={`w-8 h-8 ${isDayMode ? 'text-slate-300' : 'text-gray-600'}`} />
                                        </div>
                                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-1 ${isDayMode ? 'text-slate-700' : 'text-white'}`}>
                                            Sonuç Bulunamadı
                                        </h3>
                                        <p className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                            Arama kriterlerinize uygun blog yazısı bulunamadı.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Static UI for demo) */}
                <div className={`p-6 border-t flex items-center justify-between ${
                    isDayMode ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-white/[0.02]'
                }`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Toplam {posts.length} kayıt gösteriliyor
                    </span>
                    <div className="flex gap-2">
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isDayMode ? 'bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50' : 'bg-black/20 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5'
                        }`}>Geri</button>
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isDayMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                        }`}>1</button>
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isDayMode ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-black/20 border border-white/10 text-gray-300 hover:bg-white/5'
                        }`}>2</button>
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isDayMode ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-black/20 border border-white/10 text-gray-300 hover:bg-white/5'
                        }`}>İleri</button>
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Başlık</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Kategori</label>
                        <input
                            type="text"
                            required
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Durum</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900' 
                                    : 'bg-white/5 border border-white/10 text-white'
                            }`}
                        >
                            <option value="published">Yayında</option>
                            <option value="draft">Taslak</option>
                        </select>
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>İçerik</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10'
                            }`}
                        ></textarea>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                                isDayMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-gray-300'
                            }`}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${
                                isDayMode ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/20'
                            }`}
                        >
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
