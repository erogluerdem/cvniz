const mongoose = require('mongoose');

const SmsProviderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { type: String, required: true },
    active: { type: Boolean, default: false },
    isDefault: { type: Boolean, default: false },
    testMode: { type: Boolean, default: true },
    credentials: { type: mongoose.Schema.Types.Mixed },
    senderId: String,
    logo: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SmsProvider', SmsProviderSchema);
