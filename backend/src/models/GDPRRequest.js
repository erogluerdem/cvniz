const mongoose = require('mongoose');

const GDPRRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String, required: true },
    type: { type: String, required: true }, // e.g. 'Veri Silme', 'Veri İndirme'
    status: { type: String, enum: ['Bekliyor', 'Tamamlandı', 'Reddedildi', 'Otomatik İşlendi'], default: 'Bekliyor' },
    createdAt: { type: Date, default: Date.now },
    deadline: { type: Date } // SLA deadline, typically +28 days
});

module.exports = mongoose.model('GDPRRequest', GDPRRequestSchema);
