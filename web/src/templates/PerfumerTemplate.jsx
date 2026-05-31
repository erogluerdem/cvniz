import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, FlaskConical, Beaker, Atom, Droplets, Wind, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PerfumerTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#0d9488' // Molecular Teal

    const t = {
        summary: isEn ? 'The Olfactory Manifesto' : 'Olfaktif Manifesto',
        experience: isEn ? 'Fragrance Pyramid & Formulation Log' : 'Parfüm Piramidi ve Formülasyon Günlüğü',
        education: isEn ? 'Chemistry Foundation & Sensory Theory' : 'Kimya Temeli ve Duyusal Teori',
        expertise: isEn ? 'Raw Materials & Extraction Stack' : 'Hammadde ve Ekstraksiyon Yığını',
        contact: isEn ? 'Olfactory Node Access' : 'Olfaktif Nokta Erişimi',
        notes: isEn ? 'Scent Architecture Registry' : 'Koku Mimarisi Kaydı',
        pyramid: isEn ? 'Top, Heart & Base Note Analytics' : 'Üst, Kalp ve Alt Nota Analitiği'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const vaporVariants = {
        animate: {
            opacity: [0.03, 0.08, 0.03],
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div className="min-h-full bg-[#f8fafc] text-slate-700 p-0 selection:bg-[#0d9488] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.7'
            }}>

            {/* VAPOR OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={vaporVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0d9488]/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-white/40" />
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fdf2f8 2px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-50"
            >
                {/* 1. THE ESSENCE ARCHITECT HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-slate-50 bg-[#f8fafc]">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#0d9488]/5 text-[#0d9488] text-[10px] font-black uppercase tracking-[1em] italic">
                                <Wind className="w-4 h-4 animate-pulse" /> OLFACTORY_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[10rem] font-light text-slate-900 tracking-tighter leading-none italic uppercase"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[1px] w-24 bg-[#0d9488]/20" />
                                     <p className="text-3xl font-light tracking-[0.5em] text-slate-300 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['GC-MS', 'SYNTH', 'SOLVENT'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white border border-slate-50 text-[9px] font-bold text-slate-300 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-slate-50 shadow-[0_50px_100px_rgba(13,148,136,0.05)] relative group hover:scale-105 transition-transform duration-1000">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#0d9488" />
                                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-100 transition-opacity">
                                        <Sparkles className="w-8 h-8 text-[#fdf2f8]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 italic">SCENT_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_E1</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.6em] text-[#0d9488] italic border-t border-slate-50 pt-16">
                        {personal.email && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Mail className="w-5 h-5 text-slate-200" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Phone className="w-5 h-5 text-slate-200" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-slate-200" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: MOLECULES & STACK */}
                    <aside className="col-span-4 p-12 space-y-40 bg-slate-50/20 border-r border-slate-100 shadow-inner">
                        
                        {/* THE OLFACTORY MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-12 group bg-white p-12 border border-slate-100 relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                    <Atom className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-200 flex items-center gap-4 italic mb-8 border-b border-slate-50 pb-4">
                                     <Beaker className="w-6 h-6 text-[#0d9488]" /> {t.summary}
                                </h3>
                                <p className="text-3xl font-light italic leading-relaxed text-slate-400 group-hover:text-black transition-colors uppercase">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* FRAGRANCE PYRAMID HUB */}
                        <div className="p-12 border-2 border-[#0d9488]/5 text-center group bg-white shadow-2xl skew-y-[-1deg]">
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-[#0d9488]/20 mb-10 italic leading-none uppercase skew-y-[1deg]">{t.pyramid}</h4>
                             <div className="space-y-6 relative z-10 italic skew-y-[1deg]">
                                {[ 
                                    { label: 'Top Notes', val: 'Citrus / Aldehydes', color: 'bg-white' },
                                    { label: 'Heart Notes', val: 'Rose / Jasmine / Spice', color: 'bg-[#fdf2f8]/30' },
                                    { label: 'Base Notes', val: 'Oud / Musk / Amber', color: 'bg-[#0d9488]/5' }
                                ].map((item, i) => (
                                    <div key={i} className={`p-6 border border-slate-50 ${item.color} group-hover:scale-105 transition-transform text-right`}>
                                        <p className="text-2xl font-black text-[#0d9488]">{item.val}</p>
                                        <span className="text-[10px] uppercase font-bold text-slate-300">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* FORMULATION STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-50 pb-4 uppercase">
                                    <Layers className="w-5 h-5 text-[#0d9488]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-4">
                                            <div className="flex justify-between items-center z-10 relative">
                                                <span className="text-[18px] font-light uppercase tracking-widest text-slate-300 group-hover/item:text-black transition-colors italic">{skill}</span>
                                                <div className="h-px bg-slate-50 flex-1 mx-4" />
                                                <Spark className="w-4 h-4 text-[#0d9488]/20 group-hover/item:text-[#0d9488] transition-colors" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CHEMISTRY EDUCATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-white border-y border-slate-100 uppercase italic">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-200 text-center mb-10 leading-none pb-4 border-b border-slate-50 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu">
                                        <p className="text-[9px] font-black text-[#0d9488]/30 mb-6 tracking-[0.5em]">ACADEMIC_MOLECULE_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.4em] text-slate-200 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: FRAGRANCE REGISTRY */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white shadow-inner">
                        
                        {/* THE REGISTRY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#f8fafc] p-20 -mx-20 rounded-[4rem] border border-slate-100 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[12px] font-black tracking-[4em] text-slate-50 mb-24 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <Droplets className="w-10 h-10 text-[#0d9488]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-slate-50 hover:border-[#0d9488] transition-all duration-[1.5s]">
                                            <div className="absolute top-0 -left-[1.5px] w-1.5 h-32 bg-[#0d9488] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#0d9488]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[9.5rem] font-light text-slate-900 tracking-tighter italic group-hover:text-[#0d9488] transition-colors duration-[1.5s] leading-none uppercase" style={{ letterSpacing: '-0.06em' }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-100 group-hover:w-40 group-hover:bg-[#0d9488] transition-all duration-1000 shadow-[0_0:15px_#0d9488]" />
                                                        <p className="text-3xl font-light italic text-slate-200 tracking-[0.4em] group-hover:text-slate-400 transition-colors italic leading-none uppercase">VOICE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-[#0d9488] border border-[#0d9488]/20 px-10 py-4 group-hover:bg-[#0d9488] group-hover:text-white transition-all whitespace-nowrap italic tracking-[0.4em] shadow-3xl leading-none uppercase">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-4xl text-slate-100 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-slate-50 pl-24 py-16 group-hover:text-slate-950 group-hover:border-[#0d9488] bg-slate-50 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* OLFACTORY FINAL SEAL */}
                        <div className="p-32 bg-white border border-slate-50 text-center group relative overflow-hidden transition-all duration-[2s] hover:p-40 shadow-inner">
                             <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#0d9488] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <FlaskConical className="absolute -top-10 -right-10 w-96 h-96 text-[#0d9488]/5 group-hover:scale-110 transition-transform duration-[10s]" />
                             
                             <h4 className="text-[14px] font-black tracking-[4em] text-slate-100 mb-20 italic leading-none z-10 relative uppercase">{t.notes}</h4>
                             <div className="space-y-12 relative z-10 italic">
                                <p className="text-5xl text-6xl font-black italic tracking-tighter leading-none italic uppercase">Elite Essence Architect // Master of Molecular Synthesis</p>
                                <p className="text-2xl font-black italic tracking-[1em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-slate-400">Capturing the Ethereal @ Infinite Scale // Zero Deviation</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-24 text-slate-50 group-hover:text-[#0d9488] transition-all duration-[1s]">
                                {[Atom, Globe, Wind, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE ESSENCE ARCHITECT FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t border-slate-50 bg-[#f8fafc] text-slate-100 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#0d9488] shadow-[0_0_20px_#0d9488]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#0d9488]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2.8em] mb-6 text-slate-900 leading-none">{personal.fullName} // SCENT_NODE_EX1</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-30 italic text-stone-300">Formulating the Future // Dissolving the Present // Capturing the Soul</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-200 group-hover:text-[#0d9488] transition-colors relative z-10 p-20 bg-white border border-slate-50 rounded-full shadow-3xl">
                         {[Share2, Globe, Spark, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.2, color: '#0f172a' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}


