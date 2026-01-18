/**
 * IP Geolocation Utility
 * Uses free ip-api.com service for location detection
 * Rate limit: 45 requests per minute
 */

// Simple in-memory cache
const locationCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Parse User-Agent string to extract browser and OS info
 */
function parseUserAgent(userAgent) {
    if (!userAgent) {
        return { browser: 'Bilinmiyor', os: 'Bilinmiyor', isMobile: false };
    }

    const ua = userAgent.toLowerCase();

    // Detect mobile
    const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua);

    // Detect browser
    let browser = 'Bilinmiyor';
    if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';
    else if (ua.includes('msie') || ua.includes('trident')) browser = 'Internet Explorer';

    // Detect OS
    let os = 'Bilinmiyor';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    return { browser, os, isMobile };
}

/**
 * Get client IP from request
 */
function getClientIP(req) {
    // Check various headers for proxied requests
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    return req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip ||
        '0.0.0.0';
}

/**
 * Get location from IP address using ip-api.com
 */
async function getLocationFromIP(ip) {
    // Return default for localhost/private IPs
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {
            city: 'Yerel Ağ',
            region: '',
            country: 'Türkiye',
            countryCode: 'TR',
            lat: 41.0082,
            lon: 28.9784
        };
    }

    // Check cache first
    const cacheKey = ip;
    const cached = locationCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
    }

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon`);
        const data = await response.json();

        if (data.status === 'success') {
            const location = {
                city: data.city || 'Bilinmiyor',
                region: data.regionName || '',
                country: data.country || 'Bilinmiyor',
                countryCode: data.countryCode || '',
                lat: data.lat || null,
                lon: data.lon || null
            };

            // Cache the result
            locationCache.set(cacheKey, {
                data: location,
                timestamp: Date.now()
            });

            return location;
        }
    } catch (error) {
        console.error('GeoIP lookup error:', error.message);
    }

    // Return default on error
    return {
        city: 'Bilinmiyor',
        region: '',
        country: 'Bilinmiyor',
        countryCode: '',
        lat: null,
        lon: null
    };
}

/**
 * Clean up expired cache entries periodically
 */
function cleanupCache() {
    const now = Date.now();
    for (const [key, value] of locationCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            locationCache.delete(key);
        }
    }
}

// Run cache cleanup every 10 minutes
setInterval(cleanupCache, 10 * 60 * 1000);

module.exports = {
    getLocationFromIP,
    getClientIP,
    parseUserAgent
};
