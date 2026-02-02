const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const User = require('../models/User');

// Salary data by sector, experience, and location (Turkish Lira - monthly)
const SALARY_DATA = {
    'yazilim': {
        name: 'Yazılım / IT',
        baseSalaries: {
            junior: { min: 25000, max: 40000, median: 32000 },      // 0-2 years
            mid: { min: 40000, max: 65000, median: 52000 },         // 2-5 years
            senior: { min: 65000, max: 100000, median: 80000 },     // 5-8 years
            lead: { min: 90000, max: 150000, median: 115000 },      // 8-12 years
            director: { min: 130000, max: 250000, median: 175000 }  // 12+ years
        },
        skillMultipliers: {
            'Python': 1.08,
            'JavaScript': 1.05,
            'React': 1.10,
            'Node.js': 1.07,
            'AWS': 1.15,
            'Kubernetes': 1.18,
            'Machine Learning': 1.25,
            'AI': 1.25,
            'DevOps': 1.12,
            'Go': 1.15,
            'Rust': 1.18,
            'TypeScript': 1.08,
            'Docker': 1.08,
            'Microservices': 1.10,
            'System Design': 1.12
        },
        certifications: {
            'AWS Certified': 8000,
            'Azure Certified': 7000,
            'Google Cloud': 7500,
            'Kubernetes (CKA)': 6000,
            'PMP': 5000,
            'Scrum Master': 3000
        },
        topPayingSkills: ['Machine Learning', 'AI', 'Kubernetes', 'AWS', 'System Design']
    },
    'finans': {
        name: 'Finans / Bankacılık',
        baseSalaries: {
            junior: { min: 22000, max: 35000, median: 28000 },
            mid: { min: 35000, max: 55000, median: 45000 },
            senior: { min: 55000, max: 90000, median: 70000 },
            lead: { min: 85000, max: 140000, median: 110000 },
            director: { min: 120000, max: 300000, median: 180000 }
        },
        skillMultipliers: {
            'CFA': 1.25,
            'Excel': 1.05,
            'Power BI': 1.10,
            'SQL': 1.08,
            'Python': 1.15,
            'VBA': 1.08,
            'SAP': 1.12,
            'Risk Yönetimi': 1.15,
            'Finansal Modelleme': 1.18,
            'Bloomberg': 1.12
        },
        certifications: {
            'CFA': 15000,
            'ACCA': 10000,
            'SMMM': 8000,
            'FRM': 12000
        },
        topPayingSkills: ['CFA', 'Finansal Modelleme', 'Python', 'Risk Yönetimi']
    },
    'pazarlama': {
        name: 'Pazarlama / Dijital',
        baseSalaries: {
            junior: { min: 18000, max: 28000, median: 23000 },
            mid: { min: 28000, max: 45000, median: 36000 },
            senior: { min: 45000, max: 75000, median: 58000 },
            lead: { min: 70000, max: 110000, median: 88000 },
            director: { min: 100000, max: 180000, median: 135000 }
        },
        skillMultipliers: {
            'Google Ads': 1.10,
            'SEO': 1.08,
            'Analytics': 1.12,
            'Facebook Ads': 1.08,
            'Content Marketing': 1.05,
            'Growth Hacking': 1.15,
            'Marketing Automation': 1.12,
            'HubSpot': 1.08,
            'A/B Testing': 1.10
        },
        certifications: {
            'Google Ads': 4000,
            'HubSpot': 3500,
            'Facebook Blueprint': 3000
        },
        topPayingSkills: ['Growth Hacking', 'Analytics', 'Marketing Automation', 'Google Ads']
    },
    'uretim': {
        name: 'Üretim / Mühendislik',
        baseSalaries: {
            junior: { min: 22000, max: 35000, median: 28000 },
            mid: { min: 35000, max: 55000, median: 44000 },
            senior: { min: 55000, max: 85000, median: 68000 },
            lead: { min: 80000, max: 130000, median: 100000 },
            director: { min: 120000, max: 220000, median: 160000 }
        },
        skillMultipliers: {
            'Six Sigma Black Belt': 1.20,
            'Six Sigma Green Belt': 1.10,
            'ISO 9001': 1.08,
            'Lean Manufacturing': 1.12,
            'ERP': 1.10,
            'SAP': 1.15,
            'AutoCAD': 1.05,
            'PLC': 1.10,
            'Kaizen': 1.08,
            'TPM': 1.10
        },
        certifications: {
            'Six Sigma Black Belt': 12000,
            'Six Sigma Green Belt': 6000,
            'PMP': 8000,
            'ISO Lead Auditor': 5000
        },
        topPayingSkills: ['Six Sigma Black Belt', 'SAP', 'Lean Manufacturing', 'PLC']
    },
    'insan_kaynaklari': {
        name: 'İnsan Kaynakları',
        baseSalaries: {
            junior: { min: 18000, max: 28000, median: 22000 },
            mid: { min: 28000, max: 42000, median: 34000 },
            senior: { min: 42000, max: 65000, median: 52000 },
            lead: { min: 60000, max: 95000, median: 75000 },
            director: { min: 90000, max: 160000, median: 120000 }
        },
        skillMultipliers: {
            'SAP HR': 1.15,
            'Workday': 1.12,
            'Talent Management': 1.10,
            'Compensation & Benefits': 1.12,
            'HRIS': 1.08,
            'İş Hukuku': 1.10,
            'Performans Yönetimi': 1.08
        },
        certifications: {
            'SHRM-CP': 6000,
            'PHR': 5000,
            'CIPD': 5500
        },
        topPayingSkills: ['SAP HR', 'Workday', 'Compensation & Benefits', 'Talent Management']
    },
    'satis': {
        name: 'Satış',
        baseSalaries: {
            junior: { min: 18000, max: 30000, median: 24000 },
            mid: { min: 30000, max: 50000, median: 38000 },
            senior: { min: 50000, max: 80000, median: 62000 },
            lead: { min: 75000, max: 120000, median: 95000 },
            director: { min: 110000, max: 200000, median: 150000 }
        },
        skillMultipliers: {
            'Salesforce': 1.12,
            'CRM': 1.08,
            'B2B': 1.10,
            'Account Management': 1.08,
            'Negotiation': 1.10,
            'Enterprise Sales': 1.15,
            'SaaS Sales': 1.18
        },
        certifications: {
            'Salesforce Certified': 5000
        },
        topPayingSkills: ['SaaS Sales', 'Enterprise Sales', 'Salesforce', 'Negotiation']
    },
    'saglik': {
        name: 'Sağlık',
        baseSalaries: {
            junior: { min: 25000, max: 40000, median: 32000 },
            mid: { min: 40000, max: 60000, median: 48000 },
            senior: { min: 60000, max: 95000, median: 75000 },
            lead: { min: 90000, max: 150000, median: 115000 },
            director: { min: 140000, max: 280000, median: 200000 }
        },
        skillMultipliers: {
            'Klinik Araştırma': 1.15,
            'Sağlık Yönetimi': 1.12,
            'JCI': 1.10,
            'Tıbbi Cihaz': 1.12,
            'Farmakovijilans': 1.15
        },
        certifications: {
            'JCI Auditor': 7000,
            'Clinical Research': 6000
        },
        topPayingSkills: ['Farmakovijilans', 'Klinik Araştırma', 'Sağlık Yönetimi', 'Tıbbi Cihaz']
    },
    'genel': {
        name: 'Genel',
        baseSalaries: {
            junior: { min: 18000, max: 28000, median: 22000 },
            mid: { min: 28000, max: 45000, median: 35000 },
            senior: { min: 45000, max: 70000, median: 55000 },
            lead: { min: 65000, max: 100000, median: 80000 },
            director: { min: 95000, max: 160000, median: 125000 }
        },
        skillMultipliers: {
            'İngilizce': 1.15,
            'Almanca': 1.20,
            'MBA': 1.25,
            'Proje Yönetimi': 1.10,
            'Liderlik': 1.08
        },
        certifications: {
            'MBA': 15000,
            'PMP': 8000
        },
        topPayingSkills: ['MBA', 'Almanca', 'İngilizce', 'Proje Yönetimi']
    }
};

