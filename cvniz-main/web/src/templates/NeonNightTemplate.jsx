import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Zap } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function NeonNightTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'EXPERIENCE' : 'DENEYİM',
        education: isEn ? 'EDUCATION' : 'EĞİTİM',
        skills: isEn ? 'SKILLS' : 'YETENEKLER',
        references: isEn ? 'NETWORK' : 'AĞ',
        hobbies: isEn ? 'VIBE' : 'TARZ'
    }

    return (
        <div className="min-h-full bg-black text-white p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Neon glow effects */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Neon Header */}
                <header className={`mb-8 p-8 border-2 border-pink-500 relative ${highlightedField === 'personal' ? 'shadow-[0_0_30px_rgba(236,72,153,0.5)]' : ''}`} style={{ boxShadow: '0 0 15px rgba(236,72,153,0.5), inset 0 0 15px rgba(236,72,153,0.1)' }}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-28 h-28 border-2 border-cyan-400 p-1" style={{ boxShadow: '0 0 15px rgba(34,211,238,0.5)' }}>
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-bold tracking-wider break-words" style={{ textShadow: '0 0 10px rgba(236,72,153,1), 0 0 20px rgba(236,72,153,0.8), 0 0 30px rgba(236,72,153,0.6)' }}>{personal.fullName || 'NAME'}</h1>
                            <p className="text-xl text-cyan-400 tracking-widest mt-2" style={{ textShadow: '0 0 10px rgba(34,211,238,0.8)' }}>{personal.title || 'TITLE'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 border border-purple-500" style={{ boxShadow: '0 0 10px rgba(168,85,247,0.5)' }}>
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#ec4899" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-pink-300 font-sans">
                        {personal.email && <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 border-l-4 border-cyan-400 bg-black/50" style={{ boxShadow: '-4px 0 15px rgba(34,211,238,0.3)' }}>
                        <p className="text-lg font-sans text-gray-300 leading-relaxed">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-8 border-2 border-purple-500 bg-black/30 ${highlightedField === 'experience' ? 'shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}>
                                <h2 className="text-3xl tracking-[0.3em] text-purple-400 mb-8" style={{ textShadow: '0 0 10px rgba(168,85,247,0.8)' }}>{t.experience}</h2>
                                <div className="space-y-8 font-sans">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-pink-500 pl-6">
                                            <h3 className="text-2xl font-bold text-pink-400">{exp.position}</h3>
                                            <p className="text-cyan-400">{exp.company}</p>
                                            <p className="text-sm text-gray-500 mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-gray-400">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-8 border-2 border-cyan-500 bg-black/30">
                                <h2 className="text-3xl tracking-[0.3em] text-cyan-400 mb-6" style={{ textShadow: '0 0 10px rgba(34,211,238,0.8)' }}>{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4 font-sans">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 border border-pink-500/50 bg-black/50">
                                            <p className="font-bold text-pink-400">{ref.name}</p>
                                            <p className="text-sm text-gray-500">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 border-2 border-pink-500 bg-black/30" style={{ boxShadow: '0 0 15px rgba(236,72,153,0.3)' }}>
                                <h3 className="text-2xl tracking-[0.2em] text-pink-400 mb-4">{t.skills}</h3>
                                <div className="space-y-2 font-sans">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-4 py-2 border border-cyan-500/50 text-cyan-300 text-sm">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 border-2 border-cyan-500 bg-black/30 ${highlightedField === 'education' ? 'shadow-[0_0_20px_rgba(34,211,238,0.5)]' : ''}`}>
                                <h3 className="text-2xl tracking-[0.2em] text-cyan-400 mb-4">{t.education}</h3>
                                <div className="space-y-4 font-sans">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-purple-400">{edu.degree}</h4>
                                            <p className="text-sm text-gray-500">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 border-2 border-purple-500 bg-black/30">
                                <h3 className="text-2xl tracking-[0.2em] text-purple-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2 font-sans">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-pink-500/20 border border-pink-500/50 text-pink-300 text-xs">{h.name}</span>
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

