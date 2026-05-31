const Log = require('../models/Log');

const logger = async ({ action, module, details, req }) => {
    try {
        await Log.create({
            action,
            module,
            details,
            adminId: req.user._id,
            adminEmail: req.user.email,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.headers['user-agent']
        });
    } catch (error) {
        console.error('Logging error:', error);
    }
};

module.exports = logger;