// Location multipliers (Istanbul = 1.0 base)
const LOCATION_MULTIPLIERS = {
    'istanbul': 1.0,
    'ankara': 0.90,
    'izmir': 0.88,
    'bursa': 0.85,
    'antalya': 0.82,
    'konya': 0.78,
    'adana': 0.78,
    'remote': 1.05, // Remote work premium
    'default': 0.80
};

// Company size multipliers
const COMPANY_SIZE_MULTIPLIERS = {
    'startup': 0.90,
    'small': 0.95,
    'medium': 1.00,
    'large': 1.10,
    'enterprise': 1.20,
    'multinational': 1.25
};

// POST /api/salary/benchmark - Calculate salary benchmark (PREMIUM ONLY)
router.post('/benchmark', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Check premium status
        const isPremium = user.subscription?.plan === 'premium' || user.subscription?.plan === 'pro';
        if (!isPremium) {
            return res.status(403).json({
                error: 'Bu özellik sadece Premium üyeler içindir',
                requiresPremium: true,
                upgradeUrl: '/pricing'
            });
        }

        const { cvData, sector, location, companySize } = req.body;

        if (!cvData) {
            return res.status(400).json({ error: 'CV verisi gerekli' });
        }

        // Perform salary analysis
        const analysis = calculateSalaryBenchmark(cvData, sector || 'genel', location || 'istanbul', companySize || 'medium');

        res.json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error('Salary benchmark error:', error);
        res.status(500).json({ error: 'Maaş analizi sırasında hata oluştu' });
    }
});

