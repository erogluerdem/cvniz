import React from 'react';
import { Mail, Phone, MapPin, Mic2, Music, Volume2, Radio, Headphones, Disc, Activity, Zap, Target, Globe, ArrowRight, Share2, Award, Briefcase, GraduationCap, Laptop, Waves } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function VoiceOverTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#fbbf24' // Studio Gold

    const t = {
        summary: isEn ? 'The Vocal Profile' : 'Vokal Profil',
        experience: isEn ? 'Audio Credits & Roles' : 'Seslendirme Kredileri ve Roller',
        education: isEn ? 'Performance Training' : 'Performans Eğitimi',
        expertise: isEn ? 'Vocal Capabilities' : 'Vokal Yetkinlikler',
        contact: isEn ? 'Studio Access' : 'Stüdyo Erişimi',
        specs: isEn ? 'Home Studio Specifications' : 'Ev Stüdyosu Özellikleri',
        attributes: isEn ? 'Vocal Attributes & Tones' : 'Vokal Özellikler ve Tonlar'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const soundVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }

    return (
        <div className="min-h-full bg-[#020617] text-[#94a3b8] p-0 selection:bg-[#fbbf24] selection:text-black"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.6'
            }}>

            {/* WAVEFORM BACKGROUND OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-0 overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-[300px] flex items-center justify-center gap-2 px-10 -translate-y-1/2">
                    {[...Array(50)].map((_, i) => (
                        <motion.div 
                            key={i}
                            animate={{ height: ['20%', '80%', '40%', '100%', '20%'] }}
                            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full bg-[#fbbf24] rounded-full"
                        />
                    ))}
                </div>
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#020617]/80 backdrop-blur-xl shadow-[0_0_150px_rgba(251,191,36,0.05)] border-x border-white/5"
            >
                {/* 1. THE SIGNATURE HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-white/5 bg-gradient-to-b from-[#0f172a] to-transparent">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-10 text-left">
                            <motion.div variants={soundVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#fbbf24] text-black text-[10px] font-black uppercase tracking-[0.6em] rounded-full italic shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                                <Volume2 className="w-4 h-4" /> VO_TALENT_CORE_v.5
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={soundVariants} 
                                    className="text-7xl text-[9rem] font-black text-white tracking-tighter leading-none uppercase italic"
                                    style={{ letterSpacing: '-0.06em', fontFamily: "'Outfit', sans-serif" }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={soundVariants} className="flex flex-wrap items-center gap-8 justify-start">
                                     <p className="text-3xl font-black tracking-[0.4em] text-[#fbbf24] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-4">
                                        {['Tenor', 'Deep', 'Smooth'].map(t => (
                                            <span key={t} className="px-3 py-1 border border-[#fbbf24]/30 text-[10px] font-black text-[#fbbf24] uppercase tracking-widest rounded-sm">{t}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={soundVariants} className="flex flex-col items-center items-end gap-12">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-3xl group hover:scale-110 hover:border-[#fbbf24]/50 transition-all duration-700 shadow-2xl relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#ffffff" />
                                    <div className="absolute -top-4 -right-4 bg-[#fbbf24] text-black text-[8px] px-3 py-1 font-black italic rounded-full shadow-lg">VO_REEL</div>
                                </div>
                             )}
                             <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(i => <motion.div key={i} animate={{ scaleY: [1, 2.5, 1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1 }} className="w-1.5 h-8 bg-[#fbbf24]/20 rounded-full" />)}
                             </div>
                        </motion.div>
                    </div>

                    <motion.div variants={soundVariants} className="flex flex-wrap justify-start items-center gap-12 mt-16 text-[11px] font-black uppercase tracking-[0.5em] text-white/30" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {personal.email && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#fbbf24]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#fbbf24]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#fbbf24]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-white/5 flex-1 bg-[#020617]/50">
                    
                    {/* LEFT CANVAS: ATTRIBUTES & SPECS */}
                    <aside className="col-span-4 p-10 space-y-24 border-r border-white/5 bg-[#0f172a]/30">
                        
                        {/* VOCAL ATTRIBUTES */}
                        <section className="space-y-10 group">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/10 flex items-center gap-4 italic mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                <Waves className="w-5 h-5 text-[#fbbf24]" /> {t.attributes}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: isEn ? 'Primary Tone' : 'Temel Ton', val: 'Warm & Authoritative' },
                                    { label: isEn ? 'Pitch Range' : 'Perde Aralığı', val: 'Bass-Baritone' },
                                    { label: isEn ? 'Delivery' : 'Teslimat', val: 'Professional / Narrated' }
                                ].map((attr, i) => (
                                    <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-[#fbbf24]/5 transition-all">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{attr.label}</p>
                                        <p className="text-lg font-black text-white italic leading-tight">{attr.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* STUDIO SPECS */}
                        <section className="p-8 bg-black/40 border border-[#fbbf24]/10 rounded-3xl relative overflow-hidden group">
                             <Laptop className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 group-hover:scale-125 transition-transform duration-[4s]" />
                             <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-[#fbbf24] mb-12 italic relative z-10">{t.specs}</h3>
                             <div className="space-y-6 relative z-10 font-mono text-[11px]">
                                <div className="flex items-center gap-4 text-white/60"><Mic2 className="w-4 h-4 text-[#fbbf24]" /> Neumann U87 Ai</div>
                                <div className="flex items-center gap-4 text-white/60"><Headphones className="w-4 h-4 text-[#fbbf24]" /> Apollo Twin X</div>
                                <div className="flex items-center gap-4 text-white/60"><Zap className="w-4 h-4 text-[#fbbf24]" /> Logic Pro X / Izotope</div>
                                <div className="flex items-center gap-4 text-white/60"><Globe className="w-4 h-4 text-[#fbbf24]" /> Source Connect / IpDTL</div>
                             </div>
                        </section>

                        {/* CAPABILITIES (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.8em] text-white/10 flex items-center gap-4 italic mb-8" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                                    <Target className="w-5 h-5 text-[#fbbf24]" /> {t.expertise}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-5 py-2 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-[#fbbf24] hover:border-[#fbbf24] transition-all cursor-default">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: CREDITS & ROLES */}
                    <main className="col-span-8 p-10 p-20 space-y-40">
                        
                        {/* AUDIO CREDITS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={soundVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#fbbf24]/5 p-16 -mx-16 rounded-[4rem] border border-[#fbbf24]/10 shadow-[0_0_50px_rgba(251,191,36,0.05)]' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[1.5em] text-white/10 mb-24 flex items-center gap-10 italic leading-none justify-start">
                                    <Disc className="w-8 h-8 text-[#fbbf24]" /> {t.experience}
                                </h2>
                                <div className="space-y-32">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l border-white/5 hover:border-[#fbbf24] transition-all duration-[1.5s]">
                                            <div className="absolute -left-[1.5px] top-0 w-1 h-24 bg-[#fbbf24] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-1000 shadow-[0_0_20px_#fbbf24]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-8 gap-10">
                                                <div className="space-y-4">
                                                    <h3 className="text-5xl text-6xl font-black text-white tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none" style={{ fontFamily: "'Outfit', sans-serif" }}>{exp.position}</h3>
                                                    <p className="text-xl font-black text-[#fbbf24] uppercase tracking-[0.4em] italic opacity-30 group-hover:opacity-100 transition-opacity">PROD: {exp.company}</p>
                                                </div>
                                                <div className="font-mono text-[10px] font-black text-[#fbbf24] bg-[#fbbf24]/10 px-6 py-2 border border-[#fbbf24]/20 rounded-full group-hover:bg-[#fbbf24] group-hover:text-black transition-all italic tracking-widest">
                                                    [{exp.startDate} – {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-white/30 leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity border-l border-white/5 pl-16 py-4 group-hover:text-white group-hover:border-[#fbbf24] bg-white/[0.01]">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* EDUCATION & STUDIES */}
                        {education.length > 0 && (
                            <section className="p-16 border-2 border-dashed border-white/5 bg-black/20 group hover:border-[#fbbf24]/50 transition-all duration-700">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-white/20 mb-16 flex items-center justify-center gap-10 italic leading-none">
                                     <GraduationCap className="w-8 h-8 text-[#fbbf24]" /> {t.education}
                                </h3>
                                <div className="grid grid-cols-2 gap-16">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center">
                                            <p className="text-[9px] font-black text-white/20 mb-4 group-hover:text-[#fbbf24] transition-colors tracking-[0.5em] italic uppercase">ACADEMY_LOG_0{i + 1}</p>
                                            <h4 className="text-4xl font-black italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform uppercase leading-none text-white">{edu.degree}</h4>
                                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#fbbf24] group-hover:text-white transition-colors">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>

                {/* THE SIGNATURE FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-20 border-t border-white/5 bg-[#0a0f1e] text-white flex flex-row justify-between items-center gap-24 group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent shadow-[0_0_20px_#fbbf24]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.2, repeat: Infinity, duration: 1.5 }} className="w-1.5 h-16 bg-[#fbbf24]" />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[20px] uppercase tracking-[1.5em] mb-6 text-[#fbbf24] shadow-[#fbbf24]">{personal.fullName} // VOC_CORE_OS_5.0</p>
                             <p className="text-[11px] uppercase tracking-[0.5em] italic opacity-20">Vocal Innovation // Sonic Integrity // Global Resonance</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-white/5 group-hover:text-[#fbbf24] transition-colors relative z-10 p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-3xl">
                         {[Share2, Globe, Music, Volume2].map((Icon, i) => (
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
