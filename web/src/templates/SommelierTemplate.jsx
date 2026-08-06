import React from 'react';
import { Mail, Phone, MapPin, Search, Grid, Eye, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart, ShieldCheck, PenTool, Layers, Database, Lock, Terminal, Activity, Zap as Spark, ShieldAlert, GlassWater as Wine, Utensils, Star, Map, Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function SommelierTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#4c0519' // Deep Burgundy

    const t = {
        summary: isEn ? 'The Sensory Manifesto' : 'Duyusal Manifesto',
        experience: isEn ? 'Vineyard & Vintage Scoring Registry' : 'Bağ ve Rekolte Puanlama Kaydı',
        education: isEn ? 'Oenological Foundation & Theory' : 'Enolojik Temel ve Teori',
        expertise: isEn ? 'Cellar Management & Sensory Stack' : 'Mahzen Yönetimi ve Duyusal Yığın',
        contact: isEn ? 'Cellar Node Access' : 'Mahzen Nokta Erişimi',
        list: isEn ? 'High-End Wine List Portfolio' : 'Lüks Şarap Listesi Portfolyosu',
        notes: isEn ? 'Tasting Notes & Flavor Profiles' : 'Tadım Notları ve Lezzet Profilleri'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } }
    }

    const fluidVariants = {
        animate: {
            opacity: [0.02, 0.05, 0.02],
            scale: [1, 1.05, 1],
            transition: { duration: 15, repeat: Infinity, ease: "easeInOut" }
        }
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-slate-800 p-0 selection:bg-[#4c0519] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.8'
            }}>

            {/* FLUID OVERLAY */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div variants={fluidVariants} animate="animate" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4c0519]/5 rounded-full blur-[120px]" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#4c0519]/5 to-transparent" />
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative z-10 overflow-hidden flex flex-col bg-white shadow-2xl border-x border-slate-50"
            >
                {/* 1. THE SENSORY CRITIC HEADER */}
                <header className="w-full relative py-20 px-10 px-20 border-b border-[#4c0519]/10 bg-white">
                    <div className="flex flex-row gap-16 items-center justify-between relative z-10">
                        <div className="flex-1 space-y-12 text-left">
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-6 py-2 bg-[#4c0519] text-white text-[10px] font-black uppercase tracking-[0.8em] italic shadow-xl">
                                <Wine className="w-4 h-4" /> CELLAR_NODE_v12.0
                            </motion.div>
                            
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-7xl text-[10rem] font-black text-slate-900 tracking-tighter leading-none italic uppercase"
                                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.06em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-10 justify-start">
                                     <div className="h-[1px] w-24 bg-[#4c0519]/30" />
                                     <p className="text-3xl font-light tracking-[0.5em] text-[#4c0519] uppercase italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['WSET-4', 'MS', 'VINTAGE'].map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{tag}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center items-end gap-12 text-right">
                             {theme?.showQrCode && (
                                <div className="p-4 bg-white border border-[#4c0519]/10 shadow-[0_50px_100px_rgba(76,5,25,0.1)] relative group hover:rotate-2 transition-transform duration-1000">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#4c0519" />
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <Award className="w-8 h-8 text-[#4c0519]" />
                                    </div>
                                </div>
                             )}
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 italic">CELLAR_ID: {personal.fullName?.split(' ')[0].toUpperCase()}_VINE</p>
                        </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-start items-center gap-12 mt-20 text-[11px] font-black uppercase tracking-[0.6em] text-[#4c0519] italic border-t border-slate-50 pt-16">
                        {personal.email && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Mail className="w-5 h-5" /> {personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-4 hover:text-slate-900 transition-colors cursor-pointer"><Phone className="w-5 h-5" /> {personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-4"><MapPin className="w-5 h-5" /> {personal.location}</div>}
                    </motion.div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 flex-1 bg-white">
                    
                    {/* LEFT PANEL: SENSORY & STACK */}
                    <aside className="col-span-4 p-10 space-y-32 bg-slate-50/20 border-r border-slate-100 shadow-inner">
                        
                        {/* THE MANIFESTO (SUMMARY) */}
                        {personal.summary && (
                            <section className="space-y-10 group bg-white p-10 border border-[#4c0519]/10 shadow-sm relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                                    <Activity className="w-24 h-24" />
                                </div>
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-200 flex items-center gap-4 italic mb-8 border-b border-slate-100 pb-4">
                                     <Eye className="w-6 h-6 text-[#4c0519]" /> {t.summary}
                                </h3>
                                <p className="text-3xl font-light italic leading-relaxed text-slate-500 group-hover:text-black transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* SENSORY MASTERY HUB */}
                        <div className="p-10 border-2 border-[#4c0519]/10 text-center group bg-white shadow-2xl skew-y-[-1deg]">
                             <h4 className="text-[11px] font-black tracking-[1.5em] text-[#4c0519]/20 mb-10 italic leading-none uppercase skew-y-[1deg]">{t.notes}</h4>
                             <div className="grid grid-cols-2 gap-8 text-[#4c0519]/40 group-hover:text-[#4c0519] transition-colors relative z-10 text-[9px] font-black uppercase tracking-widest skew-y-[1deg]">
                                {[ 
                                    { label: 'Terroir Analysis', val: 'Elite' },
                                    { label: 'Blind Tasting', val: 'MASTER' },
                                    { label: 'Cellar Logic', val: 'Advanced' },
                                    { label: 'Rare Vintage', val: 'Spec.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 p-4 border border-[#4c0519]/5 bg-slate-50 break-inside-avoid page-break-inside-avoid">
                                        <p>{item.val}</p>
                                        <span className="text-[8px] font-bold text-slate-500">{item.label}</span>
                                    </div>
                                ))}
                             </div>
                        </div>

                        {/* OENOLOGICAL STACK (SKILLS) */}
                        {skills.length > 0 && (
                            <section className="space-y-12 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] text-slate-200 flex items-center gap-4 italic mb-10 border-b border-slate-100 pb-4 uppercase">
                                    <Database className="w-5 h-5 text-[#4c0519]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group/item relative pb-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center z-10 relative">
                                                <span className="text-[18px] font-light uppercase tracking-widest text-[#4c0519]/40 group-hover/item:text-[#4c0519] transition-colors italic whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>{skill}</span>
                                                <div className="h-px bg-slate-100 flex-1 mx-4" />
                                                <Star className="w-4 h-4 opacity-0 group-hover/item:opacity-100 text-[#4c0519] transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* EDUCATION (EDUCATION) */}
                        {education.length > 0 && (
                            <section className="space-y-16 p-10 bg-slate-50 border-y border-slate-100 uppercase italic break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black tracking-[1em] text-slate-200 text-center mb-10 leading-none pb-4 border-b border-white uppercase">{t.education}</h3>
                                {education.map((edu, i) => (
                                    <div key={i} className="text-center group/edu break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-[#4c0519]/30 mb-6 tracking-[0.5em]">ACADEMIC_VINE_0{i + 1}</p>
                                        <h4 className="text-3xl font-light italic leading-tight mb-4 group-hover/edu:scale-110 transition-transform text-slate-800 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>{edu.degree}</h4>
                                        <p className="text-[12px] font-black tracking-[0.4em] text-[#4c0519]/40 mt-4 uppercase">{edu.school}</p>
                                    </div>
                                ))}
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: VINTAGE REGISTRY */}
                    <main className="col-span-8 p-10 p-24 space-y-48 bg-white shadow-inner">
                        
                        {/* THE REGISTRY (EXPERIENCE) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-[1s] ${highlightedField === 'experience' ? 'bg-[#4c0519]/5 p-20 -mx-20 border border-[#4c0519]/10 shadow-[0_0_100px_rgba(76,5,25,0.1)] skew-x-[-1deg]' : ''}`}>
                                <h2 className="text-[12px] font-black tracking-[4em] text-slate-50 mb-24 flex items-center justify-center gap-10 italic leading-none justify-start uppercase">
                                    <Map className="w-10 h-10 text-[#4c0519]" /> {t.experience}
                                </h2>
                                <div className="space-y-64">
                                    {experience.map((exp, i) => (
                                        <div key={i} className="group relative pl-32 border-l border-slate-100 hover:border-[#4c0519] transition-all duration-[1.5s] break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 -left-[1.5px] w-1.5 h-32 bg-[#4c0519] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700 shadow-[0_0_30px_#4c0519]" />
                                            
                                            <div className="flex flex-row justify-between items-baseline mb-16 gap-12">
                                                <div className="space-y-10 flex-1">
                                                    <h3 className="text-6xl text-[9.5rem] font-black text-slate-900 tracking-tighter italic group-hover:text-[#4c0519] transition-colors duration-[1.5s] leading-none uppercase" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.06em' }}>{exp.position}</h3>
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-px w-20 bg-slate-100 group-hover:w-40 group-hover:bg-[#4c0519] transition-all duration-1000 shadow-[0_0_15px_#4c0519]" />
                                                        <p className="text-3xl font-light italic text-slate-200 tracking-[0.4em] group-hover:text-slate-500 transition-colors italic leading-none uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>TERROIR: {exp.company}</p>
                                                    </div>
                                                </div>
                                                <div className="text-[11px] font-black text-white bg-slate-900 px-10 py-4 group-hover:bg-[#4c0519] transition-all whitespace-nowrap italic tracking-[0.6em] shadow-3xl leading-none uppercase">
                                                    [{exp.startDate} - {exp.endDate}]
                                                </div>
                                            </div>
                                            <p className="text-4xl text-slate-300 leading-relaxed font-light italic opacity-95 group-hover:opacity-100 transition-opacity border-l-[60px] border-slate-50 pl-24 py-16 group-hover:text-slate-950 group-hover:border-[#4c0519] bg-slate-50 transition-all duration-1000 uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CELLAR FINAL SEAL */}
                        <div className="p-32 bg-[#4c0519] text-white border-4 border-double border-white/20 text-center group relative overflow-hidden transition-all duration-[2s] hover:p-40 shadow-3xl">
                             <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-1000 uppercase" />
                             <Compass className="absolute -top-10 -right-10 w-96 h-96 text-white/5 group-hover:rotate-45 transition-all duration-[12s]" />
                             
                             <h4 className="text-[14px] font-black tracking-[4em] text-white/20 mb-20 italic leading-none z-10 relative uppercase">{t.list}</h4>
                             <div className="space-y-12 relative z-10 italic">
                                <p className="text-5xl text-6xl font-black italic tracking-tighter leading-none italic uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>Elite Sensory Critic // Master of Oenological Strategy</p>
                                <p className="text-2xl font-black italic tracking-[1.5em] opacity-30 group-hover:opacity-100 transition-opacity uppercase text-white shadow-2xl">Defining the Cellar @ Infinite Scale // Zero Deviation</p>
                             </div>
                             
                             <div className="flex justify-start gap-24 mt-24 text-white/10 group-hover:text-white transition-all duration-[1s]">
                                {[Utensils, Globe, Wine, Award].map((Icon, i) => <Icon key={i} className="w-16 h-16" />)}
                             </div>
                        </div>
                    </main>
                </div>

                {/* THE SENSORY CRITIC FOOTER */}
                <footer className="w-full mt-40 py-48 px-10 px-24 border-t border-slate-100 bg-white text-slate-100 flex flex-row justify-between items-center gap-24 group overflow-hidden relative font-black uppercase italic">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#4c0519] shadow-[0_0_30px_rgba(76,5,25,0.5)]" />
                    <div className="flex flex-col items-start gap-12 relative z-10">
                         <div className="flex gap-4 items-end h-20">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <motion.div key={i} animate={{ h: [10, 80, 10], opacity: [0.1, 1, 0.1] }} transition={{ delay: i * 0.1, repeat: Infinity, duration: 2 }} className="w-1 bg-[#4c0519]" />)}
                        </div>
                        <div className="text-left">
                             <p className="text-[28px] uppercase tracking-[2.8em] mb-6 text-slate-900 leading-none">{personal.fullName} // VINE_NODE_EX1</p>
                             <p className="text-[12px] uppercase tracking-[0.6em] italic opacity-40 uppercase italic text-[#4c0519]">Tasting the Soil // Preserving the Vintage // Defining the Palette</p>
                        </div>
                    </div>
                    <div className="flex gap-24 text-slate-100 group-hover:text-[#4c0519] transition-colors relative z-10 p-20 bg-slate-50 border border-slate-100 rounded-full shadow-inner shadow-black/5">
                         {[Share2, Globe, Archive, MessageCircle].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -60, scale: 2.2, color: '#0f172a' }}>
                                 <Icon className="w-16 h-16 cursor-pointer transition-all duration-1000 shadow-3xl shadow-black/5 p-2" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}

function Archive(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  )
}
