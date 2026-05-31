import React from 'react';
import { Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Heart, ShieldCheck, PenTool, Layers, Activity, Database, Terminal, Zap as Spark, Box, Cpu, Radio, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function SpaceSystemsTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#3b82f6' // Orbital Blue

    const t = {
        summary: isEn ? 'Mission Philosophy & Vision' : 'Misyon Felsefesi ve Vizyon',
        experience: isEn ? 'Mission Deployment Log & Aerospace History' : 'Misyon Dağıtım Günlüğü ve Havacılık Geçmişi',
        education: isEn ? 'Aeronautical Formation' : 'Havacılık Formasyonu',
        expertise: isEn ? 'Systems & Propulsion Stack' : 'Sistemler ve İtki Yığını',
        contact: isEn ? 'Control Node Access' : 'Kontrol Noktası Erişimi',
        missions: isEn ? 'Orbital Deployment Registry' : 'Yörünge Dağıtım Kaydı',
        stack: isEn ? 'Aerospace Technical Core' : 'Havacılık Teknik Çekirdeği'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const orbitVariants = {
        animate: {
            rotate: 360,
            transition: { duration: 120, repeat: Infinity, ease: "linear" }
        }
    }

    return (
        <div className="min-h-full bg-[#050505] text-slate-400 p-0 selection:bg-[#3b82f6] selection:text-white uppercase font-mono"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* DEEP SPACE & ORBIT OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff08_1px,_transparent_1px)] bg-[size:100px_100px]" />
                <motion.div 
                    variants={orbitVariants}
                    animate="animate"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full"
                />
                <motion.div 
                    variants={orbitVariants}
                    animate="animate"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-blue-500/5 rounded-full"
                    style={{ animationDirection: 'reverse' }}
                />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#050505] border-x border-slate-900"
            >
                {/* 1. THE ASTRO-ARCHITECT HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-slate-900 bg-[#080808]">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-blue-500/10 text-blue-500 text-[10px] font-black tracking-[0.8em] border border-blue-500/30">
                                <Radio className="w-4 h-4 animate-pulse" /> SPACE_SYSTEMS_MOD_05
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[8rem] font-black text-white tracking-widest leading-none italic"
                                    style={{ letterSpacing: '-0.02em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-20 bg-blue-500" />
                                     <p className="text-2xl font-black tracking-[0.6em] text-blue-400 uppercase">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-4">
                                        {['LEO', 'HEO', 'GEO'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-slate-800 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative group">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#3b82f6" />
                                    <div className="absolute top-0 right-0 p-2 opacity-5 scale-0 group-hover:scale-100 transition-transform">
                                        <ShieldAlert className="w-6 h-6 text-red-500" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black tracking-[0.4em] text-blue-500/20 italic">MISSION_CONTROL_NODE: {personal.fullName?.split(' ')[0].toUpperCase()}_SPACE</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-black tracking-[0.5em] text-slate-500">
                        {personal.email && <div className="flex items-center gap-4 hover:text-blue-500 transition-colors cursor-pointer"><Mail className="w-5 h-5 text-blue-500" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-blue-500 transition-colors cursor-pointer"><Phone className="w-5 h-5 text-blue-500" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-blue-500" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: ORBITS & SYSTEMS */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#080808] border-r border-slate-900">
                        
                        {/* MISSION PHILOSOPHY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900/50 border border-slate-800 p-10 relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                    <Globe className="w-48 h-48" />
                                </div>
                                <h3 className="text-[11px] font-black tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8 border-b border-slate-800 pb-4">
                                     <BookOpen className="w-5 h-5 text-blue-500" /> {t.summary}
                                </h3>
                                <p className="text-xl font-black italic leading-relaxed text-slate-500 group-hover:text-blue-400 transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* SYSTEMS CORE (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10">
                                <h3 className="text-[11px] font-black tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-10 border-b border-slate-800 pb-4">
                                    <Cpu className="w-5 h-5 text-blue-500" /> {t.expertise}
                                </h3>
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item py-2 border-b border-white/5">
                                            <div className="flex justify-between items-center text-[10px] font-black tracking-widest text-slate-600 group-hover/item:text-blue-400 transition-colors">
                                                <span>{skill}</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(j => <div key={j} className={`w-3 h-1 ${j <= (5 - i%3) ? 'bg-blue-500' : 'bg-slate-800'}`} />)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-10 bg-slate-900 border border-slate-800 space-y-16">
                                <h3 className="text-[10px] font-black tracking-[1em] text-white/10 text-center italic mb-10 leading-none pb-4 border-b border-white/5 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu">
                                        <p className="text-[9px] font-black text-slate-700 group-hover:text-blue-500 transition-colors mb-4 tracking-[0.5em] italic">ACADEMIC_RECORD_#0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic text-white leading-tight uppercase">{edu.degree}</h4>
                                        <p className="text-[11px] font-black tracking-[0.3em] text-blue-500/50 mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: DEPLOYMENT LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-[#050505]">
                        
                        {/* MISSION LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`space-y-24 transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-blue-500/5 p-16 -mx-16 border-y border-blue-500/20 shadow-2xl skew-x-[-2deg]' : ''}`}>
                                <h2 className="text-[11px] font-black tracking-[2em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Activity className="w-8 h-8 text-blue-500" /> {t.experience}
                                </h2>
                                <div className="space-y-48">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-slate-900 hover:border-blue-500 transition-all duration-1000">
                                            <div className="absolute top-0 -left-[2px] w-1 h-32 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_20px_#3b82f6]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-6">
                                                    <h3 className="text-5xl text-[6rem] font-black text-white tracking-widest uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-10 h-[2px] bg-blue-500/20 group-hover:w-20 group-hover:bg-blue-500 transition-all duration-1000" />
                                                        <p className="text-2xl font-black text-slate-800 uppercase tracking-[0.8em] italic group-hover:text-blue-500 transition-colors">PROJECT_ID: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black text-black bg-blue-500 px-10 py-4 group-hover:bg-white transition-all whitespace-nowrap italic tracking-[0.4em] shadow-2xl skew-x-[-15deg] group-hover:skew-x-0">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-xl text-slate-600 leading-relaxed font-black italic opacity-90 group-hover:opacity-100 transition-opacity border-l-[30px] border-slate-900 pl-20 py-10 group-hover:text-blue-200 group-hover:border-blue-500 bg-white/5 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* AEROSPACE TECHNICAL HUB */}
                        <div className="p-20 border border-slate-900 bg-[#080808] text-center group hover:border-blue-500 transition-all duration-1000 shadow-[0_0_100px_rgba(59,130,246,0.05)] relative overflow-hidden">
                             <Box className="absolute -top-10 -right-10 w-64 h-64 text-blue-500/5 group-hover:scale-125 transition-transform duration-[8s]" />
                             <h4 className="text-[12px] font-black tracking-[2em] text-white/10 mb-12 italic leading-none z-10 relative uppercase">{t.stack}</h4>
                             <div className="grid grid-cols-2 gap-10 mt-16 relative z-10 text-slate-500 group-hover:text-white transition-colors">
                                {[ 'Orbital Mechanics (HEO/GEO)', 'Satellite Telemetry / GNSS', 'Propulsion Systems (Chemical/Ionic)', 'Space Radiation Hardening' ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-slate-900 p-6 border border-slate-800 hover:border-blue-500 transition-all cursor-default group/item">
                                        <Spark className="w-4 h-4 text-blue-500 opacity-20 group-hover/item:opacity-100 transition-opacity" />
                                        <span className="text-[10px] uppercase font-black text-blue-400 group-hover:text-white transition-all tracking-tighter">{item}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE ASTRO-ARCHITECT FOOTER */}
                <footer className="w-full mt-40 py-24 px-10 px-24 bg-[#080808] text-slate-600 flex flex-row justify-between items-center gap-24 group relative overflow-hidden border-t border-slate-900 font-black">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-blue-500 shadow-[0_0_20px_#3b82f6]" />
                    <div className="flex flex-col items-start gap-12 pt-10 relative z-10">
                         <div className="flex gap-2">
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <motion.div key={i} animate={{ h: [4, 20, 4] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-blue-500/20" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[20px] uppercase tracking-[1.5em] mb-4 text-white">{personal.fullName} // AST_CORE_SYS_05</p>
                             <p className="text-[11px] uppercase tracking-[0.5em] italic opacity-20">Mission Control Approved // Space-Grade Precision // Absolute Scale</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-slate-800 group-hover:text-blue-500 transition-all duration-1000 relative z-10 p-12 bg-slate-900 border border-slate-800 rounded-full">
                         {[Share2, Globe, Cpu, Radio].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -40, scale: 2.5, color: '#ffffff' }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-all duration-700 shadow-2xl shadow-blue-500/20" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
