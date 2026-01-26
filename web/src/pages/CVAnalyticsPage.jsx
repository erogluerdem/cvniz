import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft, Eye, Users, MapPin, Monitor, Smartphone,
    Globe, TrendingUp, Calendar, Clock, RefreshCw
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export default function CVAnalyticsPage() {
    const { cvId } = useParams()
    const navigate = useNavigate()
    const { token } = useAuth()
    const [analytics, setAnalytics] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (token) {
            fetchAnalytics()
        }
    }, [cvId, token])

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_URL}/analytics/stats/${cvId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Analitik verileri alınamadı')
            }

            const data = await response.json()
            setAnalytics(data.analytics)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg"
                    >
                        Dashboard'a Dön
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">CV Analitikleri</h1>
                            <p className="text-gray-500 text-sm">Görüntüleme istatistikleri</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchAnalytics}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Yenile
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Toplam Görüntüleme"
                        value={analytics?.totalViews || 0}
                        icon={<Eye className="w-5 h-5" />}
                        color="cyan"
                    />
                    <StatCard
                        title="Benzersiz Görüntüleme"
                        value={analytics?.uniqueViews || 0}
                        icon={<Users className="w-5 h-5" />}
                        color="blue"
                    />
                    <StatCard
                        title="Masaüstü"
                        value={analytics?.deviceStats?.desktop || 0}
                        icon={<Monitor className="w-5 h-5" />}
                        color="purple"
                    />
                    <StatCard
                        title="Mobil"
                        value={analytics?.deviceStats?.mobile || 0}
                        icon={<Smartphone className="w-5 h-5" />}
                        color="pink"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Location Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Konum Dağılımı</h2>
                        </div>

                        {analytics?.locationStats?.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.locationStats.map((loc, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-gray-500" />
                                            <span className="text-white">{loc._id || 'Bilinmiyor'}</span>
                                            {loc.country && (
                                                <span className="text-gray-500 text-sm">({loc.country})</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                                    style={{
                                                        width: `${(loc.count / (analytics?.totalViews || 1)) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-gray-400 text-sm w-8 text-right">{loc.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Henüz konum verisi yok</p>
                        )}
                    </motion.div>

                    {/* Daily Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Son 30 Gün</h2>
                        </div>

                        {analytics?.dailyStats?.length > 0 ? (
                            <div className="h-48 flex items-end gap-1">
                                {analytics.dailyStats.slice(-14).map((day, index) => {
                                    const maxCount = Math.max(...analytics.dailyStats.map(d => d.count))
                                    const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0

                                    return (
                                        <div
                                            key={index}
                                            className="flex-1 flex flex-col items-center gap-1"
                                        >
                                            <span className="text-xs text-gray-500">{day.count}</span>
                                            <div
                                                className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t"
                                                style={{ height: `${Math.max(height, 4)}%` }}
                                            />
                                            <span className="text-[10px] text-gray-600">
                                                {new Date(day._id).getDate()}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Henüz günlük veri yok</p>
                        )}
                    </motion.div>

                    {/* Recent Views */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Son Görüntülemeler</h2>
                        </div>

                        {analytics?.recentViews?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-500 text-sm border-b border-white/5">
                                            <th className="pb-3 font-medium">Tarih</th>
                                            <th className="pb-3 font-medium">Konum</th>
                                            <th className="pb-3 font-medium">Tarayıcı</th>
                                            <th className="pb-3 font-medium">İşletim Sistemi</th>
                                            <th className="pb-3 font-medium">Cihaz</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {analytics.recentViews.map((view, index) => (
                                            <tr key={index} className="text-sm">
                                                <td className="py-3 text-gray-400">
                                                    {formatDate(view.createdAt)}
                                                </td>
                                                <td className="py-3">
                                                    <span className="flex items-center gap-2 text-white">
                                                        <MapPin className="w-3 h-3 text-cyan-400" />
                                                        {view.location?.city || 'Bilinmiyor'}
                                                        {view.location?.country && (
                                                            <span className="text-gray-500">
                                                                , {view.location.country}
                                                            </span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-400">
                                                    {view.device?.browser || '-'}
                                                </td>
                                                <td className="py-3 text-gray-400">
                                                    {view.device?.os || '-'}
                                                </td>
                                                <td className="py-3">
                                                    {view.device?.isMobile ? (
                                                        <span className="flex items-center gap-1 text-pink-400">
                                                            <Smartphone className="w-3 h-3" />
                                                            Mobil
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-purple-400">
                                                            <Monitor className="w-3 h-3" />
                                                            Masaüstü
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Henüz görüntüleme yok</p>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    )
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
    const colors = {
        cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
        blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
        purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
        pink: 'from-pink-500/10 to-pink-500/5 border-pink-500/20 text-pink-400'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-6`}
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">{title}</span>
                {icon}
            </div>
            <p className="text-3xl font-bold text-white">{value.toLocaleString('tr-TR')}</p>
        </motion.div>
    )
}
