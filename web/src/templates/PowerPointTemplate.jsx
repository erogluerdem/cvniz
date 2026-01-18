import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Presentation } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PowerPointTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#2563eb'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Key Skills' : 'Anahtar Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgi Alanları'
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:p-10"
            style={{
                fontFamily: "'Segoe UI', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-5xl mx-auto">
                {/* Slide-style Header */}
                <header className={`mb-6 p-10 bg-white text-slate-800 rounded-lg shadow-2xl ${highlightedField === 'personal' ? 'ring-4 ring-yellow-400' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-blue-600 mb-2 break-words">{personal.fullName || 'Presenter Name'}</h1>
                            <p className="text-xl text-slate-600 mb-4">{personal.title || 'Professional Title'}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                                {personal.email && <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"><Mail className="w-3 h-3" /> {personal.email}</span>}
                                {personal.phone && <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"><Phone className="w-3 h-3" /> {personal.phone}</span>}
                                {personal.location && <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full"><MapPin className="w-3 h-3" /> {personal.location}</span>}
                            </div>
                        </div>
                        {theme?.showQrCode && (
                            <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={90} color={accentColor} />
                        )}
                    </div>
                </header>

                {/* Summary Slide */}
                {personal.summary && (
                    <section className="mb-6 p-8 bg-white/10 backdrop-blur-sm rounded-lg">
                        <p className="text-xl leading-relaxed text-center">"{personal.summary}"</p>
                    </section>
                )}

                {/* Content Slides */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Experience Slide */}
                    {experience.length > 0 && (
                        <section className={`p-8 bg-white text-slate-800 rounded-lg shadow-xl ${highlightedField === 'experience' ? 'ring-4 ring-yellow-400' : ''}`}>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 flex items-center gap-2">
                                <Presentation className="w-4 h-4" /> {t.experience}
                            </h2>
                            <div className="space-y-6">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="border-l-4 border-blue-600 pl-4">
                                        <h3 className="font-bold text-lg">{exp.position}</h3>
                                        <p className="text-blue-600 text-sm">{exp.company}</p>
                                        <p className="text-xs text-slate-400 mb-2">{exp.startDate} - {exp.endDate}</p>
                                        <p className="text-sm text-slate-600">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills Slide */}
                    {skills.length > 0 && (
                        <section className="p-8 bg-yellow-400 text-slate-900 rounded-lg shadow-xl">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700 mb-6">{t.skills}</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg text-sm font-medium">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education Slide */}
                    {education.length > 0 && (
                        <section className={`p-8 bg-white text-slate-800 rounded-lg shadow-xl ${highlightedField === 'education' ? 'ring-4 ring-yellow-400' : ''}`}>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-6">{t.education}</h2>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id} className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-bold">{edu.degree}</h4>
                                        <p className="text-sm text-blue-600">{edu.school}</p>
                                        <p className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* References Slide */}
                    {references?.length > 0 && (
                        <section className="p-8 bg-slate-800 text-white rounded-lg shadow-xl">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-6">{t.references}</h2>
                            <div className="space-y-4">
                                {references.map((ref) => (
                                    <div key={ref.id} className="p-4 bg-white/10 rounded-lg">
                                        <p className="font-bold">{ref.name}</p>
                                        <p className="text-sm text-slate-400">{ref.company}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Hobbies & Footer */}
                {hobbies?.length > 0 && (
                    <section className="mt-6 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                        <div className="flex flex-wrap justify-center gap-4">
                            {hobbies.map((h) => (
                                <span key={h.id} className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">{h.name}</span>
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </div>
    )
}

