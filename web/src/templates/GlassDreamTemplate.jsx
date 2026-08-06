import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Sparkles, Layout } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function GlassDreamTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#38bdf8'
    const isEn = theme?.language === 'en'

    const t = {
        personal: isEn ? 'Bio' : 'Özgeçmiş',
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Expertise' : 'Uzmanlık',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Hobbies' : 'Hobiler',
        contact: isEn ? 'Contact' : 'İletişim'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#0a0c10] text-gray-200 p-0 relative overflow-hidden print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Soft Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-500/20 blur-[120px] rounded-full -mr-96 -mt-96 animate-pulse duration-[10s] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 blur-[100px] rounded-full -ml-48 -mb-48 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_70%)] -z-10" />

            <div className="relative z-10 p-8 md:p-12">
                {/* Header - Glass Orb Style */}
                <header className={`mb-16 flex flex-col md:flex-row gap-8 items-center p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 ${highlightedField === 'personal' ? 'scale-[1.03] ring-2 ring-sky-500/50' : ''}`}>
                    {personal.photo && (
                        <div className="shrink-0 w-48 h-48 rounded-[40px] overflow-hidden p-2 bg-gradient-to-br from-sky-500/20 to-purple-500/20 border border-white/20 shadow-2xl">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-[32px] brightness-110" />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-sky-400 mb-6 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5" /> IDLE_STATUS: PROFESSIONAL
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-none bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent break-words">
                            {personal.fullName || 'User Name'}
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-gray-500 uppercase tracking-widest mb-6">
                            {personal.title || 'Creative Technologist'}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-bold text-slate-500">
                            {personal.email && <div className="flex items-center gap-2 hover:text-sky-400 transition-colors cursor-pointer capitalize">{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2 hover:text-sky-400 transition-colors cursor-pointer capitalize">{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2 hover:text-sky-400 transition-colors cursor-pointer capitalize">{personal.location}</div>}
                        </div>
                    </div>
                    {theme?.showQrCode && (
                        <div className="shrink-0 p-4 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl hover:scale-110 transition-transform">
                            <QRCodeDisplay
                                value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                size={100}
                                color={accentColor}
                            />
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Side */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Glass Summary */}
                        {personal.summary && (
                            <section className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group break-inside-avoid page-break-inside-avoid">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                                <Quote className="w-12 h-12 text-sky-500/20 mb-6" />
                                <p className="text-2xl leading-relaxed font-light text-gray-300">
                                    {personal.summary}
                                </p>
                            </section>
                        )}

                        {/* Glass Experience */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.02]' : ''}`}>
                                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/40 mb-10 flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_10px_#38bdf8]" /> {t.experience}
                                </h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group backdrop-blur-sm relative overflow-hidden break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-0 right-0 p-8">
                                                <span className="text-[10px] font-black tracking-widest text-white/20 uppercase group-hover:text-sky-500/50 transition-colors">
                                                    {exp.startDate} – {exp.endDate}
                                                </span>
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-2xl font-black mb-1 text-white group-hover:text-sky-400 transition-colors">{exp.position}</h3>
                                                <p className="text-sm font-bold text-sky-500/80 uppercase tracking-widest mb-6">{exp.company}</p>
                                                <p className="text-base text-slate-500 leading-relaxed max-w-2xl font-medium">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Glass References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/40 mb-10 flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" /> {t.references}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-6 rounded-[32px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all backdrop-blur-lg break-inside-avoid page-break-inside-avoid">
                                            <h4 className="text-xl font-black text-white mb-1 italic">{ref.name}</h4>
                                            <p className="text-xs font-black uppercase tracking-widest text-purple-400/80 mb-6">{ref.company}</p>
                                            <div className="space-y-2 opacity-40 hover:opacity-100 transition-opacity">
                                                <p className="text-[10px] font-black tracking-[0.2em]">{ref.email}</p>
                                                <p className="text-[10px] font-black tracking-[0.2em]">{ref.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Glass Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Skills - Floating Blocks */}
                        {skills.length > 0 && (
                            <section className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-xl break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-sky-400 mb-10 flex items-center gap-3">
                                    <Layout className="w-4 h-4" /> {t.skills}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="group flex items-center gap-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="relative w-full h-2 rounded-full bg-white/5 overflow-hidden">
                                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-400 to-purple-500 w-[70%] group-hover:w-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                                            </div>
                                            <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education - Transparent Cards */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.05]' : ''}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-10 flex items-center gap-4">
                                    <GraduationCap className="w-4 h-4" /> {t.education}
                                </h3>
                                <div className="space-y-6">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="relative p-6 rounded-[32px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.05] transition-all break-inside-avoid page-break-inside-avoid">
                                            <span className="text-[9px] font-black text-white/20 absolute top-6 right-6">{edu.startDate} – {edu.endDate}</span>
                                            <h4 className="text-lg font-black text-white mb-1">{edu.degree}</h4>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies - Soft Circles */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-8">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {hobbies.map((h) => (
                                        <div key={h.id} className="px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-sky-500/50 hover:bg-white/5 transition-all text-[11px] font-bold text-slate-500 flex items-center gap-2 group break-inside-avoid page-break-inside-avoid">
                                            <Heart className="w-3 h-3 group-hover:fill-sky-500 group-hover:text-sky-500 transition-all" /> {h.name}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Custom Sections */}
                        {customSections?.length > 0 && customSections.map((section) => (
                            <section key={section.id} className="p-8 rounded-[40px] bg-sky-500/5 border border-sky-500/10">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-sky-400 mb-6">{section.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                    {section.content}
                                </p>
                            </section>
                        ))}
                    </aside>
                </div>

                {/* Glass Footer */}
            </div>
        </div>
    )
}

