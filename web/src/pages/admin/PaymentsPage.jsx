import { useState, useEffect } from 'react'
import {
    DollarSign, CreditCard, TrendingUp, CheckCircle,
    Clock, AlertCircle, Search, Filter, Calendar,
    ChevronRight, Download, User, Mail,
    ArrowUpRight, ArrowDownRight, Wallet, Activity
} from 'lucide-react'
import { paymentAPI } from '../../services/api'
import { StatusBadge } from '../../components/admin/SharedComponents'

export default function PaymentsPage() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        setLoading(true)
        try {
            const response = await paymentAPI.getAll()
            if (response.success) {
                setPayments(response.payments)
            }
        } catch (error) {
            console.error('Payments fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredPayments = payments.filter(p => {
        const matchesSearch =
            p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = filterStatus === 'all' || p.status === filterStatus

        return matchesSearch && matchesStatus
    })

    const stats = {
        totalRevenue: payments.reduce((acc, curr) => curr.status === 'completed' ? acc + curr.amount : acc, 0),
        successfulCount: payments.filter(p => p.status === 'completed').length,
        pendingCount: payments.filter(p => p.status === 'pending').length,
        failedCount: payments.filter(p => p.status === 'failed' || p.status === 'refunded').length,
        avgTicket: payments.length > 0 ? (payments.reduce((acc, curr) => acc + curr.amount, 0) / payments.length).toFixed(2) : 0
    }

    if (loading && payments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                    <Wallet className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Finansal Veriler Yükleniyor</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">İşlem geçmişi güvenli şekilde çekiliyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-green-500/20 border border-green-500/20">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        Ödeme ve Finans Yönetimi
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Platform üzerindeki tüm finansal hareketleri izleyin.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" /> RAPOR İNDİR
                    </button>
                </div>
            </div>

            {/* Financial Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'TOPLAM GELİR', value: `₺${stats.totalRevenue}`, sub: '+12% bu ay', icon: <TrendingUp className="w-4 h-4" />, color: 'green', up: true },
                    { label: 'BAŞARILI İŞLEM', value: stats.successfulCount, sub: 'İşlem tamamlandı', icon: <CheckCircle className="w-4 h-4" />, color: 'cyan', up: true },
                    { label: 'BEKLEYEN', value: stats.pendingCount, sub: 'Onay bekliyor', icon: <Clock className="w-4 h-4" />, color: 'amber', up: false },
                    { label: 'ORTALAMA SEPET', value: `₺${stats.avgTicket}`, sub: 'İşlem başına', icon: <Activity className="w-4 h-4" />, color: 'purple', up: true }
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 blur-3xl -z-10`}></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-400 shadow-inner`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black ${stat.up ? 'text-green-500' : 'text-amber-500'}`}>
                                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.sub}
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="glass-card rounded-[2.5rem] p-4 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Kullanıcı, e-posta veya ID ile ara..."
                        className="bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/30 transition-all w-full font-medium shadow-inner"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                    {[
                        { id: 'all', label: 'TÜMÜ', color: 'gray' },
                        { id: 'completed', label: 'TAMAMLANDI', color: 'green' },
                        { id: 'pending', label: 'BEKLEMEDE', color: 'amber' },
                        { id: 'failed', label: 'HATALI', color: 'red' }
                    ].map(status => (
                        <button
                            key={status.id}
                            onClick={() => setFilterStatus(status.id)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status.id
                                    ? 'bg-white/10 border-white/20 text-white shadow-lg'
                                    : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payments List */}
            <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">TRANSACTION ID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">MÜŞTERİ</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">PLAN / PERİYOT</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">TUTAR</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">TARİH</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">DURUM</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">AKSİYON</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredPayments.map(payment => (
                                <tr key={payment._id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/5 text-gray-500 group-hover:text-cyan-400 transition-colors">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-black text-gray-300 tracking-tighter uppercase">{payment.transactionId || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white uppercase tracking-tight">{payment.userName}</span>
                                            <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3 opacity-50" /> {payment.userEmail}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">{payment.planName}</span>
                                            <span className="text-[10px] font-bold text-gray-600 uppercase italic">{payment.billingCycle === 'yearly' ? 'Yıllık Dönem' : 'Aylık Dönem'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-lg font-black text-white italic">₺{payment.amount}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-gray-400">{new Date(payment.createdAt).toLocaleDateString('tr-TR')}</span>
                                            <span className="text-[10px] font-bold text-gray-600">{new Date(payment.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <StatusBadge
                                                status={payment.status === 'completed' ? 'Başarılı' : payment.status === 'pending' ? 'Beklemede' : 'Hatalı'}
                                                type={payment.status === 'completed' ? 'success' : payment.status === 'pending' ? 'warning' : 'error'}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center justify-center opacity-40">
                        <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
                        <h4 className="text-lg font-black text-white uppercase tracking-tighter">KAYIT BULUNAMADI</h4>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Kriterlerinize uygun bir ödeme işlemi mevcut değil.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
