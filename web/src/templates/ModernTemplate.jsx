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
            <div className="w-[32%] bg-[#f8f9fa] border-r border-slate-100 p-10 flex flex-col">
                <div className={`mb-12 transition-all duration-500 ${highlightedField?.startsWith('personal') ? 'scale-105 ring-4 ring-cyan-500/20 rounded-2xl p-2 bg-cyan-500/5' : ''}`}>
                    {personal.photo ? (
                        <img src={personal.photo} alt={personal.fullName} className="w-24 h-24 rounded-2xl object-cover mb-6 shadow-xl border-2 border-white" />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-3xl font-bold mb-6 shadow-xl leading-none">
                            {personal.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                    )}
                    <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-tight mb-2 italic">
                        {personal.fullName?.toUpperCase()}
                    </h1>
                    <p
                        className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] border-b-2 pb-2 inline-block"
                        style={{ borderColor: accentColor }}
                    >
                        {personal.title}
                    </p>
                </div>

                <div className="space-y-10 flex-1">
                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                            {t.contact} <div className="flex-1 h-px bg-slate-200" />
                        </h2>
                        <div className="space-y-4 text-[11px] font-medium text-slate-600">
                            {personal.email && (
                                <div className="flex items-start gap-3 group">
                                    <Mail className="w-4 h-4 text-slate-900 mt-0.5" />
                                    <span className="break-all">{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-4 h-4 text-slate-900 mt-0.5" />
                                    <span>{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-4 h-4 text-slate-900 mt-0.5" />
                                    <span>{personal.location}</span>
                                </div>
                            )}
                            {personal.linkedin && (
                                <div className="flex items-start gap-3">
                                    <Linkedin className="w-4 h-4 text-slate-900 mt-0.5" />
                                    <span className="break-all">{personal.linkedin}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                            {t.expertise} <div className="flex-1 h-px bg-slate-200" />
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(s => (
                                <span
                                    key={s}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold uppercase tracking-wider text-slate-700 transition-colors"
                                    style={{ borderLeftColor: accentColor, borderLeftWidth: '3px' }}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                            {t.languages} <div className="flex-1 h-px bg-slate-200" />
                        </h2>
                        <div className="space-y-3">
                            {languages.map(lang => (
                                <div key={lang.name} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-slate-800">{lang.name}</span>
                                    <span className="text-slate-400 italic">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Hobbies Section - In Sidebar for Modern */}
                    {hobbies && hobbies.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
                                {t.interests} <div className="flex-1 h-px bg-slate-200" />
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {hobbies.map(hobby => (
                                    <div key={hobby.id} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-2">
                                        <Heart className="w-3 h-3 text-pink-500" />
                                        {hobby.name}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="pt-10 border-t border-slate-200">
                    {theme.showQrCode && (personal.website || personal.linkedin) && (
                        <div className="mb-6">
                            <QRCodeDisplay
                                url={personal.website || personal.linkedin}
                                label={personal.website ? 'Web Sitesi' : 'LinkedIn Profili'}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column - Premium Structured Content */}
            <div className="flex-1 p-16">
                {personal.summary && (
                    <section className="mb-16">
                        <div className="flex items-start gap-6">
                            <Quote className="w-10 h-10 text-slate-100 shrink-0" style={{ color: accentColor + '20' }} />
                            <p
                                className="text-lg font-medium text-slate-600 leading-relaxed italic border-l-4 pl-8"
                                style={{ borderColor: accentColor }}
                            >
                                {personal.summary}
                            </p>
                        </div>
                    </section>
                )}

                <div className="space-y-20">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                            {t.experience} <div className="flex-1 h-px bg-slate-100" />
                        </h2>
                        <div className={`space-y-12 transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.02] ring-4 ring-cyan-500/20 rounded-2xl p-4 bg-cyan-500/5' : ''}`}>
                            {experience.map(exp => (
                                <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 group">
                                    <div className="md:col-span-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1 italic">
                                            {exp.startDate} — {exp.endDate}
                                        </p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-slate-600 transition-colors">
                                                    {exp.position}
                                                </h3>
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-1">
                                                    {exp.company}
                                                </p>
                                            </div>
                                        </div>
                                        <p
                                            className="text-sm text-slate-500 leading-relaxed font-medium mt-4 border-l pl-6"
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
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                            {t.education} <div className="flex-1 h-px bg-slate-100" />
                        </h2>
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.02] ring-4 ring-cyan-500/20 rounded-2xl p-4 bg-cyan-500/5' : ''}`}>
                            {education.map(edu => (
                                <div key={edu.id} className="p-8 bg-[#f8f9fa] border border-slate-100 rounded-sm hover:border-slate-300 transition-all group">
                                    <p className="text-[9px] font-black text-slate-400 mb-3 uppercase tracking-widest italic">
                                        {edu.startDate} - {edu.endDate}
                                    </p>
                                    <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tighter">
                                        {edu.school}
                                    </h4>
                                    <p className="text-xs font-bold text-slate-500 italic opacity-70">
                                        {edu.degree}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Projects Section */}
                    {projects && projects.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                                {t.projects} <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map(p => (
                                    <div key={p.id} className="p-6 bg-[#f8f9fa] border border-slate-100 rounded-sm hover:border-slate-300 transition-all">
                                        <h4 className="font-black text-slate-900 text-sm mb-2">{p.name}</h4>
                                        <p className="text-xs text-slate-500 mb-3">{p.description}</p>
                                        {p.link && (
                                            <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
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
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                                {t.certifications} <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <div className="space-y-4">
                                {certifications.map(c => (
                                    <div key={c.id} className="flex justify-between items-center py-3 border-b border-slate-100">
                                        <div>
                                            <h5 className="text-sm font-bold text-slate-800">{c.name}</h5>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{c.issuer}</p>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full" style={{ borderLeft: `3px solid ${accentColor}` }}>
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
                            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                                {t.references} <div className="flex-1 h-px bg-slate-100" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {references.map(ref => (
                                    <div key={ref.id} className="p-6 border-l-2" style={{ borderColor: accentColor + '40' }}>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">{ref.name}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{ref.company}</p>
                                        <div className="space-y-1 text-[11px] text-slate-500 font-medium">
                                            {ref.phone && <p>{ref.phone}</p>}
                                            {ref.email && <p>{ref.email}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Custom Sections */}
                    {customSections && customSections.length > 0 && (
                        <div className="space-y-20">
                            {customSections.map(section => (
                                <section key={section.id}>
                                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex items-center gap-6">
                                        {section.title} <div className="flex-1 h-px bg-slate-100" />
                                    </h2>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium pl-6 border-l" style={{ borderColor: accentColor + '40' }}>
                                        {section.content}
                                    </p>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
