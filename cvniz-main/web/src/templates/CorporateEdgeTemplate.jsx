import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, ArrowRight } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CorporateEdgeTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#dc2626'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Career Path' : 'Kariyer Yolu',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Core Skills' : 'Temel Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgi Alanları'
    }

    return (
        <div className="min-h-full bg-white text-slate-800"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Sharp Edge Header */}
            <header className={`bg-slate-900 text-white p-8 md:p-10 relative overflow-hidden ${highlightedField === 'personal' ? 'ring-4 ring-red-500' : ''}`}>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600 -skew-x-12 translate-x-20" />

                <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
                    {personal.photo && (
                        <div className="w-28 h-28 border-2 border-red-500 p-1">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-1 break-words">{personal.fullName || 'FULL NAME'}</h1>
                        <p className="text-red-500 font-bold uppercase tracking-widest mb-4">{personal.title || 'POSITION'}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-400">
                            {personal.email && <span>{personal.email}</span>}
                            {personal.phone && <span>{personal.phone}</span>}
                            {personal.location && <span>{personal.location}</span>}
                        </div>
                    </div>
                    {theme?.showQrCode && (
                        <div className="p-2 bg-white">
                            <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color={accentColor} />
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-8 md:p-10">
                {/* Summary */}
                {personal.summary && (
                    <section className="mb-10 pl-6 border-l-4 border-red-600">
                        <p className="text-lg leading-relaxed text-slate-600">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={highlightedField === 'experience' ? 'bg-red-50 p-6 -mx-6 rounded' : ''}>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-2">
                                    <ArrowRight className="w-4 h-4 text-red-600" /> {t.experience}
                                </h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold">{exp.position}</h3>
                                                    <p className="text-red-600 font-medium">{exp.company}</p>
                                                </div>
                                                <span className="text-xs font-bold bg-slate-100 px-3 py-1">{exp.startDate} - {exp.endDate}</span>
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
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 border-l-4 border-red-600 bg-slate-50">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-slate-500">{ref.company}</p>
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
                            <section className="p-6 bg-slate-900 text-white">
                                <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <div className="w-2 h-2 bg-red-500" />
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={highlightedField === 'education' ? 'bg-red-50 p-4 rounded' : ''}>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="border-b border-slate-200 pb-3">
                                            <h4 className="font-bold">{edu.degree}</h4>
                                            <p className="text-sm text-slate-500">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-slate-100 text-xs font-medium">{h.name}</span>
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

