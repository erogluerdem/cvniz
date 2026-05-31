import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Calendar, ArrowDown } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function VerticalTimelineTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#f59e0b' // Amber
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'The Journey' : 'Kariyer Yolculuğu',
        education: isEn ? 'The Foundation' : 'Akademik Temel',
        skills: isEn ? 'The Toolkit' : 'Araç Seti',
        references: isEn ? 'The Witnesses' : 'Referanslar',
        hobbies: isEn ? 'The Life' : 'Yaşam Tarzı',
        contact: isEn ? 'Connect' : 'İletişim'
    }

    return (
        <div className="min-h-full bg-stone-100 p-0 sm:p-8 flex justify-center py-10"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>
            <div className="w-[210mm] min-h-[297mm] mx-auto bg-[#fafaf9] shadow-2xl flex flex-col border border-stone-200 overflow-hidden">

                {/* Split Header */}
                <header className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-stone-200">
                    <div className="p-6 md:p-10 bg-stone-900 text-white flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

                        <div className={`relative z-10 transition-all duration-500 ${highlightedField === 'personal' ? 'scale-105' : ''}`}>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-6 italic break-words">
                                {personal.fullName || 'Talent Name'}
                            </h1>
                            <p className="text-2xl font-bold uppercase tracking-[0.3em] opacity-60" style={{ color: accentColor }}>
                                {personal.title || 'Professional Specialist'}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 bg-white flex flex-col justify-center gap-10">
                        <div className="space-y-6 text-sm font-bold uppercase tracking-widest text-stone-400">
                            {personal.email && <div className="flex items-center gap-4 hover:text-stone-900 transition-colors"><Mail className="w-5 h-5" style={{ color: accentColor }} /> {personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-4 hover:text-stone-900 transition-colors"><Phone className="w-5 h-5" style={{ color: accentColor }} /> {personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-4 hover:text-stone-900 transition-colors"><MapPin className="w-5 h-5" style={{ color: accentColor }} /> {personal.location}</div>}
                        </div>
                        {personal.photo && (
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 bg-stone-50 shadow-xl" style={{ borderColor: accentColor }}>
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale brightness-110" />
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    {/* Intro Summary */}
                    {personal.summary && (
                        <section className="mb-16 max-w-4xl mx-auto text-center">
                            <Quote className="w-12 h-12 mx-auto mb-6 opacity-10" style={{ color: accentColor }} />
                            <p className="text-lg md:text-xl leading-relaxed italic text-stone-600 font-light">
                                "{personal.summary}"
                            </p>
                            <div className="mt-12 flex flex-col items-center gap-4">
                                <span className="text-[10px] font-black tracking-[0.5em] text-stone-300 uppercase">Scroll Through History</span>
                                <ArrowDown className="w-6 h-6 animate-bounce text-stone-300" />
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                        {/* The Timeline Central Axis (Desktop only) */}
                        <div className="absolute left-[50%] top-0 bottom-0 w-[2px] bg-stone-200 hidden lg:block -translate-x-1/2" />

                        {/* Timeline experience */}
                        {experience.length > 0 && (
                            <div className="lg:col-span-12 space-y-24">
                                <h2 className="text-center text-[10px] font-black uppercase tracking-[1em] text-stone-300 mb-20 relative z-20 bg-[#fafaf9] inline-block left-1/2 -translate-x-1/2 px-10">
                                    {t.experience}
                                </h2>

                                <div className="space-y-20">
                                    {experience.map((exp, idx) => (
                                        <div key={exp.id} className={`flex flex-col lg:flex-row items-center gap-6 lg:gap-10 relative ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                            {/* Timeline Dot */}
                                            <div className="absolute left-[50%] -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 p-1 z-30 hidden lg:flex items-center justify-center shadow-lg" style={{ borderColor: accentColor }}>
                                                <div className="w-full h-full rounded-full" style={{ backgroundColor: accentColor }} />
                                            </div>

                                            <div className="flex-1 w-full text-center lg:text-right">
                                                {idx % 2 === 0 ? (
                                                    <div className="space-y-4">
                                                        <span className="text-xl font-black italic opacity-20">{exp.startDate} – {exp.endDate}</span>
                                                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{exp.position}</h3>
                                                        <p className="text-sm font-bold uppercase tracking-widest italic" style={{ color: accentColor }}>{exp.company}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm leading-relaxed text-stone-600 font-medium lg:text-left">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex-1 w-full text-center lg:text-left">
                                                {idx % 2 !== 0 ? (
                                                    <div className="space-y-4">
                                                        <span className="text-xl font-black italic opacity-20">{exp.startDate} – {exp.endDate}</span>
                                                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{exp.position}</h3>
                                                        <p className="text-sm font-bold uppercase tracking-widest italic" style={{ color: accentColor }}>{exp.company}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm leading-relaxed text-stone-600 font-medium lg:text-right">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Lower Grid - Education & Skills */}
                        <div className="lg:col-span-6 space-y-16">
                            {education.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-black uppercase tracking-widest border-b-4 border-stone-200 mb-12 inline-block italic">{t.education}</h3>
                                    <div className="space-y-12">
                                        {education.map((edu) => (
                                            <div key={edu.id} className="group relative pl-10 border-l-2 border-stone-200">
                                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-stone-300 group-hover:bg-amber-500 transition-colors" />
                                                <h4 className="text-xl font-black tracking-tight mb-2 italic">{edu.degree}</h4>
                                                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">{edu.school}</p>
                                                <p className="text-[10px] font-black italic opacity-30">{edu.startDate} – {edu.endDate}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="lg:col-span-6 space-y-16">
                            {skills.length > 0 && (
                                <section>
                                    <h3 className="text-xl font-black uppercase tracking-widest border-b-4 border-stone-200 mb-12 inline-block italic">{t.skills}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {skills.map((skill, i) => (
                                            <div key={i} className="flex items-center gap-4 bg-white p-4 border border-stone-100 shadow-sm hover:shadow-md transition-all">
                                                <div className="w-1.5 h-10" style={{ backgroundColor: accentColor }} />
                                                <span className="text-xs font-black uppercase tracking-widest">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* References & Footer Section */}
                        <div className="lg:col-span-12 pt-24 border-t border-stone-100 flex flex-col md:flex-row justify-between items-start gap-20">
                            {references?.length > 0 && (
                                <div className="flex-1 w-full space-y-12">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-300">{t.references}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {references.map((ref) => (
                                            <div key={ref.id}>
                                                <p className="text-xl font-black italic mb-2 uppercase">{ref.name}</p>
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-6">{ref.company}</p>
                                                <p className="text-[10px] font-black underline underline-offset-8 decoration-amber-500">{ref.email} // {ref.phone}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="shrink-0 w-full md:w-auto flex flex-col items-center md:items-end gap-12">
                                {theme?.showQrCode && (
                                    <div className="p-6 bg-stone-900 shadow-2xl rounded-3xl relative overflow-hidden group">
                                        <div className="absolute -top-10 -left-10 w-20 h-20 bg-amber-500/20 blur-2xl group-hover:scale-150 transition-transform" />
                                        <QRCodeDisplay
                                            value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                            size={120}
                                            color="#ffffff"
                                        />
                                        <p className="mt-4 text-[7px] font-black uppercase tracking-[1em] text-white/20 text-center">Identity confirmed</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

