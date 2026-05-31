import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const ABTestDashboard = () => {
    const [experiments, setExperiments] = useState([]);
    const [selectedExp, setSelectedExp] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actioning, setActioning] = useState({});

    useEffect(() => {
        fetchExperiments();
    }, []);

    const fetchExperiments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/experiments/ab-tests');
            if (response.data.success) {
                setExperiments(response.data.experiments || []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchResults = async (experimentId) => {
        try {
            const response = await api.get(`/experiments/ab-test/${experimentId}/results`);
            if (response.data.success) {
                setResults(response.data);
                setSelectedExp(experimentId);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStartExperiment = async (expId) => {
        setActioning(prev => ({ ...prev, [expId]: 'starting' }));
        try {
            await api.post(`/experiments/ab-tests/${expId}/start`);
            fetchExperiments();
        } catch (err) {
            setError(err.message);
        } finally {
            setActioning(prev => ({ ...prev, [expId]: null }));
        }
    };

    const handleConcludeExperiment = async (expId) => {
        setActioning(prev => ({ ...prev, [expId]: 'concluding' }));
        try {
            const response = await api.post(`/experiments/ab-tests/${expId}/conclude`);
            fetchExperiments();
            if (selectedExp === expId) {
                setResults(null);
                setSelectedExp(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setActioning(prev => ({ ...prev, [expId]: null }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    📊 A/B Test Gösterge Paneli
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Deneme sonuçlarını ve istatistiksel önem analizi yapın
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Experiment List */}
                <motion.div
                    className="lg:col-span-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Deneyler
                            </h3>
                        </div>

                        <div className="max-h-[600px] overflow-y-auto">
                            {experiments.map((exp) => (
                                <motion.button
                                    key={exp.id}
                                    onClick={() => fetchResults(exp.id)}
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
                                    className={`w-full text-left px-4 py-3 border-b border-gray-200 dark:border-gray-700 transition-colors ${
                                        selectedExp === exp.id
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                {exp.name}
                                            </p>
                                            <p className={`text-xs mt-1 px-2 py-1 rounded-full w-fit ${
                                                exp.status === 'active'
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                                                    : exp.status === 'concluded'
                                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                            }`}>
                                                {exp.status}
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results View */}
                {results && (
                    <motion.div
                        className="lg:col-span-2 space-y-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {/* Variant Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(results.variants || {}).map(([variantKey, variant], idx) => {
                                const variantResults = results.results?.[variantKey];
                                const conversionRate = variantResults
                                    ? ((variantResults.conversions / variantResults.total) * 100).toFixed(2)
                                    : 0;

                                return (
                                    <motion.div
                                        key={variantKey}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {variant.name}
                                            </h4>
                                            <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                                {variant.weight}%
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Katılımcı</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {variantResults?.total || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Dönüşüm</span>
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    {variantResults?.conversions || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Oran</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {conversionRate}%
                                                </span>
                                            </div>
                                            {variantResults?.engagement && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Katılım</span>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {variantResults.engagement.toFixed(0)}ms
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Statistical Significance */}
                        {results.significance && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                            >
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    📈 İstatistiksel Anlamlılık
                                </h4>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Güven Seviyesi</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-green-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${results.significance.confidence}%` }}
                                                    transition={{ duration: 1 }}
                                                />
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {results.significance.confidence?.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Z-Puan</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {results.significance.zScore?.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">İyileşme</span>
                                        <span className={`font-semibold ${
                                            (results.significance.improvement || 0) > 0
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400'
                                        }`}>
                                            {results.significance.improvement?.toFixed(2)}%
                                        </span>
                                    </div>

                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {results.significance.isSignificant
                                                ? '✅ İstatistiksel olarak anlamlı'
                                                : '⏳ Henüz yeterli veri yok'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {results?.status === 'draft' && (
                                <button
                                    onClick={() => handleStartExperiment(results.id)}
                                    disabled={actioning[results.id]}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {actioning[results.id] === 'starting' ? 'Başlatılıyor...' : '▶ Başlat'}
                                </button>
                            )}
                            {results?.status === 'active' && (
                                <button
                                    onClick={() => handleConcludeExperiment(results.id)}
                                    disabled={actioning[results.id]}
                                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {actioning[results.id] === 'concluding' ? 'Sonlandırılıyor...' : '⏹ Sonlandır'}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            {experiments.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                        Hiç A/B test deneyimi yok
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default ABTestDashboard;
