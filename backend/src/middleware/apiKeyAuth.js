const APIKeyService = require('../services/APIKeyService');
const jwt = require('jsonwebtoken');

const authenticateRequest = async (req, res, next) => {
    try {
        // Check for JWT token first
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decoded;
                req.authType = 'jwt';
                return next();
            } catch (err) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
        }

        // Check for API key
        const apiKey = req.headers['x-api-key'];
        if (apiKey) {
            const apiKeyData = await APIKeyService.validateAPIKey(apiKey);
            if (!apiKeyData) {
                return res.status(401).json({ error: 'Invalid API key' });
            }
            req.user = { id: apiKeyData.userId };
            req.apiKey = apiKeyData;
            req.authType = 'api-key';
            return next();
        }

        return res.status(401).json({ error: 'Missing authentication credentials' });
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};

const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
        if (req.authType === 'api-key') {
            const APIKeyService = require('../services/APIKeyService');
            if (!APIKeyService.hasPermission(req.apiKey, requiredPermission)) {
                return res.status(403).json({ 
                    error: `Missing required permission: ${requiredPermission}` 
                });
            }
        }
        next();
    };
};

module.exports = {
    authenticateRequest,
    requirePermission
};
