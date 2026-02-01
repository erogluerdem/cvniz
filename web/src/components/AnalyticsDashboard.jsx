import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Activity,
    TrendingUp,
    Users,
    Zap,
    AlertCircle,
    RefreshCw,
    Download,
    Calendar
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

/**
 * Analytics Dashboard Component
 * Real-time monitoring and metrics visualization
 */
export const AnalyticsDashboard = ({ adminOnly = true }) => {
    const {
        health,
        features,
        retention,
        performance,
        alerts,
        loading,
        error,
        getSystemHealth,
        getFeatureMetrics,
        getRetentionMetrics,
        getPerformanceMetrics,
        getAlerts
    } = useAnalytics();

    const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d
    const [selectedMetric, setSelectedMetric] = useState('overview');
    const [refreshInterval, setRefreshInterval] = useState(60); // seconds

    // Load data on mount and set refresh interval
    useEffect(() => {
        loadAllMetrics();

        // Set up auto-refresh
        const interval = setInterval(() => {
            loadAllMetrics();
        }, refreshInterval * 1000);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    const loadAllMetrics = async () => {
        try {
            await Promise.all([
                getSystemHealth(),
                getFeatureMetrics(),
                getRetentionMetrics(),
                getPerformanceMetrics(),
                getAlerts()
            ]);
        } catch (err) {
            console.error('Failed to load metrics:', err);
        }
    };

    // Sample data for charts (replace with real API data)
    const engagementTrendData = [
        { date: 'Jan 1', views: 1200, applies: 340, saves: 400 },
        { date: 'Jan 8', views: 1290, applies: 420, saves: 500 },
        { date: 'Jan 15', views: 1500, applies: 520, saves: 650 },
        { date: 'Jan 22', views: 1800, applies: 680, saves: 800 },
        { date: 'Jan 29', views: 2100, applies: 750, saves: 920 }
    ];

    const featureUsageData = [
        { name: 'AI Summary', value: 2400 },
        { name: 'Cover Letter', value: 1980 },
        { name: 'Interview Prep', value: 1500 },
        { name: 'Skill Gap', value: 1200 },
        { name: 'Recommendations', value: 980 }
    ];

    const apiPerformanceData = [
        { name: '/api/cv', avgTime: 145, errorRate: 0.5 },
        { name: '/api/jobs', avgTime: 234, errorRate: 1.2 },
        { name: '/api/ai', avgTime: 512, errorRate: 2.1 },
        { name: '/api/auth', avgTime: 89, errorRate: 0.1 }
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const StatCard = ({ icon: Icon, label, value, trend = null, color = 'blue' }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
                    <Icon size={24} />
                </div>
            </div>

            {trend && (
                <div className={`mt-4 flex items-center gap-2 text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp size={16} />
                    <span>{trend.value}% {trend.positive ? 'increase' : 'decrease'}</span>
                </div>
            )}
        </motion.div>
    );

    const AlertCard = ({ alert }) => (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`border-l-4 p-4 mb-3 rounded ${
                alert.severity === 'critical'
                    ? 'border-red-500 bg-red-50'
                    : alert.severity === 'warning'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-blue-500 bg-blue-50'
            }`}
        >
            <div className="flex items-start gap-3">
                <AlertCircle
                    size={20}
                    className={
                        alert.severity === 'critical'
                            ? 'text-red-600'
                            : alert.severity === 'warning'
                            ? 'text-amber-600'
                            : 'text-blue-600'
                    }
                />
                <div>
                    <h4 className="font-semibold text-gray-900">{alert.type}</h4>
                    <p className="text-gray-700 text-sm">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-1">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                        <p className="text-gray-600 mt-1">Real-time system metrics and user engagement</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={loadAllMetrics}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>

                        <select
                            value={refreshInterval}
                            onChange={(e) => setRefreshInterval(Number(e.target.value))}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium"
                        >
                            <option value={30}>Auto 30s</option>
                            <option value={60}>Auto 60s</option>
                            <option value={300}>Auto 5m</option>
                        </select>

                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors"
                        >
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Stat Cards */}
                {!loading && health && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Activity}
                            label="System Status"
                            value={health.status.toUpperCase()}
                            color="blue"
                        />
                        <StatCard
                            icon={Users}
                            label="Active Users"
                            value={retention?.activeUsers || 0}
                            trend={{ value: 12.5, positive: true }}
                            color="green"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Retention Rate"
                            value={`${retention?.retentionRate?.toFixed(1) || 0}%`}
                            trend={{ value: 5.2, positive: true }}
                            color="amber"
                        />
                        <StatCard
                            icon={Zap}
                            label="API Response"
                            value={`${health.components?.api?.avgResponseTime?.toFixed(0) || 0}ms`}
                            trend={{ value: 8.1, positive: false }}
                            color="purple"
                        />
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 flex gap-2 border-b border-gray-200 bg-white p-4 rounded-t-lg">
                    {['overview', 'engagement', 'performance', 'alerts'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedMetric(tab)}
                            className={`px-4 py-2 font-medium capitalize transition-colors ${
                                selectedMetric === tab
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {selectedMetric === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                            {/* Engagement Trend Chart */}
                            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Engagement Trend</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={engagementTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="views" stroke="#3b82f6" />
                                        <Line type="monotone" dataKey="applies" stroke="#10b981" />
                                        <Line type="monotone" dataKey="saves" stroke="#f59e0b" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Health Status */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">System Components</h3>
                                <div className="space-y-3">
                                    {health?.components && Object.entries(health.components).map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between">
                                            <span className="text-gray-600 capitalize">{key}</span>
                                            <span className={`px-3 py-1 rounded text-sm font-medium ${
                                                val.status === 'up'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {val.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Engagement Tab */}
                    {selectedMetric === 'engagement' && (
                        <motion.div
                            key="engagement"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            {/* Feature Usage Pie Chart */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Usage</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={featureUsageData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {featureUsageData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Top Features */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Features</h3>
                                <div className="space-y-3">
                                    {features?.features && Object.entries(features.features)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 5)
                                        .map(([name, value], idx) => (
                                            <div key={name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-8 h-8 rounded-full ${COLORS[idx % COLORS.length]} text-white flex items-center justify-center text-sm font-bold`}>
                                                        {idx + 1}
                                                    </span>
                                                    <span className="text-gray-700 capitalize">{name.replace(/_/g, ' ')}</span>
                                                </div>
                                                <span className="font-bold text-gray-900">{value}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Performance Tab */}
                    {selectedMetric === 'performance' && (
                        <motion.div
                            key="performance"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-lg border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">API Performance</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={apiPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="avgTime" fill="#3b82f6" name="Avg Response (ms)" />
                                </BarChart>
                            </ResponsiveContainer>

                            {/* Performance Table */}
                            <div className="mt-8 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Endpoint</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Avg Time</th>
                                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Error Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {apiPerformanceData.map((row) => (
                                            <tr key={row.name} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-900">{row.name}</td>
                                                <td className="px-4 py-3 text-right text-gray-700">{row.avgTime}ms</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`font-medium ${row.errorRate > 1 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {row.errorRate.toFixed(2)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Alerts Tab */}
                    {selectedMetric === 'alerts' && (
                        <motion.div
                            key="alerts"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-lg border border-gray-200 p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-900 mb-4">System Alerts</h3>
                            {alerts && alerts.length > 0 ? (
                                <div className="space-y-3">
                                    {alerts.map((alert) => (
                                        <AlertCard key={alert.id} alert={alert} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-600">No alerts at this time</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
