import { useState, useEffect } from 'react'
import { Settings, CheckCircle2, XCircle, CreditCard, ShieldCheck, Activity, Key, Globe, EyeOff, Eye, Save, X, Loader2 } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Modal from '../../components/admin/Modal'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const GATEWAYS = [
    { id: 'iyzico', name: 'Iyzico', type: 'Aggregator', color: 'blue' },
    { id: 'paytr', name: 'PayTR', type: 'Aggregator', color: 'emerald' },
    { id: 'moka', name: 'Moka', type: 'Aggregator', color: 'orange' },
    { id: 'param', name: 'Param', type: 'Aggregator', color: 'red' },
    { id: 'ipara', name: 'iPara', type: 'Aggregator', color: 'cyan' },
    { id: 'payten', name: 'Payten', type: 'Infrastructure', color: 'indigo' },
    { id: 'sipay', name: 'Sipay', type: 'Aggregator', color: 'purple' },
    { id: 'paynet', name: 'Paynet', type: 'Aggregator', color: 'sky' },
    { id: 'ozan', name: 'Ozan', type: 'Aggregator', color: 'rose' },
    { id: 'paratika', name: 'Paratika', type: 'Aggregator', color: 'fuchsia' },
    { id: 'lidio', name: 'Lidio', type: 'Aggregator', color: 'violet' },
    { id: 'shopier', name: 'Shopier', type: 'Marketplace', color: 'emerald' },
    { id: 'papara', name: 'Papara', type: 'Wallet / POS', color: 'zinc' },
    { id: 'garanti', name: 'Garanti BBVA', type: 'Bank POS', color: 'green' },
    { id: 'akbank', name: 'Akbank', type: 'Bank POS', color: 'red' },
    { id: 'isbank', name: 'İş Bankası', type: 'Bank POS', color: 'blue' },
    { id: 'yapikredi', name: 'Yapı Kredi', type: 'Bank POS', color: 'indigo' },
]

