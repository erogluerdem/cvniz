const CacheService = require('../services/CacheService');
const crypto = require('crypto');

/**
 * Response Caching Middleware
 * - ETag support for conditional requests
 * - Cache-Control headers
 * - Automatic cache invalidation
 * - Cache statistics tracking
 */

class ResponseCache {
    constructor() {
        this.cacheStats = {
            hits: 0,
            misses: 0,
            invalidations: 0
        };
    }

    /**
     * Generate cache key from request
     */
    generateCacheKey(req) {
        const userId = req.user?.id || 'anonymous';
        const method = req.method;
        const path = req.originalUrl || req.url;
        // Include query params but not pagination
        const queryStr = Object.keys(req.query)
            .filter(k => !['page', 'limit', 'offset', '_'].includes(k))
            .sort()
            .map(k => `${k}=${req.query[k]}`)
            .join('&');

        const key = `cache:${userId}:${method}:${path}:${queryStr}`;
        return crypto.createHash('md5').update(key).digest('hex');
    }

    /**
     * Generate ETag from data
     */
    generateETag(data) {
        const hash = crypto.createHash('md5')
            .update(JSON.stringify(data))
            .digest('hex');
        return `"${hash}"`;
    }

    /**
     * Middleware function
     */
    middleware(cacheConfig = {}) {
        const {
            duration = 3600, // 1 hour default
            conditions = {},
            excludePaths = []
        } = cacheConfig;

        return async (req, res, next) => {
            // Skip caching for non-GET requests
            if (req.method !== 'GET') {
                return next();
            }

            // Skip excluded paths
            if (excludePaths.some(path => req.path.includes(path))) {
                return next();
            }

            // Skip if query has cache-busting params
            if (req.query.nocache || req.headers['cache-control']?.includes('no-cache')) {
                return next();
            }

            const cacheKey = this.generateCacheKey(req);

            try {
                // Try to get from cache
                const cached = await CacheService.get(cacheKey);

                if (cached) {
                    const eTag = this.generateETag(cached.data);

                    // Check If-None-Match header
                    if (req.headers['if-none-match'] === eTag) {
                        this.cacheStats.hits++;
                        return res.status(304).set('ETag', eTag).end();
                    }

                    this.cacheStats.hits++;
                    res.set('ETag', eTag);
                    res.set('X-Cache', 'HIT');
                    res.set('Cache-Control', `public, max-age=${duration}`);

                    // Add cache metadata
                    res.set('X-Cache-Age', Math.floor((Date.now() - cached.timestamp) / 1000));
                    return res.json(cached.data);
                }

                this.cacheStats.misses++;

                // Intercept response
                const originalJson = res.json.bind(res);
                const self = this;

                res.json = function (data) {
                    const eTag = self.generateETag(data);

                    // Check conditions
                    let shouldCache = true;
                    if (conditions.statusCode) {
                        shouldCache = conditions.statusCode === res.statusCode;
                    }
                    if (conditions.check) {
                        shouldCache = conditions.check(data);
                    }

                    if (shouldCache && res.statusCode === 200) {
                        // Cache the response
                        CacheService.set(cacheKey, {
                            data,
                            timestamp: Date.now()
                        }, duration).catch(err => {
                            console.warn('Cache set error:', err);
                        });

                        res.set('ETag', eTag);
                        res.set('X-Cache', 'MISS');
                    }

                    res.set('Cache-Control', `public, max-age=${duration}`);
                    return originalJson(data);
                };

                next();
            } catch (error) {
                console.error('Cache middleware error:', error);
                next();
            }
        };
    }

    /**
     * Invalidate cache for a specific resource
     */
    static async invalidatePattern(pattern) {
        try {
            const keys = await CacheService.getKeys(`cache:*${pattern}*`);
            if (keys.length > 0) {
                await CacheService.delete(keys);
                this.cacheStats.invalidations++;
                return keys.length;
            }
            return 0;
        } catch (error) {
            console.error('Cache invalidation error:', error);
            return 0;
        }
    }

    /**
     * Invalidate user-specific cache
     */
    static async invalidateUserCache(userId) {
        return this.invalidatePattern(`${userId}:`);
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const total = this.cacheStats.hits + this.cacheStats.misses;
        return {
            ...this.cacheStats,
            total,
            hitRate: total > 0 ? ((this.cacheStats.hits / total) * 100).toFixed(2) + '%' : '0%',
            missRate: total > 0 ? ((this.cacheStats.misses / total) * 100).toFixed(2) + '%' : '0%'
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.cacheStats = { hits: 0, misses: 0, invalidations: 0 };
    }
}

module.exports = new ResponseCache();
