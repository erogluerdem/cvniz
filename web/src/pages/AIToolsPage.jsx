import React, { useState } from 'react'
import { Sparkles, Target, FileText, Upload, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import CoverLetterGenerator from '../components/ai/CoverLetterGenerator'
import LinkedInImporter from '../components/ai/LinkedInImporter'
import { aiAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import { useOutletContext } from 'react-router-dom'

export default function AIToolsPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [activeTab, setActiveTab] = useState('job-match') // job-match, cover-letter, linkedin
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [matchResult, setMatchResult] = useState(null)

  const sampleCVData = {
    title: 'Senior Software Engineer',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'TailwindCSS', 'REST API']
  }

  const handleMatchAnalyze = async (e) => {
    e.preventDefault()
    if (!jobDescription || jobDescription.trim().length < 20) {
      toast.error('Lütfen en az 20 karakterlik iş ilanı metni girin.')
      return
    }
    setAnalyzing(true)
    try {
      const res = await aiAPI.matchJob({
        jobDescription,
        cvData: sampleCVData
      })
      if (res.success && res.data) {
        setMatchResult(res.data)
        toast.success('ATS Uyum Analizi tamamlandı!')
      } else {
        toast.error('Eşleştirme analizi yapılamadı.')
      }
    } catch (err) {
      toast.error('Analiz hatası: ' + (err.message || 'Bilinmeyen hata'))
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8 font-primary max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-semibold uppercase flex items-center gap-3 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            Yapay Zeka (AI) Kariyer Stüdyosu
          </h2>
          <p className={`text-sm font-medium mt-1 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>İş ilanlarına ATS uyumu yakalayın, niyet mektupları ve LinkedIn profilleri oluşturun.</p>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className={`flex gap-2 p-1.5 rounded-2xl border max-w-2xl ${isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'}`}>
        <button
          onClick={() => setActiveTab('job-match')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'job-match' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : (isDayMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white')}`}
        >
          <Target className="w-4 h-4" /> ATS İLAN UYUMU
        </button>
        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'cover-letter' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : (isDayMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white')}`}
        >
          <FileText className="w-4 h-4" /> ÖN YAZI YAZICI
        </button>
        <button
          onClick={() => setActiveTab('linkedin')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${activeTab === 'linkedin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : (isDayMode ? 'text-slate-600 hover:text-slate-900' : 'text-gray-400 hover:text-white')}`}
        >
          <Upload className="w-4 h-4" /> LINKEDIN IMPORT
        </button>
      </div>

      {/* Tab 1: ATS Job Description Matcher */}
      {activeTab === 'job-match' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/10'}`}>
            <h3 className={`text-lg font-semibold uppercase mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>İş İlanı Metnini Yapıştırın</h3>
            <p className={`text-xs mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Hedeflediğiniz pozisyonun ilan metnini buraya yapıştırarak CV'nizin ATS uyumluluğunu ve eksik anahtar kelimeleri görün.</p>

            <form onSubmit={handleMatchAnalyze} className="space-y-4">
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="İş ilanı gereksinimleri, nitelikleri ve sorumlulukları metnini buraya yapıştırın..."
                className={`w-full p-4 rounded-xl border text-sm font-medium focus:outline-none focus:border-cyan-500/50 resize-none ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
                required
              />

              <button
                type="submit"
                disabled={analyzing}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Target className="w-4 h-4" />
                {analyzing ? 'ANALİZ EDİLİYOR...' : 'ATS UYUMUNU HESAPLA'}
              </button>
            </form>
          </div>

          {matchResult && (
            <div className={`p-6 rounded-2xl border space-y-6 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/10'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>ATS Uyum Skoru</h4>
                  <p className={`text-xs font-medium ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>İş ilanı kriterleri ile CV eşleşme oranı</p>
                </div>
                <div className={`text-4xl font-extrabold px-6 py-3 rounded-2xl ${matchResult.score >= 70 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                  %{matchResult.score}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-green-500 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Eşleşen Anahtar Kelimeler ({matchResult.matchedKeywords?.length || 0})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {(matchResult.matchedKeywords || []).map(kw => (
                      <span key={kw} className="px-3 py-1 rounded-lg text-xs font-semibold uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Eksik Kelimeler (Keyword Gap) ({matchResult.missingKeywords?.length || 0})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {(matchResult.missingKeywords || []).map(kw => (
                      <span key={kw} className="px-3 py-1 rounded-lg text-xs font-semibold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Cover Letter Generator */}
      {activeTab === 'cover-letter' && (
        <CoverLetterGenerator isDayMode={isDayMode} cvData={sampleCVData} />
      )}

      {/* Tab 3: LinkedIn PDF Importer */}
      {activeTab === 'linkedin' && (
        <LinkedInImporter isDayMode={isDayMode} />
      )}
    </div>
  )
}
