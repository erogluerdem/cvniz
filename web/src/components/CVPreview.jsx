import { Suspense, useEffect } from 'react'
import { getLazyTemplate, preloadTemplate } from '../templates/templateLoader'
import CVWatermark from './CVWatermark'

export default function CVPreview({ cvData, template, showWatermark, theme, highlightedField, isPremium = false, userName = '', userEmail = '' }) {
    useEffect(() => {
        preloadTemplate(template)
    }, [template])

    const Template = getLazyTemplate(template)
    const isWebTemplate = typeof template === 'string' && template?.toLowerCase().includes('web')
    const webColors = {
        accent: theme?.webAccentColor || theme?.accentColor || '#2563eb',
        bg: theme?.webBackgroundColor || '#ffffff',
        text: theme?.webTextColor || '#111827'
    }
    const webStyles = {
        fontFamily: theme?.webFontFamily
            ? `'${theme.webFontFamily}', sans-serif`
            : theme?.fontFamily
                ? `'${theme.fontFamily}', sans-serif`
                : "'Inter', sans-serif",
        pattern: theme?.webPattern || 'grid'
    }

    return (
        <div className="relative h-full w-full">
            {/* CV Container */}
            <div
                id="cv-preview"
                className="cv-preview cv-template h-full w-full"
            >
                <Suspense
                    fallback={
                        <div className="min-h-[297mm] flex items-center justify-center">
                            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    }
                >
                    {isWebTemplate ? (
                        <Template
                            cv={{ data: cvData }}
                            template={{ colors: webColors, styles: webStyles }}
                            theme={theme}
                            highlightedField={highlightedField}
                        />
                    ) : (
                        <Template
                            data={cvData}
                            theme={theme}
                            highlightedField={highlightedField}
                        />
                    )}
                </Suspense>

                {/* Enhanced Watermark for non-premium users */}
                {showWatermark && (
                    <CVWatermark
                        isPremium={isPremium}
                        userName={userName || cvData?.personal?.fullName}
                        userEmail={userEmail || cvData?.personal?.email}
                        watermarkText="CVniz.com"
                        opacity={0.30}
                        density="high"
                    />
                )}
            </div>
        </div>
    )
}

