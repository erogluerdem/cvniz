const ApiKey = require('../models/ApiKey');
const crypto = require('crypto');
const CacheService = require('./CacheService');

const APIKeyService = {
    // Generate new API key
    async generateAPIKey(userId, name, permissions = []) {
        try {
            const key = crypto.randomBytes(32).toString('hex');
            const hash = crypto.createHash('sha256').update(key).digest('hex');

            const apiKey = await ApiKey.create({
                userId,
                name,
                keyHash: hash,
                permissions,
                isActive: true,
                lastUsed: null,
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
            });

            // Cache invalidation
            await CacheService.del(`user:${userId}:api-keys`);

            return {
                id: apiKey._id,
                key: `cvniz_${key}`, // Format: cvniz_[hash]
                name: apiKey.name,
                message: 'API key created. Save it somewhere safe, you won\'t see it again!'
            };
        } catch (err) {
            console.error('Error generating API key:', err);
            throw err;
        }
    },

    // Validate API key
    async validateAPIKey(keyString) {
        try {
            // Check cache first
            const cached = await CacheService.get(`apikey:${keyString}:valid`);
            if (cached !== null) {return cached;}

            // Extract key from format cvniz_[hash]
            const [prefix, ...parts] = keyString.split('_');
            if (prefix !== 'cvniz') {return null;}

            const key = parts.join('_');
            const hash = crypto.createHash('sha256').update(key).digest('hex');

            const apiKey = await ApiKey.findOne({ keyHash: hash, isActive: true });

            if (!apiKey) {
                await CacheService.set(`apikey:${keyString}:valid`, null, 300);
                return null;
            }

            // Check expiration
            if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
                await CacheService.set(`apikey:${keyString}:valid`, null, 300);
                return null;
            }

            // Update last used timestamp
            apiKey.lastUsed = new Date();
            await apiKey.save();

            const result = {
                userId: apiKey.userId,
                permissions: apiKey.permissions,
                name: apiKey.name
            };

            await CacheService.set(`apikey:${keyString}:valid`, result, 300);
            return result;
        } catch (err) {
            console.error('Error validating API key:', err);
            return null;
        }
    },

    // Get user's API keys (without exposing actual keys)
    async getUserAPIKeys(userId) {
        try {
            const cached = await CacheService.get(`user:${userId}:api-keys`);
            if (cached) {return cached;}

            const keys = await ApiKey.find({ userId }).select('_id name isActive lastUsed createdAt expiresAt permissions');

            await CacheService.set(`user:${userId}:api-keys`, keys, 3600);
            return keys;
        } catch (err) {
            console.error('Error getting user API keys:', err);
            throw err;
        }
    },

    // Revoke API key
    async revokeAPIKey(userId, keyId) {
        try {
            const apiKey = await ApiKey.findOneAndUpdate(
                { _id: keyId, userId },
                { isActive: false },
                { new: true }
            );

            await CacheService.del(`user:${userId}:api-keys`);
            return apiKey;
        } catch (err) {
            console.error('Error revoking API key:', err);
            throw err;
        }
    },

    // Check API key permissions
    hasPermission(apiKeyData, requiredPermission) {
        if (!apiKeyData || !apiKeyData.permissions) {return false;}
        return apiKeyData.permissions.includes(requiredPermission) || apiKeyData.permissions.includes('*');
    }
};

module.exports = APIKeyService;
