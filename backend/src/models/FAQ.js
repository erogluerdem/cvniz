const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Ödeme & Abonelik', 'Hesap & Güvenlik', 'CV Oluşturma', 'Teknik Destek', 'Diğer'],
        default: 'Diğer'
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'draft', 'archived'],
        default: 'active'
    },
    order: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    helpfulCount: {
        type: Number,
        default: 0
    },
    unhelpfulCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FAQ', faqSchema);
