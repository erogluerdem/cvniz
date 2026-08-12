import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Settings, Save, Shield, Globe, CreditCard, Mail, Sliders,
  Loader2, CheckCircle, Smartphone, Lock, Search, Zap,
  Activity, Database, Terminal, Server, RefreshCw, AlertTriangle,
  Eye, EyeOff, Bell, Share2, Facebook, Twitter, Instagram, Linkedin,
  Cpu, HardDrive, LayoutGrid, Clock
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const categories = [
  { id: 'general', label: 'Genel', icon: Globe, color: 'cyan' },
  { id: 'payment', label: 'Ödemeler', icon: CreditCard, color: 'emerald' },
  { id: 'smtp', label: 'E-Posta (SMTP)', icon: Mail, color: 'blue' },
  { id: 'seo', label: 'SEO & Sosyal', icon: Share2, color: 'purple' },
  { id: 'advanced', label: 'Gelişmiş', icon: Terminal, color: 'amber' }
]

export default function SettingsPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [activeCategory, setActiveCategory] = useState('general')
 const [settings, setSettings] = useState({})
 const [systemStatus, setSystemStatus] = useState(null)
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [showPasswords, setShowPasswords] = useState({})

 useEffect(() => {
 fetchData()
}, [])

 const fetchData = async () => {
 setLoading(true)
 try {
 const [settingsRes, statusRes] = await Promise.all([
 adminAPI.getSettings(),
 adminAPI.getSystemStatus()
 ])
 if (settingsRes.success) {
 const settingsMap = {}
 settingsRes.settings.forEach(s => settingsMap[s.key] = s.value)

 // Varsayılan değerlerle birleştir
 setSettings({
 site_name: 'CVniz',
 site_description: 'AI Destekli Modern CV Oluşturucu',
 premium_price: '199',
 maintenance_mode: false,
 contact_email: 'support@CVniz.com',
 currency: 'TRY',
 smtp_host: '',
 smtp_port: '587',
 smtp_user: '',
 smtp_pass: '',
 ga_id: '',
 fb_pixel: '',
 fb_link: '',
 tw_link: '',
 ins_link: '',
 li_link: '',
 max_cv_per_user: '3',
 // Payment Defaults
 iyzico_api_key: '',
 iyzico_secret_key: '',
 iyzico_base_url: 'https://api.iyzipay.com',
 stripe_public_key: '',
 stripe_secret_key: '',
 stripe_webhook_secret: '',
 bank_name: '',
 bank_iban: '',
 bank_holder: '',
 ...settingsMap
})
}
 if (statusRes.success) setSystemStatus(statusRes.status)
} catch (error) {
 toast.error('Veriler yüklenirken hata oluştu')
} finally {
 setLoading(false)
}
}

 const handleChange = (key, value) => {
 setSettings(prev => ({ ...prev, [key]: value}))
}

 const handleSaveBatch = async () => {
 setSaving(true)
 try {
 const res = await adminAPI.updateSettingsBatch(settings)
 if (res.success) {
 toast.success('Tüm ayarlar başarıyla kaydedildi!')
}
} catch (error) {
 toast.error('Ayarlar kaydedilemedi')
} finally {
 setSaving(false)
}
}

 const togglePasswordVisibility = (key) => {
 setShowPasswords(prev => ({ ...prev, [key]: !prev[key]}))
}

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-24 h-24 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
 <Settings className="w-10 h-10 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center font-primary">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">Sistem Parametreleri Yükleniyor</h3>
 <p className="text-gray-500 text-xs font-bold uppercase">Konfigürasyon haritası okunuyor...</p>
 </div>
    </div>
  )
}

  const renderSettingField = (key, label, description, type = 'text', options = null) => {
    const value = settings[key]

    return (
      <div className="space-y-3 group">
        <div className="flex flex-col">
          <label className={`text-xs font-semibold uppercase tracking-wider ml-1 mb-1 transition-colors ${isDayMode ? 'text-slate-500 group-hover:text-cyan-600' : 'text-gray-500 group-hover:text-cyan-400'}`}>
            {label}
          </label>
          <p className={`text-xs font-bold uppercase ml-1 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>{description}</p>
        </div>

        <div className="relative">
          {type === 'checkbox' ? (
            <div
              onClick={() => handleChange(key, !value)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${value
                  ? (isDayMode ? 'bg-cyan-50 border-cyan-200 shadow-sm' : 'bg-cyan-500/10 border-cyan-500/20')
                  : (isDayMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10')
                }`}
            >
              <span className={`text-xs font-bold uppercase ${value ? (isDayMode ? 'text-cyan-700' : 'text-white') : (isDayMode ? 'text-slate-500' : 'text-white')}`}>{value ? 'AKTİF' : 'PASİF'}</span>
              <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${value ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : (isDayMode ? 'bg-slate-300' : 'bg-gray-800')}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${value ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          ) : type === 'textarea' ? (
            <textarea
              value={value || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full px-5 py-4 border rounded-2xl font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all resize-none h-24 ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
            />
          ) : type === 'password' ? (
            <div className="relative">
              <input
                type={showPasswords[key] ? 'text' : 'password'}
                value={value || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className={`w-full px-5 py-4 border rounded-2xl font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
              />
              <button
                onClick={() => togglePasswordVisibility(key)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDayMode ? 'text-slate-400 hover:text-slate-900' : 'text-gray-500 hover:text-white'}`}
              >
                {showPasswords[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <input
              type={type}
              value={value || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className={`w-full px-5 py-4 border rounded-2xl font-bold text-xs focus:border-cyan-500/50 focus:outline-none transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-white/5 border-white/10 text-white'}`}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 font-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 shadow-xl shadow-cyan-500/10">
            <Settings className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Sistem Ayarları</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Motor Merkezi & Konfigürasyon</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveBatch}
          disabled={saving}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          DEĞİŞİKLİKLERİ UYGULA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className={`rounded-2xl p-4 border space-y-2 ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group overflow-hidden ${activeCategory === cat.id
                    ? (isDayMode ? `bg-${cat.color}-50 text-${cat.color}-600 border border-${cat.color}-200 shadow-sm` : `bg-${cat.color}-500/10 text-${cat.color}-400 border border-${cat.color}-500/20 shadow-lg`)
                    : (isDayMode ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-50' : 'text-gray-500 hover:text-white hover:bg-white/5')
                  }`}
              >
                <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? `text-${cat.color}-500` : (isDayMode ? 'text-slate-400 group-hover:text-slate-900' : 'text-gray-600 group-hover:text-white')}`} />
                <span className="text-xs font-semibold uppercase tracking-wider">{cat.label}</span>
                {activeCategory === cat.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-full shadow-[0_0_10px_#06b6d4]"></div>
                )}
              </button>
            ))}
          </div>

          {/* System Status Board */}
          <div className={`rounded-2xl p-6 border ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5'}`}>
            <h4 className={`text-xs font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
              <Activity className="w-3 h-3 text-cyan-500" /> Sistem Durumu
            </h4>

            <div className="space-y-4">
              {[
                { label: 'VERİTABANI', value: systemStatus?.dbStatus || '...', icon: Database, color: 'emerald' },
                { label: 'RUNTIME', value: systemStatus?.nodeVersion || '...', icon: Cpu, color: 'blue' },
                { label: 'UPTIME', value: systemStatus?.uptime || '...', icon: Clock, color: 'purple' },
                { label: 'PLATFORM', value: systemStatus?.platform || '...', icon: Server, color: 'orange' }
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-2xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg bg-${item.color}-500/10`}>
                      <item.icon className={`w-3 h-3 text-${item.color}-500`} />
                    </div>
                    <span className={`text-xs font-semibold uppercase ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>{item.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Editor */}
        <div className="lg:col-span-9">
          <div className={`rounded-2xl p-8 border relative overflow-hidden min-h-[600px] ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl -z-10"></div>

            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                {(() => {
                  const CategoryIcon = categories.find(c => c.id === activeCategory)?.icon;
                  return CategoryIcon ? <CategoryIcon className="w-6 h-6 text-cyan-500" /> : null;
                })()}
              </div>
              <div>
                <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>
                  {categories.find(c => c.id === activeCategory)?.label} Ayarları
                </h3>
                <p className={`text-xs font-bold uppercase tracking-wider ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>Global sistem değişkenlerini düzenleyin</p>
              </div>
            </div>

            {/* Category Layers */}
            <div className="animate-fade-in">
              {activeCategory === 'general' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {renderSettingField('site_name', 'SİTE BAŞLIĞI', 'Ana platform ismi ve marka adı')}
                    {renderSettingField('site_description', 'SİTE AÇIKLAMASI', 'META ve SEO açıklaması', 'textarea')}
                  </div>
                  <div className="space-y-8">
                    {renderSettingField('contact_email', 'DESTEK E-POSTA', 'Kullanıcı taleplerinin gideceği ana kanal')}
                    {renderSettingField('maintenance_mode', 'BAKIM MODU', 'Servisleri geçici olarak askıya al', 'checkbox')}
                  </div>
                </div>
              )}

              {activeCategory === 'payment' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {renderSettingField('premium_price', 'PREMIUM FİYAT', 'Aylık Pro paket aboneliği ücreti', 'number')}
                    {renderSettingField('currency', 'PARA BİRİMİ', 'Ödeme sistemi için temel döviz kodu')}

                    <div className={`pt-6 border-t ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Sanal POS (Iyzico)</span>
                      </div>
                      {renderSettingField('iyzico_api_key', 'IYZICO API KEY', 'Canlı veya Test API Anahtarı', 'password')}
                      {renderSettingField('iyzico_secret_key', 'IYZICO SECRET KEY', 'Güvenlik Anahtarı', 'password')}
                      {renderSettingField('iyzico_base_url', 'BASE URL', 'https://api.iyzipay.com')}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="pt-0">
                      <div className="flex items-center gap-2 mb-4">
                        <Globe className="w-4 h-4 text-emerald-500" />
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Stripe Entegrasyonu</span>
                      </div>
                      {renderSettingField('stripe_public_key', 'STRIPE PUBLIC KEY', 'Yayınlanabilir Anahtar')}
                      {renderSettingField('stripe_secret_key', 'STRIPE SECRET KEY', 'Gizli Anahtar', 'password')}
                      {renderSettingField('stripe_webhook_secret', 'WEBHOOK SECRET', 'Webhook İmzalama Anahtarı', 'password')}
                    </div>

                    <div className={`pt-6 border-t ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Database className="w-4 h-4 text-emerald-500" />
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Banka Havale Bilgileri</span>
                      </div>
                      {renderSettingField('bank_name', 'BANKA ADI', 'Örn: Ziraat Bankası')}
                      {renderSettingField('bank_iban', 'IBAN NO', 'TRXX ....')}
                      {renderSettingField('bank_holder', 'HESAP SAHİBİ', 'Ad Soyad / Firma Ünvanı')}
                    </div>
                  </div>
                  <div className="md:col-span-2 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-5">
                    <div className="p-3 rounded-2xl bg-emerald-500/20">
                      <AlertTriangle className="w-6 h-6 text-emerald-500" />
                    </div>
                    <p className={`text-xs font-semibold uppercase tracking-wider leading-relaxed ${isDayMode ? 'text-slate-600' : 'text-emerald-200/60'}`}>
                      Ödeme ayarlarındaki değişiklikler anında aktif olur. Lütfen POS sağlayıcınızla fiyatların eşleştiğinden emin olun. Hassas anahtarlar şifrelenerek saklanır.
                    </p>
                  </div>
                </div>
              )}

              {activeCategory === 'smtp' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {renderSettingField('smtp_host', 'SMTP HOST', 'E-posta sunucu adresi (Örn: smtp.gmail.com)')}
                    {renderSettingField('smtp_port', 'SMTP PORT', 'Genellikle 587 veya 465', 'number')}
                  </div>
                  <div className="space-y-8">
                    {renderSettingField('smtp_user', 'SMTP KULLANICI', 'E-posta adresi veya kullanıcı adı')}
                    {renderSettingField('smtp_pass', 'SMTP ŞİFRE', 'Hesap şifresi veya uygulama şifresi', 'password')}
                  </div>
                </div>
              )}

              {activeCategory === 'seo' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-4 h-4 text-purple-500" />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Sosyal Medya Linkleri</span>
                    </div>
                    {renderSettingField('fb_link', 'FACEBOOK', 'Kurumsal sayfa URL', 'text')}
                    {renderSettingField('tw_link', 'TWITTER / X', 'X profil URL', 'text')}
                    {renderSettingField('ins_link', 'INSTAGRAM', 'Insta profil URL', 'text')}
                    {renderSettingField('li_link', 'LINKEDIN', 'LinkedIn şirket URL', 'text')}
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-cyan-500" />
                      <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Analitik Takip</span>
                    </div>
                    {renderSettingField('ga_id', 'GOOGLE ANALYTICS ID', 'G-XXXXXXXX tracking kodu')}
                    {renderSettingField('fb_pixel', 'FACEBOOK PIXEL ID', 'Sosyal reklam takip kodu')}
                  </div>
                </div>
              )}

              {activeCategory === 'advanced' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {renderSettingField('max_cv_per_user', 'KULLANICI BAŞI CV LİMİTİ', 'Ücretsiz kullanıcılar için maksimum CV sayısı', 'number')}
                  </div>
                  <div className={`md:col-span-2 p-8 rounded-2xl border ${isDayMode ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/5 border-amber-500/10'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-xl bg-amber-500/20">
                        <Terminal className="w-5 h-5 text-amber-500" />
                      </div>
                      <h4 className={`text-xs font-semibold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Geliştirici Notu</h4>
                    </div>
                    <p className={`text-xs font-bold uppercase tracking-wider leading-relaxed ${isDayMode ? 'text-slate-600' : 'text-gray-500'}`}>
                      Buradaki ayarlar sistemin temel işleyişini etkileyebilir. Değişiklik yaparken dikkatli olun. Yanlış yapılandırma kullanıcı deneyimini bozabilir veya kaynak tüketimini artırabilir.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

