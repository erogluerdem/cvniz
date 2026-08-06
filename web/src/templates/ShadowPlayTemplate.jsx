import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Sun } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ShadowPlayTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#3b82f6'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Expertise' : 'Uzmanlık',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Beyond Work' : 'İş Dışı'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-slate-100 text-slate-800 p-8 md:p-10 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Elevated Header Card */}
                <header className={`mb-8 p-8 bg-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-500 ${highlightedField === 'personal' ? 'ring-2 ring-blue-400' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2 break-words">{personal.fullName || 'İsim Soyisim'}</h1>
                            <p className="text-blue-600 font-medium mb-4">{personal.title || 'Pozisyon'}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                                {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                                {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                                {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                            </div>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-3 bg-slate-50 rounded-xl shadow-inner">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color={accentColor} />
                            </div>
                        )}
                    </div>
                </header>

                {/* Summary Card */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] break-inside-avoid page-break-inside-avoid">
                        <p className="text-lg leading-relaxed text-slate-600">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] ${highlightedField === 'experience' ? 'shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]' : ''}`}>
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">{t.experience}</h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="p-4 bg-slate-50 rounded-xl shadow-inner break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold">{exp.position}</h3>
                                                    <p className="text-blue-600 text-sm">{exp.company}</p>
                                                </div>
                                                <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded shadow-sm">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm text-slate-600">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-inner border border-slate-100 break-inside-avoid page-break-inside-avoid">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-slate-500">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <section className="p-6 bg-blue-600 text-white rounded-2xl shadow-[0_15px_35px_-10px_rgba(59,130,246,0.4)] break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-2 bg-white/10 rounded-lg text-sm break-inside-avoid page-break-inside-avoid">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`p-6 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] ${highlightedField === 'education' ? 'shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]' : ''}`}>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="p-3 bg-slate-50 rounded-xl shadow-inner break-inside-avoid page-break-inside-avoid">
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-slate-500 text-xs">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium shadow-sm">{h.name}</span>
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

