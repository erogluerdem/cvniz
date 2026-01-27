import React, { createContext, useContext, useState, useEffect } from 'react'
import { templateAPI } from '../services/api'
import { WEB_CV_TEMPLATES } from '../data/webCVTemplates'

const TemplateContext = createContext()

export function TemplateProvider({ children }) {
    const [templates, setTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Cache duration: 24 hours
    const CACHE_DURATION = 24 * 60 * 60 * 1000

    const fetchTemplates = async (forceRefresh = false) => {
        setIsLoading(true)

        // Try to load from cache first if not forcing refresh
        if (!forceRefresh) {
            const cached = localStorage.getItem('CVniz_templates_cache')
            if (cached) {
                try {
                    const parsed = JSON.parse(cached)
                    const now = Date.now()
                    if (now - parsed.timestamp < CACHE_DURATION) {
                        setTemplates(parsed.data)
                        setIsLoading(false)
                        // Background refresh if cache is older than 1 hour to keep it fresh
                        if (now - parsed.timestamp > 60 * 60 * 1000) {
                            fetchTemplates(true).catch(console.error)
                        }
                        return
                    }
                } catch (e) {
                    console.error('Cache parse error', e)
                    localStorage.removeItem('CVniz_templates_cache')
                }
            }
        }

        try {
            const response = await templateAPI.getAll()
            if (response.success) {
                // Merge static data with DB config
                const merged = WEB_CV_TEMPLATES.map(staticT => {
                    const dbT = response.templates.find(t => t.templateId === staticT.id)
                    if (dbT) {
                        return {
                            ...staticT,
                            name: dbT.name || staticT.name,
                            category: dbT.category || staticT.category,
                            premium: dbT.isPremium ?? staticT.premium,
                            preview: dbT.thumbnail || staticT.preview,
                            colors: dbT.config?.colors && Object.keys(dbT.config.colors).length > 0 ? dbT.config.colors : staticT.colors,
                            styles: dbT.config?.styles && Object.keys(dbT.config.styles).length > 0 ? dbT.config.styles : staticT.styles
                        }
                    }
                    return staticT
                })
                setTemplates(merged)

                // Save to cache
                localStorage.setItem('CVniz_templates_cache', JSON.stringify({
                    timestamp: Date.now(),
                    data: merged
                }))
            } else {
                // If API fails but we have no cache or forced refresh, fallback to static
                if (templates.length === 0) setTemplates(WEB_CV_TEMPLATES)
            }
        } catch (error) {
            console.error('Failed to fetch templates:', error)
            // Fallback to static if empty
            if (templates.length === 0) setTemplates(WEB_CV_TEMPLATES)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    const getTemplateConfig = (templateId) => {
        return templates.find(t => t.id === templateId) || WEB_CV_TEMPLATES.find(t => t.id === templateId)
    }

    return (
        <TemplateContext.Provider value={{
            templates,
            isLoading,
            getTemplateConfig,
            refreshTemplates: () => fetchTemplates(true)
        }}>
            {children}
        </TemplateContext.Provider>
    )
}

export function useTemplates() {
    const context = useContext(TemplateContext)
    if (!context) {
        throw new Error('useTemplates must be used within a TemplateProvider')
    }
    return context
}
