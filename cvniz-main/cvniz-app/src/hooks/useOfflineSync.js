import { useState, useEffect, useCallback } from 'react';
import OfflineSyncService from '../services/OfflineSyncService';

/**
 * Hook for offline sync management
 */
export const useOfflineSync = () => {
    const [isOnline, setIsOnline] = useState(OfflineSyncService.isAppOnline());
    const [isSyncing, setIsSyncing] = useState(false);
    const [stats, setStats] = useState(OfflineSyncService.getStats());
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        // Initialize service
        OfflineSyncService.initialize();

        // Subscribe to sync events
        const unsubscribe = OfflineSyncService.onSyncEvent(({ event, data }) => {
            switch (event) {
                case 'online':
                    setIsOnline(true);
                    setSyncError(null);
                    break;
                case 'offline':
                    setIsOnline(false);
                    break;
                case 'sync_start':
                    setIsSyncing(true);
                    setSyncError(null);
                    break;
                case 'sync_complete':
                    setIsSyncing(false);
                    setStats(OfflineSyncService.getStats());
                    break;
                case 'sync_error':
                    setSyncError(data.error);
                    break;
                case 'sync_failed':
                    setSyncError(`Failed to sync: ${data.error}`);
                    break;
                case 'sync_progress':
                    setStats(prev => ({
                        ...prev,
                        synced: data.synced
                    }));
                    break;
            }
        });

        return () => unsubscribe();
    }, []);

    // Queue operation
    const queueOperation = useCallback(async (operation) => {
        try {
            const id = await OfflineSyncService.queueOperation(operation);
            return id;
        } catch (error) {
            setSyncError(error.message);
            throw error;
        }
    }, []);

    // Force sync
    const forceSync = useCallback(async () => {
        try {
            setSyncError(null);
            await OfflineSyncService.startSync();
        } catch (error) {
            setSyncError(error.message);
        }
    }, []);

    // Save local data
    const saveLocal = useCallback(async (key, data, ttl) => {
        try {
            await OfflineSyncService.saveLocalData(key, data, ttl);
        } catch (error) {
            setSyncError(error.message);
            throw error;
        }
    }, []);

    // Get local data
    const getLocal = useCallback(async (key) => {
        try {
            return await OfflineSyncService.getLocalData(key);
        } catch (error) {
            setSyncError(error.message);
            return null;
        }
    }, []);

    // Cancel operation
    const cancelOperation = useCallback(async (operationId) => {
        try {
            await OfflineSyncService.cancelOperation(operationId);
            setStats(OfflineSyncService.getStats());
        } catch (error) {
            setSyncError(error.message);
        }
    }, []);

    // Clear all local data
    const clearLocal = useCallback(async () => {
        try {
            await OfflineSyncService.clearLocalData();
        } catch (error) {
            setSyncError(error.message);
        }
    }, []);

    return {
        isOnline,
        isSyncing,
        stats,
        syncError,
        queueOperation,
        forceSync,
        saveLocal,
        getLocal,
        cancelOperation,
        clearLocal,
        pending: stats.pending || [],
        queueLength: stats.queueLength || 0
    };
};

/**
 * Hook for operations that need offline support
 */
export const useOfflineOperation = (operation) => {
    const { queueOperation, isOnline } = useOfflineSync();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (data) => {
        try {
            setLoading(true);
            setError(null);

            // Queue the operation
            const operationId = await queueOperation({
                ...operation,
                data
            });

            return operationId;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [operation, queueOperation]);

    return {
        execute,
        loading,
        error,
        isOnline
    };
};

/**
 * Hook for local data fetching with offline fallback
 */
export const useOfflineData = (key, fetchFn, options = {}) => {
    const { saveLocal, getLocal } = useOfflineSync();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        ttl = 3600000, // 1 hour default
        refetch = false
    } = options;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Try local first
                let localData = await getLocal(key);

                if (!refetch && localData) {
                    setData(localData);
                    setLoading(false);
                    return;
                }

                // Fetch fresh data
                try {
                    const freshData = await fetchFn();
                    setData(freshData);
                    
                    // Save to local
                    await saveLocal(key, freshData, ttl);
                } catch (fetchError) {
                    // Fall back to local if fetch fails
                    if (localData) {
                        console.warn('Using cached data due to fetch error');
                        setData(localData);
                    } else {
                        throw fetchError;
                    }
                }

                setError(null);
            } catch (err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [key, refetch]);

    return { data, loading, error };
};
