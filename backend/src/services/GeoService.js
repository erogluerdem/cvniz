const geoip = require('geoip-lite');

class GeoService {
    /**
     * Resolve IP address to location data
     * @param {string} ip
     * @returns {Object|null} Location data (country, city, ll, etc.)
     */
    static getLocation(ip) {
        if (!ip) {return null;}

        // Handle localhost
        if (ip === '127.0.0.1' || ip === '::1') {
            return {
                country: 'TR',
                city: 'Localhost',
                timezone: 'Europe/Istanbul',
                ll: [41, 29] // Dummy coordinates for Istanbul
            };
        }

        const geo = geoip.lookup(ip);
        if (!geo) {return null;}

        return {
            country: geo.country,
            city: geo.city,
            timezone: geo.timezone,
            ll: geo.ll // Latitude, Longitude array
        };
    }
}

module.exports = GeoService;
