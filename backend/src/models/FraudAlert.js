const mongoose = require('mongoose');

const FraudAlertSchema = new mongoose.Schema({
    type: { type: String, required: true },
    user: { type: String, required: true },
    ip: { type: String },
    action: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FraudAlert', FraudAlertSchema);
