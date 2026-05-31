import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Sparkles, Wand2 } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function AuroraPremiumTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#ff0080' // Pink/Aurora vibe
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'The Evolution' : 'Gelişim Süreci',
        education: isEn ? 'The Roots' : 'Akademik Kökenler',
        skills: isEn ? 'The Essence' : 'Temel Yetiler',
        references: isEn ? 'The Network' : 'Bağlantı Ağı',
        hobbies: isEn ? 'The Lifestyle' : 'Yaşam Tarzı',
        contact: isEn ? 'Connect' : 'İletişim'
    }

    return (
        <div className="min-h-full bg-slate-950 text-slate-200 p-0 relative overflow-hidden"
            style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Aurora Background Effects */}
            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-sky-500/20 blur-[150px] rounded-full -mr-96 -mt-96 animate-pulse duration-[15s] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-pink-500/20 blur-[150px] rounded-full -ml-96 -mb-96 animate-pulse duration-[12s] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,0,128,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 p-8 md:p-12">
                {/* Modern Aurora Header */}
                <header className={`mb-16 flex flex-col md:flex-row gap-12 items-center transition-all duration-500 ${highlightedField === 'personal' ? 'scale-[1.02] bg-white/[0.03] p-8 rounded-[40px] ring-1 ring-white/10' : ''}`}>
                    {personal.photo && (
                        <div className="shrink-0 w-56 h-56 rounded-full p-2 bg-gradient-to-tr from-sky-400 via-pink-500 to-indigo-600 shadow-[0_0_50px_rgba(255,0,128,0.3)] border border-white/20">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-full" />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-8 backdrop-blur-3xl">
                            <Wand2 className="w-4 h-4 text-sky-400" /> STATUS: ACTIVATED
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-none bg-gradient-to-r from-white via-white to-sky-400 bg-clip-text text-transparent break-words">
                            {personal.fullName || 'Talent Name'}
                        </h1>
                        <p className="text-xl md:text-2xl font-bold italic tracking-widest text-transparent bg-gradient-to-r from-sky-400 to-pink-500 bg-clip-text mb-8">
                            {personal.title || 'Creative Specialist'}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {personal.email && <div className="flex items-center gap-2 hover:text-sky-400 transition-colors cursor-pointer"><Mail className="w-4 h-4" /> {personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2 hover:text-sky-400 transition-colors cursor-pointer"><Phone className="w-4 h-4" /> {personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2 hover:text-sky-400 transition-colors cursor-pointer"><MapPin className="w-4 h-4" /> {personal.location}</div>}
                        </div>
                    </div>
                    {theme?.showQrCode && (
                        <div className="shrink-0 p-6 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <QRCodeDisplay
                                value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                size={110}
                                color={accentColor}
                            />
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Side */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Aurora Summary */}
                        {personal.summary && (
                            <section className="p-12 md:p-16 rounded-[60px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 backdrop-blur-md relative overflow-hidden group">
                                <Quote className="w-16 h-16 text-sky-500/10 absolute top-8 right-8" />
                                <p className="text-2xl md:text-3xl leading-relaxed font-light text-slate-300 italic max-w-3xl relative z-10">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* Experience Aurora */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.01]' : ''}`}>
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white/30 mb-16 flex items-center gap-6">
                                    <span className="w-16 h-px bg-gradient-to-r from-sky-400 to-transparent" /> {t.experience}
                                </h2>
                                <div className="space-y-12">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-12 border-l border-white/5 group py-4">
                                            <div className="absolute -left-1 top-0 w-2 h-full bg-gradient-to-b from-sky-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full" />
                                            <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 gap-6">
                                                <h3 className="text-3xl font-black text-white group-hover:text-sky-400 transition-colors leading-tight italic">{exp.position}</h3>
                                                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase py-2 px-5 bg-white/5 rounded-full border border-white/5">
                                                    {exp.startDate} – {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold text-pink-500/80 uppercase tracking-widest mb-8">{exp.company}</p>
                                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References Aurora */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white/30 mb-16 flex items-center gap-6">
                                    <span className="w-16 h-px bg-gradient-to-r from-pink-500 to-transparent" /> {t.references}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all backdrop-blur-3xl group">
                                            <h4 className="text-2xl font-black text-white mb-2 group-hover:text-pink-400 transition-colors uppercase italic tracking-tighter">{ref.name}</h4>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8 border-b border-white/5 pb-4">{ref.company}</p>
                                            <div className="space-y-3 font-bold text-[10px] tracking-widest text-slate-600 group-hover:text-slate-200 transition-colors">
                                                <p>{ref.email}</p>
                                                <p>{ref.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Side */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Skills - Floating Orbs Style */}
                        {skills.length > 0 && (
                            <section className="p-12 rounded-[50px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-500/10 blur-3xl" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-sky-400 mb-12 flex items-center gap-3">
                                    <Sparkles className="w-4 h-4" /> {t.skills}
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold tracking-[0.2em] text-slate-300 hover:text-white hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-default uppercase italic">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education - Ethereal Cards */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.05]' : ''}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12">{t.education}</h3>
                                <div className="space-y-8">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="relative p-10 rounded-[40px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-sky-500/30 transition-all group">
                                            <span className="text-[9px] font-black text-slate-600 absolute top-8 right-8 uppercase tracking-widest">{edu.startDate} – {edu.endDate}</span>
                                            <h4 className="text-2xl font-black text-white mb-2 leading-tight uppercase italic tracking-tighter group-hover:text-sky-400 transition-colors">{edu.degree}</h4>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Lifestyle - Icons and Text */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10">{t.hobbies}</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {hobbies.map((h) => (
                                        <div key={h.id} className="p-5 rounded-[30px] bg-white/[0.01] border border-white/5 flex items-center gap-5 group hover:bg-white/[0.05] transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400/10 to-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,0,128,0.2)] transition-all">
                                                <Heart className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors italic">{h.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </aside>
                </div>

            </div>
        </div>
    )
}

