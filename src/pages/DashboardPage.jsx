import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCV } from '../context/CVContext'
import { FileText, Plus, Edit, Trash2, Copy, Download, Eye, LogOut, User, Crown, Calendar, Clock } from 'lucide-react'

export default function DashboardPage() {
    const { user, logout, isPremium } = useAuth()
    const { cvs, deleteCV, duplicateCV } = useCV()
    const navigate = useNavigate()
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const handleDelete = (cvId) => {
        deleteCV(cvId)
        setDeleteConfirm(null)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">CVify</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm hidden sm:block">{user?.name}</span>
                            {isPremium && (
                                <span className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 rounded-full">
                                    <Crown className="w-3 h-3" /> PRO
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:block">Çıkış</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Hoş geldin, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-400">CV'lerini buradan yönetebilirsin.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-card rounded-xl p-4">
                        <div className="text-2xl font-bold gradient-text">{cvs.length}</div>
                        <div className="text-gray-400 text-sm">Toplam CV</div>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400">{isPremium ? '20' : '1'}</div>
                        <div className="text-gray-400 text-sm">Şablon Erişimi</div>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                        <div className="text-2xl font-bold text-cyan-400">{isPremium ? '∞' : '3'}</div>
                        <div className="text-gray-400 text-sm">İndirme Hakkı</div>
                    </div>
                    <div className="glass-card rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-400">{isPremium ? 'Aktif' : 'Yok'}</div>
                        <div className="text-gray-400 text-sm">Premium</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Link to="/editor" className="btn-premium flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Yeni CV Oluştur
                    </Link>
                    {!isPremium && (
                        <Link to="/pricing" className="px-6 py-3 rounded-xl border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-2">
                            <Crown className="w-5 h-5" /> Pro'ya Yükselt
                        </Link>
                    )}
                </div>

                {/* CV List */}
                <div className="glass-card rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6">CV'lerim</h2>

                    {cvs.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Henüz CV'niz yok</h3>
                            <p className="text-gray-400 mb-6">İlk CV'nizi oluşturmak için başlayın!</p>
                            <Link to="/editor" className="btn-premium inline-flex items-center gap-2">
                                <Plus className="w-5 h-5" /> CV Oluştur
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cvs.map((cv) => (
                                <div key={cv.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold">{cv.name}</h3>
                                            <p className="text-sm text-gray-400 capitalize">{cv.template} Şablon</p>
                                        </div>
                                        <span className="text-2xl">{getTemplateEmoji(cv.template)}</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(cv.createdAt)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(cv.updatedAt)}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link
                                            to={`/editor/${cv.id}`}
                                            className="flex-1 py-2 text-center rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm flex items-center justify-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" /> Düzenle
                                        </Link>
                                        <button
                                            onClick={() => duplicateCV(cv.id)}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                            title="Kopyala"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(cv.id)}
                                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">CV'yi Sil</h3>
                        <p className="text-gray-400 mb-6">Bu CV'yi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                            >
                                Vazgeç
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition-colors"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function getTemplateEmoji(template) {
    const emojis = {
        modern: '🎨', minimalist: '⚡', corporate: '🏢', creative: '🌈', tech: '💻',
        executive: '👔', elegant: '✨', healthcare: '🏥', academic: '📚', finance: '💰',
        legal: '⚖️', marketing: '📢', engineer: '⚙️', retail: '🛍️', hospitality: '🏨',
        government: '🏛️', freelancer: '💼', startup: '🚀', international: '🌍', portfolio: '🖼️'
    }
    return emojis[template] || '📄'
}
