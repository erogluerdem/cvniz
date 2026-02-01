import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';

const PerformanceMonitor = () => {
    const [metrics, setMetrics] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/monitoring/performance');
                if (response.data.success) {
                    setMetrics(response.data.metrics);
                    
                    // Add to history
                    setHistory(prev => [
                        ...prev.slice(-59), // Keep last 60 data points
                        {
                            time: new Date().toLocaleTimeString(),
                            responseTime: response.data.metrics.avgResponseTime,
                            cacheHit: response.data.metrics.cacheHitRate,
                            dbTime: response.data.metrics.dbQueryTime,
                            bundelSize: response.data.metrics.bundleSize
                        }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 10000); // Every 10s

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const MetricCard = ({ title, value, unit, trend, target, status }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-600 dark:text-gray-400 text-sm">
                    {title}
                </h4>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    status === 'good' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                    status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                    {status.toUpperCase()}
                </span>
            </div>

            <div className="mb-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                    <span className="text-sm text-gray-500 ml-1">{unit}</span>
                </p>
            </div>

            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>Target: {target}{unit}</span>
                <span className={trend > 0 ? 'text-red-500' : 'text-green-500'}>
                    {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                </span>
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    ⚡ Performans Monitörü
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Sistem performans metrikleri ve optimizasyon durumu
                </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Ortalama Response"
                    value={metrics?.avgResponseTime}
                    unit="ms"
                    trend={-5}
                    target="100"
                    status={metrics?.avgResponseTime < 100 ? 'good' : metrics?.avgResponseTime < 200 ? 'warning' : 'critical'}
                />
                <MetricCard
                    title="Cache Hit Rate"
                    value={metrics?.cacheHitRate}
                    unit="%"
                    trend={8}
                    target="70"
                    status={metrics?.cacheHitRate > 70 ? 'good' : metrics?.cacheHitRate > 50 ? 'warning' : 'critical'}
                />
                <MetricCard
                    title="DB Query Süresi"
                    value={metrics?.dbQueryTime}
                    unit="ms"
                    trend={-3}
                    target="30"
                    status={metrics?.dbQueryTime < 50 ? 'good' : metrics?.dbQueryTime < 100 ? 'warning' : 'critical'}
                />
                <MetricCard
                    title="Bundle Size"
                    value={metrics?.bundleSize}
                    unit="KB"
                    trend={-2}
                    target="600"
                    status={metrics?.bundleSize < 650 ? 'good' : metrics?.bundleSize < 800 ? 'warning' : 'critical'}
                />
            </div>

            {/* Response Time Trend */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Response Time (son 60 dakika)
                </h3>
                {history.length > 0 && (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="time" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1f2937',
                                    border: 'none',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="responseTime" 
                                stroke="#3b82f6" 
                                dot={false}
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </motion.div>

            {/* Cache vs DB Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        💾 Cache Hit Rate
                    </h3>
                    {history.length > 0 && (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="time" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Bar 
                                    dataKey="cacheHit" 
                                    fill="#10b981"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        🗄️ Database Performance
                    </h3>
                    {history.length > 0 && (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="time" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Line 
                                    type="monotone" 
                                    dataKey="dbTime" 
                                    stroke="#f59e0b"
                                    dot={false}
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </motion.div>
            </div>

            {/* Optimization Checklist */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    ✅ Optimizasyon Durumu
                </h3>

                <div className="space-y-3">
                    <OptimizationItem 
                        name="Response Caching"
                        status="active"
                        hitRate={metrics?.cacheHitRate}
                    />
                    <OptimizationItem 
                        name="Database Indexes"
                        status="active"
                        value={`${metrics?.indexUsageRate || 85}%`}
                    />
                    <OptimizationItem 
                        name="Code Splitting"
                        status="active"
                        value="5 chunks"
                    />
                    <OptimizationItem 
                        name="Image Optimization"
                        status="active"
                        value="WebP + Lazy"
                    />
                    <OptimizationItem 
                        name="Bundle Minification"
                        status="active"
                        value="Terser"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

const OptimizationItem = ({ name, status, hitRate, value }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
                status === 'active' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
                {name}
            </span>
        </div>
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {hitRate ? `${hitRate}% hit` : value}
        </span>
    </div>
);

export default PerformanceMonitor;
