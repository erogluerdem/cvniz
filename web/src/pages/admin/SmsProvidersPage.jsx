import { useState, useEffect } from 'react'
import { Settings, CheckCircle2, XCircle, MessageSquare, ShieldCheck, Activity, Key, Hash, EyeOff, Eye, Save, X, Phone, Loader2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const SMS_PROVIDERS = [
    { id: 'netgsm', name: 'Netgsm', type: 'Toplu SMS & OTP', color: 'blue' },
    { id: 'mutlucell', name: 'Mutlucell', type: 'Toplu SMS', color: 'orange' },
    { id: 'iletimerkezi', name: 'İleti Merkezi', type: 'Toplu SMS', color: 'emerald' },
    { id: 'vatansms', name: 'Vatan SMS', type: 'Toplu SMS', color: 'red' },
    { id: 'verimor', name: 'Verimor', type: 'Toplu SMS & Ses', color: 'indigo' },
    { id: 'asist', name: 'Asist İletişim', type: 'Toplu SMS', color: 'cyan' },
    { id: 'organik', name: 'Organik Haberleşme', type: 'Toplu SMS', color: 'green' },
    { id: 'dakik', name: 'Dakik SMS', type: 'Toplu SMS', color: 'rose' },
    { id: 'mobildev', name: 'Mobildev', type: 'Toplu SMS & OTP', color: 'purple' },
    { id: 'turkcell', name: 'Turkcell Kurumsal', type: 'Operatör API', color: 'yellow' },
    { id: 'vodafone', name: 'Vodafone İş Ortağım', type: 'Operatör API', color: 'red' },
    { id: 'turktelekom', name: 'Türk Telekom', type: 'Operatör API', color: 'blue' },
]

export default function SmsProvidersPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    
    const [configs, setConfigs] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [formConfig, setFormConfig] = useState(null)

    useEffect(() => {
        fetchProviders()
    }, [])

    const fetchProviders = async () => {
        try {
            const res = await adminAPI.getSmsProviders()
            if (res.success) {
                const configMap = {}
                res.providers.forEach(p => {
                    configMap[p.id] = {
                        active: p.active,
                        originator: p.senderId || '',
                        username: p.credentials?.username || '',
                        password: p.credentials?.password || ''
                    }
                })
                setConfigs(configMap)
            }
        } catch (error) {
            toast.error("SMS sağlayıcıları getirilemedi")
        } finally {
            setLoading(false)
        }
    }

    const handleConfigure = (provider) => {
        const conf = configs[provider.id] || { active: false, originator: '', username: '', password: '' }
        setFormConfig({ ...conf })
        setSelectedProvider(provider)
        setShowPassword(false)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const updatePayload = [{
                id: selectedProvider.id,
                name: selectedProvider.name,
                provider: selectedProvider.id,
                active: formConfig.active,
                senderId: formConfig.originator,
                credentials: {
                    username: formConfig.username,
                    password: formConfig.password
                }
            }]
            const res = await adminAPI.updateSmsProviders(updatePayload)
            if (res.success) {
                const newMap = { ...configs }
                res.providers.forEach(p => {
                    newMap[p.id] = {
                        active: p.active,
                        originator: p.senderId || '',
                        username: p.credentials?.username || '',
                        password: p.credentials?.password || ''
                    }
                })
                setConfigs(newMap)
                toast.success("Ayarlar kaydedildi")
                setSelectedProvider(null)
            }
        } catch(e) { toast.error("Kaydedilirken hata oluştu") }
        finally { setSaving(false) }
    }

    return (
        <div className="space-y-8 font-primary">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-3xl font-bold tracking-tight mb-2 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                        SMS Sağlayıcıları (OTP & Toplu SMS)
                    </h2>
                    <p className={`text-base ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Kullanıcı doğrulama (OTP) ve pazarlama SMS'leri için Türkiye'deki firmaların API ayarlarını yönetin.
                    </p>
                </div>
                <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex flex-col">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Aktif Sağlayıcı</span>
                        <span className={`text-2xl font-bold ${isDayMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                            {Object.values(configs).filter(c => c.active).length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid of SMS Providers */}
            {loading ? <div className="text-center p-8 text-slate-500">Yükleniyor...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {SMS_PROVIDERS.map((provider) => {
                    const conf = configs[provider.id] || { active: false, originator: '' }
                    const isActive = conf.active

                    return (
                        <div key={provider.id} className={`group relative flex flex-col rounded-3xl border transition-all duration-300 hover:shadow-xl ${isDayMode ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-[#0F111A] border-white/5 hover:border-white/20'}`}>
                            
                            {/* Card Header */}
                            <div className="p-6 pb-4 flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner ${isDayMode ? `bg-${provider.color}-100 text-${provider.color}-600` : `bg-${provider.color}-500/10 text-${provider.color}-400`}`}>
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{provider.name}</h3>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDayMode ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-gray-400'}`}>
                                            {provider.type}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 items-end">
                                    {isActive ? (
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${isDayMode ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                            AKTİF
                                        </span>
                                    ) : (
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isDayMode ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-gray-500'}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                            PASİF
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div className={`px-6 py-3 border-y flex items-center gap-4 text-xs font-medium ${isDayMode ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-white/[0.02] border-white/5 text-gray-400'}`}>
                                {isActive && (
                                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                        <ShieldCheck className="w-3.5 h-3.5" /> API Bağlantısı Başarılı
                                    </span>
                                )}
                                {!isActive && (
                                    <span className="flex items-center gap-1.5">
                                        <XCircle className="w-3.5 h-3.5" /> Yapılandırılmadı
                                    </span>
                                )}
                            </div>

                            {/* Card Footer / Action */}
                            <div className="p-6 pt-4 mt-auto">
                                <button 
                                    onClick={() => handleConfigure(provider)}
                                    className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                                        isActive 
                                        ? (isDayMode ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-gray-200')
                                        : (isDayMode ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-white/10 text-white hover:bg-white/20')
                                    }`}
                                >
                                    <Settings className="w-4 h-4" /> 
                                    {isActive ? 'Ayarları Yönet' : 'Yapılandır & Aktif Et'}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
            )}

            {/* Configuration Modal */}
            {selectedProvider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden ${isDayMode ? 'bg-white' : 'bg-[#12151D] border border-white/10'}`}>
                        {/* Modal Header */}
                        <div className={`p-6 border-b flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${isDayMode ? `bg-${selectedProvider.color}-100 text-${selectedProvider.color}-600` : `bg-${selectedProvider.color}-500/20 text-${selectedProvider.color}-400`}`}>
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedProvider.name} API Ayarları</h2>
                                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>SMS gönderimi için kimlik bilgilerini yapılandırın.</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedProvider(null)} className={`p-2 rounded-xl transition-colors ${isDayMode ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-gray-400'}`}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            
                            {/* Toggle Switches */}
                            <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                                <div className="flex-1 flex items-center justify-between">
                                    <div>
                                        <div className={`font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Entegrasyon Durumu</div>
                                        <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Sistemde varsayılan olarak kullan</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={formConfig?.active || false}
                                            onChange={(e) => setFormConfig({...formConfig, active: e.target.checked})}
                                        />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            </div>

                            {/* API Credentials */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            <Phone className="w-4 h-4" /> Kullanıcı Adı (Abone No)
                                        </label>
                                        <input 
                                            type="text" 
                                            value={formConfig?.username || ''}
                                            onChange={(e) => setFormConfig({...formConfig, username: e.target.value})}
                                            className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${isDayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0B0D14] border-white/10 text-white'}`}
                                            placeholder="Örn: 8501234567"
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                            <Key className="w-4 h-4" /> Şifre / API Key
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                value={formConfig?.password || ''}
                                                onChange={(e) => setFormConfig({...formConfig, password: e.target.value})}
                                                className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${isDayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0B0D14] border-white/10 text-white'}`}
                                                placeholder="************************"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${isDayMode ? 'text-slate-400 hover:bg-slate-100' : 'text-gray-500 hover:bg-white/10'}`}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                        <Hash className="w-4 h-4" /> Başlık (Originator)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formConfig?.originator || ''}
                                        onChange={(e) => setFormConfig({...formConfig, originator: e.target.value})}
                                        className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all uppercase ${isDayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0B0D14] border-white/10 text-white'}`}
                                        placeholder="Örn: CVNIZ"
                                        maxLength={11}
                                    />
                                    <p className={`text-xs mt-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                        Alfasayısal gönderici başlığı (En fazla 11 karakter). Operatör tarafından onaylanmış başlıkları giriniz.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className={`p-6 border-t flex justify-end gap-3 ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <button onClick={() => setSelectedProvider(null)} disabled={saving} className={`px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 ${isDayMode ? 'text-slate-600 hover:bg-slate-200' : 'text-gray-300 hover:bg-white/10'}`}>
                                İptal
                            </button>
                            <button onClick={handleSave} disabled={saving} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50 ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} Ayarları Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
