import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { aiAPI } from '../services/api'

const InterviewContext = createContext(null)

// Interview question banks by category
export const QUESTION_BANKS = {
    behavioral: {
        name: 'Davranışsal Sorular',
        description: 'STAR yöntemiyle yanıtlayın',
        questions: [
            { id: 'b1', question: 'Bize zor bir durumu nasıl çözdüğünüzden bahseder misiniz?', tips: ['Durumu net açıklayın', 'Aldığınız aksiyonları belirtin', 'Sonucu paylaşın'] },
            { id: 'b2', question: 'Bir ekip çatışmasını nasıl yönettiniz?', tips: ['Tarafsız kalın', 'İletişim becerilerinizi vurgulayın'] },
            { id: 'b3', question: 'Başarısız olduğunuz bir projeden ne öğrendiniz?', tips: ['Dürüst olun', 'Öğrenme sürecine odaklanın'] },
            { id: 'b4', question: 'Stres altında nasıl çalışırsınız?', tips: ['Somut örnekler verin', 'Başa çıkma stratejilerinizi anlatın'] },
            { id: 'b5', question: 'Liderlik deneyiminizden bahseder misiniz?', tips: ['Ekibi motive etme şeklinizi açıklayın'] }
        ]
    },
    technical: {
        name: 'Teknik Sorular',
        description: 'Uzmanlık alanınıza göre',
        questions: [
            { id: 't1', question: 'Bu pozisyon için gerekli teknik becerileri nasıl edindiniz?', tips: ['Eğitim ve deneyimi birleştirin'] },
            { id: 't2', question: 'Karmaşık bir teknik sorunu nasıl çözdünüz?', tips: ['Adım adım açıklayın'] },
            { id: 't3', question: 'Hangi teknolojilerde uzmanlaşmak istiyorsunuz?', tips: ['Şirketin tech stack\'ini araştırın'] },
            { id: 't4', question: 'Bir projeyi sıfırdan nasıl planlarsınız?', tips: ['Metodolojinizi anlatın'] },
            { id: 't5', question: 'Code review sürecinizi nasıl yürütürsünüz?', tips: ['İşbirliği ve kaliteyi vurgulayın'] }
        ]
    },
    situational: {
        name: 'Durum Soruları',
        description: 'Hipotetik senaryolar',
        questions: [
            { id: 's1', question: 'Deadline\'a yetişemeyeceğinizi fark etseniz ne yaparsınız?', tips: ['Proaktif iletişimi vurgulayın'] },
            { id: 's2', question: 'Yöneticinizle fikir ayrılığı yaşarsanız nasıl davranırsınız?', tips: ['Profesyonelliği koruyun'] },
            { id: 's3', question: 'Ekip arkadaşınız işini yapmıyorsa ne yaparsınız?', tips: ['Önce anlamaya çalışın'] },
            { id: 's4', question: 'Aynı anda birden fazla öncelikli iş olsa hangisini yaparsınız?', tips: ['Önceliklendirme kriterlerinizi açıklayın'] },
            { id: 's5', question: 'Müşteri haksız bir şekilde şikayet ederse ne yaparsınız?', tips: ['Empati gösterin'] }
        ]
    },
    motivation: {
        name: 'Motivasyon Soruları',
        description: 'Kariyer hedefleri',
        questions: [
            { id: 'm1', question: 'Neden bu şirkette çalışmak istiyorsunuz?', tips: ['Şirketi araştırın', 'Değerlerle uyumu gösterin'] },
            { id: 'm2', question: '5 yıl sonra kendinizi nerede görüyorsunuz?', tips: ['Gerçekçi ve hırslı olun'] },
            { id: 'm3', question: 'Sizi bu pozisyona çeken nedir?', tips: ['Tutkunuzu gösterin'] },
            { id: 'm4', question: 'Mevcut işinizden neden ayrılmak istiyorsunuz?', tips: ['Olumlu kalın, kötülemeyin'] },
            { id: 'm5', question: 'Beklediğiniz maaş nedir?', tips: ['Piyasa araştırması yapın'] }
        ]
    }
}

// STAR method template
export const STAR_TEMPLATE = {
    S: { label: 'Situation (Durum)', prompt: 'Durumu açıklayın', example: 'Projemiz ciddi bir gecikmeyle karşı karşıyaydı...' },
    T: { label: 'Task (Görev)', prompt: 'Görevinizi belirtin', example: 'Benim sorumluluğum ekibi koordine etmekti...' },
    A: { label: 'Action (Aksiyon)', prompt: 'Aldığınız aksiyonları anlatın', example: 'Günlük stand-up toplantıları başlattım...' },
    R: { label: 'Result (Sonuç)', prompt: 'Sonucu paylaşın', example: 'Projeyi zamanında teslim ettik ve %20 verimlilik artışı sağladık.' }
}

