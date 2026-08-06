import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function NeoGradientTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#8b5cf6'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Skills' : 'Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgi Alanları'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white p-8 md:p-10 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className={`mb-10 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 ${highlightedField === 'personal' ? 'ring-4 ring-white/50' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-black mb-2 break-words">{personal.fullName || 'Ad Soyad'}</h1>
                            <p className="text-xl text-white/80 mb-4">{personal.title || 'Pozisyon'}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/70">
                                {personal.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {personal.email}</span>}
                                {personal.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                                {personal.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                            </div>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-3 bg-white rounded-2xl">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color={accentColor} />
                            </div>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 break-inside-avoid page-break-inside-avoid">
                        <p className="text-lg leading-relaxed text-white/90 italic">"{personal.summary}"</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 ${highlightedField === 'experience' ? 'ring-2 ring-white/50' : ''}`}>
                                <h2 className="text-sm font-black uppercase tracking-widest text-white/50 mb-6">{t.experience}</h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-white/30 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <h3 className="text-lg font-bold">{exp.position}</h3>
                                            <p className="text-white/60 text-sm mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                                            <p className="text-white/80 text-sm">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-sm font-black uppercase tracking-widest text-white/50 mb-6">{t.references}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-white/5 rounded-xl break-inside-avoid page-break-inside-avoid">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-white/60 text-sm">{ref.company}</p>
                                            <p className="text-white/50 text-xs mt-2">{ref.email}</p>
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
                            <section className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-4">{t.skills}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">{skill}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 ${highlightedField === 'education' ? 'ring-2 ring-white/50' : ''}`}>
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-white/60 text-xs">{edu.school}</p>
                                            <p className="text-white/40 text-xs">{edu.startDate} - {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/50 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs">{h.name}</span>
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

