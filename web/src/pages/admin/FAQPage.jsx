import { useState, useEffect } from 'react'
import {
    HelpCircle, Plus, Search, Filter, Edit3, Trash2,
    MessageCircle, Settings, CheckCircle2, AlertCircle
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

import { adminAPI } from '../../services/api'
import Modal from '../../components/admin/Modal'

export default function FAQPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [faqs, setFaqs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingFaq, setEditingFaq] = useState(null)
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: 'Genel',
        status: 'active',
        order: 0
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await adminAPI.getFaqs()
                if (response.success) {
                    setFaqs(response.faqs)
                }
            } catch (error) {
                toast.error("SSS getirilemedi.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchFaqs()
    }, [toast])

    const handleDelete = async (id) => {
        if (window.confirm("Bu SSS içeriğini silmek istediğinize emin misiniz?")) {
            try {
                const res = await adminAPI.deleteFaq(id)
                if (res.success) {
                    setFaqs(faqs.filter(f => f._id !== id))
                    toast.success("SSS başarıyla silindi.")
                }
            } catch (error) {
                toast.error("Silme işlemi başarısız oldu.")
            }
        }
    }

    const openModal = (faq = null) => {
        if (faq) {
            setEditingFaq(faq)
            setFormData({
                question: faq.question || '',
                answer: faq.answer || '',
                category: faq.category || 'Genel',
                status: faq.status || 'active',
                order: faq.order || 0
            })
        } else {
            setEditingFaq(null)
            setFormData({
                question: '',
                answer: '',
                category: 'Genel',
                status: 'active',
                order: 0
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingFaq) {
                const res = await adminAPI.updateFaq(editingFaq._id, formData)
                if (res.success) {
                    setFaqs(faqs.map(f => f._id === editingFaq._id ? res.faq : f))
                    toast.success("SSS güncellendi.")
                }
            } else {
                const res = await adminAPI.createFaq(formData)
                if (res.success) {
                    setFaqs([res.faq, ...faqs])
                    toast.success("Yeni SSS eklendi.")
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
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/20 shadow-xl shadow-rose-500/10">
                        <HelpCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>SSS Yönetimi</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                            <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Destek Merkezi ve Sorular</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => openModal()}
                    className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 shadow-lg ${
                    isDayMode ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-white text-slate-900 shadow-white/10'
                }`}>
                    <Plus className="w-4 h-4" />
                    YENİ SORU EKLE
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
                            isDayMode ? 'text-slate-400 group-focus-within:text-rose-600' : 'text-gray-500 group-focus-within:text-rose-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Soru ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-white border border-slate-200 text-slate-700 focus:border-rose-500' 
                                    : 'bg-black/20 border border-white/10 text-white focus:border-rose-500/50'
                            }`}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${isDayMode ? 'border-slate-100' : 'border-white/5'}`}>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Soru</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Kategori</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Durum</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] text-right ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-sm font-semibold text-gray-500">Yükleniyor...</td>
                                </tr>
                            ) : faqs.filter(f => (f.question || f.plan || '').toLowerCase().includes(searchQuery.toLowerCase())).map((faq) => (
                                <tr key={faq._id} className={`border-b last:border-0 transition-colors ${
                                    isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                                }`}>
                                    <td className="py-4 px-6">
                                        <div className={`font-bold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                            {faq.question || faq.plan}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider border ${
                                            isDayMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-gray-300 border-white/10'
                                        }`}>
                                            {faq.category}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {faq.status === 'active' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                                <span className="text-[11px] font-bold text-emerald-500 uppercase">Aktif</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></div>
                                                <span className="text-[11px] font-bold text-amber-500 uppercase">Taslak</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button 
                                            onClick={() => openModal(faq)}
                                            className={`p-2 rounded-xl transition-all mr-2 ${isDayMode ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600' : 'hover:bg-rose-500/20 text-gray-500 hover:text-rose-400'}`}>
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(faq._id)} className={`p-2 rounded-xl transition-all ${isDayMode ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' : 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'}`}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && faqs.filter(f => (f.question || f.plan || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
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
                title={editingFaq ? 'SSS Düzenle' : 'Yeni Soru Ekle'}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Soru</label>
                        <input
                            type="text"
                            required
                            value={formData.question}
                            onChange={e => setFormData({...formData, question: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10'
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
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10'
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
                            <option value="active">Aktif</option>
                            <option value="draft">Taslak</option>
                        </select>
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Sıra (Order)</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={e => setFormData({...formData, order: Number(e.target.value)})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-rose-500/50'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Cevap</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.answer}
                            onChange={e => setFormData({...formData, answer: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/10'
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
                                isDayMode ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
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
