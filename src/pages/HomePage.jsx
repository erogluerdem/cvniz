import { Link } from 'react-router-dom'
import { Sparkles, FileText, Download, Zap, Shield, Clock, Users, ArrowRight, Play } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
    const { user, isAdmin } = useAuth()

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 fade-in">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">🎉 Yeni: 20 Profesyonel Şablon!</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 fade-in">
                        <span className="gradient-text">Profesyonel CV'nizi</span>
                        <br />
                        <span className="text-white">Dakikalar İçinde Oluşturun</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 fade-in">
                        AI destekli 20+ şablonla öne çıkan özgeçmişler hazırlayın.
                        <span className="text-cyan-400 font-semibold"> %95 müşteri memnuniyeti!</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in">
                        <Link to="/editor" className="btn-premium text-lg flex items-center justify-center gap-2 group">
                            Ücretsiz Başla <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/templates" className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Play className="w-5 h-5" /> Şablonları Gör
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-16 fade-in">
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">10K+</div>
                            <div className="text-gray-400 text-sm">CV Oluşturuldu</div>
                        </div>
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">95%</div>
                            <div className="text-gray-400 text-sm">Memnuniyet</div>
                        </div>
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">40+</div>
                            <div className="text-gray-400 text-sm">Şablon</div>
                        </div>
                        <div className="glass-card rounded-2xl p-4">
                            <div className="text-3xl font-bold gradient-text">5 dk</div>
                            <div className="text-gray-400 text-sm">Ortalama Süre</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Features */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">AI Destekli</h3>
                            <p className="text-gray-400 text-sm">Yapay zeka ile içerik oluşturun</p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">20+ Şablon</h3>
                            <p className="text-gray-400 text-sm">Her sektöre özel tasarımlar</p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                                <Download className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">PDF Export</h3>
                            <p className="text-gray-400 text-sm">Yüksek kalite PDF indirin</p>
                        </div>
                        <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-2">Gerçek Zamanlı</h3>
                            <p className="text-gray-400 text-sm">Anlık önizleme</p>
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <Link to="/features" className="text-cyan-400 hover:underline">
                            Tüm Özellikleri Gör →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10"></div>
                        <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-600/30 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold mb-4">
                                Hayalinizdeki <span className="gradient-text">Kariyere</span> Başlayın
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                Hemen ücretsiz başlayın ve profesyonel CV'nizi dakikalar içinde oluşturun.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link to="/editor" className="btn-premium text-lg">
                                    Ücretsiz CV Oluştur
                                </Link>
                                <Link to="/pricing" className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">
                                    Fiyatları Gör
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust */}
            <section className="py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Shield className="w-5 h-5 text-green-400" />
                        <span className="text-sm">SSL Güvenlik</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm">7/24 Erişim</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-5 h-5 text-purple-400" />
                        <span className="text-sm">10K+ Kullanıcı</span>
                    </div>
                </div>
            </section>
        </div>
    )
}
