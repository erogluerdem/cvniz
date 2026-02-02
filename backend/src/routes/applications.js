const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// Application status columns (Kanban)
const APPLICATION_STATUSES = [
    { id: 'wishlist', name: 'İlgileniyor', color: 'gray', order: 0 },
    { id: 'applied', name: 'Başvuruldu', color: 'blue', order: 1 },
    { id: 'screening', name: 'Ön Eleme', color: 'cyan', order: 2 },
    { id: 'interview', name: 'Mülakat', color: 'purple', order: 3 },
    { id: 'offer', name: 'Teklif', color: 'green', order: 4 },
    { id: 'rejected', name: 'Red', color: 'red', order: 5 },
    { id: 'withdrawn', name: 'Vazgeçildi', color: 'gray', order: 6 }
];

// Company insights templates
const COMPANY_INSIGHTS = {
    tech: [
        'Şirket son dönemde AI/ML alanında yatırımlarını artırdı.',
        'Remote/hibrit çalışma modelini benimsemiş durumda.',
        'Çalışan memnuniyeti ortalamanın üstünde (Glassdoor 3.8+).'
    ],
    finance: [
        'Son çeyrek finansal sonuçları beklentilerin üstünde.',
        'Şirket büyüme modunda ve yeni pozisyonlar açıyor.',
        'Sektörde güçlü bir marka konumuna sahip.'
    ],
    general: [
        'LinkedIn\'de şirket kültürü hakkında olumlu paylaşımlar var.',
        'Kariyer gelişim programları sunuyor.',
        'Çeşitlilik ve kapsayıcılık politikalarına önem veriyor.'
    ]
};

// Interview question suggestions by company type
const INTERVIEW_QUESTIONS = {
    tech: [
        'Ekibinizde teknik karar alma süreci nasıl işliyor?',
        'Kod inceleme süreçleriniz hakkında bilgi alabilir miyim?',
        'Junior geliştiricilere nasıl mentorluk sağlıyorsunuz?'
    ],
    startup: [
        'Şirket kültürü hakkında daha fazla bilgi alabilir miyim?',
        'Büyüme planlarınız neler?',
        'Bu pozisyondaki başarı nasıl ölçülüyor?'
    ],
    corporate: [
        'Kariyer gelişim fırsatları neler?',
        'Departmanlar arası işbirliği nasıl sağlanıyor?',
        'Performans değerlendirme süreci nasıl işliyor?'
    ],
    general: [
        'Bu pozisyonun tipik bir günü nasıl geçiyor?',
        'Ekipteki kişilerle nasıl çalışacağım?',
        'Başarılı bir aday 90 gün içinde neler başarmalı?'
    ]
};

// GET /api/applications - Get all applications
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const applications = user.applications || [];

        // Sort by date, group by status
        const grouped = {};
        APPLICATION_STATUSES.forEach(status => {
            grouped[status.id] = applications
                .filter(app => app.status === status.id)
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });

        res.json({
            success: true,
            applications,
            grouped,
            statuses: APPLICATION_STATUSES,
            stats: calculateStats(applications)
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Başvurular alınamadı' });
    }
});

// POST /api/applications - Add new application
router.post('/', authenticate, async (req, res) => {
    try {
        const { company, position, jobUrl, salary, notes, status, cvId } = req.body;

        if (!company || !position) {
            return res.status(400).json({ error: 'Şirket ve pozisyon gerekli' });
        }

        const application = {
            id: generateId(),
            company,
            position,
            jobUrl: jobUrl || null,
            salary: salary || null,
            notes: notes || '',
            status: status || 'applied',
            cvId: cvId || null,
            appliedAt: new Date(),
            updatedAt: new Date(),
            interviews: [],
            contacts: [],
            timeline: [
                { date: new Date(), action: 'Başvuru oluşturuldu', status: status || 'applied' }
            ]
        };

        await User.findByIdAndUpdate(req.user.id, {
            $push: { applications: application }
        });

        res.json({ success: true, application });
    } catch (error) {
        console.error('Add application error:', error);
        res.status(500).json({ error: 'Başvuru eklenemedi' });
    }
});

