import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    X, Sparkles, Wand2, Copy, Check, RefreshCw, 
    Briefcase, Code, Rocket, Target, Zap, ChevronRight,
    FileText, ArrowRight, Lightbulb
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { aiAPI } from '../services/api'

// Proje türleri
const PROJECT_TYPES = [
    { id: 'web', label: 'Web Uygulaması', icon: '🌐', color: 'from-blue-500 to-cyan-500' },
    { id: 'mobile', label: 'Mobil Uygulama', icon: '📱', color: 'from-purple-500 to-pink-500' },
    { id: 'api', label: 'API / Backend', icon: '⚙️', color: 'from-green-500 to-emerald-500' },
    { id: 'data', label: 'Data / ML', icon: '📊', color: 'from-orange-500 to-amber-500' },
    { id: 'devops', label: 'DevOps / Infra', icon: '🔧', color: 'from-gray-500 to-slate-500' },
    { id: 'other', label: 'Diğer', icon: '💡', color: 'from-indigo-500 to-violet-500' }
]

// Örnek AI yanıtları (gerçek projede API kullanılır)
const generateProjectDescription = (input, type) => {
    const templates = {
        web: [
            `Modern ve ölçeklenebilir bir ${input.name || 'web uygulaması'} geliştirdim. ${input.tech ? `${input.tech} teknolojileri kullanarak` : ''} kullanıcı deneyimini ön planda tutan, responsive ve erişilebilir bir arayüz tasarladım. Proje kapsamında ${input.features || 'kullanıcı yönetimi, gerçek zamanlı bildirimler ve analitik dashboard'} özelliklerini implement ettim. Sonuç olarak ${input.impact || 'kullanıcı memnuniyetinde %40 artış ve sayfa yüklenme süresinde %60 iyileşme'} sağladım.`,
            `${input.name || 'E-ticaret platformu'} için full-stack geliştirme yaptım. ${input.tech || 'React, Node.js ve PostgreSQL'} kullanarak ${input.features || 'ödeme entegrasyonu, envanter yönetimi ve müşteri portalı'} modüllerini geliştirdim. Agile metodoloji ile 3 haftalık sprintler halinde çalışarak, ${input.impact || 'go-live süresini %30 kısalttım ve 10.000+ kullanıcıya ulaştım'}.`
        ],
        mobile: [
            `Cross-platform ${input.name || 'mobil uygulama'} geliştirdim. ${input.tech || 'React Native ve Firebase'} kullanarak ${input.features || 'push notification, offline mode ve biometric authentication'} özelliklerini entegre ettim. App Store ve Google Play'de yayınlanan uygulama ${input.impact || '50.000+ indirme ve 4.8 yıldız rating'} elde etti.`,
            `Native ${input.name || 'iOS/Android uygulama'} için UI/UX odaklı geliştirme yaptım. ${input.tech || 'Swift/Kotlin'} ile ${input.features || 'real-time chat, harita entegrasyonu ve sosyal paylaşım'} modüllerini implement ettim. ${input.impact || 'Kullanıcı retention oranını %35 artırdım'}.`
        ],
        api: [
            `Yüksek performanslı ${input.name || 'RESTful API'} tasarladım ve geliştirdim. ${input.tech || 'Node.js, Express ve MongoDB'} kullanarak ${input.features || 'authentication, rate limiting ve caching'} mekanizmalarını kurdum. Mikroservis mimarisi ile ${input.impact || 'günlük 1M+ request işleme kapasitesi ve %99.9 uptime'} sağladım.`,
            `${input.name || 'GraphQL API'} geliştirdim. ${input.tech || 'Apollo Server ve PostgreSQL'} ile ${input.features || 'subscription, batching ve federation'} özelliklerini implement ettim. ${input.impact || 'API response time\'ı %70 düşürdüm ve developer experience\'ı iyileştirdim'}.`
        ],
        data: [
            `${input.name || 'Veri analiz pipeline\'ı'} oluşturdum. ${input.tech || 'Python, Pandas ve Spark'} kullanarak ${input.features || 'ETL süreçleri, veri temizleme ve görselleştirme'} adımlarını otomatize ettim. ${input.impact || 'Manuel raporlama süresini %80 azalttım ve real-time dashboard\'lar oluşturdum'}.`,
            `${input.name || 'Machine Learning modeli'} geliştirdim. ${input.tech || 'TensorFlow ve Scikit-learn'} ile ${input.features || 'tahminleme, sınıflandırma ve anomali tespiti'} algoritmalarını implement ettim. ${input.impact || '%92 doğruluk oranı ve production\'da 6 ay sorunsuz çalışma'} sağladım.`
        ],
        devops: [
            `${input.name || 'CI/CD pipeline'} kurdum ve yönettim. ${input.tech || 'Docker, Kubernetes ve GitHub Actions'} kullanarak ${input.features || 'otomatik test, deployment ve monitoring'} süreçlerini oluşturdum. ${input.impact || 'Deployment süresini 2 saatten 10 dakikaya düşürdüm'}.`,
            `${input.name || 'Cloud altyapısı'} tasarladım. ${input.tech || 'AWS/Azure/GCP'} üzerinde ${input.features || 'auto-scaling, load balancing ve disaster recovery'} çözümlerini implement ettim. ${input.impact || 'Altyapı maliyetlerini %40 azalttım ve %99.99 availability'} elde ettim.`
        ],
        other: [
            `${input.name || 'Innovative proje'} geliştirdim. ${input.tech || 'Modern teknolojiler'} kullanarak ${input.features || 'benzersiz özellikler ve kullanıcı odaklı çözümler'} sundum. ${input.impact || 'Pozitif kullanıcı geri bildirimleri ve başarılı proje teslimi'} sağladım.`
        ]
    }

    const typeTemplates = templates[type] || templates.other
    return typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
}

