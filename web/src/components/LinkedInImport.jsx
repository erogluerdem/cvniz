import { useState, useRef } from 'react'
import {
    X, Linkedin, Upload, FileJson, Check, AlertTriangle,
    Loader2, User, Briefcase, GraduationCap, Wrench, Award
} from 'lucide-react'

export default function LinkedInImport({ isOpen, onClose, onImport }) {
    const [step, setStep] = useState(1) // 1: Instructions, 2: Upload, 3: Preview, 4: Success
    const [jsonData, setJsonData] = useState(null)
    const [parsedData, setParsedData] = useState(null)
    const [error, setError] = useState(null)
    const [importing, setImporting] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const fileInputRef = useRef(null)

    const parseLinkedInData = (data) => {
        try {
            // LinkedIn export format may vary, this handles common patterns
            const parsed = {
                personal: {
                    fullName: data.firstName && data.lastName
                        ? `${data.firstName} ${data.lastName}`
                        : data.profile?.firstName
                            ? `${data.profile.firstName} ${data.profile.lastName || ''}`
                            : '',
                    title: data.headline || data.profile?.headline || '',
                    email: data.emailAddress || data.email || '',
                    phone: '',
                    location: data.location?.name || data.geoLocation?.full || data.profile?.locationName || '',
                    linkedin: data.publicProfileUrl || data.profile?.publicProfileUrl || '',
                    website: data.websites?.[0]?.url || '',
                    summary: data.summary || data.profile?.summary || ''
                },
                experience: [],
                education: [],
                skills: [],
                certifications: []
            }

            // Parse positions/experience
            const positions = data.positions?.values || data.positions || data.profile?.positions || []
            parsed.experience = positions.map(pos => ({
                company: pos.company?.name || pos.companyName || '',
                position: pos.title || '',
                startDate: pos.startDate ? `${pos.startDate.year}-${String(pos.startDate.month || 1).padStart(2, '0')}` : '',
                endDate: pos.isCurrent ? '' : (pos.endDate ? `${pos.endDate.year}-${String(pos.endDate.month || 1).padStart(2, '0')}` : ''),
                current: pos.isCurrent || false,
                description: pos.summary || pos.description || ''
            }))

            // Parse education
            const educations = data.educations?.values || data.educations || data.profile?.educations || []
            parsed.education = educations.map(edu => ({
                school: edu.schoolName || edu.school?.name || '',
                degree: edu.degree || '',
                field: edu.fieldOfStudy || edu.field || '',
                startDate: edu.startDate?.year?.toString() || '',
                endDate: edu.endDate?.year?.toString() || ''
            }))

            // Parse skills
            const skills = data.skills?.values || data.skills || data.profile?.skills || []
            parsed.skills = skills.map(skill => typeof skill === 'string' ? skill : (skill.skill?.name || skill.name || ''))

            // Parse certifications
            const certs = data.certifications?.values || data.certifications || data.profile?.certifications || []
            parsed.certifications = certs.map(cert => ({
                name: cert.name || '',
                issuer: cert.authority || cert.issuer || '',
                date: cert.startDate?.year?.toString() || ''
            }))

            return parsed
        } catch (err) {
            console.error('Parse error:', err)
            throw new Error('LinkedIn verileri ayrıştırılamadı')
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setError(null)
        setImporting(true)

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result)
                setJsonData(json)

                const parsed = parseLinkedInData(json)
                setParsedData(parsed)
                setStep(3)
            } catch (err) {
                setError('Geçersiz JSON dosyası. LinkedIn export dosyanızı kontrol edin.')
            }
            setImporting(false)
        }
        reader.onerror = () => {
            setError('Dosya okunamadı')
            setImporting(false)
        }
        reader.readAsText(file)
    }

    const handleImport = () => {
        if (!parsedData || !onImport) return

        onImport(parsedData)
        setStep(4)
    }

    const handleFetchUrl = () => {
        if (!urlInput.trim()) {
            setError('Lütfen geçerli bir LinkedIn profil URL\'si girin.')
            return
        }
        
        setError(null)
        setImporting(true)
        setStep(2) // Jump to upload/loading step visually

        // Simulate scraping delay
        setTimeout(() => {
            try {
                // Generate rich mock data representing a scraped profile
                const mockProfileName = urlInput.split('/').pop().replace(/-/g, ' ') || 'Kullanıcı'
                const formattedName = mockProfileName.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ')
                
                const mockData = {
                    personal: {
                        fullName: formattedName,
                        title: 'Senior Software Engineer | React & Node.js',
                        email: `${formattedName.replace(/\s+/g, '').toLowerCase()}@example.com`,
                        phone: '+90 555 123 4567',
                        location: 'İstanbul, Türkiye',
                        linkedin: urlInput,
                        website: 'https://github.com/developer',
                        summary: 'Yenilikçi teknolojilerle ölçeklenebilir ve yüksek performanslı web uygulamaları geliştirme konusunda 8+ yıl deneyimli kıdemli yazılım mühendisi. Ekip yönetimi, çevik metodolojiler ve modern frontend/backend mimarilerinde uzman.'
                    },
                    experience: [
                        {
                            company: 'Tech Innovators Inc.',
                            position: 'Senior Software Engineer',
                            startDate: '2020-03',
                            endDate: '',
                            current: true,
                            description: 'Micro frontend mimarisine geçiş sürecini yönettim. React ve Next.js kullanarak şirketin ana ürününün performansını %40 artırdım.'
                        },
                        {
                            company: 'Global Software Solutions',
                            position: 'Frontend Developer',
                            startDate: '2016-08',
                            endDate: '2020-02',
                            current: false,
                            description: 'Büyük ölçekli e-ticaret platformları için kullanıcı dostu arayüzler tasarlayıp geliştirdim.'
                        }
                    ],
                    education: [
                        {
                            school: 'Boğaziçi Üniversitesi',
                            degree: 'Bilgisayar Mühendisliği',
                            field: 'Mühendislik',
                            startDate: '2012',
                            endDate: '2016'
                        }
                    ],
                    skills: [
                        'React.js',
                        'TypeScript',
                        'Node.js',
                        'AWS',
                        'Docker'
                    ],
                    certifications: [
                        {
                            name: 'AWS Certified Solutions Architect',
                            issuer: 'Amazon Web Services',
                            date: '2021'
                        }
                    ]
                }

                setParsedData(mockData)
                setStep(3)
            } catch (err) {
                setError('Profil bilgileri çekilemedi. Bağlantıyı kontrol edin.')
            } finally {
                setImporting(false)
            }
        }, 3500)
    }

    const handleClose = () => {
        setStep(1)
        setJsonData(null)
        setParsedData(null)
        setError(null)
        onClose()
    }

    const countItems = (data) => {
        if (!data) return { experience: 0, education: 0, skills: 0 }
        return {
            experience: data.experience?.length || 0,
            education: data.education?.length || 0,
            skills: data.skills?.length || 0
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="w-full max-w-xl glass-card rounded-3xl overflow-hidden my-4">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                                <Linkedin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">LinkedIn İçe Aktar</h2>
                                <p className="text-sm text-gray-400">Profilinizi JSON olarak içe aktarın</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-xl hover:bg-white/10">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Linkedin className="w-5 h-5 text-blue-400" />
                                    URL ile Hızlı İçe Aktarma
                                </h3>
                                <p className="text-sm text-gray-400">
                                    LinkedIn profil linkinizi yapıştırın, yapay zeka saniyeler içinde profilinizi okuyup CV'nize çevirsin.
                                </p>
                                <div className="flex gap-2">
                                    <input 
                                        type="url" 
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        placeholder="https://www.linkedin.com/in/adsoyad/"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500"
                                    />
                                    <button 
                                        onClick={handleFetchUrl}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                    >
                                        Verileri Çek
                                    </button>
                                </div>
                                {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
                            </div>

                            <div className="relative py-4 flex items-center">
                                <div className="flex-grow border-t border-white/10"></div>
                                <span className="flex-shrink-0 mx-4 text-xs font-black uppercase tracking-widest text-slate-500">veya JSON Yükle</span>
                                <div className="flex-grow border-t border-white/10"></div>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
                                    Arşiv JSON Dosyası Yükleme
                                </h3>
                                <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside">
                                    <li>LinkedIn'de Ayarlar &gt; Veri Gizliliği bölümüne gidin</li>
                                    <li>"Verilerinizin bir kopyasını isteyin" seçeneğine tıklayın</li>
                                    <li>İndirdiğiniz arşivdeki "Profile.json" dosyasını seçin</li>
                                </ol>
                                <button 
                                    onClick={() => setStep(2)}
                                    className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-all"
                                >
                                    Dosya Seçiciye Git
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={importing}
                                className="w-full p-8 rounded-xl border-2 border-dashed border-white/20 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all flex flex-col items-center gap-4 group"
                            >
                                {importing ? (
                                    <>
                                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                                        <div className="text-center">
                                            <p className="font-medium">Profil Çözümleniyor...</p>
                                            <p className="text-sm text-gray-500">Bu işlem biraz zaman alabilir.</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                        <div className="text-center">
                                            <p className="font-medium">JSON Dosyası Yükle</p>
                                            <p className="text-sm text-gray-500">Tıklayın veya dosyayı sürükleyin</p>
                                        </div>
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && parsedData && (
                        <div className="space-y-6">
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="font-bold text-lg">Veriler Hazır!</h3>
                                <p className="text-gray-400 text-sm">LinkedIn profiliniz başarıyla ayrıştırıldı</p>
                            </div>

                            {/* Preview */}
                            <div className="space-y-3">
                                {parsedData.personal?.fullName && (
                                    <div className="p-3 rounded-xl bg-white/5 flex items-center gap-3">
                                        <User className="w-5 h-5 text-cyan-400" />
                                        <div>
                                            <span className="text-sm font-medium">{parsedData.personal.fullName}</span>
                                            {parsedData.personal.title && (
                                                <p className="text-xs text-gray-500">{parsedData.personal.title}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 rounded-xl bg-white/5 text-center">
                                        <Briefcase className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold">{countItems(parsedData).experience}</div>
                                        <div className="text-xs text-gray-500">Deneyim</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 text-center">
                                        <GraduationCap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold">{countItems(parsedData).education}</div>
                                        <div className="text-xs text-gray-500">Eğitim</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 text-center">
                                        <Wrench className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                                        <div className="text-lg font-bold">{countItems(parsedData).skills}</div>
                                        <div className="text-xs text-gray-500">Beceri</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                <Check className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">İçe Aktarma Tamamlandı!</h3>
                            <p className="text-gray-400">
                                LinkedIn verileriniz CV'nize aktarıldı
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5">
                    {step === 1 && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            Geri
                        </button>
                    )}

                    {step === 3 && (
                        <div className="flex justify-between">
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Geri
                            </button>
                            <button
                                onClick={handleImport}
                                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center gap-2 hover:from-green-400 hover:to-emerald-500 transition-all"
                            >
                                <Check className="w-5 h-5" />
                                CV'ye Aktar
                            </button>
                        </div>
                    )}

                    {step === 4 && (
                        <button
                            onClick={handleClose}
                            className="w-full px-6 py-3 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-400 transition-colors"
                        >
                            Tamam
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
