const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'E-posta gerekli'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta girin']
    },
    password: {
        type: String,
        required: function () { return !this.authProvider; }, // Social login için şifre zorunlu değil
        minlength: [6, 'Şifre en az 6 karakter olmalı'],
        select: false // Query'lerde password gelmez
    },
    name: {
        type: String,
        required: [true, 'İsim gerekli'],
        trim: true,
        maxlength: [100, 'İsim 100 karakterden uzun olamaz']
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'enterprise'],
        default: 'user'
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumExpiresAt: {
        type: Date,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'linkedin', 'apple'],
        default: 'local'
    },
    authProviderId: {
        type: String,
        default: null
    },
    profile: {
        phone: String,
        address: String,
        city: String,
        country: String,
        linkedIn: String,
        website: String,
        bio: String
    },
    settings: {
        language: {
            type: String,
            default: 'tr'
        },
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        }
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    lastSyncAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    refreshTokens: [{
        token: String,
        deviceInfo: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: CV sayısı
userSchema.virtual('cvCount', {
    ref: 'CV',
    localField: '_id',
    foreignField: 'userId',
    count: true
});

// Index for search and queries
userSchema.index({ email: 1 });
userSchema.index({ 'authProvider': 1, 'authProviderId': 1 });
userSchema.index({ createdAt: -1 });

// Pre-save: Hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {return next();}

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Method: Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method: Check if premium is active
userSchema.methods.hasPremiumAccess = function () {
    if (this.role === 'admin') {return true;}
    if (!this.isPremium) {return false;}
    if (!this.premiumExpiresAt) {return true;} // Lifetime premium
    return new Date() < this.premiumExpiresAt;
};

// Static: Find by email with password
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {return null;}

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {return null;}

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
