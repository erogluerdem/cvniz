import { Scale, FileWarning, Gavel, CheckCircle2, AlertCircle, Ban } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20">
                        <Scale className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">Yasal Sözleşme</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                        Kullanım <span className="gradient-text">Şartları</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-12">
                        Son Güncelleme: 25 Aralık 2024
                    </p>

                    <div className="glass-card rounded-[32px] p-8 md:p-12 border-white/5 space-y-12 text-gray-300 leading-relaxed">

                        {/* 1. Kabul */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                                1. Şartların Kabulü
                            </h2>
                            <p>
                                CVniz web sitesini ("Site") ve hizmetlerini kullanarak, işbu Kullanım Şartları'nı okuduğunuzu, anladığınızı ve bu şartlara bağlı kalacağınızı kabul etmiş olursunuz. Eğer bu şartların herhangi bir kısmını kabul etmiyorsanız, lütfen Sitemizi ve hizmetlerimizi kullanmayınız.
                            </p>
                        </section>

                        {/* 2. Hizmet Kapsamı */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Gavel className="w-6 h-6 text-cyan-400" />
                                2. Hizmet Kapsamı ve Değişiklikler
                            </h2>
                            <p>
                                CVniz, kullanıcılara profesyonel özgeçmişler oluşturma, yapay zeka destekli içerik önerileri alma ve bu içerikleri çeşitli formatlarda indirme imkanı sunan bir online platformdur. Şirket, hizmetlerin içeriğini, özelliklerini veya fiyatlandırmasını önceden bildirimde bulunmaksızın değiştirme, askıya alma veya durdurma hakkını saklı tutar.
                            </p>
                        </section>

                        {/* 3. Hesap Güvenliği */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-cyan-400" />
                                3. Kullanıcı Hesapları ve Güvenlik
                            </h2>
                            <p className="mb-4">Hizmetlerimizden tam yararlanmak için hesap oluşturmanız gerekebilir. Bu kapsamda:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Doğru, güncel ve eksiksiz bilgi sağlamakla yükümlüsünüz.</li>
                                <li>Hesap şifrenizin gizliliğini korumak sizin sorumluluğunuzdadır.</li>
                                <li>Hesabınız altındaki tüm aktivitelerden siz sorumlu sayılırsınız.</li>
                                <li>Şüpheli bir durum fark ettiğinizde derhal bize bildirmelisiniz.</li>
                            </ul>
                        </section>

                        {/* 4. Yasaklı Faaliyetler */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Ban className="w-6 h-6 text-cyan-400" />
                                4. Yasaklı Faaliyetler
                            </h2>
                            <p className="mb-4">Platformu aşağıdaki amaçlar için kullanamazsınız:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Yasa dışı, aldatıcı, tehditkar veya hakaret içerikli içerik oluşturmak.</li>
                                <li>Başkalarının fikri mülkiyet haklarını ihlal etmek.</li>
                                <li>Sisteme zarar verecek yazılımlar, virüsler veya kodlar yüklemek.</li>
                                <li>Platform verilerini izinsiz olarak "scraping" veya "mining" yöntemleriyle toplamak.</li>
                                <li>Başka bir kişinin kimliğine bürünmek.</li>
                            </ul>
                        </section>

                        {/* 5. Ödeme ve İptal */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <FileWarning className="w-6 h-6 text-cyan-400" />
                                5. Ücretlendirme ve İade Koşulları
                            </h2>
                            <p>
                                Pro plan abonelikleri ve diğer ücretli hizmetler, ödeme sayfasında belirtilen fiyatlar üzerinden faturalandırılır. İade talepleri, satın alma tarihinden itibaren ilk 7 gün içerisinde, hizmetin makul ölçüde tüketilmemiş olması (örn. sınırsız CV indirme hakkının kötüye kullanılmaması) kaydıyla değerlendirilir. Abonelik iptali durumunda, mevcut dönemin sonuna kadar hizmete erişim devam eder.
                            </p>
                        </section>

                        {/* 6. Fikri Mülkiyet */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                6. Fikri Mülkiyet Hakları
                            </h2>
                            <p>
                                Platformun tasarımı, yazılımı, logoları, metinleri ve tüm teknik altyapısı CVniz'ın mülkiyetindedir. Kullanıcının sağladığı içerik (CV bilgileri) kullanıcının mülkiyetinde kalmaya devam eder, ancak kullanıcı bu içerikleri hizmetin ifası için CVniz'a işleme lisansı vermiş sayılır.
                            </p>
                        </section>

                        {/* 7. Sorumluluk Sınırı */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                7. Sorumluluğun Sınırlandırılması
                            </h2>
                            <p>
                                CVniz, yapay zeka tarafından üretilen içeriklerin doğruluğunu veya bu içeriklerin işe alım süreçlerindeki başarısını garanti etmez. Platform "olduğu gibi" sunulmaktadır. Yazılım hataları, sistem kesintileri veya veri kayıplarından doğabilecek doğrudan veya dolaylı zararlardan Şirket sorumlu tutulamaz.
                            </p>
                        </section>

                        {/* İletişim */}
                        <section className="bg-cyan-500/5 rounded-2xl p-8 border border-cyan-500/10">
                            <h2 className="text-xl font-bold text-white mb-4">Hukuki Sorular</h2>
                            <p className="mb-6 italic">
                                Kullanım şartlarımızla ilgili hukuki bir sorunuz varsa lütfen bize ulaşın.
                            </p>
                            <Link to="/contact" className="text-cyan-400 font-bold hover:text-cyan-300 underline underline-offset-4">
                                Destek Ekibiyle Görüş →
                            </Link>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    )
}