const generateBulletPoints = (input, type) => {
    const bullets = [
        `${input.tech || 'Modern teknolojiler'} kullanarak end-to-end geliştirme yaptım`,
        `${input.features || 'Temel özellikler'} modüllerini tasarladım ve implement ettim`,
        `Kod kalitesi için unit test ve integration test yazdım (%85+ coverage)`,
        `Agile/Scrum metodolojisi ile cross-functional takımda çalıştım`,
        `Code review ve pair programming ile bilgi paylaşımı yaptım`,
        `${input.impact || 'Ölçülebilir iş sonuçları'} elde ettim`,
        `Teknik dokümantasyon ve API documentation hazırladım`,
        `Performance optimization ve security best practices uyguladım`
    ]
    return bullets.slice(0, 5)
}

export default function AIProjectWriter({ isOpen, onClose, onInsert, existingProject }) {
    const { isPremium } = useAuth()
    const [step, setStep] = useState(1)
    const [projectType, setProjectType] = useState('web')
    const [input, setInput] = useState({
        name: existingProject?.title || '',
        tech: existingProject?.technologies?.join(', ') || '',
        features: '',
        impact: '',
        role: ''
    })
    const [generatedText, setGeneratedText] = useState('')
    const [bulletPoints, setBulletPoints] = useState([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [copied, setCopied] = useState(false)
    const [outputType, setOutputType] = useState('paragraph') // paragraph, bullets

    const handleGenerate = async () => {
        setIsGenerating(true)
        
        try {
            const response = await aiAPI.generateProject({
                input,
                type: projectType,
                outputType
            });
            
            if (response.success && response.data) {
                if (outputType === 'paragraph') {
                    setGeneratedText(response.data.description || generateProjectDescription(input, projectType));
                } else {
                    setBulletPoints(response.data.bullets || generateBulletPoints(input, projectType));
                }
            } else {
                throw new Error("API returned no data");
            }
        } catch (error) {
            console.warn("AI Project Writer API failed, using fallback.", error);
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            if (outputType === 'paragraph') {
                const description = generateProjectDescription(input, projectType)
                setGeneratedText(description)
            } else {
                const bullets = generateBulletPoints(input, projectType)
                setBulletPoints(bullets)
            }
        }
        
        setIsGenerating(false)
        setStep(3)
    }

    const handleRegenerate = async () => {
        setIsGenerating(true)
        
        try {
            const response = await aiAPI.generateProject({
                input,
                type: projectType,
                outputType,
                regenerate: true
            });
            
            if (response.success && response.data) {
                if (outputType === 'paragraph') {
                    setGeneratedText(response.data.description || generateProjectDescription(input, projectType));
                } else {
                    setBulletPoints(response.data.bullets || generateBulletPoints(input, projectType));
                }
            } else {
                throw new Error("API returned no data");
            }
        } catch (error) {
            console.warn("AI Project Writer API failed, using fallback.", error);
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            if (outputType === 'paragraph') {
                const description = generateProjectDescription(input, projectType)
                setGeneratedText(description)
            } else {
                const bullets = generateBulletPoints(input, projectType)
                setBulletPoints(bullets)
            }
        }
        
        setIsGenerating(false)
    }

    const handleCopy = () => {
        const text = outputType === 'paragraph' ? generatedText : bulletPoints.join('\n• ')
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleInsert = () => {
        if (onInsert) {
            onInsert({
                description: outputType === 'paragraph' ? generatedText : bulletPoints.join('\n• '),
                bullets: bulletPoints
            })
        }
        onClose()
    }

    const resetForm = () => {
        setStep(1)
        setInput({ name: '', tech: '', features: '', impact: '', role: '' })
        setGeneratedText('')
        setBulletPoints([])
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <Wand2 className="text-white" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">AI Proje Yazıcı</h2>
                                    <p className="text-gray-400 text-sm">Projelerinizi profesyonel dille yazın</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-2 mt-4">
                            {[1, 2, 3].map(s => (
                                <div key={s} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                        step >= s 
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                                            : 'bg-gray-700 text-gray-400'
                                    }`}>
                                        {s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-12 h-1 mx-1 rounded ${step > s ? 'bg-purple-500' : 'bg-gray-700'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Step 1: Project Type */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">Proje Türü Seçin</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                    {PROJECT_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setProjectType(type.id)}
                                            className={`p-4 rounded-xl border transition-all text-left ${
                                                projectType === type.id
                                                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50'
                                                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <span className="text-2xl mb-2 block">{type.icon}</span>
                                            <span className="text-white font-medium text-sm">{type.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    Devam Et
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Project Details */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-4">Proje Detayları</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Proje Adı *</label>
                                        <input
                                            type="text"
                                            value={input.name}
                                            onChange={(e) => setInput({ ...input, name: e.target.value })}
                                            placeholder="Örn: E-ticaret Platformu"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Kullandığınız Teknolojiler</label>
                                        <input
                                            type="text"
                                            value={input.tech}
                                            onChange={(e) => setInput({ ...input, tech: e.target.value })}
                                            placeholder="Örn: React, Node.js, MongoDB"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Ana Özellikler</label>
                                        <input
                                            type="text"
                                            value={input.features}
                                            onChange={(e) => setInput({ ...input, features: e.target.value })}
                                            placeholder="Örn: Ödeme entegrasyonu, gerçek zamanlı bildirimler"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Elde Edilen Sonuçlar / Etki</label>
                                        <input
                                            type="text"
                                            value={input.impact}
                                            onChange={(e) => setInput({ ...input, impact: e.target.value })}
                                            placeholder="Örn: %40 performans artışı, 10.000+ kullanıcı"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Çıktı Formatı</label>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setOutputType('paragraph')}
                                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                                    outputType === 'paragraph'
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                }`}
                                            >
                                                📝 Paragraf
                                            </button>
                                            <button
                                                onClick={() => setOutputType('bullets')}
                                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                                    outputType === 'bullets'
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                }`}
                                            >
                                                📋 Madde İşaretli
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Geri
                                    </button>
                                    <button
                                        onClick={handleGenerate}
                                        disabled={!input.name || isGenerating}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Oluşturuluyor...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} />
                                                AI ile Oluştur
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Result */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">AI Tarafından Oluşturuldu</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleRegenerate}
                                            disabled={isGenerating}
                                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            title="Yeniden Oluştur"
                                        >
                                            <RefreshCw size={18} className={`text-gray-400 ${isGenerating ? 'animate-spin' : ''}`} />
                                        </button>
                                        <button
                                            onClick={handleCopy}
                                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Kopyala"
                                        >
                                            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-gray-400" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
                                    {outputType === 'paragraph' ? (
                                        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                            {generatedText}
                                        </p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {bulletPoints.map((bullet, i) => (
                                                <li key={i} className="text-gray-200 flex items-start gap-2">
                                                    <span className="text-purple-400 mt-1">•</span>
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                {/* Tips */}
                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="text-purple-400 mt-0.5" size={20} />
                                        <div>
                                            <p className="text-purple-300 font-medium text-sm">İpucu</p>
                                            <p className="text-gray-400 text-sm">
                                                Metni CV'nize eklemeden önce kendi deneyimlerinize göre düzenleyebilirsiniz. 
                                                Rakamlar ve somut sonuçlar işe alım yöneticilerinin dikkatini çeker.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={resetForm}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors"
                                    >
                                        Yeni Proje
                                    </button>
                                    <button
                                        onClick={handleInsert}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                    >
                                        <FileText size={20} />
                                        CV'ye Ekle
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Premium Badge */}
                    {!isPremium && (
                        <div className="absolute top-4 right-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            PRO
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
