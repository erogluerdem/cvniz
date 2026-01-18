import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Send, Loader2, Wand2, ArrowRight, AlertCircle, ShieldCheck, Clock, ChevronDown } from 'lucide-react'
import { generateProfileSummary, isAIConfigured } from '../services/AIService'

export default function AIDemo() {
    const navigate = useNavigate()
    const [jobTitle, setJobTitle] = useState('')
    const [result, setResult] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [sector, setSector] = useState('')
    const [seniority, setSeniority] = useState('')
    const [targetRole, setTargetRole] = useState('')
    const [animatedResult, setAnimatedResult] = useState('')

    const roleSuggestions = ['Ürün Yöneticisi', 'Veri Bilimci', 'SaaS Satış Lideri', 'Girişimcilik Mentoru', 'Frontend Tech Lead', 'Growth Pazarlamacısı']
    const seniorityOptions = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Director']
    const featureHighlights = [
        { icon: Wand2, title: 'Akıllı İçgörüler', description: 'Rolünüze göre tonu ve odak noktalarını otomatik ayarlar.' },
        { icon: Clock, title: '30 Saniyede Hazır', description: 'Profil özetinizi beklemeden taslağa dönüştürün.' }
    ]

    const buildPrompt = () => {
        const contextParts = [jobTitle]
        if (sector) contextParts.push(`Sektör: ${sector}`)
        if (seniority) contextParts.push(`Kıdem: ${seniority}`)
        if (targetRole) contextParts.push(`Hedef Rol: ${targetRole}`)
        return contextParts.filter(Boolean).join(' • ')
    }

    useEffect(() => {
        if (!result) {
            setAnimatedResult('')
            return
        }

        setAnimatedResult('')
        let charIndex = 0
        const typingInterval = setInterval(() => {
            charIndex += 1
            setAnimatedResult(result.slice(0, charIndex))

            if (charIndex >= result.length) {
                clearInterval(typingInterval)
            }
        }, 12)

        return () => clearInterval(typingInterval)
    }, [result])

    const handleGenerate = async () => {
        if (!jobTitle) return
        const prompt = buildPrompt()
        setLoading(true)
        setResult('')
        setError('')

        // Check if AI is configured
        if (!isAIConfigured()) {
            // Fallback to demo responses
            setTimeout(() => {
                const results = {
                    'yazılım': "8+ yıllık deneyime sahip Kıdemli Yazılım Geliştirici. Modern web teknolojilerinde (React, Node.js, Go) uzmanlaşmış, ölçeklenebilir mimariler ve yüksek performanslı ekipler yönetme konusunda kanıtlanmış bir geçmişe sahiptir. Karmaşık teknik zorlukları iş değerine dönüştürmeye odaklanır.",
                    'tasarım': "Kullanıcı merkezli tasarım prensiplerine odaklanan, yaratıcı Ürün Tasarımcısı. 5 yıllık ajans ve start-up deneyimi ile mobil ve web uygulamalarında estetik ve fonksiyonelliği birleştiren, dönüştürücü arayüzler tasarlama konusunda uzmandır.",
                    'pazarlama': "Veri odaklı stratejiler geliştiren Dijital Pazarlama Stratejisti. Büyümeyi teşvik etmek için SEO, SEM ve içerik pazarlamasını kullanarak marka bilinirliğini ve ROI'yi artırma konusunda 6 yıllık başarı öyküsüne sahiptir.",
                    'mühendis': "Yenilikçi çözümler üreten ve karmaşık teknik problemleri çözen deneyimli Mühendis. Proje yönetimi, ekip koordinasyonu ve süreç optimizasyonu konularında uzmanlaşmış, sonuç odaklı bir profesyonel.",
                    'öğretmen': "Öğrenci merkezli eğitim yaklaşımıyla fark yaratan Eğitimci. Modern öğretim metodolojileri ve teknoloji entegrasyonu konusunda deneyimli, iletişim becerileri güçlü bir profesyonel.",
                    'doktor': "Hasta odaklı yaklaşımı benimseyen, güncel tıbbi gelişmeleri takip eden Sağlık Profesyoneli. Tanı, tedavi ve hasta iletişimi konularında geniş deneyime sahip, empati yeteneği yüksek bir hekim.",
                    'avukat': "Hukuki analiz ve dava yönetimi konularında uzmanlaşmış Hukuk Profesyoneli. Müvekkil haklarını korumaya odaklı, detaycı ve araştırmacı kişiliğe sahip deneyimli bir avukat.",
                    'default': `${jobTitle} alanında tutkulu ve sonuç odaklı profesyonel. Sektördeki en iyi uygulamaları takip ederek projelerde yenilikçi çözümler üretmeye ve takım başarısına katkıda bulunmaya odaklanmaktadır.`
                }

                const key = Object.keys(results).find(k => jobTitle.toLowerCase().includes(k)) || 'default'
                setResult(results[key])
                setLoading(false)
            }, 1500)
            return
        }

        // Real API call
        try {
            const summary = await generateProfileSummary(prompt)
            setResult(summary?.trim?.() || summary)
        } catch (err) {
            setError(err.message)
            // Fallback on error
            setResult(`${jobTitle} alanında tutkulu ve sonuç odaklı profesyonel. Sektördeki en iyi uygulamaları takip ederek projelerde yenilikçi çözümler üretmeye odaklanmaktadır.`)
        } finally {
            setLoading(false)
        }
    }

    const handleCopy = () => {
        if (!result) return
        navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCreateCV = () => {
        // Store the generated profile in localStorage for the editor
        const aiGeneratedData = {
            jobTitle,
            sector,
            seniority,
            targetRole,
            summary: result,
            prompt: buildPrompt(),
            createdAt: new Date().toISOString()
        }
        localStorage.setItem('CVniz_ai_generated', JSON.stringify(aiGeneratedData))

        // Navigate to editor
        navigate('/editor?ai=true')
    }

    return (
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border border-white/10 shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Sparkles className="w-32 h-32 text-cyan-400" />
            </div>

            <div className="relative z-10 space-y-10">
                <div className="grid lg:grid-cols-[1.15fr,0.85fr] gap-10 items-start">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium">
                            <Wand2 className="w-4 h-4" />
                            <span>AI Özelliklerini Deneyin</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                            AI ile <span className="gradient-text">kişisel marka hikayenizi</span> birkaç saniyede yazdırın
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Rolünüzü, hedeflediğiniz pozisyonu ve çalıştığınız sektörü paylaşın; CVniz AI tonu, odak noktalarını ve başarı vurgularını kendiliğinden ayarlasın.
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {roleSuggestions.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setJobTitle(role)}
                                    className={`px-4 py-1.5 rounded-full border text-sm transition ${jobTitle === role ? 'border-cyan-400 text-cyan-200 bg-cyan-400/10' : 'border-white/10 text-gray-400 hover:border-cyan-400/60 hover:text-white'}`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {featureHighlights.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div key={feature.title} className="p-4 rounded-2xl border border-white/10 bg-black/20 flex items-start gap-4">
                                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-300">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{feature.title}</p>
                                            <p className="text-sm text-gray-400">{feature.description}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex flex-wrap gap-6 pt-4 border-t border-white/5 text-sm text-gray-400">
                            <div>
                                <p className="text-3xl font-bold text-white">120K+</p>
                                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">AI Destekli CV</p>
                            </div>
                            <div className="flex items-center gap-2 max-w-xs">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                <p>Veri gizliliği için yerel önbellek ve uçtan uca şifreleme kullanıyoruz.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-[0.3em] text-gray-400">Rolünüz</label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                    placeholder="Örn: Kıdemli Yazılım Mühendisi"
                                    className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition text-base"
                                />
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !jobTitle}
                                    className="btn-premium px-6 py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-base"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" />Oluştur</>}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-xs text-gray-500 uppercase tracking-[0.35em]">Popüler roller</span>
                            <div className="flex flex-wrap gap-2">
                                {roleSuggestions.map((role) => (
                                    <button
                                        key={`${role}-chip`}
                                        onClick={() => setJobTitle(role)}
                                        className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-cyan-400/60"
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border border-white/10 rounded-2xl p-4 space-y-4 bg-black/20">
                            <button
                                onClick={() => setShowAdvanced((prev) => !prev)}
                                className="w-full flex items-center justify-between text-sm text-gray-300"
                            >
                                <span>Daha fazla bağlam ekle</span>
                                <ChevronDown className={`w-4 h-4 transition ${showAdvanced ? 'rotate-180' : ''}`} />
                            </button>

                            {showAdvanced && (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={sector}
                                        onChange={(e) => setSector(e.target.value)}
                                        placeholder="Sektör (örn. Fintech, Sağlık, SaaS)"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    />
                                    <select
                                        value={seniority}
                                        onChange={(e) => setSeniority(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 appearance-none"
                                    >
                                        <option value="">Kıdem seviyeniz</option>
                                        {seniorityOptions.map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="Hedeflenen rol (örn. Ürün Direktörü)"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                                    />
                                    <p className="text-xs text-gray-500">Bu bilgiler tonlama, vurgu ve başarı metriklerini kişiselleştirmek için kullanılır.</p>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Demo modu aktif - AI yapılandırılmadı
                            </div>
                        )}

                        {result && (
                            <div className="bg-gradient-to-b from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 space-y-5 animate-fade-in shadow-inner">
                                <p className="text-gray-200 leading-relaxed text-base">
                                    “{animatedResult || result}”
                                </p>
                                <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-gray-500">
                                    <span>AI tarafından önerildi</span>
                                    <button onClick={handleCopy} className="tracking-normal text-cyan-400 hover:text-cyan-300 text-[11px]">
                                        {copied ? '✓ Kopyalandı' : 'Kopyala'}
                                    </button>
                                </div>
                                <button
                                    onClick={handleCreateCV}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold text-base flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-500/25"
                                >
                                    Bu profille CV oluştur
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

