import React, { createContext, useContext, useState, useEffect } from 'react'
import { templateAPI } from '../services/api'
import { WEB_CV_TEMPLATES } from '../data/webCVTemplates'

const TemplateContext = createContext()

export function TemplateProvider({ children }) {
    const [templates, setTemplates] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchTemplates = async () => {
        setIsLoading(true)
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
            } else {
                setTemplates(WEB_CV_TEMPLATES)
            }
        } catch (error) {
            console.error('Failed to fetch templates:', error)
            setTemplates(WEB_CV_TEMPLATES)
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
            refreshTemplates: fetchTemplates
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
