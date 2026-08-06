import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Trophy, Flag, Timer, Zap as Spark, Gauge, Wind, ShieldAlert, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function FormulaDriverTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#e10600' // Racing Red

    const t = {
        summary: isEn ? 'The Pilot\'s Edge & Philosophy' : 'Pilotun Avantajı ve Felsefesi',
        experience: isEn ? 'Track Performance Registry & Career' : 'Pist Performans Kaydı ve Kariyer',
        education: isEn ? 'Technical Formation & Academics' : 'Teknik Formasyon ve Akademik',
        expertise: isEn ? 'Telemetry & Mechanical Mastery' : 'Telemetri ve Mekanik Ustalık',
        contact: 'Communications Node',
        stats: isEn ? 'Performance Metrics & Records' : 'Performans Metrikleri ve Rekorlar',
        conditioning: isEn ? 'Physical & Mental Conditioning' : 'Fiziksel ve Zihinsel Kondisyon'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const speedVariants = {
        animate: {
            x: [-1000, 1000],
            transition: { duration: 3, repeat: Infinity, ease: "linear" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-black p-0 selection:bg-[#e10600] selection:text-white uppercase font-sans overflow-x-hidden italic font-bold print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.6'
            }}>

            {/* RACING OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#f3f3f3]" />
                <div className="absolute top-0 right-0 w-[40%] h-full bg-black skew-x-[-15deg] translate-x-32" />
                <motion.div variants={speedVariants} animate="animate" className="absolute top-1/4 left-0 w-full h-[2px] bg-[#e10600] opacity-20" />
                <motion.div variants={speedVariants} animate="animate" transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute top-3/4 left-0 w-full h-[1px] bg-black opacity-10" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1440px] mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white/95"
            >
                {/* 1. THE APEX PILOT HEADER */}
                <header className="w-full relative py-20 px-10 px-24 border-b-[20px] border-[#e10600] bg-black italic">
                    <div className="absolute bottom-0 right-0 p-10 opacity-10">
                         <Flag className="w-64 h-64 text-white" />
                    </div>
                    
                    <div className="flex flex-row gap-20 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-6 px-8 py-3 bg-[#e10600] text-white text-[12px] font-black tracking-[0.8em] italic shadow-[10px_10px_0px_rgba(255,255,255,0.1)]">
                                <Gauge className="w-6 h-6 animate-pulse" /> PILOT_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0, x: -100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-7xl text-[13rem] font-black text-white tracking-tighter leading-none"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[4px] w-32 bg-[#e10600]" />
                                     <p className="text-4xl font-black tracking-[0.5em] text-white/40 uppercase leading-none">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-4">
                                        {['PRO', 'F1', 'FIA'].map(tag => (
                                            <span key={tag} className="px-5 py-2 bg-white text-black text-[11px] font-black tracking-[0.4em]">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-16 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border-l-[10px] border-[#e10600] shadow-3xl relative group hover:-rotate-3 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={130} color="#000000" />
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Timer className="w-8 h-8 text-[#e10600]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[12px] font-black tracking-[0.5em] text-white/20 italic rotate-90 origin-right">REG_PILOT: {personal.fullName?.split(' ')[0].toUpperCase()}_SPD</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-20 mt-20 text-[13px] font-black tracking-[0.5em] text-white italic border-t border-white/10 pt-16">
                        {personal.email && <div className="flex items-center gap-6 hover:text-[#e10600] transition-colors cursor-pointer"><Mail className="w-6 h-6 text-[#e10600]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-6 hover:text-[#e10600] transition-colors cursor-pointer"><Phone className="w-6 h-6 text-[#e10600]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-6"><MapPin className="w-6 h-6 text-[#e10600]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: PERFORMANCE & TELEMETRY */}
                    <aside className="col-span-4 p-12 space-y-40 bg-zinc-900 text-white italic">
                        
                        {/* PERFORMANCE METRICS */}
                        <section className="bg-black border-l-[15px] border-[#e10600] p-12 space-y-16 relative overflow-hidden group shadow-2xl break-inside-avoid page-break-inside-avoid">
                             <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 transition-opacity">
                                <Trophy className="w-40 h-40" />
                             </div>
                             <h4 className="text-[12px] font-black tracking-[1em] text-[#e10600] mb-full border-b border-white/10 pb-6 mb-24 leading-none uppercase">{t.stats}</h4>
                             <div className="space-y-16 relative z-10">
                                {[
                                    { label: 'Grand Prix Wins', val: '45' },
                                    { label: 'Podium Finishes', val: '82' },
                                    { label: 'Pole Positions', val: '54' },
                                    { label: 'Track Records', val: '12' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/stat break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[11px] font-black uppercase tracking-widest text-[#e10600]/40 group-hover/stat:text-white transition-colors">{stat.label}</p>
                                        <p className="text-5xl font-black italic tracking-tighter text-white">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* PILOT SUMMARY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-12 group bg-white/5 p-12 border border-white/5 relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[12px] font-black tracking-[0.8em] text-[#e10600] flex items-center gap-6 italic mb-10 border-b border-white/5 pb-6 uppercase">
                                     <Wind className="w-8 h-8" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-black leading-relaxed text-zinc-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* TELEMETRY MASTERY (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[12px] font-black tracking-[0.8em] text-[#e10600] flex items-center gap-6 italic mb-12 border-b border-white/5 pb-8 uppercase">
                                    <Cpu className="w-8 h-8" /> {t.expertise}
                                </h3>
                                <div className="space-y-5">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="p-6 bg-black border border-white/5 text-[11px] font-black tracking-[0.3em] text-zinc-500 hover:text-white hover:border-[#e10600] hover:translate-x-4 transition-all cursor-default flex items-center justify-between group/item break-inside-avoid page-break-inside-avoid">
                                            <span>{skill}</span>
                                            <Spark className="w-5 h-5 opacity-0 group-hover/item:opacity-100 text-[#e10600] transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CONDITIONING HUB */}
                        <div className="p-16 border-4 border-double border-white/10 text-center group bg-black relative overflow-hidden shadow-inner">
                             <h4 className="text-[12px] font-black tracking-[1.5em] text-[#e10600] mb-16 leading-none uppercase">{t.conditioning}</h4>
                             <div className="grid grid-cols-2 gap-12 text-[#e10600] group-hover:text-white transition-colors relative z-10">
                                {[ 
                                    { label: 'G-FORCE', val: '5.2G' },
                                    { label: 'REACTION', val: '0.1s' },
                                    { label: 'VO2 MAX', val: '72' },
                                    { label: 'STRENGTH', val: '100%' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 break-inside-avoid page-break-inside-avoid">
                                        <p className="text-3xl font-black italic">{item.val}</p>
                                        <span className="text-[9px] font-black tracking-widest text-zinc-600">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </aside>

                    {/* MAIN CANVAS: TRACK REGISTRY */}
                    <main className="col-span-8 p-10 p-32 space-y-48 bg-white text-black italic">
                        
                        {/* PERFORMANCE RECORDS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-24 transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-zinc-50 p-24 -mx-24 border-y-[10px] border-black shadow-3xl' : ''}`}>
                                <h2 className="text-[13px] font-black tracking-[3em] text-zinc-200 mb-24 flex items-center gap-12 italic leading-none justify-start uppercase">
                                    <Activity className="w-12 h-12 text-[#e10600]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-[10px] border-black hover:border-[#e10600] transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            {/* SPEED LINE ANIMATION */}
                                            <div className="absolute top-0 -left-[10px] w-[10px] h-48 bg-[#e10600] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[20px_0_40px_rgba(225,6,0,0.2)]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[8rem] font-black text-black tracking-tighter italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-10">
                                                        <div className="h-[4px] w-24 bg-black group-hover:w-48 group-hover:bg-[#e10600] transition-all duration-1000" />
                                                        <p className="text-4xl font-black text-zinc-300 tracking-[0.8em] group-hover:text-black transition-colors italic leading-none uppercase">CONSTRUCTOR: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[13px] font-black text-white bg-black px-12 py-6 shadow-3xl skew-x-[-20deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.5em] leading-none border-r-[10px] border-[#e10600]">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-3xl text-zinc-300 leading-relaxed font-black italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-zinc-50 pl-24 py-16 group-hover:text-black group-hover:border-black bg-zinc-50/20 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-24 border-[15px] border-black bg-zinc-900 group hover:border-[#e10600] transition-all duration-1000 relative overflow-hidden shadow-2xl break-inside-avoid page-break-inside-avoid">
                                 <motion.div animate={{ skewX: [-15, 0, -15] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-10 -right-10 w-64 h-64 bg-[#e10600]/10" />
                                 <h3 className="text-[12px] font-black tracking-[1.5em] text-white/10 text-center italic mb-20 flex items-center justify-center gap-10 leading-none uppercase relative z-10">
                                     <GraduationCap className="w-16 h-16 mb-8 text-[#e10600] mx-auto opacity-30 group-hover:opacity-100 transition-all" /> {t.education}
                                </h3>
                                <div className="space-y-20 relative z-10">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center border-b border-white/5 pb-10 last:border-0 italic break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[11px] font-black text-zinc-500 mb-8 tracking-[0.6em] group-hover:text-[#e10600] transition-colors">ACADEMIC_TRACK_LOG_0{i + 1}</p>
                                            <h4 className="text-5xl font-black italic leading-tight mb-6 group-hover/edu:scale-105 transition-transform text-white uppercase">{edu.degree}</h4>
                                            <p className="text-[15px] font-black tracking-[0.5em] text-[#e10600]/60 uppercase">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>

                {/* THE APEX PILOT FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t-[20px] border-black bg-zinc-900 text-zinc-500 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black italic">
                    <div className="absolute top-0 left-0 w-full h-[15px] bg-[#e10600] shadow-[0_0_50px_rgba(225,6,0,0.5)]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4 items-end h-24">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [20, 100, 20] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1 }} className="w-3 bg-white/5 group-hover:bg-[#e10600]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[32px] uppercase tracking-[2em] mb-8 text-white">{personal.fullName} // SPD_CORE_v12</p>
                             <p className="text-[13px] uppercase tracking-[0.8em] italic opacity-20 italic">No Limits // Pure Precision // Ultimate Velocity</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-zinc-700 group-hover:text-[#e10600] transition-colors relative z-10 p-20 bg-black border border-white/5 rounded-0 shadow-3xl">
                         {[Share2, Globe, Flag, Trophy].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 3, rotate: 15, color: '#ffffff' }}>
                                 <Icon className="w-20 h-20 cursor-pointer transition-all duration-1000 shadow-3xl shadow-[#e10600]/20" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
