import React, { useState, useRef, useEffect } from 'react'
import { X, Move, Maximize2, Minimize2, GripVertical } from 'lucide-react'

/**
 * FloatingEditor Component - Faz 1: Floating/Açılır Editörler
 * Modal/popover editörler için altyapı
 * Sürüklenebilir, boyutlandırılabilir pencere
 */
export default function FloatingEditor({
    isOpen,
    onClose,
    title,
    children,
    defaultPosition = { x: 100, y: 100 },
    defaultSize = { width: 480, height: 600 },
    isDayMode = false,
    onMinimize,
    isMinimized = false
}) {
    const [position, setPosition] = useState(defaultPosition)
    const [size, setSize] = useState(defaultSize)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [isMaximized, setIsMaximized] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    
    const windowRef = useRef(null)
    const prevState = useRef({ position: defaultPosition, size: defaultSize })

    // Handle dragging
    const handleMouseDown = (e) => {
        if (e.target.closest('.resize-handle') || e.target.closest('.window-controls')) return
        
        setIsDragging(true)
        const rect = windowRef.current.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - dragOffset.x
            const newY = e.clientY - dragOffset.y
            
            // Keep within viewport bounds
            const maxX = window.innerWidth - size.width
            const maxY = window.innerHeight - size.height
            
            setPosition({
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            })
        } else if (isResizing) {
            const rect = windowRef.current.getBoundingClientRect()
            const newWidth = e.clientX - rect.left
            const newHeight = e.clientY - rect.top
            
            setSize({
                width: Math.max(320, Math.min(newWidth, window.innerWidth - position.x)),
                height: Math.max(200, Math.min(newHeight, window.innerHeight - position.y))
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        setIsResizing(false)
    }

    useEffect(() => {
        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, isResizing, dragOffset, position, size])

    const handleMaximize = () => {
        if (isMaximized) {
            setPosition(prevState.current.position)
            setSize(prevState.current.size)
        } else {
            prevState.current = { position, size }
            setPosition({ x: 0, y: 0 })
            setSize({ width: window.innerWidth, height: window.innerHeight })
        }
        setIsMaximized(!isMaximized)
    }

    if (!isOpen || isMinimized) return null

    return (
        <div 
            ref={windowRef}
            className={`fixed z-[100] flex flex-col rounded-2xl shadow-2xl overflow-hidden transition-shadow ${
                isDragging ? 'shadow-3xl' : ''
            } ${isDayMode 
                ? 'bg-white border border-slate-200 shadow-slate-200/50' 
                : 'bg-[#161920] border border-white/10'
            }`}
            style={{
                left: position.x,
                top: position.y,
                width: size.width,
                height: size.height
            }}
        >
            {/* Title Bar */}
            <div 
                className={`flex items-center justify-between px-4 py-3 border-b cursor-move select-none window-controls ${
                    isDayMode ? 'border-slate-100 bg-slate-50/50' : 'border-white/10 bg-white/5'
                } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
            >
                <div className="flex items-center gap-3">
                    <GripVertical className={`w-4 h-4 ${isDayMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <h3 className={`font-bold text-sm ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                        {title}
                    </h3>
                </div>
                
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleMaximize}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isDayMode 
                                ? 'hover:bg-slate-200 text-slate-500' 
                                : 'hover:bg-white/10 text-slate-400'
                        }`}
                    >
                        {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    {onMinimize && (
                        <button
                            onClick={onMinimize}
                            className={`p-1.5 rounded-lg transition-colors ${
                                isDayMode 
                                    ? 'hover:bg-slate-200 text-slate-500' 
                                    : 'hover:bg-white/10 text-slate-400'
                            }`}
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-lg transition-colors ${
                            isDayMode 
                                ? 'hover:bg-red-100 hover:text-red-500 text-slate-500' 
                                : 'hover:bg-red-500/20 hover:text-red-400 text-slate-400'
                        }`}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                {children}
            </div>

            {/* Resize Handle */}
            {!isMaximized && (
                <div
                    className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-se-resize"
                    onMouseDown={(e) => {
                        setIsResizing(true)
                        e.preventDefault()
                    }}
                >
                    <div className={`absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 rounded-br ${
                        isDayMode 
                            ? 'border-slate-300 hover:border-cyan-400' 
                            : 'border-slate-600 hover:border-cyan-400'
                    }`} />
                </div>
            )}
        </div>
    )
}

/**
 * FloatingEditorManager - Birden fazla floating editörü yönetir
 */
export function FloatingEditorManager({
    editors = [],
    isDayMode = false
}) {
    const [activeEditor, setActiveEditor] = useState(null)
    const [zIndexes, setZIndexes] = useState({})

    const bringToFront = (editorId) => {
        const maxZ = Math.max(100, ...Object.values(zIndexes))
        setZIndexes(prev => ({ ...prev, [editorId]: maxZ + 1 }))
        setActiveEditor(editorId)
    }

    return (
        <>
            {editors.map(editor => (
                <div 
                    key={editor.id}
                    onMouseDown={() => bringToFront(editor.id)}
                    style={{ zIndex: zIndexes[editor.id] || 100 }}
                >
                    <FloatingEditor
                        isOpen={editor.isOpen}
                        onClose={editor.onClose}
                        title={editor.title}
                        defaultPosition={editor.position}
                        defaultSize={editor.size}
                        isDayMode={isDayMode}
                    >
                        {editor.content}
                    </FloatingEditor>
                </div>
            ))}
        </>
    )
}
