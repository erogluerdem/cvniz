import { useState, useEffect } from 'react'
import {
    Brain, Zap, Settings, Save, TestTube, AlertTriangle, CheckCircle,
    RefreshCw, Sparkles, Cpu, Clock, DollarSign, Database, Shield,
    ChevronRight, Power, Info, Maximize, Sliders, Activity
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const providers = [
    { id: 'openai', name: 'OpenAI', icon: '🤖', models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'] },
    { id: 'anthropic', name: 'Anthropic', icon: '🧠', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-2.1'] },
    { id: 'google', name: 'Google', icon: '✨', models: ['gemini-pro', 'gemini-ultra'] },
    { id: 'azure', name: 'Azure AI', icon: '☁️', models: ['gpt-4-32k', 'gpt-35-turbo-16k'] }
]

export default function AISettingsPage() {
    const { toast } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [testing, setTesting] = useState(false)
    const [stats, setStats] = useState({ totalRequests: 0, totalCost: '0.00', avgResponseTime: '0.0', activeModel: 'gpt-4' })
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
            if (settingsRes.success) setSettings(prev => ({ ...prev, ...settingsRes.settings }))
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
                    <div className="w-24 h-24 rounded-full border-4 border-purple-500/10 border-t-purple-500 animate-spin"></div>
                    <Brain className="w-10 h-10 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">Yapay Zeka Yükleniyor</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter italic">Sistem parametreleri kontrol ediliyor...</p>
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
                        <Brain className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">AI Merkezi</h2>
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none">Motor Durumu: Aktif & Çevrimiçi</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={handleTest}
                        disabled={testing || saving}
                        className="px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {testing ? <RefreshCw className="w-4 h-4 animate-spin text-purple-400" /> : <Activity className="w-4 h-4 text-purple-400" />}
                        Sistemi Test Et
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || testing}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_10px_30px_-10px_rgba(168,85,247,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Konfigürasyonu Kaydet
                    </button>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'AKTİF MODEL', value: stats.activeModel, icon: <Cpu className="w-4 h-4" />, color: 'purple' },
                    { label: 'AYLIK İSTEK', value: stats.totalRequests.toLocaleString(), icon: <Sparkles className="w-4 h-4" />, color: 'cyan' },
                    { label: 'AYLIK MALİYET', value: `$${stats.totalCost}`, icon: <DollarSign className="w-4 h-4" />, color: 'emerald' },
                    { label: 'ORT. GECİKME', value: `${stats.avgResponseTime}sn`, icon: <Clock className="w-4 h-4" />, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-[2.5rem] p-7 border border-white/5 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10 group-hover:scale-150 transition-all duration-700`}></div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-black text-white italic tracking-tighter leading-none">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: API & Parameters */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl -z-10"></div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                <Settings className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none mb-1">API Konfigürasyonu</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        Sağlayıcı Seçimi <ChevronRight className="w-3 h-3" />
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {providers.map(p => (
                                            <button
                                                key={p.id}
                                                onClick={() => setSettings(prev => ({ ...prev, provider: p.id, model: p.models[0] }))}
                                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 text-center group ${settings.provider === p.id
                                                        ? 'bg-purple-500/10 border-purple-500/50 text-white'
                                                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                                                    }`}
                                            >
                                                <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{p.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Kullanılacak Model</label>
                                        <select
                                            value={settings.model}
                                            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                                            className="w-full px-5 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white font-bold text-xs appearance-none focus:border-purple-500/50 focus:outline-none transition-all cursor-pointer"
                                        >
                                            {providers.find(p => p.id === settings.provider)?.models.map(m => (
                                                <option key={m} value={m}>{m.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">API Erişim Anahtarı</label>
                                        <div className="relative group">
                                            <input
                                                type="password"
                                                value={settings.apiKey}
                                                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                                placeholder="sk-••••••••••••••••"
                                                className="w-full px-12 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white font-mono text-sm focus:border-purple-500/50 focus:outline-none transition-all"
                                            />
                                            <Shield className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-indigo-500/10">
                                        <Sliders className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest leading-none">İnce Ayar Parametreleri</h4>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temperature</label>
                                            <span className="text-xs font-black text-indigo-400">{settings.temperature}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="2"
                                            step="0.1"
                                            value={settings.temperature}
                                            onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500 border-none outline-none"
                                        />
                                        <div className="flex justify-between text-[8px] text-gray-600 font-bold uppercase tracking-widest">
                                            <span>Kesin / Mantıksal</span>
                                            <span>Yaratıcı / Geniş</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Tokens</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                value={settings.maxTokens}
                                                onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 1000 })}
                                                className="w-full px-5 py-3.5 bg-black/30 border border-white/5 rounded-2xl text-white font-black text-sm focus:border-indigo-500/50 focus:outline-none transition-all"
                                            />
                                            <Maximize className="w-4 h-4 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors" />
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
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                                <Zap className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none mb-1">Yetenek Matrisi</h3>
                        </div>

                        <div className="grid gap-3">
                            {[
                                { key: 'contentGeneration', label: 'Akıllı İçerik', desc: 'Sıfırdan CV bölümleri oluşturma', icon: '📝' },
                                { key: 'cvAnalysis', label: 'ATS Analizi', desc: 'Profesyonel puanlama ve kritik hata tespiti', icon: '📊' },
                                { key: 'skillSuggestions', label: 'Yetenek Madenciliği', desc: 'Pozisyona özel anahtar kelime önerileri', icon: '💎' },
                                { key: 'coverLetter', label: 'Turbo Ön Yazı', desc: 'Saniyeler içinde kişiselleştirilmiş ön yazılar', icon: '📩' },
                                { key: 'interviewCoach', label: 'Interaktif Koç', desc: 'Mülakatlara hazırlık için davranışsal koçluk', icon: '🗣️' },
                                { key: 'jobMatching', label: 'İş Eşleştirme', desc: 'Profilin ilanlarla uyumluluk analizi', icon: '🤝', beta: true }
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
                                                <h5 className={`font-black text-xs uppercase tracking-widest ${settings.features[feature.key] ? 'text-amber-400' : 'text-white'}`}>
                                                    {feature.label}
                                                </h5>
                                                {feature.beta && (
                                                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[8px] font-black uppercase tracking-widest">BETA</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium">{feature.desc}</p>
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
                    <div className="glass-card rounded-[3rem] p-8 border border-white/5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-2xl bg-white/10">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none mb-1">Mali Yönetim</h3>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Kullanım ve Bütçe Limiti</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 rounded-3xl bg-black/20 space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kullanım İlerlemesi</span>
                                    <span className="text-xs font-black text-white">${stats.totalCost} / ${settings.monthlyBudget}</span>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${(parseFloat(stats.totalCost) / settings.monthlyBudget) * 100 > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                            }`}
                                        style={{ width: `${Math.min((parseFloat(stats.totalCost) / settings.monthlyBudget) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                                        <AlertTriangle className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest block">Bütçe Aşıldığında Dondur</span>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Ekstrem maliyetlerden kaçın</span>
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
                    <h5 className="text-sm font-black text-amber-400 uppercase tracking-widest">Kritik Not: Enerji Tüketimi & Gecikme</h5>
                    <p className="text-xs text-amber-200/60 font-medium">Model seçimi, uygulama genelindeki tepki süresini doğrudan etkiler. GPT-3.5 günlük işlemler için %400 daha hızlıdır, GPT-4 ise karmaşık analizler için optimize edilmiştir.</p>
                </div>
            </div>
        </div>
    )
}
