import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Gem, Sparkles, Diamond, Box, Hexagon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function JewelerTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#fbbf24' // Precious Gold

    const t = {
        summary: isEn ? 'The Gemological Manifesto' : 'Gemolojik Manifesto',
        experience: isEn ? 'Custom Design & Gemological Registry' : 'Özel Tasarım ve Gemolojik Kayıt',
        education: isEn ? 'Technical Training & Mineral Theory' : 'Teknik Eğitim ve Mineral Teorisi',
        expertise: isEn ? 'Precision Setting & Gem Stack' : 'Hassas Mıhlama ve Değerli Taş Yığını',
        contact: isEn ? 'Vault Node Access' : 'Kasa Nokta Erişimi',
        grading: isEn ? 'The 4Cs: Master Grading Scale' : '4C: Master Derecelendirme Ölçeği',
        certs: isEn ? 'Elite Gemological Certifications' : 'Seçkin Gemolojik Sertifikalar'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const prismVariants = {
        animate: {
            opacity: [0.03, 0.08, 0.03],
            rotate: [0, 45, 0],
            scale: [1, 1.1, 1],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-black text-slate-500 p-0 selection:bg-[#fbbf24] selection:text-black print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* PRISM OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={prismVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-tr from-[#fbbf24]/10 via-[#ffffff]/5 to-transparent rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-black/80" />
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-black shadow-2xl border-x border-[#fbbf24]/10"
            >
                {/* 1. THE GEM ANALYST HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-[#fbbf24]/20 bg-black">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Diamond className="w-96 h-96 text-[#fbbf24]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#fbbf24]/10 text-[#fbbf24] text-[10px] font-black uppercase tracking-[1em] italic border border-[#fbbf24]/20">
                                <Sparkles className="w-4 h-4 animate-pulse" /> VAULT_NODE_v24.0
                            </motion.div>
                            
                            <div className="space-y-4 font-mono">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[9rem] font-black text-white tracking-tighter leading-none italic uppercase"
                                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[4px] w-24 bg-[#fbbf24] shadow-[0_0_15px_#fbbf24]" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-slate-500 uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['GIA', 'IGI', 'CAD'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-stone-900 border border-stone-800 text-[9px] font-bold text-slate-600 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-stone-950 border border-[#fbbf24]/30 shadow-[0_0_50px_rgba(251,191,36,0.1)] relative group hover:rotate-3 transition-transform duration-1000">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#fbbf24" />
                                    <div className="absolute top-0 left-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-8 h-8 text-[#fbbf24]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black tracking-[0.4em] text-[#fbbf24]/20 italic rotate-90 origin-right uppercase">VAULT_LOCK: {personal.fullName?.split(' ')[0].toUpperCase()}_GEM</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-black tracking-[0.6em] text-[#fbbf24] italic border-t border-slate-900 pt-16 uppercase italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-black">
                    
                    {/* LEFT PANEL: GRADING & STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-stone-950/20 border-r border-[#fbbf24]/10 shadow-inner">
                        
                        {/* THE MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-stone-900 border border-stone-800 p-10 relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                    <Gem className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#fbbf24]/20 flex items-center gap-4 italic mb-8 border-b border-stone-800 pb-4">
                                     <Diamond className="w-5 h-5 text-[#fbbf24]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold italic leading-relaxed text-slate-600 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* GEMOLOGICAL GRADING SCALE (4CS) */}
                        <section className="bg-black border-2 border-[#fbbf24]/5 p-10 space-y-12 transition-all hover:border-[#fbbf24]/20 shadow-inner italic break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-[#fbbf24]/20 mb-20 italic leading-none border-b border-stone-900 pb-4 uppercase">{t.grading}</h4>
                             <div className="space-y-10">
                                {[
                                    { label: 'Cut Grade', val: 'Ideal' },
                                    { label: 'Clarity Rating', val: 'IF / VVS1' },
                                    { label: 'Color Scale', val: 'D / E' },
                                    { label: 'Carat Expertise', val: '10ct+' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/item border-b border-stone-900 pb-2 break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[10px] font-black text-stone-600 group-hover/item:text-[#fbbf24] transition-colors">{stat.label}</p>
                                        <p className="text-2xl font-black text-white">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* PRECISION STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-[#fbbf24]/20 flex items-center gap-4 italic mb-10 border-b border-stone-900 pb-4 uppercase">
                                    <Layers className="w-5 h-5 text-[#fbbf24]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center z-10 relative">
                                                <span className="text-[18px] font-light uppercase tracking-widest text-slate-700 group-hover/item:text-[#fbbf24] transition-colors italic whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>{skill}</span>
                                                <div className="h-px bg-stone-900 flex-1 mx-4" />
                                                <Box className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-[#fbbf24] transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* MINERAL THEORY (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-stone-950 border-y border-stone-900 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-700 text-center mb-10 leading-none pb-4 border-b border-stone-900 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-[#fbbf24]/30 mb-6 tracking-[0.5em]">ACADEMIC_FORM_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-white uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.4em] text-stone-700 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: REGISTRY & PROJECTS */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-black shadow-inner">
                        
                        {/* THE REGISTRY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#fbbf24]/5 p-20 -mx-20 rounded-[4rem] border border-[#fbbf24]/10 shadow-[0_0_100px_rgba(251,191,36,0.1)] skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[12px] font-black tracking-[4em] text-stone-900 mb-24 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <Hexagon className="w-10 h-10 text-[#fbbf24]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-stone-900 hover:border-[#fbbf24] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-1.5 h-32 bg-[#fbbf24] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#fbbf24]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[9.5rem] font-black text-white tracking-tighter italic group-hover:text-[#fbbf24] transition-colors duration-[1.5s] leading-none uppercase" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.06em' }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-stone-900 group-hover:w-40 group-hover:bg-[#fbbf24] transition-all duration-1000 shadow-[0_0_15px_#fbbf24]" />
                                                        <p className="text-3xl font-light italic text-slate-700 tracking-[0.4em] group-hover:text-slate-500 transition-colors italic leading-none uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>CLIENT: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-black bg-[#fbbf24] px-10 py-4 group-hover:bg-white transition-all whitespace-nowrap italic tracking-[0.5em] shadow-3xl leading-none uppercase">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-4xl text-slate-800 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-stone-950 pl-24 py-16 group-hover:text-slate-300 group-hover:border-[#fbbf24] bg-stone-950/20 transition-all duration-1000 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* JEWELER FINAL SEAL */}
                        <div className="p-32 bg-stone-950 border-4 border-double border-[#fbbf24]/20 text-center group relative overflow-hidden transition-all duration-[2s] hover:p-40 shadow-3xl">
                             <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#fbbf24] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Diamond className="absolute -top-10 -right-10 w-96 h-96 text-[#fbbf24]/5 group-hover:rotate-45 transition-all duration-[12s]" />
                             
                             <h4 className="text-[14px] font-black tracking-[4em] text-[#fbbf24]/20 mb-20 italic leading-none z-10 relative uppercase">{t.certs}</h4>
                             <div className="space-y-12 relative z-10 italic">
                                <p className="text-5xl text-6xl font-black italic tracking-tighter leading-none italic uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Elite Gemological Analyst // Master of Custom Setting</p>
                                <p className="text-2xl font-black italic tracking-[1.5em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-[#fbbf24] shadow-2xl">Visualizing Perfection @ Molecular Scale // Zero Compromise</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-24 text-stone-800 group-hover:text-[#fbbf24] transition-all duration-[1s]">
                                {[Gem, Globe, Activity, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE GEM ANALYST FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t border-stone-900 bg-black text-slate-100 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#fbbf24] shadow-[0_0_30px_rgba(251,191,36,0.5)]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#fbbf24]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2.8em] mb-6 text-white leading-none">{personal.fullName} // GEM_NODE_EX1</p>
                             <p className="text-[12px] uppercase tracking-[0.6em] italic opacity-40 uppercase italic text-[#fbbf24]">Refining the Light // Preserving the Depth // Defining the Edge</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-stone-900 group-hover:text-[#fbbf24] transition-colors relative z-10 p-20 bg-stone-950 border border-stone-900 rounded-full shadow-inner">
                         {[Share2, Globe, Box, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.2, color: '#ffffff' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl p-2" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
