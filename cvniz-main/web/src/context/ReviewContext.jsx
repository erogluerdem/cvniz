import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const ReviewContext = createContext(null)

// Review pricing
export const REVIEW_TYPES = {
    ai: {
        id: 'ai',
        name: 'AI İnceleme',
        price: 29,
        duration: 'Anında',
        description: 'Yapay zeka destekli otomatik analiz',
        features: ['ATS uyumluluk', 'Anahtar kelime analizi', 'Format kontrolü', 'Öneriler']
    },
    expert: {
        id: 'expert',
        name: 'Uzman İnceleme',
        price: 149,
        duration: '48 saat',
        description: 'Profesyonel kariyer danışmanı incelemesi',
        features: ['Detaylı analiz', 'Kişisel öneriler', 'Sektör uyumu', 'Revizyon desteği']
    },
    premium: {
        id: 'premium',
        name: 'Görüntülü Uzman Analizi',
        price: 249,
        duration: '24 saat',
        description: 'Video görüşmeli kapsamlı uzman incelemesi',
        features: ['Uzman inceleme', '15 dk video görüşme', 'CV düzenleme', '1 hafta destek']
    }
}

export function ReviewProvider({ children }) {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('CVniz_reviews')
        if (stored) {
            try {
                setReviews(JSON.parse(stored))
            } catch (e) {
                console.error('Reviews load error:', e)
            }
        }
    }, [])

    // Save to localStorage
    const saveReviews = (newReviews) => {
        setReviews(newReviews)
        localStorage.setItem('CVniz_reviews', JSON.stringify(newReviews))
    }

    // Request a review
    const requestReview = (cvId, cvData, reviewType, notes = '') => {
        const type = REVIEW_TYPES[reviewType]
        if (!type) return { success: false, error: 'Geçersiz inceleme türü' }

        const review = {
            id: `review_${Date.now()}`,
            userId: user?.id,
            cvId,
            cvData,
            type: reviewType,
            price: type.price,
            status: reviewType === 'ai' ? 'processing' : 'pending', // pending, processing, completed, cancelled
            notes,
            createdAt: new Date().toISOString(),
            completedAt: null,
            assignedTo: null,
            feedback: null,
            rating: null
        }

        const newReviews = [...reviews, review]
        saveReviews(newReviews)

        // If AI review, process immediately
        if (reviewType === 'ai') {
            setTimeout(() => processAIReview(review.id), 2000)
        }

        return { success: true, review }
    }

    // Process AI review
    const processAIReview = (reviewId) => {
        const review = reviews.find(r => r.id === reviewId)
        if (!review) return

        // Simulate AI analysis
        const feedback = generateAIFeedback(review.cvData)

        const updatedReview = {
            ...review,
            status: 'completed',
            completedAt: new Date().toISOString(),
            feedback
        }

        const newReviews = reviews.map(r => r.id === reviewId ? updatedReview : r)
        saveReviews(newReviews)
    }

    // Generate AI feedback
    const generateAIFeedback = (cvData) => {
        const sections = []
        let overallScore = 0
        let count = 0

        // Personal info check
        const personal = cvData?.personal || {}
        const personalScore = [personal.fullName, personal.email, personal.phone, personal.summary]
            .filter(Boolean).length / 4 * 100
        sections.push({
            name: 'Kişisel Bilgiler',
            score: Math.round(personalScore),
            issues: [],
            suggestions: []
        })
        if (!personal.summary) sections[0].issues.push('Profesyonel özet eksik')
        if (!personal.linkedin) sections[0].suggestions.push('LinkedIn profil linki ekleyin')
        overallScore += personalScore
        count++

        // Experience check
        const experience = cvData?.experience || []
        const expScore = experience.length > 0 ? Math.min(experience.length * 25, 100) : 0
        sections.push({
            name: 'İş Deneyimi',
            score: Math.round(expScore),
            issues: experience.length === 0 ? ['İş deneyimi bilgisi eksik'] : [],
            suggestions: experience.length < 3 ? ['Daha fazla deneyim detayı ekleyin'] : []
        })
        overallScore += expScore
        count++

        // Education check
        const education = cvData?.education || []
        const eduScore = education.length > 0 ? 100 : 0
        sections.push({
            name: 'Eğitim',
            score: eduScore,
            issues: education.length === 0 ? ['Eğitim bilgisi eksik'] : [],
            suggestions: []
        })
        overallScore += eduScore
        count++

        // Skills check
        const skills = cvData?.skills || []
        const skillScore = Math.min(skills.length * 10, 100)
        sections.push({
            name: 'Beceriler',
            score: skillScore,
            issues: skills.length < 5 ? ['Daha fazla beceri ekleyin'] : [],
            suggestions: ['Sektöre özel anahtar kelimeler kullanın']
        })
        overallScore += skillScore
        count++

        return {
            overallScore: Math.round(overallScore / count),
            sections,
            summary: overallScore / count > 70
                ? 'CV\'niz iyi durumda! Küçük iyileştirmelerle daha da güçlendirebilirsiniz.'
                : 'CV\'nizde geliştirilmesi gereken alanlar var. Önerileri inceleyerek iyileştirme yapabilirsiniz.',
            topSuggestions: [
                'ATS uyumlu format kullanın',
                'Somut başarılarınızı rakamlarla destekleyin',
                'Her pozisyon için özelleştirilmiş CV hazırlayın'
            ]
        }
    }

    // Get user's reviews
    const getUserReviews = () => {
        return reviews.filter(r => r.userId === user?.id)
    }

    // Get review by ID
    const getReview = (reviewId) => {
        return reviews.find(r => r.id === reviewId)
    }

    // Get all pending reviews (admin)
    const getPendingReviews = () => {
        return reviews.filter(r => r.status === 'pending')
    }

    // Assign reviewer (admin)
    const assignReviewer = (reviewId, reviewerName) => {
        const review = reviews.find(r => r.id === reviewId)
        if (!review) return { success: false }

        const updatedReview = {
            ...review,
            status: 'processing',
            assignedTo: reviewerName
        }

        const newReviews = reviews.map(r => r.id === reviewId ? updatedReview : r)
        saveReviews(newReviews)
        return { success: true }
    }

    // Complete review (admin/reviewer)
    const completeReview = (reviewId, feedback) => {
        const review = reviews.find(r => r.id === reviewId)
        if (!review) return { success: false }

        const updatedReview = {
            ...review,
            status: 'completed',
            completedAt: new Date().toISOString(),
            feedback
        }

        const newReviews = reviews.map(r => r.id === reviewId ? updatedReview : r)
        saveReviews(newReviews)
        return { success: true }
    }

    // Rate review
    const rateReview = (reviewId, rating) => {
        const review = reviews.find(r => r.id === reviewId)
        if (!review) return { success: false }

        const updatedReview = { ...review, rating }
        const newReviews = reviews.map(r => r.id === reviewId ? updatedReview : r)
        saveReviews(newReviews)
        return { success: true }
    }

    // Cancel review
    const cancelReview = (reviewId) => {
        const review = reviews.find(r => r.id === reviewId)
        if (!review || review.status === 'completed') return { success: false }

        const updatedReview = { ...review, status: 'cancelled' }
        const newReviews = reviews.map(r => r.id === reviewId ? updatedReview : r)
        saveReviews(newReviews)
        return { success: true }
    }

    return (
        <ReviewContext.Provider value={{
            reviews,
            loading,
            requestReview,
            getUserReviews,
            getReview,
            getPendingReviews,
            assignReviewer,
            completeReview,
            rateReview,
            cancelReview,
            REVIEW_TYPES
        }}>
            {children}
        </ReviewContext.Provider>
    )
}

export const useReview = () => useContext(ReviewContext)

