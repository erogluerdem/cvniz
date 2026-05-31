import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Square, Triangle } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function OrigamiPaperTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Skills' : 'Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgiler'
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-rose-50 to-amber-50 text-slate-700 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Geometric paper shapes */}
            <div className="absolute top-20 right-10 w-20 h-20 bg-rose-200/50 rotate-45" />
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-amber-200/50 rotate-12" />
            <div className="absolute top-1/3 left-10 w-12 h-12 bg-rose-300/30 -rotate-12" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Folded Paper Header */}
                <header className={`mb-8 relative ${highlightedField === 'personal' ? 'ring-4 ring-rose-300' : ''}`}>
                    <div className="bg-white p-8 shadow-lg relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-rose-100" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />

                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            {personal.photo && (
                                <div className="w-28 h-28 bg-rose-100 rotate-3 p-2 shadow-md">
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-slate-800 mb-1 break-words">{personal.fullName || 'Name'}</h1>
                                <p className="text-lg text-rose-600">{personal.title || 'Title'}</p>
                            </div>
                            {theme?.showQrCode && (
                                <div className="bg-white p-2 shadow-md rotate-2">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#f43f5e" />
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Contact Strip */}
                <div className="mb-6 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                    {personal.email && <span className="flex items-center gap-2 bg-white/80 px-4 py-2 shadow-sm -rotate-1"><Mail className="w-4 h-4 text-rose-400" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-2 bg-white/80 px-4 py-2 shadow-sm rotate-1"><Phone className="w-4 h-4 text-rose-400" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-2 bg-white/80 px-4 py-2 shadow-sm -rotate-1"><MapPin className="w-4 h-4 text-rose-400" /> {personal.location}</span>}
                </div>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 bg-white p-6 shadow-md -rotate-1 hover:rotate-0 transition-transform">
                        <p className="text-base leading-relaxed text-slate-600">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`bg-white p-6 shadow-md rotate-1 hover:rotate-0 transition-transform ${highlightedField === 'experience' ? 'ring-2 ring-rose-300' : ''}`}>
                                <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-6">{t.experience}</h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-4 border-rose-200 pl-4">
                                            <h3 className="font-bold text-slate-800">{exp.position}</h3>
                                            <p className="text-rose-600 text-sm">{exp.company}</p>
                                            <p className="text-xs text-slate-400 mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-sm text-slate-600">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="bg-white p-6 shadow-md -rotate-1 hover:rotate-0 transition-transform">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4">{t.references}</h2>
                                <div className="flex flex-wrap gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="bg-rose-50 p-4 shadow-sm rotate-1">
                                            <p className="font-bold text-sm">{ref.name}</p>
                                            <p className="text-xs text-slate-500">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="bg-rose-500 text-white p-6 shadow-md -rotate-2 hover:rotate-0 transition-transform">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-200 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-2 bg-white/20 text-sm">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`bg-white p-6 shadow-md rotate-2 hover:rotate-0 transition-transform ${highlightedField === 'education' ? 'ring-2 ring-rose-300' : ''}`}>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-xs text-slate-500">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="bg-amber-100 p-6 shadow-md -rotate-1 hover:rotate-0 transition-transform">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-white text-amber-800 text-xs shadow-sm">{h.name}</span>
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

