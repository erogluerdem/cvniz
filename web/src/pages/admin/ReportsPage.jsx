import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  FileBarChart, Download, Calendar, Filter, TrendingUp, Users,
  DollarSign, FileText, ChevronRight, PieChart, ArrowUpRight,
  RefreshCw, Search, List, Layout, Zap, Table, DownloadCloud,
  ExternalLink, MoreVertical, Briefcase
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const reportTypes = [
  { id: 'revenue', name: 'GELİR ANALİZİ', icon: DollarSign, color: 'emerald', sub: 'Finansal Performans' },
  { id: 'users', name: 'KULLANICI ANALİZİ', icon: Users, color: 'purple', sub: 'Büyüme & Etkileşim' },
  { id: 'cvs', name: 'CV ANALİZİ', icon: FileText, color: 'blue', sub: 'Trend Analizi' },
  { id: 'templates', name: 'ŞABLON ANALİZİ', icon: Layout, color: 'indigo', sub: 'Popüler Tasarımlar' },
  { id: 'all', name: 'GENEL ÖZET', icon: RefreshCw, color: 'cyan', sub: 'Tüm Sistem Raporu' }
]

export default function ReportsPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [selectedType, setSelectedType] = useState('all')
 const [dateRange, setDateRange] = useState({
 start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
 end: new Date().toISOString().split('T')[0]
})
 const [data, setData] = useState(null)
 const [loading, setLoading] = useState(true)
 const [generating, setGenerating] = useState(false)

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setGenerating(true)
 try {
 const res = await adminAPI.getReports(dateRange)
 if (res.success) {
 setData(res.reports)
}
} catch (error) {
 toast.error('Rapor verileri alınamadı')
} finally {
 setLoading(false)
 setGenerating(false)
}
}

 const handleExport = (format) => {
 if (!data) return
 const reportData = data[selectedType === 'all' ? 'revenue' : selectedType]
 const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json'})
 const url = URL.createObjectURL(blob)
 const a = document.createElement('a')
 a.href = url
 a.download =`CVniz_Report_${selectedType}_${dateRange.start}_${dateRange.end}.json`
 document.body.appendChild(a)
 a.click()
 document.body.removeChild(a)
 URL.revokeObjectURL(url)
 toast.success(`Rapor ${format} olarak hazırlandı`)
}

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
 <FileBarChart className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center font-primary">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">Raporlar Hazırlanıyor</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Veritabanı dökümleri analiz ediliyor...</p>
   return (
    <div className="space-y-8 font-primary">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-[2rem] bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 shadow-xl shadow-purple-500/10">
            <FileBarChart className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Raporlama Merkezi</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
              <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Detaylı Sistem Analizleri & Dışa Aktarma</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center gap-2 border p-2 rounded-2xl px-4 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
            <Calendar className="w-4 h-4 text-purple-500" />
            <input
              type="date"
              className={`bg-transparent text-xs font-semibold outline-none uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span className={`font-bold mx-1 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>/</span>
            <input
              type="date"
              className={`bg-transparent text-xs font-semibold outline-none uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <button
            onClick={fetchData}
            disabled={generating}
            className="px-6 py-3 rounded-2xl bg-purple-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-105 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            RAPORU GÜNCELLE
          </button>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'TOPLAM GELİR', value: '₺' + data?.summary?.totalRevenue.toLocaleString(), icon: DollarSign, color: 'emerald' },
          { label: 'YENİ ÜYELER', value: data?.summary?.newUsers, icon: Users, color: 'purple' },
          { label: 'OLUŞTURULAN CV', value: data?.summary?.totalCVs, icon: FileText, color: 'blue' },
          { label: 'BAŞARILI ÖDEMELER', value: data?.summary?.totalPayments, icon: Zap, color: 'amber' }
        ].map((stat, i) => (
          <div key={i} className={`rounded-2xl p-7 border relative group overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/10 blur-3xl group-hover:scale-150 transition-all duration-700`}></div>
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 text-${stat.color}-500 group-hover:scale-110 transition-transform`} />
              <ArrowUpRight className={`w-4 h-4 ${isDayMode ? 'text-slate-300' : 'text-gray-700'}`} />
            </div>
            <div className="space-y-1">
              <h4 className={`text-3xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value || 0}</h4>
              <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Side Selector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-[2rem] border transition-all text-left flex items-center gap-5 group relative overflow-hidden ${selectedType === type.id
                  ? (isDayMode ? `bg-purple-50 border-purple-200 shadow-sm` : `bg-gradient-to-br from-${type.color}-500/20 to-${type.color}-600/20 border-${type.color}-500/30`)
                  : (isDayMode ? 'bg-white border-slate-200 shadow-sm hover:bg-slate-50' : 'bg-white/5 border-white/5 hover:bg-white/10')
                }`}
            >
              {selectedType === type.id && (
                <div className={`absolute left-0 top-0 w-1 h-full bg-${type.color}-500`}></div>
              )}
              <div className={`p-4 rounded-2xl bg-${type.color}-500/10 border border-${type.color}-500/20 group-hover:scale-110 transition-transform`}>
                <type.icon className={`w-6 h-6 text-${type.color}-500`} />
              </div>
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{type.name}</h4>
                <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>{type.sub}</p>
              </div>
              <ChevronRight className={`ml-auto w-5 h-5 transition-all ${selectedType === type.id ? (isDayMode ? 'text-slate-900' : 'text-white') : (isDayMode ? 'text-slate-300 group-hover:text-slate-500' : 'text-gray-700 group-hover:text-gray-500')}`} />
            </button>
          ))}

          <div className={`p-8 rounded-2xl border mt-4 relative overflow-hidden ${isDayMode ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-sm' : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20'}`}>
            <DownloadCloud className={`w-24 h-24 absolute -bottom-6 -right-6 ${isDayMode ? 'text-indigo-500/10' : 'text-indigo-500/10'}`} />
            <div className="relative z-10 space-y-4">
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>DIŞA AKTARMA</h4>
              <p className={`text-xs font-bold uppercase leading-relaxed ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Seçili tarih aralığındaki tüm ham verileri Excel veya JSON formatında indirebilirsiniz.</p>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <button
                  onClick={() => handleExport('JSON')}
                  className={`py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                >
                  <Download className="w-3 h-3" />
                  VERİYİ DIŞA AKTAR (JSON)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Table / Display Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className={`rounded-2xl p-8 border flex-1 min-h-[600px] ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isDayMode ? 'bg-slate-100' : 'bg-white/10'}`}>
                  <Table className={`w-6 h-6 ${isDayMode ? 'text-slate-400' : 'text-white/50'}`} />
                </div>
                <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Veri Dökümü: {selectedType.toUpperCase()}</h3>
              </div>
              <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-500 uppercase tracking-wider">
                {data?.[selectedType === 'all' ? 'revenue' : selectedType]?.length || 0} Kayıt Bulundu
              </div>
            </div>

            <div className={`overflow-hidden rounded-2xl border ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
              <table className="w-full">
                <thead className={isDayMode ? 'bg-slate-50' : 'bg-white/5'}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>TARİH</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İŞLEM</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>MİKTAR / ADET</th>
                  </tr>
                </thead>
                <tbody className={isDayMode ? 'divide-y divide-slate-100' : 'divide-y divide-white/5'}>
                  {(data?.[selectedType === 'all' ? 'revenue' : selectedType] || []).map((row, i) => (
                    <tr key={i} className={`transition-all group ${isDayMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedType === 'templates' ? 'bg-indigo-500' : 'bg-purple-500'}`}></div>
                          <span className={`text-xs font-semibold truncate max-w-[150px] ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                            {selectedType === 'templates' ? row._id.toUpperCase() : row._id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 uppercase">
                        <span className={`text-xs font-bold tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                          {selectedType === 'revenue' ? 'PRO-ÜYELİK SATIŞI' :
                            selectedType === 'users' ? 'YENİ KULLANICI KAYDI' :
                              selectedType === 'cvs' ? 'CV OLUŞTURMA İŞLEMİ' :
                                selectedType === 'templates' ? 'ŞABLON KULLANIMI' : 'SİSTEM METRİĞİ'}
                        </span>
                      </td>
                      <td className={`px-6 py-5 text-right font-semibold text-xs ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        {selectedType === 'revenue' ? '₺' + row.amount.toLocaleString() : row.count ? row.count : row.cvCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(data?.[selectedType === 'all' ? 'revenue' : selectedType]?.length || 0) === 0 && (
                <div className="py-20 text-center">
                  <Search className={`w-12 h-12 mx-auto mb-4 ${isDayMode ? 'text-slate-300' : 'text-gray-800'}`} />
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>Bu tarih aralığında veri bulunamadı.</p>
                </div>
              )}
            </div>

            <div className={`mt-10 p-6 rounded-[2rem] border flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <Info className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <h5 className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Önemli Not</h5>
                  <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Bu raporlar otomatik olarak üretilir ve son 1 saat içindeki verileri kapsamaktadır.</p>
                </div>
              </div>
              <button className={`px-6 py-3 rounded-2xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-3 ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                <MoreVertical className="w-4 h-4" />
                DETAYLAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Info(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}
