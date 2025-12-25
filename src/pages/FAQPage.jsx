import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const faqs = [
    {
        category: 'Genel',
        questions: [
            { q: 'CVify nedir?', a: 'CVify, profesyonel CV\'ler oluşturmanızı sağlayan AI destekli bir web uygulamasıdır. 20+ şablon ve gerçek zamanlı önizleme ile dakikalar içinde etkileyici CV\'ler hazırlayabilirsiniz.' },
            { q: 'CVify ücretsiz mi?', a: 'Evet! Modern şablonumuzu tamamen ücretsiz kullanabilirsiniz. Premium şablonlar için tek seferlik 29₺ ödeme yapmanız yeterli.' },
            { q: 'Hesap oluşturmam gerekiyor mu?', a: 'Hayır, hesap oluşturmadan da CV oluşturabilirsiniz. Ancak CV\'lerinizi kaydetmek ve daha sonra erişmek için ücretsiz hesap oluşturmanızı öneririz.' }
        ]
    },
    {
        category: 'CV Oluşturma',
        questions: [
            { q: 'CV\'mi nasıl oluştururum?', a: 'Şablon seçin, bilgilerinizi girin ve PDF olarak indirin. İşlem 5 dakikadan az sürer.' },
            { q: 'CV\'mi daha sonra düzenleyebilir miyim?', a: 'Evet! Hesabınıza giriş yaparak kaydettiğiniz CV\'leri istediğiniz zaman düzenleyebilirsiniz.' },
            { q: 'Kaç CV oluşturabilirim?', a: 'Ücretsiz planda 1 CV, Pro\'da sınırsız CV oluşturabilirsiniz. Her CV için farklı şablonlar kullanabilirsiniz.' }
        ]
    },
    {
        category: 'PDF & İndirme',
        questions: [
            { q: 'PDF kalitesi nasıl?', a: 'Tüm CV\'ler 300 DPI çözünürlükte, baskıya hazır kalitede PDF olarak dışa aktarılır.' },
            { q: 'Watermark nedir?', a: 'Ücretsiz planda PDF\'lerin köşesinde CVify logosu bulunur. Pro planı ile watermark\'sız PDF indirebilirsiniz.' },
            { q: 'CV\'mi kaç kez indirebilirim?', a: 'Pro paketi ile 1 adet watermark\'sız PDF, Kurumsal paket ile sınırsız indirme hakkınız vardır.' }
        ]
    },
    {
        category: 'Güvenlik & Gizlilik',
        questions: [
            { q: 'Verilerim güvende mi?', a: 'Evet, tüm verileriniz tarayıcınızda kalır ve sunucularımıza gönderilmez. %100 gizlilik garantisi.' },
            { q: 'Verilerimi silebilir miyim?', a: 'Evet, hesabınızdan istediğiniz zaman tüm verilerinizi silebilirsiniz.' }
        ]
    },
    {
        category: 'Ödeme & İade',
        questions: [
            { q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', a: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz.' },
            { q: 'İade politikanız nedir?', a: '7 gün içinde memnun kalmazsanız, hiçbir soru sorulmadan paranızı iade ediyoruz.' },
            { q: 'Ödeme güvenli mi?', a: 'Evet, tüm ödemeler SSL şifreleme ile güvence altındadır. Kart bilgileriniz saklanmaz.' }
        ]
    }
]

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border-b border-white/10 last:border-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left">
                <span className="font-medium text-white pr-4">{question}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
            </button>
            {isOpen && <p className="pb-5 text-gray-400 leading-relaxed">{answer}</p>}
        </div>
    )
}

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('Genel')

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <HelpCircle className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Sık Sorulan Sorular</span>
                    </h1>
                    <p className="text-gray-400">
                        Aradığınız cevabı bulamadınız mı? <Link to="/contact" className="text-cyan-400 hover:underline">Bize ulaşın</Link>
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {faqs.map(cat => (
                        <button
                            key={cat.category}
                            onClick={() => setActiveCategory(cat.category)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${activeCategory === cat.category
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                }`}
                        >
                            {cat.category}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="glass-card rounded-2xl p-6">
                    {faqs.find(f => f.category === activeCategory)?.questions.map((item, i) => (
                        <FAQItem key={i} question={item.q} answer={item.a} />
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="text-center mt-12">
                    <div className="glass-card rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-3">Hala sorunuz mu var?</h3>
                        <p className="text-gray-400 mb-6">Ekibimiz size yardımcı olmaktan mutluluk duyar.</p>
                        <Link to="/contact" className="btn-premium">
                            İletişime Geç
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
