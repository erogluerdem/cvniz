import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CareerPathContext = createContext(null)

// Career path templates
export const CAREER_PATHS = {
    developer: {
        name: 'Yazılım Geliştirici',
        stages: [
            { level: 1, title: 'Junior Developer', years: '0-2', skills: ['Temel programlama', 'Git', 'Problem çözme'] },
            { level: 2, title: 'Mid-Level Developer', years: '2-5', skills: ['Framework\'ler', 'Veritabanı', 'API tasarımı'] },
            { level: 3, title: 'Senior Developer', years: '5-8', skills: ['Mimari tasarım', 'Mentörlük', 'Code review'] },
            { level: 4, title: 'Tech Lead', years: '8-12', skills: ['Takım yönetimi', 'Teknik karar alma', 'Stakeholder iletişimi'] },
            { level: 5, title: 'Engineering Manager', years: '12+', skills: ['Strateji', 'Bütçe yönetimi', 'Liderlik'] }
        ]
    },
    designer: {
        name: 'Tasarımcı',
        stages: [
            { level: 1, title: 'Junior Designer', years: '0-2', skills: ['Figma/Sketch', 'Renk teorisi', 'Tipografi'] },
            { level: 2, title: 'Mid-Level Designer', years: '2-4', skills: ['UX araştırma', 'Prototipleme', 'Design system'] },
            { level: 3, title: 'Senior Designer', years: '4-7', skills: ['Kullanıcı psikolojisi', 'A/B test', 'Sunum'] },
            { level: 4, title: 'Design Lead', years: '7-10', skills: ['Takım yönetimi', 'Marka stratejisi', 'Stakeholder'] },
            { level: 5, title: 'Head of Design', years: '10+', skills: ['Vizyon belirleme', 'Kültür oluşturma'] }
        ]
    },
    product: {
        name: 'Ürün Yöneticisi',
        stages: [
            { level: 1, title: 'Associate PM', years: '0-2', skills: ['Pazar araştırma', 'Dokümantasyon', 'Analiz'] },
            { level: 2, title: 'Product Manager', years: '2-5', skills: ['Roadmap', 'Kullanıcı görüşmeleri', 'Metrikler'] },
            { level: 3, title: 'Senior PM', years: '5-8', skills: ['Strateji', 'Cross-functional liderlik', 'OKR'] },
            { level: 4, title: 'Group PM', years: '8-12', skills: ['Portfolio yönetimi', 'PM mentörlüğü'] },
            { level: 5, title: 'VP of Product', years: '12+', skills: ['Vizyon', 'Organizasyon tasarımı'] }
        ]
    },
    data: {
        name: 'Veri Bilimci',
        stages: [
            { level: 1, title: 'Junior Data Analyst', years: '0-2', skills: ['SQL', 'Excel', 'Görselleştirme'] },
            { level: 2, title: 'Data Analyst', years: '2-4', skills: ['Python/R', 'İstatistik', 'BI araçları'] },
            { level: 3, title: 'Data Scientist', years: '4-7', skills: ['ML modelleri', 'Feature engineering'] },
            { level: 4, title: 'Senior Data Scientist', years: '7-10', skills: ['MLOps', 'Proje yönetimi'] },
            { level: 5, title: 'Head of Data', years: '10+', skills: ['Veri stratejisi', 'Takım kurma'] }
        ]
    }
}

