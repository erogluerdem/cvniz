import { useState } from 'react'
import {
    Network, Plus, Search, Filter, Edit3, Trash2,
    DollarSign, Users, Link as LinkIcon
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

const dummyAffiliates = [
    { id: 1, name: "Ahmet Yılmaz", code: "AHMET20", clicks: 1250, conversions: 120, revenue: "12.500₺", status: "active" },
    { id: 2, name: "Teknoloji Blogu", code: "TECHCV", clicks: 8430, conversions: 450, revenue: "45.000₺", status: "active" },
    { id: 3, name: "Kariyer Net", code: "KARIYER50", clicks: 120, conversions: 2, revenue: "200₺", status: "inactive" },
]

export default function AffiliatePage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [affiliates, setAffiliates] = useState(dummyAffiliates)

    const handleDelete = (id) => {
        if (window.confirm("Bu affiliate kaydını silmek istediğinize emin misiniz?")) {
            setAffiliates(affiliates.filter(a => a.id !== id))
            toast.success("Affiliate başarıyla silindi.")
        }
    }

    return (
        <div className="space-y-8 font-primary">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[2rem] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                        <Network className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Affiliate Yönetimi</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Satış Ortaklığı ve Kazançlar</p>
                        </div>
                    </div>
                </div>

                <button className={`px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 hover:scale-105 shadow-lg ${
                    isDayMode ? 'bg-slate-900 text-white shadow-slate-900/20' : 'bg-white text-slate-900 shadow-white/10'
                }`}>
                    <Plus className="w-4 h-4" />
                    YENİ PARTNER EKLE
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
                            isDayMode ? 'text-slate-400 group-focus-within:text-emerald-600' : 'text-gray-500 group-focus-within:text-emerald-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Partner ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium outline-none transition-all ${
                                isDayMode 
                                    ? 'bg-white border border-slate-200 text-slate-700 focus:border-emerald-500' 
                                    : 'bg-black/20 border border-white/10 text-white focus:border-emerald-500/50'
                            }`}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b ${isDayMode ? 'border-slate-100' : 'border-white/5'}`}>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Partner Adı</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Referans Kodu</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Tıklama / Dönüşüm</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Toplam Kazanç</th>
                                <th className={`py-4 px-6 text-[10px] font-extrabold uppercase tracking-[0.15em] text-right ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {affiliates.map((affiliate) => (
                                <tr key={affiliate.id} className={`border-b last:border-0 transition-colors ${
                                    isDayMode ? 'border-slate-100 hover:bg-slate-50' : 'border-white/5 hover:bg-white/[0.02]'
                                }`}>
                                    <td className="py-4 px-6">
                                        <div className={`font-bold text-sm flex items-center gap-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                            <Users className="w-4 h-4 text-emerald-500" />
                                            {affiliate.name}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold border ${
                                            isDayMode ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-gray-300 border-white/10'
                                        }`}>
                                            {affiliate.code}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-xs">
                                                <LinkIcon className="w-3 h-3 text-blue-500" />
                                                <span className={isDayMode ? 'text-slate-700' : 'text-gray-300'}>{affiliate.clicks}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Users className="w-3 h-3 text-emerald-500" />
                                                <span className={isDayMode ? 'text-slate-700' : 'text-gray-300'}>{affiliate.conversions}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className={`font-bold text-sm ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                                            {affiliate.revenue}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className={`p-2 rounded-xl transition-all mr-2 ${isDayMode ? 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-600' : 'hover:bg-emerald-500/20 text-gray-500 hover:text-emerald-400'}`}>
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(affiliate.id)} className={`p-2 rounded-xl transition-all ${isDayMode ? 'hover:bg-red-50 text-slate-400 hover:text-red-600' : 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'}`}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
