import React from 'react';
import { Mail, Phone, MapPin, Building, Shield, FileCheck, Users, Share2, Globe, ArrowRight, Zap, Target, Star, ShieldCheck, Landmark, Scale, Briefcase, GraduationCap, Award, Fingerprint, Flag, Heart, Megaphone, Vote, History, Landmark as House } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PoliticianTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#0f172a' // Statesman Navy

    const t = {
        summary: isEn ? 'The People\'s Mandate' : 'Halkın Yetkisi / Vizyon',
        experience: isEn ? 'Legislative & Public Record' : 'Yasama ve Kamu Hizmeti Kaydı',
        education: isEn ? 'Foundational Doctrine' : 'Temel Doktrin ve Eğitim',
        expertise: isEn ? 'Diplomatic & Strategic Pillars' : 'Diplomatik ve Stratejik Sütunlar',
        contact: isEn ? 'Constituent Liaison' : 'Seçmen İrtibat Hattı',
        lingo: isEn ? 'Global Dialogue' : 'Küresel Diyalog'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } }
    }

    const formalVariants = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    }

    const flagVariants = {
        animate: {
            x: [0, 5, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div className="min-h-full bg-[#fcfcf9] text-[#0f172a] p-0 selection:bg-[#7f1d1d] selection:text-white"
            style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '1rem' : theme?.fontSize === 'Büyük' ? '1.25rem' : '1.1rem',
                lineHeight: '1.8'
            }}>

            {/* INSTITUTIONAL WATERMARK */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
                 style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative overflow-hidden flex flex-col bg-[#fcfcf9] shadow-[0_40px_100px_rgba(15,23,42,0.1)] border-x border-[#0f172a10]"
            >
                {/* 1. THE STATESMAN HEADER */}
                <header className="w-full relative py-24 px-10 px-24 bg-[#0f172a] text-white border-b-8 border-[#a47e3c]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
                         <House className="w-96 h-96 text-white" />
                    </div>
                    
                    <div className="flex flex-row gap-20 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12">
                            <motion.div variants={formalVariants} className="flex gap-4">
                                <motion.div variants={flagVariants} animate="animate" className="w-12 h-6 bg-[#7f1d1d] shadow-lg" />
                                <motion.div variants={flagVariants} animate="animate" className="w-12 h-6 bg-white shadow-lg" />
                                <motion.div variants={flagVariants} animate="animate" className="w-12 h-6 bg-[#1e40af] shadow-lg" />
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 variants={formalVariants} className="text-7xl text-[9rem] font-black text-white tracking-tighter leading-none uppercase">
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={formalVariants} className="flex items-center gap-10">
                                     <div className="h-0.5 flex-1 bg-gradient-to-r from-[#a47e3c] to-transparent" />
                                     <p className="text-3xl font-bold tracking-[0.5em] text-[#a47e3c] uppercase italic">
                                        {personal.title}
                                     </p>
                                </motion.div>
                            </div>
                        </div>

                        {personal.photo ? (
                            <motion.div variants={formalVariants} className="shrink-0 relative">
                                <div className="w-64 h-80 border-[10px] border-white/5 shadow-2xl skew-x-1 relative overflow-hidden group">
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover sepia-[0.2] contrast-110 group-hover:sepia-0 transition-all duration-1000" />
                                    <div className="absolute inset-0 bg-[#0f172a]/5 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#a47e3c] rounded-full flex items-center justify-center border-4 border-[#0f172a] shadow-2xl">
                                     <Vote className="w-10 h-10 text-white" />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div variants={formalVariants} className="w-64 h-80 bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center group">
                                 <Landmark className="w-24 h-24 text-white/10 group-hover:text-white/40 transition-colors duration-1000" />
                            </motion.div>
                        )}
                    </div>

                    <motion.div variants={formalVariants} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[12px] font-bold uppercase tracking-[0.4em] text-white/40 italic">
                        {personal.email && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-[#a47e3c] pb-2">{personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-[#a47e3c] pb-2">{personal.phone}</div>}
                        {personal.location && <div className="pb-2">{personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0">
                    
                    {/* LEFT COLUMN (THE PLATFORM) */}
                    <div className="col-span-8 p-10 p-24 space-y-40 border-r border-[#0f172a05]">
                        
                        {/* THE MANDATE (SUMMARY) */}
                        {personal.summary && (
                            <motion.section variants={formalVariants} className="group relative">
                                <div className="flex items-center gap-10 mb-16">
                                     <Megaphone className="w-8 h-8 text-[#a47e3c]" />
                                     <h2 className="text-[11px] font-bold uppercase tracking-[0.8em] text-[#0f172a]/20 italic">{t.summary}</h2>
                                     <div className="flex-1 h-px bg-[#0f172a05]" />
                                </div>
                                <p className="text-3xl text-5xl font-light italic leading-relaxed text-[#0f172a] text-justify first-letter:text-7xl first-letter:font-black first-letter:text-[#a47e3c] first-letter:float-left first-letter:mr-8 first-letter:mt-4">
                                    {personal.summary}
                                </p>
                            </motion.section>
                        )}

                        {/* LEGISLATIVE RECORD (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={formalVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#fcf8ef] p-16 -mx-16 rounded shadow-inner' : ''}`}>
                                <h2 className="text-[11px] font-bold uppercase tracking-[1em] text-[#0f172a]/20 mb-24 flex items-center gap-10 italic leading-none">
                                    <History className="w-8 h-8 text-[#0f172a]" /> {t.experience}
                                </h2>
                                <div className="space-y-48">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-28 border-l-2 border-[#a47e3c10] hover:border-[#a47e3c] transition-all duration-1000">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#a47e3c] group-hover:bg-[#a47e3c] transition-all shadow-lg" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-12 gap-10">
                                                <div className="space-y-4">
                                                    <h3 className="text-4xl text-6xl font-black text-[#0f172a] tracking-tight group-hover:translate-x-10 transition-transform duration-1000 leading-none italic">{exp.position}</h3>
                                                    <p className="text-xl font-bold text-[#a47e3c] uppercase tracking-[0.5em] italic flex items-center gap-6">
                                                        <Landmark className="w-6 h-6" /> {exp.company}
                                                    </p>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-[#0f172a] px-10 py-5 rounded-full shadow-[0_15px_30px_rgba(15,23,42,0.2)] whitespace-nowrap italic uppercase tracking-widest leading-none">
                                                    TERM_{exp.startDate} – {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-[#0f172a]/70 leading-relaxed font-light italic group-hover:text-[#0f172a] transition-colors first-letter:font-bold">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* RIGHT COLUMN (PILLARS) */}
                    <aside className="col-span-4 p-12 space-y-40 bg-[#0f172a]/05">
                        
                        {/* STRATEGIC PILLARS (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="bg-white p-12 border border-[#0f172a05] shadow-2xl group relative overflow-hidden">
                                <Vote className="absolute -top-10 -left-10 w-48 h-48 text-[#a47e3c]/05 group-hover:rotate-12 transition-transform duration-1000" />
                                <h3 className="text-[11px] font-bold uppercase tracking-[1em] text-[#0f172a]/20 mb-20 flex items-center gap-6 italic z-10 relative">
                                    <Target className="w-7 h-7 text-[#0f172a]" /> {t.expertise}
                                </h3>
                                <div className="space-y-12 relative z-10">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item flex flex-col gap-4">
                                            <div className="flex justify-between items-center text-3xl font-black italic text-[#0f172a] group-hover/item:text-[#a47e3c] transition-colors leading-none">
                                                <span>{skill}</span>
                                            </div>
                                            <div className="h-[2px] w-full bg-[#0f172a05] relative overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: '100%' }}
                                                    transition={{ duration: 1.5, delay: i * 0.1 }}
                                                    className="h-full bg-[#a47e3c]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* FOUNDATIONAL DOCTRINE (EDUCATION) */}
                        {education.length > 0 && (
                            <section className={`p-16 border-t-8 border-[#a47e3c] bg-white transition-all duration-700 ${highlightedField === 'education' ? 'scale-105 shadow-[0_50px_100px_rgba(0,0,0,0.1)]' : 'shadow-sm'}`}>
                                <h3 className="text-[10px] font-bold uppercase tracking-[1.5em] text-[#0f172a]/20 mb-full border-b border-[#0f172a05] pb-12 mb-20 italic text-center uppercase">
                                     <GraduationCap className="w-12 h-12 mb-10 text-[#0f172a] mx-auto" /> {t.education}
                                </h3>
                                <div className="space-y-20">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center">
                                            <p className="text-[10px] font-bold text-[#a47e3c] mb-6 group-hover:opacity-100 transition-opacity tracking-[0.4em] italic uppercase">ALMA_MATER_0{i + 1}</p>
                                            <h4 className="text-4xl font-black tracking-tight mb-4 group-hover/edu:scale-105 transition-transform uppercase leading-none italic">{edu.degree}</h4>
                                            <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#0f172a]/40 italic group-hover:text-[#0f172a] transition-colors leading-none">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CONSTITUENT LIAISON (QR) */}
                        <div className="pt-24 text-center group">
                             <div className="inline-block p-6 bg-white border border-[#0f172a10] shadow-2xl relative rotate-1 group-hover:rotate-0 transition-transform duration-700 mb-12">
                                 {theme?.showQrCode && (
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={140} color="#0f172a" />
                                 )}
                                 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0f172a] text-white text-[9px] px-4 py-2 font-bold italic shadow-xl whitespace-nowrap">OFFICIAL_LIAISON</div>
                             </div>
                             <h4 className="text-[10px] font-bold uppercase tracking-[2em] text-[#0f172a]/20 mb-12 italic leading-none text-center">Protocol_Authentic_v.5</h4>
                             <div className="flex justify-center gap-10 text-[#0f172a]/10 group-hover:text-[#a47e3c] transition-all duration-[1s]">
                                {[Flag, Heart, Shield, Landmark].map((Icon, i) => <Icon key={i} className="w-8 h-8" />)}
                             </div>
                        </div>
                    </aside>
                </div>

                {/* THE STATESMAN FOOTER */}
                <footer className="w-full mt-auto py-32 px-10 px-24 border-t-8 border-[#0f172a] bg-[#fcfcf9] text-[#0f172a] flex flex-row justify-between items-center gap-24 group">
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-2">
                             {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="w-12 h-2 bg-[#a47e3c] group-hover:w-20 transition-all duration-[2s]" style={{ opacity: i * 0.15 + 0.1 }} />)}
                        </div>
                        <div className="text-left font-bold italic">
                             <p className="text-4xl uppercase tracking-tighter mb-4 text-[#0f172a] leading-none">{personal.fullName} // STATESMAN_PROTOCOL_v.5</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-30">Public Trust // National Service // Diplomatic Integrity</p>
                        </div>
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
