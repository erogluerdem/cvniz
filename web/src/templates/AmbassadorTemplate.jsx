import React from 'react';
import { Mail, Phone, MapPin, Shield, Globe, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Heart, ShieldCheck, PenTool, Layers, Flag, Landmark, Scale, MessageSquare, HeartHandshake } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function AmbassadorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#b8860b' // Matte Gold

    const t = {
        summary: isEn ? 'Diplomatic Vision & Philosophy' : 'Diplomatik Vizyon ve Felsefe',
        experience: isEn ? 'Diplomatic Postings & Missions' : 'Diplomatik Görevler ve Misyonlar',
        education: isEn ? 'Institutional Foundation' : 'Kurumsal Temel',
        expertise: isEn ? 'Diplomatic Capabilities' : 'Diplomatik Yetkinlikler',
        contact: isEn ? 'Embassy Access' : 'Büyükelçilik Erişimi',
        negotiations: isEn ? 'Key Negotiations & Treaties' : 'Temel Müzakereler ve Antlaşmalar'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
    }

    const entryVariants = {
        hidden: { opacity: 0, scale: 0.98, y: 10 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#0a192f] text-slate-200 p-0 selection:bg-[#b8860b] selection:text-black print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.7'
            }}>

            {/* INSTITUTIONAL OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#0a192f] shadow-[0_0_150px_rgba(0,0,0,0.5)] border-x border-white/5"
            >
                {/* 1. THE ENVOY HEADER */}
                <header className="w-full relative py-24 px-10 px-20 border-b-[8px] border-[#b8860b] bg-[#0d1e3a]">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div variants={entryVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#b8860b]/10 text-[#b8860b] text-[10px] font-black uppercase tracking-[0.6em] border border-[#b8860b]/30 italic">
                                <Landmark className="w-4 h-4" /> DIPLOMATIC_CORPS_OS_5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={entryVariants} 
                                    className="text-7xl text-[10rem] font-black text-white tracking-tighter leading-none uppercase italic"
                                    style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={entryVariants} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[2px] w-24 bg-[#b8860b]/30" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-[#b8860b] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['Ministry', 'UN', 'EU'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={entryVariants} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-slate-100 shadow-2xl relative group hover:scale-105 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#0a192f" />
                                    <div className="absolute -top-4 -right-4 bg-[#b8860b] text-white text-[8px] px-3 py-1 font-black italic rounded-sm shadow-lg">CREDENTIAL_SECURE</div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">REGISTRY_NODE: {personal.fullName?.split(' ')[0].toUpperCase()}_882</p>
                        </motion.div>
                    </div>

                    <motion.div variants={entryVariants} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-[#b8860b] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#b8860b]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-[#b8860b] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#b8860b]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#b8860b]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: MISSIONS & CAPABILITIES */}
                    <aside className="col-span-4 p-10 space-y-32 bg-[#0d1e3a]/50 border-r border-[#b8860b]/10">
                        
                        {/* DIPLOMATIC SUMMARY (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white/5 p-10 border-l-[10px] border-[#b8860b] shadow-2xl break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-6">
                                     <MessageSquare className="w-5 h-5 text-[#b8860b]" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-light italic leading-relaxed text-slate-300" style={{ fontFamily: "'EB Garamond', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* DIPLOMATIC CAPABILITIES (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-10">
                                    <Target className="w-5 h-5 text-[#b8860b]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-6 border border-white/5 bg-white/5 hover:border-[#b8860b]/30 transition-all cursor-default relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#b8860b] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* INSTITUTIONAL FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-black/20 border-y border-white/5 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-white/10 text-center italic mb-10">
                                     <GraduationCap className="w-10 h-10 mb-8 text-[#b8860b] mx-auto opacity-30" /> {t.education}
                                </h3>
                                <div className="space-y-16">
                                    {education.map((edu, i) => (
                                        <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[9px] font-black text-white/20 mb-6 tracking-[0.5em] italic uppercase">INST_STUDY_0{i + 1}</p>
                                            <h4 className="text-4xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform uppercase text-white" style={{ fontFamily: "'EB Garamond', serif" }}>{edu.degree}</h4>
                                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#b8860b]">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* NEGOTIATION BADGES */}
                        <div className="p-16 border-2 border-[#b8860b]/20 text-center group bg-[#b8860b]/5">
                             <h4 className="text-[11px] font-black uppercase tracking-[1.5em] text-white/10 mb-12 italic leading-none">{t.negotiations}</h4>
                             <div className="space-y-8 relative z-10 text-slate-500 group-hover:text-white transition-colors font-bold uppercase italic tracking-widest text-[9px]">
                                {[ 'G-20 Summit Delegation', 'Peace Envoy @ Geneve', 'Cross-Border Economic Treaty' ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 justify-center break-inside-avoid page-break-inside-avoid">
                                        <HeartHandshake className="w-4 h-4 text-[#b8860b]/50" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                             </div>
                             <div className="flex justify-center gap-10 mt-12 text-white/10 group-hover:text-[#b8860b] transition-all duration-[1s]">
                                {[Scale, Shield, Globe, Landmark].map((Icon, i) => <Icon key={i} className="w-8 h-8" />)}
                             </div>
                        </div>
                    </aside>

                    {/* MAIN CANVAS: DIPLOMATIC POSTINGS */}
                    <main className="col-span-8 p-10 p-24 space-y-40">
                        
                        {/* POSTINGS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={entryVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-white/5 p-16 -mx-16 rounded-[4rem] border border-white/5 shadow-2xl skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start">
                                    <Flag className="w-8 h-8 text-[#b8860b]" /> {t.experience}
                                </h2>
                                <div className="space-y-40">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l border-white/5 hover:border-[#b8860b] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute -left-[1.5px] top-0 w-2 h-24 bg-[#b8860b] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000 shadow-[0_0_20px_#b8860b]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-12">
                                                <div className="space-y-4">
                                                    <h3 className="text-5xl text-7xl font-black text-white tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none" style={{ fontFamily: "'EB Garamond', serif" }}>{exp.position}</h3>
                                                    <p className="text-2xl font-black text-[#b8860b] uppercase tracking-[0.5em] italic opacity-30 group-hover:opacity-100 transition-opacity">POST_ID: {exp.company}</p>
                                                </div>
                                                <div className="text-[11px] font-black text-black bg-[#b8860b] px-10 py-4 group-hover:bg-white transition-all whitespace-nowrap italic uppercase tracking-[0.4em] shadow-2xl">
                                                    {`${exp.startDate} > ${exp.endDate}`}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-500 leading-relaxed font-light italic opacity-90 group-hover:opacity-100 transition-opacity border-l-[12px] border-white/5 pl-16 py-8 group-hover:text-white group-hover:border-[#b8860b] bg-white/[0.01]">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* PROTOCOL MASTERY */}
                        <section className="p-20 bg-gradient-to-br from-[#0d1e3a] to-black border border-white/5 text-center group relative overflow-hidden transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                             <Landmark className="absolute -top-10 -right-10 w-64 h-64 text-white/5 group-hover:rotate-12 transition-transform duration-[4s]" />
                             <h4 className="text-[11px] font-black uppercase tracking-[1.5em] text-[#b8860b] mb-12 italic leading-none">{isEn ? 'PROTOCOL & SOVEREIGNTY MASTERY' : 'PROTOKOL VE EGEMENLİK USTALIĞI'}</h4>
                             <div className="space-y-6 relative z-10 text-white group-hover:text-[#b8860b] transition-colors">
                                <p className="text-4xl font-black italic leading-none uppercase" style={{ fontFamily: "'EB Garamond', serif" }}>Senior Delegate // Diplomatic Integrity Council</p>
                                <p className="text-2xl font-black italic leading-none uppercase opacity-30 group-hover:opacity-100 transition-opacity">Accredited by the Global Forum of Nations</p>
                             </div>
                             <div className="flex justify-center gap-16 mt-16 text-white/10 group-hover:text-white transition-all duration-[1s]">
                                {[Globe, ShieldCheck, Scale].map((Icon, i) => <Icon key={i} className="w-10 h-10" />)}
                             </div>
                        </section>
                    </main>
                </div>

                {/* THE ENVOY FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-24 border-t-8 border-[#b8860b] bg-[#0a192f] text-white flex flex-row justify-between items-center gap-24 group overflow-hidden relative">
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-2 h-16 bg-[#b8860b] group-hover:h-32 transition-all duration-[1s]" style={{ opacity: i * 0.12 }} />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[18px] uppercase tracking-[1.5em] mb-6 text-[#b8860b]">{personal.fullName} // DIP_CORE_OS_5.0</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-20 italic">Institutional Integrity // Strategic Diplomacy // Global Presence</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-white/5 group-hover:text-[#b8860b] transition-colors relative z-10 p-12 bg-white/5 border border-white/5 rounded-full backdrop-blur-3xl">
                         {[Share2, Globe, Landmark, ShieldCheck].map((Icon, i) => (
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
