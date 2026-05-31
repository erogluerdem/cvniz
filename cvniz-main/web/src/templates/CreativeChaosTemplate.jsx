import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Palette, Sparkles, Zap } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CreativeChaosTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#ec4899' // Pink
    const isEn = theme?.language === 'en'

    const t = {
        personal: isEn ? 'THE ORIGIN' : 'BAŞLANGIÇ',
        experience: isEn ? 'THE IMPACT' : 'ETKİ ALANI',
        education: isEn ? 'THE LOGIC' : 'MANTIK',
        skills: isEn ? 'THE POWER' : 'GÜÇ',
        references: isEn ? 'THE ALLIES' : 'MÜTTEFİKLER',
        hobbies: isEn ? 'THE VIBE' : 'TAVIR',
        contact: isEn ? 'CONNECT' : 'TEMAS'
    }

    return (
        <div className="min-h-full bg-[#111111] text-white p-0 relative overflow-hidden selection:bg-pink-500 selection:text-white"
            style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Creative Chaos Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-600/20 blur-[120px] rounded-full -mr-48 -mt-48 animate-pulse pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -ml-32 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 p-8 md:p-12">
                {/* Explosive Header */}
                <header className={`mb-20 relative transition-all duration-700 ${highlightedField === 'personal' ? 'scale-105' : ''}`}>
                    <div className="absolute -top-10 -left-6 text-[6rem] font-black text-white/[0.03] uppercase pointer-events-none select-none tracking-tighter">
                        Impact
                    </div>
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-pink-500 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8 -rotate-3 hover:rotate-0 transition-transform shadow-[10px_10px_0px_rgba(236,72,153,0.3)]">
                        <Zap className="w-4 h-4" /> CREATIVE_FORCE_ID: 25.0
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-[0.75] tracking-tighter mb-6 uppercase italic transition-all hover:tracking-normal cursor-default break-words">
                        {personal.fullName || 'Creative Name'}
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <p className="text-2xl md:text-3xl font-light uppercase tracking-widest text-pink-500 underline decoration-4 underline-offset-8">
                            {personal.title || 'Digital Alchemist'}
                        </p>

                        <div className="shrink-0 space-y-4 text-xs font-black uppercase tracking-widest text-right border-r-4 border-emerald-500 pr-8">
                            {personal.email && <div className="hover:text-pink-500 transition-colors">{personal.email}</div>}
                            {personal.phone && <div className="hover:text-emerald-500 transition-colors uppercase">TX: {personal.phone}</div>}
                            {personal.location && <div className="hover:text-indigo-400 transition-colors">{personal.location}</div>}
                        </div>
                    </div>

                    {personal.photo && (
                        <div className="absolute -bottom-24 -right-12 w-64 h-64 md:w-80 md:h-80 -rotate-6 group hover:rotate-0 transition-all duration-700 shadow-[20px_20px_60px_rgba(0,0,0,0.5)] z-20">
                            <div className="absolute inset-0 bg-pink-500/20 mix-blend-overlay z-10" />
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover border-8 border-white grayscale hover:grayscale-0 transition-all" />
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
                    {/* Left - Story & Experience */}
                    <div className="lg:col-span-8 space-y-24">
                        {/* Summary */}
                        {personal.summary && (
                            <section className="relative group max-w-2xl">
                                <Quote className="absolute -top-12 -left-12 w-24 h-24 text-white/[0.05]" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10">{t.personal}</h2>
                                <p className="text-xl md:text-2xl font-bold leading-tight uppercase tracking-tighter text-white/90">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* Experience Chaos */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'bg-white/5 p-12 rounded-[80px]' : ''}`}>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-20 flex items-center gap-8">
                                    <div className="w-20 h-[1px] bg-pink-500" /> {t.experience}
                                </h2>
                                <div className="space-y-16">
                                    {experience.map((exp, idx) => (
                                        <div key={exp.id} className={`group relative p-12 hover:bg-white/[0.02] transition-colors border-l-8 ${idx % 2 === 0 ? 'border-pink-500' : 'border-indigo-500'}`}>
                                            <div className="absolute -top-10 right-0">
                                                <span className="text-[8rem] font-black text-white/[0.03] leading-none select-none">0{idx + 1}</span>
                                            </div>
                                            <div className="relative z-10">
                                                <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-8">
                                                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter group-hover:italic transition-all leading-none">{exp.position}</h3>
                                                    <span className="text-sm font-black tracking-widest text-slate-500 bg-white/5 px-6 py-2 rounded-full uppercase italic">
                                                        {exp.startDate} :: {exp.endDate}
                                                    </span>
                                                </div>
                                                <p className="text-lg font-bold uppercase tracking-widest mb-8 text-white/60">@ {exp.company}</p>
                                                <p className="text-xl leading-relaxed font-light text-slate-400 group-hover:text-white transition-colors">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Allies (References) */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-16">{t.references}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-black uppercase tracking-widest">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-10 bg-white shadow-[15px_15px_0px_#ec4899] hover:shadow-none hover:translate-x-3 hover:translate-y-3 transition-all text-black">
                                            <p className="text-2xl mb-2 italic tracking-tighter">{ref.name}</p>
                                            <p className="text-[10px] opacity-40 mb-8">{ref.company}</p>
                                            <div className="space-y-1 text-[10px] underline underline-offset-4 decoration-pink-500">
                                                <p>{ref.email}</p>
                                                <p>{ref.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right - Skills & Power */}
                    <aside className="lg:col-span-4 space-y-20">
                        {/* Power (Skills) */}
                        {skills.length > 0 && (
                            <section className="p-12 bg-white text-black shadow-[20px_20px_0px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                                <Palette className="absolute -bottom-10 -left-10 w-40 h-40 text-black/[0.05] -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12 flex items-center gap-4">
                                    {t.skills} <Sparkles className="w-5 h-5 text-pink-500" />
                                </h3>
                                <div className="flex flex-col gap-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex justify-between items-center group/skill">
                                            <span className="text-xl font-black uppercase tracking-tighter group-hover/skill:translate-x-4 transition-transform">{skill}</span>
                                            <div className="w-12 h-2 bg-pink-500 group-hover/skill:w-full transition-all duration-700" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Logic (Education) */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.05]' : ''}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12">{t.education}</h3>
                                <div className="space-y-12">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="relative pt-8 border-t-[4px] border-white/5 group overflow-hidden">
                                            <div className="absolute bottom-0 right-0 h-full w-full bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                            <div className="text-[10px] font-black text-pink-500 mb-2">{edu.startDate} :: {edu.endDate}</div>
                                            <h4 className="text-2xl font-black uppercase tracking-tight mb-2 italic relative z-10">{edu.degree}</h4>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest relative z-10">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Vibe (Hobbies) */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-12">{t.hobbies}</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {hobbies.map((h) => (
                                        <div key={h.id} className="p-4 border-2 border-white/5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald-500 hover:text-white transition-all cursor-default flex items-center gap-4 group">
                                            <div className="w-2 h-2 rounded-full bg-pink-500 group-hover:bg-white" />
                                            {h.name}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Digital ID (QR) */}
                        {theme?.showQrCode && (
                            <div className="p-10 border-[10px] border-white/5 bg-white shadow-2xl group hover:border-pink-500 transition-colors">
                                <QRCodeDisplay
                                    value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                    size={150}
                                    color="#000000"
                                />
                                <p className="text-[8px] font-black uppercase tracking-[1em] mt-8 text-black opacity-30 text-center">Identity Verified</p>
                            </div>
                        )}
                    </aside>
                </div>

            </div>
        </div>
    )
}

