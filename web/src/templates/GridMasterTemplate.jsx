import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, LayoutGrid } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function GridMasterTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#f59e0b'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Skills' : 'Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgiler'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-amber-50 text-slate-800 p-8 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-5xl mx-auto">
                {/* Asymmetric Header Grid */}
                <header className="grid grid-cols-12 gap-4 mb-8">
                    <div className={`col-span-8 bg-slate-900 text-white p-8 rounded-2xl ${highlightedField === 'personal' ? 'ring-4 ring-amber-400' : ''}`}>
                        <h1 className="text-3xl font-black uppercase tracking-tight mb-2 break-words">{personal.fullName || 'AD SOYAD'}</h1>
                        <p className="text-amber-400 font-bold uppercase tracking-widest">{personal.title || 'POZİSYON'}</p>
                    </div>
                    {personal.photo && (
                        <div className="col-span-4 bg-amber-400 rounded-2xl overflow-hidden">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    )}
                </header>

                {/* Contact Bar */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {personal.email && (
                        <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm">
                            <Mail className="w-5 h-5 text-amber-500" />
                            <span className="text-sm truncate">{personal.email}</span>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm">
                            <Phone className="w-5 h-5 text-amber-500" />
                            <span className="text-sm">{personal.phone}</span>
                        </div>
                    )}
                    {personal.location && (
                        <div className="bg-white p-4 rounded-xl flex items-center gap-3 shadow-sm">
                            <MapPin className="w-5 h-5 text-amber-500" />
                            <span className="text-sm">{personal.location}</span>
                        </div>
                    )}
                    {theme?.showQrCode && (
                        <div className="bg-white p-3 rounded-xl flex items-center justify-center shadow-sm">
                            <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={50} color={accentColor} />
                        </div>
                    )}
                </div>

                {/* Summary */}
                {personal.summary && (
                    <section className="bg-white p-6 rounded-2xl shadow-sm mb-8 break-inside-avoid page-break-inside-avoid">
                        <p className="text-lg leading-relaxed">{personal.summary}</p>
                    </section>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-12 gap-4">
                    {/* Experience - Takes 8 cols */}
                    {experience.length > 0 && (
                        <section className={`col-span-8 bg-white p-6 rounded-2xl shadow-sm ${highlightedField === 'experience' ? 'ring-2 ring-amber-400' : ''}`}>
                            <h2 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-6 flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4" /> {t.experience}
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="p-4 bg-slate-50 rounded-xl break-inside-avoid page-break-inside-avoid">
                                        <h3 className="font-bold mb-1">{exp.position}</h3>
                                        <p className="text-amber-600 text-sm font-medium">{exp.company}</p>
                                        <p className="text-xs text-slate-500 mb-2">{exp.startDate} - {exp.endDate}</p>
                                        <p className="text-sm text-slate-600 line-clamp-3">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills - Takes 4 cols */}
                    {skills.length > 0 && (
                        <section className="col-span-4 bg-slate-900 text-white p-6 rounded-2xl break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">{t.skills}</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {skills.map((skill, i) => (
                                    <div key={i} className="bg-white/10 px-3 py-2 rounded-lg text-xs font-medium text-center break-inside-avoid page-break-inside-avoid">{skill}</div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section className={`col-span-6 bg-amber-400 p-6 rounded-2xl ${highlightedField === 'education' ? 'ring-2 ring-slate-900' : ''}`}>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">{t.education}</h3>
                            <div className="space-y-3">
                                {education.map((edu) => (
                                    <div key={edu.id} className="bg-white/20 p-3 rounded-xl break-inside-avoid page-break-inside-avoid">
                                        <h4 className="font-bold text-sm text-slate-900">{edu.degree}</h4>
                                        <p className="text-xs text-slate-700">{edu.school}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* References & Hobbies */}
                    <div className="col-span-6 space-y-4">
                        {references?.length > 0 && (
                            <section className="bg-white p-6 rounded-2xl shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-3">{t.references}</h3>
                                <div className="space-y-2">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="flex justify-between items-center text-sm break-inside-avoid page-break-inside-avoid">
                                            <span className="font-bold">{ref.name}</span>
                                            <span className="text-slate-500">{ref.company}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="bg-white p-6 rounded-2xl shadow-sm break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 mb-3">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">{h.name}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

