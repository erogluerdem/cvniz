import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ModernTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#0f172a'
    const fontSize = theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
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
        <div
            className="flex min-h-full bg-white text-slate-900"
            style={{
                fontFamily: theme.fontFamily ? `'${theme.fontFamily}', sans-serif` : "'Inter', sans-serif",
                fontSize: fontSize
            }}
        >
            {/* Left Column - Minimalist & Elegant */}
            <div className="w-[30%] bg-[#f8f9fa] border-r border-slate-100 p-6 md:p-8 flex flex-col">
                <div className={`mb-8 transition-all duration-500 ${highlightedField?.startsWith('personal') ? 'scale-105 ring-4 ring-cyan-500/20 rounded-2xl p-2 bg-cyan-500/5' : ''}`}>
                    {personal.photo ? (
                        <img src={personal.photo} alt={personal.fullName} className="w-20 h-20 rounded-2xl object-cover mb-4 shadow-lg border-2 border-white" />
                    ) : (
                        <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg leading-none">
                            {personal.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                    )}
                    <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-tight mb-1 italic">
                        {personal.fullName?.toUpperCase()}
                    </h1>
                    <p
                        className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] border-b pb-1 inline-block"
                        style={{ borderColor: accentColor }}
                    >
                        {personal.title}
                    </p>
                </div>

                <div className="space-y-6 flex-1">
                    <section className="break-inside-avoid">
                        <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            {t.contact} <div className="flex-1 h-px bg-slate-200" />
                        </h2>
                        <div className="space-y-3 text-[10px] font-medium text-slate-600">
                            {personal.email && (
                                <div className="flex items-start gap-2 group">
                                    <Mail className="w-3.5 h-3.5 text-slate-900 mt-0.5 shrink-0" />
                                    <span className="break-all">{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-start gap-2">
                                    <Phone className="w-3.5 h-3.5 text-slate-900 mt-0.5 shrink-0" />
                                    <span>{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-slate-900 mt-0.5 shrink-0" />
                                    <span>{personal.location}</span>
                                </div>
                            )}
                            {personal.linkedin && (
                                <div className="flex items-start gap-2">
                                    <Linkedin className="w-3.5 h-3.5 text-slate-900 mt-0.5 shrink-0" />
                                    <span className="break-all">{personal.linkedin}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="break-inside-avoid">
                        <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            {t.expertise} <div className="flex-1 h-px bg-slate-200" />
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map(s => (
                                <span
                                    key={s}
                                    className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[8.5px] font-bold uppercase tracking-wider text-slate-700 transition-colors"
                                    style={{ borderLeftColor: accentColor, borderLeftWidth: '3px' }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="break-inside-avoid">
                        <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            {t.languages} <div className="flex-1 h-px bg-slate-200" />
                        </h2>
                        <div className="space-y-2">
                            {languages.map(lang => (
                                <div key={lang.name} className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-800">{lang.name}</span>
                                    <span className="text-slate-400 italic">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Hobbies Section - In Sidebar for Modern */}
                    {hobbies && hobbies.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                {t.interests} <div className="flex-1 h-px bg-slate-200" />
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                {hobbies.map(hobby => (
                                    <div key={hobby.id} className="px-2 py-1 bg-white border border-slate-100 rounded text-[9px] font-bold text-slate-600 flex items-center gap-1.5">
                                        <Heart className="w-2.5 h-2.5 text-pink-500" />
                                        {hobby.name}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="pt-6 border-t border-slate-200">
                    {theme.showQrCode && (personal.website || personal.linkedin) && (
                        <div className="mb-4">
                            <QRCodeDisplay
                                url={personal.website || personal.linkedin}
                                label={personal.website ? 'Web Sitesi' : 'LinkedIn Profili'}
                                size={64}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column - Premium Structured Content */}
            <div className="flex-1 p-8 md:p-12">
                {personal.summary && (
                    <section className="mb-10 break-inside-avoid">
                        <div className="flex items-start gap-4">
                            <Quote className="w-8 h-8 text-slate-100 shrink-0" style={{ color: accentColor + '20' }} />
                            <p
                                className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 pl-6"
                                style={{ borderColor: accentColor }}
                            >
                                {personal.summary}
                            </p>
                        </div>
                    </section>
                )}

                <div className="space-y-12">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-4">
                            {t.experience} <div className="flex-1 h-px bg-slate-100" />
                        </h2>
                        <div className={`space-y-8 transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.01] ring-4 ring-cyan-500/20 rounded-xl p-2 bg-cyan-500/5' : ''}`}>
                            {experience.map(exp => (
                                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 group break-inside-avoid">
                                    <div className="md:col-span-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1 italic">
                                            {exp.startDate} — {exp.endDate}
                                        </p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <div className="mb-1">
                                            <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-slate-600 transition-colors">
                                                {exp.position}
                                            </h3>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                {exp.company}
                                            </p>
                                        </div>
                                        <p
                                            className="text-xs text-slate-500 leading-relaxed font-medium mt-3 border-l-2 pl-4"
                                            style={{ borderColor: accentColor + '40' }}
                                        >
                                            {exp.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-4">
                            {t.education} <div className="flex-1 h-px bg-slate-100" />
                        </h2>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.01] ring-4 ring-cyan-500/20 rounded-xl p-2 bg-cyan-500/5' : ''}`}>
                            {education.map(edu => (
                                <div key={edu.id} className="p-4 bg-[#f8f9fa] border border-slate-100 rounded hover:border-slate-300 transition-all group break-inside-avoid">
                                    <p className="text-[8px] font-black text-slate-400 mb-1.5 uppercase tracking-widest italic">
                                        {edu.startDate} - {edu.endDate}
                                    </p>
                                    <h4 className="font-black text-slate-900 text-[11px] mb-0.5 uppercase tracking-tighter">
                                        {edu.school}
                                    </h4>
                                    <p className="text-[10px] font-bold text-slate-500 italic opacity-70">
                                        {edu.degree}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects Section */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-4">
                                {t.projects} <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {projects.map(p => (
                                    <div key={p.id} className="p-4 bg-[#f8f9fa] border border-slate-100 rounded hover:border-slate-300 transition-all break-inside-avoid">
                                        <h4 className="font-black text-slate-900 text-xs mb-1.5">{p.name}</h4>
                                        <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{p.description}</p>
                                        {p.link && (
                                            <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} className="text-[9px] font-bold uppercase tracking-widest break-all" style={{ color: accentColor }}>
                                                {p.link}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications Section */}
                    {certifications && certifications.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-4">
                                {t.certifications} <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <div className="space-y-3">
                                {certifications.map(c => (
                                    <div key={c.id} className="flex justify-between items-center py-2 border-b border-slate-100 break-inside-avoid">
                                        <div>
                                            <h5 className="text-[11px] font-bold text-slate-800">{c.name}</h5>
                                            <p className="text-[9px] text-slate-500 uppercase tracking-widest">{c.issuer}</p>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2.5 py-0.5 bg-slate-50 rounded-full" style={{ borderLeft: `2px solid ${accentColor}` }}>
                                            {c.date}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* References Section */}
                    {references && references.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-4">
                                {t.references} <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {references.map(ref => (
                                    <div key={ref.id} className="p-4 border-l-2 break-inside-avoid" style={{ borderColor: accentColor + '40' }}>
                                        <h4 className="font-bold text-slate-900 text-[11px] mb-0.5">{ref.name}</h4>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{ref.company}</p>
                                        <div className="space-y-0.5 text-[10px] text-slate-500 font-medium">
                                            {ref.phone && <p>{ref.phone}</p>}
                                            {ref.email && <p>{ref.email}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Custom Sections */}
                    {customSections && customSections.map(section => (
                        <section key={section.id} className="break-inside-avoid">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-4">
                                {section.title} <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium pl-4 border-l-2" style={{ borderColor: accentColor + '40' }}>
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    )
}
