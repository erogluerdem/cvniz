import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Stethoscope } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MedicalProTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Clinical Experience' : 'Klinik Deneyim',
        education: isEn ? 'Medical Education' : 'Tıp Eğitimi',
        skills: isEn ? 'Specializations' : 'Uzmanlıklar',
        references: isEn ? 'Professional References' : 'Profesyonel Referanslar',
        hobbies: isEn ? 'Personal Interests' : 'Kişisel İlgiler'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-b from-emerald-50 to-white text-slate-700 p-8 md:p-10 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Source Sans Pro', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Medical Header */}
                <header className={`mb-8 p-8 bg-white rounded-2xl shadow-lg border-t-4 border-emerald-500 ${highlightedField === 'personal' ? 'ring-2 ring-emerald-400' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {personal.photo && (
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-100">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <Stethoscope className="w-5 h-5 text-emerald-600" />
                                <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold">Medical Professional</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-1 break-words">{personal.fullName || 'Dr. Name'}</h1>
                            <p className="text-lg text-emerald-600">{personal.title || 'Medical Specialist'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color="#059669" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-500">
                        {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" /> {personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl break-inside-avoid page-break-inside-avoid">
                        <p className="leading-relaxed text-slate-600">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-white rounded-2xl shadow-md ${highlightedField === 'experience' ? 'ring-2 ring-emerald-400' : ''}`}>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-6">{t.experience}</h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-emerald-200 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <h3 className="text-lg font-bold text-slate-800">{exp.position}</h3>
                                            <p className="text-emerald-600 font-medium">{exp.company}</p>
                                            <p className="text-xs text-slate-500 mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-slate-600">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-white rounded-2xl shadow-md break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-emerald-50 rounded-xl break-inside-avoid page-break-inside-avoid">
                                            <p className="font-bold text-slate-800">{ref.name}</p>
                                            <p className="text-sm text-emerald-600">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-emerald-600 text-white rounded-2xl break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-200 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-4 py-2 bg-white/10 rounded-lg text-sm break-inside-avoid page-break-inside-avoid">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white rounded-2xl shadow-md ${highlightedField === 'education' ? 'ring-2 ring-emerald-400' : ''}`}>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                                            <p className="text-sm text-emerald-600">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white rounded-2xl shadow-md break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">{h.name}</span>
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

