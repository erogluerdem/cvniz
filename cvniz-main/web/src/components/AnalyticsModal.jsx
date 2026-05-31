import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe2, Smartphone, Calendar, Eye, MapPin, MousePointer, Clock } from 'lucide-react';
import WorldMap from './Analytics/WorldMap';
import DeviceChart from './Analytics/DeviceChart';
import { analyticsAPI } from '../services/api';

const AnalyticsModal = ({ isOpen, onClose, cv }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (isOpen && cv) {
            fetchStats();
        }
    }, [isOpen, cv]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch stats from backend
            const response = await analyticsAPI.getStats(cv.id);
            if (response.success) {
                setStats(response.analytics);
            }
        } catch (error) {
            console.error('Failed to fetch analytics', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Eye className="w-6 h-6 text-cyan-400" />
                                CV Analitiği
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                <span className="text-white font-semibold">{cv?.name}</span> için detaylı görüntülenme raporu
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                            </div>
                        ) : !stats ? (
                            <div className="text-center py-20 text-slate-500">
                                Veri bulunamadı.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Key Metrics Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                                            <Eye className="w-4 h-4" /> Toplam Görüntülenme
                                        </div>
                                        <div className="text-3xl font-black text-white">{stats.totalViews}</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                                            <MousePointer className="w-4 h-4" /> Tekil Ziyaretçi
                                        </div>
                                        <div className="text-3xl font-black text-cyan-400">{stats.uniqueViews}</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                                            <MapPin className="w-4 h-4" /> Ülke / Şehir
                                        </div>
                                        <div className="text-xl font-bold text-white truncate">
                                            {stats.locationStats[0]?.country || 'Veri Yok'}
                                        </div>
                                        <div className="text-xs text-slate-500">{stats.locationStats[0]?.city}</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                                            <Clock className="w-4 h-4" /> Ortalama Süre
                                        </div>
                                        <div className="text-3xl font-black text-purple-400">
                                            {/* Placeholder for duration if implemented */}
                                            0m 45s
                                        </div>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-6">
                                    {/* World Map Section */}
                                    <div className="lg:col-span-2 bg-white/5 p-6 rounded-3xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <Globe2 className="w-5 h-5 text-cyan-400" /> Coğrafi Dağılım
                                        </h3>
                                        <WorldMap data={stats.locationStats} />
                                    </div>

                                    {/* Device & OS Stats */}
                                    <div className="space-y-6">
                                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5 h-full">
                                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                                <Smartphone className="w-5 h-5 text-purple-400" /> Cihazlar
                                            </h3>
                                            <DeviceChart data={stats.deviceStats} />
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Log Table */}
                                <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
                                    <div className="p-6 border-b border-white/5">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-amber-400" /> Son Aktiviteler
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm text-slate-400">
                                            <thead className="bg-white/5 text-slate-200 uppercase text-xs font-bold">
                                                <tr>
                                                    <th className="p-4">Tarih</th>
                                                    <th className="p-4">Konum</th>
                                                    <th className="p-4">Cihaz</th>
                                                    <th className="p-4">Tarayıcı</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {stats.recentViews.map((view, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        <td className="p-4">
                                                            {new Date(view.timestamp).toLocaleString('tr-TR')}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                                                                {view.city}, {view.country}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 capitalize">{view.deviceType}</td>
                                                        <td className="p-4">{view.browser} on {view.os}</td>
                                                    </tr>
                                                ))}
                                                {stats.recentViews.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="p-8 text-center text-slate-500">
                                                            Henüz görüntülenme yok.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AnalyticsModal;