// PUT /api/applications/:id - Update application
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await User.findById(req.user.id);
        const appIndex = user.applications.findIndex(a => a.id === id);

        if (appIndex === -1) {
            return res.status(404).json({ error: 'Başvuru bulunamadı' });
        }

        const oldStatus = user.applications[appIndex].status;
        const newStatus = updates.status;

        // Update the application
        Object.assign(user.applications[appIndex], {
            ...updates,
            updatedAt: new Date()
        });

        // Add timeline entry if status changed
        if (newStatus && newStatus !== oldStatus) {
            user.applications[appIndex].timeline.push({
                date: new Date(),
                action: `Durum değişti: ${getStatusName(newStatus)}`,
                status: newStatus
            });
        }

        await user.save();

        res.json({ success: true, application: user.applications[appIndex] });
    } catch (error) {
        console.error('Update application error:', error);
        res.status(500).json({ error: 'Başvuru güncellenemedi' });
    }
});

// DELETE /api/applications/:id - Delete application
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { applications: { id } }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({ error: 'Başvuru silinemedi' });
    }
});

// POST /api/applications/:id/interview - Add interview
router.post('/:id/interview', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, type, notes, location, interviewers } = req.body;

        if (!date) {
            return res.status(400).json({ error: 'Mülakat tarihi gerekli' });
        }

        const interview = {
            id: generateId(),
            date: new Date(date),
            time: time || null,
            type: type || 'onsite', // onsite, video, phone
            notes: notes || '',
            location: location || '',
            interviewers: interviewers || [],
            status: 'scheduled', // scheduled, completed, cancelled
            createdAt: new Date()
        };

        const user = await User.findById(req.user.id);
        const appIndex = user.applications.findIndex(a => a.id === id);

        if (appIndex === -1) {
            return res.status(404).json({ error: 'Başvuru bulunamadı' });
        }

        user.applications[appIndex].interviews.push(interview);
        user.applications[appIndex].status = 'interview';
        user.applications[appIndex].timeline.push({
            date: new Date(),
            action: `Mülakat planlandı: ${new Date(date).toLocaleDateString('tr-TR')}`,
            status: 'interview'
        });

        await user.save();

        res.json({ success: true, interview });
    } catch (error) {
        console.error('Add interview error:', error);
        res.status(500).json({ error: 'Mülakat eklenemedi' });
    }
});

// GET /api/applications/upcoming-interviews - Get upcoming interviews with AI prep
router.get('/upcoming-interviews', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const applications = user.applications || [];

        const now = new Date();
        const upcoming = [];

        applications.forEach(app => {
            (app.interviews || []).forEach(interview => {
                const interviewDate = new Date(interview.date);
                const daysUntil = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));

                if (daysUntil >= 0 && daysUntil <= 7 && interview.status === 'scheduled') {
                    upcoming.push({
                        application: {
                            id: app.id,
                            company: app.company,
                            position: app.position
                        },
                        interview: {
                            ...interview,
                            daysUntil
                        },
                        preparation: generateInterviewPrep(app, interview, daysUntil)
                    });
                }
            });
        });

        // Sort by date
        upcoming.sort((a, b) => new Date(a.interview.date) - new Date(b.interview.date));

        res.json({ success: true, upcoming });
    } catch (error) {
        console.error('Get upcoming interviews error:', error);
        res.status(500).json({ error: 'Mülakatlar alınamadı' });
    }
});

// GET /api/applications/stats - Get application statistics
router.get('/stats', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const applications = user.applications || [];

        res.json({
            success: true,
            stats: calculateStats(applications)
        });
    } catch (error) {
        res.status(500).json({ error: 'İstatistikler alınamadı' });
    }
});

// GET /api/applications/statuses - Get available statuses
router.get('/statuses', (req, res) => {
    res.json({ success: true, statuses: APPLICATION_STATUSES });
});

// ============ Helper Functions ============

