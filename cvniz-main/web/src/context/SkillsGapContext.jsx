import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useCV } from './CVContext'

const SkillsGapContext = createContext(null)

// In-demand skills by category
export const SKILL_CATEGORIES = {
    programming: {
        name: 'Programlama',
        skills: ['JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'C#']
    },
    frontend: {
        name: 'Frontend',
        skills: ['React', 'Vue.js', 'Angular', 'Next.js', 'Tailwind CSS', 'Sass', 'HTML5', 'CSS3']
    },
    backend: {
        name: 'Backend',
        skills: ['Node.js', 'Django', 'FastAPI', 'Spring Boot', '.NET', 'Express.js', 'GraphQL', 'REST API']
    },
    database: {
        name: 'Veritabanı',
        skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'Firebase', 'Supabase']
    },
    devops: {
        name: 'DevOps',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Terraform', 'Linux']
    },
    data: {
        name: 'Veri',
        skills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Data Analysis', 'SQL', 'Pandas']
    },
    soft: {
        name: 'Soft Skills',
        skills: ['Liderlik', 'İletişim', 'Problem Çözme', 'Takım Çalışması', 'Zaman Yönetimi', 'Sunum']
    }
}

// Position requirements with more roles
export const POSITION_REQUIREMENTS = {
    'Frontend Developer': {
        required: ['JavaScript', 'React', 'HTML5', 'CSS3', 'Git'],
        preferred: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Testing'],
        soft: ['İletişim', 'Problem Çözme'],
        certifications: ['Meta Front-End Developer']
    },
    'Backend Developer': {
        required: ['Python', 'Node.js', 'PostgreSQL', 'REST API', 'Git'],
        preferred: ['Docker', 'AWS', 'GraphQL', 'Redis'],
        soft: ['Problem Çözme', 'Analitik Düşünme'],
        certifications: ['AWS Certified Developer']
    },
    'Full Stack Developer': {
        required: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
        preferred: ['TypeScript', 'Docker', 'AWS', 'MongoDB'],
        soft: ['İletişim', 'Problem Çözme', 'Takım Çalışması'],
        certifications: ['AWS Certified Developer', 'Meta Back-End Developer']
    },
    'DevOps Engineer': {
        required: ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'AWS'],
        preferred: ['Terraform', 'Python', 'Monitoring', 'Security'],
        soft: ['Problem Çözme', 'Otomasyon'],
        certifications: ['AWS Solutions Architect', 'Kubernetes Administrator']
    },
    'Data Scientist': {
        required: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Pandas'],
        preferred: ['Deep Learning', 'TensorFlow', 'PyTorch', 'NLP'],
        soft: ['Analitik Düşünme', 'Sunum'],
        certifications: ['Google Data Analytics', 'IBM Data Science']
    },
    'Product Manager': {
        required: ['Roadmap', 'User Research', 'Agile', 'Data Analysis', 'Jira'],
        preferred: ['SQL', 'A/B Testing', 'UX Design', 'Technical Knowledge'],
        soft: ['Liderlik', 'İletişim', 'Strateji'],
        certifications: ['Google Project Management', 'Scrum Master']
    },
    'Kalite Mühendisi': {
        required: ['Kalite Yönetimi', 'İstatistik', 'Problem Çözme', 'Süreç İyileştirme'],
        preferred: ['Six Sigma', 'ISO 9001', 'Lean Manufacturing', 'FMEA', 'SPC'],
        soft: ['Analitik Düşünme', 'İletişim'],
        certifications: ['Six Sigma Green Belt', 'Six Sigma Black Belt', 'ISO 9001 Lead Auditor']
    },
    'Fabrika Müdürü': {
        required: ['Üretim Yönetimi', 'Liderlik', 'Bütçe Yönetimi', 'Süreç Optimizasyonu'],
        preferred: ['ERP Sistemleri', 'Yalın Üretim', 'TPM', 'Kaizen', 'Six Sigma Black Belt'],
        soft: ['Stratejik Düşünme', 'Değişim Yönetimi'],
        certifications: ['PMP', 'Six Sigma Black Belt', 'MBA']
    },
    'Dijital Pazarlama Uzmanı': {
        required: ['SEO', 'Google Ads', 'Sosyal Medya', 'Analytics'],
        preferred: ['Content Marketing', 'E-mail Marketing', 'A/B Testing'],
        soft: ['Yaratıcılık', 'Analitik Düşünme'],
        certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot']
    },
    'Finans Analisti': {
        required: ['Finansal Analiz', 'Excel', 'Raporlama', 'Muhasebe'],
        preferred: ['SAP', 'Power BI', 'SQL', 'VBA'],
        soft: ['Dikkat', 'Analitik Düşünme'],
        certifications: ['CFA', 'ACCA', 'SMMM']
    }
}

