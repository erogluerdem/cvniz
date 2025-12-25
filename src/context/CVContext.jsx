import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CVContext = createContext(null)

export function CVProvider({ children }) {
    const { user } = useAuth()
    const [cvs, setCvs] = useState([])

    useEffect(() => {
        if (user) {
            loadUserCVs()
        } else {
            setCvs([])
        }
    }, [user])

    const loadUserCVs = () => {
        const allCVs = JSON.parse(localStorage.getItem('cvify_cvs') || '[]')
        const userCVs = allCVs.filter(cv => cv.userId === user?.id)
        setCvs(userCVs)
    }

    const saveCV = (cvData, template, name = 'Untitled CV') => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const allCVs = JSON.parse(localStorage.getItem('cvify_cvs') || '[]')

        const newCV = {
            id: Date.now().toString(),
            userId: user.id,
            name,
            template,
            data: cvData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        allCVs.push(newCV)
        localStorage.setItem('cvify_cvs', JSON.stringify(allCVs))
        loadUserCVs()

        return { success: true, cv: newCV }
    }

    const updateCV = (cvId, updates) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const allCVs = JSON.parse(localStorage.getItem('cvify_cvs') || '[]')
        const index = allCVs.findIndex(cv => cv.id === cvId && cv.userId === user.id)

        if (index === -1) return { success: false, error: 'CV bulunamadı' }

        allCVs[index] = {
            ...allCVs[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        localStorage.setItem('cvify_cvs', JSON.stringify(allCVs))
        loadUserCVs()

        return { success: true, cv: allCVs[index] }
    }

    const deleteCV = (cvId) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const allCVs = JSON.parse(localStorage.getItem('cvify_cvs') || '[]')
        const filtered = allCVs.filter(cv => !(cv.id === cvId && cv.userId === user.id))

        localStorage.setItem('cvify_cvs', JSON.stringify(filtered))
        loadUserCVs()

        return { success: true }
    }

    const duplicateCV = (cvId) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        const cv = cvs.find(c => c.id === cvId)
        if (!cv) return { success: false, error: 'CV bulunamadı' }

        return saveCV(cv.data, cv.template, `${cv.name} (Kopya)`)
    }

    const getAllCVs = () => {
        return JSON.parse(localStorage.getItem('cvify_cvs') || '[]')
    }

    return (
        <CVContext.Provider value={{
            cvs,
            saveCV,
            updateCV,
            deleteCV,
            duplicateCV,
            getAllCVs,
            loadUserCVs
        }}>
            {children}
        </CVContext.Provider>
    )
}

export const useCV = () => useContext(CVContext)
