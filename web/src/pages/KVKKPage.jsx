import { ShieldCheck, UserCheck, Scale, FileText, CheckCircle, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function KVKKPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">KVKK Uyumluluk</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight text-white">
                        KVKK <br /><span className="gradient-text">Aydınlatma Metni</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-12">
                        6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme
                    </p>

                    <div className="glass-card rounded-[32px] p-8 md:p-12 border-white/5 space-y-12 text-gray-300 leading-relaxed">

                        {/* 1. Veri Sorumlusu */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <UserCheck className="w-6 h-6 text-cyan-400" />
                                1. Veri Sorumlusu
                            </h2>
                            <p>
                                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla CVniz ("Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                            </p>
                        </section>

                        {/* 2. İşlenme Amacı */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-cyan-400" />
                                2. Kişisel Verilerin İşlenme Amacı
                            </h2>
                            <p className="mb-4">Kişisel verileriniz, Kanun'un 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları dahilinde aşağıdaki süreçler için işlenmektedir:</p>
                            <ul className="grid md:grid-cols-2 gap-4">
                                {[
                                    'Hizmetlerimizin sunulması ve yönetilmesi',
                                    'Üyelik kaydı ve hesap doğrulaması',
                                    'AI asistanı ile CV içeriği optimizasyonu',
                                    'Ödeme süreçlerinin yürütülmesi (İyzico)',
                                    'Müşteri ilişkileri yönetimi',
                                    'Yasal raporlama ve mevzuat uyumu',
                                    'Siber güvenliğin sağlanması',
                                    'Pazarlama ve kampanya yönetimi (onaylı)'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 3. Aktarım */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Scale className="w-6 h-6 text-cyan-400" />
                                3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği
                            </h2>
                            <p>
                                Toplanan kişisel verileriniz; yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda, iş ortaklarımıza, tedarikçilerimize (DigitalOcean, Google Cloud, OpenAI), kanunen yetkili kamu kurumlarına ve özel kişilere Kanun'un 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları çerçevesinde aktarılır. Verilerin yurt dışına aktarımı, veri sahibinin açık rızası veya kanunda öngörülen istisnai durumlar çerçevesinde gerçekleştirilir.
                            </p>
                        </section>

                        {/* 4. Yöntem ve Hukuki Sebep */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
                            </h2>
                            <p>
                                Kişisel verileriniz, Platform üzerindeki formlar, çerezler ve otomatik veri toplama yöntemleri ile elektronik ortamda toplanmaktadır. Bu veriler; "Sözleşmenin kurulması ve ifası", "Veri sorumlusunun hukuki yükümlülüğü", "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri" ve gerekli hallerde "Açık Rıza" hukuki sebeplerine dayanarak işlenmektedir.
                            </p>
                        </section>

                        {/* 5. Haklar */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                5. Kişisel Veri Sahibinin Hakları
                            </h2>
                            <p className="mb-4">Kanun'un 11. maddesi uyarınca veri sahipleri şu haklara sahiptir:</p>
                            <div className="space-y-3 text-sm">
                                <p>• Kişisel veri işlenip işlenmediğini öğrenme,</p>
                                <p>• Kişisel verileri işlenmişse buna ilişkin bilgi talep etme,</p>
                                <p>• Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</p>
                                <p>• Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</p>
                                <p>• Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</p>
                                <p>• Verilerin silinmesini veya yok edilmesini isteme,</p>
                                <p>• İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin kendisi aleyhine bir sonucun ortaya çıkmasına itiraz etme.</p>
                            </div>
                        </section>

                        {/* 6. Başvuru */}
                        <section className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-[32px] p-8 md:p-12 border border-cyan-500/20">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="space-y-4 flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-3">
                                        <Mail className="w-6 h-6 text-cyan-400" />
                                        Başvuru Hakkınız
                                    </h2>
                                    <p className="text-gray-300">
                                        Yukarıda belirtilen haklarınızı kullanmak için kimliğinizi tespit edici belgeler ile birlikte talebinizi <strong>destek@CVniz.com</strong> adresine e-posta yoluyla iletebilirsiniz. Başvurularınız KVKK uyarınca en geç 30 gün içerisinde sonuçlandırılacaktır.
                                    </p>
                                </div>
                                <div className="w-px h-24 bg-white/10 hidden md:block" />
                                <div className="text-center">
                                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-black">RESMİ BİLGİ</p>
                                    <p className="text-sm font-bold text-cyan-400">CVniz Data Protection Office</p>
                                    <p className="text-xs text-gray-500 mt-1">İstanbul, Türkiye</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    )
}

