import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Hexagon, Circle } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function HologramUITemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#06b6d4'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Career Data' : 'Kariyer Verisi',
        education: isEn ? 'Knowledge Base' : 'Bilgi Tabanı',
        skills: isEn ? 'Skill Matrix' : 'Yetenek Matrisi',
        references: isEn ? 'Network Nodes' : 'Ağ Düğümleri',
        hobbies: isEn ? 'Personal Modules' : 'Kişisel Modüller'
    }

    return (
        <div className="min-h-full bg-slate-950 text-cyan-100 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem'
            }}>

            {/* Hologram grid effect */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            {/* Glow orbs */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500/20 rounded-full blur-[80px]" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Hologram Header */}
                <header className={`mb-8 p-8 bg-cyan-500/5 border border-cyan-500/30 backdrop-blur-sm rounded-lg relative ${highlightedField === 'personal' ? 'ring-2 ring-cyan-400' : ''}`}>
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-400 p-1 relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-transparent animate-spin" style={{ animationDuration: '3s' }} />
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-full relative z-10" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Hexagon className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs uppercase tracking-[0.4em] text-cyan-400">Identity Verified</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-wider mb-2 break-words">{personal.fullName || 'USER_NAME'}</h1>
                            <p className="text-lg text-cyan-300">{personal.title || 'DESIGNATION'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-3 border border-cyan-500/30 rounded-lg bg-slate-900/50">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color="#06b6d4" />
                            </div>
                        )}
                    </div>

                    {/* Contact Strip */}
                    <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-wrap justify-center md:justify-start gap-6 text-xs">
                        {personal.email && <span className="flex items-center gap-1 text-cyan-300"><Mail className="w-3 h-3" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-1 text-cyan-300"><Phone className="w-3 h-3" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-1 text-cyan-300"><MapPin className="w-3 h-3" /> {personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-cyan-500/5 border-l-2 border-cyan-400 backdrop-blur-sm">
                        <p className="text-sm leading-relaxed text-cyan-200">&gt; {personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-slate-900/50 border border-cyan-500/20 rounded-lg backdrop-blur-sm ${highlightedField === 'experience' ? 'border-cyan-400' : ''}`}>
                                <h2 className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-6 flex items-center gap-2">
                                    <Circle className="w-3 h-3 fill-cyan-400" /> {t.experience}
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l border-cyan-500/30 pl-4">
                                            <h3 className="font-bold text-cyan-100">{exp.position}</h3>
                                            <p className="text-cyan-400 text-sm">{exp.company}</p>
                                            <p className="text-xs text-cyan-500/50 mb-2">{exp.startDate} → {exp.endDate}</p>
                                            <p className="text-sm text-cyan-200/80">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-slate-900/50 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
                                <h2 className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 border border-cyan-500/20 rounded bg-cyan-500/5">
                                            <p className="font-bold text-cyan-100">{ref.name}</p>
                                            <p className="text-xs text-cyan-400">{ref.company}</p>
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
                            <section className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg">
                                <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-cyan-400 rotate-45" />
                                            <span className="text-sm">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`p-6 bg-slate-900/50 border border-cyan-500/20 rounded-lg ${highlightedField === 'education' ? 'border-cyan-400' : ''}`}>
                                <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-xs text-cyan-400">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-slate-900/50 border border-cyan-500/20 rounded-lg">
                                <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs">{h.name}</span>
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