// GET /api/salary/sectors - Get available sectors with salary ranges
router.get('/sectors', (req, res) => {
    const sectors = Object.entries(SALARY_DATA).map(([id, data]) => ({
        id,
        name: data.name,
        salaryRange: {
            min: data.baseSalaries.junior.min,
            max: data.baseSalaries.director.max
        },
        topPayingSkills: data.topPayingSkills?.slice(0, 3) || []
    }));
    res.json({ success: true, sectors });
});

// GET /api/salary/preview - Get a preview (limited) for non-premium users
router.get('/preview', async (req, res) => {
    res.json({
        success: true,
        message: 'Tam maaş analizini görmek için Premium\'a yükseltin',
        sampleRange: {
            sector: 'Yazılım',
            experience: '3-5 yıl',
            range: '40.000₺ - 65.000₺',
            disclaimer: 'Gerçek değerinizi öğrenmek için Premium\'a geçin'
        },
        features: [
            'Sektörel maaş karşılaştırması',
            'Beceri bazlı değer hesaplama',
            'Sertifika etki analizi',
            '%20 daha fazla kazanmak için öneriler',
            'Lokasyon bazlı düzeltme'
        ]
    });
});

// Helper: Calculate salary benchmark
function calculateSalaryBenchmark(cvData, sectorId, location, companySize) {
    const sectorData = SALARY_DATA[sectorId] || SALARY_DATA['genel'];

    // Extract CV information
    const experience = extractExperience(cvData);
    const skills = extractSkills(cvData);
    const certifications = extractCertifications(cvData);
    const education = extractEducation(cvData);

    // Determine experience level
    const level = getExperienceLevel(experience.totalYears);
    const baseSalary = sectorData.baseSalaries[level];

    // Calculate skill multiplier
    let skillMultiplier = 1.0;
    const appliedSkills = [];
    const missingHighValueSkills = [];

    for (const [skill, multiplier] of Object.entries(sectorData.skillMultipliers || {})) {
        const hasSkill = skills.some(s =>
            s.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(s.toLowerCase())
        );
        if (hasSkill) {
            skillMultiplier *= multiplier;
            appliedSkills.push({ skill, impact: `+${Math.round((multiplier - 1) * 100)}%` });
        } else if (multiplier >= 1.10) {
            missingHighValueSkills.push({
                skill,
                potentialIncrease: Math.round((multiplier - 1) * 100),
                estimatedValue: Math.round(baseSalary.median * (multiplier - 1))
            });
        }
    }

    // Calculate certification bonus
    let certBonus = 0;
    const appliedCerts = [];
    const recommendedCerts = [];

    for (const [cert, bonus] of Object.entries(sectorData.certifications || {})) {
        const hasCert = certifications.some(c =>
            c.toLowerCase().includes(cert.toLowerCase()) ||
            cert.toLowerCase().includes(c.toLowerCase())
        );
        if (hasCert) {
            certBonus += bonus;
            appliedCerts.push({ cert, bonus: `+${bonus.toLocaleString()}₺` });
        } else {
            recommendedCerts.push({ cert, bonus });
        }
    }

    // Education bonus
    let educationBonus = 0;
    if (education.hasMasters) {educationBonus += 0.08;}
    if (education.hasPhd) {educationBonus += 0.15;}
    if (education.topUniversity) {educationBonus += 0.05;}

    // Location multiplier
    const locationMultiplier = LOCATION_MULTIPLIERS[location.toLowerCase()] || LOCATION_MULTIPLIERS['default'];

    // Company size multiplier
    const companySizeMultiplier = COMPANY_SIZE_MULTIPLIERS[companySize] || 1.0;

    // Calculate final salary range
    const baseMin = baseSalary.min * skillMultiplier * locationMultiplier * companySizeMultiplier * (1 + educationBonus);
    const baseMax = baseSalary.max * skillMultiplier * locationMultiplier * companySizeMultiplier * (1 + educationBonus);
    const baseMedian = baseSalary.median * skillMultiplier * locationMultiplier * companySizeMultiplier * (1 + educationBonus);

    const finalMin = Math.round(baseMin + certBonus);
    const finalMax = Math.round(baseMax + certBonus);
    const finalMedian = Math.round(baseMedian + certBonus);

    // Calculate potential increase with recommendations
    const topMissingSkills = missingHighValueSkills
        .sort((a, b) => b.potentialIncrease - a.potentialIncrease)
        .slice(0, 3);

    const topMissingCerts = recommendedCerts
        .sort((a, b) => b.bonus - a.bonus)
        .slice(0, 2);

    let potentialIncrease = 0;
    topMissingSkills.forEach(s => potentialIncrease += s.estimatedValue);
    topMissingCerts.forEach(c => potentialIncrease += c.bonus);

    // Market position
    const marketPosition = calculateMarketPosition(finalMedian, baseSalary);

    return {
        currentValue: {
            min: finalMin,
            max: finalMax,
            median: finalMedian,
            formatted: {
                min: formatCurrency(finalMin),
                max: formatCurrency(finalMax),
                median: formatCurrency(finalMedian)
            }
        },
        experienceLevel: {
            level,
            years: experience.totalYears,
            label: getLevelLabel(level)
        },
        sector: sectorData.name,
        location: getLocationName(location),
        companySize: getCompanySizeLabel(companySize),
        breakdown: {
            baseSalary: {
                min: formatCurrency(baseSalary.min),
                max: formatCurrency(baseSalary.max),
                median: formatCurrency(baseSalary.median)
            },
            skillMultiplier: `${Math.round((skillMultiplier - 1) * 100)}%`,
            locationMultiplier: `${Math.round((locationMultiplier - 1) * 100)}%`,
            educationBonus: `${Math.round(educationBonus * 100)}%`,
            certificationBonus: formatCurrency(certBonus)
        },
        appliedSkills,
        appliedCertifications: appliedCerts,
        marketPosition,
        recommendations: {
            skills: topMissingSkills.map(s => ({
                ...s,
                message: `${s.skill} öğrenerek maaşınızı ~${formatCurrency(s.estimatedValue)} artırabilirsiniz`
            })),
            certifications: topMissingCerts.map(c => ({
                ...c,
                message: `${c.cert} sertifikası ile +${formatCurrency(c.bonus)} değer katabilirsiniz`
            })),
            potentialIncrease: {
                amount: potentialIncrease,
                formatted: formatCurrency(potentialIncrease),
                percentage: Math.round((potentialIncrease / finalMedian) * 100)
            },
            summary: potentialIncrease > 0
                ? `${topMissingSkills.length > 0 ? topMissingSkills[0].skill : topMissingCerts[0]?.cert} ekleyerek %${Math.round((potentialIncrease / finalMedian) * 100)} daha fazla kazanabilirsiniz!`
                : 'CV\'niz sektör için oldukça optimize!'
        },
        generatedAt: new Date().toISOString()
    };
}

