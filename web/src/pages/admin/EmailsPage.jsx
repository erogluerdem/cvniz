import { useState, useEffect } from 'react'
import {
    Mail, Send, Users, FileText, Clock, Check, AlertCircle, Eye, Edit, Trash2, Plus, X,
    RefreshCw, Search, MousePointerClick, TrendingUp, Calendar, User, Tag, CheckCircle2, PauseCircle
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useToast } from '../../context/ToastContext'

const typeConfig = {
    campaign: { label: 'Kampanya', color: 'bg-purple-500/20 text-purple-400' },
    transactional: { label: 'Transactional', color: 'bg-blue-500/20 text-blue-400' },
    newsletter: { label: 'Newsletter', color: 'bg-cyan-500/20 text-cyan-400' },
    notification: { label: 'Bildirim', color: 'bg-amber-500/20 text-amber-400' },
    reminder: { label: 'Hatırlatma', color: 'bg-green-500/20 text-green-400' }
}

const statusConfig = {
    draft: { label: 'Taslak', color: 'bg-gray-500/20 text-gray-400', icon: Clock },
    scheduled: { label: 'Zamanlandı', color: 'bg-amber-500/20 text-amber-400', icon: Calendar },
    sending: { label: 'Gönderiliyor', color: 'bg-blue-500/20 text-blue-400', icon: Send },
    sent: { label: 'Gönderildi', color: 'bg-green-500/20 text-green-400', icon: CheckCircle2 },
    failed: { label: 'Başarısız', color: 'bg-red-500/20 text-red-400', icon: AlertCircle },
    cancelled: { label: 'İptal', color: 'bg-gray-600/20 text-gray-500', icon: X }
}

const recipientConfig = {
    all: { label: 'Tüm Kullanıcılar', count: '~1,250' },
    premium: { label: 'Premium Üyeler', count: '~342' },
    free: { label: 'Ücretsiz Kullanıcılar', count: '~908' },
    inactive: { label: 'Aktif Olmayanlar', count: '~156' },
    new: { label: 'Yeni Kullanıcılar (7 gün)', count: '~45' },
    custom: { label: 'Özel Liste', count: '' }
}

const templateTypeConfig = {
    welcome: { label: 'Hoş Geldin', color: 'bg-green-500/20 text-green-400' },
    premium: { label: 'Premium', color: 'bg-amber-500/20 text-amber-400' },
    password: { label: 'Şifre', color: 'bg-red-500/20 text-red-400' },
    reminder: { label: 'Hatırlatma', color: 'bg-blue-500/20 text-blue-400' },
    notification: { label: 'Bildirim', color: 'bg-purple-500/20 text-purple-400' },
    marketing: { label: 'Pazarlama', color: 'bg-cyan-500/20 text-cyan-400' },
    newsletter: { label: 'Newsletter', color: 'bg-pink-500/20 text-pink-400' },
    custom: { label: 'Özel', color: 'bg-gray-500/20 text-gray-400' }
}

