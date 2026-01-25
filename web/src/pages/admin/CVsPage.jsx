import { useState, useEffect } from 'react'
import { Eye, Trash2, Search, Filter, FileText, Calendar, User, Layout, Loader2, ExternalLink, Download } from 'lucide-react'
import { adminAPI } from '../../services/api'
import { StatusBadge, FilterTabs } from '../../components/admin/SharedComponents'
import { Link } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'

const templateNames = {
    modern: 'Modern Sanat',
    minimalist: 'Sade & Şık',
    corporate: 'Kurumsal Vizyon',
    creative: 'Yaratıcı Zihin',
    tech: 'Dijital Gelecek',
    executive: 'Yönetici Elit',
    elegant: 'Zarif Çizgiler',
    healthcare: 'Sağlık Vizyonu',
    academic: 'Akademik Başarı',
    finance: 'Finansal Analiz',
    default: 'Standart Şablon'
}

export default function CVsPage() {
    const [cvs, setCvs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const { toast } = useToast()

    useEffect(() => {
        fetchCVs()
    }, [])

    const fetchCVs = async () => {
        setLoading(true)
        try {
            const response = await adminAPI.getCVs()
            if (response.success) {
                setCvs(response.cvs)
            }
        } catch (error) {
            console.error('CV listesi yüklenirken hata:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Bu CV\'yi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return
        try {
            const response = await adminAPI.deleteCV(id)
            if (response.success) {
                toast.success('CV başarıyla silindi')
                fetchCVs()
            }
        } catch (error) {
            toast.error('Silme hatası: ' + error.message)
        }
    }

    const getTemplateEmoji = (template) => {
        const emojis = {
            modern: '⚡', minimalist: '⬜', corporate: '🏢', creative: '🌈', tech: '💻',
            executive: '👔', elegant: '✨', healthcare: '🏥', academic: '📚', finance: '💰'
        }
        return emojis[template] || '📄'
    }

    const filteredCVs = cvs.filter(cv => {
        const matchesSearch = cv.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cv.owner?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cv.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())

        if (activeFilter === 'public') return matchesSearch && cv.isPublic
        if (activeFilter === 'archived') return matchesSearch && cv.isArchived
        if (activeFilter === 'web') {
            const webTemplateIds = [
                'corporate', 'creative', 'minimal', 'dark', 'glass', 'gradient',
                'magazine', 'neon', 'paper', 'portfolio', 'retrowave', 'terminal'
            ];
            const isWeb = cv.template?.includes('_web') ||
                cv.template?.includes('Web') ||
                webTemplateIds.some(id => cv.template?.startsWith(id));
            return matchesSearch && isWeb;
        }
        return matchesSearch
    })

    const publicCount = cvs.filter(cv => cv.isPublic).length
    const archivedCount = cvs.filter(cv => cv.isArchived).length
    const webCount = cvs.filter(cv => {
        const webTemplateIds = [
            'corporate', 'creative', 'minimal', 'dark', 'glass', 'gradient',
            'magazine', 'neon', 'paper', 'portfolio', 'retrowave', 'terminal'
        ];
        return cv.template?.includes('_web') ||
            cv.template?.includes('Web') ||
            webTemplateIds.some(id => cv.template?.startsWith(id));
    }).length

    const totalViews = cvs.reduce((acc, cv) => acc + (cv.metadata?.viewCount || 0), 0)
    const totalDownloads = cvs.reduce((acc, cv) => acc + (cv.metadata?.downloadCount || 0), 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">CV Yönetimi</h2>
                    <p className="text-gray-400 text-sm">Sistemdeki tüm özgeçmişleri görüntüleyin ve analiz edin.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Toplam {cvs.length} Belge
                    </div>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'TOPLAM GÖRÜNTÜLEME', val: totalViews, icon: <Eye className="w-4 h-4 text-cyan-400" />, color: 'cyan' },
                    { label: 'TOPLAM İNDİRME', val: totalDownloads, icon: <Download className="w-4 h-4 text-emerald-400" />, color: 'emerald' },
                    { label: 'YAYINDA OLANLAR', val: publicCount, icon: <ExternalLink className="w-4 h-4 text-purple-400" />, color: 'purple' },
                    { label: 'BUGÜN OLUŞTURULAN', val: cvs.filter(c => new Date(c.createdAt).toLocaleDateString() === new Date().toLocaleDateString()).length, icon: <FileText className="w-4 h-4 text-amber-400" />, color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-4 rounded-2xl flex items-center justify-between border border-white/5">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                            <div className="text-xl font-black text-white">{stat.val}</div>
                        </div>
                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center border border-${stat.color}-500/20`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Search Bar */}
            <div className="glass-card p-4 rounded-2xl border border-white/5 space-y-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        <FilterTabs
                            tabs={[
                                { id: 'all', label: 'Tümü' },
                                { id: 'public', label: 'Yayında Olanlar' },
                                { id: 'web', label: 'Web CV\'ler' },
                                { id: 'archived', label: 'Arşivdekiler' }
                            ]}
                            activeTab={activeFilter}
                            onChange={setActiveFilter}
                        />
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="CV ismi, kullanıcı adı veya mail ile ara..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500 transition-all font-medium text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Table Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                    <span className="text-gray-400 font-medium">Bütün CV'ler taranıyor...</span>
                </div>
            ) : (
                <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/5">
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Özgeçmiş Bilgisi</th>
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Oluşturan</th>
                                    <th className="text-center px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Analitikler</th>
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Durum</th>
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">Tarih</th>
                                    <th className="text-right px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-500">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredCVs.map(cv => (
                                    <tr key={cv.id} className="hover:bg-cyan-500/5 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                    {getTemplateEmoji(cv.template)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-cyan-400 transition-colors">{cv.name}</div>
                                                    <div className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest font-bold">
                                                        ŞABLON: {templateNames[cv.template] || cv.template.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/20">
                                                    {cv.owner?.name?.[0]?.toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-200">{cv.owner?.name}</span>
                                                    <span className="text-[10px] text-gray-500">{cv.owner?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase">GÖRÜNTÜLEME</span>
                                                        <span className="text-xs font-black text-white">{cv.metadata?.viewCount || 0}</span>
                                                    </div>
                                                    <div className="w-px h-6 bg-white/5"></div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase">İNDİRME</span>
                                                        <span className="text-xs font-black text-white">{cv.metadata?.downloadCount || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                                                        style={{ width: `${cv.metadata?.completeness || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-[9px] text-gray-500 font-bold uppercase">Doluluk: %{cv.metadata?.completeness || 0}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {cv.isPublic ? (
                                                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                                    YAYINDA
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                                                    TASLAK
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-300 font-medium">
                                                    {new Date(cv.createdAt).toLocaleDateString('tr-TR')}
                                                </span>
                                                <span className="text-[10px] text-gray-600">
                                                    {new Date(cv.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Link
                                                    to={cv.isPublic ? `/cv/${cv.publicUrl}` : '#'}
                                                    target="_blank"
                                                    className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-lg shadow-cyan-500/10"
                                                    title="Görüntüle"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(cv.id)}
                                                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                                                    title="Sistemden Kaldır"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredCVs.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-500 italic text-sm">
                            <Search className="w-10 h-10 mb-2 opacity-20" />
                            Arama kriterlerine uygun CV bulunamadı.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
