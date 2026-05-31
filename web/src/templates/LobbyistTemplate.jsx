import React from 'react';
import { Mail, Phone, MapPin, Building, Shield, FileCheck, Users, Share2, Globe, ArrowRight, Zap, Target, Star, ShieldCheck, Landmark, Scale, Briefcase, GraduationCap, Award, Fingerprint, Network, Link2, HeartHandshake, BarChart3, TrendingUp, Users2, Landmark as House, Globe2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function LobbyistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#10b981' // Impact Emerald

    const t = {
        summary: isEn ? 'Influence Strategy' : 'Etki Stratejisi / Özet',
        experience: isEn ? 'Advocacy Portfolio' : 'Savunuculuk Portföyü',
        education: isEn ? 'Policy Doctrine' : 'Politika Doktrini ve Eğitim',
        expertise: isEn ? 'Stakeholder Network & Intel' : 'Paydaş Ağı ve İstihbarat',
        contact: isEn ? 'Discrete Liaison' : 'Gizli İrtibat',
        lingo: isEn ? 'Diplomatic Protocol' : 'Diplomatik Protokol'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
    }

    const powerVariants = {
        hidden: { opacity: 0, x: -20, filter: 'blur(10px)' },
        visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] } }
    }

    return (
        <div className="min-h-full bg-[#0a0a0a] text-[#f8fafc] p-0 selection:bg-[#10b981] selection:text-white"
            style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.6'
            }}>

            {/* CORPORATE GRID OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1200px] mx-auto min-h-[297mm] relative overflow-hidden flex flex-col bg-[#0a0a0a] border-x border-[#ffffff05]"
            >
                {/* 1. THE POWER BROKER HEADER */}
                <header className="w-full relative py-20 px-10 px-24 bg-gradient-to-br from-[#121212] to-[#0a0a0a] border-b border-[#ffffff10] flex flex-row justify-between items-end gap-16">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                         <Network className="w-80 h-80 text-[#10b981] animate-pulse" />
                    </div>
                    
                    <div className="flex-1 space-y-10 relative z-10">
                        <motion.div variants={powerVariants} className="inline-flex items-center gap-4 px-5 py-2 bg-[#10b981]/10 text-[#10b981] text-[10px] font-black uppercase tracking-[0.5em] border border-[#10b981]/20">
                            <ShieldCheck className="w-4 h-4" /> STRATEGIC_ACCESS_v.5
                        </motion.div>
                        
                        <div className="space-y-4">
                            <motion.h1 variants={powerVariants} className="text-6xl text-6xl font-black text-white tracking-tighter leading-none uppercase italic">
                                {personal.fullName}
                            </motion.h1>
                            <motion.div variants={powerVariants} className="flex items-center gap-6">
                                 <div className="h-0.5 w-16 bg-[#10b981] shadow-[0_0_15px_#10b981]" />
                                 <p className="text-2xl font-bold tracking-[0.3em] text-[#f8fafc]/40 uppercase">
                                    {personal.title}
                                 </p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center items-end gap-10 relative z-10">
                        {personal.photo ? (
                            <motion.div variants={powerVariants} className="w-48 h-48 bg-white/5 p-1 border border-[#ffffff10] grayscale hover:grayscale-0 transition-all duration-[1.5s] relative group overflow-hidden">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-40" />
                            </motion.div>
                        ) : (
                            <motion.div variants={powerVariants} className="w-40 h-40 border border-[#ffffff10] flex items-center justify-center p-8 group">
                                 <HeartHandshake className="w-full h-full text-white/5 group-hover:text-[#10b981]/40 transition-colors duration-1000" />
                            </motion.div>
                        )}
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10b981] flex items-center gap-4">
                             STATUS: ACTIVE <div className="w-2 h-2 bg-[#10b981] rounded-full animate-ping" />
                        </div>
                    </div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-[#ffffff05]">
                    
                    {/* LEFT CHANNEL (STRATEGY & NETWORK) */}
                    <div className="col-span-4 p-8 p-16 space-y-24 border-r border-[#ffffff05] bg-[#121212]/30">
                        {/* INFLUENCE STRATEGY (SUMMARY) */}
                        {personal.summary && (
                            <motion.section variants={powerVariants} className="group relative border-l-2 border-[#10b981]/20 pl-8 hover:border-[#10b981] transition-all duration-700">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-[#10b981] mb-8">{t.summary}</h2>
                                <p className="text-xl text-2xl font-medium leading-relaxed text-[#f8fafc]/60 group-hover:text-white transition-colors">
                                    {personal.summary}
                                </p>
                            </motion.section>
                        )}

                        {/* DISCRETE LIAISON (CONTACT) */}
                        <section className="space-y-10 pt-10 border-t border-[#ffffff05]">
                             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-4">
                                 <Link2 className="w-4 h-4" /> {t.contact}
                             </h3>
                             <div className="space-y-6 text-[12px] font-bold uppercase tracking-widest text-[#f8fafc]/40">
                                 {personal.email && <div className="flex items-center gap-4 hover:text-[#10b981] transition-colors cursor-pointer"><Mail className="w-4 h-4 opacity-40" /> {personal.email}</div>}
                                 {personal.phone && <div className="flex items-center gap-4 hover:text-[#10b981] transition-colors cursor-pointer"><Phone className="w-4 h-4 opacity-40" /> {personal.phone}</div>}
                             </div>
                             {theme?.showQrCode && (
                                <div className="mt-12 p-4 bg-white invert relative group hover:invert-0 transition-all duration-700 w-fit rounded-sm">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={120} color="#000" />
                                </div>
                             )}
                        </section>

                        {/* STAKEHOLDER NETWORK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-8 pt-10 border-t border-[#ffffff05]">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-4">
                                    <Globe2 className="w-4 h-4" /> {t.expertise}
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-4 py-2 border border-[#ffffff10] text-[10px] font-black uppercase tracking-widest hover:border-[#10b981] hover:text-[#10b981] transition-all cursor-default">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* MAIN CHANNEL (ADVOCACY) */}
                    <div className="col-span-8 p-8 p-16 space-y-24">
                        {experience.length > 0 && (
                            <motion.section variants={powerVariants} className={`transition-all duration-700 ${highlightedField === 'experience' ? 'bg-[#10b981]/05 p-12 -mx-12 border-y border-[#10b981]/10' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[1em] text-white/10 mb-20 flex items-center gap-10 leading-none">
                                    <TrendingUp className="w-6 h-6 text-[#10b981]" /> {t.experience}
                                </h2>
                                <div className="space-y-32">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-12 border-l border-[#ffffff05] hover:border-[#10b981] transition-all duration-1000">
                                            <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-[#10b981] scale-0 group-hover:scale-100 transition-transform duration-500 shadow-[0_0_10px_#10b981]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-6 gap-10">
                                                <div className="space-y-2">
                                                    <h3 className="text-3xl text-4xl font-black text-[#f8fafc]/80 tracking-tighter uppercase group-hover:text-white transition-colors leading-[0.9]">{exp.position}</h3>
                                                    <p className="text-[12px] font-black text-[#10b981] uppercase tracking-[0.4em] italic flex items-center gap-4">
                                                        <House className="w-4 h-4" /> {exp.company}
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-black text-[#f8fafc]/40 border border-[#ffffff10] px-6 py-2 uppercase tracking-widest italic group-hover:bg-[#10b981] group-hover:text-white transition-all">
                                                    {exp.startDate} – {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-lg text-[#f8fafc]/40 leading-relaxed font-medium uppercase tracking-tight group-hover:text-[#f8fafc]/80 transition-colors">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* POLICY DOCTRINE (EDUCATION) */}
                        {education.length > 0 && (
                            <section className={`p-10 border border-[#ffffff05] bg-white text-black transition-all duration-[1.5s] ${highlightedField === 'education' ? 'ring-[20px] ring-[#10b981] shadow-2xl skew-y-1' : ''}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40 mb-16 border-b border-black/10 pb-6 text-center">
                                     {t.education}
                                </h3>
                                <div className="grid grid-cols-2 gap-16">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center border-l border-black/05 pl-8">
                                            <p className="text-[9px] font-black text-black/20 mb-4 tracking-[0.4em] uppercase">ACCRED_LOG_0{i + 1}</p>
                                            <h4 className="text-2xl font-black tracking-tighter leading-none mb-2 uppercase">{edu.degree}</h4>
                                            <p className="text-[11px] font-black uppercase tracking-widest opacity-40">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* THE POWER BROKER FOOTER */}
                <footer className="w-full mt-auto py-24 px-10 px-24 bg-gradient-to-t from-black to-[#0a0a0a] flex flex-row justify-between items-center gap-16 group">
                    <div className="flex flex-col items-start gap-10">
                         <div className="flex gap-1.5">
                             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="w-1.5 h-12 bg-[#10b981]" style={{ opacity: i * 0.1, height: `${i * 8}px`, transform: `skewX(${i * 2}deg)` }} />)}
                        </div>
                        <div className="text-left font-black tracking-widest">
                             <p className="text-[16px] uppercase tracking-[1em] mb-4 text-[#10b981] transition-colors group-hover:text-white leading-none">{personal.fullName} // BROKER_CORE_v.5</p>
                             <p className="text-[10px] uppercase tracking-[0.5em] italic opacity-20">Strategic Advantage // Discrete Advocacy // Results Driven</p>
                        </div>
                    </div>
                    <div className="flex gap-12 text-[#ffffff10] group-hover:text-[#10b981] transition-colors">
                         {[Users2, BarChart3, Globe2, Shield].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -30, scale: 2, color: '#fff' }}>
                                 <Icon className="w-8 h-8 cursor-pointer transition-colors" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
