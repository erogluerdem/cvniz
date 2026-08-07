import { useState, useEffect } from 'react'
import {
    MailOpen, Plus, Search, Filter, Edit3, Trash2,
    Eye, LayoutTemplate
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

import { adminAPI } from '../../services/api'
import Modal from '../../components/admin/Modal'

export default function EmailTemplatesPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [templates, setTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        body: '',
        type: 'General',
        status: 'active'
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await adminAPI.getEmailTemplates()
                if (response.success) {
                    setTemplates(response.templates)
                }
            } catch (error) {
                toast.error("E-posta şablonları getirilemedi.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchTemplates()
    }, [toast])

    const handleDelete = async (id) => {
        if (window.confirm("Bu e-posta şablonunu silmek istediğinize emin misiniz?")) {
            try {
                const res = await adminAPI.deleteEmailTemplate(id)
                if (res.success) {
                    setTemplates(templates.filter(t => t._id !== id))
                    toast.success("E-posta şablonu başarıyla silindi.")
                }
            } catch (error) {
                toast.error("Silme işlemi başarısız oldu.")
            }
        }
    }

    const openModal = (template = null) => {
        if (template) {
            setEditingTemplate(template)
            setFormData({
                name: template.name || '',
                subject: template.subject || '',
                body: template.body || '',
                type: template.type || 'General',
                status: template.status || 'active'
            })
        } else {
            setEditingTemplate(null)
            setFormData({
                name: '',
                subject: '',
                body: '',
                type: 'General',
                status: 'active'
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingTemplate) {
                const res = await adminAPI.updateEmailTemplate(editingTemplate._id, formData)
                if (res.success) {
                    setTemplates(templates.map(t => t._id === editingTemplate._id ? res.template : t))
                    toast.success("E-posta şablonu güncellendi.")
                }
            } else {
                const res = await adminAPI.createEmailTemplate(formData)
                if (res.success) {
                    setTemplates([res.template, ...templates])
                    toast.success("Yeni e-posta şablonu eklendi.")
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
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 shadow-xl shadow-blue-500/10">
                        <MailOpen className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>E-posta Şablonları</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Otomatik İletişim Şablonları</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => openModal()}
                    className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 shadow-lg ${
                    isDayMode ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-white text-slate-900 shadow-white/10'
                }`}>
                    <Plus className="w-4 h-4" />
                    YENİ ŞABLON OLUŞTUR
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
                            isDayMode ? 'text-slate-400 group-focus-within:text-blue-600' : 'text-gray-500 group-focus-within:text-blue-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Şablon ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-white border border-slate-200 text-slate-700 focus:border-blue-500' 
                                    : 'bg-black/20 border border-white/10 text-white focus:border-blue-500/50'
                            }`}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${isDayMode ? 'border-slate-100' : 'border-white/5'}`}>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Şablon Adı & Konu</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Kategori</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Durum</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Gönderim</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] text-right ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-sm font-semibold text-gray-500">Yükleniyor...</td>
                                </tr>
                            ) : templates.filter(t => (t.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((template) => (
                                <tr key={template._id} className={`border-b last:border-0 transition-colors ${
                                    isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                                }`}>
                                    <td className="py-4 px-6">
                                        <div className={`font-bold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                            {template.name}
                                        </div>
                                        <div className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                            Konu: {template.subject}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider border ${
                                            isDayMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-gray-300 border-white/10'
                                        }`}>
                                            {template.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {template.status === 'active' ? (
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
                                    <td className="py-4 px-6">
                                        <div className={`text-xs font-bold ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            {(template.sent || template.usageCount || 0).toLocaleString()} Gönderim
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right flex items-center justify-end">
                                        <button className={`p-2 rounded-xl transition-all mr-1 ${isDayMode ? 'hover:bg-blue-50 text-slate-400 hover:text-blue-600' : 'hover:bg-blue-500/20 text-gray-500 hover:text-blue-400'}`} title="Önizle">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => openModal(template)}
                                            className={`p-2 rounded-xl transition-all mr-1 ${isDayMode ? 'hover:bg-indigo-50 text-slate-400 hover:text-indigo-600' : 'hover:bg-indigo-500/20 text-gray-500 hover:text-indigo-400'}`} title="Düzenle">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(template._id)} className={`p-2 rounded-xl transition-all ${isDayMode ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' : 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'}`} title="Sil">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && templates.filter(t => (t.name || '').toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center text-sm font-semibold text-gray-500">Kayıt bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingTemplate ? 'Şablon Düzenle' : 'Yeni Şablon Ekle'}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Şablon Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Kategori</label>
                        <input
                            type="text"
                            required
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
                            }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>E-posta Konusu</label>
                        <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={e => setFormData({...formData, subject: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
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
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>İçerik (HTML veya Metin)</label>
                        <textarea
                            required
                            rows="6"
                            value={formData.body}
                            onChange={e => setFormData({...formData, body: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all font-mono ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
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
                                isDayMode ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
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