// Helper functions
function extractExperience(cvData) {
    const experiences = cvData?.experience || [];
    let totalMonths = 0;

    experiences.forEach(exp => {
        if (exp.startDate) {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            const months = (end - start) / (1000 * 60 * 60 * 24 * 30);
            totalMonths += Math.max(0, months);
        }
    });

    return {
        totalYears: Math.round(totalMonths / 12),
        count: experiences.length
    };
}

function extractSkills(cvData) {
    const skills = cvData?.skills || [];
    return skills.map(s => typeof s === 'string' ? s : s.name || s.skill || '');
}

function extractCertifications(cvData) {
    const certs = cvData?.certifications || [];
    return certs.map(c => typeof c === 'string' ? c : c.name || '');
}

function extractEducation(cvData) {
    const education = cvData?.education || [];
    const topUniversities = ['boğaziçi', 'odtü', 'itü', 'bilkent', 'koç', 'sabancı', 'galatasaray'];

    return {
        hasMasters: education.some(e =>
            e.degree?.toLowerCase().includes('yüksek lisans') ||
            e.degree?.toLowerCase().includes('master')
        ),
        hasPhd: education.some(e =>
            e.degree?.toLowerCase().includes('doktora') ||
            e.degree?.toLowerCase().includes('phd')
        ),
        topUniversity: education.some(e =>
            topUniversities.some(u =>
                (e.school || e.institution || '').toLowerCase().includes(u)
            )
        )
    };
}

