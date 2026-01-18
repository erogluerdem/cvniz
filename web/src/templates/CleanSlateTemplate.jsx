import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Minus } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CleanSlateTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#059669'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Professional Experience' : 'İş Deneyimi',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Core Skills' : 'Temel Yetenekler',
        references: isEn ? 'Professional References' : 'Referanslar',
        hobbies: isEn ? 'Personal Interests' : 'İlgi Alanları'
    }

    return (
        <div className="min-h-full bg-white text-slate-800 p-8 md:p-10"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Clean Professional Header */}
                <header className={`mb-10 pb-8 border-b-2 border-slate-200 ${highlightedField === 'personal' ? 'bg-emerald-50 p-6 -m-6 mb-4 rounded-lg' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {personal.photo && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-200">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-900 mb-1 break-words">{personal.fullName || 'İsim Soyisim'}</h1>
                            <p className="text-lg text-emerald-600 font-medium mb-4">{personal.title || 'Profesyonel Unvan'}</p>
                            <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                                {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> {personal.email}</span>}
                                {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" /> {personal.phone}</span>}
                                {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> {personal.location}</span>}
                            </div>
                        </div>
                        {theme?.showQrCode && (
                            <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color={accentColor} />
                        )}
                    </div>
                </header>

                {/* Professional Summary */}
                {personal.summary && (
                    <section className="mb-10 p-6 bg-slate-50 rounded-lg border-l-4 border-emerald-500">
                        <p className="text-base leading-relaxed text-slate-700">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={highlightedField === 'experience' ? 'bg-emerald-50 p-6 -mx-6 rounded-lg' : ''}>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
                                    <Minus className="w-6 h-0.5 bg-emerald-500" style={{ backgroundColor: accentColor }} />
                                    {t.experience}
                                </h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200">
                                            <div className="absolute -left-[5px] top-0 w-2 h-2 bg-emerald-500 rounded-full" />
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                                                    <p className="text-emerald-600 font-medium">{exp.company}</p>
                                                </div>
                                                <span className="text-sm text-slate-400">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-3">
                                    <Minus className="w-6 h-0.5 bg-emerald-500" />
                                    {t.references}
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 border border-slate-200 rounded-lg">
                                            <p className="font-bold text-slate-900">{ref.name}</p>
                                            <p className="text-sm text-slate-500">{ref.company}</p>
                                            <p className="text-xs text-emerald-600 mt-2">{ref.email}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <section className="p-6 bg-slate-900 text-white rounded-lg">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={highlightedField === 'education' ? 'bg-emerald-50 p-4 rounded-lg' : ''}>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="pb-3 border-b border-slate-100 last:border-0">
                                            <h4 className="font-bold text-sm text-slate-900">{edu.degree}</h4>
                                            <p className="text-slate-500 text-sm">{edu.school}</p>
                                            <p className="text-slate-400 text-xs">{edu.startDate} - {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">{h.name}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>

                <footer className="mt-10 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
                    CleanSlate Professional Template • CVniz
                </footer>
            </div>
        </div>
    )
}

