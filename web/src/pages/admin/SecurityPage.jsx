import { useState, useEffect} from 'react'
import {
 Shield, Key, Lock, AlertTriangle, CheckCircle, Clock, Smartphone, Globe, Ban,
 RefreshCw, Save, Unlock, X, Check, Eye, EyeOff, Timer, Zap, ShieldCheck, ShieldAlert
} from 'lucide-react'
import { adminAPI} from '../../services/api'
import { useToast} from '../../context/ToastContext'

export default function SecurityPage() {
 const { toast, confirm} = useToast()
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [stats, setStats] = useState({ successfulLogins: 0, failedLogins: 0, blockedIPCount: 0, status: 'secure'})
 const [loginLogs, setLoginLogs] = useState([])
 const [newBlockIP, setNewBlockIP] = useState('')
 const [newBlockReason, setNewBlockReason] = useState('')
 const [settings, setSettings] = useState({
 twoFactorEnabled: false,
 twoFactorMethod: 'email',
 loginAlerts: true,
 requireStrongPassword: true,
 passwordMinLength: 8,
 sessionTimeout: 30,
 maxLoginAttempts: 5,
 lockoutDuration: 15,
 preventConcurrentSessions: false,
 rateLimitEnabled: true,
 rateLimitRequests: 100,
 blockedIPs: []
})

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setLoading(true)
 try {
 const [settingsRes, statsRes, logsRes] = await Promise.all([
 adminAPI.getSecuritySettings(),
 adminAPI.getSecurityStats(),
 adminAPI.getLoginLogs()
 ])
 if (settingsRes.success) setSettings(prev => ({ ...prev, ...settingsRes.settings}))
 if (statsRes.success) setStats(statsRes.stats)
 if (logsRes.success) setLoginLogs(logsRes.logs || [])
} catch (error) {
 toast.error('Veriler yüklenirken hata: ' + error.message)
} finally {
 setLoading(false)
}
}

 const handleSaveSettings = async () => {
 setSaving(true)
 try {
 const response = await adminAPI.updateSecuritySettings(settings)
 if (response.success) {
 toast.success('Güvenlik ayarları kaydedildi!')
}
} catch (error) {
 toast.error('Ayarlar kaydedilemedi: ' + error.message)
} finally {
 setSaving(false)
}
}

 const handleBlockIP = async () => {
 if (!newBlockIP.trim()) {
 toast.error('IP adresi girin')
 return
}
 try {
 const response = await adminAPI.blockIP(newBlockIP, newBlockReason || 'Manuel engel')
 if (response.success) {
 setSettings(prev => ({ ...prev, blockedIPs: response.blockedIPs}))
 setNewBlockIP('')
 setNewBlockReason('')
 toast.success('IP adresi engellendi!')
 fetchData()
}
} catch (error) {
 toast.error(error.response?.data?.error || 'IP engellenemedi')
}
}

 const handleUnblockIP = async (ip) => {
 const confirmed = await confirm({
 title: 'IP Engelini Kaldır',
 message:`${ip} adresinin engelini kaldırmak istediğinize emin misiniz?`,
 confirmText: 'Evet, Kaldır',
 type: 'warning'
})
 if (!confirmed) return

 try {
 const response = await adminAPI.unblockIP(ip)
 if (response.success) {
 setSettings(prev => ({ ...prev, blockedIPs: response.blockedIPs}))
 toast.success('IP engeli kaldırıldı!')
 fetchData()
}
} catch (error) {
 toast.error('IP engeli kaldırılamadı')
}
}

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-20 h-20 rounded-full border-4 border-green-500/10 border-t-green-500 animate-spin"></div>
 <Shield className="w-8 h-8 text-green-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">GÜVENLİK YÜKLENİYOR</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Ayarlar kontrol ediliyor...</p>
 </div>
 </div>
 )
}

 return (
 <div className="space-y-6">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl font-semibold text-white mb-1 uppercase flex items-center gap-3">
 <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
 <Shield className="w-6 h-6 text-green-400" />
 </div>
 Güvenlik Merkezi
 </h2>
 <p className="text-gray-400 text-sm font-medium">Sistem güvenliğini yönetin ve izleyin.</p>
 </div>
 <div className="flex items-center gap-3">
 <button
 onClick={fetchData}
 className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
 >
 <RefreshCw className="w-5 h-5" />
 </button>
 <button
 onClick={handleSaveSettings}
 disabled={saving}
 className="px-6 py-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-green-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
 >
 <Save className="w-4 h-4" /> {saving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
 </button>
 </div>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {[
 { label: 'SİSTEM DURUMU', value: stats.status === 'secure' ? 'GÜVENLİ' : 'UYARI', icon: stats.status === 'secure' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />, color: stats.status === 'secure' ? 'green' : 'red'},
 { label: 'BAŞARILI GİRİŞ (7 GÜN)', value: stats.successfulLogins, icon: <CheckCircle className="w-4 h-4" />, color: 'cyan'},
 { label: 'BAŞARISIZ DENEME', value: stats.failedLogins, icon: <AlertTriangle className="w-4 h-4" />, color: 'red'},
 { label: 'ENGELLİ IP', value: stats.blockedIPCount, icon: <Ban className="w-4 h-4" />, color: 'amber'}
 ].map((stat, i) => (
 <div key={i} className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden">
 <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10`}></div>
 <div className="flex items-center gap-3 mb-2">
 <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
 {stat.icon}
 </div>
 <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
 </div>
 <div className={`text-3xl font-semibold text-${stat.color}-400`}>{stat.value}</div>
 </div>
 ))}
 </div>

 <div className="grid lg:grid-cols-2 gap-6">
 {/* Security Settings */}
 <div className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-3xl -z-10"></div>

 <h3 className="text-lg font-semibold text-white uppercase tracking-tight mb-6 flex items-center gap-2">
 <Lock className="w-5 h-5 text-green-400" /> Güvenlik Ayarları
 </h3>

 <div className="space-y-4">
 {/* Two Factor */}
 <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
 <div className="flex items-center gap-4">
 <div className="p-2 rounded-xl bg-purple-500/10">
 <Smartphone className="w-5 h-5 text-purple-400" />
 </div>
 <div>
 <div className="font-bold text-white text-sm">İki Faktörlü Doğrulama</div>
 <div className="text-xs text-gray-500">SMS veya Authenticator ile ekstra güvenlik</div>
 </div>
 </div>
 <div className={`w-12 h-6 rounded-full relative transition-all ${settings.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-700'}`}>
 <input
 type="checkbox"
 checked={settings.twoFactorEnabled}
 onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked})}
 className="opacity-0 absolute inset-0 cursor-pointer"
 />
 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.twoFactorEnabled ? 'right-1' : 'left-1'}`}></div>
 </div>
 </label>

 {/* Login Alerts */}
 <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
 <div className="flex items-center gap-4">
 <div className="p-2 rounded-xl bg-amber-500/10">
 <AlertTriangle className="w-5 h-5 text-amber-400" />
 </div>
 <div>
 <div className="font-bold text-white text-sm">Giriş Uyarıları</div>
 <div className="text-xs text-gray-500">Yeni cihazlardan giriş yapıldığında bildirim</div>
 </div>
 </div>
 <div className={`w-12 h-6 rounded-full relative transition-all ${settings.loginAlerts ? 'bg-green-500' : 'bg-gray-700'}`}>
 <input
 type="checkbox"
 checked={settings.loginAlerts}
 onChange={(e) => setSettings({ ...settings, loginAlerts: e.target.checked})}
 className="opacity-0 absolute inset-0 cursor-pointer"
 />
 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.loginAlerts ? 'right-1' : 'left-1'}`}></div>
 </div>
 </label>

 {/* Strong Password */}
 <label className="flex items-center justify-between p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
 <div className="flex items-center gap-4">
 <div className="p-2 rounded-xl bg-cyan-500/10">
 <Key className="w-5 h-5 text-cyan-400" />
 </div>
 <div>
 <div className="font-bold text-white text-sm">Güçlü Şifre Zorunluluğu</div>
 <div className="text-xs text-gray-500">Min {settings.passwordMinLength} karakter, büyük/küçük harf</div>
 </div>
 </div>
 <div className={`w-12 h-6 rounded-full relative transition-all ${settings.requireStrongPassword ? 'bg-green-500' : 'bg-gray-700'}`}>
 <input
 type="checkbox"
 checked={settings.requireStrongPassword}
 onChange={(e) => setSettings({ ...settings, requireStrongPassword: e.target.checked})}
 className="opacity-0 absolute inset-0 cursor-pointer"
 />
 <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.requireStrongPassword ? 'right-1' : 'left-1'}`}></div>
 </div>
 </label>

 {/* Session Timeout */}
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
 <div className="flex items-center gap-4">
 <div className="p-2 rounded-xl bg-blue-500/10">
 <Timer className="w-5 h-5 text-blue-400" />
 </div>
 <div>
 <div className="font-bold text-white text-sm">Oturum Zaman Aşımı</div>
 <div className="text-xs text-gray-500">Dakika cinsinden inaktivite süresi</div>
 </div>
 </div>
 <input
 type="number"
 value={settings.sessionTimeout}
 onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30})}
 className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-center text-white font-bold focus:outline-none focus:border-green-500/30"
 />
 </div>

 {/* Max Login Attempts */}
 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
 <div className="flex items-center gap-4">
 <div className="p-2 rounded-xl bg-red-500/10">
 <Ban className="w-5 h-5 text-red-400" />
 </div>
 <div>
 <div className="font-bold text-white text-sm">Max Giriş Denemesi</div>
 <div className="text-xs text-gray-500">Sonra IP geçici olarak engellenir</div>
 </div>
 </div>
 <input
 type="number"
 value={settings.maxLoginAttempts}
 onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5})}
 className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-center text-white font-bold focus:outline-none focus:border-green-500/30"
 />
 </div>
 </div>
 </div>

 {/* Blocked IPs */}
 <div className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl -z-10"></div>

 <h3 className="text-lg font-semibold text-white uppercase tracking-tight mb-6 flex items-center gap-2">
 <Ban className="w-5 h-5 text-red-400" /> Engelli IP Adresleri
 </h3>

 {/* Add IP */}
 <div className="flex gap-3 mb-6">
 <input
 type="text"
 value={newBlockIP}
 onChange={(e) => setNewBlockIP(e.target.value)}
 placeholder="IP adresi (örn: 192.168.1.1)"
 className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-red-500/30"
 />
 <button
 onClick={handleBlockIP}
 className="px-5 py-3 rounded-2xl bg-red-500/20 text-red-400 font-semibold text-xs uppercase tracking-wider hover:bg-red-500/30 transition-all flex items-center gap-2"
 >
 <Ban className="w-4 h-4" /> ENGELLE
 </button>
 </div>

 {/* IP List */}
 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
 {(settings.blockedIPs || []).length > 0 ? (
 settings.blockedIPs.map((item, i) => (
 <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl group hover:bg-red-500/5 transition-all">
 <div>
 <div className="font-mono text-sm text-white font-bold">{item.ip}</div>
 <div className="text-xs text-gray-500">{item.reason}</div>
 <div className="text-xs text-gray-600 mt-1">
 {item.blockedAt ? new Date(item.blockedAt).toLocaleDateString('tr-TR') : ''}
 </div>
 </div>
 <button
 onClick={() => handleUnblockIP(item.ip)}
 className="px-3 py-2 rounded-xl bg-white/5 text-gray-500 hover:text-green-400 hover:bg-green-500/10 transition-all text-xs font-bold flex items-center gap-1"
 >
 <Unlock className="w-3.5 h-3.5" /> Kaldır
 </button>
 </div>
 ))
 ) : (
 <div className="text-center py-12 text-gray-500">
 <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
 <p className="text-xs font-bold uppercase tracking-wider">Engelli IP yok</p>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Login History */}
 <div className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-3xl -z-10"></div>

 <h3 className="text-lg font-semibold text-white uppercase tracking-tight mb-6 flex items-center gap-2">
 <Globe className="w-5 h-5 text-purple-400" /> Giriş Geçmişi
 </h3>

 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="border-b border-white/10">
 <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP ADRESİ</th>
 <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">KULLANICI</th>
 <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">KONUM</th>
 <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">CİHAZ</th>
 <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ZAMAN</th>
 <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">DURUM</th>
 </tr>
 </thead>
 <tbody>
 {loginLogs.slice(0, 20).map((log, i) => (
 <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all">
 <td className="py-4 px-4 font-mono text-xs text-white font-bold">{log.ip}</td>
 <td className="py-4 px-4 text-sm">
 <span className="text-gray-400">{log.user?.name || log.email || '-'}</span>
 </td>
 <td className="py-4 px-4 text-sm text-gray-400">{log.locationString || '-'}</td>
 <td className="py-4 px-4 text-xs text-gray-500">{log.deviceString || log.userAgent?.substring(0, 30) || '-'}</td>
 <td className="py-4 px-4 text-xs text-gray-500">
 {new Date(log.createdAt).toLocaleString('tr-TR')}
 </td>
 <td className="py-4 px-4">
 {log.success ? (
 <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
 <CheckCircle className="w-3.5 h-3.5" /> Başarılı
 </span>
 ) : (
 <span className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
 <AlertTriangle className="w-3.5 h-3.5" /> Başarısız
 </span>
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>

 {loginLogs.length === 0 && (
 <div className="text-center py-16">
 <Globe className="w-12 h-12 text-gray-600 mx-auto mb-4" />
 <h4 className="text-lg font-semibold text-white uppercase mb-1">GİRİŞ KAYDI YOK</h4>
 <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Henüz giriş kaydı bulunmuyor.</p>
 </div>
 )}
 </div>
 </div>
 </div>
 )
}
