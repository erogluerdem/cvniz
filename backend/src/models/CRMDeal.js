const mongoose = require('mongoose');

const crmDealSchema = new mongoose.Schema({
    company: {
        type: String,
        trim: true
    },
    holding: {
        type: String,
        trim: true
    },
    stage: {
        type: String,
        required: true,
        enum: ['Görüşülüyor', 'Teklif Verildi', 'Kazanıldı']
    },
    value: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    lastAction: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CRMDeal', crmDealSchema);
