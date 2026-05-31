import { Shield, Lock, Eye, FileText, Scale, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            <section className="relative pt-32 pb-20 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/20">
                        <Shield className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-black text-cyan-200 uppercase tracking-widest">Yasal Mevzuat</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                        Gizlilik <span className="gradient-text">Politikası</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-12">
                        Son Güncelleme: 25 Aralık 2024
                    </p>

                    <div className="glass-card rounded-[32px] p-8 md:p-12 border-white/5 space-y-12 text-gray-300 leading-relaxed">
                        
                        {/* Giriş */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Eye className="w-6 h-6 text-cyan-400" />
                                1. Giriş
                            </h2>
                            <p>
                                CVniz ("Şirket", "Biz" veya "Platform") olarak, verilerinizin güvenliği ve gizliliği bizim için en öncelikli konudur. İşbu Gizlilik Politikası, web sitemizi ve hizmetlerimizi kullandığınızda kişisel verilerinizin nasıl toplandığını, kullanıldığını, saklandığını ve korunduğunu açıklamaktadır. Hizmetlerimizi kullanarak, bu politikada belirtilen uygulamaları kabul etmiş sayılırsınız.
                            </p>
                        </section>

                        {/* Toplanan Veriler */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <FileText className="w-6 h-6 text-cyan-400" />
                                2. Topladığımız Veriler
                            </h2>
                            <p className="mb-4">Hizmetlerimizi sunabilmek amacıyla aşağıdaki veri kategorilerini işlemekteyiz:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, doğum tarihi (CV içeriğinde sağlandığı ölçüde).</li>
                                <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres.</li>
                                <li><strong>Profesyonel Bilgiler:</strong> İş deneyimi, eğitim geçmişi, yetenekler, sertifikalar ve CV'nize eklediğiniz diğer tüm bilgiler.</li>
                                <li><strong>İşlem Bilgileri:</strong> Satın alma geçmişi, abonelik detayları, fatura bilgileri.</li>
                                <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı türü, işletim sistemi, site kullanım istatistikleri ve çerezler üzerinden toplanan veriler.</li>
                            </ul>
                        </section>

                        {/* Veri İşleme Amaçları */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Scale className="w-6 h-6 text-cyan-400" />
                                3. Veri İşleme Amaçlarımız
                            </h2>
                            <p className="mb-4">Kişisel verileriniz aşağıdaki amaçlar doğrultusunda işlenmektedir:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>CV oluşturma, düzenleme ve indirme süreçlerinin yönetilmesi.</li>
                                <li>Yapay zeka asistanı aracılığıyla içerik önerileri sunulması.</li>
                                <li>Ödeme işlemlerinin gerçekleştirilmesi ve faturalandırma.</li>
                                <li>Müşteri destek hizmetlerinin sağlanması.</li>
                                <li>Platformun güvenliğinin sağlanması ve kötüye kullanımın önlenmesi.</li>
                                <li>Yasal yükümlülüklerin yerine getirilmesi.</li>
                            </ul>
                        </section>

                        {/* Veri Saklama ve Güvenlik */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-cyan-400" />
                                4. Veri Güvenliği ve Saklama
                            </h2>
                            <p>
                                Verileriniz, endüstri standardı olan 256-bit SSL şifreleme ile korunmaktadır. Sunucularımız yüksek güvenlikli veri merkezlerinde barındırılmakta ve sürekli olarak izlenmektedir. Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca veya ilgili mevzuatta öngörülen kanuni süreler kadar saklanmaktadır. Hesabınızı sildiğinizde, yasal olarak saklanması zorunlu olmayan tüm verileriniz sistemlerimizden kalıcı olarak silinir.
                            </p>
                        </section>

                        {/* Veri Paylaşımı */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <UserCheck className="w-6 h-6 text-cyan-400" />
                                5. Üçüncü Taraflarla Veri Paylaşımı
                            </h2>
                            <p>
                                CVniz, kişisel verilerinizi üçüncü taraflara satmaz. Ancak hizmetin ifası için gerekli olan durumlarda iş ortaklarımızla (ödeme sistemleri, bulut altyapı sağlayıcıları, AI servis sağlayıcıları) veri paylaşımı yapılabilir. Bu paylaşımlar, strictly "gereklilik" prensibiyle ve ilgili taraflarla imzalanan gizlilik sözleşmeleri çerçevesinde gerçekleştirilir.
                            </p>
                        </section>

                        {/* Haklarınız */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                                6. Kullanıcı Hakları
                            </h2>
                            <p className="mb-4">GDPR ve KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Verilerinize erişim sağlama ve kopyasını isteme.</li>
                                <li>Hatalı verilerin düzeltilmesini talep etme.</li>
                                <li>Verilerinizin silinmesini isteme ("Unutulma Hakkı").</li>
                                <li>Veri işlemenin kısıtlanmasını talep etme.</li>
                                <li>Veri taşınabilirliği hakkı.</li>
                            </ul>
                        </section>

                        {/* İletişim */}
                        <section className="bg-cyan-500/5 rounded-2xl p-8 border border-cyan-500/10">
                            <h2 className="text-xl font-bold text-white mb-4">Sorularınız mı var?</h2>
                            <p className="mb-6 italic">
                                Gizlilik politikamızla ilgili herhangi bir sorunuz olması durumunda lütfen bizimle iletişime geçmekten çekinmeyin.
                            </p>
                            <Link to="/contact" className="text-cyan-400 font-bold hover:text-cyan-300 underline underline-offset-4">
                                İletişim Formu →
                            </Link>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    )
}

