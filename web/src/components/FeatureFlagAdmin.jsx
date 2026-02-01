import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const FeatureFlagAdmin = () => {
    const [flags, setFlags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState({});

    useEffect(() => {
        fetchFlags();
    }, []);

    const fetchFlags = async () => {
        try {
            setLoading(true);
            const response = await api.get('/experiments/flags');
            if (response.data.success) {
                setFlags(response.data.flags);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (flagName, currentStatus) => {
        setUpdating(prev => ({ ...prev, [flagName]: true }));
        try {
            const response = await api.put(`/experiments/flags/${flagName}`, {
                enabled: !currentStatus
            });
            if (response.data.success) {
                setFlags(prev =>
                    prev.map(f =>
                        f.name === flagName
                            ? { ...f, enabled: !currentStatus }
                            : f
                    )
                );
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(prev => ({ ...prev, [flagName]: false }));
        }
    };

    const handleRolloutChange = async (flagName, percentage) => {
        setUpdating(prev => ({ ...prev, [`${flagName}-rollout`]: true }));
        try {
            const response = await api.post(`/experiments/flags/${flagName}/rollout`, {
                percentage: parseInt(percentage)
            });
            if (response.data.success) {
                setFlags(prev =>
                    prev.map(f =>
                        f.name === flagName
                            ? { ...f, rollout: parseInt(percentage) }
                            : f
                    )
                );
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(prev => ({ ...prev, [`${flagName}-rollout`]: false }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    🚀 Özellik Bayrakları
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Özellikleri yönetin ve kullanıcılara kademeli olarak dağıtın
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            <div className="grid gap-4">
                {flags.map((flag) => (
                    <motion.div
                        key={flag.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {flag.name.replace(/_/g, ' ')}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {flag.description}
                                </p>
                            </div>
                            <button
                                onClick={() => handleToggle(flag.name, flag.enabled)}
                                disabled={updating[flag.name]}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                                    flag.enabled
                                        ? 'bg-green-500'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                } ${updating[flag.name] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <motion.span
                                    layout
                                    className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
                                    animate={{
                                        x: flag.enabled ? 28 : 4
                                    }}
                                />
                            </button>
                        </div>

                        {flag.enabled && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 space-y-3"
                            >
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Dağıtım Yüzdesi
                                        </label>
                                        <span className="text-sm font-semibold text-primary">
                                            {flag.rollout}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={flag.rollout}
                                        onChange={(e) => handleRolloutChange(flag.name, e.target.value)}
                                        disabled={updating[`${flag.name}-rollout`]}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        <span>%0 (Kapalı)</span>
                                        <span>%50 (Pilot)</span>
                                        <span>%100 (Tam Açık)</span>
                                    </div>
                                </div>

                                {flag.stats && (
                                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Etkinleştirmeler</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {flag.stats.enabled || 0}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Kullanıcılar</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {flag.stats.users || 0}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Aktivasyon</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {flag.stats.activation || '0%'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {flags.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                        Hiç özellik bayrağı yok
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default FeatureFlagAdmin;
