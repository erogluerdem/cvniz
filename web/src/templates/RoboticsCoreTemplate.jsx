import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Cpu, Cog } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function RoboticsCoreTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'System Log' : 'Sistem Kaydı',
        education: isEn ? 'Core Training' : 'Temel Eğitim',
        skills: isEn ? 'Modules' : 'Modüller',
        references: isEn ? 'Network Nodes' : 'Ağ Düğümleri',
        hobbies: isEn ? 'Subroutines' : 'Alt Rutinler'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-zinc-900 text-zinc-200 p-8 md:p-10 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Robotic Header */}
                <header className={`mb-8 p-8 bg-zinc-800 border-2 border-orange-500/50 relative ${highlightedField === 'personal' ? 'ring-2 ring-orange-400' : ''}`}>
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-8 h-px bg-orange-500" />
                    <div className="absolute top-0 left-0 w-px h-8 bg-orange-500" />
                    <div className="absolute top-0 right-0 w-8 h-px bg-orange-500" />
                    <div className="absolute top-0 right-0 w-px h-8 bg-orange-500" />
                    <div className="absolute bottom-0 left-0 w-8 h-px bg-orange-500" />
                    <div className="absolute bottom-0 left-0 w-px h-8 bg-orange-500" />
                    <div className="absolute bottom-0 right-0 w-8 h-px bg-orange-500" />
                    <div className="absolute bottom-0 right-0 w-px h-8 bg-orange-500" />

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {personal.photo && (
                            <div className="w-28 h-28 border-2 border-orange-500 p-1 bg-zinc-900">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale contrast-125" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Cpu className="w-4 h-4 text-orange-500" />
                                <span className="text-xs uppercase tracking-widest text-orange-500">UNIT_ID: CV-2025</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-1 break-words text-orange-100">{personal.fullName || 'UNIT_NAME'}</h1>
                            <p className="text-lg text-orange-400">{personal.title || 'DESIGNATION'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 bg-zinc-900 border border-orange-500/50">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#f97316" />
                            </div>
                        )}
                    </div>

                    {/* Contact Bar */}
                    <div className="mt-6 pt-4 border-t border-zinc-700 flex flex-wrap justify-center md:justify-start gap-6 text-xs text-zinc-500">
                        {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-orange-500" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-orange-500" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-500" /> {personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-zinc-800/50 border-l-4 border-orange-500 break-inside-avoid page-break-inside-avoid">
                        <p className="text-sm text-zinc-300 font-mono leading-relaxed">&gt; {personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-zinc-800 border border-zinc-700 ${highlightedField === 'experience' ? 'border-orange-500' : ''}`}>
                                <h2 className="text-xs uppercase tracking-widest text-orange-500 mb-6 flex items-center gap-2">
                                    <Cog className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} /> {t.experience}
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp, i) => (
                                        <div key={exp.id} className="border-l-2 border-zinc-600 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <div className="text-xs text-orange-500 mb-1">[LOG_{String(i + 1).padStart(3, '0')}]</div>
                                            <h3 className="font-bold text-orange-100">{exp.position}</h3>
                                            <p className="text-orange-400 text-sm">{exp.company}</p>
                                            <p className="text-xs text-zinc-500 mb-2">{exp.startDate} → {exp.endDate}</p>
                                            <p className="text-sm text-zinc-500">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-zinc-800 border border-zinc-700 break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-xs uppercase tracking-widest text-orange-500 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-zinc-900 border border-zinc-700 break-inside-avoid page-break-inside-avoid">
                                            <p className="font-bold text-orange-100">{ref.name}</p>
                                            <p className="text-xs text-zinc-500">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-orange-500/10 border border-orange-500/40 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs uppercase tracking-widest text-orange-400 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm break-inside-avoid page-break-inside-avoid">
                                            <span className="text-orange-500">[{String(i + 1).padStart(2, '0')}]</span>
                                            <span className="text-zinc-300">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-zinc-800 border border-zinc-700 ${highlightedField === 'education' ? 'border-orange-500' : ''}`}>
                                <h3 className="text-xs uppercase tracking-widest text-orange-500 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm text-orange-100">{edu.degree}</h4>
                                            <p className="text-xs text-zinc-500">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-zinc-800 border border-zinc-700 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs uppercase tracking-widest text-orange-500 mb-4">{t.hobbies}</h3>
                                <div className="space-y-1 text-sm text-zinc-500">
                                    {hobbies.map((h, i) => (
                                        <p key={h.id}>├─ {h.name}</p>
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

