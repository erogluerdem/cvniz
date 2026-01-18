const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');

// Comprehensive position requirements with career paths
const POSITION_REQUIREMENTS = {
    // Engineering
    'Kalite Mühendisi': {
        required: ['Kalite Yönetimi', 'İstatistik', 'Problem Çözme', 'Süreç İyileştirme'],
        preferred: ['Six Sigma', 'ISO 9001', 'Lean Manufacturing', 'FMEA', 'SPC'],
        certifications: ['Six Sigma Green Belt', 'Six Sigma Black Belt', 'ISO 9001 Lead Auditor'],
        experience: ['Kalite Kontrol', 'Denetim'],
        salary_range: { min: 25000, max: 60000 },
        growth_potential: 0.85
    },
    'Fabrika Müdürü': {
        required: ['Üretim Yönetimi', 'Liderlik', 'Bütçe Yönetimi', 'Süreç Optimizasyonu'],
        preferred: ['ERP Sistemleri', 'Yalın Üretim', 'TPM', 'Kaizen', 'Six Sigma Black Belt'],
        certifications: ['PMP', 'Six Sigma Black Belt', 'MBA'],
        experience: ['Üretim Müdürü', 'Kalite Müdürü'],
        salary_range: { min: 50000, max: 150000 },
        growth_potential: 0.75,
        years_required: 10
    },
    'Yazılım Mühendisi': {
        required: ['Programlama', 'Algoritma', 'Veri Yapıları', 'Git'],
        preferred: ['Cloud', 'Docker', 'CI/CD', 'Mikroservis'],
        certifications: ['AWS Certified Developer', 'Azure Developer'],
        salary_range: { min: 30000, max: 80000 },
        growth_potential: 0.95
    },
    'Veri Bilimci': {
        required: ['Python', 'Machine Learning', 'İstatistik', 'SQL'],
        preferred: ['Deep Learning', 'TensorFlow', 'PyTorch', 'NLP'],
        certifications: ['Google Data Analytics', 'IBM Data Science'],
        salary_range: { min: 35000, max: 100000 },
        growth_potential: 0.92
    },
    'Proje Yöneticisi': {
        required: ['Proje Yönetimi', 'Liderlik', 'İletişim', 'Risk Yönetimi'],
        preferred: ['Agile', 'Scrum', 'Jira', 'MS Project'],
        certifications: ['PMP', 'PRINCE2', 'Scrum Master'],
        salary_range: { min: 30000, max: 90000 },
        growth_potential: 0.82
    },
    'İnsan Kaynakları Uzmanı': {
        required: ['İK Süreçleri', 'İşe Alım', 'Performans Yönetimi', 'İletişim'],
        preferred: ['SAP HR', 'İş Hukuku', 'Eğitim ve Gelişim'],
        certifications: ['SHRM-CP', 'PHR'],
        salary_range: { min: 20000, max: 50000 },
        growth_potential: 0.78
    },
    'Dijital Pazarlama Uzmanı': {
        required: ['SEO', 'Google Ads', 'Sosyal Medya', 'Analytics'],
        preferred: ['Content Marketing', 'E-mail Marketing', 'A/B Testing'],
        certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot'],
        salary_range: { min: 18000, max: 55000 },
        growth_potential: 0.88
    },
    'Finans Analisti': {
        required: ['Finansal Analiz', 'Excel', 'Raporlama', 'Muhasebe'],
        preferred: ['SAP', 'Power BI', 'SQL', 'VBA'],
        certifications: ['CFA', 'ACCA', 'SMMM'],
        salary_range: { min: 25000, max: 70000 },
        growth_potential: 0.80
    }
};

