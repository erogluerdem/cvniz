const redis = require('redis');

let client;
let isConnected = false;
const memoryCache = new Map(); // Fallback cache

const CacheService = {
    async connect() {
        if (client) {return client;}

        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

        try {
            client = redis.createClient({
                url: redisUrl,
                socket: {
                    reconnectStrategy: (retries) => {
                        if (retries > 5) {
                            console.warn('⚠️ Redis bağlantı denemesi sınırı aşıldı, bellek cache kullananılacak');
                            return new Error('Redis bağlantı başarısız - bellek cache fallback modda');
                        }
                        return retries * 100;
                    }
                }
            });

            client.on('error', err => {
                console.warn('⚠️ Redis hata:', err.message);
                isConnected = false;
            });
            client.on('connect', () => {
                console.log('✅ Redis bağlantısı başarılı');
                isConnected = true;
            });
            client.on('ready', () => {
                isConnected = true;
            });

            await Promise.race([
                client.connect(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), 3000))
            ]);
            isConnected = true;
        } catch (err) {
            console.warn('⚠️ Redis bağlanılamadı, bellek cache kullanılacak:', err.message);
            client = null;
            isConnected = false;
        }
        return client;
    },

    async get(key) {
        try {
            // Try Redis first if connected
            if (isConnected && client) {
                const value = await client.get(key);
                if (value) {return JSON.parse(value);}
            }
            // Fallback to memory cache
            const cached = memoryCache.get(key);
            if (cached && cached.expires > Date.now()) {
                return cached.value;
            }
            memoryCache.delete(key);
            return null;
        } catch (err) {
            console.warn(`Cache get error for ${key}:`, err.message);
            const cached = memoryCache.get(key);
            return cached && cached.expires > Date.now() ? cached.value : null;
        }
    },

    async set(key, value, expiresIn = 3600) {
        try {
            // Try Redis first if connected
            if (isConnected && client) {
                await client.setEx(key, expiresIn, JSON.stringify(value));
            } else {
                // Fallback to memory cache
                memoryCache.set(key, {
                    value,
                    expires: Date.now() + expiresIn * 1000
                });
            }
        } catch (err) {
            console.warn(`Cache set error for ${key}:`, err.message);
            // Fallback to memory cache on error
            memoryCache.set(key, {
                value,
                expires: Date.now() + expiresIn * 1000
            });
        }
    },

    async del(key) {
        try {
            if (isConnected && client) {
                await client.del(key);
            }
            memoryCache.delete(key);
        } catch (err) {
            console.warn(`Cache delete error for ${key}:`, err.message);
            memoryCache.delete(key);
        }
    },

    async invalidatePattern(pattern) {
        try {
            if (isConnected && client) {
                const keys = await client.keys(pattern);
                if (keys.length > 0) {
                    await client.del(keys);
                }
            }
            // Invalidate from memory cache
            for (const [key] of memoryCache) {
                if (key.includes(pattern)) {
                    memoryCache.delete(key);
                }
            }
        } catch (err) {
            console.warn(`Cache invalidate pattern error for ${pattern}:`, err.message);
        }
    },

    async flush() {
        try {
            if (isConnected && client) {
                await client.flushDb();
            }
            memoryCache.clear();
            console.log('✅ Cache temizlendi');
        } catch (err) {
            console.warn('Cache flush error:', err.message);
            memoryCache.clear();
        }
    }
};

module.exports = CacheService;
