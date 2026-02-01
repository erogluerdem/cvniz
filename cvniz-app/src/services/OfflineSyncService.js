/**
 * Offline Sync Service
 * Handles offline data persistence and sync
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';

class OfflineSyncService {
    constructor() {
        this.syncQueue = [];
        this.isSyncing = false;
        this.syncListeners = [];
        this.isOnline = true;
        this.pendingOperations = new Map();
        this.conflictResolver = null;
    }

    /**
     * Initialize offline sync service
     */
    async initialize() {
        try {
            // Load sync queue from storage
            const queue = await AsyncStorage.getItem('sync_queue');
            if (queue) {
                this.syncQueue = JSON.parse(queue);
            }

            // Monitor network connectivity
            NetInfo.addEventListener(state => {
                this.handleConnectivityChange(state);
            });

            console.log('✅ Offline Sync Service initialized');
        } catch (error) {
            console.error('❌ Init error:', error);
            Sentry.captureException(error);
        }
    }

    /**
     * Handle network connectivity changes
     */
    async handleConnectivityChange(state) {
        const wasOnline = this.isOnline;
        this.isOnline = state.isConnected && state.isInternetReachable;

        // If came online, start syncing
        if (!wasOnline && this.isOnline) {
            console.log('🔄 Network restored, starting sync...');
            this.notifyListeners('online');
            await this.startSync();
        } else if (wasOnline && !this.isOnline) {
            console.log('📴 Network lost, entering offline mode');
            this.notifyListeners('offline');
        }
    }

    /**
     * Check if app is online
     */
    isAppOnline() {
        return this.isOnline;
    }

    /**
     * Queue operation for sync
     */
    async queueOperation(operation) {
        const {
            id = this._generateId(),
            type, // 'create', 'update', 'delete'
            resource, // 'cv', 'application', 'profile'
            resourceId,
            data,
            priority = 'normal', // 'high', 'normal', 'low'
            retries = 0,
            createdAt = Date.now()
        } = operation;

        const op = {
            id,
            type,
            resource,
            resourceId,
            data,
            priority,
            retries,
            createdAt,
            status: 'pending'
        };

        try {
            // Store in pending map for quick access
            this.pendingOperations.set(id, op);

            // Add to queue
            this.syncQueue.push(op);

            // Sort by priority
            this._sortQueue();

            // Persist to storage
            await AsyncStorage.setItem(
                'sync_queue',
                JSON.stringify(this.syncQueue)
            );

            console.log(`📋 Operation queued: ${type} ${resource}#${resourceId}`);

            // Try to sync immediately if online
            if (this.isOnline) {
                await this.startSync();
            }

            return id;
        } catch (error) {
            console.error('Queue operation error:', error);
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Start syncing operations
     */
    async startSync() {
        if (this.isSyncing || !this.isOnline) {
            return;
        }

        this.isSyncing = true;
        this.notifyListeners('sync_start');

        try {
            let synced = 0;
            let failed = 0;

            while (this.syncQueue.length > 0) {
                if (!this.isOnline) {
                    console.log('Lost network during sync');
                    break;
                }

                const operation = this.syncQueue[0];

                try {
                    await this._executeSyncOperation(operation);
                    this.syncQueue.shift();
                    this.pendingOperations.delete(operation.id);
                    synced++;

                    // Persist updated queue
                    await AsyncStorage.setItem(
                        'sync_queue',
                        JSON.stringify(this.syncQueue)
                    );

                    this.notifyListeners('sync_progress', {
                        total: this.syncQueue.length + synced,
                        synced,
                        failed
                    });
                } catch (error) {
                    operation.retries++;

                    // Max retries
                    if (operation.retries > 3) {
                        console.error(`❌ Max retries exceeded for operation ${operation.id}`);
                        this.syncQueue.shift();
                        failed++;

                        // Notify about failure
                        this.notifyListeners('sync_failed', {
                            operation,
                            error: error.message
                        });
                    } else {
                        // Exponential backoff
                        const delay = Math.pow(2, operation.retries) * 1000;
                        console.log(`⏳ Retrying operation ${operation.id} in ${delay}ms`);
                        await this._sleep(delay);
                    }

                    // Save retry count
                    await AsyncStorage.setItem(
                        'sync_queue',
                        JSON.stringify(this.syncQueue)
                    );
                }
            }

            this.notifyListeners('sync_complete', {
                synced,
                failed
            });

            console.log(`✅ Sync complete: ${synced} synced, ${failed} failed`);
        } catch (error) {
            console.error('Sync error:', error);
            Sentry.captureException(error);
            this.notifyListeners('sync_error', { error: error.message });
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Execute single sync operation
     */
    async _executeSyncOperation(operation) {
        const { type, resource, resourceId, data } = operation;

        // Make API call based on operation type
        let response;
        switch (type) {
            case 'create':
                response = await this._apiCall(`POST /api/${resource}s`, data);
                break;
            case 'update':
                response = await this._apiCall(`PUT /api/${resource}s/${resourceId}`, data);
                break;
            case 'delete':
                response = await this._apiCall(`DELETE /api/${resource}s/${resourceId}`);
                break;
            default:
                throw new Error(`Unknown operation type: ${type}`);
        }

        // Check for conflicts
        if (response.conflict) {
            if (this.conflictResolver) {
                const resolved = await this.conflictResolver(operation, response);
                if (!resolved) {
                    throw new Error('Conflict resolution failed');
                }
            }
        }

        return response;
    }

    /**
     * API call wrapper (use actual axios/fetch)
     */
    async _apiCall(method, data) {
        // This should use your actual API client
        // For now, returning mock response
        return { success: true };
    }

    /**
     * Store local data (cache)
     */
    async saveLocalData(key, data, ttl = 86400000) {
        try {
            const stored = {
                data,
                timestamp: Date.now(),
                ttl
            };

            await AsyncStorage.setItem(
                `local:${key}`,
                JSON.stringify(stored)
            );

            console.log(`💾 Local data saved: ${key}`);
        } catch (error) {
            console.error('Save local data error:', error);
        }
    }

    /**
     * Get local data (cache)
     */
    async getLocalData(key) {
        try {
            const stored = await AsyncStorage.getItem(`local:${key}`);

            if (!stored) {
                return null;
            }

            const parsed = JSON.parse(stored);
            const age = Date.now() - parsed.timestamp;

            // Check if expired
            if (age > parsed.ttl) {
                await AsyncStorage.removeItem(`local:${key}`);
                return null;
            }

            console.log(`📂 Local data retrieved: ${key}`);
            return parsed.data;
        } catch (error) {
            console.error('Get local data error:', error);
            return null;
        }
    }

    /**
     * Clear all local data
     */
    async clearLocalData() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const localKeys = keys.filter(k => k.startsWith('local:'));
            await AsyncStorage.multiRemove(localKeys);

            console.log(`🗑️ Cleared ${localKeys.length} local cache items`);
        } catch (error) {
            console.error('Clear local data error:', error);
        }
    }

    /**
     * Get pending operations
     */
    getPendingOperations() {
        return Array.from(this.pendingOperations.values());
    }

    /**
     * Cancel operation
     */
    async cancelOperation(operationId) {
        try {
            this.syncQueue = this.syncQueue.filter(op => op.id !== operationId);
            this.pendingOperations.delete(operationId);

            await AsyncStorage.setItem(
                'sync_queue',
                JSON.stringify(this.syncQueue)
            );

            console.log(`❌ Operation cancelled: ${operationId}`);
        } catch (error) {
            console.error('Cancel operation error:', error);
        }
    }

    /**
     * Set conflict resolver
     */
    setConflictResolver(resolver) {
        this.conflictResolver = resolver;
    }

    /**
     * Subscribe to sync events
     */
    onSyncEvent(listener) {
        this.syncListeners.push(listener);
        return () => {
            this.syncListeners = this.syncListeners.filter(l => l !== listener);
        };
    }

    /**
     * Notify listeners
     */
    notifyListeners(event, data) {
        this.syncListeners.forEach(listener => {
            listener({ event, data });
        });
    }

    /**
     * Get sync statistics
     */
    getStats() {
        return {
            isOnline: this.isOnline,
            isSyncing: this.isSyncing,
            queueLength: this.syncQueue.length,
            pending: this.getPendingOperations(),
            queueBreakdown: {
                create: this.syncQueue.filter(op => op.type === 'create').length,
                update: this.syncQueue.filter(op => op.type === 'update').length,
                delete: this.syncQueue.filter(op => op.type === 'delete').length
            }
        };
    }

    // Helper methods
    _generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    _sortQueue() {
        const priorityMap = { high: 0, normal: 1, low: 2 };
        this.syncQueue.sort((a, b) => {
            return priorityMap[a.priority] - priorityMap[b.priority];
        });
    }
}

export default new OfflineSyncService();
