import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle, ArrowRight, Layout } from 'lucide-react';
import { useTemplates } from '../context/TemplateContext';

export default function TemplateShowcasePage() {
    const { templateId } = useParams();
    const { templates, getTemplateConfig } = useTemplates();
    const [template, setTemplate] = useState(null);

    useEffect(() => {
        // Find the template
        const t = getTemplateConfig(templateId);
        if (t) {
            setTemplate(t);
            // Dynamic SEO Metadata
            document.title = `${t.name} CV Şablonu | CVniz`;
            
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = "description";
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = `${t.name} şablonu ile profesyonel ve etkileyici bir özgeçmiş oluşturun. Tamamen düzenlenebilir ve ATS uyumlu.`;
            
            // OpenGraph SEO
            let ogTitle = document.querySelector('meta[property="og:title"]');
            if (!ogTitle) {
                ogTitle = document.createElement('meta');
                ogTitle.setAttribute('property', 'og:title');
                document.head.appendChild(ogTitle);
            }
            ogTitle.content = `${t.name} CV Şablonu`;
        }
    }, [templateId, getTemplateConfig]);

    if (!template) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center text-center">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Şablon Bulunamadı</h1>
                    <Link to="/templates" className="text-cyan-400 hover:underline">Tüm Şablonlara Dön</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        {template.isPremium ? 'Premium Şablon' : 'Ücretsiz Şablon'}
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                        {template.name} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">CV Şablonu</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                        Sektörünüzde fark yaratın. ATS uyumlu yapısı ve modern tasarımıyla {template.name} şablonu, hayalinizdeki işe giden yolda en güçlü silahınız olacak.
                    </p>

                    <div className="space-y-4 pt-6">
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle className="w-5 h-5 text-emerald-400" /> Tamamen özelleştirilebilir renkler ve fontlar
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle className="w-5 h-5 text-emerald-400" /> ATS (Aday Takip Sistemi) ile %100 uyumlu
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle className="w-5 h-5 text-emerald-400" /> Tek tıkla PDF olarak indirme
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <CheckCircle className="w-5 h-5 text-emerald-400" /> Web sayfası olarak canlı yayınlama
                        </div>
                    </div>

                    <div className="pt-8 flex flex-wrap gap-4">
                        <Link
                            to={`/editor?template=${template.id}`}
                            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-2xl font-bold text-lg transition-all flex items-center gap-2"
                        >
                            Bu Şablonu Kullan <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/templates"
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg transition-all"
                        >
                            Diğer Şablonlar
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 blur-[100px] -z-10" />
                    
                    <div className="bg-slate-900 border-8 border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative aspect-[1/1.4] flex items-center justify-center">
                        {/* Placeholder for template preview image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
                           <Layout className="w-24 h-24 text-slate-700 mb-4" />
                           <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{template.name} Önizleme</p>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            {/* SEO Content Section */}
            <div className="mt-32 pt-16 border-t border-white/10">
                <div className="max-w-3xl mx-auto prose prose-invert">
                    <h2 className="text-3xl font-bold text-white mb-6">Neden {template.name} Şablonunu Seçmelisiniz?</h2>
                    <p className="text-slate-400 leading-relaxed mb-6">
                        Günümüzde iş başvurularında ilk intiba her zamankinden daha önemli. {template.name} özgeçmiş şablonu, 
                        modern iş dünyasının gereksinimlerine göre özel olarak tasarlandı. Göz yormayan yapısı, içeriğinizi 
                        ön plana çıkaran hiyerarşisi ve kurumsal duruşu ile insan kaynakları uzmanlarının dikkatini ilk saniyede çekeceksiniz.
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-4">Mülakat Şansınızı Artırın</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Özel algoritmalarla test edilmiş olan bu şablon, ATS yazılımları tarafından kolayca okunabilir. 
                        Böylece CV'nizin filtreleme sistemlerine takılmadan doğrudan işe alım yöneticisine ulaşmasını sağlarsınız.
                    </p>
                </div>
            </div>
        </div>
    );
}
