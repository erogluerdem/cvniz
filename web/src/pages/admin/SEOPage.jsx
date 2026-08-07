import { useState, useEffect } from 'react'
import {
    Globe, Plus, Search, Filter, Edit3, Trash2,
    Activity, ArrowUpRight
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

import { adminAPI } from '../../services/api'
import Modal from '../../components/admin/Modal'

export default function SEOPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [seoPages, setSeoPages] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingSeo, setEditingSeo] = useState(null)
    const [formData, setFormData] = useState({
        path: '',
        title: '',
        description: '',
        keywords: '',
        healthScore: 0
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchSeoSettings = async () => {
            try {
                const response = await adminAPI.getSeoSettings()
                if (response.success) {
                    setSeoPages(response.seoData)
                }
            } catch (error) {
                toast.error("SEO ayarları getirilemedi.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchSeoSettings()
    }, [toast])

    const handleDelete = async (id) => {
        if (window.confirm("Bu SEO kaydını silmek istediğinize emin misiniz?")) {
            try {
                const res = await adminAPI.deleteSeoSetting(id)
                if (res.success) {
                    setSeoPages(seoPages.filter(p => p._id !== id))
                    toast.success("SEO ayarı başarıyla silindi.")
                }
            } catch (error) {
                toast.error("Silme işlemi başarısız oldu.")
            }
        }
    }

    const openModal = (seo = null) => {
        if (seo) {
            setEditingSeo(seo)
            setFormData({
                path: seo.path || '',
                title: seo.title || '',
                description: seo.description || '',
                keywords: seo.keywords ? seo.keywords.join(', ') : '',
                healthScore: seo.healthScore || 0
            })
        } else {
            setEditingSeo(null)
            setFormData({
                path: '',
                title: '',
                description: '',
                keywords: '',
                healthScore: 0
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const dataToSave = {
                ...formData,
                keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean)
            }
            if (editingSeo) {
                const res = await adminAPI.updateSeoSetting(editingSeo._id, dataToSave)
                if (res.success) {
                    setSeoPages(seoPages.map(p => p._id === editingSeo._id ? res.seoItem : p))
                    toast.success("SEO ayarı güncellendi.")
                }
            } else {
                const res = await adminAPI.createSeoSetting(dataToSave)
                if (res.success) {
                    setSeoPages([res.seoItem, ...seoPages])
                    toast.success("Yeni SEO ayarı oluşturuldu.")
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                        <Globe className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>SEO Ayarları</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Arama Motoru Optimizasyonu</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => openModal()}
                    className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 shadow-lg ${
                    isDayMode ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-white text-slate-900 shadow-white/10'
                }`}>
                    <Plus className="w-4 h-4" />
                    YENİ SAYFA EKLE
                </button>
            </div>

            <div className={`rounded-3xl border overflow-hidden transition-colors ${
                isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'
            }`}>
                <div className={`p-6 border-b flex items-center justify-between gap-4 ${
                    isDayMode ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-white/[0.02]'
                }`}>
                    <div className="relative group max-w-md w-full">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                            isDayMode ? 'text-slate-400 group-focus-within:text-indigo-600' : 'text-gray-500 group-focus-within:text-indigo-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Sayfa ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-white border border-slate-200 text-slate-700 focus:border-indigo-500' 
                                    : 'bg-black/20 border border-white/10 text-white focus:border-indigo-500/50'
                            }`}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${isDayMode ? 'border-slate-100' : 'border-white/5'}`}>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Sayfa / URL</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>SEO Başlığı</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Sağlık Skoru</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] text-right ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-sm font-semibold text-gray-500">Yükleniyor...</td>
                                </tr>
                            ) : seoPages.filter(p => (p.path || '').toLowerCase().includes(searchQuery.toLowerCase())).map((page) => (
                                <tr key={page._id} className={`border-b last:border-0 transition-colors ${
                                    isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                                }`}>
                                    <td className="py-4 px-6">
                                        <div className={`font-bold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                            {page.path}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`text-xs font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            {page.title}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-full max-w-[100px] h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-white/10">
                                                <div 
                                                    className={`h-full ${page.healthScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${page.healthScore || 0}%` }}
                                                />
                                            </div>
                                            <span className={`text-xs font-bold ${page.healthScore >= 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {page.healthScore || 0}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => openModal(page)}
                                            className={`p-2 rounded-xl transition-all mr-2 ${isDayMode ? 'hover:bg-indigo-50 text-slate-400 hover:text-indigo-600' : 'hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400'}`}>
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(page._id)} className={`p-2 rounded-xl transition-all ${isDayMode ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' : 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'}`}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && seoPages.filter(p => (p.path || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-sm font-semibold text-gray-500">Kayıt bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingSeo ? 'SEO Ayarını Düzenle' : 'Yeni SEO Ayarı Ekle'}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>URL Yolu (örn: /about)</label>
                        <input
                            type="text"
                            required
                            value={formData.path}
                            onChange={e => setFormData({...formData, path: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>SEO Başlığı</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Anahtar Kelimeler (Virgülle ayırın)</label>
                        <input
                            type="text"
                            value={formData.keywords}
                            onChange={e => setFormData({...formData, keywords: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Sağlık Skoru (0-100)</label>
                        <input
                            type="number"
                            min="0" max="100"
                            value={formData.healthScore}
                            onChange={e => setFormData({...formData, healthScore: Number(e.target.value)})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Açıklama</label>
                        <textarea
                            required
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50'
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
