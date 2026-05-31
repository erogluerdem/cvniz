import { useMemo } from 'react'

export default function AnalyticsChart({
    data = [],
    type = 'line',
    height = 200,
    color = '#06b6d4',
    showLabels = true,
    showGrid = true,
    animated = true
}) {
    const chartData = useMemo(() => {
        if (!data.length) return { points: [], labels: [], max: 0 }

        const values = data.map(d => d.value)
        const max = Math.max(...values, 1)
        const labels = data.map(d => d.label)

        const width = 100 // percentage
        const pointWidth = data.length > 1 ? width / (data.length - 1) : 0

        const points = values.map((v, i) => ({
            x: i * pointWidth,
            y: 100 - (v / max) * 100,
            value: v,
            label: labels[i]
        }))

        return { points, labels, max, values }
    }, [data])

    if (!data.length) {
        return (
            <div
                className="flex items-center justify-center bg-white/5 rounded-xl"
                style={{ height }}
            >
                <p className="text-gray-500 text-sm">Veri bulunamadı</p>
            </div>
        )
    }

    const renderLineChart = () => {
        const { points } = chartData
        const pathData = points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ')

        const areaPath = `${pathData} L ${points[points.length - 1].x} 100 L 0 100 Z`

        return (
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
            >
                {/* Grid lines */}
                {showGrid && (
                    <g className="text-white/5">
                        {[0, 25, 50, 75, 100].map(y => (
                            <line
                                key={y}
                                x1="0" y1={y} x2="100" y2={y}
                                stroke="currentColor"
                                strokeWidth="0.5"
                            />
                        ))}
                    </g>
                )}

                {/* Gradient fill */}
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                </defs>

                {/* Area */}
                <path
                    d={areaPath}
                    fill={`url(#gradient-${color})`}
                    className={animated ? 'animate-fade-in' : ''}
                />

                {/* Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    className={animated ? 'animate-draw-line' : ''}
                />

                {/* Points */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="1.5"
                        fill={color}
                        className="hover:scale-150 transition-transform cursor-pointer"
                    />
                ))}
            </svg>
        )
    }

    const renderBarChart = () => {
        const { points, max } = chartData
        const barWidth = 80 / points.length
        const gap = 20 / points.length

        return (
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full"
            >
                {/* Grid lines */}
                {showGrid && (
                    <g className="text-white/5">
                        {[0, 25, 50, 75, 100].map(y => (
                            <line
                                key={y}
                                x1="0" y1={y} x2="100" y2={y}
                                stroke="currentColor"
                                strokeWidth="0.5"
                            />
                        ))}
                    </g>
                )}

                {/* Bars */}
                {points.map((p, i) => {
                    const barHeight = 100 - p.y
                    const x = (gap / 2) + i * (barWidth + gap)

                    return (
                        <rect
                            key={i}
                            x={x}
                            y={p.y}
                            width={barWidth}
                            height={barHeight}
                            rx="1"
                            fill={color}
                            className={`hover:opacity-80 transition-opacity cursor-pointer ${animated ? 'animate-grow-up' : ''}`}
                            style={{
                                transformOrigin: 'bottom',
                                animationDelay: animated ? `${i * 50}ms` : '0ms'
                            }}
                        />
                    )
                })}
            </svg>
        )
    }

    return (
        <div className="relative" style={{ height }}>
            {/* Chart */}
            <div className="absolute inset-0">
                {type === 'line' ? renderLineChart() : renderBarChart()}
            </div>

            {/* Labels */}
            {showLabels && (
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-gray-500 px-1">
                    {chartData.labels.map((label, i) => (
                        <span key={i} className="truncate max-w-[40px]">{label}</span>
                    ))}
                </div>
            )}

            {/* Y-axis labels */}
            <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-500">
                <span>{chartData.max}</span>
                <span>{Math.round(chartData.max / 2)}</span>
                <span>0</span>
            </div>
        </div>
    )
}

// Mini sparkline chart for compact displays
export function SparklineChart({ data = [], color = '#06b6d4', height = 40 }) {
    const points = useMemo(() => {
        if (!data.length) return ''

        const max = Math.max(...data, 1)
        const pointWidth = 100 / (data.length - 1 || 1)

        return data
            .map((v, i) => {
                const x = i * pointWidth
                const y = 100 - (v / max) * 100
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
            })
            .join(' ')
    }, [data])

    if (!data.length) return null

    return (
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ height }}
            className="w-full"
        >
            <path
                d={points}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}