export default function PaymentGatewaysPage() {
    const { isDayMode } = useOutletContext() || { isDayMode: false }
    const { toast } = useToast()
    
    const [configs, setConfigs] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedGateway, setSelectedGateway] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    
    // Form state for editing
    const [formConfig, setFormConfig] = useState(null)

    useEffect(() => {
        fetchGateways()
    }, [])

    const fetchGateways = async () => {
        try {
            const res = await adminAPI.getPaymentGateways()
            if (res.success) {
                const configMap = {}
                res.gateways.forEach(g => {
                    configMap[g.id] = {
                        active: g.active,
                        mode: g.testMode ? 'sandbox' : 'live',
                        apiKey: g.credentials?.apiKey || '',
                        secretKey: g.credentials?.secretKey || ''
                    }
                })
                setConfigs(configMap)
            }
        } catch (error) {
            toast.error("Ödeme yöntemleri getirilemedi")
        } finally {
            setLoading(false)
        }
    }

    const handleConfigure = (gateway) => {
        const conf = configs[gateway.id] || { active: false, mode: 'live', apiKey: '', secretKey: '' }
        setFormConfig({ ...conf })
        setSelectedGateway(gateway)
        setShowPassword(false)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const updatePayload = [{
                id: selectedGateway.id,
                name: selectedGateway.name,
                provider: selectedGateway.id,
                active: formConfig.active,
                testMode: formConfig.mode === 'sandbox',
                credentials: {
                    apiKey: formConfig.apiKey,
                    secretKey: formConfig.secretKey
                }
            }]
            const res = await adminAPI.updatePaymentGateways(updatePayload)
            if (res.success) {
                const newMap = { ...configs }
                res.gateways.forEach(g => {
                    newMap[g.id] = {
                        active: g.active,
                        mode: g.testMode ? 'sandbox' : 'live',
                        apiKey: g.credentials?.apiKey || '',
                        secretKey: g.credentials?.secretKey || ''
                    }
                })
                setConfigs(newMap)
                toast.success("Ayarlar kaydedildi")
                setSelectedGateway(null)
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
                        Sanal POS & Ödeme Altyapıları
                    </h2>
                    <p className={`text-base ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        Türkiye'deki tüm ödeme sağlayıcılarını tek bir yerden yönetin, API anahtarlarını yapılandırın ve anında tahsilata başlayın.
                    </p>
                </div>
                <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex flex-col">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Aktif POS</span>
                        <span className={`text-2xl font-bold ${isDayMode ? 'text-emerald-600' : 'text-emerald-400'}`}>
                            {Object.values(configs).filter(c => c.active).length}
                        </span>
                    </div>
                    <div className="w-px h-10 bg-slate-200 dark:bg-white/10 mx-2"></div>
                    <div className="flex flex-col">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Test Modu (Sandbox)</span>
                        <span className={`text-2xl font-bold ${isDayMode ? 'text-amber-600' : 'text-amber-400'}`}>
                            {Object.values(configs).filter(c => c.active && c.mode === 'sandbox').length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid of POS Providers */}
            {loading ? <div className="text-center p-8 text-slate-500">Yükleniyor...</div> : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {GATEWAYS.map((gateway) => {
                    const conf = configs[gateway.id] || { active: false, mode: 'live' }
                    const isActive = conf.active
                    const isSandbox = conf.mode === 'sandbox'

                    return (
                        <div key={gateway.id} className={`group relative flex flex-col rounded-3xl border transition-all duration-300 hover:shadow-xl ${isDayMode ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-[#0F111A] border-white/5 hover:border-white/20'}`}>
                            
                            {/* Card Header */}
                            <div className="p-6 pb-4 flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner ${isDayMode ? `bg-${gateway.color}-100 text-${gateway.color}-600` : `bg-${gateway.color}-500/10 text-${gateway.color}-400`}`}>
                                        {gateway.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{gateway.name}</h3>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDayMode ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-gray-400'}`}>
                                            {gateway.type}
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
                                {isActive && isSandbox && (
                                    <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                                        <Activity className="w-3.5 h-3.5" /> Sandbox (Test)
                                    </span>
                                )}
                                {isActive && !isSandbox && (
                                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Canlı Ortam
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
                                    onClick={() => handleConfigure(gateway)}
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
            <Modal 
                isOpen={!!selectedGateway} 
                onClose={() => setSelectedGateway(null)}
                title={selectedGateway ? `${selectedGateway.name} Entegrasyonu` : ""}
                isDayMode={isDayMode}
                icon={selectedGateway ? (
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${isDayMode ? `bg-${selectedGateway.color}-100 text-${selectedGateway.color}-600` : `bg-${selectedGateway.color}-500/20 text-${selectedGateway.color}-400`}`}>
                        {selectedGateway.name.charAt(0)}
                    </div>
                ) : null}
            >
                {selectedGateway && (
                    <div className="space-y-6 mt-4">
                        <p className={`text-sm mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>API ve güvenlik anahtarlarını yapılandırın.</p>
                        {/* Toggle Switches */}
                        <div className={`flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex-1 flex items-center justify-between">
                                <div>
                                    <div className={`font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Entegrasyon Durumu</div>
                                    <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Ödeme adımında göster/gizle</div>
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
                            <div className={`w-px hidden sm:block ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`}></div>
                            <div className="flex-1 flex items-center justify-between">
                                <div>
                                    <div className={`font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Çalışma Modu</div>
                                    <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Canlı veya Sandbox(Test)</div>
                                </div>
                                <select 
                                    className={`text-sm font-semibold rounded-lg px-3 py-1.5 outline-none border cursor-pointer ${isDayMode ? 'bg-white border-slate-300 text-slate-700' : 'bg-white/5 border-white/10 text-white shadow-inner'}`} 
                                    value={formConfig?.mode || 'live'}
                                    onChange={(e) => setFormConfig({...formConfig, mode: e.target.value})}
                                >
                                    <option value="live">🟢 Canlı Ortam</option>
                                    <option value="sandbox">🟡 Sandbox (Test)</option>
                                </select>
                            </div>
                        </div>

                        {/* API Credentials */}
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                    <Key className="w-4 h-4" /> API Key (Client ID)
                                </label>
                                <input 
                                    type="text" 
                                    value={formConfig?.apiKey || ''}
                                    onChange={(e) => setFormConfig({...formConfig, apiKey: e.target.value})}
                                    className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-inner ${isDayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                                    placeholder={`Örn: ${selectedGateway.name.toLowerCase()}_api_key_...`}
                                />
                            </div>
                            
                            <div>
                                <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                    <ShieldCheck className="w-4 h-4" /> Secret Key (Güvenlik Anahtarı)
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        value={formConfig?.secretKey || ''}
                                        onChange={(e) => setFormConfig({...formConfig, secretKey: e.target.value})}
                                        className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-inner ${isDayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
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

                            <div>
                                <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                    <Globe className="w-4 h-4" /> Webhook / Callback URL
                                </label>
                                <div className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                    <span className="text-sm truncate">https://api.cvniz.com/webhooks/payments/{selectedGateway.id}</span>
                                    <button className={`text-xs font-semibold px-3 py-1 rounded-lg ${isDayMode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                        Kopyala
                                    </button>
                                </div>
                                <p className={`text-xs mt-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                    Bu adresi {selectedGateway.name} panelindeki bildirim (webhook/callback) url kısmına yapıştırın.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className={`pt-4 border-t flex justify-end gap-3 ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
                            <button onClick={() => setSelectedGateway(null)} disabled={saving} className={`px-6 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 ${isDayMode ? 'text-slate-600 hover:bg-slate-200 border border-slate-200' : 'text-gray-300 hover:bg-white/10 border border-white/10'}`}>
                                İptal
                            </button>
                            <button onClick={handleSave} disabled={saving} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all disabled:opacity-50 ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:scale-[1.02] active:scale-95 shadow-cyan-500/20'}`}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} Değişiklikleri Kaydet
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
