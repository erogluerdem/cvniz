import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const JobBoardContext = createContext(null)

// Sample job listings (in production, this would come from an API)
const SAMPLE_JOBS = [
    {
        id: 'job_1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'İstanbul',
        type: 'Tam Zamanlı',
        remote: true,
        salary: '50,000 - 70,000 TL',
        description: 'React ve TypeScript deneyimli frontend geliştirici arıyoruz.',
        requirements: ['React', 'TypeScript', 'CSS', '5+ yıl deneyim'],
        posted: '2024-12-20',
        logo: null
    },
    {
        id: 'job_2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'Ankara',
        type: 'Tam Zamanlı',
        remote: false,
        salary: '40,000 - 55,000 TL',
        description: 'Dinamik startup ekibimize deneyimli ürün yöneticisi arıyoruz.',
        requirements: ['Ürün yönetimi', 'Agile', 'Analitik düşünme', '3+ yıl deneyim'],
        posted: '2024-12-22',
        logo: null
    },
    {
        id: 'job_3',
        title: 'UX/UI Designer',
        company: 'DesignStudio',
        location: 'İzmir',
        type: 'Yarı Zamanlı',
        remote: true,
        salary: '25,000 - 35,000 TL',
        description: 'Yaratıcı ve kullanıcı odaklı tasarımcı arıyoruz.',
        requirements: ['Figma', 'Adobe XD', 'Kullanıcı araştırması', '2+ yıl deneyim'],
        posted: '2024-12-24',
        logo: null
    },
    {
        id: 'job_4',
        title: 'Backend Developer',
        company: 'DataSoft',
        location: 'İstanbul',
        type: 'Tam Zamanlı',
        remote: true,
        salary: '45,000 - 65,000 TL',
        description: 'Node.js ve Python deneyimli backend geliştirici aranıyor.',
        requirements: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
        posted: '2024-12-23',
        logo: null
    },
    {
        id: 'job_5',
        title: 'Marketing Specialist',
        company: 'GrowthAgency',
        location: 'Remote',
        type: 'Tam Zamanlı',
        remote: true,
        salary: '30,000 - 40,000 TL',
        description: 'Dijital pazarlama uzmanı arıyoruz.',
        requirements: ['Google Ads', 'SEO', 'Sosyal medya', 'İçerik üretimi'],
        posted: '2024-12-25',
        logo: null
    }
]

export function JobBoardProvider({ children }) {
    const { user } = useAuth()
    const [jobs, setJobs] = useState(SAMPLE_JOBS)
    const [applications, setApplications] = useState([])
    const [favorites, setFavorites] = useState([])
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        type: '',
        remote: null
    })

    // Load from localStorage
    useEffect(() => {
        const storedApps = localStorage.getItem('CVniz_job_applications')
        const storedFavs = localStorage.getItem('CVniz_job_favorites')

        if (storedApps) {
            try { setApplications(JSON.parse(storedApps)) } catch (e) { }
        }
        if (storedFavs) {
            try { setFavorites(JSON.parse(storedFavs)) } catch (e) { }
        }
    }, [])

    // Save applications
    const saveApplications = (apps) => {
        setApplications(apps)
        localStorage.setItem('CVniz_job_applications', JSON.stringify(apps))
    }

    // Save favorites
    const saveFavorites = (favs) => {
        setFavorites(favs)
        localStorage.setItem('CVniz_job_favorites', JSON.stringify(favs))
    }

    // Search and filter jobs
    const searchJobs = (searchFilters = {}) => {
        const activeFilters = { ...filters, ...searchFilters }

        return jobs.filter(job => {
            // Search query
            if (activeFilters.search) {
                const query = activeFilters.search.toLowerCase()
                const matches =
                    job.title.toLowerCase().includes(query) ||
                    job.company.toLowerCase().includes(query) ||
                    job.description.toLowerCase().includes(query)
                if (!matches) return false
            }

            // Location filter
            if (activeFilters.location && job.location !== activeFilters.location) {
                return false
            }

            // Type filter
            if (activeFilters.type && job.type !== activeFilters.type) {
                return false
            }

            // Remote filter
            if (activeFilters.remote !== null && job.remote !== activeFilters.remote) {
                return false
            }

            return true
        })
    }

    // Get job by ID
    const getJob = (jobId) => {
        return jobs.find(j => j.id === jobId)
    }

    // Apply to job
    const applyToJob = (jobId, cvId, cvData, coverLetter = '') => {
        const job = getJob(jobId)
        if (!job) return { success: false, error: 'İş ilanı bulunamadı' }

        // Check if already applied
        const existing = applications.find(a => a.jobId === jobId && a.userId === user?.id)
        if (existing) return { success: false, error: 'Bu ilana zaten başvurdunuz' }

        const application = {
            id: `app_${Date.now()}`,
            jobId,
            jobTitle: job.title,
            company: job.company,
            userId: user?.id,
            cvId,
            cvData,
            coverLetter,
            status: 'pending', // pending, viewed, shortlisted, rejected
            appliedAt: new Date().toISOString()
        }

        const newApps = [...applications, application]
        saveApplications(newApps)

        return { success: true, application }
    }

    // Get user's applications
    const getUserApplications = () => {
        return applications.filter(a => a.userId === user?.id)
    }

    // Toggle favorite
    const toggleFavorite = (jobId) => {
        const isFav = favorites.includes(jobId)
        const newFavs = isFav
            ? favorites.filter(id => id !== jobId)
            : [...favorites, jobId]
        saveFavorites(newFavs)
        return !isFav
    }

    // Check if favorited
    const isFavorite = (jobId) => {
        return favorites.includes(jobId)
    }

    // Get favorite jobs
    const getFavoriteJobs = () => {
        return jobs.filter(j => favorites.includes(j.id))
    }

    // Calculate match score between CV and job
    const calculateMatchScore = (cvData, job) => {
        if (!cvData || !job) return 0

        let score = 0
        const skills = cvData.skills?.map(s => s.name?.toLowerCase()) || []
        const requirements = job.requirements?.map(r => r.toLowerCase()) || []

        // Check skill matches
        requirements.forEach(req => {
            if (skills.some(skill => skill.includes(req) || req.includes(skill))) {
                score += 25
            }
        })

        // Check experience
        const experience = cvData.experience || []
        if (experience.length > 0) score += 20
        if (experience.length >= 2) score += 10

        // Cap at 100
        return Math.min(score, 100)
    }

    // Get recommended jobs based on CV
    const getRecommendedJobs = (cvData, limit = 5) => {
        const jobsWithScores = jobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(cvData, job)
        }))

        return jobsWithScores
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, limit)
    }

    // Get unique locations
    const getLocations = () => {
        return [...new Set(jobs.map(j => j.location))]
    }

    // Get unique job types
    const getJobTypes = () => {
        return [...new Set(jobs.map(j => j.type))]
    }

    return (
        <JobBoardContext.Provider value={{
            jobs,
            applications,
            favorites,
            filters,
            setFilters,
            searchJobs,
            getJob,
            applyToJob,
            getUserApplications,
            toggleFavorite,
            isFavorite,
            getFavoriteJobs,
            calculateMatchScore,
            getRecommendedJobs,
            getLocations,
            getJobTypes
        }}>
            {children}
        </JobBoardContext.Provider>
    )
}

export const useJobBoard = () => useContext(JobBoardContext)

