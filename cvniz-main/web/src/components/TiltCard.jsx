import { useState, useRef, useEffect } from 'react'

export default function TiltCard({ children, className = "" }) {
    const [rotate, setRotate] = useState({ x: 0, y: 0 })
    const cardRef = useRef(null)

    const handleMouseMove = (e) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = (y - centerY) / 20
        const rotateY = (centerX - x) / 20

        setRotate({ x: rotateX, y: rotateY })
    }

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 })
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-200 ease-out ${className}`}
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: 'preserve-3d'
            }}
        >
            <div style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>
        </div>
    )
}
