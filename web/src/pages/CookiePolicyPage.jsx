import { Cookie, Settings, Info, PieChart, ShieldCheck, ToggleRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20">
                        <Cookie className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">Çerez Yönetimi</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                        Çerez <span className="gradient-text">Politikası</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-12">
                        Son Güncelleme: 25 Aralık 2024
                    </p>

                    <div className="glass-card rounded-[32px] p-8 md:p-12 border-white/5 space-y-12 text-gray-300 leading-relaxed">

                        {/* 1. Giriş */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Info className="w-6 h-6 text-cyan-400" />
                                1. Çerez Nedir?
                            </h2>
                            <p>
                                Çerezler (Cookies), bir web sitesini ziyaret ettiğinizde cihazınıza (bilgisayar, telefon, tablet) yerleştirilen küçük metin dosyalarıdır. CVniz olarak, Sitemizi verimli şekilde çalıştırmak, tercihleriniz hatırlamak ve kullanıcı deneyiminizi geliştirmek için çerezleri kullanıyoruz.
                            </p>
                        </section>

                        {/* 2. Çerez Türleri */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Settings className="w-6 h-6 text-cyan-400" />
                                2. Kullandığımız Çerez Türleri
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5" /> Zorunlu Çerezler
                                    </h3>
                                    <p className="text-sm">Sitenin temel işlevlerini (giriş yapma, güvenlik, sepet yönetimi) yerine getirmek için gereklidir. Bu çerezler olmadan Site düzgün çalışamaz.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                        <PieChart className="w-5 h-5" /> Analitik Çerezler
                                    </h3>
                                    <p className="text-sm">Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur (örn. en çok ziyaret edilen sayfalar). Bu veriler anonim olarak toplanır.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                        <ToggleRight className="w-5 h-5" /> İşlevsellik Çerezleri
                                    </h3>
                                    <p className="text-sm">Dil seçiminiz, kullanıcı adınız gibi tercihlerinizi hatırlayarak daha kişiselleştirilmiş bir deneyim sunmamızı sağlar.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                                        <Cookie className="w-5 h-5" /> Reklam Çerezleri
                                    </h3>
                                    <p className="text-sm">İlginizi çekebilecek reklamları göstermek ve reklam kampanyalarının etkisini ölçmek için kullanılır.</p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Amaçlar */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">3. Çerezleri Neden Kullanıyoruz?</h2>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Oturum yönetimi ve güvenliğin sağlanması.</li>
                                <li>CV düzenleme sürecindeki geçici verilerin saklanması.</li>
                                <li>Site performansının ölçülmesi ve iyileştirilmesi.</li>
                                <li>Tercihlerinize uygun içerik ve reklamların sunulması.</li>
                            </ul>
                        </section>

                        {/* 4. Kontrol */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                4. Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?
                            </h2>
                            <p className="mb-6">
                                Çoğu web tarayıcısı çerezleri otomatik olarak kabul eder. Ancak tarayıcı ayarlarınızı değiştirerek çerezleri reddedebilir veya engelleyebilirsiniz. Lütfen unutmayın, çerezleri engellemeniz durumunda Sitemizdeki bazı özellikler (örn. oturum açık kalma) çalışmayabilir.
                            </p>
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Popüler Tarayıcılarda Yönetim:</p>
                                <div className="flex flex-wrap gap-4">
                                    <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">Google Chrome</span>
                                    <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">Mozilla Firefox</span>
                                    <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">Safari</span>
                                    <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">Microsoft Edge</span>
                                </div>
                            </div>
                        </section>

                        {/* 5. Güncellemeler */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                5. Çerez Politikası Güncellemeleri
                            </h2>
                            <p>
                                Teknolojik gelişmeler veya yasal değişiklikler doğrultusunda Çerez Politikamızı zaman zaman güncelleyebiliriz. Yapılan değişiklikler bu sayfada yayınlandığı andan itibaren geçerlilik kazanır.
                            </p>
                        </section>

                        {/* İletişim */}
                        <section className="bg-cyan-500/5 rounded-2xl p-8 border border-cyan-500/10 text-center">
                            <p className="mb-6 italic">
                                Çerez kullanımımız hakkında daha fazla bilgi almak için Gizlilik Politikamızı inceleyebilir veya bize ulaşabilirsiniz.
                            </p>
                            <div className="flex justify-center gap-6">
                                <Link to="/privacy" className="text-cyan-400 font-bold hover:text-cyan-300">
                                    Gizlilik Politikası
                                </Link>
                                <Link to="/contact" className="text-cyan-400 font-bold hover:text-cyan-300">
                                    Bize Ulaşın
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    )
}

