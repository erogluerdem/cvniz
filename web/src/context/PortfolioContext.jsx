import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useCV } from './CVContext'

const PortfolioContext = createContext(null)

// Portfolio themes
export const PORTFOLIO_THEMES = {
    minimal: {
        id: 'minimal',
        name: 'Minimal',
        description: 'Temiz ve sade tasarım',
        primaryColor: '#22d3ee',
        bgColor: '#0f172a'
    },
    elegant: {
        id: 'elegant',
        name: 'Elegant',
        description: 'Şık ve profesyonel',
        primaryColor: '#a855f7',
        bgColor: '#1e1b4b'
    },
    bold: {
        id: 'bold',
        name: 'Bold',
        description: 'Cesur ve dikkat çekici',
        primaryColor: '#f97316',
        bgColor: '#1c1917'
    },
    nature: {
        id: 'nature',
        name: 'Nature',
        description: 'Doğal ve sakin',
        primaryColor: '#22c55e',
        bgColor: '#14532d'
    }
}

// Project categories
export const PROJECT_CATEGORIES = {
    web: 'Web Uygulaması',
    mobile: 'Mobil Uygulama',
    design: 'Tasarım',
    other: 'Diğer'
}

export function PortfolioProvider({ children }) {
    const { user } = useAuth()
    const { cvs } = useCV()
    const [portfolio, setPortfolio] = useState(null)
    const [projects, setProjects] = useState([])

    // Load from localStorage
    useEffect(() => {
        const storedPortfolio = localStorage.getItem('CVniz_portfolio')
        const storedProjects = localStorage.getItem('CVniz_portfolio_projects')

        if (storedPortfolio) {
            try { setPortfolio(JSON.parse(storedPortfolio)) } catch (e) { }
        }
        if (storedProjects) {
            try { setProjects(JSON.parse(storedProjects)) } catch (e) { }
        }
    }, [])

    // Save portfolio
    const savePortfolio = (newPortfolio) => {
        setPortfolio(newPortfolio)
        localStorage.setItem('CVniz_portfolio', JSON.stringify(newPortfolio))
    }

    // Save projects
    const saveProjects = (newProjects) => {
        setProjects(newProjects)
        localStorage.setItem('CVniz_portfolio_projects', JSON.stringify(newProjects))
    }

    // Create portfolio
    const createPortfolio = (data) => {
        const newPortfolio = {
            id: `portfolio_${Date.now()}`,
            userId: user?.id,
            slug: generateSlug(data.name || user?.name),
            name: data.name || user?.name,
            title: data.title || '',
            bio: data.bio || '',
            avatar: data.avatar || null,
            theme: data.theme || 'minimal',
            socialLinks: data.socialLinks || {},
            cvId: data.cvId || null,
            showCV: data.showCV ?? true,
            isPublished: false,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        savePortfolio(newPortfolio)
        return newPortfolio
    }

    // Generate URL slug
    const generateSlug = (name) => {
        if (!name) return `user_${Date.now()}`
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
    }

    // Update portfolio
    const updatePortfolio = (updates) => {
        if (!portfolio) return
        const updated = { ...portfolio, ...updates, updatedAt: new Date().toISOString() }
        savePortfolio(updated)
        return updated
    }

    // Publish/unpublish portfolio
    const togglePublish = () => {
        if (!portfolio) return
        return updatePortfolio({ isPublished: !portfolio.isPublished })
    }

    // Add project
    const addProject = (projectData) => {
        const newProject = {
            id: `project_${Date.now()}`,
            userId: user?.id,
            title: projectData.title || 'Yeni Proje',
            description: projectData.description || '',
            category: projectData.category || 'web',
            image: projectData.image || null,
            technologies: projectData.technologies || [],
            liveUrl: projectData.liveUrl || '',
            githubUrl: projectData.githubUrl || '',
            featured: projectData.featured || false,
            order: projects.length,
            createdAt: new Date().toISOString()
        }

        saveProjects([...projects, newProject])
        return newProject
    }

    // Update project
    const updateProject = (projectId, updates) => {
        const updated = projects.map(p =>
            p.id === projectId ? { ...p, ...updates } : p
        )
        saveProjects(updated)
    }

    // Delete project
    const deleteProject = (projectId) => {
        saveProjects(projects.filter(p => p.id !== projectId))
    }

    // Reorder projects
    const reorderProjects = (startIndex, endIndex) => {
        const result = Array.from(projects)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)

        const reordered = result.map((p, i) => ({ ...p, order: i }))
        saveProjects(reordered)
    }

    // Get user's projects
    const getUserProjects = () => {
        return projects
            .filter(p => p.userId === user?.id)
            .sort((a, b) => a.order - b.order)
    }

    // Import from CV
    const importFromCV = (cvId) => {
        const cv = cvs?.find(c => c.id === cvId)
        if (!cv || !portfolio) return

        const updates = {
            name: cv.personalInfo?.fullName || portfolio.name,
            title: cv.personalInfo?.title || portfolio.title,
            bio: cv.personalInfo?.summary || portfolio.bio,
            cvId
        }

        // Add experience as projects
        if (cv.experience) {
            cv.experience.forEach(exp => {
                addProject({
                    title: exp.company || 'İş Deneyimi',
                    description: exp.description || '',
                    category: 'other',
                    technologies: []
                })
            })
        }

        updatePortfolio(updates)
    }

    // Get portfolio preview URL
    const getPreviewUrl = () => {
        if (!portfolio) return null
        return `https://portfolio.CVniz.com/${portfolio.slug}`
    }

    // Record view
    const recordView = () => {
        if (!portfolio) return
        updatePortfolio({ views: (portfolio.views || 0) + 1 })
    }

    return (
        <PortfolioContext.Provider value={{
            portfolio,
            projects,
            createPortfolio,
            updatePortfolio,
            togglePublish,
            addProject,
            updateProject,
            deleteProject,
            reorderProjects,
            getUserProjects,
            importFromCV,
            getPreviewUrl,
            recordView,
            PORTFOLIO_THEMES,
            PROJECT_CATEGORIES
        }}>
            {children}
        </PortfolioContext.Provider>
    )
}

export const usePortfolio = () => useContext(PortfolioContext)

