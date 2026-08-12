import { useState, useEffect } from 'react'
import { Webhook, Link2, CheckCircle2, XCircle, Settings2, Plus, Edit2, Trash2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'
import Modal from '../../components/admin/Modal'

export default function IntegrationsPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [integrations, setIntegrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingIntegration, setEditingIntegration] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'inactive',
        color: 'indigo'
    })

    useEffect(() => {
        fetchIntegrations()
    }, [])

    const fetchIntegrations = async () => {
        try {
            const res = await adminAPI.getIntegrations()
            if (res.success) {
                setIntegrations(res.integrations)
            }
        } catch (error) {
            toast.error('Entegrasyonlar yüklenemedi')
        } finally {
            setLoading(false)
        }
    }

    const openModal = (integration = null) => {
        if (integration) {
            setEditingIntegration(integration)
            setFormData({
                name: integration.name || '',
                description: integration.description || '',
                status: integration.status || 'inactive',
                color: integration.color || 'indigo'
            })
        } else {
            setEditingIntegration(null)
            setFormData({
                name: '',
                description: '',
                status: 'inactive',
                color: 'indigo'
            })
        }
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingIntegration) {
                const res = await adminAPI.updateIntegration(editingIntegration._id, formData)
                if (res.success) {
                    setIntegrations(integrations.map(i => i._id === editingIntegration._id ? res.integration : i))
                    toast.success('Entegrasyon güncellendi')
                }
            } else {
                const res = await adminAPI.createIntegration(formData)
                if (res.success) {
                    setIntegrations([res.integration, ...integrations])
                    toast.success('Yeni entegrasyon eklendi')
                }
            }
            setShowModal(false)
        } catch (error) {
            toast.error('İşlem başarısız')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Bu entegrasyonu silmek istediğinize emin misiniz?')) return
        try {
            const res = await adminAPI.deleteIntegration(id)
            if (res.success) {
                setIntegrations(integrations.filter(i => i._id !== id))
                toast.success('Entegrasyon silindi')
            }
        } catch (error) {
            toast.error('Silme işlemi başarısız')
        }
    }


    return (
        <div className="space-y-6 font-primary">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Entegrasyonlar & Webhook'lar</h2>
                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>3. parti araçlarla veri senkronizasyonunu yönetin.</p>
                </div>
                <button 
                  onClick={() => openModal()}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                    <Plus className="w-4 h-4" /> Yeni Entegrasyon
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-slate-500">Yükleniyor...</div>
            ) : integrations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">Kayıtlı entegrasyon bulunamadı.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {integrations.map((item) => (
                        <div key={item._id} className={`flex items-start gap-4 p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0B0D14] border-white/5'}`}>
                            <div className={`p-4 rounded-2xl bg-${item.color}-500/10 text-${item.color}-500`}>
                                <Link2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`text-lg font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.name}</h3>
                                    {item.status === 'active' ? (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                                            <CheckCircle2 className="w-3 h-3" /> Aktif
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                                            <XCircle className="w-3 h-3" /> Pasif
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{item.description}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(item)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                                        <Edit2 className="w-4 h-4" /> Düzenle
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors flex items-center gap-2 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600' : 'bg-white/5 border-white/10 text-gray-400 hover:text-red-500 hover:bg-white/10'}`}>
                                        <Trash2 className="w-4 h-4" /> Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={editingIntegration ? "Entegrasyonu Düzenle" : "Yeni Entegrasyon"}
                isDayMode={isDayMode}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Entegrasyon Adı</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="örn: Slack"
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Açıklama</label>
                        <textarea
                            rows={3}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Entegrasyon ne işe yarıyor?"
                            className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none resize-none ${
                                isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                            }`}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Durum</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                    isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                                }`}
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Pasif</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className={`text-xs font-semibold ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>İkon Rengi</label>
                            <select
                                value={formData.color}
                                onChange={(e) => setFormData({...formData, color: e.target.value})}
                                className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors border outline-none ${
                                    isDayMode ? 'bg-white border-slate-200 focus:border-cyan-500 text-slate-800' : 'bg-white/5 border-white/10 focus:border-cyan-500/50 text-white'
                                }`}
                            >
                                <option value="indigo">Mor (Indigo)</option>
                                <option value="emerald">Yeşil (Emerald)</option>
                                <option value="purple">Eflatun (Purple)</option>
                                <option value="amber">Sarı (Amber)</option>
                                <option value="blue">Mavi (Blue)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className={`flex-1 py-3 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all border ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex-1 py-3 rounded-2xl text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg ${isDayMode ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-600/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20 hover:scale-[1.02] active:scale-95'}`}
                        >
                            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

