import React, { useState, useRef, useEffect } from 'react'
import { 
    Sparkles, X, Send, Loader2, Bot, User, ChevronRight, 
    Lightbulb, Wand2, RefreshCw, Copy, CheckCircle 
} from 'lucide-react'
import { aiAPI } from '../services/api'

/**
 * AISidebarAssistant - Faz 2: AI Sidebar Asistan
 * Sürekli görünür AI yardımcı pilot
 * "Şimdi Ne Yazmalıyım?" önerileri, yazar tıkanıklığı çözücü
 */
export default function AISidebarAssistant({
    cvData,
    setCvData,
    activeTab,
    isDayMode = false,
    isPremium = false,
    onOpenUpsell
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            type: 'ai',
            content: 'Merhaba! CV\'nizi geliştirmenize yardımcı olabilirim. Hangi bölümde çalışıyorsunuz?'
        }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    // Generate contextual suggestions based on active tab
    useEffect(() => {
        const contextualSuggestions = {
            personal: [
                'Profesyonel özet örneği',
                'Güçlü başlık önerileri',
                'LinkedIn bio uyarla'
            ],
            experience: [
                'Eylem fiilleri listesi',
                'Başarı odaklı açıklama',
                'METRICS eklemeyi unutma'
            ],
            education: [
                'Sertifika önerileri',
                'Relevant kurslar ekle'
            ],
            skills: [
                'Teknik beceri önerileri',
                'Soft skills listesi',
                'Trend yetenekler 2024'
            ],
            projects: [
                'Proje açıklama şablonu',
                'GitHub entegrasyonu',
                'Demo link ekle'
            ],
            default: [
                'CV güçlendirme önerileri',
                'ATS optimizasyonu',
                'Yazım hatalarını kontrol et'
            ]
        }
        
        setSuggestions(contextualSuggestions[activeTab] || contextualSuggestions.default)
    }, [activeTab])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return
        
        if (!isPremium) {
            onOpenUpsell?.()
            return
        }

        const userMessage = { id: Date.now(), type: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await aiAPI.assistantChat({
                message: input,
                context: activeTab,
                cvData: cvData
            });

            if (response.success && (response.content || response.data?.content)) {
                const aiMessage = {
                    id: Date.now() + 1,
                    type: 'ai',
                    content: response.content || response.data.content
                }
                setMessages(prev => [...prev, aiMessage])
            } else {
                throw new Error("API failed");
            }
        } catch (error) {
            console.warn("Sidebar Assistant API failed, using fallback.", error);
            await new Promise(resolve => setTimeout(resolve, 1500))
            const responses = [
                'Harika bir noktaya değindiniz! Bu bölümü şu şekilde güçlendirebilirsiniz: "Proaktif olarak müşteri memnuniyetini %25 artıran çözümler geliştirdim."',
                'METRICS eklemenizi öneririm. Sayısal veriler CV\'nizi çok daha etkili kılar.',
                'Bu pozisyon için "liderlik", "stratejik planlama" ve "çapraz fonksiyonel işbirliği" kelimelerini eklemeyi düşünebilirsiniz.',
                'Aktif eylem fiilleri kullanın: "Geliştirdim", "Optimize ettim", "Yönettim" gibi.',
            ]
            const randomResponse = responses[Math.floor(Math.random() * responses.length)]
            
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: randomResponse
            }
            setMessages(prev => [...prev, aiMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleQuickAction = (action) => {
        if (!isPremium) {
            onOpenUpsell?.()
            return
        }

        const quickResponses = {
            'Profesyonel özet örneği': '5+ yıllık deneyime sahip, kullanıcı odaklı ürün tasarımında uzman bir UI/UX Designer. A/B testleri ile conversion oranlarını %40 artırma konusunda kanıtlanmış başarı.',
            'Eylem fiilleri listesi': 'Geliştirdim, Optimize ettim, Yönettim, Başlattım, Dönüştürdüm, Artırdım, Azalttım, Kurulumunu yaptım, Entegre ettim',
            'Başarı odaklı açıklama': 'X şirketinde Y pozisyonunda çalışırken, Z problemine A çözümünü uygulayarak B sonucunu elde ettim (%C iyileşme).',
            'METRICS eklemeyi unutma': 'Dolar tutarları, yüzdeler, zaman tasarrufu, kullanıcı sayıları, verimlilik artışı gibi somut rakamlar ekleyin.',
            'CV güçlendirme önerileri': '1) Aktif fiiller kullanın 2) Her maddede metrik belirtin 3) Problem-Çözüm-Sonuç formatı kullanın',
            'ATS optimizasyonu': 'İş ilanındaki anahtar kelimeleri özgeçmişinize ekleyin. Teknik beceriler, sertifikalar ve sektör terimleri önemlidir.'
        }

        const response = quickResponses[action] || 'Bu konuda size nasıl yardımcı olabilirim?'
        
        const userMessage = { id: Date.now(), type: 'user', content: action }
        const aiMessage = { id: Date.now() + 1, type: 'ai', content: response }
        
        setMessages(prev => [...prev, userMessage, aiMessage])
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
        // Show copied feedback
    }

    const handleApply = (text) => {
        // Apply suggestion to current field based on active tab
        if (activeTab === 'personal') {
            setCvData(prev => ({
                ...prev,
                personal: { ...prev.personal, summary: text }
            }))
        }
    }

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${
                    isOpen 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:scale-105'
                }`}
            >
                {isOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span className="font-bold text-sm">AI Asistan</span>
                        {!isPremium && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-[10px] font-black text-slate-950">PRO</span>
                            </span>
                        )}
                    </>
                )}
            </button>

            {/* Sidebar Panel */}
            <div className={`fixed right-0 top-0 h-full z-30 transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className={`w-80 h-full flex flex-col border-l ${
                    isDayMode 
                        ? 'bg-white border-slate-200' 
                        : 'bg-[#161920] border-white/10'
                }`}>
                    {/* Header */}
                    <div className={`flex items-center gap-3 px-4 py-4 border-b ${
                        isDayMode ? 'border-slate-100' : 'border-white/10'
                    }`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold text-sm ${isDayMode ? 'text-slate-800' : 'text-white'}`}>
                                CV AI Asistan
                            </h3>
                            <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {isPremium ? 'Premium aktif' : 'Ücretsiz sürüm'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={`p-2 rounded-lg transition-colors ${
                                isDayMode ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400'
                            }`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className={`px-4 py-3 border-b ${
                        isDayMode ? 'border-slate-100 bg-slate-50' : 'border-white/10 bg-white/5'
                    }`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${
                            isDayMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                            Hızlı Öneriler
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuickAction(suggestion)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        isDayMode
                                            ? 'bg-white border border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
                                            : 'bg-white/5 border border-white/10 text-slate-400 hover:border-violet-500/30 hover:text-violet-400'
                                    }`}
                                >
                                    <Lightbulb className="w-3 h-3" />
                                    {suggestion}
                                    {!isPremium && <span className="text-amber-500 ml-1">★</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                        isDayMode ? 'bg-slate-50/50' : ''
                    }`}>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                    msg.type === 'user'
                                        ? 'bg-cyan-500'
                                        : 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
                                }`}>
                                    {msg.type === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div className={`flex-1 rounded-2xl px-4 py-3 text-sm ${
                                    msg.type === 'user'
                                        ? (isDayMode ? 'bg-cyan-100 text-cyan-900' : 'bg-cyan-500/20 text-cyan-100')
                                        : (isDayMode ? 'bg-white border border-slate-200 text-slate-700' : 'bg-white/10 text-slate-200 border border-white/5')
                                }`}>
                                    <p className="leading-relaxed">{msg.content}</p>
                                    
                                    {msg.type === 'ai' && (
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                                            <button
                                                onClick={() => handleCopy(msg.content)}
                                                className={`p-1.5 rounded-lg transition-colors ${
                                                    isDayMode ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-white/10 text-slate-400'
                                                }`}
                                                title="Kopyala"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleApply(msg.content)}
                                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                    isDayMode 
                                                        ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' 
                                                        : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                                                }`}
                                            >
                                                <Wand2 className="w-3 h-3" />
                                                Uygula
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className={`flex-1 rounded-2xl px-4 py-3 flex items-center gap-2 ${
                                    isDayMode ? 'bg-white border border-slate-200' : 'bg-white/10 border border-white/5'
                                }`}>
                                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                    <span className={`text-sm ${isDayMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Düşünüyor...
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className={`p-4 border-t ${
                        isDayMode ? 'border-slate-100 bg-white' : 'border-white/10 bg-[#0f1115]'
                    }`}>
                        <div className={`flex items-center gap-2 p-2 rounded-xl border ${
                            isDayMode ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                        }`}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={isPremium ? "Mesaj yazın..." : "Premium gereklidir"}
                                disabled={!isPremium}
                                className={`flex-1 bg-transparent px-2 py-2 text-sm outline-none ${
                                    isDayMode ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500'
                                } ${!isPremium ? 'cursor-not-allowed' : ''}`}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading || !isPremium}
                                className={`p-2 rounded-lg transition-all ${
                                    input.trim() && !isLoading && isPremium
                                        ? 'bg-violet-500 text-white hover:bg-violet-600'
                                        : isDayMode ? 'bg-slate-200 text-slate-400' : 'bg-white/10 text-slate-500'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        {!isPremium && (
                            <button
                                onClick={onOpenUpsell}
                                className="w-full mt-2 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/30 transition-colors"
                            >
                                Premium'a Yükselt - Sınırsız AI Önerisi
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
