import React, { useState } from 'react'
import { FileText, Send, Copy, Check, Download, Sparkles, RefreshCw } from 'lucide-react'
import { aiAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function CoverLetterGenerator({ isDayMode, cvData }) {
  const { toast } = useToast()
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!jobTitle.trim()) {
      toast.error('Lütfen hedef iş unvanını girin.')
      return
    }
    setLoading(true)
    try {
      const res = await aiAPI.generateCoverLetter({
        jobTitle,
        company,
        tone,
        cvData,
        lang: 'tr'
      })
      if (res.success && (res.coverLetter || res.data?.letter || res.data)) {
        setGeneratedLetter(res.coverLetter || res.data?.letter || res.data)
        toast.success('Ön yazı başarıyla oluşturuldu!')
      } else {
        toast.error('Ön yazı üretilemedi.')
      }
    } catch (err) {
      toast.error('AI Servis Hatası: ' + (err.message || 'Bilinmeyen hata'))
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter)
    setCopied(true)
    toast.success('Kopyalandı!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/10'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className={`text-lg font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>AI Ön Yazı (Cover Letter) Oluşturucu</h3>
          <p className={`text-xs font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>İş başvurusuna özel etkileyici niyet mektubu yazın.</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>İş Unvanı / Pozisyon *</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Örn: Senior Frontend Developer"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:border-purple-500/50 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
              required
            />
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Şirket Adı</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Örn: Google Inc."
              className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:border-purple-500/50 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-600' : 'text-gray-400'}`}>Yazım Tonu</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold focus:outline-none focus:border-purple-500/50 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-white/10 text-white'}`}
          >
            <option value="professional">Kurumsal & Profesyonel</option>
            <option value="enthusiastic">Heyecanlı & Tutkulu</option>
            <option value="creative">Yaratıcı & Özgün</option>
            <option value="confident">Kendinden Emin & İddialı</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          ÖN YAZI OLUŞTUR
        </button>
      </form>

      {generatedLetter && (
        <div className={`p-5 rounded-xl border space-y-4 ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>Oluşturulan Ön Yazı</span>
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${copied ? 'bg-green-500/20 text-green-500' : (isDayMode ? 'bg-white text-slate-700 border border-slate-200' : 'bg-white/10 text-white')}`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Kopyalandı' : 'Kopyala'}
            </button>
          </div>
          <p className={`text-sm leading-relaxed whitespace-pre-line font-serif ${isDayMode ? 'text-slate-800' : 'text-gray-300'}`}>
            {generatedLetter}
          </p>
        </div>
      )}
    </div>
  )
}