function generateId() {
    return 'app_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getStatusName(statusId) {
    const status = APPLICATION_STATUSES.find(s => s.id === statusId);
    return status ? status.name : statusId;
}

function calculateStats(applications) {
    const stats = {
        total: applications.length,
        byStatus: {},
        thisWeek: 0,
        thisMonth: 0,
        responseRate: 0,
        interviewRate: 0,
        offerRate: 0
    };

    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    let responded = 0;
    let interviewed = 0;
    let offered = 0;

    applications.forEach(app => {
        // Count by status
        stats.byStatus[app.status] = (stats.byStatus[app.status] || 0) + 1;

        // Recent applications
        const appliedDate = new Date(app.appliedAt);
        if (appliedDate > weekAgo) {stats.thisWeek++;}
        if (appliedDate > monthAgo) {stats.thisMonth++;}

        // Rates
        if (['screening', 'interview', 'offer', 'rejected'].includes(app.status)) {
            responded++;
        }
        if (['interview', 'offer'].includes(app.status)) {
            interviewed++;
        }
        if (app.status === 'offer') {
            offered++;
        }
    });

    if (applications.length > 0) {
        stats.responseRate = Math.round((responded / applications.length) * 100);
        stats.interviewRate = Math.round((interviewed / applications.length) * 100);
        stats.offerRate = Math.round((offered / applications.length) * 100);
    }

    return stats;
}

function generateInterviewPrep(app, interview, daysUntil) {
    const companyType = detectCompanyType(app.company);
    const insights = COMPANY_INSIGHTS[companyType] || COMPANY_INSIGHTS.general;
    const questions = INTERVIEW_QUESTIONS[companyType] || INTERVIEW_QUESTIONS.general;

    const prep = {
        urgency: daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : 'upcoming',
        message: generatePrepMessage(app.company, daysUntil),
        insights: insights.slice(0, 2),
        suggestedQuestions: questions.slice(0, 3),
        checklist: generateChecklist(interview, daysUntil)
    };

    return prep;
}

function detectCompanyType(companyName) {
    const lower = (companyName || '').toLowerCase();

    const techCompanies = ['google', 'microsoft', 'apple', 'amazon', 'meta', 'netflix', 'yazılım', 'tech', 'digital'];
    const startupIndicators = ['startup', 'labs', 'io', 'hub', 'ventures'];
    const financeIndicators = ['bank', 'finans', 'sigorta', 'yatırım', 'capital'];

    if (techCompanies.some(t => lower.includes(t))) {return 'tech';}
    if (startupIndicators.some(s => lower.includes(s))) {return 'startup';}
    if (financeIndicators.some(f => lower.includes(f))) {return 'finance';}

    return 'general';
}

function generatePrepMessage(company, daysUntil) {
    if (daysUntil === 0) {
        return `🔥 Bugün ${company} mülakatın var! Son hazırlıklarını yap.`;
    } else if (daysUntil === 1) {
        return `⏰ Yarın ${company} mülakatın var. İşte sana özel hazırlık notları.`;
    } else {
        return `📅 ${daysUntil} gün sonra ${company} mülakatın var. Hazırlanmaya başla!`;
    }
}

function generateChecklist(interview, _daysUntil) {
    const items = [];

    if (interview.type === 'video') {
        items.push({ text: 'Kamera ve mikrofonu test et', done: false });
        items.push({ text: 'Arka planını düzenle', done: false });
        items.push({ text: 'İnternet bağlantısını kontrol et', done: false });
    } else if (interview.type === 'onsite') {
        items.push({ text: 'Adrese bir gün önce bak', done: false });
        items.push({ text: 'Kıyafetini hazırla', done: false });
        items.push({ text: '15 dakika erken git', done: false });
    }

    items.push({ text: 'CV\'nin bir kopyasını yanına al', done: false });
    items.push({ text: 'Şirket hakkında araştırma yap', done: false });
    items.push({ text: 'Sorulara hazırlan (STAR metodu)', done: false });
    items.push({ text: 'Sormak istediğin soruları not al', done: false });

    return items;
}

module.exports = router;
