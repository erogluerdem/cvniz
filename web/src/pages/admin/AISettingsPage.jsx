import { useState, useEffect} from 'react'
import {
 Brain, Zap, Settings, Save, TestTube, AlertTriangle, CheckCircle,
 RefreshCw, Sparkles, Cpu, Clock, DollarSign, Database, Shield,
 ChevronRight, Power, Info, Maximize, Sliders, Activity
} from 'lucide-react'
import { adminAPI} from '../../services/api'
import { useToast} from '../../context/ToastContext'
import { useOutletContext} from 'react-router-dom'

const dailyCosts = [
 { day: 'Pzt', cost: 2.4},
 { day: 'Sal', cost: 1.8},
 { day: 'Çar', cost: 3.2},
 { day: 'Per', cost: 2.9},
 { day: 'Cum', cost: 4.1},
 { day: 'Cmt', cost: 1.2},
 { day: 'Paz', cost: 1.5}
]
const maxCost = Math.max(...dailyCosts.map(d => d.cost))

const providers = [
 { id: 'openai', name: 'OpenAI', icon: '🤖', models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo']},
 { id: 'anthropic', name: 'Anthropic', icon: '🧠', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-2.1']},
 { id: 'google', name: 'Google', icon: '✨', models: ['gemini-pro', 'gemini-ultra']},
 { id: 'azure', name: 'Azure AI', icon: '☁️', models: ['gpt-4-32k', 'gpt-35-turbo-16k']}
]

export default function AISettingsPage() {
 const { toast} = useToast()
 const { isDayMode} = useOutletContext() || { isDayMode: false}
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [testing, setTesting] = useState(false)
 const [stats, setStats] = useState({ totalRequests: 0, totalCost: '0.00', avgResponseTime: '0.0', activeModel: 'gpt-4'})
 const [settings, setSettings] = useState({
 provider: 'openai',
 model: 'gpt-4',
 apiKey: '',
 maxTokens: 2000,
 temperature: 0.7,
 topP: 1,
 frequencyPenalty: 0,
 presencePenalty: 0,
 enabled: true,
 features: {
 contentGeneration: true,
 cvAnalysis: true,
 skillSuggestions: true,
 coverLetter: true,
 interviewCoach: true,
 jobMatching: false,
 salaryPrediction: false
},
 monthlyBudget: 50,
 currentMonthCost: 0
})

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setLoading(true)
 try {
 const [settingsRes, statsRes] = await Promise.all([
 adminAPI.getAISettings(),
 adminAPI.getAISettingsStats()
 ])
 if (settingsRes.success) setSettings(prev => ({ ...prev, ...settingsRes.settings}))
 if (statsRes.success) setStats(statsRes.stats)
} catch (error) {
 toast.error('Veriler yüklenirken hata oluştu')
} finally {
 setLoading(false)
}
}

 const handleSave = async () => {
 setSaving(true)
 try {
 const response = await adminAPI.updateAISettings(settings)
 if (response.success) {
 toast.success('AI ayarları başarıyla güncellendi!')
}
} catch (error) {
 toast.error('Ayarlar kaydedilemedi')
} finally {
 setSaving(false)
}
}

 const handleTest = async () => {
 setTesting(true)
 try {
 const response = await adminAPI.testAIConnection(settings)
 if (response.success) {
 toast.success(response.message || 'API bağlantısı başarılı!')
}
} catch (error) {
 toast.error('Bağlantı testi başarısız oldu')
} finally {
 setTesting(false)
}
}

 const toggleFeature = (feature) => {
 setSettings(prev => ({
 ...prev,
 features: {
 ...prev.features,
 [feature]: !prev.features[feature]
}
}))
}

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className={`w-24 h-24 rounded-full border-4 border-t-purple-500 animate-spin ${isDayMode ? 'border-purple-100' : 'border-purple-500/10'}`}></div>
 <Brain className="w-10 h-10 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className={`font-semibold uppercase tracking-wider text-xs mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Yapay Zeka Yükleniyor</h3>
 <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Sistem parametreleri kontrol ediliyor...</p>
 </div>
 </div>
 )
}

 return (
 <div className="space-y-6">
 {/* Header Area */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <div className="flex items-center gap-4">
 <div className="p-4 rounded-[2rem] bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 shadow-xl shadow-purple-500/10">
 <Brain className="w-8 h-8 text-purple-500" />
 </div>
 <div>
 <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>AI Merkezi</h2>
 <div className="flex items-center gap-2">
 <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
 <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Motor Durumu: Aktif & Çevrimiçi</p>
 </div>
 </div>
 </div>

 <div className="flex flex-wrap items-center gap-4">
 <button
 onClick={handleTest}
 disabled={testing || saving}
 className={`px-6 py-3.5 rounded-2xl border font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 ${isDayMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
 >
 {testing ? <RefreshCw className="w-4 h-4 animate-spin text-purple-500" /> : <Activity className="w-4 h-4 text-purple-500" />}
 Sistemi Test Et
 </button>
 <button
 onClick={handleSave}
 disabled={saving || testing}
 className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold text-xs uppercase tracking-wider shadow-[0_10px_30px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
 >
 {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
 Konfigürasyonu Kaydet
 </button>
 </div>
 </div>

 {/* Metrics Dashboard */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'AKTİF MODEL', value: stats.activeModel, icon: <Cpu className="w-4 h-4" />, color: 'purple'},
 { label: 'AYLIK İSTEK', value: stats.totalRequests.toLocaleString(), icon: <Sparkles className="w-4 h-4" />, color: 'cyan'},
 { label: 'AYLIK MALİYET', value:`$${stats.totalCost}`, icon: <DollarSign className="w-4 h-4" />, color: 'emerald'},
 { label: 'ORT. GECİKME', value:`${stats.avgResponseTime}sn`, icon: <Clock className="w-4 h-4" />, color: 'amber'}
 ].map((stat, i) => (
 <div key={i} className={`rounded-2xl p-7 border relative overflow-hidden group ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10 group-hover:scale-150 transition-all duration-700`}></div>
 <div className="flex items-center gap-3 mb-3">
 <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-500`}>
 {stat.icon}
 </div>
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>{stat.label}</span>
 </div>
 <div className={`text-2xl font-semibold leading-none ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 {/* Left Column: API & Parameters */}
 <div className="lg:col-span-7 space-y-6">
 <div className={`rounded-2xl p-8 border relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl -z-10"></div>

 <div className="flex items-center gap-4 mb-8">
 <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
 <Settings className="w-5 h-5 text-cyan-500" />
 </div>
 <h3 className={`text-xl font-semibold uppercase leading-none mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>API Konfigürasyonu</h3>
 </div>

 <div className="space-y-6">
 <div className="grid md:grid-cols-2 gap-6">
 <div className="space-y-3">
 <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-2">
 Sağlayıcı Seçimi <ChevronRight className="w-3 h-3" />
 </label>
 <div className="grid grid-cols-2 gap-3">
 {providers.map(p => (
 <button
 key={p.id}
 onClick={() => setSettings(prev => ({ ...prev, provider: p.id, model: p.models[0]}))}
 className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 text-center group ${settings.provider === p.id
 ? 'bg-purple-500/10 border-purple-500/50 text-purple-600 dark:text-white'
 : (isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20')
}`}
 >
 <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
 <span className="text-xs font-semibold uppercase tracking-wider">{p.name}</span>
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-3">
 <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Kullanılacak Model</label>
 <select
 value={settings.model}
 onChange={(e) => setSettings({ ...settings, model: e.target.value})}
 className={`w-full px-5 py-4 border rounded-2xl font-bold text-xs appearance-none focus:border-purple-500/50 focus:outline-none transition-all cursor-pointer ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/50 border-white/10 text-white'}`}
 >
 {providers.find(p => p.id === settings.provider)?.models.map(m => (
 <option key={m} value={m}>{m.toUpperCase()}</option>
 ))}
 </select>
 </div>

 <div className="space-y-3">
 <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>API Erişim Anahtarı</label>
 <div className="relative group">
 <input
 type="password"
 value={settings.apiKey}
 onChange={(e) => setSettings({ ...settings, apiKey: e.target.value})}
 placeholder="sk-••••••••••••••••"
 className={`w-full px-12 py-4 border rounded-2xl font-mono text-sm focus:border-purple-500/50 focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900/50 border-white/10 text-white'}`}
 />
 <Shield className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
 </div>
 </div>
 </div>
 </div>

 <div className={`p-6 rounded-[2rem] border space-y-8 ${isDayMode ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-500/5 border-indigo-500/10'}`}>
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl ${isDayMode ? 'bg-indigo-100' : 'bg-indigo-500/10'}`}>
 <Sliders className={`w-4 h-4 ${isDayMode ? 'text-indigo-600' : 'text-indigo-400'}`} />
 </div>
 <h4 className={`text-xs font-semibold uppercase tracking-wider leading-none ${isDayMode ? 'text-indigo-900' : 'text-white'}`}>İnce Ayar Parametreleri</h4>
 </div>

 <div className="grid md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <div className="flex justify-between items-end">
 <label className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Temperature</label>
 <span className={`text-xs font-semibold ${isDayMode ? 'text-indigo-600' : 'text-indigo-400'}`}>{settings.temperature}</span>
 </div>
 <input
 type="range"
 min="0"
 max="2"
 step="0.1"
 value={settings.temperature}
 onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value)})}
 className={`w-full h-1.5 rounded-full appearance-none cursor-pointer accent-indigo-500 border-none outline-none ${isDayMode ? 'bg-indigo-200' : 'bg-white/10'}`}
 />
 <div className={`flex justify-between text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>
 <span>Kesin / Mantıksal</span>
 <span>Yaratıcı / Geniş</span>
 </div>
 </div>

 <div className="space-y-3">
 <label className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Max Tokens</label>
 <div className="relative group">
 <input
 type="number"
 value={settings.maxTokens}
 onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 1000})}
 className={`w-full px-5 py-3.5 border rounded-2xl font-semibold text-sm focus:border-indigo-500/50 focus:outline-none transition-all ${isDayMode ? 'bg-white border-indigo-200 text-slate-800' : 'bg-black/30 border-white/5 text-white'}`}
 />
 <Maximize className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Right Column: Features & Budget */}
 <div className="lg:col-span-5 space-y-6">
 {/* Feature Toggles */}
 <div className={`rounded-2xl p-8 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
 <div className="flex items-center gap-4 mb-8">
 <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
 <Zap className="w-5 h-5 text-amber-500" />
 </div>
 <h3 className={`text-xl font-semibold uppercase leading-none mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Yetenek Matrisi</h3>
 </div>

 <div className="grid gap-3">
 {[
 { key: 'contentGeneration', label: 'Akıllı İçerik', desc: 'Sıfırdan CV bölümleri oluşturma', icon: '📝'},
 { key: 'cvAnalysis', label: 'ATS Analizi', desc: 'Profesyonel puanlama ve kritik hata tespiti', icon: '📊'},
 { key: 'skillSuggestions', label: 'Yetenek Madenciliği', desc: 'Pozisyona özel anahtar kelime önerileri', icon: '💎'},
 { key: 'coverLetter', label: 'Turbo Ön Yazı', desc: 'Saniyeler içinde kişiselleştirilmiş ön yazılar', icon: '📩'},
 { key: 'interviewCoach', label: 'Interaktif Koç', desc: 'Mülakatlara hazırlık için davranışsal koçluk', icon: '🗣️'},
 { key: 'jobMatching', label: 'İş Eşleştirme', desc: 'Profilin ilanlarla uyumluluk analizi', icon: '🤝', beta: true}
 ].map(feature => (
 <div
 key={feature.key}
 onClick={() => toggleFeature(feature.key)}
 className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${settings.features[feature.key]
 ? 'bg-amber-500/10 border-amber-500/20'
 : 'bg-white/5 border-white/5 hover:border-white/10'
}`}
 >
 <div className="flex items-center gap-4">
 <div className="text-2xl">{feature.icon}</div>
 <div>
 <div className="flex items-center gap-2">
 <h5 className={`font-semibold text-xs uppercase tracking-wider ${settings.features[feature.key] ? 'text-amber-400' : 'text-white'}`}>
 {feature.label}
 </h5>
 {feature.beta && (
 <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">BETA</span>
 )}
 </div>
 <p className="text-xs text-gray-500 font-medium">{feature.desc}</p>
 </div>
 </div>
 <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.features[feature.key] ? 'bg-amber-500' : 'bg-gray-800'}`}>
 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${settings.features[feature.key] ? 'right-1' : 'left-1'}`}></div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Analytics / Budget Card */}
 <div className={`rounded-2xl p-8 border ${isDayMode ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' : 'glass-card border-white/5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10'}`}>
 <div className="flex items-center gap-4 mb-6">
 <div className={`p-3 rounded-2xl ${isDayMode ? 'bg-white shadow-sm' : 'bg-white/10'}`}>
 <DollarSign className={`w-5 h-5 ${isDayMode ? 'text-indigo-600' : 'text-white'}`} />
 </div>
 <div>
 <h3 className={`text-xl font-semibold uppercase leading-none mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Mali Yönetim</h3>
 <p className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Kullanım ve Bütçe Limiti</p>
 </div>
 </div>

 <div className="space-y-6">
 <div className={`p-5 rounded-3xl space-y-4 ${isDayMode ? 'bg-white border border-slate-200' : 'bg-black/20'}`}>
 <div className="flex justify-between items-end">
 <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Kullanım İlerlemesi</span>
 <span className={`text-xs font-semibold ${isDayMode ? 'text-slate-800' : 'text-white'}`}>${stats.totalCost} / ${settings.monthlyBudget}</span>
 </div>
 <div className={`w-full h-3 rounded-full overflow-hidden ${isDayMode ? 'bg-slate-100' : 'bg-white/5'}`}>
 <div
 className={`h-full transition-all duration-1000 ${(parseFloat(stats.totalCost) / settings.monthlyBudget) * 100 > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
}`}
 style={{ width:`${Math.min((parseFloat(stats.totalCost) / settings.monthlyBudget) * 100, 100)}%`}}
 ></div>
 </div>
 
 <div className="mt-8 pt-4 border-t border-dashed border-gray-500/20">
 <h4 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Haftalık Kullanım Giderleri</h4>
 <div className="flex items-end justify-between h-24 gap-2">
 {dailyCosts.map((d, i) => (
 <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
 <div className="w-full flex justify-center items-end h-full relative">
 <div 
 className="w-full max-w-[20px] rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-300 group-hover:from-purple-400 group-hover:to-pink-400"
 style={{ height:`${(d.cost / maxCost) * 100}%`}}
 >
 <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none ${isDayMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
 ${d.cost}
 </div>
 </div>
 </div>
 <span className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-600' : 'text-gray-500'}`}>{d.day}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className={`flex items-center justify-between p-4 rounded-2xl ${isDayMode ? 'bg-white border border-slate-200' : 'bg-white/5'}`}>
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-xl bg-red-500/20 text-red-500">
 <AlertTriangle className="w-4 h-4" />
 </div>
 <div>
 <span className={`text-xs font-semibold uppercase tracking-wider block ${isDayMode ? 'text-slate-800' : 'text-white'}`}>Bütçe Aşıldığında Dondur</span>
 <span className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Ekstrem maliyetlerden kaçın</span>
 </div>
 </div>
 <div className={`w-12 h-6 rounded-full relative transition-all duration-300 bg-red-500`}>
 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white right-1`}></div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Global API Note */}
 <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 flex flex-col md:flex-row md:items-center gap-4 animate-pulse">
 <div className="p-3 rounded-2xl bg-amber-500/20">
 <Info className="w-6 h-6 text-amber-500" />
 </div>
 <div>
 <h5 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Kritik Not: Enerji Tüketimi & Gecikme</h5>
 <p className="text-xs text-amber-200/60 font-medium">Model seçimi, uygulama genelindeki tepki süresini doğrudan etkiler. GPT-3.5 günlük işlemler için %400 daha hızlıdır, GPT-4 ise karmaşık analizler için optimize edilmiştir.</p>
 </div>
 </div>
 </div>
 )
}