function getExperienceLevel(years) {
    if (years >= 12) {return 'director';}
    if (years >= 8) {return 'lead';}
    if (years >= 5) {return 'senior';}
    if (years >= 2) {return 'mid';}
    return 'junior';
}

function getLevelLabel(level) {
    const labels = {
        junior: 'Junior (0-2 yıl)',
        mid: 'Mid-Level (2-5 yıl)',
        senior: 'Senior (5-8 yıl)',
        lead: 'Lead/Manager (8-12 yıl)',
        director: 'Director+ (12+ yıl)'
    };
    return labels[level] || level;
}

function getLocationName(location) {
    const names = {
        istanbul: 'İstanbul',
        ankara: 'Ankara',
        izmir: 'İzmir',
        bursa: 'Bursa',
        antalya: 'Antalya',
        remote: 'Remote/Uzaktan'
    };
    return names[location.toLowerCase()] || location;
}

function getCompanySizeLabel(size) {
    const labels = {
        startup: 'Startup',
        small: 'Küçük (1-50)',
        medium: 'Orta (50-250)',
        large: 'Büyük (250-1000)',
        enterprise: 'Enterprise (1000+)',
        multinational: 'Çok Uluslu'
    };
    return labels[size] || size;
}

function calculateMarketPosition(median, baseSalary) {
    const range = baseSalary.max - baseSalary.min;
    const position = ((median - baseSalary.min) / range) * 100;

    if (position >= 80) {return { percentile: 'Top 20%', label: 'Piyasanın üstünde', color: 'green' };}
    if (position >= 60) {return { percentile: 'Top 40%', label: 'Ortalamanın üstü', color: 'cyan' };}
    if (position >= 40) {return { percentile: 'Ortalama', label: 'Piyasa ortalaması', color: 'amber' };}
    return { percentile: 'Alt %40', label: 'Ortalamanın altı', color: 'red' };
}

function formatCurrency(amount) {
    return `${Math.round(amount).toLocaleString('tr-TR')}₺`;
}

module.exports = router;
