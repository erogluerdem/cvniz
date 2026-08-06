import { useState } from 'react'
import { Settings, CheckCircle2, XCircle, CreditCard, ShieldCheck, Activity, Key, Globe, EyeOff, Eye, Save, X } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

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
    
    // Mock state for configured gateways
    const [configs, setConfigs] = useState({
        'iyzico': { active: true, mode: 'live' },
        'paytr': { active: true, mode: 'sandbox' },
        'garanti': { active: false, mode: 'live' }
    })

    const [selectedGateway, setSelectedGateway] = useState(null)
    const [showPassword, setShowPassword] = useState(false)

    const handleConfigure = (gateway) => {
        setSelectedGateway(gateway)
        setShowPassword(false)
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

            {/* Configuration Modal */}
            {selectedGateway && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden ${isDayMode ? 'bg-white' : 'bg-[#12151D] border border-white/10'}`}>
                        {/* Modal Header */}
                        <div className={`p-6 border-b flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${isDayMode ? `bg-${selectedGateway.color}-100 text-${selectedGateway.color}-600` : `bg-${selectedGateway.color}-500/20 text-${selectedGateway.color}-400`}`}>
                                    {selectedGateway.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className={`text-xl font-bold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{selectedGateway.name} Entegrasyonu</h2>
                                    <p className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>API ve güvenlik anahtarlarını yapılandırın.</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedGateway(null)} className={`p-2 rounded-xl transition-colors ${isDayMode ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-white/10 text-gray-400'}`}>
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
                                        <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Ödeme adımında göster/gizle</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={configs[selectedGateway.id]?.active} />
                                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                                <div className="w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
                                <div className="flex-1 flex items-center justify-between">
                                    <div>
                                        <div className={`font-semibold mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Çalışma Modu</div>
                                        <div className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Canlı veya Sandbox(Test)</div>
                                    </div>
                                    <select className={`text-sm font-semibold rounded-lg px-3 py-1.5 outline-none border cursor-pointer ${isDayMode ? 'bg-white border-slate-300 text-slate-700' : 'bg-[#0B0D14] border-white/20 text-white'}`} defaultValue={configs[selectedGateway.id]?.mode || 'live'}>
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
                                        className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all ${isDayMode ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#0B0D14] border-white/10 text-white'}`}
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

                                <div>
                                    <label className={`block text-sm font-semibold mb-2 flex items-center gap-2 ${isDayMode ? 'text-slate-700' : 'text-gray-300'}`}>
                                        <Globe className="w-4 h-4" /> Webhook / Callback URL
                                    </label>
                                    <div className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/5 text-gray-500'}`}>
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
                        </div>

                        {/* Modal Footer */}
                        <div className={`p-6 border-t flex justify-end gap-3 ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                            <button onClick={() => setSelectedGateway(null)} className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${isDayMode ? 'text-slate-600 hover:bg-slate-200' : 'text-gray-300 hover:bg-white/10'}`}>
                                İptal
                            </button>
                            <button onClick={() => setSelectedGateway(null)} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${isDayMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}>
                                <Save className="w-4 h-4" /> Değişiklikleri Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
