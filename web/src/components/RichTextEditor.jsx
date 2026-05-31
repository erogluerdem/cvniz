import React, { useState, useRef, useEffect } from 'react'
import { 
    Bold, Italic, List, ListOrdered, Link as LinkIcon, 
    AlignLeft, AlignCenter, AlignRight, Type, Sparkles,
    Quote, Undo, Redo, Maximize2, Minimize2, Check
} from 'lucide-react'

/**
 * RichTextEditor - Faz 2: WYSIWYG Editör
 * Deneyim ve projeler için zengin metin editörü
 * AI ile otomatik maddeleme, eylem fiili önerileri
 */
export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Açıklama yazın...',
    isDayMode = false,
    isPremium = false,
    enableAI = true,
    height = 200
}) {
    const editorRef = useRef(null)
    const [isFocused, setIsFocused] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showAIAssist, setShowAIAssist] = useState(false)
    const [actionVerbs] = useState([
        'Geliştirdim', 'Optimize ettim', 'Yönettim', 'Başlattım',
        'Dönüştürdüm', 'Artırdım', 'Azalttım', 'Kurulumunu yaptım',
        'Entegre ettim', 'Otomatikleştirdim', 'Stratejisini oluşturdum',
        'Liderlik ettim', 'Analiz ettim', 'Tasarladım', 'Uyguladım'
    ])

    // Exec command for formatting
    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
        updateValue()
    }

    // Update value on content change
    const updateValue = () => {
        if (editorRef.current) {
            onChange?.(editorRef.current.innerHTML)
        }
    }

    // Insert action verb
    const insertActionVerb = (verb) => {
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const textNode = document.createTextNode(verb + ' ')
            range.insertNode(textNode)
            range.setStartAfter(textNode)
            range.setEndAfter(textNode)
            selection.removeAllRanges()
            selection.addRange(range)
            updateValue()
        }
    }

    // AI bullet point generator
    const generateBulletPoints = () => {
        if (!isPremium) return
        
        const templates = [
            '• X projesinde Y görevini üstlenerek Z sonucunu elde ettim',
            '• A sürecini optimize ederek %B verimlilik artışı sağladım',
            '• C teknolojisini uygulayarak D sorununu çözdüm'
        ]
        
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
        
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const p = document.createElement('p')
            p.innerHTML = randomTemplate
            range.insertNode(p)
            range.setStartAfter(p)
            range.setEndAfter(p)
            selection.removeAllRanges()
            selection.addRange(range)
            updateValue()
        }
    }

    // Link insertion
    const insertLink = () => {
        const url = prompt('Link URL girin:', 'https://')
        if (url) {
            execCommand('createLink', url)
        }
    }

    // Toolbar Button Component
    const ToolbarButton = ({ icon: Icon, command, title, isActive = false }) => (
        <button
            onClick={() => execCommand(command)}
            className={`p-2 rounded-lg transition-all ${
                isActive
                    ? (isDayMode ? 'bg-cyan-100 text-cyan-700' : 'bg-cyan-500/20 text-cyan-400')
                    : (isDayMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-slate-400')
            }`}
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    )

    return (
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8' : ''}`}>
            <div className={`${isFullscreen ? 'w-full max-w-4xl' : ''}`}>
                {/* Toolbar */}
                <div className={`flex items-center gap-1 p-2 rounded-t-xl border-b ${
                    isDayMode 
                        ? 'bg-slate-50 border-slate-200' 
                        : 'bg-white/5 border-white/10'
                }`}>
                    {/* Format Controls */}
                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={Bold} command="bold" title="Kalın" />
                        <ToolbarButton icon={Italic} command="italic" title="İtalik" />
                        <div className={`w-px h-5 mx-2 ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
                        <ToolbarButton icon={List} command="insertUnorderedList" title="Maddeli Liste" />
                        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numaralı Liste" />
                        <div className={`w-px h-5 mx-2 ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
                        <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Sola Hizala" />
                        <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Ortala" />
                        <ToolbarButton icon={AlignRight} command="justifyRight" title="Sağa Hizala" />
                        <div className={`w-px h-5 mx-2 ${isDayMode ? 'bg-slate-200' : 'bg-white/10'}`} />
                        <button
                            onClick={insertLink}
                            className={`p-2 rounded-lg transition-all ${
                                isDayMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-slate-400'
                            }`}
                            title="Link Ekle"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => execCommand('formatBlock', 'blockquote')}
                            className={`p-2 rounded-lg transition-all ${
                                isDayMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-slate-400'
                            }`}
                            title="Alıntı"
                        >
                            <Quote className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1" />

                    {/* AI Assist Toggle */}
                    {enableAI && (
                        <button
                            onClick={() => setShowAIAssist(!showAIAssist)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                showAIAssist
                                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                                    : (isDayMode ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-white/10 text-slate-400 hover:bg-white/20')
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            AI
                            {!isPremium && <span className="text-amber-500">★</span>}
                        </button>
                    )}

                    {/* Fullscreen Toggle */}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className={`p-2 rounded-lg transition-all ${
                            isDayMode ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-slate-400'
                        }`}
                        title={isFullscreen ? 'Küçült' : 'Tam Ekran'}
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>

                    {/* Undo/Redo */}
                    <div className={`flex items-center gap-1 ml-2 pl-2 border-l ${isDayMode ? 'border-slate-200' : 'border-white/10'}`}>
                        <ToolbarButton icon={Undo} command="undo" title="Geri Al" />
                        <ToolbarButton icon={Redo} command="redo" title="İleri Al" />
                    </div>
                </div>

                {/* AI Assist Panel */}
                {showAIAssist && (
                    <div className={`p-3 border-b ${
                        isDayMode ? 'bg-violet-50 border-violet-100' : 'bg-violet-500/10 border-violet-500/20'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <p className={`text-xs font-bold ${isDayMode ? 'text-violet-700' : 'text-violet-400'}`}>
                                AI Yazım Asistanı
                            </p>
                            {!isPremium && (
                                <span className="text-[10px] text-amber-500 font-bold">Premium özelliği</span>
                            )}
                        </div>
                        
                        {/* Action Verbs */}
                        <div className="mb-3">
                            <p className={`text-[10px] uppercase tracking-wider mb-2 ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                Eylem Fiilleri
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {actionVerbs.slice(0, 8).map((verb, i) => (
                                    <button
                                        key={i}
                                        onClick={() => insertActionVerb(verb)}
                                        disabled={!isPremium}
                                        className={`px-2 py-1 rounded text-xs transition-all ${
                                            isPremium
                                                ? (isDayMode ? 'bg-white text-violet-700 border border-violet-200 hover:border-violet-400' : 'bg-white/10 text-violet-300 border border-white/10 hover:border-violet-500/30')
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {verb}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Templates */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={generateBulletPoints}
                                disabled={!isPremium}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    isPremium
                                        ? 'bg-violet-500 text-white hover:bg-violet-600'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <List className="w-3.5 h-3.5" />
                                AI Madde Oluştur
                            </button>
                            <button
                                onClick={() => onChange?.('• [Görev] yaparak [sonuç] elde ettim\n• [İyileştirme] ile [%verimlilik] artışı sağladım\n• [Problem] için [çözüm] geliştirdim')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    isDayMode ? 'bg-white text-slate-600 border border-slate-200' : 'bg-white/10 text-slate-300 border border-white/10'
                                }`}
                            >
                                Şablon Ekle
                            </button>
                        </div>
                    </div>
                )}

                {/* Editor Area */}
                <div className={`relative ${
                    isFocused ? 'ring-2 ring-cyan-500/30' : ''
                } ${isDayMode ? 'bg-white' : 'bg-[#0f1115]'}`}>
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={updateValue}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className={`w-full p-4 outline-none text-sm leading-relaxed ${
                            isDayMode ? 'text-slate-700' : 'text-slate-300'
                        }`}
                        style={{ 
                            minHeight: isFullscreen ? '60vh' : height,
                            maxHeight: isFullscreen ? '70vh' : '400px',
                            overflow: 'auto'
                        }}
                        data-placeholder={placeholder}
                        dangerouslySetInnerHTML={{ __html: value }}
                    />
                    
                    {/* Placeholder */}
                    {!value && (
                        <div className={`absolute top-4 left-4 pointer-events-none text-sm ${
                            isDayMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                            {placeholder}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-b-xl border-t text-xs ${
                    isDayMode 
                        ? 'bg-slate-50 border-slate-200 text-slate-500' 
                        : 'bg-white/5 border-white/10 text-slate-500'
                }`}>
                    <div className="flex items-center gap-3">
                        <span>WYSIWYG Editör</span>
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <span>Ctrl+B Kalın</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isPremium ? (
                            <span className="flex items-center gap-1 text-emerald-500">
                                <Check className="w-3 h-3" />
                                AI Aktif
                            </span>
                        ) : (
                            <span>AI için Premium gerekli</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Close Button */}
            {isFullscreen && (
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                    <Minimize2 className="w-5 h-5" />
                </button>
            )}
        </div>
    )
}
