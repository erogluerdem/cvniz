import React from 'react';
import { Mail, Phone, MapPin, Shield, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Lock, ShieldAlert, Activity, Car, Cross } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CloseProtectionTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#333333' // Matte Steel

    const t = {
        summary: isEn ? 'Tactical Ethos & Mission Vision' : 'Taktik Etos ve Misyon Vizyonu',
        experience: isEn ? 'Operational Protection Log & Missions' : 'Operasyonel Koruma Günlüğü ve Misyonlar',
        education: isEn ? 'Foundational Training & Clearances' : 'Temel Eğitim ve Yetkiler',
        expertise: isEn ? 'Tactical & Strategic Capabilities' : 'Taktik ve Stratejik Yetkinlikler',
        contact: isEn ? 'Secure Comms Channel' : 'Güvenli İletişim Kanalı',
        skills: isEn ? 'Threat Mitigation Stack' : 'Tehdit Azaltma Yığını'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const shieldVariants = {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#1a1a1a] text-slate-500 p-0 selection:bg-[#333333] selection:text-white uppercase font-sans print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* TACTICAL OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
                <div className="absolute inset-0 border-[20px] border-[#1a1a1a] shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#1a1a1a] border-x border-slate-800"
            >
                {/* 1. THE GUARDIAN HEADER */}
                <header className="w-full relative py-16 px-10 px-16 border-b border-[#333] bg-[#1c1c1c] overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Shield className="w-64 h-64 text-white" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-8 text-left">
                            <motion.div variants={shieldVariants} className="inline-flex items-center gap-4 px-5 py-1.5 bg-white/5 text-white text-[10px] font-black tracking-[0.5em] border border-white/10 italic">
                                <Activity className="w-4 h-4 animate-pulse text-red-500" /> OPERATIONAL_NODE_v7.2
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={shieldVariants} 
                                    className="text-6xl text-[9rem] font-black text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={shieldVariants} className="flex flex-wrap items-center gap-8 justify-start">
                                     <div className="h-[2px] w-20 bg-red-600 shadow-[0_0_10px_#ef4444]" />
                                     <p className="text-2xl font-black tracking-[0.4em] text-slate-500">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['EP', 'SIA', 'TCCC'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-black border border-slate-800 text-[9px] font-bold text-slate-500 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={shieldVariants} className="flex flex-col items-center items-end gap-10 text-right">
                             {theme?.showQrCode && (
                                <div className="p-3 bg-slate-900 border border-slate-800 shadow-3xl skew-x-[-10deg] group hover:skew-x-0 transition-all duration-700 relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#ffffff" />
                                    <div className="absolute -top-4 -left-4 bg-red-600 text-white text-[8px] px-3 py-1 font-bold italic shadow-lg">SECURE_LINK</div>
                                </div>
                             )}
                             <p className="text-[10px] font-bold tracking-[0.4em] text-white/10 italic">STATUS: MISSION_READY</p>
                        </motion.div>
                    </div>

                    <motion.div variants={shieldVariants} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-black tracking-[0.3em] text-slate-600 italic font-mono">
                        {personal.email && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5 text-red-600" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Phone className="w-5 h-5 text-red-600" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-red-600" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: CAPABILITIES & CLEARANCE */}
                    <aside className="col-span-4 p-8 space-y-24 bg-[#1c1c1c] border-r border-[#333]">
                        
                        {/* TACTICAL ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-8 group bg-black p-8 border border-white/5 relative overflow-hidden ring-1 ring-white/5 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black tracking-[0.6em] text-white/20 flex items-center gap-4 italic mb-8 border-b border-white/5 pb-4">
                                     <ShieldAlert className="w-5 h-5 text-red-600" /> {t.summary}
                                </h3>
                                <p className="text-lg font-bold leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* THREAT MITIGATION STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10 group break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black tracking-[0.6em] text-white/20 flex items-center gap-4 italic mb-10 border-b border-white/5 pb-4">
                                    <Target className="w-5 h-5 text-red-600" /> {t.expertise}
                                </h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="p-4 bg-[#1a1a1a] border border-white/5 text-[10px] font-black tracking-[0.1em] text-slate-500 hover:bg-[#333] hover:text-white transition-all cursor-default flex items-center justify-between group/item break-inside-avoid page-break-inside-avoid">
                                            <span>{skill}</span>
                                            <div className="w-10 h-[1px] bg-red-600 scale-x-0 group-hover/item:scale-x-100 transition-transform origin-right" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* TRAINING LOG (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-10 bg-black text-white space-y-16 border border-white/5 shadow-2xl skew-x-[-2deg] break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[9px] font-black tracking-[1em] text-red-600 text-center italic mb-10 leading-none pb-4 border-b border-white/5 skew-x-[2deg]">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu skew-x-[2deg] break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-white/10 group-hover:text-red-600 transition-colors mb-4 italic tracking-[0.5em]">OPERATIONAL_CERT_0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic text-white leading-tight">{edu.degree}</h4>
                                        <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* CLEARANCE GRID */}
                        <div className="p-12 border border-white/5 bg-slate-900/20 text-center group relative overflow-hidden">
                             <Lock className="absolute -top-10 -right-10 w-48 h-48 opacity-5 group-hover:rotate-12 transition-transform duration-[4s]" />
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-white/10 mb-10 italic leading-none group-hover:text-red-600 transition-colors">SECURITY_CLEARANCE</h4>
                             <div className="space-y-6 text-slate-500 font-bold tracking-widest text-[9px]">
                                {[ 'Government Level Clearance', 'Advanced Tactical Driving', 'TCCC Medical Certified', 'SIA Close Protection' ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 justify-center break-inside-avoid page-break-inside-avoid">
                                        <ShieldCheck className="w-3 h-3 text-red-600/50" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </aside>

                    {/* MAIN CANVAS: OPERATIONAL MISSIONS */}
                    <main className="col-span-8 p-10 p-20 space-y-40 bg-[#1a1a1a]">
                        
                        {/* MISSIONS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={shieldVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-red-600/5 p-16 -mx-16 border-y border-red-600/20 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-black tracking-[2.5em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start">
                                    <ShieldAlert className="w-8 h-8 text-red-600" /> {t.experience}
                                </h2>
                                <div className="space-y-48">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-28 border-l border-white/5 hover:border-red-600 transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-1 h-32 bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_20px_#ef4444]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-3 flex-1">
                                                    <h3 className="text-4xl text-[5.5rem] font-black text-white tracking-widest italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-[2px] bg-red-600 group-hover:w-32 transition-all duration-1000" />
                                                        <p className="text-2xl font-black text-slate-800 tracking-[0.6em] group-hover:text-slate-200 transition-colors italic">MISSION: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-slate-900 border border-slate-800 px-10 py-3 group-hover:bg-red-600 transition-all italic tracking-[0.4em] shadow-2xl whitespace-nowrap">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-xl text-slate-600 leading-relaxed font-bold italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[30px] border-black pl-20 py-10 group-hover:text-slate-200 group-hover:border-red-600 bg-white/[0.01] transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* TACTICAL GEAR & HUB */}
                        <div className="grid grid-cols-2 gap-10">
                             <div className="p-16 border border-white/5 bg-black flex flex-col items-center justify-center group overflow-hidden relative">
                                <Car className="w-20 h-20 text-slate-800 group-hover:text-red-600 group-hover:scale-125 transition-all duration-1000" />
                                <h4 className="mt-8 text-[11px] font-black tracking-[1em] text-white/10 group-hover:text-white transition-colors">TACTICAL_DRIVE</h4>
                                <div className="mt-4 flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-6 h-1 bg-red-600/20 group-hover:bg-red-600 transition-all duration-700" style={{ transitionDelay: `${i*100}ms` }} />)}
                                </div>
                             </div>
                             <div className="p-16 border border-white/5 bg-black flex flex-col items-center justify-center group overflow-hidden relative">
                                <Cross className="w-20 h-20 text-slate-800 group-hover:text-red-600 group-hover:translate-y-[-10px] transition-all duration-1000" />
                                <h4 className="mt-8 text-[11px] font-black tracking-[1em] text-white/10 group-hover:text-white transition-colors">MED_TRAUMA_v5</h4>
                                <div className="mt-4 flex gap-1 items-end h-8">
                                    {[1, 2, 3, 4, 5].map(i => <motion.div key={i} animate={{ height: [10, 30, 10] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.1 }} className="w-2 bg-red-600/20 group-hover:bg-red-600" />)}
                                </div>
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE GUARDIAN FOOTER */}
                <footer className="w-full mt-40 py-24 px-10 px-24 bg-black text-white flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-red-600 shadow-[0_0_20px_#ef4444]" />
                    <div className="flex flex-col items-start gap-12 pt-10 relative z-10">
                         <div className="flex gap-2">
                             {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => <div key={i} className="w-1 h-12 bg-white/5 group-hover:bg-red-600 transition-all duration-1000 shadow-[0_0_20px_#ef4444]" style={{ opacity: i * 0.1 }} />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[20px] uppercase tracking-[1.5em] mb-4 text-white">{personal.fullName} // GUARD_NODE_v7.2</p>
                             <p className="text-[10px] uppercase tracking-[0.5em] italic opacity-20 italic">Vigilance // Protection // Absolute Integrity</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-white/5 group-hover:text-red-600 transition-all duration-1000 relative z-10 p-12 bg-white/5 border border-white/5 rounded-0 overflow-hidden shadow-2xl">
                         {[Share2, Globe, Shield, Lock].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -30, scale: 2, rotate: 360, color: '#ffffff' }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-all" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
