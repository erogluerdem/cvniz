import { Suspense, useEffect } from 'react'
import { getLazyTemplate, preloadTemplate } from '../templates/templateLoader'

export default function CVPreview({ cvData, template, showWatermark, theme, highlightedField }) {
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

                {/* Watermark for non-premium users */}
                {showWatermark && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        <div
                            className="text-8xl font-black text-gray-500/10 rotate-[-35deg] select-none uppercase tracking-[0.5em]"
                        >
                            CVniz.com
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