// Course recommendations with affiliate links
const COURSE_RECOMMENDATIONS = {
    'Six Sigma': {
        courses: [
            {
                title: 'Lean Six Sigma Green Belt Certification',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/lean-six-sigma-green-belt-certification/?couponCode=CVIFY2024',
                price: 'TL199',
                rating: 4.6,
                students: 125000,
                duration: '15 saat',
                level: 'Intermediate',
                affiliate: true
            },
            {
                title: 'Six Sigma Foundations',
                provider: 'Coursera',
                url: 'https://www.coursera.org/learn/six-sigma-fundamentals?irclickid=CVniz',
                price: 'Ücretsiz (Sertifika ücretli)',
                rating: 4.5,
                duration: '8 saat',
                level: 'Beginner',
                affiliate: true
            }
        ],
        impact: 40,
        priority: 'high',
        description: 'Six Sigma sertifikası iş bulma şansınızı %40 artırır'
    },
    'ISO 9001': {
        courses: [
            {
                title: 'ISO 9001:2015 Quality Management Systems',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/iso-9001-quality-management/?couponCode=CVIFY2024',
                price: 'TL149',
                rating: 4.5,
                students: 45000,
                duration: '8 saat',
                level: 'Beginner',
                affiliate: true
            }
        ],
        impact: 35,
        priority: 'high',
        description: 'ISO 9001 bilgisi Kalite Mühendisliği için zorunlu'
    },
    'PMP': {
        courses: [
            {
                title: 'PMP Certification Exam Prep',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/pmp-certification-exam-prep/?couponCode=CVIFY2024',
                price: 'TL299',
                rating: 4.7,
                students: 200000,
                duration: '35 saat',
                level: 'Advanced',
                affiliate: true
            },
            {
                title: 'Google Project Management Certificate',
                provider: 'Coursera',
                url: 'https://www.coursera.org/professional-certificates/google-project-management?irclickid=CVniz',
                price: 'TL199/ay',
                rating: 4.8,
                duration: '6 ay',
                level: 'Beginner',
                affiliate: true
            }
        ],
        impact: 45,
        priority: 'high'
    },
    'Python': {
        courses: [
            {
                title: '100 Days of Code: Python',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/100-days-of-code/?couponCode=CVIFY2024',
                price: 'TL149',
                rating: 4.7,
                students: 1200000,
                duration: '60 saat',
                level: 'Beginner',
                affiliate: true
            }
        ],
        impact: 50,
        priority: 'high'
    },
    'Machine Learning': {
        courses: [
            {
                title: 'Machine Learning A-Z',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/machinelearning/?couponCode=CVIFY2024',
                price: 'TL199',
                rating: 4.5,
                students: 900000,
                duration: '45 saat',
                level: 'Intermediate',
                affiliate: true
            },
            {
                title: 'Machine Learning by Stanford',
                provider: 'Coursera',
                url: 'https://www.coursera.org/learn/machine-learning?irclickid=CVniz',
                price: 'Ücretsiz',
                rating: 4.9,
                duration: '60 saat',
                level: 'Intermediate',
                affiliate: true
            }
        ],
        impact: 55,
        priority: 'high'
    },
    'AWS': {
        courses: [
            {
                title: 'AWS Certified Solutions Architect',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate/?couponCode=CVIFY2024',
                price: 'TL249',
                rating: 4.7,
                students: 850000,
                duration: '27 saat',
                level: 'Intermediate',
                affiliate: true
            }
        ],
        impact: 42,
        priority: 'medium'
    },
    'Excel': {
        courses: [
            {
                title: 'Microsoft Excel - Excel from Beginner to Advanced',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced-and-beyond/?couponCode=CVIFY2024',
                price: 'TL99',
                rating: 4.6,
                students: 750000,
                duration: '18 saat',
                level: 'Beginner',
                affiliate: true
            }
        ],
        impact: 25,
        priority: 'medium'
    },
    'Google Ads': {
        courses: [
            {
                title: 'Google Ads Masterclass',
                provider: 'Udemy',
                url: 'https://www.udemy.com/course/google-ads-course/?couponCode=CVIFY2024',
                price: 'TL149',
                rating: 4.5,
                students: 120000,
                duration: '12 saat',
                level: 'Beginner',
                affiliate: true
            }
        ],
        impact: 35,
        priority: 'high'
    }
};

// Career roadmaps
const CAREER_ROADMAPS = {
    'Fabrika Müdürü': {
        timeline: [
            {
                year: 1,
                title: 'Kalite Mühendisi / Üretim Mühendisi',
                skills: ['Kalite Yönetimi', 'Üretim Süreçleri', 'İstatistik'],
                certifications: ['Six Sigma Green Belt'],
                salary_range: { min: 25000, max: 40000 }
            },
            {
                year: 2,
                title: 'Kıdemli Mühendis',
                skills: ['Süreç İyileştirme', 'Takım Liderliği', 'Proje Yönetimi'],
                certifications: ['Six Sigma Black Belt', 'ISO 9001 Lead Auditor'],
                salary_range: { min: 35000, max: 55000 }
            },
            {
                year: 4,
                title: 'Üretim Müdür Yardımcısı',
                skills: ['Bütçe Yönetimi', 'ERP Sistemleri', 'Performans Yönetimi'],
                certifications: ['PMP'],
                salary_range: { min: 50000, max: 80000 }
            },
            {
                year: 7,
                title: 'Üretim Müdürü',
                skills: ['Stratejik Planlama', 'Değişim Yönetimi', 'İş Geliştirme'],
                certifications: ['MBA (Önerilir)'],
                salary_range: { min: 70000, max: 120000 }
            },
            {
                year: 10,
                title: 'Fabrika Müdürü',
                skills: ['Genel Yönetim', 'Finansal Planlama', 'Kurumsal Yönetişim'],
                certifications: ['Executive MBA'],
                salary_range: { min: 100000, max: 200000 }
            }
        ]
    },
    'Veri Bilimci': {
        timeline: [
            {
                year: 1,
                title: 'Junior Data Analyst',
                skills: ['Excel', 'SQL', 'Python Temelleri'],
                certifications: ['Google Data Analytics'],
                salary_range: { min: 20000, max: 35000 }
            },
            {
                year: 2,
                title: 'Data Analyst',
                skills: ['Python', 'Pandas', 'Veri Görselleştirme'],
                certifications: ['IBM Data Science'],
                salary_range: { min: 30000, max: 50000 }
            },
            {
                year: 3,
                title: 'Junior Data Scientist',
                skills: ['Machine Learning', 'İstatistik', 'Scikit-learn'],
                certifications: ['AWS Machine Learning'],
                salary_range: { min: 40000, max: 65000 }
            },
            {
                year: 5,
                title: 'Data Scientist',
                skills: ['Deep Learning', 'NLP', 'TensorFlow/PyTorch'],
                certifications: ['Google ML Engineer'],
                salary_range: { min: 55000, max: 90000 }
            }
        ]
    }
};

