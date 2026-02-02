const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    companyLogo: String,
    location: {
        type: String,
        required: true
    },
    locationType: {
        type: String,
        enum: ['onsite', 'remote', 'hybrid'],
        default: 'onsite'
    },
    salaryMin: Number,
    salaryMax: Number,
    salaryCurrency: {
        type: String,
        default: 'TL'
    },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
        default: 'full-time'
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
        default: 'mid'
    },
    description: String,
    requirements: [String],
    benefits: [String],
    skills: [String],
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'expired', 'filled'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    urgent: {
        type: Boolean,
        default: false
    },
    applications: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    expiryDate: Date,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Maaş aralığı formatı
jobSchema.virtual('salaryRange').get(function () {
    if (!this.salaryMin && !this.salaryMax) {return null;}
    if (this.salaryMin && this.salaryMax) {
        return `${this.salaryMin.toLocaleString()} - ${this.salaryMax.toLocaleString()} ${this.salaryCurrency}`;
    }
    return `${(this.salaryMin || this.salaryMax).toLocaleString()} ${this.salaryCurrency}`;
});

jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
