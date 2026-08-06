import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, Rocket, Microscope, Atom, Share, Github, Twitter, Linkedin, Star, Satellite } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function AstrobiologistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#8b5cf6' // Bioluminescent Purple

    const t = {
        summary: isEn ? 'The Xenobiological Manifesto' : 'Ksenobiyolojik Manifesto',
        experience: isEn ? 'Extreme Environment Bio-Logs & Missions' : 'Ekstrem Ortam Biyo-Günlükleri ve Görevler',
        education: isEn ? 'Foundational Training & Interstellar Theory' : 'Temel Eğitim ve Yıldızlararası Teori',
        expertise: isEn ? 'Astro-Genomics & Chemical Stack' : 'Astro-Genomik ve Kimyasal Yığın',
        contact: isEn ? 'Extraterrestrial Signal Node' : 'Yıldız Dışı Sinyal Noktası',
        registry: isEn ? 'Planetary Protection Registry' : 'Gezegensel Koruma Kaydı',
        missions: isEn ? 'Space Exploration Deployment History' : 'Uzay Keşif Dağıtım Geçmişi'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const spaceVariants = {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#020617] text-slate-500 p-0 selection:bg-[#8b5cf6] selection:text-white uppercase font-mono overflow-x-hidden print-exact mx-auto print:mx-0"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* SPACE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={spaceVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#8b5cf605_1px,_transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-[#020617] to-transparent" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#020617] border-x border-[#8b5cf6]/10 shadow-[0_0_150px_rgba(139,92,246,0.1)]"
            >
                {/* 1. THE XENOBIOLOGIST HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-[#8b5cf6]/20 bg-[#020617]/50 overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Satellite className="w-64 h-64 text-[#8b5cf6]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#8b5cf6]/10 text-[#8b5cf6] text-[10px] font-black tracking-[0.8em] border border-[#8b5cf6]/30 italic shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                                <Rocket className="w-4 h-4 animate-pulse" /> SPACE_BIO_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[9rem] font-bold text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-24 bg-[#8b5cf6] shadow-[0_0_15px_#8b5cf6]" />
                                     <p className="text-3xl font-bold tracking-[0.4em] text-slate-500 italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['NASA', 'ESA', 'SETI'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-600 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-[#8b5cf6]/30 shadow-3xl relative group hover:rotate-3 transition-transform duration-1000">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#8b5cf6" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-6 h-6 text-[#8b5cf6]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-[#8b5cf6]/20 italic rotate-90 origin-right">REG_NODE: {personal.fullName?.split(' ')[0].toUpperCase()}_XENO</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-white/30 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#8b5cf6] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#8b5cf6]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#8b5cf6] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#8b5cf6]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#8b5cf6]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: MISSIONS & BIO-STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#020617]/80 border-r border-[#8b5cf6]/10 shadow-inner">
                        
                        {/* THE XENOBIOLOGY MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-950 border border-slate-900 p-10 relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <Star className="w-24 h-24 text-[#8b5cf6]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/10 flex items-center gap-4 italic mb-8 border-b border-slate-900 pb-4 uppercase">
                                     <Target className="w-5 h-5 text-[#8b5cf6]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold leading-relaxed text-slate-600 group-hover:text-white transition-colors uppercase">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* ASTRO-GENOMICS STACK (SKILLS) */}
                        <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/10 flex items-center gap-4 italic mb-10 border-b border-slate-900 pb-4 uppercase">
                                <Activity className="w-5 h-5 text-[#8b5cf6]" /> {t.expertise}
                            </h3>
                            <div className="space-y-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="group/item p-4 border border-slate-900 bg-black/40 hover:border-[#8b5cf6]/30 transition-all cursor-default relative overflow-hidden shadow-inner break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[#8b5cf6] scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                                        <span className="text-[10px] font-bold tracking-widest text-slate-700 group-hover:text-white transition-colors uppercase">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* PLANETARY PROTECTION HUB */}
                        <div className="p-10 border-2 border-[#8b5cf6]/10 text-center group bg-[#020617] relative overflow-hidden shadow-2xl">
                             <ShieldAlert className="absolute -top-10 -right-10 w-64 h-64 text-[#8b5cf6]/5 group-hover:rotate-12 transition-all duration-[6s]" />
                             <h4 className="text-[11px] font-black tracking-[2em] text-[#8b5cf6]/20 mb-12 italic leading-none uppercase">{t.registry}</h4>
                             <div className="space-y-6 relative z-10 text-slate-600 group-hover:text-white transition-colors font-bold uppercase tracking-widest text-[9px]">
                                {[ 'Lunar Sample Return Certified', 'COSPAR Category IV Specialist', 'Cleanroom Bio-Burden Expert', 'Mars Analog Protocol Lead' ].map((item, i) => (
                                    <p key={i}>PROTECT_#0{i + 1} :: {item}</p>
                                ))}
                             </div>
                             <div className="flex justify-center gap-12 mt-12 text-[#8b5cf6]/20 group-hover:text-[#8b5cf6] transition-all duration-[1s]">
                                {[Atom, Globe, Microscope, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-10 h-10" />)}
                             </div>
                        </div>

                        {/* FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-950 border-y border-slate-900 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-bold tracking-[1em] text-white/5 text-center mb-10 leading-none pb-4 border-b border-white/5 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-bold text-[#8b5cf6] mb-6 tracking-[0.5em]">ACADEMIC_THREAD_#0{i + 1}</p>
                                        <h4 className="text-3xl font-bold leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-white uppercase">{edu.degree}</h4>
                                        <p className="text-[12px] font-bold tracking-[0.3em] text-slate-700 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: EXPEDITION LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-[#020617]">
                        
                        {/* EXPEDITIONS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#8b5cf6]/5 p-20 -mx-20 rounded-[8rem] border border-[#8b5cf6]/10 shadow-3xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[3em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Globe className="w-10 h-10 text-[#8b5cf6]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-900 hover:border-[#8b5cf6] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[2.5px] w-2 h-32 bg-[#8b5cf6] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#8b5cf6]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[8rem] font-bold text-white tracking-tighter group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase italic">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-800 group-hover:w-40 group-hover:bg-[#8b5cf6] transition-all duration-1000 shadow-[0_0_15px_#8b5cf6]" />
                                                        <p className="text-2xl font-bold text-slate-800 tracking-[0.8em] group-hover:text-slate-600 transition-colors italic leading-none uppercase">ENTITY: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#8b5cf6] px-12 py-5 shadow-3xl skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.5em] leading-none uppercase">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-700 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-black/50 pl-24 py-16 group-hover:text-slate-200 group-hover:border-[#8b5cf6] bg-slate-950 transition-all duration-1000 uppercase">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ASTROBIOLOGY MISSION HUB */}
                        <div className="p-32 bg-slate-950 border border-[#8b5cf6]/20 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_150px_rgba(139,92,246,0.1)]">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#8b5cf6] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Satellite className="absolute -top-10 -right-10 w-96 h-96 text-white/5 group-hover:rotate-45 transition-all duration-[10s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[3em] text-[#8b5cf6] mb-20 italic leading-none z-10 relative uppercase">{t.missions}</h4>
                             <div className="space-y-12 relative z-10 uppercase italic">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white uppercase">Interstellar Bio-Registry Lead // Extreme Terrain Command</p>
                                <p className="text-xl font-bold italic tracking-widest text-[#8b5cf6]/40 group-hover:text-white transition-opacity uppercase">Unveiling the Genetic Potential of the Universe</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-24 text-[#8b5cf6]/20 group-hover:text-[#8b5cf6] transition-all duration-[1s]">
                                {[Rocket, Activity, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE XENOBIOLOGIST FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-[#8b5cf6]/20 bg-[#020617] text-slate-800 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent shadow-[0_0_30px_#8b5cf6]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#8b5cf6]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] tracking-[1.8em] mb-6 text-white uppercase">{personal.fullName} // XENO_CORE_v12</p>
                             <p className="text-[12px] tracking-[0.5em] italic opacity-40 uppercase italic">Across the Cosmos // Life Verified // Unknown Defined</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-900 group-hover:text-[#8b5cf6] transition-colors relative z-10 p-20 bg-slate-950 rounded-full border border-slate-900 shadow-3xl">
                         {[Share2, Globe, Spark, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.2, color: '#ffffff' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl shadow-[#8b5cf6]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
