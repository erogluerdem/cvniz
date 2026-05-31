import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Brain, Zap } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function NeuralNetTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#a855f7'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Neural Pathways' : 'Nöral Yollar',
        education: isEn ? 'Training Data' : 'Eğitim Verisi',
        skills: isEn ? 'Synapses' : 'Sinapslar',
        references: isEn ? 'Network' : 'Ağ',
        hobbies: isEn ? 'Activations' : 'Aktivasyonlar'
    }

    return (
        <div className="min-h-full bg-slate-950 text-purple-100 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Neural network background nodes */}
            <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 bg-purple-500/20 rounded-full animate-pulse"
                        style={{
                            top: `${10 + (i * 8)}%`,
                            left: `${5 + (i * 7)}%`,
                            animationDelay: `${i * 0.2}s`
                        }} />
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Neural Header */}
                <header className={`mb-8 p-8 bg-purple-500/10 border border-purple-500/30 rounded-2xl backdrop-blur-sm ${highlightedField === 'personal' ? 'ring-2 ring-purple-400' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50" />
                                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-purple-400 relative">
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Brain className="w-5 h-5 text-purple-400" />
                                <span className="text-xs uppercase tracking-widest text-purple-400">Neural Profile v2.0</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 break-words">{personal.fullName || 'Name'}</h1>
                            <p className="text-lg text-purple-300">{personal.title || 'Role'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-3 bg-slate-900 border border-purple-500/30 rounded-xl">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color="#a855f7" />
                            </div>
                        )}
                    </div>

                    {/* Contact nodes */}
                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-xs">
                        {personal.email && <span className="px-3 py-1 bg-purple-500/20 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" /> {personal.email}</span>}
                        {personal.phone && <span className="px-3 py-1 bg-purple-500/20 rounded-full">{personal.phone}</span>}
                        {personal.location && <span className="px-3 py-1 bg-purple-500/20 rounded-full">{personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-2 border-purple-400 rounded-r-xl">
                        <p className="text-base leading-relaxed text-purple-200">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-slate-900/50 border border-purple-500/20 rounded-xl ${highlightedField === 'experience' ? 'border-purple-400' : ''}`}>
                                <h2 className="text-xs uppercase tracking-widest text-purple-400 mb-6">{t.experience}</h2>
                                <div className="space-y-6">
                                    {experience.map((exp, i) => (
                                        <div key={exp.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:bg-purple-500 before:rounded-full before:shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                            <h3 className="font-bold text-lg">{exp.position}</h3>
                                            <p className="text-purple-400 text-sm">{exp.company}</p>
                                            <p className="text-xs text-purple-500/50 mb-2">{exp.startDate} → {exp.endDate}</p>
                                            <p className="text-purple-200/80 text-sm">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-slate-900/50 border border-purple-500/20 rounded-xl">
                                <h2 className="text-xs uppercase tracking-widest text-purple-400 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-xs text-purple-400">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30 rounded-xl">
                                <h3 className="text-xs uppercase tracking-widest text-purple-200 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-2 bg-slate-900/50 rounded-lg text-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-slate-900/50 border border-purple-500/20 rounded-xl ${highlightedField === 'education' ? 'border-purple-400' : ''}`}>
                                <h3 className="text-xs uppercase tracking-widest text-purple-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-xs text-purple-400">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-slate-900/50 border border-purple-500/20 rounded-xl">
                                <h3 className="text-xs uppercase tracking-widest text-purple-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-purple-500/20 rounded-full text-xs">{h.name}</span>
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

