import React from 'react';
import { Mail, Phone, MapPin, Star, User, Film, Tv, Mic2, Award, Briefcase, GraduationCap, ArrowRight, Zap, Target, BookOpen, Camera, Share2, Globe, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ActorTemplate({ data, theme = {}, highlightedField = null }) {
    const { personal = {}, experience = [], education = [], skills = [], languages = [], references = [] } = data
    const isEn = theme?.language === 'en'
    const accentColor = theme?.accentColor || '#e11d48' // Spotlight Red

    const t = {
        summary: isEn ? 'The Artistic Profile' : 'Sanatçı Profili',
        experience: isEn ? 'Credits & Performance' : 'Kredi ve Performans',
        education: isEn ? 'Training & Education' : 'Eğitim ve Atölyeler',
        expertise: isEn ? 'Special Skills' : 'Özel Yetenekler',
        contact: isEn ? 'Representation Info' : 'Temsil Bilgileri',
        stats: isEn ? 'Physical Characteristics' : 'Fiziksel Özellikler',
        film: isEn ? 'Film & Television' : 'Sinema ve Televizyon',
        theater: isEn ? 'Theatre & Stage' : 'Tiyatro ve Sahne'
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    }

    // Split experience into categories for a better Actor layout
    const filmTv = experience.filter(exp => 
        exp.position?.toLowerCase().includes('film') || 
        exp.position?.toLowerCase().includes('tv') || 
        exp.position?.toLowerCase().includes('serial') || 
        exp.position?.toLowerCase().includes('movie')
    )
    const theater = experience.filter(exp => 
        exp.position?.toLowerCase().includes('theater') || 
        exp.position?.toLowerCase().includes('theatre') || 
        exp.position?.toLowerCase().includes('stage')
    )
    const otherExp = experience.filter(exp => !filmTv.includes(exp) && !theater.includes(exp))

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#fafaf9] text-[#1c1917] p-0 selection:bg-[#e11d48] selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem',
                lineHeight: '1.6'
            }}>

            {/* DRAMATIC BACKGROUND OVERLAY */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="w-full mx-auto min-h-[297mm] relative overflow-hidden flex flex-col bg-white shadow-2xl border-x border-stone-200"
            >
                {/* 1. THE SPOTLIGHT HEADER */}
                <header className="w-full relative py-20 px-10 px-16 border-b-[8px] border-black bg-stone-50">
                    <div className="flex flex-row gap-16 items-start justify-between relative z-10">
                        <div className="flex-1 space-y-10">
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-4 px-6 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-[0.5em] italic">
                                <Star className="w-4 h-4 text-[#e11d48]" /> ACTOR_PORTFOLIO_OS_5.0
                            </motion.div>
                            
                            <div className="space-y-4">
                                <motion.h1 
                                    variants={itemVariants} 
                                    className="text-7xl text-7xl font-black text-black tracking-tighter leading-none uppercase italic"
                                    style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.04em' }}
                                >
                                    {personal.fullName}
                                </motion.h1>
                                <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
                                     <p className="text-2xl font-bold tracking-[0.3em] text-[#e11d48] uppercase italic">
                                        {personal.title}
                                     </p>
                                     <div className="flex gap-2">
                                        {['SAG-AFTRA', 'AEA'].map(u => (
                                            <span key={u} className="px-2 py-0.5 border border-stone-300 text-[9px] font-black text-stone-500 uppercase tracking-widest">{u}</span>
                                        ))}
                                     </div>
                                </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-stone-400 border-t border-stone-200 pt-8">
                                {personal.email && <div className="flex items-center gap-3 hover:text-black transition-colors cursor-pointer"><Mail className="w-4 h-4 text-[#e11d48]" /> {personal.email}</div>}
                                {personal.phone && <div className="flex items-center gap-3 hover:text-black transition-colors cursor-pointer"><Phone className="w-4 h-4 text-[#e11d48]" /> {personal.phone}</div>}
                                {personal.location && <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-[#e11d48]" /> {personal.location}</div>}
                            </motion.div>
                        </div>

                        <motion.div variants={itemVariants} className="flex flex-col items-center items-end gap-10">
                             <div className="w-32 h-32 bg-stone-100 border-2 border-dashed border-stone-200 flex items-center justify-center relative group">
                                {theme?.showQrCode ? (
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={110} color="#000000" />
                                ) : (
                                    <Camera className="w-12 h-12 text-stone-300" />
                                )}
                                <div className="absolute -top-4 -right-4 bg-black text-white px-3 py-1 text-[8px] font-black italic tracking-widest shadow-lg">HEAD_SHOT_V1</div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#e11d48] mb-2">Representation</p>
                                <p className="text-sm font-black text-black">Talent Works Agency</p>
                                <p className="text-[11px] font-bold text-stone-400">agent@talentworks.com</p>
                             </div>
                        </motion.div>
                    </div>
                </header>

                <div className="w-full grid grid-cols-12 gap-0 border-b border-stone-100 flex-1">
                    
                    {/* LEFT PANEL: STATS & SKILLS */}
                    <aside className="col-span-4 p-10 space-y-24 bg-stone-50 border-r border-stone-200">
                        
                        {/* PHYSICAL CHARACTERISTICS */}
                        <section className="space-y-8 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300 mb-10 flex items-center gap-4 italic border-b border-stone-200 pb-4">
                                <Target className="w-5 h-5 text-[#e11d48]" /> {t.stats}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: isEn ? 'Height' : 'Boy', val: '6\'1"' },
                                    { label: isEn ? 'Eyes' : 'Göz', val: 'Brown' },
                                    { label: isEn ? 'Hair' : 'Saç', val: 'Dark Brown' },
                                    { label: isEn ? 'Voice' : 'Ses', val: 'Baritone' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 bg-white border border-stone-200 text-center group hover:border-[#e11d48] transition-all break-inside-avoid page-break-inside-avoid">
                                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-lg font-black text-black italic leading-none">{stat.val}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SPECIAL SKILLS */}
                        {skills.length > 0 && (
                            <section className="space-y-10 group break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300 flex items-center gap-4 italic mb-8">
                                    <Zap className="w-5 h-5 text-[#e11d48]" /> {t.expertise}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-4 group/item break-inside-avoid page-break-inside-avoid">
                                            <div className="w-2 h-2 rounded-full bg-[#e11d48] scale-0 group-hover/item:scale-100 transition-transform" />
                                            <p className="text-sm font-black text-black/80 tracking-widest uppercase italic group-hover/item:text-[#e11d48] transition-colors">{skill}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* LANGUAGES */}
                        {languages?.length > 0 && (
                            <section>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300 mb-12 flex items-center gap-4 italic">
                                    <Globe className="w-5 h-5 text-[#e11d48]" /> {isEn ? 'DIALECTS & LANGUAGES' : 'DİYALEKT VE DİL'}
                                </h3>
                                <div className="space-y-4">
                                    {languages.map((lang, i) => (
                                        <div key={i} className="p-4 bg-black text-white italic tracking-tighter hover:bg-[#e11d48] transition-all cursor-default break-inside-avoid page-break-inside-avoid">
                                            <p className="text-xl font-black uppercase">{lang.name}</p>
                                            <p className="text-[9px] font-black opacity-40 uppercase tracking-[0.3em]">{lang.level}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>

                    {/* MAIN CANVAS: CREDITS & PERFORMANCE */}
                    <main className="col-span-8 p-10 p-16 space-y-32">
                        
                        {/* PERFORMANCE CATEGORIES */}
                        
                        {/* 1. FILM & TV */}
                        <section className="space-y-16 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-[11px] font-black uppercase tracking-[1.5em] text-stone-200 mb-12 flex items-center gap-8 italic leading-none border-b border-stone-100 pb-6">
                                <Film className="w-7 h-7 text-[#e11d48]" /> {t.film}
                            </h2>
                            <div className="space-y-12">
                                {(filmTv.length > 0 ? filmTv : experience.slice(0, 3)).map((exp, i) => (
                                    <div key={i} className="group flex justify-between items-start gap-10 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-black text-black tracking-tight leading-none uppercase italic group-hover:text-[#e11d48] transition-colors">
                                                {exp.position}
                                            </h3>
                                            <p className="text-[11px] font-black text-stone-400 mt-4 uppercase tracking-[0.4em]">ROLE: {exp.company}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-stone-900 italic uppercase">Director Name</p>
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{exp.endDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. THEATRE */}
                        <section className="space-y-16 break-inside-avoid page-break-inside-avoid">
                            <h2 className="text-[11px] font-black uppercase tracking-[1.5em] text-stone-200 mb-12 flex items-center gap-8 italic leading-none border-b border-stone-100 pb-6">
                                <Film className="w-7 h-7 text-[#e11d48]" /> {t.theater}
                            </h2>
                            <div className="space-y-12">
                                {(theater.length > 0 ? theater : experience.slice(3, 5)).map((exp, i) => (
                                    <div key={i} className="group flex justify-between items-start gap-10 break-inside-avoid page-break-inside-avoid">
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-black text-black tracking-tight leading-none uppercase italic group-hover:text-[#e11d48] transition-colors">
                                                {exp.position}
                                            </h3>
                                            <p className="text-[11px] font-black text-stone-400 mt-4 uppercase tracking-[0.4em]">PROD: {exp.company}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-stone-900 italic uppercase">Stage / Venue</p>
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{exp.endDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* EDUCATION & TRAINING */}
                        {education.length > 0 && (
                            <section className="space-y-16 break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-[11px] font-black uppercase tracking-[1.5em] text-stone-200 mb-12 flex items-center gap-8 italic leading-none border-b border-stone-100 pb-6">
                                    <GraduationCap className="w-7 h-7 text-[#e11d48]" /> {t.education}
                                </h2>
                                <div className="grid grid-cols-2 gap-12">
                                    {education.map((edu, i) => (
                                        <div key={i} className="space-y-3 break-inside-avoid page-break-inside-avoid">
                                            <h4 className="text-2xl font-black italic text-black leading-tight uppercase">{edu.degree}</h4>
                                            <p className="text-xs font-black text-[#e11d48] uppercase tracking-[0.3em]">{edu.school}</p>
                                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Focus: Performance Art</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* AWARDS */}
                        <section className="p-12 border-2 border-black bg-stone-50 group hover:bg-[#e11d48] hover:border-[#e11d48] transition-all duration-700 break-inside-avoid page-break-inside-avoid">
                             <div className="flex items-center gap-6 mb-8 group-hover:text-white transition-colors">
                                <Award className="w-8 h-8 text-[#e11d48] group-hover:text-white" />
                                <h3 className="text-[11px] font-black uppercase tracking-[1em] italic leading-none">HONORS & RECOGNITION</h3>
                             </div>
                             <div className="space-y-6 group-hover:text-white transition-colors">
                                <p className="text-4xl font-black italic tracking-tighter leading-none uppercase">Best Emerging Actor // Festival 2024</p>
                                <p className="text-[11px] font-bold opacity-30 uppercase tracking-[0.5em]">Critical Reviewer Guild Award</p>
                             </div>
                        </section>
                    </main>
                </div>

                {/* THE CURTAIN FOOTER */}
                <footer className="w-full py-16 px-10 px-16 bg-black text-white flex flex-row justify-between items-center gap-20 group relative">
                    <div className="absolute top-0 left-0 w-full h-[6px] bg-[#e11d48]" />
                    <div className="flex flex-col items-start gap-8">
                         <div className="flex gap-2">
                             {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="w-1.5 h-12 bg-white/10 group-hover:bg-[#e11d48] transition-all duration-[2s]" style={{ opacity: i * 0.1 }} />)}
                        </div>
                        <div className="text-left font-black">
                             <p className="text-[16px] uppercase tracking-[1.5em] mb-4 text-[#e11d48] uppercase">{personal.fullName} // ACT_CORE_OS_5.0</p>
                             <p className="text-[9px] uppercase tracking-[0.4em] italic opacity-20 italic">Theatrical Mastery // Cinematic Presence // Artistic Resonance</p>
                        </div>
                    </div>
                    <div className="flex gap-12 text-white/10 group-hover:text-white transition-colors">
                         {[Share2, Globe, Camera, Mic2].map((Icon, i) => (
                             <motion.div key={i} whileHover={{ y: -20, scale: 1.5, color: '#e11d48' }}>
                                 <Icon className="w-10 h-10 cursor-pointer transition-colors" />
                             </motion.div>
                         ))}
                    </div>
                </footer>
            </motion.div>
        </div>
    )
}
