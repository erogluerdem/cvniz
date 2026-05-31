import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Files, History, Book, Image, Maximize2, Lightbulb, UserCheck, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MuseumCuratorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#c5a059' // Exhibition Gold

    const t = {
        summary: isEn ? 'The Curatorial Manifesto' : 'Küratöryel Manifesto',
        experience: isEn ? 'The Exhibition Portfolio & Curation' : 'Sergi Portfolyosu ve Kürasyon',
        education: isEn ? 'Academic Foundation' : 'Akademik Temel',
        expertise: isEn ? 'Strategic Curation' : 'Stratejik Kürasyon',
        contact: isEn ? 'The Gallery Node' : 'Galeri Noktası',
        awards: isEn ? 'Global Honors' : 'Küresel Başarılar'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
    }

    return (
        <div className="min-h-full bg-white text-[#1a1a1a] p-0 selection:bg-[#c5a059] selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.7'
            }}>

            {/* GALLERY WHITE OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#c5a059]/5 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-[#f9f9f9]/20" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-[1440px] mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-[0_0_150px_rgba(0,0,0,0.02)]"
            >
                {/* 1. THE STORYTELLER HEADER */}
                <header className="w-full relative py-32 px-10 px-24 border-b border-stone-100 bg-white">
                    <div className="flex flex-row gap-24 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-16">
                            <motion.div variants={cardVariants} className="inline-flex items-center gap-4 px-8 py-3 bg-[#c5a059] text-white text-[10px] font-black uppercase tracking-[0.8em] italic shadow-2xl">
                                <Lightbulb className="w-4 h-4" /> CURATORIAL_DIRECTOR_v5.0
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    variants={cardVariants} 
                                    className="text-6xl text-[13rem] font-black text-[#1a1a1a] tracking-tighter leading-none uppercase italic"
                                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={cardVariants} className="flex items-center gap-16">
                                     <div className="h-[2px] w-32 bg-[#c5a059]" />
                                     <p className="text-3xl font-black tracking-[0.6em] text-stone-200 uppercase italic">
                                        {personal.title}
                                     </p>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={cardVariants} className="flex flex-col items-center items-end gap-16 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-stone-100 shadow-[0_50px_100px_rgba(0,0,0,0.05)] relative group hover:-translate-y-4 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={120} color="#1a1a1a" />
                                    <div className="absolute -top-6 -left-6 bg-[#1a1a1a] text-white text-[9px] px-4 py-2 font-black italic shadow-2xl">GALLERY_ACCESS</div>
                                </div>
                             )}
                             <p className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-200 italic leading-loose">EST_NODE: {personal.fullName?.split(' ')[0].toUpperCase()}_8820</p>
                        </motion.div>
                    </div>

                    <motion.div variants={cardVariants} className="flex flex-wrap justify-start items-center gap-16 mt-24 text-[12px] font-black uppercase tracking-[0.6em] text-stone-300 italic border-t border-stone-50 pt-16">
                        {personal.email && <div className="flex items-center gap-5 hover:text-[#c5a059] transition-colors cursor-pointer"><Mail className="w-6 h-6 text-[#c5a059]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-5 hover:text-[#c5a059] transition-colors cursor-pointer"><Phone className="w-6 h-6 text-[#c5a059]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-5"><MapPin className="w-6 h-6 text-[#c5a059]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-stone-100 flex-1">
                    
                    {/* LEFT PANEL: MANIFESTO & STRATEGY */}
                    <aside className="col-span-4 p-12 space-y-40 bg-stone-50/20 border-r border-stone-100">
                        
                        {/* CURATORIAL MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <motion.section variants={cardVariants} className="group relative bg-white p-12 border border-stone-100 shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all hover:shadow-xl">
                                <div className="flex items-center gap-8 mb-16">
                                     <MessageCircle className="w-8 h-8 text-[#c5a059]" />
                                     <h3 className="text-[11px] font-black uppercase tracking-[1em] text-stone-200 italic leading-none">{t.summary}</h3>
                                </div>
                                <p className="text-3xl font-light italic leading-relaxed text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </motion.section>
                        )}

                        {/* STRATEGIC CURATION (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-16">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-stone-200 flex items-center gap-8 italic mb-12">
                                    <Maximize2 className="w-8 h-8 text-[#c5a059]" /> {t.expertise}
                                </h3>
                                <div className="space-y-10">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-4">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-2xl font-light italic tracking-[0.1em] text-[#1a1a1a] group-hover/item:text-[#c5a059] group-hover/item:translate-x-4 transition-all uppercase leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{skill}</span>
                                                <PenTool className="w-5 h-5 text-[#c5a059] opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:-translate-y-2" />
                                            </div>
                                            <div className="h-[1px] w-full bg-stone-100" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACADEMIC FOUNDATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className={`p-16 border-t-[30px] border-[#c5a059] transition-all duration-300 bg-white shadow-2xl ${highlightedField === 'education' ? 'ring-4 ring-[#c5a059]' : ''}`}>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] opacity-30 border-b border-stone-100 pb-12 mb-24 italic text-center uppercase">
                                     <GraduationCap className="w-12 h-12 mb-10 text-[#c5a059] mx-auto opacity-30" /> {t.education}
                                </h3>
                                <div className="space-y-20">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center">
                                            <p className="text-[9px] font-black opacity-30 mb-8 tracking-[0.6em] italic uppercase font-mono">CUR_ACAD_HIST_0{i + 1}</p>
                                            <h4 className="text-4xl font-light italic leading-tight mb-6 group-hover/edu:scale-105 transition-transform uppercase leading-none text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>{edu.degree}</h4>
                                            <p className="text-[12px] font-black uppercase tracking-[0.4em] text-[#c5a059] underline underline-offset-8 decoration-[#c5a059]/30">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: EXHIBITION PORTFOLIO */}
                    <main className="col-span-8 p-10 p-24 space-y-48">
                        
                        {/* THE PORTFOLIO (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={cardVariants} className={`space-y-40 transition-all duration-[1.5s] ${highlightedField === 'experience' ? 'bg-[#c5a059]/5 p-24 -mx-24 rounded-[6rem] shadow-2xl' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2.5em] text-stone-100 mb-24 flex items-center justify-center gap-16 italic leading-none uppercase">
                                    <Image className="w-10 h-10 text-[#c5a059]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative items-start gap-12">
                                            <div className="absolute top-0 right-0 p-24 bg-stone-50 border border-stone-200 rotate-[4deg] opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-1000 z-0">
                                                <Maximize2 className="w-64 h-64 text-stone-100" />
                                            </div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                    <div className="space-y-6 flex-1">
                                                        <h3 className="text-7xl text-[8rem] font-black text-[#1a1a1a] tracking-tighter uppercase italic group-hover:text-[#c5a059] transition-colors duration-1000 leading-[0.85]" style={{ fontFamily: "'Playfair Display', serif" }}>{exp.position}</h3>
                                                        <div className="flex items-center gap-10">
                                                            <div className="h-px w-20 bg-[#c5a059] group-hover:w-40 transition-all duration-1000" />
                                                            <p className="text-3xl font-black text-stone-300 uppercase tracking-[0.4em] italic leading-none">GALLERY: {exp.company}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-[12px] font-black text-white bg-black px-12 py-5 group-hover:bg-[#c5a059] transition-all italic tracking-[0.4em] shadow-2xl whitespace-nowrap">
                                                        {exp.startDate} – {exp.endDate}
                                                    </div>
                                                </div>
                                                <p className="text-3xl text-stone-400 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-stone-50 pl-24 py-16 group-hover:text-[#1a1a1a] group-hover:border-[#c5a059] bg-white transition-all duration-1000" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* GLOBAL RECOGNITION */}
                        <section className="p-32 bg-[#1a1a1a] text-white space-y-24 group relative overflow-hidden transition-all duration-[2s] hover:p-40">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/20 to-transparent pointer-events-none" />
                             <Award className="absolute -top-10 -right-10 w-[500px] h-[500px] text-white/5 group-hover:rotate-12 group-hover:scale-150 transition-all duration-[8s]" />
                             
                             <h4 className="text-[12px] font-black uppercase tracking-[2em] text-[#c5a059] mb-12 italic leading-none z-10 relative">{t.awards}</h4>
                             <div className="space-y-8 relative z-10">
                                <p className="text-6xl text-7xl font-black italic leading-none uppercase tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>Chevalier de l'Ordre des Arts et des Lettres</p>
                                <p className="text-3xl font-black italic tracking-widest text-[#c5a059] opacity-30 group-hover:opacity-100 transition-opacity">Global Exhibition Curator of the Year // 2024</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-24 text-white/10 group-hover:text-[#c5a059] transition-all duration-[1.5s]">
                                {[Globe, UserCheck, ShieldCheck, Heart].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </section>
                    </main>
                </div>

                {/* THE STORYTELLER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 bg-white text-[#1a1a1a] flex flex-row justify-between items-center gap-24 group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#c5a059]/20" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [40, 80, 40] }} transition={{ delay: i * 0.2, repeat: Infinity, duration: 2 }} className="w-1 bg-[#c5a059] opacity-20" />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[24px] uppercase tracking-[1.8em] mb-8 text-[#1a1a1a]">{personal.fullName} // GAL_CORE_OS_5.0</p>
                             <p className="text-[12px] uppercase tracking-[0.6em] italic opacity-30 italic">Narrative Excellence // Exhibition Mastery // Cultural Preservation</p>
                        </div>
                    </div>
                    <div className="flex gap-20 text-stone-100 group-hover:text-[#c5a059] transition-colors relative z-10 p-16 bg-[#1a1a1a]/5 rounded-0 border border-stone-100 backdrop-blur-3xl shadow-3xl">
                         {[Share2, Globe, Image, Maximize2].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -40, scale: 2.2, rotate: 5, color: '#1a1a1a' }}>
                                 <Icon className="w-14 h-14 cursor-pointer transition-all duration-700 shadow-2xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
