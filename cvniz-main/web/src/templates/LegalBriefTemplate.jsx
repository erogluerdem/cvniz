import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Scale } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function LegalBriefTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Professional Experience' : 'Mesleki Deneyim',
        education: isEn ? 'Legal Education' : 'Hukuk Eğitimi',
        skills: isEn ? 'Areas of Practice' : 'Uzmanlık Alanları',
        references: isEn ? 'Professional References' : 'Profesyonel Referanslar',
        hobbies: isEn ? 'Personal Interests' : 'Kişisel İlgiler'
    }

    return (
        <div className="min-h-full bg-slate-50 text-slate-800 p-8 md:p-10"
            style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Legal Header */}
                <header className={`mb-8 pb-6 border-b-2 border-slate-800 ${highlightedField === 'personal' ? 'bg-slate-100 p-6 -m-6 mb-2' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {personal.photo && (
                            <div className="w-28 h-28 border border-slate-300 p-1 bg-white">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale-[0.2]" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <Scale className="w-5 h-5 text-slate-600" />
                                <span className="text-xs uppercase tracking-[0.3em] text-slate-500 font-sans">Attorney at Law</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1 break-words">{personal.fullName || 'Legal Professional'}</h1>
                            <p className="text-lg text-slate-600 italic">{personal.title || 'Esq.'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 bg-white border border-slate-200">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color="#1e293b" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-500 font-sans">
                        {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-white border border-slate-200">
                        <p className="leading-relaxed text-slate-700 italic">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-white border border-slate-200 ${highlightedField === 'experience' ? 'border-slate-800 border-2' : ''}`}>
                                <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-200 pb-2">{t.experience}</h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id}>
                                            <h3 className="text-lg font-bold text-slate-900">{exp.position}</h3>
                                            <p className="text-slate-600 font-sans text-sm">{exp.company}</p>
                                            <p className="text-xs text-slate-400 font-sans mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-white border border-slate-200">
                                <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-200 pb-2">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-slate-50">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-slate-500 font-sans">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-slate-800 text-white">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="border-b border-slate-700 pb-2 text-sm">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white border border-slate-200 ${highlightedField === 'education' ? 'border-slate-800 border-2' : ''}`}>
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold">{edu.degree}</h4>
                                            <p className="text-sm text-slate-500 font-sans">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white border border-slate-200">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">{t.hobbies}</h3>
                                <div className="space-y-1 text-sm text-slate-600 italic">
                                    {hobbies.map((h) => (
                                        <p key={h.id}>{h.name}</p>
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