// GET /api/skill-gap/positions - List available positions
router.get('/positions', (req, res) => {
    const positions = Object.keys(POSITION_REQUIREMENTS).map(name => ({
        name,
        ...POSITION_REQUIREMENTS[name],
        hasRoadmap: !!CAREER_ROADMAPS[name]
    }));
    res.json({ success: true, positions });
});

// POST /api/skill-gap/analyze - AI-powered skill gap analysis
router.post('/analyze', optionalAuth, async (req, res) => {
    try {
        const { cvData, targetPosition, currentTitle } = req.body;

        if (!cvData || !targetPosition) {
            return res.status(400).json({ error: 'CV verisi ve hedef pozisyon gerekli' });
        }

        const requirements = POSITION_REQUIREMENTS[targetPosition];
        if (!requirements) {
            return res.status(404).json({ error: 'Pozisyon bulunamadı' });
        }

        // Extract skills from CV
        const extractedSkills = extractSkillsFromCV(cvData);

        // Analyze gaps
        const analysis = analyzeSkillGaps(extractedSkills, requirements, targetPosition);

        // Add course recommendations
        analysis.courseRecommendations = generateCourseRecommendations(analysis.missingSkills);

        // Add roadmap if available
        if (CAREER_ROADMAPS[targetPosition]) {
            analysis.roadmap = CAREER_ROADMAPS[targetPosition];
        }

        // Calculate impact
        analysis.potentialImpact = calculatePotentialImpact(analysis.missingSkills);

        res.json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error('Skill gap analysis error:', error);
        res.status(500).json({ error: 'Analiz sırasında hata oluştu' });
    }
});

// POST /api/skill-gap/roadmap - Get personalized career roadmap
router.post('/roadmap', optionalAuth, async (req, res) => {
    try {
        const { currentPosition, targetPosition, yearsToGoal } = req.body;

        if (!targetPosition) {
            return res.status(400).json({ error: 'Hedef pozisyon gerekli' });
        }

        const roadmap = CAREER_ROADMAPS[targetPosition];
        if (!roadmap) {
            // Generate generic roadmap
            const requirements = POSITION_REQUIREMENTS[targetPosition];
            if (!requirements) {
                return res.status(404).json({ error: 'Pozisyon bulunamadı' });
            }

            const genericRoadmap = generateGenericRoadmap(requirements, yearsToGoal || 5);
            return res.json({ success: true, roadmap: genericRoadmap, isGeneric: true });
        }

        // Personalize roadmap based on current position
        const personalizedRoadmap = personalizeRoadmap(roadmap, currentPosition, yearsToGoal);

        res.json({
            success: true,
            roadmap: personalizedRoadmap
        });

    } catch (error) {
        console.error('Roadmap error:', error);
        res.status(500).json({ error: 'Yol haritası oluşturulamadı' });
    }
});

// GET /api/skill-gap/courses/:skill - Get course recommendations for a skill
router.get('/courses/:skill', (req, res) => {
    const { skill } = req.params;
    const recommendation = COURSE_RECOMMENDATIONS[skill];

    if (!recommendation) {
        // Return generic search links
        return res.json({
            success: true,
            skill,
            courses: [
                {
                    title: `${skill} Kursu`,
                    provider: 'Udemy',
                    url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}&couponCode=CVIFY2024`,
                    affiliate: true
                },
                {
                    title: `${skill} Eğitimi`,
                    provider: 'Coursera',
                    url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}&irclickid=CVniz`,
                    affiliate: true
                }
            ]
        });
    }

    res.json({
        success: true,
        skill,
        ...recommendation
    });
});

