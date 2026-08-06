import React from 'react';
import { Mail, Phone, MapPin, Plane, Navigation, Shield, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Wind, Activity, Clock, Map } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PrivateJetPilotTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#ff6600' // Safety Orange

    const t = {
        summary: isEn ? 'The Aviator\'s Log & Vision' : 'Havacı Günlüğü ve Vizyon',
        experience: isEn ? 'Operational Flight History' : 'Operasyonel Uçuş Geçmişi',
        education: isEn ? 'Aeronautical Formation' : 'Havacılık Formasyonu',
        expertise: isEn ? 'Flight Deck Command & Technicals' : 'Kokpit Komutası ve Teknikler',
        contact: isEn ? 'Flight Ops Access' : 'Uçuş Operasyon Erişimi',
        matrix: isEn ? 'Flight Hour Matrix' : 'Uçuş Saati Matrisi',
        ratings: isEn ? 'Type Rating Ledger' : 'Tip Yetki Defteri'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const hudVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#0a0f16] text-slate-500 p-0 selection:bg-[#ff6600] selection:text-black font-mono uppercase print-exact mx-auto print:mx-0"
            style={{
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                lineHeight: '1.6'
            }}>

            {/* HIGH-ALTITUDE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#1e3a8a]/20 to-transparent" />
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#ffffff03 1px, transparent 1px), linear-gradient(90deg, #ffffff03 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#0a0f16] border-x border-slate-800"
            >
                {/* 1. THE AVIATOR HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b border-slate-800 bg-[#0d141d] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff6600] to-transparent animate-pulse" />
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-10 text-left">
                            <motion.div variants={hudVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#ff6600]/10 text-[#ff6600] text-[10px] font-bold tracking-[0.6em] border border-[#ff6600]/30 italic">
                                <Activity className="w-4 h-4 animate-pulse" /> FLIGHT_DECK_REGISTRY_v5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={hudVariants} 
                                    className="text-6xl text-[8rem] font-bold text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={hudVariants} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-20 bg-slate-700" />
                                     <p className="text-2xl font-bold tracking-[0.4em] text-slate-300">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['ATP', 'G650', 'FALCON'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-slate-500 tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={hudVariants} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-slate-900 border border-slate-800 shadow-2xl skew-x-[-10deg] group hover:skew-x-0 transition-all duration-700 relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#ff6600" />
                                    <div className="absolute -top-4 -left-4 bg-[#ff6600] text-black text-[8px] px-3 py-1 font-bold italic shadow-lg">DATA_LINK_SEC_A</div>
                                </div>
                             )}
                             <div className="flex flex-col items-end gap-2 text-slate-800 font-bold group hover:text-[#ff6600] transition-colors">
                                <Navigation className="w-16 h-16 group-hover:rotate-45 transition-transform" />
                             </div>
                        </motion.div>
                    </div>

                    <motion.div variants={hudVariants} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-bold tracking-[0.4em] text-white/30 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#ff6600] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#ff6600]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#ff6600] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#ff6600]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#ff6600]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: INSTRUMENTS & RATINGS */}
                    <aside className="col-span-4 p-10 space-y-24 bg-[#0d141d]/50 border-r border-slate-800">
                        
                        {/* AVIATOR SUMMARY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-slate-900 border border-slate-800 p-10 relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <Wind className="w-6 h-6 text-[#ff6600]" />
                                </div>
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8">
                                     <Map className="w-5 h-5 text-[#ff6600]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-bold leading-relaxed text-slate-500 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* FLIGHT HOUR MATRIX */}
                        <section className="bg-[#ff6600]/10 border border-[#ff6600]/30 p-10 space-y-12 relative overflow-hidden group break-inside-avoid page-break-inside-avoid">
                             <h4 className="text-[11px] font-bold tracking-[0.6em] text-[#ff6600] mb-10 italic leading-none">{t.matrix}</h4>
                             <div className="grid grid-cols-2 gap-10">
                                {[
                                    { label: 'Total Time', val: '8,500' },
                                    { label: 'PIC Hours', val: '4,200' },
                                    { label: 'Multi-Jet', val: '3,800' },
                                    { label: 'Night/Inst', val: '1,500' }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-2 break-inside-avoid page-break-inside-avoid">
                                        <p className="text-3xl font-bold text-white tracking-tighter italic">{stat.val}</p>
                                        <p className="text-[9px] font-bold tracking-widest text-[#ff6600]/50">{stat.label}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* DECK COMPETENCIES (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-bold tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8">
                                    <Target className="w-5 h-5 text-[#ff6600]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="p-4 bg-slate-900 border border-slate-800 text-[10px] font-bold tracking-[0.2em] text-slate-500 hover:text-white hover:border-[#ff6600] transition-all cursor-default flex items-center gap-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="w-1.5 h-1.5 bg-[#ff6600] opacity-20" /> {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CLEARANCE NODES */}
                        <div className="p-10 border-2 border-slate-800 text-center group bg-black">
                             <h4 className="text-[11px] font-bold tracking-[1.5em] text-slate-700 mb-10 italic leading-none">{t.ratings}</h4>
                             <div className="space-y-6 text-slate-500 font-bold tracking-widest text-[9px]">
                                {[ 'Gulfstream G650ER', 'Bombardier Global 7500', 'Falcon 8X / Dassault', 'NextGen Nav Certified' ].map((item, i) => (
                                    <p key={i} className="group-hover:text-white transition-colors">TYPE_AUTH_0{i + 1} :: {item}</p>
                                ))}
                             </div>
                             <div className="flex justify-center gap-10 mt-12 text-slate-800 group-hover:text-[#ff6600] transition-all duration-[1s]">
                                {[Airplay, Clock, ShieldCheck, Plane].map((Icon, i) => <Icon key={i} className="w-8 h-8" />)}
                             </div>
                        </div>
                    </aside>

                    {/* MAIN CANVAS: OPERATIONAL LOG */}
                    <main className="col-span-8 p-10 p-20 space-y-40 bg-[#0a0f16]">
                        
                        {/* FLIGHT LOG (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={hudVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#ff6600]/5 p-16 -mx-16 border border-[#ff6600]/20 shadow-[0_0_80px_rgba(255,102,0,0.05)]' : ''}`}>
                                <h2 className="text-[11px] font-bold tracking-[2em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start uppercase">
                                    <Clock className="w-8 h-8 text-[#ff6600]" /> {t.experience}
                                </h2>
                                <div className="space-y-40">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l-2 border-slate-800 hover:border-[#ff6600] transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute -left-[1.5px] top-0 w-2 h-24 bg-[#ff6600] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_20px_#ff6600]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-10 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-4xl text-6xl font-bold text-white tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <p className="text-xl font-bold text-[#ff6600] tracking-[0.4em] italic opacity-30 group-hover:opacity-100 transition-opacity">AGENCY_CORP: {exp.company}</p>
                                                </div>
                                                <div className="text-[11px] font-bold text-black bg-[#ff6600] px-10 py-3 skew-x-[-15deg] group-hover:skew-x-0 transition-all whitespace-nowrap italic tracking-[0.4em] shadow-2xl">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-xl text-slate-500 leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity border-l border-slate-800 pl-16 py-8 group-hover:text-slate-200 group-hover:border-[#ff6600] bg-white/[0.01] rounded-r-3xl">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-16 border-2 border-slate-800 bg-black text-center group hover:border-[#ff6600] transition-all duration-700 relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute -bottom-10 -right-10 w-48 h-48 border-[4px] border-dashed border-white/5" />
                                 <h3 className="text-[11px] font-bold tracking-[1em] text-white/10 text-center italic mb-16 flex items-center justify-center gap-10 leading-none">
                                     <GraduationCap className="w-10 h-10 mb-8 text-[#ff6600] mx-auto opacity-30 group-hover:opacity-100 transition-all" /> {t.education}
                                </h3>
                                <div className="space-y-16 relative z-10">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[9px] font-bold text-slate-500 mb-6 group-hover:text-[#ff6600] transition-colors tracking-[0.5em] italic">ACADEMIC_LOG_#0{i + 1}</p>
                                            <h4 className="text-4xl font-bold italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform text-white">{edu.degree}</h4>
                                            <p className="text-[12px] font-bold tracking-[0.3em] text-[#ff6600]/60">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>

                {/* THE AVIATOR FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-16 border-t border-slate-800 bg-[#0d141d] text-slate-600 flex flex-row justify-between items-center gap-16 group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-[#ff6600] to-transparent shadow-[0_0_20px_#ff6600]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [2, 16, 2], backgroundColor: ['#1e3a8a', '#ff6600', '#1e3a8a'] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-6 h-1 rounded-full" />)}
                        </div>
                        <div className="text-left font-bold">
                             <p className="text-[20px] tracking-[1.5em] mb-6 text-white">{personal.fullName} // AVI_CORE_OS_v5</p>
                             <p className="text-[11px] tracking-[0.4em] italic opacity-40">Absolute Control // Executive Security // Global Reach</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-slate-800 group-hover:text-[#ff6600] transition-colors relative z-10 p-12 bg-slate-900 border border-slate-800 rounded-[2rem]">
                         {[Share2, Globe, Plane, Shield].map((Icon, i) => (
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
