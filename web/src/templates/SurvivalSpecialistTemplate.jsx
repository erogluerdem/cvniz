import React from 'react';
import { Mail, Phone, MapPin, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Wind, Flame, Droplets, Map, Cross, ShieldAlert, Zap as Spark } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function SurvivalSpecialistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#f97316' // Survival Orange

    const t = {
        summary: isEn ? 'Survival Ethos & Field Vision' : 'Hayatta Kalma Etosu ve Saha Vizyonu',
        experience: isEn ? 'Field Operations & Mission Registry' : 'Saha Operasyonları ve Misyon Kaydı',
        education: isEn ? 'Technical Training & Formation' : 'Teknik Eğitim ve Formasyon',
        expertise: isEn ? 'Survival Capability Matrix' : 'Hayatta Kalma Yetenek Matrisi',
        contact: isEn ? 'Secure Signal Node' : 'Güvenli Sinyal Noktası',
        stack: isEn ? 'Essential Gear & Technical Stack' : 'Temel Ekipman ve Teknik Yığın',
        badges: isEn ? 'Rescue & Survival Certifications' : 'Kurtarma ve Hayatta Kalma Sertifikaları'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const scanVariants = {
        animate: {
            y: [-10, 10, -10],
            opacity: [0.1, 0.3, 0.1],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#0a0a0a] text-slate-500 p-0 selection:bg-[#f97316] selection:text-black uppercase font-mono overflow-x-hidden print-exact mx-auto print:mx-0"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* FIELD GRID OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(#f9731605_1px,transparent_1px),linear-gradient(90deg,#f9731605_1px,transparent_1px)] bg-[size:40px_40px]" />
                <motion.div 
                    variants={scanVariants}
                    animate="animate"
                    className="absolute top-0 left-0 w-full h-[2px] bg-[#f97316] shadow-[0_0_20px_#f97316]"
                />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#0a0a0a] border-x border-slate-900"
            >
                {/* 1. THE OUTRIDER HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-[#f97316] bg-[#0d0d0d] overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Map className="w-64 h-64 text-[#f97316]" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#f97316]/10 text-[#f97316] text-[10px] font-black tracking-[0.6em] border border-[#f97316]/30 italic">
                                <Spark className="w-4 h-4 animate-pulse" /> SURVIVAL_SPECIALIST_v4.2
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[8rem] font-bold text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-20 bg-[#f97316] shadow-[0_0_15px_#f97316]" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-slate-500 italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['SERE', 'WEMT', 'SAR'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-500 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-slate-800 shadow-3xl skew-x-[-15deg] group hover:skew-x-0 transition-all duration-700 relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#f97316" />
                                    <div className="absolute top-0 left-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Lock className="w-6 h-6 text-[#f97316]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-[#f97316]/20 italic">FIELD_LOG_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_CORE</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.5em] text-white/30 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#f97316] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#f97316]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#f97316] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#f97316]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#f97316]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: CAPABILITIES & GEAR */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#0d0d0d] border-r border-[#f97316]/10">
                        
                        {/* SURVIVAL ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900 border border-slate-800 p-10 relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Wind className="w-6 h-6 text-[#f97316]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8 border-b border-slate-800 pb-4">
                                     <Target className="w-5 h-5 text-[#f97316]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* CAPABILITY MATRIX (SKILLS) */}
                        <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-10 border-b border-slate-800 pb-4">
                                <Layers className="w-5 h-5 text-[#f97316]" /> {t.expertise}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {skills.map((skill, i) => (
                                    <div key={i} className="p-4 bg-slate-900 border border-slate-800 text-[9px] font-bold tracking-[0.1em] text-slate-600 hover:text-[#f97316] hover:border-[#f97316]/30 transition-all cursor-default text-center group/item uppercase break-inside-avoid page-break-inside-avoid">
                                        <div className="w-full h-[1px] bg-[#f97316]/10 mb-2 scale-x-0 group-hover/item:scale-x-100 transition-transform" />
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ESSENTIAL GEAR STACK */}
                        <div className="p-10 border-2 border-slate-800 text-center group bg-black">
                             <h4 className="text-[11px] font-bold tracking-[1.5em] text-slate-700 mb-10 italic leading-none">{t.stack}</h4>
                             <div className="grid grid-cols-2 gap-8 text-[#f97316]/30 group-hover:text-white transition-colors">
                                {[ 
                                    { icon: Map, label: 'Analog Nav' },
                                    { icon: ShieldAlert, label: 'Crisis Comms' },
                                    { icon: Cross, label: 'Trauma Kit' },
                                    { icon: Flame, label: 'Off-Grid Power' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-4 border border-slate-800 group-hover:border-[#f97316]/30 transition-all break-inside-avoid page-break-inside-avoid">
                                        <item.icon className="w-6 h-6" />
                                        <span className="text-[8px] font-bold tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-900 border border-slate-800 shadow-2xl skew-x-[-2deg] break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-bold tracking-[1em] text-white/10 text-center italic mb-10 leading-none pb-4 border-b border-white/5 skew-x-[2deg] uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu skew-x-[2deg] break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-bold text-slate-700 group-hover:text-[#f97316] transition-colors mb-6 tracking-[0.5em] italic">TECH_TRAINING_0{i + 1}</p>
                                        <h4 className="text-3xl font-bold italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform text-white">{edu.degree}</h4>
                                        <p className="text-[11px] font-bold tracking-[0.3em] text-[#f97316]/40 mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: FIELD LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-[#0a0a0a]">
                        
                        {/* FIELD OPS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#f97316]/5 p-20 -mx-20 rounded-[8rem] border border-[#f97316]/20 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[3em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Activity className="w-8 h-8 text-[#f97316]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-900 hover:border-[#f97316] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[2.5px] w-1 h-32 bg-[#f97316] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_50px_#f97316]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-5xl text-[7.5rem] font-bold text-white tracking-widest italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-800 group-hover:w-40 group-hover:bg-[#f97316] transition-all duration-1000" />
                                                        <p className="text-3xl font-bold text-slate-800 tracking-[1em] group-hover:text-[#f97316]/50 transition-colors italic leading-none uppercase">OP_ID: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#f97316] px-12 py-5 group-hover:bg-white transition-all italic tracking-[0.6em] shadow-3xl whitespace-nowrap leading-none">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-700 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-slate-900 pl-24 py-16 group-hover:text-slate-300 group-hover:border-[#f97316] bg-black/10 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* RESCUE & SURVIVAL STATUS */}
                        <div className="p-32 bg-slate-900 border border-slate-800 text-center group relative overflow-hidden transition-all duration-1000 shadow-3xl">
                             <div className="absolute inset-x-0 bottom-0 h-1 bg-[#f97316] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000" />
                             <Award className="absolute -top-10 -right-10 w-64 h-64 text-[#f97316]/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             
                             <h4 className="text-[12px] font-bold tracking-[2.5em] text-[#f97316] mb-20 italic leading-none z-10 relative uppercase">{t.badges}</h4>
                             <div className="space-y-12 relative z-10">
                                <p className="text-4xl text-6xl font-black italic tracking-tighter leading-none text-white" style={{ letterSpacing: '-0.02em' }}>Advanced SERE-C Instructor // Critical Response Lead</p>
                                <p className="text-xl font-bold italic tracking-widest text-[#f97316]/40 group-hover:text-white transition-opacity uppercase">WEMT Certified // Extreme Terrain Survival Mastery</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-[#f97316]/10 group-hover:text-[#f97316] transition-all duration-[1s]">
                                {[Terminal, Activity, Globe, ShieldCheck].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE OUTRIDER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-16 border-t border-slate-800 bg-[#0d0d0d] text-slate-700 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-[#f97316] to-transparent shadow-[0_0_20px_#f97316]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-2 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-1 bg-[#f97316]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] tracking-[1.8em] mb-6 text-white">{personal.fullName} // OUT_CORE_SYS_05</p>
                             <p className="text-[12px] tracking-[0.5em] italic opacity-40">Resilience Verified // Field Ops Mastery // Absolute Survival</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-800 group-hover:text-[#f97316] transition-colors relative z-10 p-16 bg-slate-900 rounded-0 border border-slate-800 shadow-3xl">
                         {[Share2, Globe, Wind, Target].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.2, color: '#ffffff' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
