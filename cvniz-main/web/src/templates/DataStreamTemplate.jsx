import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Activity, TrendingUp } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function DataStreamTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Data Stream' : 'Veri Akışı',
        education: isEn ? 'Knowledge Base' : 'Bilgi Tabanı',
        skills: isEn ? 'Analytics' : 'Analitik',
        references: isEn ? 'Network' : 'Ağ',
        hobbies: isEn ? 'Interests' : 'İlgiler'
    }

    return (
        <div className="min-h-full bg-slate-950 text-white p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Data stream lines */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
                        style={{
                            top: `${15 + i * 12}%`,
                            left: '-100%',
                            right: '-100%',
                            animation: `slideRight ${3 + i * 0.5}s linear infinite`,
                            animationDelay: `${i * 0.3}s`
                        }} />
                ))}
            </div>

            <style>{`
                @keyframes slideRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(50%); }
                }
            `}</style>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Dashboard Header */}
                <header className={`mb-6 p-6 bg-slate-900/80 border border-emerald-500/30 rounded-xl backdrop-blur-sm ${highlightedField === 'personal' ? 'ring-2 ring-emerald-400' : ''}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <span className="text-xs uppercase tracking-widest text-emerald-400">Live Dashboard</span>
                        <div className="flex-1" />
                        <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">● ONLINE</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        {personal.photo && (
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-emerald-500/50">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-1 break-words">{personal.fullName || 'User'}</h1>
                            <p className="text-emerald-400 font-medium">{personal.title || 'Role'}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-xs text-slate-400">
                            {personal.email && <span className="flex items-center gap-2"><Mail className="w-3 h-3 text-emerald-400" /> {personal.email}</span>}
                            {personal.phone && <span className="flex items-center gap-2"><Phone className="w-3 h-3 text-emerald-400" /> {personal.phone}</span>}
                            {personal.location && <span className="flex items-center gap-2"><MapPin className="w-3 h-3 text-emerald-400" /> {personal.location}</span>}
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 bg-white rounded-lg">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={60} color="#10b981" />
                            </div>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-6 grid grid-cols-1 gap-4">
                        <div className="p-6 bg-slate-900/60 border border-slate-700 rounded-xl">
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Summary</div>
                            <p className="text-slate-300 leading-relaxed">{personal.summary}</p>
                        </div>
                    </section>
                )}

                {/* Stats Row */}
                {skills.length > 0 && (
                    <section className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skills.slice(0, 4).map((skill, i) => (
                            <div key={i} className="p-4 bg-slate-900/60 border border-slate-700 rounded-xl text-center">
                                <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                                <p className="text-sm font-bold text-emerald-400">{skill}</p>
                            </div>
                        ))}
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-slate-900/60 border border-slate-700 rounded-xl ${highlightedField === 'experience' ? 'border-emerald-500' : ''}`}>
                                <h2 className="text-xs uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-2">
                                    <Activity className="w-4 h-4" /> {t.experience}
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="p-4 bg-slate-800/50 rounded-lg border-l-2 border-emerald-500">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold">{exp.position}</h3>
                                                    <p className="text-sm text-emerald-400">{exp.company}</p>
                                                </div>
                                                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm text-slate-400">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-slate-900/60 border border-slate-700 rounded-xl">
                                <h2 className="text-xs uppercase tracking-widest text-emerald-400 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-slate-800/50 rounded-lg">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-xs text-slate-500">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 4 && (
                            <section className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                <h3 className="text-xs uppercase tracking-widest text-emerald-300 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.slice(4).map((skill, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-slate-900/60 border border-slate-700 rounded-xl ${highlightedField === 'education' ? 'border-emerald-500' : ''}`}>
                                <h3 className="text-xs uppercase tracking-widest text-emerald-400 mb-4">{t.education}</h3>
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
                            <section className="p-6 bg-slate-900/60 border border-slate-700 rounded-xl">
                                <h3 className="text-xs uppercase tracking-widest text-emerald-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-slate-800 rounded text-xs">{h.name}</span>
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

