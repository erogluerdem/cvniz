import React, { useState } from 'react'
import { Upload, FileCheck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

export default function LinkedInImporter({ isDayMode, onImportData }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imported, setImported] = useState(false)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setTimeout(() => {
      // Mock extracted LinkedIn profile draft
      const mockData = {
        personalInfo: {
          fullName: 'LinkedIn Kullanıcısı',
          title: 'Yazılım Mühendisi / Software Developer',
          email: 'linkedin.user@example.com',
          summary: 'Geniş teknolojik birikime sahip, inovatif çözümlere odaklanan yazılım mühendisi.'
        },
        experience: [
          {
            company: 'Teknoloji A.Ş.',
            position: 'Kıdemli Yazılım Mühendisi',
            startDate: '2022-01',
            endDate: 'Halen',
            description: 'Ölçeklenebilir mikroservis mimarisi ve bulut sistemleri geliştirme.'
          }
        ],
        skills: ['React.js', 'Node.js', 'TypeScript', 'Docker', 'PostgreSQL']
      }

      setLoading(false)
      setImported(true)
      toast.success('LinkedIn profil verileri başarıyla aktarıldı!')
      if (onImportData) onImportData(mockData)
    }, 1500)
  }

  return (
    <div className={`p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/10'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>LinkedIn PDF İçe Aktarma</h3>
          <p className={`text-xs font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>LinkedIn profilinizden otomatik CV taslağı çıkarın.</p>
        </div>
      </div>

      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isDayMode ? 'border-slate-300 bg-slate-50 hover:bg-slate-100' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
            <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>LinkedIn PDF Ayrıştırılıyor...</p>
          </div>
        ) : imported ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Profil Verileri Aktarıldı</p>
            <span className="text-xs text-green-500 font-semibold">Deneyimler ve yetenekler CV formuna yüklendi.</span>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-blue-500" />
            <div className="space-y-1">
              <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-800' : 'text-gray-200'}`}>LinkedIn PDF Profili Yükle</p>
              <p className={`text-xs ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>LinkedIn → Profili PDF Olarak Kaydet dosyasını buraya sürükleyin veya tıklayın</p>
            </div>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
          </label>
        )}
      </div>
    </div>
  )
}
