const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    colors: {
        primary: { type: String, default: '#22d3ee' },
        secondary: { type: String, default: '#a855f7' },
        accent: { type: String, default: '#f59e0b' },
        background: { type: String, default: '#0f172a' },
        surface: { type: String, default: '#1e293b' },
        text: { type: String, default: '#f8fafc' },
        textMuted: { type: String, default: '#94a3b8' }
    },
    typography: {
        fontFamily: { type: String, default: 'Inter' },
        baseSize: { type: String, default: '16px' }
    },
    ui: {
        borderRadius: { type: Number, default: 12 },
        glassmorphism: { type: Boolean, default: true },
        shadows: { type: String, enum: ['none', 'soft', 'heavy'], default: 'soft' }
    },
    landing: {
        heroGradient: { type: String, enum: ['mesh', 'radial', 'linear', 'none'], default: 'mesh' },
        heroOverlayOpacity: { type: Number, default: 0.4, min: 0, max: 1 },
        heroAnimation: { type: String, enum: ['orbs', 'particles', 'grid', 'none'], default: 'orbs' },
        cardBlur: { type: Number, default: 10, min: 0, max: 40 },
        buttonStyle: { type: String, enum: ['rounded', 'sharp', 'pill'], default: 'rounded' },
        headerTransparent: { type: Boolean, default: true },
        sectionSpacing: { type: String, enum: ['compact', 'normal', 'spacious'], default: 'normal' }
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Theme', themeSchema);