export default function EmailsPage() {
    const { toast, confirm } = useToast()
    const [activeTab, setActiveTab] = useState('compose')
    const [emails, setEmails] = useState([])
    const [templates, setTemplates] = useState([])
    const [stats, setStats] = useState({ total: 0, sent: 0, totalOpened: 0, totalClicked: 0, avgOpenRate: 0 })
    const [loading, setLoading] = useState(true)
    const [showTemplateModal, setShowTemplateModal] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState(null)
    const [emailData, setEmailData] = useState({
        subject: '',
        content: '',
        type: 'campaign',
        recipients: 'all',
        scheduledDate: '',
        fromName: 'CVniz',
        fromEmail: 'noreply@CVniz.com'
    })
    const [templateData, setTemplateData] = useState({
        name: '',
        subject: '',
        content: '',
        type: 'custom'
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [emailsRes, templatesRes, statsRes] = await Promise.all([
                adminAPI.getEmails(),
                adminAPI.getEmailTemplates(),
                adminAPI.getEmailStats()
            ])
            if (emailsRes.success) setEmails(emailsRes.emails)
            if (templatesRes.success) setTemplates(templatesRes.templates)
            if (statsRes.success) setStats(statsRes.stats)
        } catch (error) {
            toast.error('Veriler yüklenirken hata: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSendEmail = async (e) => {
        e.preventDefault()
        try {
            const status = emailData.scheduledDate ? 'scheduled' : 'sent'
            const response = await adminAPI.createEmail({
                ...emailData,
                status,
                sentDate: status === 'sent' ? new Date() : null,
                recipientCount: recipientConfig[emailData.recipients]?.count ? parseInt(recipientConfig[emailData.recipients].count.replace(/[^0-9]/g, '')) : 0
            })
            if (response.success) {
                toast.success(emailData.scheduledDate ? 'E-posta zamanlandı!' : 'E-posta gönderildi!')
                setEmailData({ subject: '', content: '', type: 'campaign', recipients: 'all', scheduledDate: '', fromName: 'CVniz', fromEmail: 'noreply@CVniz.com' })
                fetchData()
            }
        } catch (error) {
            toast.error('E-posta gönderilemedi: ' + error.message)
        }
    }

    const handleSaveTemplate = async (e) => {
        e.preventDefault()
        try {
            let response
            if (editingTemplate) {
                response = await adminAPI.updateEmailTemplate(editingTemplate._id, templateData)
                toast.success('Şablon güncellendi!')
            } else {
                response = await adminAPI.createEmailTemplate(templateData)
                toast.success('Şablon oluşturuldu!')
            }
            if (response.success) {
                setShowTemplateModal(false)
                setEditingTemplate(null)
                setTemplateData({ name: '', subject: '', content: '', type: 'custom' })
                fetchData()
            }
        } catch (error) {
            toast.error('Şablon kaydedilemedi: ' + error.message)
        }
    }

    const openEditTemplate = (template) => {
        setEditingTemplate(template)
        setTemplateData({
            name: template.name,
            subject: template.subject,
            content: template.content,
            type: template.type
        })
        setShowTemplateModal(true)
    }

    const deleteTemplate = async (id) => {
        const confirmed = await confirm({
            title: 'Şablonu Sil',
            message: 'Bu şablonu kalıcı olarak silmek istediğinize emin misiniz?',
            confirmText: 'Evet, Sil',
            type: 'danger'
        })
        if (!confirmed) return

        try {
            const response = await adminAPI.deleteEmailTemplate(id)
            if (response.success) {
                setTemplates(templates.filter(t => t._id !== id))
                toast.success('Şablon silindi.')
            }
        } catch (error) {
            toast.error('Şablon silinemedi.')
        }
    }

    const useTemplate = (template) => {
        setEmailData({
            ...emailData,
            subject: template.subject,
            content: template.content
        })
        setActiveTab('compose')
        toast.success('Şablon yüklendi!')
    }

    if (loading && emails.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 border-t-cyan-500 animate-spin"></div>
                    <Mail className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-1">E-POSTALAR YÜKLENİYOR</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">Veriler senkronize ediliyor...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter flex items-center gap-3 italic">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                            <Mail className="w-6 h-6 text-cyan-400" />
                        </div>
                        E-posta Yönetimi
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">Kampanyalar oluşturun ve gönderim performansını takip edin.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'GÖNDERİLEN', value: stats.sent || 0, icon: <Send className="w-4 h-4" />, color: 'cyan' },
                    { label: 'AÇILMA', value: stats.totalOpened || 0, icon: <Eye className="w-4 h-4" />, color: 'green' },
                    { label: 'TIKLAMA', value: stats.totalClicked || 0, icon: <MousePointerClick className="w-4 h-4" />, color: 'purple' },
                    { label: 'AÇILMA ORANI', value: `${stats.avgOpenRate || 0}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 blur-3xl -z-10`}></div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-black text-white tracking-tighter italic">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="glass-card rounded-[2.5rem] p-2 border border-white/5 flex gap-2">
                {[
                    { id: 'compose', label: 'Yeni E-posta', icon: <Send className="w-4 h-4" /> },
                    { id: 'templates', label: 'Şablonlar', icon: <FileText className="w-4 h-4" /> },
                    { id: 'history', label: 'Gönderim Geçmişi', icon: <Clock className="w-4 h-4" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-6 py-3.5 rounded-[2rem] flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Compose Tab */}
            {activeTab === 'compose' && (
                <div className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl -z-10"></div>

                    <form onSubmit={handleSendEmail} className="space-y-5">
                        {/* Recipients & Type */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">ALICILAR</label>
                                <select
                                    value={emailData.recipients}
                                    onChange={(e) => setEmailData({ ...emailData, recipients: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                >
                                    {Object.entries(recipientConfig).map(([key, val]) => (
                                        <option key={key} value={key}>{val.label} {val.count && `(${val.count})`}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">E-POSTA TÜRÜ</label>
                                <select
                                    value={emailData.type}
                                    onChange={(e) => setEmailData({ ...emailData, type: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                >
                                    {Object.entries(typeConfig).map(([key, val]) => (
                                        <option key={key} value={key}>{val.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">KONU</label>
                            <input
                                type="text"
                                value={emailData.subject}
                                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                                placeholder="E-posta konusu..."
                                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">İÇERİK</label>
                            <textarea
                                value={emailData.content}
                                onChange={(e) => setEmailData({ ...emailData, content: e.target.value })}
                                rows={10}
                                placeholder="E-posta içeriğini yazın... (HTML desteklenir)"
                                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-cyan-500/30 resize-none"
                                required
                            />
                        </div>

                        {/* Schedule */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">ZAMANLA (OPSİYONEL)</label>
                                <input
                                    type="datetime-local"
                                    value={emailData.scheduledDate}
                                    onChange={(e) => setEmailData({ ...emailData, scheduledDate: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-cyan-500/30"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">GÖNDERİCİ ADI</label>
                                <input
                                    type="text"
                                    value={emailData.fromName}
                                    onChange={(e) => setEmailData({ ...emailData, fromName: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-cyan-500/30"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                {emailData.scheduledDate ? 'ZAMANLA' : 'GÖNDER'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Templates Tab */}
            {activeTab === 'templates' && (
                <div className="space-y-5">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setEditingTemplate(null); setTemplateData({ name: '', subject: '', content: '', type: 'custom' }); setShowTemplateModal(true) }}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> YENİ ŞABLON
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        {templates.map(template => {
                            const type = templateTypeConfig[template.type] || templateTypeConfig.custom
                            return (
                                <div key={template._id} className="glass-card rounded-[2.5rem] p-6 border border-white/5 hover:border-cyan-500/20 transition-all group">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-black text-white uppercase tracking-tight mb-1">{template.name}</h4>
                                            <p className="text-sm text-gray-400 font-medium">{template.subject}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${type.color}`}>
                                            {type.label}
                                        </span>
                                    </div>

                                    <div className="text-xs text-gray-500 mb-4 line-clamp-2">
                                        {template.content?.substring(0, 100)}...
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                        <button
                                            onClick={() => useTemplate(template)}
                                            className="flex-1 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                                        >
                                            KULLAN
                                        </button>
                                        <button
                                            onClick={() => openEditTemplate(template)}
                                            className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteTemplate(template._id)}
                                            className="p-2.5 rounded-xl bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}

                        {templates.length === 0 && (
                            <div className="md:col-span-2 text-center py-20 glass-card rounded-[3rem] border border-dashed border-white/10">
                                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h4 className="text-lg font-black text-white uppercase tracking-tighter italic mb-1">ŞABLON BULUNAMADI</h4>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Henüz şablon oluşturulmamış.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">KONU</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">ALICI</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">AÇILMA</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">TIKLAMA</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">TARİH</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">DURUM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emails.map(email => {
                                const status = statusConfig[email.status] || statusConfig.draft
                                const StatusIcon = status.icon
                                const openRate = email.recipientCount > 0 ? ((email.opened / email.recipientCount) * 100).toFixed(1) : 0

                                return (
                                    <tr key={email._id} className="border-t border-white/5 hover:bg-white/5 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white text-sm">{email.subject}</div>
                                            <div className="text-xs text-gray-500">{typeConfig[email.type]?.label || 'Kampanya'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-white">
                                            {(email.recipientCount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="font-bold text-green-400">{(email.opened || 0).toLocaleString()}</span>
                                            <span className="text-gray-500 ml-1">({openRate}%)</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-purple-400">
                                            {(email.clicked || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {email.sentDate ? new Date(email.sentDate).toLocaleDateString('tr-TR') :
                                                email.scheduledDate ? new Date(email.scheduledDate).toLocaleDateString('tr-TR') :
                                                    new Date(email.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${status.color}`}>
                                                <StatusIcon className="w-3 h-3" /> {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {emails.length === 0 && (
                        <div className="text-center py-20">
                            <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h4 className="text-lg font-black text-white uppercase tracking-tighter italic mb-1">E-POSTA BULUNAMADI</h4>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Henüz e-posta gönderilmemiş.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Template Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
                    <div className="glass-card rounded-[3rem] p-8 max-w-2xl w-full border border-white/10 relative overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl -z-10"></div>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">
                                    {editingTemplate ? 'ŞABLONU DÜZENLE' : 'YENİ ŞABLON'}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">E-posta şablonu oluşturun.</p>
                            </div>
                            <button onClick={() => { setShowTemplateModal(false); setEditingTemplate(null) }} className="p-2 rounded-xl bg-white/5 text-gray-500 hover:text-white transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTemplate} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">ŞABLON ADI</label>
                                    <input
                                        type="text"
                                        value={templateData.name}
                                        onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                                        placeholder="Hoş Geldin E-postası"
                                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">TÜR</label>
                                    <select
                                        value={templateData.type}
                                        onChange={(e) => setTemplateData({ ...templateData, type: e.target.value })}
                                        className="w-full px-4 py-3.5 bg-slate-900 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    >
                                        {Object.entries(templateTypeConfig).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">KONU</label>
                                <input
                                    type="text"
                                    value={templateData.subject}
                                    onChange={(e) => setTemplateData({ ...templateData, subject: e.target.value })}
                                    placeholder="E-posta konu satırı..."
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-bold focus:outline-none focus:border-cyan-500/30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">İÇERİK</label>
                                <textarea
                                    value={templateData.content}
                                    onChange={(e) => setTemplateData({ ...templateData, content: e.target.value })}
                                    rows={8}
                                    placeholder="Şablon içeriği... (HTML desteklenir)"
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white font-medium focus:outline-none focus:border-cyan-500/30 resize-none"
                                    required
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowTemplateModal(false); setEditingTemplate(null) }}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    İPTAL
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    {editingTemplate ? 'GÜNCELLE' : 'ŞABLON OLUŞTUR'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

