import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Box, Zap, CreditCard, Lock, Infinity, Users, FileText, Check, X, Loader2, Save } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Modal from '../../components/admin/Modal'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function SubscriptionPlansPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [formData, setFormData] = useState({
        name: '', price: { monthly: 0, yearly: 0 }, interval: 'Aylık', active: true, isPopular: false,
        limits: { cvCount: '', aiCredits: '', templates: 'Standart', exportPdf: false, watermarked: true }, color: 'slate'
    })

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = async () => {
        try {
            const res = await adminAPI.getPremiumPlans()
            if (res.success) {
                setPlans(res.plans)
            }
        } catch (error) {
            toast.error("Paketler getirilemedi")
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingItem(plan)
            setFormData({ 
                ...plan, 
                price: plan.price?.monthly || 0,
                interval: plan.interval || 'Aylık' 
            })
        } else {
            setEditingItem(null)
            setFormData({
                name: '', price: 0, interval: 'Aylık', active: true, isPopular: false,
                limits: { cvCount: '', aiCredits: '', templates: 'Standart', exportPdf: false, watermarked: true }, color: 'slate'
            })
        }
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if(window.confirm("Bu paketi silmek istediğinize emin misiniz?")) {
            try {
                await adminAPI.deletePremiumPlan(id)
                setPlans(plans.filter(p => p._id !== id))
                toast.success("Paket silindi")
            } catch(e) { toast.error("Silinemedi") }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        
        try {
            const payload = {
                ...formData,
                price: {
                    monthly: formData.interval === 'Aylık' ? Number(formData.price) : 0,
                    yearly: formData.interval === 'Yıllık' ? Number(formData.price) : 0
                }
            }
            if (editingItem) {
                const res = await adminAPI.updatePremiumPlan(editingItem._id, payload)
                if (res.success) setPlans(plans.map(p => p._id === editingItem._id ? res.plan : p))
            } else {
                const res = await adminAPI.createPremiumPlan(payload)
                if (res.success) setPlans([...plans, res.plan])
            }
            toast.success("Kaydedildi")
            setShowModal(false)
        } catch(e) {
            toast.error("Hata oluştu")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-8 font-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-3xl font-bold tracking-tight mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        Dinamik Abonelik Paketleri
                    </h2>
                    <p className={`text-base ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Kullanıcıların satın alabileceği planları (Fiyat, Limitler, AI Kredisi) dinamik olarak oluşturun ve yönetin.
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105 ${isDayMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`}
                >
                    <Plus className="w-5 h-5" /> Yeni Paket Oluştur
                </button>
            </div>

            {/* Grid of Plans */}
            {loading ? <div className="text-center p-8 text-slate-500">Yükleniyor...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan._id} className={`relative flex flex-col rounded-3xl border-2 transition-all ${isDayMode ? (plan.isPopular ? 'border-emerald-500 shadow-xl' : 'border-slate-200 bg-white') : (plan.isPopular ? 'border-emerald-500 bg-[#0F111A]' : 'border-white/10 bg-[#0F111A]')}`}>
                        
                        {plan.isPopular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                                En Çok Satan
                            </div>
                        )}

                        {/* Plan Header */}
                        <div className={`p-8 pb-6 border-b ${isDayMode ? 'border-slate-100' : 'border-white/5'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className={`text-2xl font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{plan.name}</h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleOpenModal(plan)}
                                        className={`p-2 rounded-lg transition-colors ${isDayMode ? 'text-slate-400 hover:bg-slate-100' : 'text-gray-500 hover:bg-white/10'}`}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    <button 
                                        onClick={() => handleDelete(plan._id)}
                                        className={`p-2 rounded-lg transition-colors ${isDayMode ? 'text-rose-500 hover:bg-rose-100' : 'text-rose-400 hover:bg-rose-500/20'}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-black ${isDayMode ? 'text-slate-900' : 'text-white'}`}>₺{plan.price?.monthly || plan.price?.yearly || plan.price || 0}</span>
                                <span className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>/{plan.interval || 'Aylık'}</span>
                            </div>
                            
                            {/* Toggle */}
                            <div className="mt-6 flex items-center justify-between">
                                <span className={`text-sm font-semibold ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>Satış Durumu</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked={plan.active} />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                                </label>
                            </div>
                        </div>

                        {/* Plan Limits */}
                        <div className="p-8 flex-1">
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-6 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Paket Limitleri & Özellikleri</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${isDayMode ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                        <strong className={isDayMode ? 'text-slate-900' : 'text-white'}>{plan.limits.cvCount}</strong> CV Oluşturma
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${isDayMode ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                        <strong className={isDayMode ? 'text-slate-900' : 'text-white'}>{plan.limits.aiCredits}</strong> AI Asistan Kredisi
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${isDayMode ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                        <Box className="w-4 h-4" />
                                    </div>
                                    <span className={`text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                        <strong className={isDayMode ? 'text-slate-900' : 'text-white'}>{plan.limits.templates}</strong> Şablonlara Erişim
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${plan.limits.exportPdf ? (isDayMode ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400') : (isDayMode ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-gray-500')}`}>
                                        {plan.limits.exportPdf ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-sm font-medium ${plan.limits.exportPdf ? (isDayMode ? 'text-slate-700' : 'text-gray-300') : (isDayMode ? 'text-slate-400 line-through' : 'text-gray-600 line-through')}`}>
                                        PDF Olarak İndirme
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${!plan.limits.watermarked ? (isDayMode ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400') : (isDayMode ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-gray-500')}`}>
                                        {!plan.limits.watermarked ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    </div>
                                    <span className={`text-sm font-medium ${!plan.limits.watermarked ? (isDayMode ? 'text-slate-700' : 'text-gray-300') : (isDayMode ? 'text-slate-400 line-through' : 'text-gray-600 line-through')}`}>
                                        Filigransız (Logosuz) CV
                                    </span>
                                </li>
                            </ul>
                        </div>
                        
                    </div>
                ))}
            </div>
            )}

            <Modal
                isOpen={showModal}
                onClose={() => { if(!submitting) setShowModal(false) }}
                title={editingItem ? "Paketi Düzenle" : "Yeni Paket Oluştur"}
                isDayMode={isDayMode}
                icon={<Box className={isDayMode ? "text-indigo-600" : "text-indigo-400"} />}
            >
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Paket Adı</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 shadow-inner'
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Fiyat (₺)</label>
                            <input
                                type="text"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className={`w-full px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                        : 'bg-white/5 border border-white/10 text-white focus:border-indigo-500/50 shadow-inner'
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Periyot</label>
                            <select
                                value={formData.interval}
                                onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                                className={`w-full px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all appearance-none cursor-pointer ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                        : 'bg-slate-900 border border-white/10 text-white focus:border-indigo-500/50 shadow-inner'
                                }`}
                            >
                                <option value="Aylık">Aylık</option>
                                <option value="Yıllık">Yıllık</option>
                                <option value="Tek Seferlik">Tek Seferlik</option>
                            </select>
                        </div>

                        <div>
                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-700' : 'text-gray-400'}`}>Tema Rengi</label>
                            <select
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className={`w-full px-5 py-4 rounded-2xl text-sm font-bold focus:outline-none transition-all appearance-none cursor-pointer ${
                                    isDayMode 
                                        ? 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                                        : 'bg-slate-900 border border-white/10 text-white focus:border-indigo-500/50 shadow-inner'
                                }`}
                            >
                                <option value="slate">Gri (Standart)</option>
                                <option value="emerald">Yeşil (Pro)</option>
                                <option value="purple">Mor (Kurumsal)</option>
                                <option value="indigo">İndigo</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl border bg-opacity-50 border-opacity-50">
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.active} 
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className={`text-sm font-bold ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>Aktif (Satışta)</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.isPopular} 
                                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className={`text-sm font-bold ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>En Çok Satan İşareti</span>
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2 ${isDayMode ? 'text-slate-400 border-slate-200' : 'text-gray-500 border-white/10'}`}>Limitler & Özellikler</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-xs font-bold mb-1 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>CV Sayısı</label>
                                    <input 
                                        type="text" 
                                        value={formData.limits.cvCount} 
                                        onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits, cvCount: e.target.value }})}
                                        placeholder="Örn: 1, 5, Sınırsız"
                                        className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none border ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/10 text-white'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-bold mb-1 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>AI Kredisi</label>
                                    <input 
                                        type="text" 
                                        value={formData.limits.aiCredits} 
                                        onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits, aiCredits: e.target.value }})}
                                        placeholder="Örn: 0, 50, Sınırsız"
                                        className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none border ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/10 text-white'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-xs font-bold mb-1 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Şablon Erişimi</label>
                                    <input 
                                        type="text" 
                                        value={formData.limits.templates} 
                                        onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits, templates: e.target.value }})}
                                        placeholder="Örn: Standart, Tümü"
                                        className={`w-full px-4 py-2 rounded-xl text-sm focus:outline-none border ${isDayMode ? 'bg-white border-slate-200' : 'bg-[#0B0D14] border-white/10 text-white'}`}
                                    />
                                </div>
                                <div className="space-y-2 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.limits.exportPdf} 
                                            onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits, exportPdf: e.target.checked }})}
                                            className="w-4 h-4 text-indigo-600 rounded"
                                        />
                                        <span className={`text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>PDF İndirme Aktif</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={!formData.limits.watermarked} 
                                            onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits, watermarked: !e.target.checked }})}
                                            className="w-4 h-4 text-indigo-600 rounded"
                                        />
                                        <span className={`text-sm font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>Filigran (Logo) Yok</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => setShowModal(false)}
                            className={`flex-1 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all disabled:opacity-50 ${
                                isDayMode 
                                    ? 'border-slate-200 text-slate-500 hover:bg-slate-100' 
                                    : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`flex-[2] py-4 rounded-2xl text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${
                                isDayMode 
                                    ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700' 
                                    : 'bg-indigo-500 shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95'
                            }`}
                        >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {editingItem ? 'DEĞİŞİKLİKLERİ KAYDET' : 'PAKETİ OLUŞTUR'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