// Milestone types
export const MILESTONE_TYPES = {
    promotion: { label: 'Terfi', color: 'text-green-400', bg: 'bg-green-500/20' },
    skill: { label: 'Yeni Beceri', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    certification: { label: 'Sertifika', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    project: { label: 'Proje', color: 'text-amber-400', bg: 'bg-amber-500/20' },
    other: { label: 'Diğer', color: 'text-gray-400', bg: 'bg-white/10' }
}

export function CareerPathProvider({ children }) {
    const { user } = useAuth()
    const [careerPlan, setCareerPlan] = useState(null)
    const [milestones, setMilestones] = useState([])
    const [goals, setGoals] = useState([])

    // Load from localStorage
    useEffect(() => {
        const storedPlan = localStorage.getItem('CVniz_career_plan')
        const storedMilestones = localStorage.getItem('CVniz_milestones')
        const storedGoals = localStorage.getItem('CVniz_goals')

        if (storedPlan) {
            try { setCareerPlan(JSON.parse(storedPlan)) } catch (e) { }
        }
        if (storedMilestones) {
            try { setMilestones(JSON.parse(storedMilestones)) } catch (e) { }
        }
        if (storedGoals) {
            try { setGoals(JSON.parse(storedGoals)) } catch (e) { }
        }
    }, [])

    // Save career plan
    const saveCareerPlan = (plan) => {
        setCareerPlan(plan)
        localStorage.setItem('CVniz_career_plan', JSON.stringify(plan))
    }

    // Save milestones
    const saveMilestones = (newMilestones) => {
        setMilestones(newMilestones)
        localStorage.setItem('CVniz_milestones', JSON.stringify(newMilestones))
    }

    // Save goals
    const saveGoals = (newGoals) => {
        setGoals(newGoals)
        localStorage.setItem('CVniz_goals', JSON.stringify(newGoals))
    }

    // Set career path
    const setPath = (pathId, currentLevel = 1) => {
        const path = CAREER_PATHS[pathId]
        if (!path) return

        const plan = {
            id: `plan_${Date.now()}`,
            userId: user?.id,
            pathId,
            pathName: path.name,
            currentLevel,
            targetLevel: path.stages.length,
            stages: path.stages,
            createdAt: new Date().toISOString()
        }

        saveCareerPlan(plan)
        return plan
    }

    // Update current level
    const updateLevel = (newLevel) => {
        if (!careerPlan) return
        saveCareerPlan({ ...careerPlan, currentLevel: newLevel })
    }

    // Add milestone
    const addMilestone = (milestone) => {
        const newMilestone = {
            id: `milestone_${Date.now()}`,
            userId: user?.id,
            ...milestone,
            completed: false,
            createdAt: new Date().toISOString()
        }
        saveMilestones([...milestones, newMilestone])
        return newMilestone
    }

    // Toggle milestone completion
    const toggleMilestone = (milestoneId) => {
        const updated = milestones.map(m =>
            m.id === milestoneId ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : null } : m
        )
        saveMilestones(updated)
    }

    // Delete milestone
    const deleteMilestone = (milestoneId) => {
        saveMilestones(milestones.filter(m => m.id !== milestoneId))
    }

    // Add goal
    const addGoal = (goal) => {
        const newGoal = {
            id: `goal_${Date.now()}`,
            userId: user?.id,
            ...goal,
            progress: 0,
            createdAt: new Date().toISOString()
        }
        saveGoals([...goals, newGoal])
        return newGoal
    }

    // Update goal progress
    const updateGoalProgress = (goalId, progress) => {
        const updated = goals.map(g =>
            g.id === goalId ? { ...g, progress: Math.min(100, Math.max(0, progress)) } : g
        )
        saveGoals(updated)
    }

    // Delete goal
    const deleteGoal = (goalId) => {
        saveGoals(goals.filter(g => g.id !== goalId))
    }

    // Get progress percentage
    const getProgress = () => {
        if (!careerPlan) return 0
        return Math.round(((careerPlan.currentLevel) / careerPlan.targetLevel) * 100)
    }

    // Get next stage requirements
    const getNextStage = () => {
        if (!careerPlan || careerPlan.currentLevel >= careerPlan.stages.length) return null
        return careerPlan.stages[careerPlan.currentLevel]
    }

    // Get user's milestones
    const getUserMilestones = () => {
        return milestones.filter(m => m.userId === user?.id)
    }

    // Get user's goals
    const getUserGoals = () => {
        return goals.filter(g => g.userId === user?.id)
    }

    return (
        <CareerPathContext.Provider value={{
            careerPlan,
            milestones,
            goals,
            setPath,
            updateLevel,
            addMilestone,
            toggleMilestone,
            deleteMilestone,
            addGoal,
            updateGoalProgress,
            deleteGoal,
            getProgress,
            getNextStage,
            getUserMilestones,
            getUserGoals,
            CAREER_PATHS,
            MILESTONE_TYPES
        }}>
            {children}
        </CareerPathContext.Provider>
    )
}

export const useCareerPath = () => useContext(CareerPathContext)

