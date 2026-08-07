import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ModernTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#0f172a'
    const fontSize = theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem'
    const isEn = theme?.language === 'en'

    const t = {
        contact: isEn ? 'Contact' : 'İletişim',
        expertise: isEn ? 'Expertise' : 'Uzmanlık',
        languages: isEn ? 'Languages' : 'Diller',
        interests: isEn ? 'Interests' : 'İlgi Alanları',
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        projects: isEn ? 'Projects' : 'Projeler',
        certifications: isEn ? 'Certifications' : 'Sertifikalar',
        references: isEn ? 'References' : 'Referanslar'
    }

    return (
        <div id="cv-template-wrapper" className="flex min-h-[297mm] bg-white text-slate-900 print-exact mx-auto print:mx-0 overflow-hidden"
            style={{
                fontFamily: theme.fontFamily ? `'${theme.fontFamily}', sans-serif` : "'Inter', -apple-system, sans-serif",
                fontSize: fontSize
            }}
        >
            {/* Left Column - Minimalist & Elegant */}
            <div className="w-[32%] bg-slate-50 border-r border-slate-200 p-8 flex flex-col">
                <div className={`mb-10 transition-all duration-500 ${highlightedField?.startsWith('personal') ? 'scale-105 ring-4 ring-cyan-500/20 rounded-2xl p-2 bg-cyan-500/5' : ''}`}>
                    {personal.photo ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-5 border-4 border-white shadow-md">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white text-3xl font-bold mb-5 shadow-md border-4 border-white leading-none">
                            {personal.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                    )}
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-2">
                        {personal.fullName}
                    </h1>
                    <p
                        className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                        style={{ color: accentColor }}
                    >
                        {personal.title}
                    </p>
                </div>

                <div className="space-y-8 flex-1">
                    <section className="break-inside-avoid">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-200">
                            {t.contact}
                        </h2>
                        <div className="space-y-4 text-[11px] font-medium text-slate-700">
                            {personal.email && (
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-md bg-white shadow-sm border border-slate-100">
                                        <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />
                                    </div>
                                    <span className="break-all">{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-md bg-white shadow-sm border border-slate-100">
                                        <Phone className="w-3.5 h-3.5" style={{ color: accentColor }} />
                                    </div>
                                    <span>{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-md bg-white shadow-sm border border-slate-100">
                                        <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                                    </div>
                                    <span>{personal.location}</span>
                                </div>
                            )}
                            {personal.linkedin && (
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-md bg-white shadow-sm border border-slate-100">
                                        <Linkedin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                                    </div>
                                    <span className="break-all">{personal.linkedin}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="break-inside-avoid">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-200">
                            {t.expertise}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(s => (
                                <span
                                    key={s}
                                    className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-700 shadow-sm"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="break-inside-avoid">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-200">
                            {t.languages}
                        </h2>
                        <div className="space-y-3">
                            {languages.map(lang => (
                                <div key={lang.name} className="flex justify-between items-center text-[11px] font-bold break-inside-avoid">
                                    <span className="text-slate-800">{lang.name}</span>
                                    <span className="text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded-full">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {hobbies && hobbies.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 pb-2 border-b border-slate-200">
                                {t.interests}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {hobbies.map(hobby => (
                                    <div key={hobby.id} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-700 flex items-center gap-1.5 shadow-sm break-inside-avoid">
                                        <span style={{ color: accentColor }}>•</span> {hobby.name}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="pt-8 mt-8 border-t border-slate-200">
                    {theme.showQrCode && (personal.website || personal.linkedin) && (
                        <div className="flex justify-center">
                            <QRCodeDisplay
                                url={personal.website || personal.linkedin}
                                label={personal.website ? 'Web Sitesi' : 'LinkedIn'}
                                size={72}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column - Premium Structured Content */}
            <div className="flex-1 p-10">
                {personal.summary && (
                    <section className="mb-12 break-inside-avoid relative">
                        <Quote className="absolute -top-3 -left-3 w-10 h-10 text-slate-100 -z-10" />
                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed">
                            {personal.summary}
                        </p>
                    </section>
                )}

                <div className="space-y-10">
                    <section>
                        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 mb-6 flex items-center gap-3">
                            <Briefcase className="w-4 h-4" style={{ color: accentColor }} />
                            {t.experience}
                        </h2>
                        <div className={`space-y-7 transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.01] ring-4 ring-cyan-500/20 rounded-xl p-2 bg-cyan-500/5' : ''}`}>
                            {experience.map(exp => (
                                <div key={exp.id} className="relative pl-5 border-l-2 break-inside-avoid" style={{ borderColor: accentColor + '30' }}>
                                    <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5 bg-white border-2" style={{ borderColor: accentColor }} />
                                    
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-1">
                                        <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                                            {exp.position}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 whitespace-nowrap">
                                            {exp.startDate} — {exp.endDate}
                                        </span>
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-700 mb-2" style={{ color: accentColor }}>
                                        {exp.company}
                                    </p>
                                    <p className="text-[12px] text-slate-600 leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 mb-6 flex items-center gap-3">
                            <GraduationCap className="w-4 h-4" style={{ color: accentColor }} />
                            {t.education}
                        </h2>
                        <div className={`space-y-6 transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.01] ring-4 ring-cyan-500/20 rounded-xl p-2 bg-cyan-500/5' : ''}`}>
                            {education.map(edu => (
                                <div key={edu.id} className="relative pl-5 border-l-2 break-inside-avoid" style={{ borderColor: accentColor + '30' }}>
                                    <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5 bg-white border-2" style={{ borderColor: accentColor }} />
                                    
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-1">
                                        <h4 className="text-[13px] font-bold text-slate-900">
                                            {edu.school}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                            {edu.startDate} — {edu.endDate}
                                        </span>
                                    </div>
                                    <p className="text-[12px] font-medium text-slate-600">
                                        {edu.degree}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 mb-5 flex items-center gap-3">
                                <Globe className="w-4 h-4" style={{ color: accentColor }} />
                                {t.projects}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.map(p => (
                                    <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl break-inside-avoid">
                                        <h4 className="font-bold text-slate-900 text-[13px] mb-1">{p.name}</h4>
                                        <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">{p.description}</p>
                                        {p.link && (
                                            <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                                                <Globe className="w-3 h-3" /> Link
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications && certifications.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 mb-5 flex items-center gap-3">
                                <Award className="w-4 h-4" style={{ color: accentColor }} />
                                {t.certifications}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {certifications.map(c => (
                                    <div key={c.id} className="flex flex-col p-3 border border-slate-200 rounded-lg break-inside-avoid">
                                        <h5 className="text-[12px] font-bold text-slate-900 mb-0.5">{c.name}</h5>
                                        <p className="text-[11px] text-slate-600 mb-2">{c.issuer}</p>
                                        <span className="text-[10px] font-bold text-slate-400 mt-auto">
                                            {c.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {references && references.length > 0 && (
                        <section>
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 mb-5 flex items-center gap-3">
                                <Users className="w-4 h-4" style={{ color: accentColor }} />
                                {t.references}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {references.map(ref => (
                                    <div key={ref.id} className="break-inside-avoid">
                                        <h4 className="font-bold text-slate-900 text-[13px]">{ref.name}</h4>
                                        <p className="text-[11px] font-medium text-slate-500 mb-1">{ref.company}</p>
                                        <div className="text-[11px] text-slate-600">
                                            {ref.phone && <p>{ref.phone}</p>}
                                            {ref.email && <p>{ref.email}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {customSections && customSections.map(section => (
                        <section key={section.id} className="break-inside-avoid">
                            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 mb-5 flex items-center gap-3">
                                <Award className="w-4 h-4 opacity-0" /> {/* Spacer */}
                                {section.title}
                            </h2>
                            <p className="text-[12px] text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
