import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Type } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function TypeFirstTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#1e293b'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Career' : 'Kariyer',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Skills' : 'Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Life' : 'Yaşam'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-slate-900 p-10 md:p-12 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Typography-focused Header */}
                <header className={`mb-16 text-center ${highlightedField === 'personal' ? 'bg-slate-50 p-8 rounded-lg' : ''}`}>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 break-words leading-tight">{personal.fullName || 'İsim Soyisim'}</h1>
                    <p className="text-xl text-slate-500 italic mb-8">{personal.title || 'Profesyonel Unvan'}</p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>•</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>•</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>
                </header>

                {/* Big Quote Summary */}
                {personal.summary && (
                    <section className="mb-16 text-center max-w-3xl mx-auto break-inside-avoid page-break-inside-avoid">
                        <p className="text-2xl md:text-3xl font-light leading-relaxed text-slate-700 italic">
                            "{personal.summary}"
                        </p>
                    </section>
                )}

                <div className="border-t border-slate-200 pt-12">
                    {/* Experience */}
                    {experience.length > 0 && (
                        <section className={`mb-16 ${highlightedField === 'experience' ? 'bg-slate-50 p-6 -mx-6 rounded-lg' : ''}`}>
                            <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-slate-500 mb-10 text-center">{t.experience}</h2>
                            <div className="space-y-12">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="text-center break-inside-avoid page-break-inside-avoid">
                                        <h3 className="text-2xl font-bold mb-1">{exp.position}</h3>
                                        <p className="text-lg text-slate-500 italic mb-2">{exp.company}</p>
                                        <p className="text-sm text-slate-500 mb-4">{exp.startDate} — {exp.endDate}</p>
                                        <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-12">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <section className="text-center break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <p key={i} className="text-lg">{skill}</p>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`text-center ${highlightedField === 'education' ? 'bg-slate-50 p-4 rounded-lg' : ''}`}>
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <p className="text-lg font-bold">{edu.degree}</p>
                                            <p className="text-slate-500 italic">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies & Interests */}
                        {hobbies?.length > 0 && (
                            <section className="text-center break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-slate-500 mb-6">{t.hobbies}</h3>
                                <div className="space-y-2">
                                    {hobbies.map((h) => (
                                        <p key={h.id} className="text-lg">{h.name}</p>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* References */}
                    {references?.length > 0 && (
                        <section className="mt-12 pt-12 border-t border-slate-200 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-slate-500 mb-8 text-center">{t.references}</h3>
                            <div className="flex flex-wrap justify-center gap-8">
                                {references.map((ref) => (
                                    <div key={ref.id} className="text-center break-inside-avoid page-break-inside-avoid">
                                        <p className="font-bold text-lg">{ref.name}</p>
                                        <p className="text-slate-500 italic">{ref.company}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {theme?.showQrCode && (
                    <div className="mt-12 flex justify-center">
                        <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color={accentColor} />
                    </div>
                )}

                <footer className="mt-12 text-center text-xs text-slate-500 font-sans tracking-widest uppercase">
                    TypeFirst Design
                </footer>
            </div>
        </div>
    )
}

