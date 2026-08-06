import React from 'react';
import { Mail, Phone, MapPin, Heart, Globe, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, ShieldCheck, PenTool, Layers, Users, TrendingUp, HeartHandshake, Leaf, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PhilanthropistTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#10b981' // Impact Green

    const t = {
        summary: isEn ? 'The Humanitarian Vision' : 'İnsani Vizyon',
        experience: isEn ? 'Impact Stewardship & Foundations' : 'Etki Yönetimi ve Vakıflar',
        education: isEn ? 'Strategic Foundation' : 'Stratejik Temel',
        expertise: isEn ? 'Core Impact Competencies' : 'Temel Etki Yetkinlikleri',
        contact: isEn ? 'Mission Connection' : 'Misyon Bağlantısı',
        metrics: isEn ? 'Social Impact Dashboard' : 'Sosyal Etki Paneli',
        sdg: isEn ? 'UN SDG Alignment' : 'BM Sürdürülebilir Kalkınma Hedefleri'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const impactVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#f8fafc] text-slate-700 p-0 selection:bg-[#10b981] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.6'
            }}>

            {/* LIGHT-FILLED OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#10b981]/5 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white/70 backdrop-blur-3xl shadow-[0_0_100px_rgba(16,185,129,0.05)] border-x border-slate-100"
            >
                {/* 1. THE IMPACT ARCHITECT HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-slate-100 bg-gradient-to-br from-white to-[#f0f9ff]">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-10 text-left">
                            <motion.div variants={impactVariants} className="inline-flex items-center gap-4 px-6 py-2 bg-[#10b981]/10 text-[#059669] text-[10px] font-black uppercase tracking-[0.6em] rounded-full italic border border-[#10b981]/20">
                                <Leaf className="w-4 h-4" /> IMPACT_VISION_OS_5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={impactVariants} 
                                    className="text-7xl text-[8rem] font-black text-slate-900 tracking-tighter leading-none uppercase italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={impactVariants} className="flex flex-wrap items-center gap-8 justify-start">
                                     <p className="text-3xl font-black tracking-[0.4em] text-[#10b981] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['Global Impact', 'Ethics', 'Sustainability'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-white border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-full shadow-sm">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div variants={impactVariants} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] group hover:scale-110 transition-all duration-700 relative">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#0f172a" />
                                    <div className="absolute -top-4 -right-4 bg-[#10b981] text-white text-[8px] px-4 py-1.5 font-black italic rounded-full shadow-lg">IMPACT_LINK</div>
                                </div>
                             )}
                             <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-8 h-[3px] bg-[#10b981]/20 rounded-full" />)}
                             </div>
                        </motion.div>
                    </div>

                    <motion.div variants={impactVariants} className="flex flex-wrap justify-start items-center gap-10 mt-16 text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">
                        {personal.email && <div className="flex items-center gap-3 hover:text-[#10b981] transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#10b981]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-3 hover:text-[#10b981] transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#10b981]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#10b981]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: VISION & METRICS */}
                    <aside className="col-span-4 p-10 space-y-24 bg-slate-50 border-r border-slate-100">
                        
                        {/* HUMANITARIAN MISSION (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-8 group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 flex items-center gap-4 italic mb-6">
                                     <Sparkles className="w-5 h-5 text-[#10b981]" /> {t.summary}
                                </h3>
                                <p className="text-2xl font-black italic leading-relaxed text-slate-900">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* IMPACT METRICS DASHBOARD */}
                        <section className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-xl space-y-12 relative overflow-hidden group break-inside-avoid page-break-inside-avoid">
                             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-[4s]">
                                <TrendingUp className="w-32 h-32 text-[#10b981]" />
                             </div>
                             <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 mb-10 italic leading-none">{t.metrics}</h4>
                             <div className="grid grid-cols-2 gap-10">
                                {[
                                    { label: 'Lives Impacted', val: '1.2M+' },
                                    { label: 'Funds Managed', val: '$50M+' },
                                    { label: 'Grants Issued', val: '450+' },
                                    { label: 'Countries', val: '32' }
                                ].map((stat, i) => (
                                    <div key={i} className="space-y-2 break-inside-avoid page-break-inside-avoid">
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter italic">{stat.val}</p>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                             </div>
                        </section>

                        {/* CORE COMPETENCIES (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-300 flex items-center gap-4 italic mb-8">
                                    <Target className="w-5 h-5 text-[#10b981]" /> {t.expertise}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-5 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-[#10b981] hover:border-[#10b981] transition-all cursor-default shadow-sm break-inside-avoid page-break-inside-avoid">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* SDG ALIGNMENT */}
                        <div className="p-12 bg-[#10b981]/5 border border-[#10b981]/20 rounded-[2.5rem] text-center group">
                             <h4 className="text-[11px] font-black uppercase tracking-[1em] text-[#10b981] mb-12 italic leading-none">{t.sdg}</h4>
                             <div className="flex flex-wrap justify-center gap-4 relative z-10">
                                {[ 'No Poverty', 'Quality Education', 'Climate Action', 'Reduced Inequalities' ].map((goal, i) => (
                                    <span key={i} className="px-4 py-1.5 bg-white text-[9px] font-black text-slate-900 border border-slate-100 rounded-full shadow-sm group-hover:bg-[#10b981] group-hover:text-white transition-all cursor-default">#{goal.toUpperCase()}</span>
                                ))}
                             </div>
                             <div className="flex justify-center gap-10 mt-12 text-slate-200 group-hover:text-[#10b981] transition-all duration-[1s]">
                                {[Heart, Users, HeartHandshake, Globe].map((Icon, i) => <Icon key={i} className="w-6 h-6" />)}
                             </div>
                        </div>
                    </aside>

                    {/* MAIN CANVAS: STEWARDSHIP & FOUNDATIONS */}
                    <main className="col-span-8 p-10 p-20 space-y-40 bg-white">
                        
                        {/* STEWARDSHIP (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <motion.section variants={impactVariants} className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#10b981]/5 p-16 -mx-16 rounded-[4rem] border border-[#10b981]/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]' : ''}`}>
                                <h2 className="text-[11px] font-black uppercase tracking-[2em] text-slate-200 mb-24 flex items-center gap-10 italic leading-none justify-start">
                                    <Briefcase className="w-8 h-8 text-[#10b981]" /> {t.experience}
                                </h2>
                                <div className="space-y-40">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-24 border-l-2 border-slate-100 hover:border-[#10b981] transition-all duration-1000 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute -left-[1.5px] top-0 w-2 h-24 bg-[#10b981] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_20px_#10b981]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-8 gap-10">
                                                <div className="space-y-3">
                                                    <h3 className="text-5xl text-6xl font-black text-slate-900 tracking-tighter uppercase italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <p className="text-xl font-black text-[#10b981] uppercase tracking-[0.4em] italic opacity-30 group-hover:opacity-100 transition-opacity">FOUNDATION: {exp.company}</p>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-slate-900 px-8 py-3 rounded-full group-hover:bg-[#10b981] transition-all whitespace-nowrap italic uppercase tracking-widest shadow-xl">
                                                    {exp.startDate} – {exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-2xl text-slate-500 leading-relaxed font-light italic opacity-90 group-hover:opacity-100 transition-opacity border-l-4 border-slate-50 pl-16 py-6 group-hover:text-slate-600 group-hover:border-[#10b981]">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* FOUNDATIONS (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="p-16 border-2 border-dashed border-slate-100 rounded-[4rem] group hover:border-[#10b981] transition-all duration-700 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-200 text-center italic mb-16 flex items-center justify-center gap-10 leading-none">
                                     <GraduationCap className="w-10 h-10 mb-8 text-[#10b981] mx-auto opacity-30 group-hover:text-[#10b981] group-hover:opacity-100 transition-all" /> {t.education}
                                </h3>
                                <div className="grid grid-cols-2 gap-16">
                                    {education.map((edu, i) => (
                                        <div key={i} className="group/edu text-center break-inside-avoid page-break-inside-avoid">
                                            <p className="text-[9px] font-black text-slate-300 mb-6 group-hover:text-[#10b981] transition-colors tracking-[0.5em] italic uppercase">ACAD_LOG_0{i + 1}</p>
                                            <h4 className="text-4xl font-black italic leading-tight mb-4 group-hover/edu:scale-105 transition-transform uppercase leading-none text-slate-900">{edu.degree}</h4>
                                            <p className="text-[12px] font-black uppercase tracking-[0.3em] text-[#10b981] group-hover:text-slate-500">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>
                </div>

                {/* THE IMPACT FOOTER */}
                <footer className="w-full mt-40 py-32 px-10 px-20 border-t border-slate-100 bg-[#f8fafc] text-slate-500 flex flex-row justify-between items-center gap-24 group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent shadow-[0_0_20px_#10b981]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ scaleY: [1, 2.5, 1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-2 h-16 bg-[#10b981]/20 rounded-full" />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[20px] uppercase tracking-[1.5em] mb-6 text-slate-900">{personal.fullName} // IMPACT_CORE_v5.0</p>
                             <p className="text-[11px] uppercase tracking-[0.5em] italic opacity-40 italic">Global Stewardship // Ethical Leadership // Visionary Impact</p>
                        </div>
                    </div>
                    <div className="flex gap-16 text-slate-200 group-hover:text-[#10b981] transition-colors relative z-10 p-12 bg-white rounded-full border border-slate-100 shadow-2xl">
                         {[Share2, Globe, Heart, Sparkles].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -30, scale: 2, color: '#10b981' }}>
                                 <Icon className="w-12 h-12 cursor-pointer transition-colors shadow-2xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
