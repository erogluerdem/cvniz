import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Mouse, Monitor, Cpu, Trophy, Swords, Zap as Spark, ShieldAlert, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function EsportsProTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#00f7ff' // Cyber Cyan

    const t = {
        summary: isEn ? 'The Cyber Athlete Manifesto' : 'Siber Sporcu Manifestosu',
        experience: isEn ? 'Professional Tournament Ledger' : 'Profesyonel Turnuva Defteri',
        education: isEn ? 'Foundational Training & Academics' : 'Temel Eğitim ve Akademik',
        expertise: isEn ? 'Mechanical & Technical Mastery' : 'Mekanik ve Teknik Ustalık',
        contact: isEn ? 'Secure Comms Channel' : 'Güvenli İletişim Kanalı',
        stats: isEn ? 'Performance Metrics & KDA' : 'Performans Metrikleri ve KDA',
        gear: isEn ? 'Battle Station Technicals' : 'Savaş İstasyonu Teknikleri'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const scanVariants = {
        animate: {
            y: [-100, 500, -100],
            opacity: [0, 0.1, 0],
            transition: { duration: 5, repeat: Infinity, ease: "linear" }
        }
    }

    return (
        <div className="min-h-full bg-[#050505] text-slate-400 p-0 selection:bg-[#00f7ff] selection:text-black uppercase font-mono overflow-x-hidden"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* CYBER OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[#00f7ff]/[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(0,247,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,247,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <motion.div variants={scanVariants} animate="animate" className="absolute top-0 left-0 w-full h-[50px] bg-gradient-to-b from-[#00f7ff]/20 to-transparent" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#050505] border-x border-[#00f7ff]/10"
            >
                {/* 1. THE CYBER ATHLETE HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-[#00f7ff]/20 bg-[#080808] overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Swords className="w-64 h-64 text-[#00f7ff]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-10 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#00f7ff]/10 text-[#00f7ff] text-[10px] font-black tracking-[0.6em] border border-[#00f7ff]/30 italic">
                                <Wifi className="w-4 h-4 animate-pulse" /> TARGET_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-6xl text-[9rem] font-bold text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-20 bg-[#00f7ff] shadow-[0_0_15px_#00f7ff]" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-slate-500 italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['CHALLENGER', 'RADIANT', 'IGL'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-[#ff00ff]/10 border border-[#ff00ff]/30 text-[9px] font-bold text-[#ff00ff] tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-[#00f7ff]/30 shadow-[0_0_50px_rgba(0,247,255,0.1)] relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#00f7ff" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-6 h-6 text-[#00f7ff]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-[#00f7ff]/20 italic rotate-90 origin-right">USER_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_ATH</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-white/30 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#00f7ff] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#00f7ff]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#00f7ff] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#00f7ff]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#00f7ff]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: STATS & GEAR */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#080808] border-r border-[#00f7ff]/10">
                        
                        {/* PERFORMANCE METRICS */}
                        <section className="bg-[#00f7ff]/5 border border-[#00f7ff]/20 p-10 space-y-12 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
                                <Activity className="w-32 h-32" />
                             </div>
                             <h4 className="text-[11px] font-bold tracking-[0.8em] text-[#00f7ff] mb-full border-b border-[#00f7ff]/20 pb-4 mb-20 italic leading-none uppercase">{t.stats}</h4>
                             <div className="space-y-10 relative z-10">
                                {[
                                    { label: 'Overall KDR', val: '1.85' },
                                    { label: 'Win Rate', val: '68.4%' },
                                    { label: 'Avg HS%', val: '32%' },
                                    { label: 'Map Control', val: '92%' }
                                ].map((stat, i) => (
                                    <div key={i} className="flex justify-between items-baseline group/stat">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#00f7ff]/40 group-hover/stat:text-white transition-colors">{stat.label}</p>
                                        <p className="text-3xl font-black italic tracking-tighter text-[#00f7ff]">{stat.val}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* SKILL MATRIX (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10 group">
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/10 flex items-center gap-4 italic mb-10 border-b border-white/5 pb-4 uppercase">
                                    <Target className="w-5 h-5 text-[#00f7ff]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="p-4 bg-slate-900 border border-slate-800 text-[10px] font-bold tracking-[0.2em] text-slate-500 hover:text-white hover:border-[#00f7ff] transition-all cursor-default flex items-center justify-between group/item">
                                            <span>{skill}</span>
                                            <Spark className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-[#00f7ff] transition-all" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* BATTLE STATION (GEAR) */}
                        <div className="p-10 border-2 border-[#00f7ff]/10 text-center group bg-black relative overflow-hidden">
                             <h4 className="text-[11px] font-bold tracking-[1.5em] text-[#00f7ff]/20 mb-10 italic leading-none uppercase">{t.gear}</h4>
                             <div className="grid grid-cols-2 gap-8 text-[#00f7ff]/40 group-hover:text-white transition-colors">
                                {[ 
                                    { icon: Mouse, label: 'Superlight' },
                                    { icon: Monitor, label: '360Hz_Zowie' },
                                    { icon: Cpu, label: 'RTX_4090' },
                                    { icon: Terminal, label: 'Wooting_60HE' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-4 border border-[#00f7ff]/5 group-hover:border-[#00f7ff]/20 transition-all">
                                        <item.icon className="w-6 h-6" />
                                        <span className="text-[8px] font-bold tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-[#00f7ff]/5 border-y border-[#00f7ff]/10 shadow-inner">
                                <h3 className="text-[10px] font-bold tracking-[1em] text-white/5 text-center italic mb-10 leading-none pb-4 border-b border-white/5 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu">
                                        <p className="text-[9px] font-bold text-slate-700 group-hover:text-[#00f7ff] transition-colors mb-6 tracking-[0.5em] italic">ACADEMIC_RECORD_#0{i + 1}</p>
                                        <h4 className="text-3xl font-bold italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-white">{edu.degree}</h4>
                                        <p className="text-[11px] font-bold tracking-[0.3em] text-[#00f7ff]/30 mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: TOURNAMENT LEDGER */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-[#050505]">
                        
                        {/* EXPERIENCE HISTORY (TOURNAMENTS) */}
                        {experience.length > 0 && (
                            <motion.section variants={scanVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#00f7ff]/5 p-16 -mx-16 border border-[#00f7ff]/20 shadow-[0_0_80px_rgba(0,247,255,0.05)]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[2.5em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Trophy className="w-10 h-10 text-[#00f7ff]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-[#00f7ff]/10 hover:border-[#00f7ff] transition-all duration-[1s]">
                                            <div className="absolute top-0 -left-[2px] w-[3px] h-32 bg-[#00f7ff] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_25px_#00f7ff]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-4xl text-[6.5rem] font-bold text-white tracking-widest italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none uppercase">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-[2px] w-20 bg-[#ff00ff]/20 group-hover:w-40 group-hover:bg-[#ff00ff] transition-all duration-1000 shadow-[0_0_10px_#ff00ff]" />
                                                        <p className="text-3xl font-black text-slate-800 tracking-[1em] group-hover:text-slate-400 transition-colors italic leading-none uppercase">TEAM_REF: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#00f7ff] px-12 py-5 shadow-2xl skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.5em] leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-700 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-[#00f7ff]/5 pl-24 py-16 group-hover:text-slate-200 group-hover:border-[#00f7ff] bg-[#00f7ff]/[0.02] transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* CYBER SEAL */}
                        <div className="p-32 bg-slate-900 border border-[#00f7ff]/30 text-center group relative overflow-hidden transition-all duration-1000 shadow-[0_0_100px_rgba(0,247,255,0.05)]">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#00f7ff] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000" />
                             <ShieldAlert className="absolute -top-10 -right-10 w-64 h-64 text-[#00f7ff]/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[2.5em] text-[#00f7ff] mb-20 italic leading-none z-10 relative uppercase">TARGET_ELITE_ACCREDITATION</h4>
                             <div className="space-y-12 relative z-10">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white" style={{ letterSpacing: '-0.02em' }}>Professional Gaming Tier-1 Verified // Global Invitational Standards</p>
                                <p className="text-xl font-bold italic tracking-widest text-[#00f7ff]/40 group-hover:text-white transition-opacity uppercase">Mechanical Excellence // Tactical Precision // Mental Resilience</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-slate-800 group-hover:text-[#00f7ff] transition-all duration-[1s]">
                                {[Terminal, Activity, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE CYBER ATHLETE FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t border-[#00f7ff]/20 bg-[#080808] text-slate-800 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-[#00f7ff] to-transparent shadow-[0_0_20px_#00f7ff]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ height: [10, 80, 10], backgroundColor: ['#00f7ff', '#ff00ff', '#00f7ff'] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-1 bg-[#00f7ff]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] uppercase tracking-[1.8em] mb-8 text-white">{personal.fullName} // CYB_CORE_v12</p>
                             <p className="text-[12px] uppercase tracking-[0.6em] italic opacity-40 italic">Apex Performance // Zero Latency // Absolute Focus</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-800 group-hover:text-[#00f7ff] transition-colors relative z-10 p-16 bg-slate-900 border border-slate-800 rounded-full shadow-3xl">
                         {[Share2, Globe, Swords, Trophy].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.5, color: '#ffffff' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl shadow-[#00f7ff]/10" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
