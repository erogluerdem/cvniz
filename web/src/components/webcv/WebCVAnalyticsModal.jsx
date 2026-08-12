import React from 'react'
import { Eye, Clock, Globe, MousePointer2, TrendingUp, X } from 'lucide-react'

export default function WebCVAnalyticsModal({ isOpen, onClose, isDayMode, cvTitle = "Örnek Web CV" }) {
  if (!isOpen) return null

  const stats = [
    { label: 'Toplam Görüntülenme', value: '1,420', icon: Eye, color: 'cyan', growth: '+18%' },
    { label: 'Ortalama İnceleme Süresi', value: '2 dk 45 sn', icon: Clock, color: 'emerald', growth: '+12%' },
    { label: 'İletişim / Tıklama Oranı', value: '%14.2', icon: MousePointer2, color: 'purple', growth: '+5%' },
    { label: 'Ziyaret Edilen Ülkeler', value: '8 Ülke', icon: Globe, color: 'amber', growth: 'Global' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in font-primary">
      <div className={`rounded-2xl p-8 max-w-3xl w-full border relative overflow-hidden animate-scale-in shadow-2xl ${isDayMode ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{cvTitle} - Canlı Analitik</h3>
            <p className={`text-xs font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Web CV performansınızı ve ziyaretçi istatistiklerini takip edin.</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((st, i) => (
            <div key={i} className={`p-4 rounded-xl border relative overflow-hidden ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${st.color}-500/10 text-${st.color}-500`}>
                  <st.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">{st.growth}</span>
              </div>
              <div className={`text-2xl font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{st.value}</div>
              <div className={`text-[11px] font-semibold uppercase mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{st.label}</div>
            </div>
          ))}
        </div>

        <div className={`p-6 rounded-xl border text-center ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
          <TrendingUp className="w-8 h-8 text-cyan-500 mx-auto mb-2 opacity-60" />
          <h4 className={`text-sm font-bold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Gelişmiş Ziyaretçi Haritası & PDF İndirme Analitiği</h4>
          <p className={`text-xs mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Web CV'nizi görüntüleyen İK yöneticilerinin lokasyon ve cihaz verileri kaydedilmektedir.</p>
        </div>
      </div>
    </div>
  )
}
