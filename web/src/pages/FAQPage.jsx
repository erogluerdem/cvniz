import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Search, HelpCircle, MessageCircle, User, CreditCard, ShieldCheck, Zap, FileText, ArrowRight, Plus, Minus, Briefcase, Settings, Star, Palette, Sparkles, LogOut, CheckCircle2 } from 'lucide-react'

const faqs = [
    {
        category: 'Genel',
        icon: <User className="w-5 h-5" />,
        questions: [
            { q: 'CVniz nedir?', a: 'CVniz, profesyonel CV\'ler oluşturmanızı sağlayan AI destekli yeni nesil bir web uygulamasıdır. 65+ modern şablon ve gerçek zamanlı önizleme ile dakikalar içinde işverenlerin dikkatini çeken etkileyici CV\'ler hazırlayabilirsiniz.' },
            { q: 'Platformu kullanmak ücretsiz mi?', a: 'Evet! Temel CV oluşturucu aracımızı ve başlangıç şablonlarımızı tamamen ücretsiz kullanabilirsiniz. İleri düzey analizler, yapay zeka destekli metin önerileri ve tüm premium şablonlara erişmek isterseniz Pro planımıza geçiş yapabilirsiniz.' },
            { q: 'Hesap oluşturmam zorunlu mu?', a: 'Sistemi denemek ve anında bir CV oluşturmak için hesap oluşturmanız gerekmez. Ancak, tasarladığınız CV\'leri bulutta saklamak, daha sonra dilediğiniz cihazdan düzenlemek ve çoklu CV yönetimi yapmak için ücretsiz bir hesap oluşturmanızı şiddetle tavsiye ederiz.' },
            { q: 'Öğrenciler için özel bir indiriminiz var mı?', a: 'Evet, .edu uzantılı e-posta adresinizle kayıt olduğunuzda tüm premium özelliklerimizi %50 öğrenci indirimiyle kullanabilirsiniz. Profil ayarlarınızdan öğrenci belgenizi veya öğrenci e-postanızı doğrulamanız yeterlidir.' },
            { q: 'Mobil cihazlardan CV hazırlayabilir miyim?', a: 'Kesinlikle! CVniz tamamen responsive (mobil uyumlu) olarak tasarlanmıştır. Akıllı telefonunuzdan veya tabletinizden hiçbir özellik kısıtlaması olmadan kolayca CV hazırlayabilir ve indirebilirsiniz.' },
            { q: 'Platform hangi dilleri destekliyor?', a: 'Şu anda Türkçe ve İngilizce arayüz dil desteğimiz bulunmaktadır. Ancak CV\'nizi oluştururken içerik alanlarına dünyanın tüm dillerinde (Arapça, Rusça, Çince dahil) veri girebilir ve sorunsuz PDF oluşturabilirsiniz.' }
        ]
    },
    {
        category: 'CV Oluşturma',
        icon: <FileText className="w-5 h-5" />,
        questions: [
            { q: 'CV\'mi nasıl oluştururum?', a: 'Çok basit! Önce size en uygun şablonu seçin, ardından kişisel bilgilerinizi, deneyimlerinizi ve eğitiminizi adım adım doldurun. Dilerseniz "AI Asistan" butonuna tıklayarak sektörünüze özel profesyonel metin önerileri alabilirsiniz. İşiniz bittiğinde tek tıkla PDF olarak indirebilirsiniz.' },
            { q: 'Oluşturduğum CV ATS (Aday Takip Sistemi) uyumlu mu?', a: 'Kesinlikle! Tüm premium ve ücretsiz şablonlarımız, dünya çapında İK uzmanları tarafından kullanılan yaygın ATS (Applicant Tracking System) yazılımlarıyla %100 uyumlu okunacak şekilde tasarlanmış ve kodlanmıştır.' },
            { q: 'CV\'me fotoğraf ekleyebilir miyim?', a: 'Evet, CV\'nize profil fotoğrafı ekleyebilirsiniz. Hatta yerleşik fotoğraf düzenleme aracımızla fotoğrafınızı kırpabilir, arka planını silebilir ve renk ayarlarını yapabilirsiniz.' },
            { q: 'Farklı iş başvuruları için farklı CV\'ler hazırlayabilir miyim?', a: 'Elbette. CVniz hesabınızda sınırsız sayıda CV varyasyonu oluşturabilir, her başvurduğunuz pozisyon için yeteneklerinizi ve önceliklerinizi farklı vurgulayabilirsiniz.' },
            { q: 'CV\'mi hangi formatlarda indirebilirim?', a: 'CV\'nizi yüksek çözünürlüklü ve tıklanabilir linklere sahip PDF formatında indirebilirsiniz. Pro kullanıcılarımız aynı zamanda düzenlenebilir Word (.docx) ve TXT formatlarında indirebilirler.' },
            { q: 'Yarım bıraktığım CV\'me daha sonra devam edebilir miyim?', a: 'Üye girişi yaptığınız takdirde sistem yazdığınız her harfi anında buluta kaydeder (Auto-save). Bilgisayarınız kapansa dahi CV\'niz kaldığı yerden devam etmenizi bekler.' }
        ]
    },
    {
        category: 'Şablonlar & Tasarım',
        icon: <Palette className="w-5 h-5" />,
        questions: [
            { q: 'Kendi özel renklerimi seçebilir miyim?', a: 'Evet, Editör içerisindeki Tema sekmesinden şablonunuzun ana renklerini, vurgu renklerini ve metin renklerini HEX kodu girerek veya renk paletinden seçerek dilediğiniz gibi özelleştirebilirsiniz.' },
            { q: 'Yazı tiplerini (Font) değiştirebilir miyim?', a: 'Pro plan kullanıcıları Google Fonts kütüphanesindeki 50\'den fazla seçkin ve profesyonel yazı tipini CV\'sine uygulayabilir. Font büyüklüklerini (10pt, 11pt, 12pt) de serbestçe ayarlayabilirsiniz.' },
            { q: 'Bölümlerin yerlerini değiştirebilir miyim?', a: 'Kesinlikle. Sürükle-bırak (Drag & Drop) özelliği sayesinde örneğin "Eğitim" bölümünü "İş Deneyimi" bölümünün üstüne veya "Yetenekler" kısmını en alt satıra kolayca taşıyabilirsiniz.' },
            { q: 'Hazırladığım içerik başka şablona geçersem silinir mi?', a: 'Hayır, verileriniz şablonlardan tamamen bağımsızdır. İçeriğinizi bir kere girdikten sonra 65+ farklı şablon arasında tek tıkla geçiş yapabilir, bilgileriniz kaybolmadan anında yeni tasarımlar deneyebilirsiniz.' }
        ]
    },
    {
        category: 'Yapay Zeka (AI) Özellikleri',
        icon: <Sparkles className="w-5 h-5" />,
        questions: [
            { q: 'AI Asistan nasıl çalışıyor?', a: 'Bölüm başlığınıza ve pozisyonunuza göre (örneğin: "Satış Müdürü"), sistem size en profesyonel, sektöre uygun ve anahtar kelime zengini madde işaretleri (bullet points) üretir. Beğendiğiniz cümleyi tek tıkla CV\'nize ekleyebilirsiniz.' },
            { q: 'AI Ön Yazı (Cover Letter) oluşturucu var mı?', a: 'Evet! Sadece başvurduğunuz şirketin adını ve pozisyonu girmeniz yeterli. AI asistanımız CV\'nizdeki yetenekleri analiz ederek bu spesifik iş ilanına özel etkileyici bir ön yazı taslağı oluşturur.' },
            { q: 'Yapay zeka dil bilgisi ve yazım hatalarını düzeltiyor mu?', a: 'Evet, yazdığınız metinleri seçip "Gözden Geçir (Proofread)" butonuna tıkladığınızda AI, imla hatalarını düzeltir ve cümle yapısını çok daha profesyonel ve resmi bir dile çevirir.' }
        ]
    },
    {
        category: 'Kariyer İpuçları',
        icon: <Briefcase className="w-5 h-5" />,
        questions: [
            { q: 'Deneyimim yoksa CV\'me ne yazmalıyım?', a: 'Yeni mezun veya öğrenciyseniz, okul projelerinizi, gönüllü çalışmalarınızı, stajlarınızı, katıldığınız kulüpleri ve kişisel yeteneklerinizi ön plana çıkarabilirsiniz. Şablonlarımız, giriş seviyesi adaylar için özel "Eğitim Odaklı" düzenler sunar.' },
            { q: 'CV\'m kaç sayfa olmalı?', a: 'Genel kural olarak, 5 yıldan az deneyimi olan profesyoneller için 1 sayfa idealdir. Daha deneyimli yöneticiler veya akademik geçmişi olanlar için 2 sayfa uygundur. İK uzmanları genellikle kısa ve öz CV\'leri tercih eder.' },
            { q: 'Hobilerimi CV\'me eklemeli miyim?', a: 'Başvurduğunuz pozisyonla ilgiliyse veya kişiliğiniz, liderlik yetenekleriniz hakkında pozitif bir izlenim bırakacaksa (örneğin: Satranç turnuvası birinciliği, takım kaptanlığı) ekleyebilirsiniz. Aksi takdirde (müzik dinlemek, kitap okumak vb.) yer kaplamaması adına çıkarabilirsiniz.' },
            { q: 'Referanslarımı CV\'de belirtmeli miyim?', a: 'Modern CV standartlarında referansları doğrudan yazmak yerine "Talep edildiğinde referans verilecektir" ibaresi kullanmak veya bu bölümü tamamen çıkarmak daha yaygındır. Şirketler genellikle mülakat aşamasından sonra referans talep eder.' }
        ]
    },
    {
        category: 'Hesap Yönetimi',
        icon: <LogOut className="w-5 h-5" />,
        questions: [
            { q: 'Şifremi unuttum, nasıl sıfırlayabilirim?', a: 'Giriş sayfasındaki "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinizi girebilir ve şifre sıfırlama linki talep edebilirsiniz. Link 24 saat boyunca geçerlidir.' },
            { q: 'E-posta adresimi değiştirebilir miyim?', a: 'Evet, Dashboard üzerinden Ayarlar sekmesine giderek hesap e-postanızı güncelleyebilirsiniz. Yeni e-postanıza gelecek doğrulama linkine tıklamanız gerekecektir.' },
            { q: 'Hesabımı sildiğimde CV\'lerim ne olur?', a: 'Hesabınızı sildiğiniz an itibariyle oluşturduğunuz tüm CV\'ler, fotoğraflarınız, kişisel verileriniz ve geçmiş abonelik faturalarınız sistemden geri döndürülemez şekilde ve kalıcı olarak silinir.' }
        ]
    },
    {
        category: 'Ödeme & Planlar',
        icon: <CreditCard className="w-5 h-5" />,
        questions: [
            { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Tüm yerli ve yabancı kredi kartları (Visa, MasterCard, Amex), banka (debit) kartları ve iyzico/Stripe altyapısıyla 3D Secure güvencesinde ödeme yapabilirsiniz.' },
            { q: 'Aboneliğimi istediğim zaman iptal edebilir miyim?', a: 'Evet, aboneliğinizi hiçbir ekstra ücret ödemeden ve taahhüt vermeden "Hesap Ayarları" sayfasından tek tıkla iptal edebilirsiniz. İptal durumunda mevcut ay sonuna kadar özelliklerinizi kullanmaya devam edersiniz.' },
            { q: 'İade politikanız nedir?', a: 'Koşulsuz müşteri memnuniyetine inanıyoruz. Satın alma işleminden sonraki 7 gün içinde memnun kalmazsanız, destek ekibimize ulaşarak hiçbir gerekçe göstermeden %100 ücret iadesi talep edebilirsiniz.' },
            { q: 'Yıllık planda ne kadar tasarruf ederim?', a: 'Yıllık Pro veya Kurumsal planı tercih ederek aylık ödemelere kıyasla tam %40 oranında daha az ödersiniz (12 ay kullanım, 7 ay ödeme).' },
            { q: 'Kurumsal toplu alım indiriminiz var mı?', a: 'Şirketler, üniversiteler ve dernekler için 10+ kullanıcıdan başlayan takım paketlerimizde %60\'a varan özel indirimler sunuyoruz. Fiyatlandırma sayfasından "Satış Ekibiyle İletişime Geçin" butonunu kullanabilirsiniz.' }
        ]
    },
    {
        category: 'Güvenlik & Gizlilik',
        icon: <ShieldCheck className="w-5 h-5" />,
        questions: [
            { q: 'Verilerim nerede saklanıyor?', a: 'Kişisel verileriniz ve CV içerikleriniz, AWS ve Google Cloud destekli yüksek güvenlikli Avrupa (Frankfurt) sunucularımızda 256-bit AES şifreleme ile KVKK ve GDPR uyumlu olarak saklanmaktadır.' },
            { q: 'Kredi kartı bilgilerimi saklıyor musunuz?', a: 'Hayır, ödeme altyapımız tamamen lisanslı ödeme kuruluşları (iyzico vb.) tarafından PCI-DSS standartlarında yönetilir. Kredi kartı verileriniz bizim sunucularımızdan geçmez ve sistemlerimizde asla saklanmaz.' },
            { q: 'İşverenler CV\'mi sisteminizden arayıp bulabilir mi?', a: 'CVniz bir iş bulma portalı veya kariyer havuzu değildir. Verileriniz tamamen gizli kalır ve sadece siz linki kopyalayıp paylaşırsanız başkaları tarafından görülebilir. Özgeçmişlerinizi arama motorlarına bilerek indeksletmiyoruz.' }
        ]
    },
    {
        category: 'Teknik Destek',
        icon: <Settings className="w-5 h-5" />,
        questions: [
            { q: 'PDF indirirken hata alıyorum, ne yapmalıyım?', a: 'Eğer PDF indirirken hata yaşıyorsanız, lütfen tarayıcınızın çerezlerini temizleyin veya gizli (incognito) sekmeden tekrar deneyin. Sorun devam ederse sağ alt köşedeki canlı destekten ekibimize ulaşabilirsiniz.' },
            { q: 'Yapay zeka metin oluşturucu düzgün çalışmıyor?', a: 'Zaman zaman OpenAI API yoğunluğundan dolayı yapay zeka yanıtlarında gecikme yaşanabilir. 1-2 dakika bekleyip tekrar denemenizi veya sayfayı yenilemenizi rica ederiz.' },
            { q: 'Eski bir tarayıcı kullanıyorum, sorun olur mu?', a: 'Modern tasarımımız (Glassmorphism, vb.) ve canlı önizleme özelliğimiz yüksek performans gerektirir. En iyi deneyim için her zaman Google Chrome, Safari veya Firefox\'un en güncel versiyonlarını kullanmanızı tavsiye ediyoruz.' }
        ]
    }
]

// Scroll Animation Hook
function useScrollAnimation() {
    const ref = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return [ref, isVisible]
}

// Animated Section Wrapper
function AnimatedSection({ children, className = '', delay = 0 }) {
    const [ref, isVisible] = useScrollAnimation()

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    )
}

function FAQItem({ question, answer, isOpen, onToggle, isDayMode, mutedText, delay = 0 }) {
    return (
        <AnimatedSection delay={delay} className={`group transition-all duration-500 ${isOpen ? 'mb-6' : 'mb-3'}`}>
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
        </AnimatedSection>
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
            <AnimatedSection className={`relative pt-32 pb-20 px-6 lg:px-12 text-center ${isDayMode ? 'bg-gradient-to-b from-white via-slate-50 to-white' : ''}`}>
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
            </AnimatedSection>

            <div className="max-w-5xl mx-auto px-6 pb-32 relative z-10">
                {!searchQuery && (
                    <AnimatedSection className="flex flex-wrap justify-center gap-3 mb-16 no-scrollbar overflow-x-auto pb-4">
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
                    </AnimatedSection>
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
                                delay={i * 100}
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
                <AnimatedSection className="mt-24 relative">
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
                </AnimatedSection>
            </div>
        </div>
    )
}

