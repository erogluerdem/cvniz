import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Atom } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function QuantumBlueTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#0284c7'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Quantum States' : 'Kuantum Durumları',
        education: isEn ? 'Knowledge Qubits' : 'Bilgi Kübitleri',
        skills: isEn ? 'Superposition' : 'Süperpozisyon',
        references: isEn ? 'Entanglement' : 'Dolanıklık',
        hobbies: isEn ? 'Wave Functions' : 'Dalga Fonksiyonları'
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-sky-950 via-blue-900 to-indigo-950 text-sky-100 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Quantum wave effect */}
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(14,165,233,0.1) 50%, transparent 100%)',
                backgroundSize: '100px 100px'
            }} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Quantum Header */}
                <header className={`mb-8 p-10 bg-sky-500/10 backdrop-blur-md border border-sky-400/30 rounded-3xl ${highlightedField === 'personal' ? 'ring-2 ring-sky-400' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full blur-md animate-pulse" />
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-sky-300 relative z-10">
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Atom className="w-5 h-5 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
                                <span className="text-xs uppercase tracking-[0.4em] text-sky-400">Quantum Identity</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2 break-words">{personal.fullName || 'Name'}</h1>
                            <p className="text-xl text-sky-300">{personal.title || 'Position'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={90} color="#0ea5e9" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-sky-300">
                        {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-8 bg-sky-500/5 border-l-4 border-sky-400 backdrop-blur-sm rounded-r-2xl">
                        <p className="text-lg leading-relaxed text-sky-200">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-8 bg-white/5 backdrop-blur-sm border border-sky-400/20 rounded-2xl ${highlightedField === 'experience' ? 'border-sky-400' : ''}`}>
                                <h2 className="text-sm uppercase tracking-widest text-sky-400 mb-8">{t.experience}</h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-sky-400 before:to-transparent">
                                            <div className="absolute left-0 top-0 w-2 h-2 bg-sky-400 rounded-full transform -translate-x-[3px]" />
                                            <h3 className="text-xl font-bold">{exp.position}</h3>
                                            <p className="text-sky-400">{exp.company}</p>
                                            <p className="text-xs text-sky-500/60 mb-3">{exp.startDate} — {exp.endDate}</p>
                                            <p className="text-sky-200/80 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-8 bg-white/5 backdrop-blur-sm border border-sky-400/20 rounded-2xl">
                                <h2 className="text-sm uppercase tracking-widest text-sky-400 mb-6">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-sky-500/10 rounded-xl border border-sky-400/20">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-sky-400">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-gradient-to-br from-sky-500/30 to-blue-600/30 border border-sky-400/40 rounded-2xl">
                                <h3 className="text-sm uppercase tracking-widest text-sky-200 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-4 py-2 bg-white/10 rounded-xl text-sm">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white/5 border border-sky-400/20 rounded-2xl ${highlightedField === 'education' ? 'border-sky-400' : ''}`}>
                                <h3 className="text-sm uppercase tracking-widest text-sky-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold">{edu.degree}</h4>
                                            <p className="text-sm text-sky-400">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white/5 border border-sky-400/20 rounded-2xl">
                                <h3 className="text-sm uppercase tracking-widest text-sky-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-sky-500/20 rounded-full text-xs">{h.name}</span>
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

