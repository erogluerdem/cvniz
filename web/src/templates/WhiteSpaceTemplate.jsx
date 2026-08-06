import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function WhiteSpaceTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#6366f1'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Work' : 'İş',
        education: isEn ? 'Study' : 'Eğitim',
        skills: isEn ? 'Can Do' : 'Yapabilir',
        references: isEn ? 'Ask' : 'Sor',
        hobbies: isEn ? 'Love' : 'Sever'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-slate-800 p-8 md:p-10 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className={`mb-12 ${highlightedField === 'personal' ? 'bg-indigo-50/50 p-6 -m-4 rounded-xl ring-1 ring-indigo-500/10' : ''}`}>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 break-words">{personal.fullName || 'Name'}</h1>

                    <div className="flex flex-wrap gap-6 text-sm text-slate-500">
                        <span className="text-indigo-600 font-bold uppercase tracking-widest text-[11px]">{personal.title || 'Role'}</span>
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-12 break-inside-avoid">
                        <p className="text-lg leading-relaxed text-slate-500 italic">{personal.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section className={`mb-12 ${highlightedField === 'experience' ? 'bg-indigo-50/30 p-8 -mx-8 rounded-xl ring-1 ring-indigo-500/10' : ''}`}>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-8 break-inside-avoid">{t.experience}</h2>
                        <div className="space-y-10">
                            {experience.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="mb-3">
                                        <h3 className="text-xl font-bold">{exp.position}</h3>
                                        <p className="text-indigo-600 font-medium text-sm">{exp.company}</p>
                                    </div>
                                    <p className="text-slate-500 text-[11px] font-bold mb-3 uppercase tracking-tighter">{exp.startDate} – {exp.endDate}</p>
                                    <p className="text-slate-600 text-[15px] leading-relaxed font-light">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Three Column Grid with breathing room */}
                <div className="grid grid-cols-3 gap-16 mb-24">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-indigo-500 mb-8">{t.skills}</h3>
                            <div className="space-y-3">
                                {skills.slice(0, 6).map((skill, i) => (
                                    <p key={i} className="text-sm">{skill}</p>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section className={highlightedField === 'education' ? 'bg-indigo-50 p-4 -m-4 rounded-xl' : ''}>
                            <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-indigo-500 mb-8">{t.education}</h3>
                            <div className="space-y-6">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <p className="font-bold text-sm">{edu.degree}</p>
                                        <p className="text-slate-500 text-xs">{edu.school}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Hobbies */}
                    {hobbies?.length > 0 && (
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-indigo-500 mb-8">{t.hobbies}</h3>
                            <div className="space-y-3">
                                {hobbies.map((h) => (
                                    <p key={h.id} className="text-sm">{h.name}</p>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* References - Minimal inline */}
                {references?.length > 0 && (
                    <section className="mb-16 break-inside-avoid page-break-inside-avoid">
                        <h3 className="text-xs font-bold uppercase tracking-[0.5em] text-indigo-500 mb-8">{t.references}</h3>
                        <div className="flex flex-wrap gap-12">
                            {references.map((ref) => (
                                <div key={ref.id}>
                                    <p className="font-bold">{ref.name}</p>
                                    <p className="text-sm text-slate-500">{ref.company}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                {theme?.showQrCode && (
                    <footer className="flex justify-center items-center text-xs text-slate-500 pt-8 border-t border-slate-100">
                        <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={50} color={accentColor} />
                    </footer>
                )}
            </div>
        </div>
    )
}

