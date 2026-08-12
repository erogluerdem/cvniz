import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FileText, Eye, Save, Image, Edit, Type, Link, PlusCircle, Layout, Zap, DollarSign, Share2, Globe, Check, Loader2, ChevronRight, Trash2, Plus, Info, Sparkles, Shield, Download, Star, Quote, HelpCircle, MessageSquare, Activity } from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

export default function SiteContentPage() {
  const { toast } = useToast()
  const { isDayMode } = useOutletContext() || { isDayMode: false }
  const [activeSection, setActiveSection] = useState('hero')
 const [loading, setLoading] = useState(true)
 const [saving, setSaving] = useState(false)
 const [content, setContent] = useState({
 hero: {
 title: 'Profesyonel CV\'nizi',
 titleHighlight: 'Dakikalar İçinde',
 titleEnd: 'Oluşturun',
 subtitle: 'Yapay zeka destekli CV oluşturucu ile kariyer hedeflerinize ulaşın.',
 ctaPrimary: 'Ücretsiz Başla',
 ctaSecondary: 'Şablonları İncele',
 badge: '🚀 100.000+ kullanıcı güveniyor'
},
 stats: [
 { value: 100000, suffix: '+', label: 'Mutlu Kullanıcı'},
 { value: 107, suffix: '+', label: 'Profesyonel Şablon'}
 ],
 steps: [
 { id: 1, title: 'Şablon Seç', description: 'Şablon seç', icon: 'FileText'}
 ],
 features: [
 { id: 1, title: 'AI Destekli', description: 'İçerik oluştur', icon: 'Sparkles'}
 ],
 testimonials: [
 { id: 1, name: 'Ahmet Yılmaz', role: 'Yazılım Mühendisi', text: 'Harika bir platform!', rating: 5}
 ],
 faqs: [
 { id: 1, question: 'Soru?', answer: 'Cevap.'}
 ],
 pricing: {
 free: { price: 0, features: ['1 CV', '3 İndirme']},
 pro: { price: 29, features: ['Sınırsız CV', 'AI Asistan']}
},
 footer: {
 copyright: '© 2024 CVniz. Tüm hakları saklıdır.',
 description: 'Profesyonel CV oluşturmanın en kolay yolu.'
}
})

 useEffect(() => {
 fetchSettings()
}, [])

 const fetchSettings = async () => {
 setLoading(true)
 try {
 const response = await adminAPI.getSettings()
 if (response.success) {
 const landingContent = response.settings.find(s => s.key === 'landing_page_content')
 if (landingContent) {
 setContent(prev => ({ ...prev, ...landingContent.value}))
}
}
} catch (error) {
 console.error('Settings fetch error:', error)
} finally {
 setLoading(false)
}
}

 const handleSave = async () => {
 setSaving(true)
 try {
 const response = await adminAPI.updateSetting(
 'landing_page_content',
 content
 )
 if (response.success) {
 toast.success('İçerik başarıyla güncellendi!')
}
} catch (error) {
 toast.error('Kaydetme hatası: ' + error.message)
} finally {
 setSaving(false)
}
}

 const sections = [
 { id: 'hero', label: 'Ana Bölüm (Hero)', icon: <Image className="w-5 h-5" />, desc: 'Manşet metinleri ve rozetler'},
 { id: 'stats', label: 'İstatistikler', icon: <Activity className="w-5 h-5" />, desc: 'Sayaçlar ve başarı rakamları'},
 { id: 'steps', label: 'Nasıl Çalışır?', icon: <PlusCircle className="w-5 h-5" />, desc: 'İşleyiş adımları'},
 { id: 'features', label: 'Özellikler', icon: <Zap className="w-5 h-5" />, desc: 'Platform avantajları'},
 { id: 'testimonials', label: 'Yorumlar', icon: <MessageSquare className="w-5 h-5" />, desc: 'Kullanıcı geri bildirimleri'},
 { id: 'faqs', label: 'SSS', icon: <HelpCircle className="w-5 h-5" />, desc: 'Sık sorulan sorular'},
 { id: 'pricing', label: 'Fiyatlandırma', icon: <DollarSign className="w-5 h-5" />, desc: 'Paketler ve ücretler'},
 { id: 'footer', label: 'Alt Bilgi (Footer)', icon: <Globe className="w-5 h-5" />, desc: 'İletişim ve telif hakları'}
 ]

 const updateNestedContent = (section, field, value) => {
 setContent(prev => ({
 ...prev,
 [section]: {
 ...prev[section],
 [field]: value
}
}))
}

 const addItem = (section, template = { id: Date.now(), title: 'Yeni Öğe', description: 'Açıklama...', icon: 'Star'}) => {
 setContent(prev => ({
 ...prev,
 [section]: [...(prev[section] || []), template]
}))
}

 const removeItem = (section, id) => {
 setContent(prev => ({
 ...prev,
 [section]: prev[section].filter(item => item.id !== id)
}))
}

 const updateListItem = (section, index, field, value) => {
 const newList = [...content[section]]
 newList[index][field] = value
 setContent(prev => ({ ...prev, [section]: newList}))
}

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center py-32 gap-6">
 <div className="relative">
 <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
 <Layout className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
 </div>
 <div className="text-center">
 <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-1">CMS Yükleniyor</h3>
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
          <FileText className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className={`font-semibold uppercase tracking-wider text-xs mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>CMS YÜKLENİYOR</h3>
          <p className={`text-xs font-bold uppercase ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>İçerik veritabanı senkronize ediliyor...</p>
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
            <Layout className="w-8 h-8 text-cyan-500" />
          </div>
          <div>
            <h2 className={`text-3xl font-semibold uppercase mb-1 ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Site İçerik Yönetimi</h2>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <p className={`text-xs font-bold uppercase tracking-wider leading-none ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>Landing Page & Dinamik Metinler</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          YAYINLA & KAYDET
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
          <div className={`text-xs font-semibold uppercase tracking-wider px-4 mb-4 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Sayfa Bölümleri</div>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full p-4 rounded-3xl text-left transition-all border group relative overflow-hidden ${activeSection === section.id
                  ? (isDayMode ? 'bg-cyan-50 border-cyan-200 text-slate-900 shadow-sm' : 'bg-cyan-500/10 border-cyan-500/30 text-white shadow-lg shadow-cyan-500/5')
                  : (isDayMode ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10')
                }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-2.5 rounded-2xl transition-all ${activeSection === section.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : (isDayMode ? 'bg-slate-100 text-slate-500 group-hover:text-slate-900' : 'bg-white/5 text-gray-500 group-hover:text-gray-300')}`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold uppercase tracking-tight ${activeSection === section.id ? (isDayMode ? 'text-slate-900' : 'text-white') : (isDayMode ? 'text-slate-700' : 'text-gray-300')}`}>{section.label}</div>
                  <div className={`text-xs font-bold uppercase opacity-80 ${isDayMode ? 'text-slate-400' : 'text-gray-500'}`}>{section.desc}</div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${activeSection === section.id ? 'rotate-90 text-cyan-500' : 'opacity-20 group-hover:translate-x-1'}`} />
              </div>
              {activeSection === section.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>
              )}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className={`rounded-2xl border p-8 relative overflow-hidden ${isDayMode ? 'bg-white border-slate-200 shadow-sm' : 'glass-card border-white/5'}`}>
            {/* Hero Section Editor */}
            {activeSection === 'hero' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center gap-4 border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                    <Image className="w-5 h-5 text-cyan-500" />
                  </div>
                  <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Ana Bölüm Düzenle</h3>
                </div>

                <div className="grid gap-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Başlık (Giriş)</label>
                      <input
                        type="text"
                        value={content.hero.title}
                        onChange={(e) => updateNestedContent('hero', 'title', e.target.value)}
                        className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-bold ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-cyan-500 uppercase tracking-wider px-1">Vurgulu Başlık</label>
                      <input
                        type="text"
                        value={content.hero.titleHighlight}
                        onChange={(e) => updateNestedContent('hero', 'titleHighlight', e.target.value)}
                        className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-2xl px-6 py-4 text-cyan-500 focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Başlık (Son)</label>
                      <input
                        type="text"
                        value={content.hero.titleEnd}
                        onChange={(e) => updateNestedContent('hero', 'titleEnd', e.target.value)}
                        className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-bold ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Alt Başlık (Açıklama)</label>
                    <textarea
                      value={content.hero.subtitle}
                      onChange={(e) => updateNestedContent('hero', 'subtitle', e.target.value)}
                      rows={2}
                      className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-medium resize-none shadow-inner ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'}`}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Ana Buton (ctaPrimary)</label>
                      <input
                        type="text"
                        value={content.hero.ctaPrimary}
                        onChange={(e) => updateNestedContent('hero', 'ctaPrimary', e.target.value)}
                        className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-bold ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>İkincil Buton (ctaSecondary)</label>
                      <input
                        type="text"
                        value={content.hero.ctaSecondary}
                        onChange={(e) => updateNestedContent('hero', 'ctaSecondary', e.target.value)}
                        className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-bold ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-purple-500 uppercase tracking-wider px-1">Üst Rozet (Badge)</label>
                    <input
                      type="text"
                      value={content.hero.badge}
                      onChange={(e) => updateNestedContent('hero', 'badge', e.target.value)}
                      className="w-full bg-purple-500/5 border border-purple-500/20 rounded-2xl px-6 py-4 text-purple-500 focus:outline-none focus:border-purple-500 transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stats Section Editor */}
            {activeSection === 'stats' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center justify-between border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Activity className="w-5 h-5 text-cyan-500" />
                    </div>
                    <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>İstatistikleri Yönet</h3>
                  </div>
                  <button
                    onClick={() => addItem('stats', { id: Date.now(), value: 0, suffix: '+', label: 'Yeni Sayaç' })}
                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Yeni Sayaç
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {(content.stats || []).map((stat, i) => (
                    <div key={stat.id || i} className={`p-6 rounded-[2rem] border transition-all group relative ${isDayMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Değer</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => updateListItem('stats', i, 'value', parseInt(e.target.value))}
                            className={`w-full border rounded-xl px-4 py-2 font-bold text-center focus:outline-none focus:border-cyan-500/30 transition-all ${isDayMode ? 'bg-white border-slate-200 text-slate-900' : 'bg-white/5 border-white/5 text-white'}`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Ek (+, %)</label>
                          <input
                            type="text"
                            value={stat.suffix}
                            onChange={(e) => updateListItem('stats', i, 'suffix', e.target.value)}
                            className={`w-full border rounded-xl px-4 py-2 text-cyan-500 font-bold text-center focus:outline-none focus:border-cyan-500/30 transition-all ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}
                          />
                        </div>
                        <div className="flex items-end justify-center pb-2">
                          <button onClick={() => removeItem('stats', stat.id)} className="text-red-500/50 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        <label className={`text-xs font-semibold uppercase tracking-wider ml-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Etiket</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateListItem('stats', i, 'label', e.target.value)}
                          className={`w-full border rounded-xl px-4 py-2 font-medium focus:outline-none focus:border-cyan-500/30 transition-all ${isDayMode ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/5 text-gray-300'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps Section Editor */}
            {activeSection === 'steps' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center justify-between border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <PlusCircle className="w-5 h-5 text-cyan-500" />
                    </div>
                    <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>İşleyiş Adımlarını Yönet</h3>
                  </div>
                  <button
                    onClick={() => addItem('steps')}
                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Yeni Adım
                  </button>
                </div>

                <div className="grid gap-4">
                  {(content.steps || []).map((step, i) => (
                    <div key={step.id || i} className={`p-6 rounded-[2rem] border transition-all group relative ${isDayMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                      <div className="grid md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-1 flex flex-col items-center justify-center gap-2">
                          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${isDayMode ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                            <Layout className="w-6 h-6" />
                          </div>
                          <span className={`text-xs font-semibold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>#{i + 1}</span>
                        </div>
                        <div className="md:col-span-10 grid gap-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={step.title}
                              onChange={(e) => updateListItem('steps', i, 'title', e.target.value)}
                              placeholder="Adım Başlığı"
                              className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-500/30 transition-all shadow-inner ${isDayMode ? 'bg-white border-slate-200 text-slate-900' : 'bg-white/5 border-white/5 text-white'}`}
                            />
                            <input
                              type="text"
                              value={step.icon || ''}
                              onChange={(e) => updateListItem('steps', i, 'icon', e.target.value)}
                              placeholder="İkon (FileText, Zap vb.)"
                              className={`w-full border rounded-xl px-4 py-3 text-cyan-500 text-xs font-bold focus:outline-none focus:border-cyan-500/30 transition-all shadow-inner ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}
                            />
                          </div>
                          <textarea
                            value={step.description}
                            onChange={(e) => updateListItem('steps', i, 'description', e.target.value)}
                            placeholder="Adım Açıklaması"
                            rows={2}
                            className={`w-full border rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-cyan-500/30 transition-all shadow-inner resize-none ${isDayMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/5 text-gray-400'}`}
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <button
                            onClick={() => removeItem('steps', step.id)}
                            className="p-2 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features Section Editor */}
            {activeSection === 'features' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center justify-between border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Zap className="w-5 h-5 text-cyan-500" />
                    </div>
                    <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Özellikleri Yönet</h3>
                  </div>
                  <button
                    onClick={() => addItem('features')}
                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Yeni Özellik
                  </button>
                </div>

                <div className="grid gap-4">
                  {(content.features || []).map((item, i) => (
                    <div key={item.id || i} className={`p-6 rounded-[2rem] border transition-all group relative ${isDayMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                      <div className="grid md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-1 flex flex-col items-center justify-center gap-2">
                          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${isDayMode ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                            <Layout className="w-6 h-6" />
                          </div>
                          <span className={`text-xs font-semibold ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`}>#{i + 1}</span>
                        </div>
                        <div className="md:col-span-10 grid gap-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateListItem('features', i, 'title', e.target.value)}
                              placeholder="Özellik Başlığı"
                              className={`w-full border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-500/30 transition-all shadow-inner ${isDayMode ? 'bg-white border-slate-200 text-slate-900' : 'bg-white/5 border-white/5 text-white'}`}
                            />
                            <input
                              type="text"
                              value={item.icon || ''}
                              onChange={(e) => updateListItem('features', i, 'icon', e.target.value)}
                              placeholder="İkon (Sparkles, Shield vb.)"
                              className={`w-full border rounded-xl px-4 py-3 text-cyan-500 text-xs font-bold focus:outline-none focus:border-cyan-500/30 transition-all shadow-inner ${isDayMode ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}
                            />
                          </div>
                          <textarea
                            value={item.description}
                            onChange={(e) => updateListItem('features', i, 'description', e.target.value)}
                            placeholder="Özellik Açıklaması"
                            rows={2}
                            className={`w-full border rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-cyan-500/30 transition-all shadow-inner resize-none ${isDayMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/5 text-gray-400'}`}
                          />
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <button
                            onClick={() => removeItem('features', item.id)}
                            className="p-2 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonials Section */}
            {activeSection === 'testimonials' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center justify-between border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                    </div>
                    <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Yorumları Yönet</h3>
                  </div>
                  <button
                    onClick={() => addItem('testimonials', { id: Date.now(), name: 'Ad Soyad', role: 'Pozisyon', text: 'Yorum...', rating: 5 })}
                    className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Yeni Yorum
                  </button>
                </div>
                <div className="grid gap-4">
                  {(content.testimonials || []).map((t, i) => (
                    <div key={t.id || i} className={`p-6 rounded-[2rem] border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input type="text" value={t.name} onChange={(e) => updateListItem('testimonials', i, 'name', e.target.value)} placeholder="İsim" className={`border rounded-xl px-4 py-2 font-bold ${isDayMode ? 'bg-white border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`} />
                        <input type="text" value={t.role} onChange={(e) => updateListItem('testimonials', i, 'role', e.target.value)} placeholder="Görev" className={`border rounded-xl px-4 py-2 ${isDayMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-400'}`} />
                      </div>
                      <textarea value={t.text} onChange={(e) => updateListItem('testimonials', i, 'text', e.target.value)} rows={3} className={`w-full border rounded-xl px-4 py-2 resize-none mb-4 ${isDayMode ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'}`} />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} onClick={() => updateListItem('testimonials', i, 'rating', star)} className={`w-4 h-4 cursor-pointer ${t.rating >= star ? 'text-yellow-400 fill-yellow-400' : (isDayMode ? 'text-slate-300' : 'text-gray-600')}`} />
                          ))}
                        </div>
                        <button onClick={() => removeItem('testimonials', t.id)} className="text-red-500/50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {activeSection === 'faqs' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center justify-between border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                      <HelpCircle className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Sık Sorulan Sorular</h3>
                  </div>
                  <button
                    onClick={() => addItem('faqs', { id: Date.now(), question: 'Yeni Soru?', answer: 'Yeni Cevap.' })}
                    className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" /> Yeni SSS
                  </button>
                </div>
                <div className="grid gap-4">
                  {(content.faqs || []).map((faq, i) => (
                    <div key={faq.id || i} className={`p-6 rounded-[2rem] border transition-all ${isDayMode ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                      <input type="text" value={faq.question} onChange={(e) => updateListItem('faqs', i, 'question', e.target.value)} placeholder="Soru?" className={`w-full border rounded-xl px-4 py-3 font-bold mb-3 focus:border-orange-500/30 focus:outline-none ${isDayMode ? 'bg-white border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`} />
                      <textarea value={faq.answer} onChange={(e) => updateListItem('faqs', i, 'answer', e.target.value)} rows={3} placeholder="Cevap..." className={`w-full border rounded-xl px-4 py-3 resize-none focus:border-orange-500/30 focus:outline-none ${isDayMode ? 'bg-white border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-gray-400'}`} />
                      <div className="flex justify-end mt-2">
                        <button onClick={() => removeItem('faqs', faq.id)} className="text-red-500/50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Section Editor */}
            {activeSection === 'pricing' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center gap-4 border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Plan Ayarları</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Free Plan */}
                  <div className={`space-y-6 p-6 rounded-2xl border ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center text-gray-500 font-bold text-xs">BASIC</div>
                      <h4 className={`text-lg font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>ÜCRETSİZ PLAN</h4>
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Aylık Fiyat (₺)</label>
                      <input type="number" readOnly value={0} className={`w-full border rounded-2xl px-6 py-4 font-semibold text-2xl ${isDayMode ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-black/20 border-white/5 text-gray-500'}`} />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Özellikler (Satır satır)</label>
                      <textarea
                        value={content.pricing.free.features.join('\n')}
                        onChange={(e) => {
                          const newFree = { ...content.pricing.free, features: e.target.value.split('\n').filter(f => f.trim()) }
                          setContent(prev => ({ ...prev, pricing: { ...prev.pricing, free: newFree } }))
                        }}
                        rows={5}
                        className={`w-full border rounded-2xl p-4 resize-none focus:outline-none focus:border-cyan-500/50 ${isDayMode ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'}`}
                      />
                    </div>
                  </div>

                  {/* Pro Plan */}
                  <div className={`space-y-6 p-6 rounded-2xl border shadow-lg ${isDayMode ? 'bg-cyan-50 border-cyan-200 shadow-cyan-500/5' : 'bg-cyan-500/5 border-cyan-500/20 shadow-cyan-500/5'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500 font-bold text-xs ring-1 ring-cyan-500/30">PRO</div>
                      <h4 className={`text-lg font-semibold ${isDayMode ? 'text-slate-900' : 'text-white'}`}>PRO PLAN</h4>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-cyan-500 uppercase tracking-wider px-1">Aylık Fiyat (₺)</label>
                      <input
                        type="number"
                        value={content.pricing.pro.price}
                        onChange={(e) => {
                          const newPro = { ...content.pricing.pro, price: parseInt(e.target.value) }
                          setContent(prev => ({ ...prev, pricing: { ...prev.pricing, pro: newPro } }))
                        }}
                        className={`w-full border rounded-2xl px-6 py-4 text-cyan-500 font-semibold text-3xl focus:outline-none ${isDayMode ? 'bg-white border-cyan-200' : 'bg-cyan-500/10 border-cyan-500/30'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Özellikler (Satır satır)</label>
                      <textarea
                        value={content.pricing.pro.features.join('\n')}
                        onChange={(e) => {
                          const newPro = { ...content.pricing.pro, features: e.target.value.split('\n').filter(f => f.trim()) }
                          setContent(prev => ({ ...prev, pricing: { ...prev.pricing, pro: newPro } }))
                        }}
                        rows={5}
                        className={`w-full border rounded-2xl p-4 resize-none focus:outline-none focus:border-cyan-500/50 ${isDayMode ? 'bg-white border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-300'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Section Editor */}
            {activeSection === 'footer' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className={`flex items-center gap-4 border-b pb-4 ${isDayMode ? 'border-slate-200' : 'border-white/5'}`}>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Globe className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className={`text-xl font-semibold uppercase ${isDayMode ? 'text-slate-900' : 'text-white'}`}>Footer Bilgileri</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Copyright Metni</label>
                      <input
                        type="text"
                        value={content.footer.copyright}
                        onChange={(e) => updateNestedContent('footer', 'copyright', e.target.value)}
                        className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-bold ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-white'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-xs font-semibold uppercase tracking-wider px-1 ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Kısa Açıklama</label>
                      <textarea
                        value={content.footer.description}
                        onChange={(e) => updateNestedContent('footer', 'description', e.target.value)}
                        rows={3}
                        className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 transition-all font-medium resize-none shadow-inner ${isDayMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-gray-400'}`}
                      />
                    </div>
                  </div>
                  <div className={`flex flex-col justify-center items-center p-8 rounded-2xl border text-center ${isDayMode ? 'bg-slate-50 border-slate-200' : 'bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-white/5'}`}>
                    <Share2 className="w-12 h-12 text-purple-500 mb-4 opacity-30" />
                    <p className={`text-xs font-bold uppercase tracking-wider leading-loose ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>Sosyal medya linkleri ve SEO ayarları yakında bu bölüme eklenecektir.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preview Badge */}
          <div className={`flex items-center justify-center gap-3 p-4 rounded-3xl border border-dashed ${isDayMode ? 'bg-slate-100 border-slate-300' : 'bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 border-white/5'}`}>
            <Info className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDayMode ? 'text-slate-600' : 'text-gray-500'}`}>Değişikliklerin canlı sitede görünmesi için yukarıdaki <span className={isDayMode ? 'text-slate-900 font-bold' : 'text-white'}>"YAYINLA"</span> butonuna basmalısınız.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
