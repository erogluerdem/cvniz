import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Microscope, Zap as Spark, ShieldAlert, FlaskConical, Beaker, Dna } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function SyntheticBiologistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#1a2e1a' // Deep Forest Green

    const t = {
        summary: isEn ? 'Biological Manifesto & Vision' : 'Biyolojik Manifesto ve Vizyon',
        experience: isEn ? 'Genetic Engineering & Lab Log' : 'Genetik Mühendisliği ve Laboratuvar Günlüğü',
        education: isEn ? 'Molecular Formation & Theory' : 'Moleküler Formasyon ve Teori',
        expertise: isEn ? 'Synthetic Biology Stack' : 'Sentetik Biyoloji Yığını',
        contact: isEn ? 'Laboratory Signal Node' : 'Laboratuvar Sinyal Noktası',
        log: isEn ? 'Engineering Deployment Registry' : 'Mühendislik Dağıtım Kaydı',
        safety: isEn ? 'Biosafety & Ethical Clearance' : 'Biyogüvenlik ve Etik Onay'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const cellVariants = {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.03, 0.08, 0.03],
            transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div className="min-h-full bg-[#f8faf9] text-slate-800 p-0 selection:bg-[#1a2e1a] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* STERILE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={cellVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1a2e1a]/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[#f8faf9]/50" />
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #1a2e1a10 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-100"
            >
                {/* 1. THE CELL ARCHITECT HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-[#1a2e1a]/10 bg-white">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#1a2e1a]/5 text-[#1a2e1a] text-[10px] font-black uppercase tracking-[0.8em] italic border border-[#1a2e1a]/10">
                                <Activity className="w-4 h-4 animate-pulse" /> BIO_ENGINEERING_v12.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[8.5rem] font-black text-slate-900 tracking-tighter leading-none italic uppercase"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-24 bg-[#1a2e1a]/20" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-slate-300 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2 font-mono">
                                        {['BSL-3', 'CRISPR', 'NGS'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-slate-100 shadow-[0_50px_100px_rgba(26,46,26,0.1)] relative group hover:rotate-2 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#1a2e1a" />
                                    <div className="absolute -top-4 -right-4 bg-[#1a2e1a] text-white text-[8px] px-3 py-1 font-black italic shadow-lg">LAB_AUTH</div>
                                </div>
                             )}
                             <p className="text-[10px] font-black tracking-[0.4em] text-slate-200 italic uppercase">NODE_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_BIO</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-black tracking-[0.5em] text-[#1a2e1a] italic border-t border-slate-50 pt-16">
                        {personal.email && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: LAB & STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50/30 border-r border-slate-100">
                        
                        {/* BIOLOGY MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                                    <FlaskConical className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-8 border-b border-slate-100 pb-4">
                                     <Dna className="w-5 h-5 text-[#1a2e1a]" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-light italic leading-relaxed text-slate-500 group-hover:text-slate-900 transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* SYNTHETIC BIOLOGY STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-100 pb-4 uppercase">
                                    <Target className="w-5 h-5 text-[#1a2e1a]" /> {t.expertise}
                                </h3>
                                <div className="space-y-3">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-3 border-l-4 border-slate-100 hover:border-[#1a2e1a] hover:bg-[#1a2e1a]/5 transition-all cursor-default">
                                            <span className="text-[10px] font-bold tracking-widest text-[#1a2e1a]/40 group-hover/item:text-[#1a2e1a] transition-colors uppercase font-mono">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* BIOSAFETY SEAL */}
                        <div className="p-16 border-2 border-[#1a2e1a]/10 text-center group bg-[#1a2e1a]/5 relative overflow-hidden">
                             <ShieldAlert className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.02] group-hover:scale-125 transition-transform duration-[4s]" />
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-[#1a2e1a]/40 mb-12 italic leading-none uppercase">{t.safety}</h4>
                             <div className="space-y-6 relative z-10 text-slate-400 group-hover:text-[#1a2e1a] transition-colors font-bold uppercase tracking-widest text-[9px]">
                                {[ 'Biosafety Level 3 Specialist', 'Ethical Review Board Lead', 'GCP / GLP Compliance Certified', 'Genetic Modification Permit #8822' ].map((item, i) => (
                                    <p key={i}>BIO_SAFE_#0{i + 1} :: {item}</p>
                                ))}
                             </div>
                             <div className="flex justify-center gap-10 mt-12 text-slate-200 group-hover:text-[#1a2e1a] transition-all duration-[1s]">
                                {[Microscope, Beaker, ShieldCheck, Globe].map((Icon, i) => <Icon key={i} className="w-8 h-8" />)}
                             </div>
                        </div>

                        {/* MOLECULAR FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-100 border-y border-slate-200">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-300 text-center italic mb-10 leading-none pb-4 border-b border-white uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu">
                                        <p className="text-[9px] font-black text-[#1a2e1a] mb-6 tracking-[0.5em] italic">ACADEMIC_RECORD_v0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.3em] text-[#1a2e1a]/60 mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: ENGINEERING LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white">
                        
                        {/* LAB LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-24 transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#1a2e1a]/5 p-16 -mx-16 rounded-[4rem] border border-[#1a2e1a]/10 shadow-2xl' : ''}`}>
                                <h2 className="text-[11px] font-black tracking-[2.5em] text-slate-100 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Microscope className="w-10 h-10 text-[#1a2e1a]" /> {t.experience}
                                </h2>
                                <div className="space-y-56">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-100 hover:border-[#1a2e1a] transition-all duration-[1.5s]">
                                            <div className="absolute top-0 -left-[2.5px] w-1.5 h-32 bg-[#1a2e1a] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#1a2e1a]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[7rem] font-black text-slate-900 tracking-tighter italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-px w-20 bg-slate-100 group-hover:w-40 group-hover:bg-[#1a2e1a] transition-all duration-1000" />
                                                        <p className="text-3xl font-black text-slate-200 tracking-[0.6em] group-hover:text-[#1a2e1a] transition-colors italic leading-none uppercase">INSTITUTE: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-slate-900 px-10 py-4 shadow-2xl transition-all whitespace-nowrap italic tracking-[0.4em] leading-none uppercase">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-400 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-50 pl-24 py-16 group-hover:text-slate-800 group-hover:border-[#1a2e1a] bg-slate-50 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* GENETIC REGISTRY HUB */}
                        <div className="p-32 bg-[#1a2e1a] text-white border-4 border-double border-white/20 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_100px_rgba(26,46,26,0.2)]">
                             <Dna className="absolute -top-10 -right-10 w-64 h-64 text-white/5 group-hover:rotate-45 group-hover:scale-125 transition-transform duration-[8s]" />
                             <h4 className="text-[12px] font-black tracking-[2em] text-white/20 mb-12 italic leading-none relative z-10 uppercase">{t.log}</h4>
                             <div className="space-y-12 relative z-10">
                                <p className="text-5xl text-6xl font-black italic tracking-tighter leading-none">CELLULAR_DESIGN_v12 // METABOLIC_ARCHITECTURE_SYSTEM</p>
                                <p className="text-2xl font-black italic tracking-widest opacity-30 group-hover:opacity-100 transition-opacity uppercase text-slate-300">Engineering Life @ Scale // Precision Gene Editing</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-20 text-white/10 group-hover:text-white transition-all duration-[1s]">
                                {[Activity, Globe, Microscope, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE CELL ARCHITECT FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t-8 border-slate-50 bg-white text-slate-300 flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#1a2e1a] shadow-[0_0_20px_#1a2e1a]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-2 bg-[#1a2e1a]/10 group-hover:bg-[#1a2e1a]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] uppercase tracking-[1.5em] mb-6 text-slate-900">{personal.fullName} // CELL_CORE_v12</p>
                             <p className="text-[12px] uppercase tracking-[0.6em] italic opacity-30 italic">Engineering the Future // Defining Biological Scale // Precision Bio-Systems</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-[#1a2e1a]/10 group-hover:text-[#1a2e1a] transition-colors relative z-10 p-16 bg-slate-50 rounded-0 border border-slate-100 shadow-inner backdrop-blur-3xl">
                         {[Share2, Globe, Database, Award].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.5, rotate: 10, color: '#1a2e1a' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
