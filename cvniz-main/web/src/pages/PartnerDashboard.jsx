import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWhiteLabel, PARTNER_PLANS, DEFAULT_THEME } from '../context/WhiteLabelContext'
import {
    Palette, Key, BarChart3, Settings, ArrowLeft, Copy, RefreshCw,
    Check, Eye, EyeOff, Code, Globe, Webhook, DollarSign, Users,
    FileText, Download, ExternalLink, Shield, Zap
} from 'lucide-react'

export default function PartnerDashboard() {
    const { user } = useAuth()
    const {
        currentPartner, theme, setTheme, updatePartnerTheme,
        regenerateApiKey, getApiDocs, calculatePartnerRevenue
    } = useWhiteLabel() || {}
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('overview')
    const [showApiKey, setShowApiKey] = useState(false)
    const [copied, setCopied] = useState(false)
    const [editTheme, setEditTheme] = useState(theme || DEFAULT_THEME)

    // Demo partner data
    const partner = currentPartner || {
        id: 'demo_partner',
        name: 'Demo Partner',
        plan: 'professional',
        status: 'active',
        apiKey: 'pk_demo_' + 'x'.repeat(24),
        secretKey: 'sk_demo_' + 'x'.repeat(24),
        theme: editTheme,
        stats: {
            totalCVs: 1234,
            totalUsers: 567,
            revenue: 8900,
            lastActive: new Date().toISOString()
        },
        domain: 'cv.mycompany.com'
    }

    const plan = PARTNER_PLANS[partner.plan]
    const apiDocs = getApiDocs?.() || { baseUrl: 'https://api.CVniz.com/v1', endpoints: [] }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleThemeSave = () => {
        if (setTheme) {
            setTheme(editTheme)
        }
    }

    const tabs = [
        { id: 'overview', label: 'Genel Bakış', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'branding', label: 'Marka', icon: <Palette className="w-5 h-5" /> },
        { id: 'api', label: 'API', icon: <Code className="w-5 h-5" /> },
        { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> }
    ]

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-xl hover:bg-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Shield className="w-7 h-7 text-purple-400" />
                            Partner Dashboard
                        </h1>
                        <p className="text-gray-400">{partner.name} • {plan?.name} Plan</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${partner.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                    {partner.status === 'active' ? 'Aktif' : 'Beklemede'}
                </span>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{partner.stats.totalCVs.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Toplam CV</div>
                        </div>

                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-cyan-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">{partner.stats.totalUsers.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Kullanıcı</div>
                        </div>

                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">₺{partner.stats.revenue.toLocaleString()}</div>
                            <div className="text-sm text-gray-400">Toplam Gelir</div>
                        </div>

                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-amber-400" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold">%{plan?.revenue_share || 0}</div>
                            <div className="text-sm text-gray-400">Gelir Payı</div>
                        </div>
                    </div>

                    {/* Plan Info */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Mevcut Plan: {plan?.name}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                <div className="text-2xl font-bold text-purple-400 mb-2">
                                    {plan?.price ? `₺${plan.price}/ay` : 'Özel'}
                                </div>
                                <ul className="space-y-1">
                                    {plan?.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                            <Check className="w-4 h-4 text-green-400" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5">
                                <h4 className="font-medium mb-2">Hesaplanan Gelir Payınız</h4>
                                <div className="text-3xl font-bold text-green-400">
                                    ₺{Math.round(partner.stats.revenue * (plan?.revenue_share || 0) / 100).toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-400 mt-1">
                                    Toplam ₺{partner.stats.revenue.toLocaleString()} × %{plan?.revenue_share}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-6">Marka Özelleştirme</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Şirket Adı</label>
                                    <input
                                        type="text"
                                        value={editTheme.companyName}
                                        onChange={(e) => setEditTheme({ ...editTheme, companyName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Slogan</label>
                                    <input
                                        type="text"
                                        value={editTheme.tagline}
                                        onChange={(e) => setEditTheme({ ...editTheme, tagline: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Ana Renk</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            value={editTheme.primaryColor}
                                            onChange={(e) => setEditTheme({ ...editTheme, primaryColor: e.target.value })}
                                            className="w-12 h-12 rounded-xl cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={editTheme.primaryColor}
                                            onChange={(e) => setEditTheme({ ...editTheme, primaryColor: e.target.value })}
                                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Vurgu Rengi</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            value={editTheme.accentColor}
                                            onChange={(e) => setEditTheme({ ...editTheme, accentColor: e.target.value })}
                                            className="w-12 h-12 rounded-xl cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={editTheme.accentColor}
                                            onChange={(e) => setEditTheme({ ...editTheme, accentColor: e.target.value })}
                                            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Önizleme</label>
                                <div
                                    className="rounded-xl overflow-hidden border border-white/10"
                                    style={{ background: `linear-gradient(135deg, ${editTheme.primaryColor}20, ${editTheme.accentColor}20)` }}
                                >
                                    <div className="p-4 border-b border-white/10 flex items-center gap-3">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: editTheme.primaryColor }}
                                        >
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="font-bold">{editTheme.companyName}</span>
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-bold mb-2">{editTheme.tagline}</h3>
                                        <button
                                            className="px-6 py-2 rounded-xl text-white font-medium"
                                            style={{ background: `linear-gradient(to right, ${editTheme.primaryColor}, ${editTheme.accentColor})` }}
                                        >
                                            CV Oluştur
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 pt-6 border-t border-white/10">
                            <button
                                onClick={handleThemeSave}
                                className="px-6 py-3 rounded-xl bg-purple-500 text-white font-bold"
                            >
                                Değişiklikleri Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* API Tab */}
            {activeTab === 'api' && (
                <div className="space-y-6">
                    {/* API Keys */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">API Anahtarları</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Public Key</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 px-4 py-3 rounded-xl bg-white/10 font-mono text-sm">
                                        {showApiKey ? partner.apiKey : partner.apiKey.slice(0, 10) + '•'.repeat(20)}
                                    </div>
                                    <button
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                    >
                                        {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(partner.apiKey)}
                                        className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Documentation */}
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">API Endpoints</h3>
                        <p className="text-sm text-gray-400 mb-4">Base URL: <code className="px-2 py-1 rounded bg-white/10">{apiDocs.baseUrl}</code></p>

                        <div className="space-y-3">
                            {apiDocs.endpoints?.map((endpoint, i) => (
                                <div key={i} className="p-4 rounded-xl bg-white/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                                                endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {endpoint.method}
                                        </span>
                                        <code className="text-sm">{endpoint.path}</code>
                                    </div>
                                    <p className="text-sm text-gray-400">{endpoint.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                                <Key className="w-4 h-4" />
                                Authentication
                            </h4>
                            <code className="text-sm text-gray-300">{apiDocs.authentication}</code>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Domain Ayarları</h3>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Özel Domain</label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    defaultValue={partner.domain}
                                    placeholder="cv.yourcompany.com"
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
                                />
                                <button className="px-6 py-3 rounded-xl bg-purple-500 text-white font-medium">
                                    Doğrula
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                DNS CNAME kaydı: cv.yourcompany.com → partners.CVniz.com
                            </p>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                        <h3 className="font-bold mb-4">Webhook</h3>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Webhook URL</label>
                            <input
                                type="url"
                                defaultValue={partner.webhookUrl}
                                placeholder="https://yourserver.com/webhook"
                                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:border-purple-500 outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                CV oluşturma, indirme ve kullanıcı işlemleri için bildirim alın
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