// Learning resources with affiliate links
export const LEARNING_RESOURCES = {
    'JavaScript': [
        { name: 'JavaScript Masterclass', url: 'https://www.udemy.com/course/javascript-bootcamp/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺149', rating: 4.7, impact: 35 },
        { name: 'JavaScript.info', url: 'https://javascript.info', type: 'free', provider: 'Web' }
    ],
    'React': [
        { name: 'React - The Complete Guide', url: 'https://www.udemy.com/course/react-the-complete-guide/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺199', rating: 4.8, impact: 40 },
        { name: 'React Docs', url: 'https://react.dev', type: 'free', provider: 'Official' }
    ],
    'Python': [
        { name: '100 Days of Code: Python', url: 'https://www.udemy.com/course/100-days-of-code/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺149', rating: 4.7, impact: 50 },
        { name: 'Python for Everybody', url: 'https://www.coursera.org/specializations/python?irclickid=CVniz', type: 'freemium', provider: 'Coursera', rating: 4.8 }
    ],
    'Six Sigma': [
        { name: 'Lean Six Sigma Green Belt', url: 'https://www.udemy.com/course/lean-six-sigma-green-belt/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺199', rating: 4.6, impact: 40, highlight: true },
        { name: 'Six Sigma Yellow Belt', url: 'https://www.coursera.org/learn/six-sigma-fundamentals?irclickid=CVniz', type: 'freemium', provider: 'Coursera', rating: 4.5 }
    ],
    'ISO 9001': [
        { name: 'ISO 9001:2015 Complete Course', url: 'https://www.udemy.com/course/iso-9001-quality-management/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺149', rating: 4.5, impact: 35, highlight: true }
    ],
    'Docker': [
        { name: 'Docker Mastery', url: 'https://www.udemy.com/course/docker-mastery/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺179', rating: 4.7, impact: 38 },
        { name: 'Docker Docs', url: 'https://docs.docker.com/get-started/', type: 'free', provider: 'Official' }
    ],
    'AWS': [
        { name: 'AWS Solutions Architect Associate', url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺249', rating: 4.7, impact: 42 },
        { name: 'AWS Free Tier', url: 'https://aws.amazon.com/free', type: 'free', provider: 'AWS' }
    ],
    'Machine Learning': [
        { name: 'Machine Learning A-Z', url: 'https://www.udemy.com/course/machinelearning/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺199', rating: 4.5, impact: 55 },
        { name: 'Machine Learning by Stanford', url: 'https://www.coursera.org/learn/machine-learning?irclickid=CVniz', type: 'freemium', provider: 'Coursera', rating: 4.9, impact: 55 }
    ],
    'PMP': [
        { name: 'PMP Certification Exam Prep', url: 'https://www.udemy.com/course/pmp-certification-exam-prep/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺299', rating: 4.7, impact: 45 },
        { name: 'Google Project Management', url: 'https://www.coursera.org/professional-certificates/google-project-management?irclickid=CVniz', type: 'paid', provider: 'Coursera', price: '₺199/ay', rating: 4.8, impact: 45 }
    ],
    'Google Ads': [
        { name: 'Google Ads Masterclass', url: 'https://www.udemy.com/course/google-ads-course/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺149', rating: 4.5, impact: 35 }
    ],
    'Excel': [
        { name: 'Excel from Beginner to Advanced', url: 'https://www.udemy.com/course/microsoft-excel-2013-from-beginner-to-advanced/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺99', rating: 4.6, impact: 25 }
    ],
    'SQL': [
        { name: 'The Complete SQL Bootcamp', url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/?couponCode=CVIFY2024', type: 'paid', provider: 'Udemy', price: '₺149', rating: 4.7, impact: 35 }
    ]
}

export function SkillsGapProvider({ children }) {
    const { user } = useAuth()
    const { cvs } = useCV()
    const [analyses, setAnalyses] = useState([])
    const [learningPlan, setLearningPlan] = useState([])

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('CVniz_skills_analyses')
        const storedPlan = localStorage.getItem('CVniz_learning_plan')
        if (stored) {
            try { setAnalyses(JSON.parse(stored)) } catch (e) { }
        }
        if (storedPlan) {
            try { setLearningPlan(JSON.parse(storedPlan)) } catch (e) { }
        }
    }, [])

    // Save analyses
    const saveAnalyses = (newAnalyses) => {
        setAnalyses(newAnalyses)
        localStorage.setItem('CVniz_skills_analyses', JSON.stringify(newAnalyses))
    }

    // Save learning plan
    const saveLearningPlan = (plan) => {
        setLearningPlan(plan)
        localStorage.setItem('CVniz_learning_plan', JSON.stringify(plan))
    }

    // Extract skills from CV
    const extractSkillsFromCV = (cvId) => {
        const cv = cvs?.find(c => c.id === cvId)
        if (!cv) return []

        const skills = []

        // From skills section
        if (cv.skills) {
            cv.skills.forEach(s => {
                skills.push(typeof s === 'string' ? s : s.name)
            })
        }

        // From experience descriptions
        if (cv.experience) {
            cv.experience.forEach(exp => {
                if (exp.description) {
                    // Simple keyword extraction
                    Object.values(SKILL_CATEGORIES).forEach(cat => {
                        cat.skills.forEach(skill => {
                            if (exp.description.toLowerCase().includes(skill.toLowerCase())) {
                                skills.push(skill)
                            }
                        })
                    })
                }
            })
        }

        return [...new Set(skills)]
    }

    // Analyze skills gap
    const analyzeGap = (cvId, targetPosition) => {
        const requirements = POSITION_REQUIREMENTS[targetPosition]
        if (!requirements) return null

        const currentSkills = extractSkillsFromCV(cvId)
        const currentSkillsLower = currentSkills.map(s => s.toLowerCase())

        // Find matching and missing skills
        const checkSkill = (skill) => currentSkillsLower.some(cs =>
            cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs)
        )

        const requiredMet = requirements.required.filter(checkSkill)
        const requiredMissing = requirements.required.filter(s => !checkSkill(s))
        const preferredMet = requirements.preferred.filter(checkSkill)
        const preferredMissing = requirements.preferred.filter(s => !checkSkill(s))

        // Calculate score
        const requiredScore = (requiredMet.length / requirements.required.length) * 70
        const preferredScore = (preferredMet.length / requirements.preferred.length) * 30
        const totalScore = Math.round(requiredScore + preferredScore)

        const analysis = {
            id: `analysis_${Date.now()}`,
            userId: user?.id,
            cvId,
            targetPosition,
            currentSkills,
            score: totalScore,
            required: {
                met: requiredMet,
                missing: requiredMissing
            },
            preferred: {
                met: preferredMet,
                missing: preferredMissing
            },
            recommendations: generateRecommendations(requiredMissing, preferredMissing),
            createdAt: new Date().toISOString()
        }

        saveAnalyses([...analyses, analysis])
        return analysis
    }

    // Generate recommendations
    const generateRecommendations = (requiredMissing, preferredMissing) => {
        const recommendations = []

        // Priority: required skills first
        requiredMissing.forEach(skill => {
            const resources = LEARNING_RESOURCES[skill]
            recommendations.push({
                skill,
                priority: 'high',
                reason: 'Bu pozisyon için zorunlu',
                resources: resources || [{ name: `${skill} öğren`, url: `https://google.com/search?q=${skill}+tutorial`, type: 'free' }]
            })
        })

        // Then preferred
        preferredMissing.slice(0, 3).forEach(skill => {
            const resources = LEARNING_RESOURCES[skill]
            recommendations.push({
                skill,
                priority: 'medium',
                reason: 'Tercih edilen beceri',
                resources: resources || [{ name: `${skill} öğren`, url: `https://google.com/search?q=${skill}+tutorial`, type: 'free' }]
            })
        })

        return recommendations
    }

    // Add to learning plan
    const addToLearningPlan = (skill, targetDate = null) => {
        const item = {
            id: `learn_${Date.now()}`,
            userId: user?.id,
            skill,
            targetDate,
            progress: 0,
            status: 'planned', // planned, in-progress, completed
            createdAt: new Date().toISOString()
        }
        saveLearningPlan([...learningPlan, item])
        return item
    }

    // Update learning progress
    const updateLearningProgress = (itemId, progress, status = null) => {
        const updated = learningPlan.map(item =>
            item.id === itemId
                ? { ...item, progress, status: status || (progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'planned') }
                : item
        )
        saveLearningPlan(updated)
    }

    // Remove from learning plan
    const removeFromLearningPlan = (itemId) => {
        saveLearningPlan(learningPlan.filter(item => item.id !== itemId))
    }

    // Get user's analyses
    const getUserAnalyses = () => {
        return analyses.filter(a => a.userId === user?.id)
    }

    // Get user's learning plan
    const getUserLearningPlan = () => {
        return learningPlan.filter(p => p.userId === user?.id)
    }

    return (
        <SkillsGapContext.Provider value={{
            analyses,
            learningPlan,
            extractSkillsFromCV,
            analyzeGap,
            addToLearningPlan,
            updateLearningProgress,
            removeFromLearningPlan,
            getUserAnalyses,
            getUserLearningPlan,
            SKILL_CATEGORIES,
            POSITION_REQUIREMENTS,
            LEARNING_RESOURCES
        }}>
            {children}
        </SkillsGapContext.Provider>
    )
}

export const useSkillsGap = () => useContext(SkillsGapContext)

