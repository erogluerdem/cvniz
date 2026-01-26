import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Search, HelpCircle, MessageCircle, User, CreditCard, ShieldCheck, Zap, FileText, ArrowRight, Plus, Minus } from 'lucide-react'

const faqs = [
    {
        category: 'Genel',
        icon: <User className="w-5 h-5" />,
        questions: [
            { q: 'CVniz nedir?', a: 'CVniz, profesyonel CV\'ler oluşturmanızı sağlayan AI destekli bir web uygulamasıdır. 65+ şablon ve gerçek zamanlı önizleme ile dakikalar içinde etkileyici CV\'ler hazırlayabilirsiniz.' },
            { q: 'CVniz ücretsiz mi?', a: 'Evet! Modern şablonumuzu tamamen ücretsiz kullanabilirsiniz. Premium özellikler ve tüm şablonlar için Pro planımıza geçebilirsiniz.' },
            { q: 'Hesap oluşturmam gerekiyor mu?', a: 'Hayır, hesap oluşturmadan da CV oluşturabilirsiniz. Ancak CV\'lerinizi bulutta saklamak ve daha sonra herhangi bir cihazdan erişmek için ücretsiz hesap oluşturmanızı öneririz.' }
        ]
    },
    {
        category: 'CV Oluşturma',
        icon: <FileText className="w-5 h-5" />,
        questions: [
            { q: 'CV\'mi nasıl oluştururum?', a: 'Şablonunuzu seçin, bilgilerinizi adım adım doldurun, AI desteğiyle içeriğinizi güçlendirin ve anında PDF olarak indirin.' },
            { q: 'CV\'mi daha sonra düzenleyebilir miyim?', a: 'Kesinlikle! Hesabınıza giriş yaptığınız sürece oluşturduğunuz tüm CV\'ler güvenle saklanır ve dilediğiniz zaman güncellenebilir.' },
            { q: 'ATS uyumlu mu?', a: 'Tüm şablonlarımız dünya standartlarındaki ATS (Aday Takip Sistemleri) sistemleriyle %100 uyumlu olacak şekilde test edilmiştir.' }
        ]
    },
    {
        category: 'Ödeme & Planlar',
        icon: <CreditCard className="w-5 h-5" />,
        questions: [
            { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Tüm yerli ve yabancı kredi kartları, banka kartları ve iyzico güvencesiyle güvenli ödeme yapabilirsiniz.' },
            { q: 'İade politikanız nedir?', a: '7 gün içinde memnun kalmazsanız, hiçbir gerekçe göstermeden paranızı iade ediyoruz.' },
            { q: 'Yıllık planda ne kadar tasarruf ederim?', a: 'Yıllık planı tercih ederek aylık ödemeye göre %40 oranında daha az ödersiniz.' }
        ]
    },
    {
        category: 'Güvenlik',
        icon: <ShieldCheck className="w-5 h-5" />,
        questions: [
            { q: 'Verilerim nerede saklanıyor?', a: 'Verileriniz yüksek güvenlikli bulut sunucularımızda şifrelenmiş olarak saklanır. İzinsiz erişimlere karşı sürekli izlenmektedir.' },
            { q: 'Verilerimi silebilir miyim?', a: 'Evet, kullanıcı panelinden tüm verilerinizi ve hesabınızı kalıcı olarak silme hakkına her zaman sahipsiniz.' }
        ]
    }
]

function FAQItem({ question, answer, isOpen, onToggle, isDayMode, mutedText }) {
    return (
        <div className={`group transition-all duration-500 ${isOpen ? 'mb-6' : 'mb-3'}`}>
            <div
                className={`rounded-[24px] overflow-hidden transition-all duration-500 border ${isDayMode
                    ? `${isOpen ? 'border-sky-300 shadow-day bg-white' : 'border-slate-200/70 bg-white hover:border-slate-300'}`
                    : `glass-card border-white/5 ${isOpen ? 'border-cyan-500/30 bg-white/[0.04]' : 'hover:border-white/10'}`
                    }`}
            >
                <button
                    onClick={onToggle}
                    className="w-full p-6 md:p-7 flex items-center justify-between text-left focus:outline-none"
                >
                    <span className={`font-bold transition-colors duration-300 ${isOpen
                        ? (isDayMode ? 'text-sky-600' : 'text-cyan-400')
                        : (isDayMode ? 'text-slate-800 group-hover:text-slate-900' : 'text-gray-200 group-hover:text-white')}`}>
                        {question}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isOpen
                        ? (isDayMode ? 'bg-sky-500 text-white shadow-lg shadow-sky-200/60' : 'bg-cyan-500 text-slate-950')
                        : (isDayMode ? 'bg-slate-100 text-slate-500 group-hover:bg-slate-200' : 'bg-white/5 text-gray-500 group-hover:bg-white/10')}`}>
                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </div>
                </button>
                <div
                    className={`px-6 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] pb-8 opacity-100' : 'max-h-0 opacity-0'}`}
                    style={{ overflow: 'hidden' }}
                >
                    <div className={`w-full h-[1px] mb-6 ${isDayMode ? 'bg-gradient-to-r from-transparent via-slate-200 to-transparent' : 'bg-gradient-to-r from-transparent via-white/10 to-transparent'}`}></div>
                    <p className={`${isDayMode ? mutedText : 'text-gray-400'} leading-relaxed text-sm md:text-base`}>
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('Genel')
    const [searchQuery, setSearchQuery] = useState('')
    const [openIndex, setOpenIndex] = useState(0)
    const [theme, setTheme] = useState('day')
    const isDayMode = theme === 'day'

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem('CVniz-home-theme')
        if (stored === 'day' || stored === 'night') {
            setTheme(stored)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return
        const handler = (event) => {
            const nextTheme = event.detail
            if (nextTheme === 'day' || nextTheme === 'night') {
                setTheme(nextTheme)
            }
        }
        window.addEventListener('CVniz-theme-change', handler)
        return () => window.removeEventListener('CVniz-theme-change', handler)
    }, [])

    const filteredFaqs = useMemo(() => {
        if (!searchQuery) {
            return faqs.find(f => f.category === activeCategory)?.questions || []
        }

        let allResults = []
        faqs.forEach(cat => {
            const matches = cat.questions.filter(q =>
                q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
            )
            allResults = [...allResults, ...matches]
        })
        return allResults
    }, [activeCategory, searchQuery])

    const mutedText = isDayMode ? 'text-slate-600' : 'text-gray-400'
    const chipInactive = isDayMode ? 'bg-white text-slate-600 border border-slate-200/70 hover:border-sky-200 shadow-sm' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
    const chipActive = isDayMode ? 'bg-sky-500 text-white border-sky-400 shadow-[0_10px_30px_rgba(14,165,233,0.4)]' : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_10px_30px_rgba(6,182,212,0.4)]'
    const selectionColor = isDayMode ? 'selection:bg-sky-200/60' : 'selection:bg-cyan-500/30'

    return (
        <div className={`min-h-screen overflow-x-hidden ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white text-slate-900' : 'bg-slate-950 text-white'} ${selectionColor}`}>
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] animate-pulse ${isDayMode ? 'bg-sky-100' : 'bg-cyan-500/10'}`}></div>
                <div className={`absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full blur-[120px] ${isDayMode ? 'bg-rose-100/70' : 'bg-blue-500/5'}`}></div>
            </div>

            {/* Hero Section */}
            <section className={`relative pt-32 pb-20 px-6 lg:px-12 text-center ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white' : ''}`}>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-black uppercase tracking-widest ${isDayMode ? 'bg-white/90 border border-slate-200/70 text-sky-600 shadow-day' : 'glass border-cyan-500/20 text-cyan-200'}`}>
                        <HelpCircle className={`w-4 h-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                        <span>Destek Merkezi</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
                        Size Nasıl <br /> <span className="gradient-text">Yardımcı</span> Olabiliriz?
                    </h1>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative group mt-12">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[28px] blur opacity-25 group-hover:opacity-50 transition-all duration-500"></div>
                        <div className={`relative flex items-center rounded-[24px] px-8 py-5 border ${isDayMode ? 'bg-white shadow-day border-slate-200/70' : 'bg-slate-900/90 backdrop-blur-xl border-white/10'}`}>
                            <Search className={`w-6 h-6 mr-4 ${isDayMode ? 'text-sky-500' : 'text-cyan-500'}`} />
                            <input
                                type="text"
                                placeholder="Bir soru veya konu arayın..."
                                className={`bg-transparent border-none outline-none w-full text-lg font-medium ${isDayMode ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-gray-600'}`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
                {!searchQuery && (
                    <div className="flex flex-wrap justify-center gap-3 mb-16 no-scrollbar overflow-x-auto pb-4">
                        {faqs.map(cat => (
                            <button
                                key={cat.category}
                                onClick={() => {
                                    setActiveCategory(cat.category)
                                    setOpenIndex(0)
                                }}
                                className={`flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-black tracking-widest uppercase transition-all duration-300 ${activeCategory === cat.category ? chipActive : chipInactive}`}
                            >
                                {cat.icon}
                                {cat.category}
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((item, i) => (
                            <FAQItem
                                key={i}
                                question={item.q}
                                answer={item.a}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                                isDayMode={isDayMode}
                                mutedText={mutedText}
                            />
                        ))
                    ) : (
                        <div className={`text-center py-20 rounded-[32px] border ${isDayMode ? 'bg-white shadow-day border-slate-200/80' : 'glass-card border-white/5'}`}>
                            <HelpCircle className={`w-16 h-16 mx-auto mb-6 ${isDayMode ? 'text-slate-400' : 'text-gray-600'}`} />
                            <h3 className={`text-2xl font-bold mb-2 ${isDayMode ? 'text-slate-900' : ''}`}>Sonuç Bulunamadı</h3>
                            <p className={`${isDayMode ? mutedText : 'text-gray-500'}`}>"{searchQuery}" araması için herhangi bir cevap bulamadık.</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className={`mt-8 font-bold transition-colors ${isDayMode ? 'text-sky-600 hover:text-sky-700' : 'text-cyan-400 hover:text-cyan-300'}`}
                            >
                                Tüm soruları gör
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom Support Section */}
                <div className="mt-24 relative">
                    <div className={`absolute -inset-1 rounded-[48px] blur-xl ${isDayMode ? 'bg-gradient-to-r from-sky-200/40 to-blue-100/40' : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20'}`}></div>
                    <div className={`rounded-[40px] p-12 md:p-16 text-center relative overflow-hidden group ${isDayMode ? 'bg-white border border-slate-200/80 shadow-day' : 'glass-card border-white/10'}`}>
                        <div className={`absolute top-0 right-0 p-8 transition-opacity ${isDayMode ? 'opacity-20 group-hover:opacity-40' : 'opacity-10 group-hover:opacity-20'}`}>
                            <MessageCircle className={`w-32 h-32 md:w-48 md:h-48 ${isDayMode ? 'text-sky-200' : 'text-cyan-500'} rotate-12`} />
                        </div>

                        <div className="relative z-10">
                            <h2 className={`text-3xl md:text-5xl font-black mb-6 ${isDayMode ? 'text-slate-900' : ''}`}>Hala Cevap Bulamadınız mı?</h2>
                            <p className={`${isDayMode ? mutedText : 'text-gray-400'} text-lg mb-12 max-w-2xl mx-auto`}>
                                Uzman ekibimiz sorularınızı yanıtlamak için burada. Bize dilediğiniz zaman ulaşabilirsiniz.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link
                                    to="/contact"
                                    className="btn-premium px-12 py-5 text-xl font-black tracking-widest shadow-2xl"
                                >
                                    İLETİŞİME GEÇ
                                </Link>
                                <button className={`flex items-center justify-center gap-3 px-10 py-5 rounded-2xl transition-all font-bold group ${isDayMode ? 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 shadow-day' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                                    <Zap className={`w-5 h-5 ${isDayMode ? 'text-sky-500' : 'text-cyan-400'}`} />
                                    Canlı Destek
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

