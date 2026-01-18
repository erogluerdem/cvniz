import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Ruler, PenTool } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ArchitectBlueTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Project History' : 'Proje Geçmişi',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Technical Skills' : 'Teknik Beceriler',
        references: isEn ? 'Client References' : 'Müşteri Referansları',
        hobbies: isEn ? 'Interests' : 'İlgi Alanları'
    }

    return (
        <div className="min-h-full bg-blue-50 text-slate-800 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Blueprint grid */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Blueprint Header */}
                <header className={`mb-8 p-8 bg-blue-900 text-white relative ${highlightedField === 'personal' ? 'ring-2 ring-white' : ''}`}>
                    <div className="absolute top-4 right-4 text-xs text-blue-300 uppercase tracking-widest">BLUEPRINT CV</div>

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-28 h-28 border-2 border-blue-300 p-1 bg-blue-950">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <Ruler className="w-4 h-4 text-blue-300" />
                                <span className="text-xs uppercase tracking-widest text-blue-300">Architect Profile</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-1 break-words">{personal.fullName || 'Architect Name'}</h1>
                            <p className="text-lg text-blue-300">{personal.title || 'Licensed Architect'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 bg-white">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#1e3a8a" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-blue-700 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-blue-200">
                        {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-white border-l-4 border-blue-900">
                        <p className="leading-relaxed text-slate-600">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-white border border-blue-200 ${highlightedField === 'experience' ? 'border-blue-900 border-2' : ''}`}>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-6 flex items-center gap-2">
                                    <PenTool className="w-4 h-4" /> {t.experience}
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                                            <h3 className="text-lg font-bold text-blue-900">{exp.position}</h3>
                                            <p className="text-blue-600">{exp.company}</p>
                                            <p className="text-xs text-slate-400 mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-slate-600">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-white border border-blue-200">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-blue-50 border-l-2 border-blue-900">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-blue-600">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-blue-900 text-white">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-blue-300 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-2 bg-blue-800 text-sm">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white border border-blue-200 ${highlightedField === 'education' ? 'border-blue-900 border-2' : ''}`}>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-blue-900">{edu.degree}</h4>
                                            <p className="text-sm text-blue-600">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white border border-blue-200">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-blue-900 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-blue-100 text-blue-900 text-sm">{h.name}</span>
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

