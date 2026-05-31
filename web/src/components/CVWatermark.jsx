import React from 'react'

/**
 * CVWatermark - CV Çalınma Önleme Filigranı
 * Premium kullanıcılar için kaldırılabilir, free kullanıcılar için zorunlu
 */
export default function CVWatermark({ 
    isPremium = false, 
    userName = '',
    userEmail = '',
    watermarkText = 'CVniz.com',
    opacity = 0.30,
    density = 'high' // 'low' | 'medium' | 'high'
}) {
    // Premium users don't see watermark
    if (isPremium) return null

    const densityConfig = {
        low: { rows: 3, cols: 2, fontSize: 14 },
        medium: { rows: 5, cols: 3, fontSize: 12 },
        high: { rows: 7, cols: 4, fontSize: 10 }
    }

    const config = densityConfig[density]
    const watermarks = []

    // Generate grid of watermarks
    for (let i = 0; i < config.rows; i++) {
        for (let j = 0; j < config.cols; j++) {
            watermarks.push({
                id: `${i}-${j}`,
                top: `${(i / (config.rows - 1)) * 100}%`,
                left: `${(j / (config.cols - 1)) * 100}%`,
                rotation: -30 + Math.random() * 60 // Random rotation between -30 and 30 degrees
            })
        }
    }

    return (
        <div 
            className="absolute inset-0 pointer-events-none overflow-hidden z-50"
            style={{ 
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }}
        >
            {/* Grid Watermarks */}
            {watermarks.map((mark) => (
                <div
                    key={mark.id}
                    className="absolute whitespace-nowrap"
                    style={{
                        top: mark.top,
                        left: mark.left,
                        transform: `translate(-50%, -50%) rotate(${mark.rotation}deg)`,
                        opacity: opacity,
                        fontSize: `${config.fontSize}px`,
                        fontWeight: 'bold',
                        color: '#666',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}
                >
                    {watermarkText}
                    {userName && ` • ${userName}`}
                    {userEmail && ` • ${userEmail}`}
                </div>
            ))}

            {/* Corner Watermarks - harder to remove */}
            <div 
                className="absolute top-4 left-4 text-xs font-bold"
                style={{ opacity: 0.5, color: '#444' }}
            >
                {watermarkText}
            </div>
            <div 
                className="absolute top-4 right-4 text-xs font-bold"
                style={{ opacity: 0.5, color: '#444' }}
            >
                CONFIDENTIAL
            </div>
            <div 
                className="absolute bottom-4 left-4 text-xs font-bold"
                style={{ opacity: 0.5, color: '#444' }}
            >
                {userEmail || 'PREVIEW ONLY'}
            </div>
            <div 
                className="absolute bottom-4 right-4 text-xs font-bold"
                style={{ opacity: 0.5, color: '#444' }}
            >
                NOT FOR DISTRIBUTION
            </div>

            {/* SVG Pattern Watermark - even harder to remove */}
            <svg 
                className="absolute inset-0 w-full h-full"
                style={{ opacity: opacity * 0.5 }}
            >
                <defs>
                    <pattern 
                        id="watermark-pattern" 
                        x="0" 
                        y="0" 
                        width="200" 
                        height="200" 
                        patternUnits="userSpaceOnUse"
                    >
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            transform="rotate(-45 100 100)"
                            fill="#000"
                            fontSize="10"
                            fontWeight="bold"
                            opacity="0.5"
                        >
                            {watermarkText}
                        </text>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#watermark-pattern)" />
            </svg>

            {/* Diagonal Stripe Pattern */}
            <div 
                className="absolute inset-0"
                style={{
                    background: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 50px,
                        rgba(0,0,0,${opacity * 0.3}) 50px,
                        rgba(0,0,0,${opacity * 0.3}) 51px
                    )`,
                    pointerEvents: 'none'
                }}
            />

            {/* Center Large Watermark */}
            <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                    opacity: opacity * 0.5,
                    fontSize: '48px',
                    fontWeight: '900',
                    color: '#000',
                    letterSpacing: '8px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    transform: 'translate(-50%, -50%) rotate(-30deg)'
                }}
            >
                {watermarkText}
            </div>
        </div>
    )
}
