const redis = require('redis');

let client;

const CacheService = {
    async connect() {
        if (client) return client;

        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        
        client = redis.createClient({
            url: redisUrl,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('❌ Redis yeniden bağlanma denemelerinin limiti aşıldı');
                        return new Error('Redis yeniden bağlanma limiti');
                    }
                    return retries * 50;
                }
            }
        });

        client.on('error', err => console.error('Redis Client Error:', err));
        client.on('connect', () => console.log('✅ Redis bağlantısı başarılı'));

        await client.connect();
        return client;
    },

    async get(key) {
        try {
            if (!client) await this.connect();
            const value = await client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (err) {
            console.error(`Cache get error for ${key}:`, err);
            return null;
        }
    },

    async set(key, value, expiresIn = 3600) {
        try {
            if (!client) await this.connect();
            await client.setEx(key, expiresIn, JSON.stringify(value));
        } catch (err) {
            console.error(`Cache set error for ${key}:`, err);
        }
    },

    async del(key) {
        try {
            if (!client) await this.connect();
            await client.del(key);
        } catch (err) {
            console.error(`Cache delete error for ${key}:`, err);
        }
    },

    async invalidatePattern(pattern) {
        try {
            if (!client) await this.connect();
            const keys = await client.keys(pattern);
            if (keys.length > 0) {
                await client.del(keys);
            }
        } catch (err) {
            console.error(`Cache invalidate pattern error for ${pattern}:`, err);
        }
    },

    async flush() {
        try {
            if (!client) await this.connect();
            await client.flushDb();
            console.log('✅ Redis cache temizlendi');
        } catch (err) {
            console.error('Cache flush error:', err);
        }
    }
};

module.exports = CacheService;
