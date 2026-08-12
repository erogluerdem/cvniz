import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  BarChart3, TrendingUp, Users, FileText, Download, Eye,
  Calendar, ArrowUp, ArrowDown, Filter, Info, PieChart,
  MousePointer2, Globe, Smartphone, Monitor, Tablet,
  RefreshCw, DownloadCloud, Share2, Target, Zap, Layout
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const timeRanges = [
  { id: '7d', label: '7 GÜN', sub: 'Haftalık Trend' },
  { id: '30d', label: '30 GÜN', sub: 'Aylık Analiz' },
  { id: '90d', label: '90 GÜN', sub: 'Çeyrek Raporu' },
  { id: '1y', label: '1 YIL', sub: 'Yıllık Bakış' }
]

const templateNames = {
  modern: 'Modern Sanat',
  minimalist: 'Sade & Şık',
  corporate: 'Kurumsal Vizyon',
  creative: 'Yaratıcı Zihin',
  tech: 'Dijital Gelecek',
  professional: 'Profesyonel Elit'
}

export default function AnalyticsPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [timeRange, setTimeRange] = useState('30d')
 const [data, setData] = useState(null)
 const [loading, setLoading] = useState(true)
 const [refreshing, setRefreshing] = useState(false)

 useEffect(() => {
 fetchData()
}, [timeRange])

 const fetchData = async () => {
 setRefreshing(true)
 try {
 const res = await adminAPI.getAnalytics({ range: timeRange})
 if (res.success) {
 setData(res.analytics)
}
} catch (error) {
 toast.error('Analitik veriler yüklenemedi')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <div className={`w-24 h-24 rounded-full border-4 border-t-cyan-500 animate-spin ${isDayMode ? 'border-cyan-100' : 'border-cyan-500/10'}`}></div>
          <BarChart3 className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center font-primary">
          <h3 className={`font-semibold uppercase tracking-wider text-xs mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Veri Madenciliği Devam Ediyor</h3>
          <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Zaman serileri analiz ediliyor...</p>
        </div>
      </div>
    )
  }

  const metrics = [
    { label: 'ZİYARETÇİ', value: data?.conversion?.visitors || 0, icon: Eye, color: 'cyan', change: '0%' },
    { label: 'YENİ KAYIT', value: data?.conversion?.signups || 0, icon: Users, color: 'purple', change: '0%' },
    { label: 'OLUŞTURULAN CV', value: data?.conversion?.cvs || 0, icon: FileText, color: 'blue', change: '0%' },
    { label: 'PRO ÖDEME', value: data?.conversion?.payments || 0, icon: Zap, color: 'amber', change: '0%' }
  ]

  return (
    <div className="space-y-8 font-primary">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
            <TrendingUp className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Veri Analitiği</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Performans Metrikleri & Dönüşüm Oranları</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex p-1.5 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
            {timeRanges.map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${timeRange === range.id
                    ? 'bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20'
                    : (isDayMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white')
                  }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button
            onClick={fetchData}
            className={`p-3.5 rounded-2xl border transition-all active:scale-95 ${isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div key={i} className={`rounded-2xl p-7 border relative group overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${metric.color}-500/10 blur-3xl group-hover:scale-150 transition-all duration-700`}></div>

            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-${metric.color}-500/10 border border-${metric.color}-500/20`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-500`} />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold tracking-wider">
                <ArrowUp className="w-3 h-3" />
                {metric.change}
              </div>
            </div>

            <div className="space-y-1">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{metric.label}</span>
              <div className={`text-3xl font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{metric.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Trend Chart */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className={`rounded-2xl p-8 border relative overflow-hidden flex-1 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-cyan-500/10">
                  <BarChart3 className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Büyüme Analizi</h3>
                  <p className={`text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Kayıt ve CV Oluşturma Trendi</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-cyan-500"></div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Kayıtlar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500/40"></div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>CV'ler</span>
                </div>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {(data?.metrics?.signups || []).slice(-15).map((m, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                  <div className="flex items-end gap-0.5 h-full">
                    <div
                      className="flex-1 rounded-t-lg bg-cyan-500/80 group-hover:bg-cyan-400 transition-all duration-500 relative"
                      style={{ height: `${(m.count / (Math.max(...data.metrics.signups.map(x => x.count), 10))) * 100}%` }}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap shadow-xl z-20">
                        G: {m._id.split('-').slice(1).join('/')}<br />K: {m.count}
                      </div>
                    </div>
                    <div
                      className="flex-1 rounded-t-lg bg-blue-500/30 group-hover:bg-blue-400/50 transition-all duration-500"
                      style={{ height: `${((data.metrics.cvs.find(c => c._id === m._id)?.cvCount || 0) / (Math.max(...data.metrics.cvs.map(x => x.cvCount), 10))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className={`rounded-2xl p-8 border relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 rounded-2xl bg-amber-500/10">
                <Target className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Dönüşüm Hunisi</h3>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Ziyaretçiden Satışa Yolculuk</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {[
                { label: 'ZİYARETÇİ', value: data?.conversion?.visitors || 0, color: 'cyan' },
                { label: 'KAYIT', value: data?.conversion?.signups || 0, color: 'purple', prev: data?.conversion?.visitors },
                { label: 'CV OLUŞTURMA', value: data?.conversion?.cvs || 0, color: 'blue', prev: data?.conversion?.signups },
                { label: 'SATIŞ', value: data?.conversion?.payments || 0, color: 'amber', prev: data?.conversion?.cvs }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group">
                  <div className={`w-full aspect-square rounded-[2rem] border flex flex-col items-center justify-center p-6 transition-all ${isDayMode ? 'bg-slate-50 border-slate-200' : `bg-${step.color}-500/5 border-${step.color}-500/10`}`}>
                    <span className={`text-2xl font-semibold mb-1 ${isDayMode ? 'text-slate-900' : `text-${step.color}-400`}`}>
                      {step.value.toLocaleString()}
                    </span>
                    <div className={`text-xs font-semibold uppercase tracking-wider text-center ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{step.label}</div>
                  </div>
                  {step.prev && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                      <MousePointer2 className="w-3 h-3 text-slate-500 dark:text-gray-400" />
                      <span className={`text-xs font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        %{((step.value / step.prev) * 100).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Templates & Devices */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Top Templates */}
          <div className={`rounded-2xl p-8 border h-full ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 rounded-2xl bg-purple-500/10">
                <Layout className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Popüler Şablonlar</h3>
            </div>

            <div className="space-y-8">
              {data?.topTemplates?.map((t, i) => (
                <div key={i} className="space-y-3 group">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isDayMode ? 'text-slate-700 group-hover:text-slate-900' : 'text-gray-300 group-hover:text-white'}`}>
                      {templateNames[t.name] || t.name.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-cyan-500">{t.usage}</span>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${(t.usage / (data.topTemplates[0]?.usage || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className={`w-full mt-12 py-4 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 active:scale-95 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10 hover:text-white'}`}>
              TAM RAPORU İNDİR
              <DownloadCloud className="w-4 h-4" />
            </button>
          </div>

          {/* Device Distribution */}
          <div className={`rounded-2xl p-8 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 rounded-2xl bg-blue-500/10">
                <PieChart className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Cihaz Dağılımı</h3>
            </div>

            <div className="space-y-6">
              {data?.devices?.map((device, i) => {
                const Icon = device.id === 'Desktop' ? Monitor : device.id === 'Mobile' ? Smartphone : Tablet
                const total = data.devices.reduce((acc, d) => acc + d.count, 0)
                const percentage = ((device.count / total) * 100).toFixed(1)

                return (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-[1.5rem] border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl border ${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/5'}`}>
                        <Icon className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{device.id}</div>
                        <div className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{device.count} Oturum</div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>%{percentage}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
