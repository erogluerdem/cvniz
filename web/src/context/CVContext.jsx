import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { cvAPI } from '../services/api'

const CVContext = createContext(null)

export function CVProvider({ children }) {
    const { user } = useAuth()
    const [cvs, setCvs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            loadUserCVs()
        } else {
            setCvs([])
        }
    }, [user])

    const loadUserCVs = async () => {
        setLoading(true)
        try {
            const response = await cvAPI.getAll()
            if (response.success) {
                setCvs(response.cvs)
                // Cache locally
                localStorage.setItem('CVniz_cvs', JSON.stringify(response.cvs))
            }
        } catch (error) {
            console.error('Load CVs error:', error)
            // Try to load from cache
            try {
                const cached = localStorage.getItem('CVniz_cvs')
                if (cached) {
                    setCvs(JSON.parse(cached))
                }
            } catch (cacheError) {
                console.error('Cache error:', cacheError)
            }
        } finally {
            setLoading(false)
        }
    }

    const saveCV = async (cvData, template, name = 'Adsız CV') => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        try {
            const response = await cvAPI.create({
                name,
                template,
                data: cvData
            })

            if (response.success) {
                setCvs(prev => [response.cv, ...prev])
                return { success: true, cv: response.cv }
            }
            return { success: false, error: response.error }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const updateCV = async (cvId, updates) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        try {
            const response = await cvAPI.update(cvId, updates)

            if (response.success) {
                setCvs(prev => prev.map(cv =>
                    (cv._id === cvId || cv.id === cvId) ? response.cv : cv
                ))
                return { success: true, cv: response.cv }
            }
            return { success: false, error: response.error }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const deleteCV = async (cvId) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        try {
            const response = await cvAPI.delete(cvId)

            if (response.success) {
                setCvs(prev => prev.filter(cv => cv._id !== cvId && cv.id !== cvId))
                return { success: true }
            }
            return { success: false, error: response.error }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const duplicateCV = async (cvId) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }

        try {
            const response = await cvAPI.duplicate(cvId)

            if (response.success) {
                setCvs(prev => [response.cv, ...prev])
                return { success: true, cv: response.cv }
            }
            return { success: false, error: response.error }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const getAllCVs = () => cvs

    // ============ VERSIONING FUNCTIONS ============
    const saveVersion = async (cvId, versionName = null) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }
        try {
            const response = await cvAPI.saveVersion(cvId, versionName)
            if (response.success) {
                // Update local state to include new version
                setCvs(prev => prev.map(cv =>
                    (cv._id === cvId || cv.id === cvId)
                        ? { ...cv, versions: [...(cv.versions || []), response.version] }
                        : cv
                ))
                return { success: true, version: response.version }
            }
            return { success: false, error: response.error }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const getVersions = useCallback((cvId) => {
        const cv = cvs.find(c => c._id === cvId || c.id === cvId)
        return cv?.versions || []
    }, [cvs])

    const restoreVersion = async (cvId, versionId) => {
        if (!user) return { success: false, error: 'Giriş yapmalısınız' }
        try {
            const response = await cvAPI.restoreVersion(cvId, versionId)
            if (response.success) {
                // Update local state with restored CV data
                setCvs(prev => prev.map(cv =>
                    (cv._id === cvId || cv.id === cvId)
                        ? { ...cv, data: response.cv.data, template: response.cv.template }
                        : cv
                ))
                return { success: true, message: 'Versiyon geri yüklendi' }
            }
            return { success: false, error: response.error }
        } catch (error) {
            return { success: false, error: error.message }
        }
    }

    const deleteVersion = async (cvId, versionId) => {
        // Backend doesn't have delete version yet, but we could add it if needed
        return { success: true }
    }

    const compareVersions = (cvId, versionId1, versionId2) => {
        const cv = cvs.find(c => c._id === cvId || c.id === cvId)
        if (!cv || !cv.versions) return null

        const v1 = versionId1 === 'current'
            ? { data: cv.data, name: 'Güncel', template: cv.template }
            : cv.versions.find(v => v.id === versionId1)
        const v2 = versionId2 === 'current'
            ? { data: cv.data, name: 'Güncel', template: cv.template }
            : cv.versions.find(v => v.id === versionId2)

        if (!v1 || !v2) return null
        return { version1: v1, version2: v2 }
    }

    return (
        <CVContext.Provider value={{
            cvs,
            loading,
            saveCV,
            updateCV,
            deleteCV,
            duplicateCV,
            getAllCVs,
            loadUserCVs,
            // Versioning
            saveVersion,
            getVersions,
            restoreVersion,
            deleteVersion,
            compareVersions
        }}>
            {children}
        </CVContext.Provider>
    )
}

export const useCV = () => useContext(CVContext)

