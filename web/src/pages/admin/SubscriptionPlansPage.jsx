import { useState } from 'react'
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Box, Zap, CreditCard, Lock, Infinity, Users, FileText, Check } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

const MOCK_PLANS = [
    {
        id: 'free',
        name: 'Basic (Ücretsiz)',
        price: '0',
        interval: 'Aylık',
        active: true,
        isPopular: false,
        limits: { cvCount: 1, aiCredits: 0, templates: 'Standart', exportPdf: false, watermarked: true },
        color: 'slate'
    },
    {
        id: 'pro',
        name: 'Pro Sürüm',
        price: '49.90',
        interval: 'Aylık',
        active: true,
        isPopular: true,
        limits: { cvCount: 5, aiCredits: 50, templates: 'Tümü', exportPdf: true, watermarked: false },
        color: 'emerald'
    },
    {
        id: 'enterprise',
        name: 'Kurumsal',
        price: '249.90',
        interval: 'Yıllık',
        active: true,
        isPopular: false,
        limits: { cvCount: 'Sınırsız', aiCredits: 'Sınırsız', templates: 'Tümü + Özel', exportPdf: true, watermarked: false },
        color: 'purple'
    }
]

export default function SubscriptionPlansPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const [plans, setPlans] = useState(MOCK_PLANS)

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
                <button className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105 ${isDayMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`}>
                    <Plus className="w-5 h-5" /> Yeni Paket Oluştur
                </button>
            </div>

            {/* Grid of Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className={`relative flex flex-col rounded-3xl border-2 transition-all ${isDayMode ? (plan.isPopular ? 'border-emerald-500 shadow-xl' : 'border-slate-200 bg-white') : (plan.isPopular ? 'border-emerald-500 bg-[#0F111A]' : 'border-white/10 bg-[#0F111A]')}`}>
                        
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
                                    <button className={`p-2 rounded-lg transition-colors ${isDayMode ? 'text-slate-400 hover:bg-slate-100' : 'text-gray-500 hover:bg-white/10'}`}>
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-4xl font-black ${isDayMode ? 'text-slate-900' : 'text-white'}`}>₺{plan.price}</span>
                                <span className={`text-sm font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>/{plan.interval}</span>
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
        </div>
    )
}
