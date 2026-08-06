const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    excerpt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Kariyer', 'Mülakat', 'Özgeçmiş', 'Eğitim', 'Teknoloji']
    },
    tags: [{
        type: String,
        trim: true
    }],
    coverImage: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ['published', 'draft', 'archived'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    seo: {
        title: String,
        description: String,
        keywords: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
