const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'CV adı gerekli'],
        trim: true,
        maxlength: [200, 'CV adı 200 karakterden uzun olamaz'],
        default: 'Adsız CV'
    },
    template: {
        type: String,
        required: [true, 'Template gerekli'],
        default: 'modern'
    },
    // Use Mixed type to accept flexible data structures from frontend
    data: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    layout: {
        sectionOrder: {
            type: [String],
            default: ['personalInfo', 'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects']
        },
        colorScheme: {
            primary: { type: String, default: '#3B82F6' },
            secondary: { type: String, default: '#1E40AF' },
            accent: { type: String, default: '#10B981' },
            text: { type: String, default: '#1F2937' },
            background: { type: String, default: '#FFFFFF' }
        },
        fontSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium'
        },
        showPhoto: { type: Boolean, default: true },
        showIcons: { type: Boolean, default: true }
    },
    versions: [{
        id: String,
        name: String,
        data: mongoose.Schema.Types.Mixed,
        template: String,
        createdAt: { type: Date, default: Date.now }
    }],
    metadata: {
        completeness: { type: Number, default: 0 },
        atsScore: { type: Number, default: null },
        lastEdited: { type: String, default: null }, // 'web' | 'ios' | 'android'
        viewCount: { type: Number, default: 0 },
        downloadCount: { type: Number, default: 0 },
        shareCount: { type: Number, default: 0 }
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    publicUrl: {
        type: String,
        unique: true,
        sparse: true
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    lastSyncedAt: {
        type: Date,
        default: Date.now
    },
    syncVersion: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
cvSchema.index({ userId: 1, createdAt: -1 });
cvSchema.index({ userId: 1, isArchived: 1 });
cvSchema.index({ lastSyncedAt: 1 });

// Pre-save: Update syncVersion on changes
cvSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.syncVersion += 1;
        this.lastSyncedAt = new Date();
    }
    next();
});

// Method: Calculate completeness
cvSchema.methods.calculateCompleteness = function () {
    let score = 0;
    const data = this.data;

    // Personal Info (25 points)
    if (data.personalInfo?.fullName) { score += 5; }
    if (data.personalInfo?.email) { score += 5; }
    if (data.personalInfo?.phone) { score += 5; }
    if (data.personalInfo?.summary) { score += 10; }

    // Experience (25 points)
    if (data.experience?.length > 0) {
        score += Math.min(data.experience.length * 5, 25);
    }

    // Education (20 points)
    if (data.education?.length > 0) {
        score += Math.min(data.education.length * 10, 20);
    }

    // Skills (15 points)
    if (data.skills?.length > 0) {
        score += Math.min(data.skills.length * 3, 15);
    }

    // Languages (10 points)
    if (data.languages?.length > 0) {
        score += Math.min(data.languages.length * 5, 10);
    }

    // Extras (5 points)
    if (data.certifications?.length > 0) { score += 2; }
    if (data.projects?.length > 0) { score += 3; }

    this.metadata.completeness = Math.min(score, 100);
    return this.metadata.completeness;
};

// Static: Get user CVs
cvSchema.statics.getUserCVs = function (userId, includeArchived = false) {
    const query = { userId };
    if (!includeArchived) {
        query.isArchived = false;
    }
    return this.find(query).sort({ updatedAt: -1 });
};

const CV = mongoose.model('CV', cvSchema);

module.exports = CV;
