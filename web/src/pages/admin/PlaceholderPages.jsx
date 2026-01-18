// Placeholder pages for admin sections
// These will be implemented in detail later

import { Activity, BarChart3, Home, Megaphone, Tag, Mail, Image, Palette, FileSpreadsheet, Shield, Key, Zap, Languages, Target, FlaskConical, Share2, MessageCircle, Building2, Star, Briefcase, Users2 } from 'lucide-react'

// Analytics Page
export function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    Analitik
                </h3>
                <p className="text-gray-400">Detaylı analitik görünümü yakında...</p>
            </div>
        </div>
    )
}

// Live Stats Page
export function LiveStatsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    Canlı İstatistikler
                </h3>
                <p className="text-gray-400">Canlı görünüm yakında...</p>
            </div>
        </div>
    )
}

// Site Content Page
export function SiteContentPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-purple-400" />
                    Site İçeriği
                </h3>
                <p className="text-gray-400">Site içerik düzenleme yakında...</p>
            </div>
        </div>
    )
}

// Announcements Page
export function AnnouncementsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-amber-400" />
                    Duyurular
                </h3>
                <p className="text-gray-400">Duyuru yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Coupons Page
export function CouponsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-pink-400" />
                    Kuponlar
                </h3>
                <p className="text-gray-400">Kupon yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Emails Page
export function EmailsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    E-posta
                </h3>
                <p className="text-gray-400">E-posta yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Media Page
export function MediaPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-indigo-400" />
                    Medya
                </h3>
                <p className="text-gray-400">Medya yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Theme Page
export function ThemePage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-violet-400" />
                    Tema
                </h3>
                <p className="text-gray-400">Tema yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Reports Page
export function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-teal-400" />
                    Raporlar
                </h3>
                <p className="text-gray-400">Raporlar yakında...</p>
            </div>
        </div>
    )
}

// Security Page
export function SecurityPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" />
                    Güvenlik
                </h3>
                <p className="text-gray-400">Güvenlik ayarları yakında...</p>
            </div>
        </div>
    )
}

// API Page
export function ApiPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Key className="w-5 h-5 text-emerald-400" />
                    API Yönetimi
                </h3>
                <p className="text-gray-400">API yönetimi yakında...</p>
            </div>
        </div>
    )
}

// AI Settings Page
export function AISettingsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    AI Ayarları
                </h3>
                <p className="text-gray-400">AI ayarları yakında...</p>
            </div>
        </div>
    )
}

// Translations Page
export function TranslationsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Languages className="w-5 h-5 text-sky-400" />
                    Çeviriler
                </h3>
                <p className="text-gray-400">Çeviri yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Logs Page
export function LogsPage() {
    const systemLogs = [
        { time: '14:32:15', level: 'info', message: 'Kullanıcı girişi: ahmet@mail.com', ip: '192.168.1.1' },
        { time: '14:30:02', level: 'success', message: 'Ödeme alındı: #1234', ip: '192.168.1.2' },
        { time: '14:28:45', level: 'warning', message: 'Başarısız giriş denemesi', ip: '192.168.1.3' },
        { time: '14:25:11', level: 'info', message: 'Yeni CV oluşturuldu', ip: '192.168.1.1' },
        { time: '14:20:33', level: 'error', message: 'Ödeme hatası: Timeout', ip: '192.168.1.4' }
    ]

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 text-sm">Tümü</button>
                <button className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-sm">Info</button>
                <button className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-sm">Uyarı</button>
                <button className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-sm">Hata</button>
            </div>
            <div className="glass-card rounded-2xl p-4 font-mono text-sm">
                {systemLogs.map((log, i) => (
                    <div key={i} className={`py-2 px-3 rounded ${i % 2 === 0 ? 'bg-white/5' : ''} flex gap-4`}>
                        <span className="text-gray-500">[{log.time}]</span>
                        <span className={`uppercase text-xs px-2 py-0.5 rounded ${log.level === 'success' ? 'bg-green-500/20 text-green-400' :
                                log.level === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                                    log.level === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'
                            }`}>
                            {log.level}
                        </span>
                        <span className="flex-1">{log.message}</span>
                        <span className="text-gray-600">{log.ip}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Campaigns Page
export function CampaignsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-400" />
                    Kampanyalar
                </h3>
                <p className="text-gray-400">Kampanya yönetimi yakında...</p>
            </div>
        </div>
    )
}

// AB Tests Page
export function ABTestsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-fuchsia-400" />
                    A/B Testler
                </h3>
                <p className="text-gray-400">A/B test yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Referrals Page
export function ReferralsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-lime-400" />
                    Referral
                </h3>
                <p className="text-gray-400">Referral yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Support Page
export function SupportPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-rose-400" />
                    Destek Talepleri
                </h3>
                <p className="text-gray-400">Destek talepleri yakında...</p>
            </div>
        </div>
    )
}

// Enterprise Page
export function EnterprisePage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    Kurumsal
                </h3>
                <p className="text-gray-400">Kurumsal yönetimi yakında...</p>
            </div>
        </div>
    )
}

// CV Reviews Page
export function CVReviewsPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" />
                    CV İnceleme
                </h3>
                <p className="text-gray-400">CV inceleme yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Job Board Page
export function JobBoardPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    İş İlanları
                </h3>
                <p className="text-gray-400">İş ilanları yönetimi yakında...</p>
            </div>
        </div>
    )
}

// Partners Page
export function PartnersPage() {
    return (
        <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-purple-400" />
                    Partnerler
                </h3>
                <p className="text-gray-400">Partner yönetimi yakında...</p>
            </div>
        </div>
    )
}
