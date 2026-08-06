import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe2, Smartphone, Calendar, Eye, MapPin, MousePointer, Clock, Lock, Crown } from 'lucide-react';
import WorldMap from './Analytics/WorldMap';
import DeviceChart from './Analytics/DeviceChart';
import { getCVAnalytics } from '../services/AnalyticsService';

const AnalyticsModal = ({ isOpen, onClose, cv, isPremium }) => {
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
            // Fetch stats from local service
            const data = getCVAnalytics(cv.id);
            if (data) {
                // Mocking the structure expected by the rest of the component
                setStats({
                    totalViews: data.totalViews,
                    uniqueViews: data.totalViews > 0 ? Math.ceil(data.totalViews * 0.8) : 0, // Mock unique
                    locationStats: [
                        { country: 'Türkiye', city: 'İstanbul', count: data.totalViews }
                    ],
                    deviceStats: [
                        { type: 'Desktop', count: Math.ceil(data.totalViews * 0.7) },
                        { type: 'Mobile', count: Math.floor(data.totalViews * 0.3) }
                    ],
                    recentViews: data.totalViews > 0 ? [
                        { timestamp: data.lastViewed, city: 'İstanbul', country: 'Türkiye', deviceType: 'Desktop', browser: 'Chrome', os: 'Windows' }
                    ] : []
                });
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#0F1115] backdrop-blur-3xl border border-[#10B981]/20 rounded-[2rem] shadow-[0_0_50px_rgba(16,185,129,0.15)] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
                    
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#10B981]/10 to-transparent relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <Eye className="w-6 h-6 text-black" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    CV Analitiği {isPremium && <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />}
                                </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                <span className="text-white font-semibold">{cv?.name}</span> için detaylı görüntülenme raporu
                            </p>
                        </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
                            </div>
                        ) : !stats ? (
                            <div className="text-center py-20 text-gray-500 font-medium">
                                Veri bulunamadı.
                            </div>
                        ) : (
                            <div className="space-y-6 relative z-10">
                                {/* Key Metrics Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-colors">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-3 tracking-widest">
                                            <Eye className="w-4 h-4 text-[#10B981]" /> Toplam Görüntülenme
                                        </div>
                                        <div className="text-4xl font-black text-white">{stats.totalViews}</div>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-colors">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-3 tracking-widest">
                                            <MousePointer className="w-4 h-4 text-[#10B981]" /> Tekil Ziyaretçi
                                        </div>
                                        <div className="text-4xl font-black text-white">{stats.uniqueViews}</div>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-colors">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-3 tracking-widest">
                                            <MapPin className="w-4 h-4 text-[#10B981]" /> Ülke / Şehir
                                        </div>
                                        <div className="text-xl font-bold text-white truncate">
                                            {stats.locationStats[0]?.country || 'Veri Yok'}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500 mt-1">{stats.locationStats[0]?.city}</div>
                                    </div>
                                    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-colors">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-3 tracking-widest">
                                            <Clock className="w-4 h-4 text-[#10B981]" /> Ortalama Süre
                                        </div>
                                        <div className="text-4xl font-black text-white">
                                            0m 45s
                                        </div>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-6 relative">
                                    {/* World Map Section */}
                                    <div className="lg:col-span-2 bg-black/40 p-6 rounded-3xl border border-white/5 relative overflow-hidden">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                            <Globe2 className="w-5 h-5 text-[#10B981]" /> Coğrafi Dağılım
                                        </h3>
                                        <div className={!isPremium ? 'blur-md opacity-50 select-none' : ''}>
                                            <WorldMap data={stats.locationStats} />
                                        </div>
                                        
                                        {!isPremium && (
                                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                                <Lock className="w-10 h-10 text-amber-500 mb-3 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                                <div className="text-white font-black text-xl mb-2">Premium Özellik</div>
                                                <p className="text-gray-300 text-sm font-medium text-center px-6">Detaylı coğrafi dağılımı görmek için Pro'ya geçin.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Device & OS Stats */}
                                    <div className="space-y-6 relative">
                                        <div className="bg-black/40 p-6 rounded-3xl border border-white/5 h-full relative overflow-hidden">
                                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                                <Smartphone className="w-5 h-5 text-[#10B981]" /> Cihazlar
                                            </h3>
                                            <div className={!isPremium ? 'blur-md opacity-50 select-none' : ''}>
                                                <DeviceChart data={stats.deviceStats} />
                                            </div>
                                            
                                            {!isPremium && (
                                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                                    <Lock className="w-10 h-10 text-amber-500 mb-3 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                                    <div className="text-white font-black text-xl mb-2">Premium Özellik</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Log Table */}
                                <div className="bg-black/40 rounded-3xl border border-white/5 overflow-hidden relative">
                                    <div className="p-6 border-b border-white/5">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-[#10B981]" /> Son Aktiviteler
                                        </h3>
                                    </div>
                                    <div className={`overflow-x-auto ${!isPremium ? 'blur-md opacity-50 select-none' : ''}`}>
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
                                                    <tr key={i} className="hover:bg-[#10B981]/5 transition-colors group">
                                                        <td className="p-4 group-hover:text-white transition-colors">
                                                            {new Date(view.timestamp).toLocaleString('tr-TR')}
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                                                                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                                                {view.city}, {view.country}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 capitalize group-hover:text-white transition-colors">{view.deviceType}</td>
                                                        <td className="p-4 group-hover:text-white transition-colors">{view.browser} on {view.os}</td>
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
                                    
                                    {!isPremium && (
                                        <div className="absolute inset-0 top-[72px] z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                                            <Lock className="w-10 h-10 text-amber-500 mb-3 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                            <div className="text-white font-black text-xl mb-2">Premium Özellik</div>
                                            <p className="text-gray-300 text-sm font-medium text-center px-6">Ziyaretçi geçmişi detaylarını görmek için Pro'ya geçin.</p>
                                        </div>
                                    )}
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
