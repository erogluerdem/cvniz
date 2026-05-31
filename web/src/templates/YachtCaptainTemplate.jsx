import React from 'react';
import { Mail, Phone, MapPin, Anchor, Navigation, Shield, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Wind, Droplets } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function YachtCaptainTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#c5a059' // Teak Gold

    const t = {
        summary: isEn ? 'Command Philosophy & Vision' : 'Komuta Felsefesi ve Vizyon',
        experience: isEn ? 'Vessel Command History & Charters' : 'Gemi Komuta Geçmişi ve Charterlar',
        education: isEn ? 'Maritime Studies & Formation' : 'Denizcilik Çalışmaları ve Formasyon',
        expertise: isEn ? 'Command & Navigation Mastery' : 'Komuta ve Navigasyon Ustalığı',
        contact: isEn ? 'Bridge Access' : 'Köprü Erişimi',
        vessels: isEn ? 'Commanded Fleet Registry' : 'Komuta Edilen Filo Kaydı'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const horizonVariants = {
        hidden: { scaleX: 0, opacity: 0 },
        visible: { scaleX: 1, opacity: 1, transition: { duration: 1, ease: "easeInOut" } }
    }

    return (
        <div className="min-h-full bg-[#0a1e3a] text-slate-200 p-0 selection:bg-[#c5a059] selection:text-black"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* NAUTICAL NAVIGATION OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '60px 60px' }} />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -right-1/2 w-full h-full border border-white/5 rounded-full"
                />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#0a1e3a] shadow-[0_0_150px_rgba(0,0,0,0.5)] border-x border-white/5"
            >
                {/* 1. THE SKIPPER HEADER */}
                <header className="w-full relative py-24 px-10 px-20 border-b-[6px] border-[#c5a059] bg-[#0c2445]">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#c5a059]/10 text-[#c5a059] text-[10px] font-black uppercase tracking-[0.6em] border border-[#c5a059]/30 italic">
                                <Anchor className="w-4 h-4" /> MARITIME_COMMAND_OS_5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl text-[10rem] font-black text-white tracking-tighter leading-none uppercase italic"
                                    style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-24 bg-[#c5a059]/30" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-[#c5a059] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['Master 3000GT', 'ECDIS', 'ISM'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-slate-100 shadow-2xl relative group hover:rotate-3 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#0a1e3a" />
                                    <div className="absolute -top-4 -right-4 bg-[#c5a059] text-white text-[8px] px-3 py-1 font-black italic shadow-lg">BRIDGE_AUTH</div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">REG_COMMANDER: {personal.fullName?.split(' ')[0].toUpperCase()}_NAV</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic font-mono">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#c5a059] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#c5a059]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#c5a059] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#c5a059]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#c5a059]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: NAVIGATION & COMPLIANCE */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#0c2445]/50 border-r border-[#c5a059]/10">
                        
                        {/* COMMAND PHILOSOPHY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white/5 p-10 border-l-[10px] border-[#c5a059] shadow-2xl">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-6">
                                     <Wind className="w-5 h-5 text-[#c5a059]" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-light italic leading-relaxed text-slate-300" style={{ fontFamily: "'EB Garamond', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* COMMAND MASTERY (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-10">
                                    <Navigation className="w-5 h-5 text-[#c5a059]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-6 border border-white/5 bg-white/5 hover:border-[#c5a059]/30 transition-all cursor-default relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#c5a059] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* MARITIME FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-black/20 border-y border-white/5">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-white/10 text-center italic mb-10">
                                     <GraduationCap className="w-10 h-10 mb-8 text-[#c5a059] mx-auto opacity-30" /> {t.education}
                                </h3>
                                <div className="space-y-16">
                                    {education.map((edu, i) => (
                                        <div key={i} className="text-center group/edu">
                                            <p className="text-[9px] font-black text-white/20 mb-6 tracking-[0.5em] italic uppercase">NAV_STUDY_0{i + 1}</p>
                                            <h4 className="text-4xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform uppercase text-white" style={{ fontFamily: "'EB Garamond', serif" }}>{edu.degree}</h4>
                                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#c5a059]">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* COMPLIANCE NODES */}
                        <div className="p-16 border-2 border-[#c5a059]/20 text-center group bg-[#c5a059]/5">
                             <h4 className="text-[11px] font-black uppercase tracking-[1.5em] text-white/10 mb-12 italic leading-none">{isEn ? 'SAFETY & COMPLIANCE SEAL' : 'GÜVENLİK VE UYUMLULUK MÜHÜRÜ'}</h4>
                             <div className="space-y-8 relative z-10 text-slate-400 group-hover:text-white transition-colors font-bold uppercase italic tracking-widest text-[9px]">
                                {[ 'GMDSS General Operator', 'Helideck Officer (HLO)', 'Advanced Fire Fighting', 'Medical First Aid @ Sea' ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 justify-center">
                                        <ShieldCheck className="w-4 h-4 text-[#c5a059]/50" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                             </div>
                             <div className="flex justify-center gap-10 mt-12 text-white/10 group-hover:text-[#c5a059] transition-all duration-[1s]">
                                {[Anchor, Shield, Globe, Droplets].map((Icon, i) => <Icon key={i} className="w-8 h-8" />)}
                             </div>
                        </div>
                    </aside>

                    {/* MAIN CANVAS: COMMAND HISTORY */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-[#0a1e3a]">
                        
                        {/* FLEET LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-white/5 p-16 -mx-16 rounded-[4rem] border border-white/5 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Briefcase className="w-8 h-8 text-[#c5a059]" /> {t.experience}
                                </h2>
                                <div className="space-y-40">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l border-white/5 hover:border-[#c5a059] transition-all duration-[1.5s]">
                                            <div className="absolute -left-[1.5px] top-0 w-2 h-24 bg-[#c5a059] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000 shadow-[0_0_20px_#c5a059]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-5xl text-7xl font-black text-white tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none" style={{ fontFamily: "'EB Garamond', serif" }}>{exp.position}</h3>
                                                    <p className="text-2xl font-black text-[#c5a059] uppercase tracking-[0.5em] italic opacity-30 group-hover:opacity-100 transition-opacity">VESSEL_REF: {exp.company}</p>
                                                </div>
                                                <div className="text-[11px] font-black text-black bg-[#c5a059] px-10 py-4 group-hover:bg-white transition-all whitespace-nowrap italic uppercase tracking-[0.4em] shadow-2xl">
                                                    {`${exp.startDate} > ${exp.endDate}`}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-400 leading-relaxed font-light italic opacity-90 group-hover:opacity-100 transition-opacity border-l-[12px] border-white/5 pl-16 py-8 group-hover:text-white group-hover:border-[#c5a059] bg-white/[0.01]">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FLEET REGISTRY GRID */}
                        <section className="p-20 bg-gradient-to-br from-[#0c2445] to-black border border-white/5 text-center group relative overflow-hidden transition-all duration-1000">
                             <motion.div animate={{ x: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-10 -right-10 w-64 h-64 text-white/5 group-hover:rotate-12 transition-transform duration-[4s]">
                                <Anchor className="w-full h-full" />
                             </motion.div>
                             <h4 className="text-[11px] font-black uppercase tracking-[1.5em] text-[#c5a059] mb-12 italic leading-none">{t.vessels}</h4>
                             <div className="space-y-6 relative z-10 text-white group-hover:text-[#c5a059] transition-colors">
                                <p className="text-4xl font-black italic leading-none uppercase" style={{ fontFamily: "'EB Garamond', serif" }}>MY 'LADY AQUA' // 85m Lürssen</p>
                                <p className="text-2xl font-black italic leading-none uppercase opacity-30 group-hover:opacity-100 transition-opacity">2023 - PRESENT // MEDITERRANEAN SERVICE</p>
                             </div>
                             <div className="flex justify-center gap-16 mt-16 text-white/10 group-hover:text-white transition-all duration-[1s]">
                                {[Globe, ShieldCheck, Target, Droplets].map((Icon, i) => <Icon key={i} className="w-10 h-10" />)}
                             </div>
                        </section>
                    </main>
                </div>

                {/* THE SKIPPER FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-24 border-t-8 border-[#c5a059] bg-[#0a1e3a] text-white flex flex-row justify-between items-center gap-24 group overflow-hidden relative">
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [40, 80, 40] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-2 h-16 bg-[#c5a059] opacity-20" />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[18px] uppercase tracking-[1.5em] mb-6 text-[#c5a059]">{personal.fullName} // NAV_CORE_OS_5.0</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-20 italic">Master Mariner // Global Navigation // Luxury Command</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-white/5 group-hover:text-[#c5a059] transition-colors relative z-10 p-12 bg-white/5 border border-white/5 rounded-full backdrop-blur-3xl">
                         {[Share2, Globe, Anchor, ShieldCheck].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -30, scale: 2, color: '#ffffff' }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-colors shadow-2xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
