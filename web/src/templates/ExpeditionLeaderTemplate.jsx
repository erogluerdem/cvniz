import React from 'react';
import { Mail, Phone, MapPin, Compass, Shield, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Wind, Droplets, Mountain, CloudRain, Anchor, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ExpeditionLeaderTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#52796f' // Forest Moss

    const t = {
        summary: isEn ? 'Expedition Philosophy & Vision' : 'Ekspedisyon Felsefesi ve Vizyon',
        experience: isEn ? 'Operational Expedition Log & Missions' : 'Operasyonel Ekspedisyon Günlüğü ve Misyonlar',
        education: isEn ? 'Foundational Training & Leadership' : 'Temel Eğitim ve Liderlik',
        expertise: isEn ? 'Risk Mitigation & Field Mastery' : 'Risk Azaltma ve Alan Ustalığı',
        contact: isEn ? 'Signal Node' : 'Sinyal Noktası',
        logs: isEn ? 'Expedition Deployment Registry' : 'Ekspedisyon Dağıtım Kaydı',
        mastery: isEn ? 'Environmental Competencies' : 'Çevresel Yetkinlikler'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const contourVariants = {
        animate: {
            scale: [1, 1.05, 1],
            rotate: [0, 1, 0],
            transition: { duration: 20, repeat: Infinity, ease: "linear" }
        }
    }

    return (
        <div className="min-h-full bg-[#2f3e46] text-[#cad2c5] p-0 selection:bg-[#52796f] selection:text-white uppercase font-sans overflow-x-hidden"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem',
                lineHeight: '1.6'
            }}>

            {/* TOPOGRAPHIC OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    variants={contourVariants}
                    animate="animate"
                    className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cad2c5 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-black/30" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-[#354f52] shadow-[0_0_150px_rgba(0,0,0,0.5)] border-x border-white/5"
            >
                {/* 1. THE PATHBLOCKER HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b-8 border-[#52796f] bg-[#2f3e46] overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Compass className="w-64 h-64 text-white" />
                    </div>
                    
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 text-[#cad2c5] text-[10px] font-black tracking-[0.8em] border border-[#cad2c5]/20 italic shadow-2xl">
                                <Wind className="w-4 h-4 animate-pulse" /> EXPEDITION_NODE_v5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-6xl text-[9rem] font-black text-white tracking-tighter leading-none italic"
                                    style={{ letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[4px] w-24 bg-[#52796f]" />
                                     <p className="text-3xl font-black tracking-[0.4em] text-[#cad2c5]/60 uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['POLAR', 'ALPINE', 'OFF-GRID'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-black/20 border border-white/10 text-[9px] font-black text-[#52796f] tracking-widest">[{tag}]</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-[#cad2c5] border border-white shadow-3xl relative group hover:rotate-2 transition-transform duration-700">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#2f3e46" />
                                    <div className="absolute -top-4 -left-4 bg-black text-white text-[8px] px-3 py-1 font-black italic shadow-lg">SIGNAL_LINK</div>
                                </div>
                             )}
                             <p className="text-[10px] font-black tracking-[0.4em] text-white/10 italic">STATUS: FIELD_DEPLOYED</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black tracking-[0.4em] text-white/30 italic font-mono border-t border-white/5 pt-12">
                        {personal.email && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Mail className="w-5 h-5 text-[#cad2c5]" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-white transition-colors cursor-pointer"><Phone className="w-5 h-5 text-[#cad2c5]" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5 text-[#cad2c5]" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1">
                    
                    {/* LEFT PANEL: LEADERSHIP & MASTERY */}
                    <aside className="col-span-4 p-8 space-y-32 bg-[#2f3e46]/50 border-r border-white/5">
                        
                        {/* EXPEDITION ETHOS (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-8 group bg-white/5 p-10 border border-white/5 relative overflow-hidden ring-1 ring-white/5 shadow-2xl">
                                <h3 className="text-[11px] font-black tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-8 border-b border-white/10 pb-4">
                                     <Target className="w-5 h-5 text-[#cad2c5]" /> {t.summary}
                                </h3>
                                <p className="text-xl font-black italic leading-relaxed text-[#cad2c5]/80 group-hover:text-white transition-colors">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* FIELD MASTERY (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-10">
                                <h3 className="text-[11px] font-black tracking-[0.8em] text-white/20 flex items-center gap-4 italic mb-10 border-b border-white/10 pb-4">
                                    <Layers className="w-5 h-5 text-[#cad2c5]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item p-6 border border-white/5 bg-black/10 hover:bg-[#52796f]/20 hover:border-[#cad2c5]/30 transition-all cursor-default relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-2 opacity-5 scale-0 group-hover/item:scale-100 transition-transform">
                                                <Compass className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-xs font-black tracking-widest text-[#cad2c5]/40 group-hover/item:text-white transition-colors uppercase">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ENVIRONMENTAL COMPETENCIES */}
                        <div className="p-10 border-2 border-white/5 bg-black/20 text-center group">
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-white/5 mb-10 italic leading-none">{t.mastery}</h4>
                             <div className="grid grid-cols-2 gap-8 relative z-10 text-[#cad2c5]/30 group-hover:text-white transition-colors font-black tracking-[0.2em] text-[9px] uppercase">
                                {[ 
                                    { icon: Mountain, label: 'Alpine' },
                                    { icon: Droplets, label: 'Arctic' },
                                    { icon: CloudRain, label: 'Tropical' },
                                    { icon: Anchor, label: 'Maritime' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-4 border border-white/5 bg-white/5 group-hover:border-[#52796f] transition-all">
                                        <item.icon className="w-6 h-6 text-[#52796f]" />
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* FORMATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-black/10 border-y border-white/5 shadow-inner">
                                <h3 className="text-[10px] font-black tracking-[1em] text-white/5 text-center italic mb-10 leading-none pb-4 border-b border-white/5 uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu">
                                        <p className="text-[9px] font-black text-[#52796f] mb-6 tracking-[0.5em] italic">FORMATION_LOG_0{i + 1}</p>
                                        <h4 className="text-3xl font-black italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-white">{edu.degree}</h4>
                                        <p className="text-[11px] font-black tracking-[0.3em] text-[#cad2c5]/30 mt-4">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: EXPEDITION LOG */}
                    <main className="col-span-8 p-10 p-24 space-y-40 bg-[#354f52]">
                        
                        {/* EXPEDITIONS (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-black/10 p-20 -mx-20 rounded-[6rem] border border-white/5 shadow-inner skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[11px] font-black tracking-[2.5em] text-white/5 mb-24 flex items-center gap-10 italic leading-none justify-start">
                                    <Compass className="w-10 h-10 text-[#cad2c5]" /> {t.experience}
                                </h2>
                                <div className="space-y-56">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l-2 border-white/5 hover:border-[#cad2c5] transition-all duration-[1.5s]">
                                            <div className="absolute top-0 -left-[2px] w-1.5 h-32 bg-[#cad2c5] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#cad2c5]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-6 flex-1">
                                                    <h3 className="text-4xl text-[6.5rem] font-black text-white tracking-widest italic group-hover:translate-x-12 transition-transform duration-[1.5s] leading-none">{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-white/10 group-hover:w-40 transition-all duration-1000" />
                                                        <p className="text-3xl font-black text-[#cad2c5]/20 tracking-[0.8em] group-hover:text-[#cad2c5] transition-colors italic leading-none uppercase">SITE_REF: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-black text-black bg-[#cad2c5] px-12 py-5 group-hover:bg-[#52796f] transition-all italic tracking-[0.5em] shadow-3xl whitespace-nowrap">
                                                    [{exp.startDate} :: {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-2xl text-[#cad2c5]/40 leading-relaxed font-black italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[40px] border-white/5 pl-24 py-12 group-hover:text-white group-hover:border-[#cad2c5] bg-black/5 transition-all duration-1000">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* MISSION LOGISTRY HUB */}
                        <div className="p-32 bg-black text-white border-4 border-double border-[#cad2c5]/20 text-center group relative overflow-hidden transition-all duration-[2s] hover:p-40">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#52796f]/20 to-transparent pointer-events-none" />
                             <ShieldAlert className="absolute -top-10 -right-10 w-[500px] h-[500px] text-white/5 group-hover:rotate-12 transition-all duration-[8s]" />
                             
                             <h4 className="text-[12px] font-black tracking-[2em] text-[#52796f] mb-20 italic leading-none z-10 relative uppercase">{t.logs}</h4>
                             <div className="space-y-12 relative z-10">
                                <p className="text-5xl text-7xl font-black italic tracking-tighter leading-none" style={{ letterSpacing: '-0.02em' }}>Elite Field Command // Risk Neutralization Certified</p>
                                <p className="text-2xl font-black italic tracking-widest text-[#cad2c5]/30 group-hover:text-[#cad2c5] transition-opacity uppercase">Global Logistics Command // High-Altitude Specialist</p>
                             </div>
                             
                             <div className="flex justify-start gap-16 mt-20 text-white/5 group-hover:text-[#cad2c5] transition-all duration-[1s]">
                                {[Globe, Shield, Target, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE PATHBLOCKER FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-20 bg-[#2f3e46] text-[#cad2c5] flex flex-row justify-between items-center gap-24 group relative overflow-hidden font-black">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#52796f] shadow-[0_0_20px_#52796f]" />
                    <div className="flex flex-col items-start gap-16 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ height: [10, 80, 10] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 1.5 }} className="w-2 bg-[#cad2c5]/10 group-hover:bg-[#cad2c5]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[24px] uppercase tracking-[1.8em] mb-6 text-white">{personal.fullName} // PATH_NODE_v5.0</p>
                             <p className="text-[12px] uppercase tracking-[0.5em] italic opacity-20 italic">Master of Terrain // Expert in Survival // Unyielding Command</p>
                        </div>
                    </div>
                    <div className="flex gap-20 text-white/5 group-hover:text-[#cad2c5] transition-all duration-1000 relative z-10 p-16 bg-black/10 rounded-full border border-white/5 shadow-inner">
                         {[Share2, Globe, Compass, Mountain].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -50, scale: 2.5, rotate: 10, color: '#ffffff' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-700 shadow-3xl" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
