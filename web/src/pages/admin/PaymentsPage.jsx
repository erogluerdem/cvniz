import { useState, useEffect} from 'react'
import { paymentAPI} from '../../services/api'
import {
 StatCard, DataTable, StatusBadge,
 PageHeader, FilterTabs, EmptyState
} from '../../components/admin/SharedComponents'
import {
 CreditCard, CheckCircle2, AlertCircle, Calendar,
 Search, Download, ExternalLink, X, Check, Eye
} from 'lucide-react'

export default function PaymentsPage() {
 const [payments, setPayments] = useState([])
 const [loading, setLoading] = useState(true)
 const [activeTab, setActiveTab] = useState('all')
 const [searchQuery, setSearchQuery] = useState('')

 // Approval Modal State
 const [selectedPayment, setSelectedPayment] = useState(null)
 const [rejectNote, setRejectNote] = useState('')
 const [showRejectModal, setShowRejectModal] = useState(false)

 useEffect(() => {
 loadPayments()
}, [])

 const loadPayments = async () => {
 try {
 const response = await paymentAPI.getAll()
 if (response.success) {
 setPayments(response.payments)
}
} catch (error) {
 console.error('Ödemeler yüklenemedi', error)
} finally {
 setLoading(false)
}
}

 const handleApprove = async (id) => {
 if (!window.confirm('Bu ödemeyi onaylamak istiyor musunuz?')) return

 try {
 await paymentAPI.approve(id)
 loadPayments()
} catch (error) {
 alert('Onaylama başarısız oldu')
}
}

 const handleReject = async () => {
 if (!selectedPayment) return

 try {
 await paymentAPI.reject(selectedPayment._id, rejectNote)
 setShowRejectModal(false)
 setRejectNote('')
 setSelectedPayment(null)
 loadPayments()
} catch (error) {
 alert('Reddetme başarısız oldu')
}
}

 // Stats
 const totalIncome = payments
 .filter(p => p.status === 'completed')
 .reduce((sum, p) => sum + (p.amount || 0), 0)

 const pendingCount = payments.filter(p => p.status === 'waiting_approval').length

 // Filter Logic
 const filtered = payments.filter(p => {
 const matchesSearch = p.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 p.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
 p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())

 if (activeTab === 'all') return matchesSearch
 if (activeTab === 'pending') return matchesSearch && p.status === 'waiting_approval'
 if (activeTab === 'completed') return matchesSearch && p.status === 'completed'
 return matchesSearch
})

 const columns = [
 {
 key: 'user',
 label: 'Kullanıcı',
 render: (_, row) => (
 <div>
 <div className="font-bold text-gray-900 dark:text-white">{row.userName}</div>
 <div className="text-xs text-gray-500">{row.userEmail}</div>
 </div>
 )
},
 {
 key: 'plan',
 label: 'Plan',
 render: (_, row) => (
 <div>
 <span className="font-medium text-gray-700 dark:text-gray-300">{row.planName}</span>
 <div className="text-xs text-gray-500 doc-code">{row.billingCycle}</div>
 </div>
 )
},
 {
 key: 'amount',
 label: 'Tutar',
 render: (val) => <span className="font-bold text-gray-900 dark:text-white">{val}₺</span>
},
 {
 key: 'provider',
 label: 'Yöntem',
 render: (val) => (
 <span className="capitalize text-sm text-gray-600 dark:text-gray-400">
 {val === 'bank_transfer' ? 'Havale/EFT' : val}
 </span>
 )
},
 {
 key: 'status',
 label: 'Durum',
 render: (val) => {
 const map = {
 completed: { label: 'Tamamlandı', type: 'success'},
 pending: { label: 'Bekliyor', type: 'warning'},
 failed: { label: 'Başarısız', type: 'error'},
 waiting_approval: { label: 'Onay Bekliyor', type: 'info'},
 rejected: { label: 'Reddedildi', type: 'error'}
}
 const status = map[val] || { label: val, type: 'default'}
 return <StatusBadge status={status.label} type={status.type} />
}
},
 {
 key: 'date',
 label: 'Tarih',
 render: (_, row) => new Date(row.createdAt).toLocaleDateString('tr-TR')
}
 ]

 return (
 <div className="space-y-8 animate-fade-in">
 <PageHeader
 title="Ödemeler"
 subtitle="Tüm finansal işlemler ve havale bildirimleri"
 />

 {/* Stats */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <StatCard
 icon={<CreditCard className="w-6 h-6" />}
 label="Toplam Gelir"
 value={`${totalIncome.toLocaleString()}₺`}
 change="+12%"
 changeType="positive"
 />
 <StatCard
 icon={<CheckCircle2 className="w-6 h-6" />}
 label="Başarılı İşlem"
 value={payments.filter(p => p.status === 'completed').length}
 />
 <StatCard
 icon={<AlertCircle className="w-6 h-6" />}
 label="Bekleyen Onay"
 value={pendingCount}
 change={pendingCount > 0 ?"Dikkat" :"Normal"}
 changeType={pendingCount > 0 ?"negative" :"positive"}
 />
 </div>

 {/* Toolbar */}
 <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
 <div className="relative w-full md:w-96">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="İşlem no, isim veya email ara..."
 className="bg-gray-100 dark:bg-black/20 border-transparent dark:border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full font-medium"
 />
 </div>
 <FilterTabs
 tabs={[
 { id: 'all', label: 'Tümü'},
 { id: 'pending', label: 'Onay Bekleyenler', count: pendingCount},
 { id: 'completed', label: 'Tamamlananlar'}
 ]}
 activeTab={activeTab}
 onChange={setActiveTab}
 />
 </div>

 {/* Table */}
 <DataTable
 columns={columns}
 data={filtered}
 actions={(row) => (
 <div className="flex items-center gap-2">
 {row.proofDocument && (
 <a
 href={row.proofDocument}
 target="_blank"
 rel="noopener noreferrer"
 className="p-2 rounded-lg hover:bg-white/10 text-cyan-500"
 title="Dekontu Gör"
 >
 <Eye className="w-4 h-4" />
 </a>
 )}

 {row.status === 'waiting_approval' && (
 <>
 <button
 onClick={() => handleApprove(row._id)}
 className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
 title="Onayla"
 >
 <Check className="w-4 h-4" />
 </button>
 <button
 onClick={() => {
 setSelectedPayment(row)
 setShowRejectModal(true)
}}
 className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
 title="Reddet"
 >
 <X className="w-4 h-4" />
 </button>
 </>
 )}
 </div>
 )}
 />

 {filtered.length === 0 && (
 <EmptyState
 icon={<CreditCard className="w-8 h-8 text-gray-400" />}
 title="Ödeme Bulunamadı"
 description="Seçilen kriterlere uygun ödeme kaydı yok."
 />
 )}

 {/* Reject Modal */}
 {showRejectModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
 <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-xl">
 <h3 className="text-xl font-bold text-white mb-4">Ödemeyi Reddet</h3>
 <p className="text-sm text-gray-400 mb-4">
 Bu ödemeyi neden reddettiğinizi açıklayın. Kullanıcıya bu mesaj iletilecektir.
 </p>
 <textarea
 value={rejectNote}
 onChange={(e) => setRejectNote(e.target.value)}
 placeholder="Red sebebi..."
 className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-red-500/50 min-h-[100px] mb-4"
 />
 <div className="flex gap-3 justify-end">
 <button
 onClick={() => setShowRejectModal(false)}
 className="px-4 py-2 rounded-xl text-gray-400 hover:bg-white/5"
 >
 İptal
 </button>
 <button
 onClick={handleReject}
 className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
 >
 Reddet
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )
}
