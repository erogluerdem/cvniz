import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, TrendingUp, Calendar } from 'lucide-react';
import { getCVAnalytics, getChartData } from '../services/AnalyticsService';

export default function CVAnalyticsDashboard({ cvId }) {
    const [analytics, setAnalytics] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (cvId) {
            const data = getCVAnalytics(cvId);
            setAnalytics(data);
            setChartData(getChartData(cvId));
        }
    }, [cvId]);

    if (!analytics) return null;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        CV Performansı (Canlı)
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Paylaştığınız CV bağlantısının istatistikleri
                    </p>
                </div>
                <div className="bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20 text-center">
                    <p className="text-xs font-semibold text-cyan-500 uppercase tracking-wider mb-1">Toplam Görüntülenme</p>
                    <div className="text-3xl font-black text-white flex items-center justify-center gap-2">
                        <Eye className="w-5 h-5 text-cyan-400" />
                        {analytics.totalViews}
                    </div>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line 
                            type="monotone" 
                            dataKey="views" 
                            stroke="#06b6d4" 
                            strokeWidth={3}
                            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        />
                        <CartesianGrid stroke="#ffffff10" strokeDasharray="5 5" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            stroke="#94a3b8" 
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="#94a3b8" 
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ color: '#06b6d4', fontWeight: 'bold' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Son 7 günün verileri gösterilmektedir.</span>
            </div>
        </div>
    );
}