// Helper functions
function extractSkillsFromCV(cvData) {
    const skills = [];

    // From skills array
    if (cvData.skills) {
        cvData.skills.forEach(s => {
            skills.push(typeof s === 'string' ? s : s.name);
        });
    }

    // From experience
    if (cvData.experience) {
        cvData.experience.forEach(exp => {
            if (exp.description) {
                // Extract mentioned skills
                Object.values(COURSE_RECOMMENDATIONS).forEach((rec, skill) => {
                    if (exp.description.toLowerCase().includes(skill.toLowerCase())) {
                        skills.push(skill);
                    }
                });
            }
        });
    }

    // From certifications
    if (cvData.certifications) {
        cvData.certifications.forEach(cert => {
            const name = typeof cert === 'string' ? cert : cert.name;
            skills.push(name);
        });
    }

    return [...new Set(skills)];
}

function analyzeSkillGaps(currentSkills, requirements, targetPosition) {
    const currentSkillsLower = currentSkills.map(s => s.toLowerCase());

    const checkSkill = (skill) => currentSkillsLower.some(cs =>
        cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs)
    );

    const requiredMet = requirements.required.filter(checkSkill);
    const requiredMissing = requirements.required.filter(s => !checkSkill(s));
    const preferredMet = requirements.preferred.filter(checkSkill);
    const preferredMissing = requirements.preferred.filter(s => !checkSkill(s));
    const certsMet = (requirements.certifications || []).filter(checkSkill);
    const certsMissing = (requirements.certifications || []).filter(s => !checkSkill(s));

    // Calculate match score
    const requiredScore = (requiredMet.length / requirements.required.length) * 50;
    const preferredScore = (preferredMet.length / requirements.preferred.length) * 30;
    const certScore = requirements.certifications
        ? (certsMet.length / requirements.certifications.length) * 20
        : 20;

    const matchScore = Math.round(requiredScore + preferredScore + certScore);

    return {
        targetPosition,
        currentSkills,
        matchScore,
        required: { met: requiredMet, missing: requiredMissing },
        preferred: { met: preferredMet, missing: preferredMissing },
        certifications: { met: certsMet, missing: certsMissing },
        missingSkills: [...requiredMissing, ...preferredMissing.slice(0, 3)],
        salaryRange: requirements.salary_range,
        growthPotential: requirements.growth_potential
    };
}

function generateCourseRecommendations(missingSkills) {
    const recommendations = [];

    missingSkills.forEach(skill => {
        const rec = COURSE_RECOMMENDATIONS[skill];
        if (rec) {
            recommendations.push({
                skill,
                impact: rec.impact,
                priority: rec.priority,
                description: rec.description || `${skill} öğrenerek şansınızı %${rec.impact} artırın`,
                courses: rec.courses
            });
        } else {
            recommendations.push({
                skill,
                impact: 20,
                priority: 'medium',
                description: `${skill} becerisini geliştirin`,
                courses: [
                    {
                        title: `${skill} Kursu`,
                        provider: 'Udemy',
                        url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}&couponCode=CVIFY2024`,
                        affiliate: true
                    }
                ]
            });
        }
    });

    // Sort by impact
    return recommendations.sort((a, b) => b.impact - a.impact);
}

function calculatePotentialImpact(missingSkills) {
    let totalImpact = 0;
    missingSkills.forEach(skill => {
        const rec = COURSE_RECOMMENDATIONS[skill];
        totalImpact += rec?.impact || 15;
    });
    return Math.min(totalImpact, 100);
}

function generateGenericRoadmap(requirements, years) {
    const steps = [];
    const skillsPerYear = Math.ceil(requirements.required.length / years);

    for (let i = 0; i < years; i++) {
        const yearSkills = requirements.required.slice(i * skillsPerYear, (i + 1) * skillsPerYear);
        steps.push({
            year: i + 1,
            title: `Aşama ${i + 1}`,
            skills: yearSkills,
            certifications: i >= years - 2 ? requirements.certifications?.slice(0, 1) : []
        });
    }

    return { timeline: steps };
}

function personalizeRoadmap(roadmap, currentPosition, targetYears) {
    // Find starting point based on current position
    let startIndex = 0;
    if (currentPosition) {
        const idx = roadmap.timeline.findIndex(step =>
            step.title.toLowerCase().includes(currentPosition.toLowerCase())
        );
        if (idx >= 0) startIndex = idx;
    }

    return {
        timeline: roadmap.timeline.slice(startIndex),
        estimatedYears: roadmap.timeline.length - startIndex,
        adjustedForExperience: startIndex > 0
    };
}

module.exports = router;

