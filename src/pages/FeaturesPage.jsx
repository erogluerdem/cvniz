import { Link } from 'react-router-dom'
import { Sparkles, FileText, Download, Zap, Shield, Clock, Users, Check, Palette, Languages, Share2 } from 'lucide-react'

const features = [
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: 'AI Destekli İçerik',
        description: 'Yapay zeka ile profesyonel özet ve iş deneyimi açıklamaları oluşturun. Sektörünüze özel anahtar kelimeler otomatik eklenir.',
        color: 'from-yellow-500 to-orange-500'
    },
    {
        icon: <FileText className="w-8 h-8" />,
        title: '20+ Premium Şablon',
        description: 'Her sektör için özel tasarlanmış profesyonel şablonlar. Sağlık, Finans, Teknoloji, Hukuk ve daha fazlası.',
        color: 'from-cyan-500 to-blue-500'
    },
    {
        icon: <Download className="w-8 h-8" />,
        title: 'PDF Export',
        description: '300 DPI kalitesinde, baskıya hazır PDF dosyaları. ATS uyumlu formatlar ile başvurularınız öne çıksın.',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: <Zap className="w-8 h-8" />,
        title: 'Gerçek Zamanlı Önizleme',
        description: 'Değişikliklerinizi anında görün. Split-screen editör ile hızlı ve verimli CV hazırlayın.',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: <Palette className="w-8 h-8" />,
        title: 'Renk Özelleştirme',
        description: 'Şablonların renklerini kişiselleştirin. Marka renklerinize uygun CV\'ler oluşturun.',
        color: 'from-pink-500 to-rose-500'
    },
    {
        icon: <Languages className="w-8 h-8" />,
        title: 'Çoklu Dil Desteği',
        description: 'Türkçe ve İngilizce CV\'ler oluşturun. Uluslararası iş başvuruları için hazır.',
        color: 'from-blue-500 to-indigo-500'
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: 'Veri Güvenliği',
        description: 'Tüm verileriniz tarayıcınızda kalır. SSL şifreleme ile %100 gizlilik garantisi.',
        color: 'from-green-600 to-teal-500'
    },
    {
        icon: <Share2 className="w-8 h-8" />,
        title: 'Kolay Paylaşım',
        description: 'CV\'nizi doğrudan e-posta ile gönderin veya link olarak paylaşın.',
        color: 'from-indigo-500 to-purple-500'
    }
]

export default function FeaturesPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Güçlü Özellikler</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        İş arama sürecinizi kolaylaştıran ve sizi öne çıkaran profesyonel araçlar
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="glass-card rounded-2xl p-8 hover:scale-[1.02] transition-transform">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                <div className="mt-20 glass-card rounded-3xl p-10">
                    <h2 className="text-3xl font-bold text-center mb-10">Neden CVify?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold gradient-text mb-2">5 dk</div>
                            <p className="text-gray-400">Ortalama CV oluşturma süresi</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold gradient-text mb-2">%95</div>
                            <p className="text-gray-400">Müşteri memnuniyeti oranı</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
                            <p className="text-gray-400">Oluşturulan CV sayısı</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link to="/editor" className="btn-premium text-lg">
                        Hemen Başla
                    </Link>
                </div>
            </div>
        </div>
    )
}
