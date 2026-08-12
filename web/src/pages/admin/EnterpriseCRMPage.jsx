import { useState, useEffect } from 'react'
import { Building2, PhoneCall, Mail, Calendar, MoreVertical, Plus, Edit3, Trash2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/admin/Modal'

export default function EnterpriseCRMPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const stages = ['Görüşülüyor', 'Teklif Verildi', 'Kazanıldı']
    
    const [deals, setDeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDeal, setEditingDeal] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    
    const [formData, setFormData] = useState({
        company: '',
        holding: '',
        stage: 'Görüşülüyor',
        value: '',
        contact: '',
        lastAction: '',
        notes: ''
    })

    useEffect(() => {
        fetchDeals()
    }, [])

    const fetchDeals = async () => {
        try {
            const res = await adminAPI.getCRMDeals()
            if (res.success) {
                setDeals(res.deals)
            }
        } catch (error) {
            toast.error('Fırsatlar yüklenemedi')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (deal = null) => {
        if (deal) {
            setEditingDeal(deal)
            setFormData({
                company: deal.company || '',
                holding: deal.holding || '',
                stage: deal.stage || 'Görüşülüyor',
                value: deal.value || '',
                contact: deal.contact || '',
                lastAction: deal.lastAction || '',
                notes: deal.notes || ''
            })
        } else {
            setEditingDeal(null)
            setFormData({
                company: '',
                holding: '',
                stage: 'Görüşülüyor',
                value: '',
                contact: '',
                lastAction: '',
                notes: ''
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingDeal) {
                const res = await adminAPI.updateCRMDeal(editingDeal._id, formData)
                if (res.success) {
                    setDeals(deals.map(d => d._id === editingDeal._id ? res.deal : d))
                    toast.success('Fırsat güncellendi')
                }
            } else {
                const res = await adminAPI.createCRMDeal(formData)
                if (res.success) {
                    setDeals([res.deal, ...deals])
                    toast.success('Yeni fırsat eklendi')
                }
            }
            setIsModalOpen(false)
        } catch (error) {
            toast.error('İşlem başarısız')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bu fırsatı silmek istediğinize emin misiniz?')) return
        try {
            const res = await adminAPI.deleteCRMDeal(id)
            if (res.success) {
                setDeals(deals.filter(d => d._id !== id))
                toast.success('Fırsat silindi')
            }
        } catch (error) {
            toast.error('Silme işlemi başarısız')
        }
    }

    return (
        <div className="space-y-6 font-primary min-h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Kurumsal CRM (B2B)</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Şirketlerle olan görüşmeleri ve kurumsal satış sürecini yönetin.</p>
                </div>
                <button onClick={() => openModal()} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                    <Plus className="w-4 h-4" /> Yeni Fırsat Ekle
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                {stages.map(stage => (
                    <div key={stage} className={`flex flex-col rounded-2xl border ${isDayMode ? 'bg-slate-50/50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                        <div className={`p-4 border-b font-semibold flex items-center justify-between ${isDayMode ? 'border-slate-200 text-slate-900' : 'border-white/10 text-white'}`}>
                            {stage}
                            <span className="text-xs font-normal text-slate-500 px-2 py-1 bg-slate-200 dark:bg-white/10 rounded-full">
                                {deals.filter(d => d.stage === stage).length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4">
                            {loading ? (
                                <div className="text-center text-sm text-slate-500">Yükleniyor...</div>
                            ) : deals.filter(d => d.stage === stage).map(deal => (
                                <div key={deal._id} className={`group p-4 rounded-xl border shadow-sm transition-all ${isDayMode ? 'bg-white border-slate-200 hover:border-cyan-300' : 'bg-[#12151D] border-white/10 hover:border-cyan-500/50'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{deal.company || deal.holding}</h4>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal(deal)} className="p-1 rounded-lg text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-white/5">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(deal._id)} className="p-1 rounded-lg text-slate-400 hover:text-red-500 bg-slate-100 dark:bg-white/5">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={`text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-4`}>{deal.value}</div>
                                    
                                    <div className="space-y-2 text-xs text-slate-500 dark:text-gray-400">
                                        <div className="flex items-center gap-2"><PhoneCall className="w-3 h-3" /> {deal.contact}</div>
                                        <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {deal.lastAction}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingDeal ? 'Fırsatı Düzenle' : 'Yeni Fırsat Ekle'}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Şirket/Holding Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.company}
                            onChange={e => setFormData({...formData, company: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10'
                            }`}
                        />
                    </div>
                    
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Aşama</label>
                        <select
                            value={formData.stage}
                            onChange={e => setFormData({...formData, stage: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900' 
                                    : 'bg-white/5 border border-white/10 text-white'
                            }`}
                        >
                            {stages.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Değer (örn: ₺50,000)</label>
                            <input
                                type="text"
                                required
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: e.target.value})}
                                className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500/50'
                                }`}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>İletişim Kişisi</label>
                            <input
                                type="text"
                                required
                                value={formData.contact}
                                onChange={e => setFormData({...formData, contact: e.target.value})}
                                className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500/50'
                                }`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Son İşlem</label>
                        <input
                            type="text"
                            required
                            value={formData.lastAction}
                            onChange={e => setFormData({...formData, lastAction: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500/50'
                            }`}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Notlar</label>
                        <textarea
                            rows="2"
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                            className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all resize-none ${
                                isDayMode 
                                    ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-cyan-500' 
                                    : 'bg-white/5 border border-white/10 text-white focus:border-cyan-500/50'
                            }`}
                        />
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
                                isDayMode ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20' : 'bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/20'
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
