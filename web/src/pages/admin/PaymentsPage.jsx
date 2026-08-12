import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { paymentAPI } from '../../services/api'
import {
  StatCard, DataTable, StatusBadge,
  PageHeader, FilterTabs, EmptyState
} from '../../components/admin/SharedComponents'
import {
  CreditCard, CheckCircle2, AlertCircle, Calendar,
  Search, Download, ExternalLink, X, Check, Eye
} from 'lucide-react'

export default function PaymentsPage() {
  const { isDayMode } = useOutletContext() || { isDayMode: false }
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
      key: 'transactionId',
      label: 'İşlem Kodu',
      render: (val) => <span className={`font-mono text-xs font-bold ${isDayMode ? 'text-slate-900' : 'text-cyan-400'}`}>{val || 'N/A'}</span>
    },
    {
      key: 'user',
      label: 'Kullanıcı',
      render: (_, row) => (
        <div>
          <div className={`font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{row.userName}</div>
          <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{row.userEmail}</div>
        </div>
      )
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (_, row) => (
        <div>
          <span className={`font-medium ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>{row.planName}</span>
          <div className={`text-xs doc-code ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>{row.billingCycle}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Tutar',
      render: (val) => <span className={`font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{val}₺</span>
    },
    {
      key: 'provider',
      label: 'Yöntem',
      render: (val) => (
        <span className={`capitalize text-sm ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>
          {val === 'bank_transfer' ? 'Havale/EFT' : val}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Durum',
      render: (val) => {
        const map = {
          completed: { label: 'Tamamlandı', type: 'success' },
          pending: { label: 'Bekliyor', type: 'warning' },
          failed: { label: 'Başarısız', type: 'error' },
          waiting_approval: { label: 'Onay Bekliyor', type: 'info' },
          rejected: { label: 'Reddedildi', type: 'error' }
        }
        const status = map[val] || { label: val, type: 'default' }
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
    <div className="space-y-8 animate-fade-in font-primary">
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
          change={pendingCount > 0 ? "Dikkat" : "Normal"}
          changeType={pendingCount > 0 ? "negative" : "positive"}
        />
      </div>

      {/* Toolbar */}
      <div className={`rounded-2xl p-4 border flex flex-col md:flex-row items-center justify-between gap-4 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'}`}>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İşlem no, isim veya email ara..."
            className={`border rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all w-full font-medium ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-black/20 border-white/5 text-white'}`}
          />
        </div>
        <FilterTabs
          tabs={[
            { id: 'all', label: 'Tümü' },
            { id: 'pending', label: 'Onay Bekleyenler', count: pendingCount },
            { id: 'completed', label: 'Tamamlananlar' }
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
                className="p-2 rounded-lg hover:bg-cyan-500/10 text-cyan-500"
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
          icon={<CreditCard className="w-8 h-8 text-slate-400 dark:text-gray-400" />}
          title="Ödeme Bulunamadı"
          description="Seçilen kriterlere uygun ödeme kaydı yok."
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`rounded-2xl p-6 w-full max-w-md border shadow-xl ${isDayMode ? 'bg-white border-slate-200 shadow-2xl' : 'bg-slate-900 border-white/10'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Ödemeyi Reddet</h3>
            <p className={`text-sm mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
              Bu ödemeyi neden reddettiğinizi açıklayın. Kullanıcıya bu mesaj iletilecektir.
            </p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Red sebebi..."
              className={`w-full border rounded-xl p-3 focus:outline-none focus:border-red-500/50 min-h-[100px] mb-4 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRejectModal(false)}
                className={`px-4 py-2 rounded-xl transition-all ${isDayMode ? 'text-slate-600 hover:bg-slate-100' : 'text-gray-400 hover:bg-white/5'}`}
              >
                İptal
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all"
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