export function InterviewProvider({ children }) {
    const { user } = useAuth()
    const [sessions, setSessions] = useState([])
    const [currentSession, setCurrentSession] = useState(null)

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('CVniz_interview_sessions')
        if (stored) {
            try {
                setSessions(JSON.parse(stored))
            } catch (e) { }
        }
    }, [])

    // Save sessions
    const saveSessions = (newSessions) => {
        setSessions(newSessions)
        localStorage.setItem('CVniz_interview_sessions', JSON.stringify(newSessions))
    }

    // Start new interview session
    const startSession = (category, targetPosition = '') => {
        const categoryData = QUESTION_BANKS[category]
        if (!categoryData) return null

        const session = {
            id: `session_${Date.now()}`,
            userId: user?.id,
            category,
            targetPosition,
            questions: categoryData.questions.map(q => ({
                ...q,
                answer: '',
                score: null,
                feedback: null,
                starResponse: { S: '', T: '', A: '', R: '' }
            })),
            currentIndex: 0,
            status: 'active', // active, completed, paused
            startedAt: new Date().toISOString(),
            completedAt: null,
            overallScore: null
        }

        setCurrentSession(session)
        return session
    }

    // Save answer
    const saveAnswer = (questionId, answer, starResponse = null) => {
        if (!currentSession) return

        const updatedQuestions = currentSession.questions.map(q =>
            q.id === questionId
                ? { ...q, answer, starResponse: starResponse || q.starResponse }
                : q
        )

        const updatedSession = { ...currentSession, questions: updatedQuestions }
        setCurrentSession(updatedSession)
    }

    // Analyze answer with AI
    const analyzeAnswer = async (questionId) => {
        if (!currentSession) return null

        const question = currentSession.questions.find(q => q.id === questionId)
        if (!question || !question.answer) return null

        let analysisResult;

        try {
            const response = await aiAPI.analyzeInterview({
                question: question.question,
                answer: question.answer,
                starResponse: question.starResponse
            });

            if (response.success && response.data) {
                analysisResult = {
                    score: response.data.score,
                    strengths: response.data.feedback?.strengths || [],
                    improvements: response.data.feedback?.improvements || []
                };
            } else {
                throw new Error("API failed");
            }
        } catch (error) {
            console.warn("Interview Coach API failed, using fallback.", error);
            
            // Simulate AI analysis
            const answer = question.answer.toLowerCase()
            let score = 50
            const feedback = []

            // Check answer length
            if (answer.length > 200) {
                score += 15
                feedback.push({ type: 'positive', text: 'Detaylı cevap verdiniz' })
            } else if (answer.length < 50) {
                score -= 10
                feedback.push({ type: 'negative', text: 'Cevabınız daha detaylı olabilir' })
            }

            // Check for STAR elements
            const starKeywords = {
                situation: ['durum', 'problem', 'sorun', 'karşılaştığım', 'vardı'],
                action: ['yaptım', 'başlattım', 'uyguladım', 'çözdüm', 'organize ettim'],
                result: ['sonuç', 'başardım', 'artış', 'azalış', '%', 'elde ettik']
            }

            if (starKeywords.situation.some(k => answer.includes(k))) {
                score += 10
                feedback.push({ type: 'positive', text: 'Durumu açıkça belirttiniz' })
            }
            if (starKeywords.action.some(k => answer.includes(k))) {
                score += 10
                feedback.push({ type: 'positive', text: 'Aldığınız aksiyonları anlattınız' })
            }
            if (starKeywords.result.some(k => answer.includes(k))) {
                score += 15
                feedback.push({ type: 'positive', text: 'Sonucu somut verilerle desteklediniz' })
            }

            // Add suggestions
            if (!starKeywords.result.some(k => answer.includes(k))) {
                feedback.push({ type: 'suggestion', text: 'Sonuçları rakamlarla destekleyin' })
            }

            score = Math.min(100, Math.max(0, score))

            analysisResult = {
                score,
                feedback,
                strengths: feedback.filter(f => f.type === 'positive').map(f => f.text),
                improvements: feedback.filter(f => f.type !== 'positive').map(f => f.text)
            }
        }

        // Update question with analysis
        const updatedQuestions = currentSession.questions.map(q =>
            q.id === questionId ? { ...q, score, feedback: analysisResult } : q
        )
        setCurrentSession({ ...currentSession, questions: updatedQuestions })

        return analysisResult
    }

    // Move to next question
    const nextQuestion = () => {
        if (!currentSession) return
        const newIndex = Math.min(currentSession.currentIndex + 1, currentSession.questions.length - 1)
        setCurrentSession({ ...currentSession, currentIndex: newIndex })
    }

    // Move to previous question
    const prevQuestion = () => {
        if (!currentSession) return
        const newIndex = Math.max(currentSession.currentIndex - 1, 0)
        setCurrentSession({ ...currentSession, currentIndex: newIndex })
    }

    // Complete session
    const completeSession = () => {
        if (!currentSession) return null

        const answeredQuestions = currentSession.questions.filter(q => q.score !== null)
        const overallScore = answeredQuestions.length > 0
            ? Math.round(answeredQuestions.reduce((sum, q) => sum + q.score, 0) / answeredQuestions.length)
            : 0

        const completedSession = {
            ...currentSession,
            status: 'completed',
            completedAt: new Date().toISOString(),
            overallScore
        }

        const newSessions = [...sessions, completedSession]
        saveSessions(newSessions)
        setCurrentSession(null)

        return completedSession
    }

    // Get user's session history
    const getSessionHistory = () => {
        return sessions.filter(s => s.userId === user?.id)
    }

    // Get session by ID
    const getSession = (sessionId) => {
        return sessions.find(s => s.id === sessionId)
    }

    return (
        <InterviewContext.Provider value={{
            sessions,
            currentSession,
            startSession,
            saveAnswer,
            analyzeAnswer,
            nextQuestion,
            prevQuestion,
            completeSession,
            getSessionHistory,
            getSession,
            QUESTION_BANKS,
            STAR_TEMPLATE
        }}>
            {children}
        </InterviewContext.Provider>
    )
}

export const useInterview = () => useContext(InterviewContext)

