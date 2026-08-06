import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Sun, Sunset } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function RetroWaveTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'CAREER' : 'KARİYER',
        education: isEn ? 'TRAINING' : 'EĞİTİM',
        skills: isEn ? 'POWER UPS' : 'GÜÇ',
        references: isEn ? 'ALLIES' : 'MÜTTEFIK',
        hobbies: isEn ? 'LEISURE' : 'BOŞ ZAMAN'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full text-white p-8 md:p-10 relative overflow-hidden print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Audiowide', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem',
                background: 'linear-gradient(180deg, #0c0c1d 0%, #1a1a3e 40%, #4a1942 70%, #ff6b35 100%)'
            }}>

            {/* Sun */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full opacity-80"
                style={{ background: 'linear-gradient(180deg, #ff6b35 0%, #f72585 50%, #7209b7 100%)' }} />

            {/* Grid lines */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30"
                style={{
                    backgroundImage: 'linear-gradient(transparent 0%, #ff6b35 100%), linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px), linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px)',
                    backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                    transform: 'perspective(500px) rotateX(60deg)',
                    transformOrigin: 'bottom'
                }} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Retro Header */}
                <header className={`mb-8 p-8 bg-black/40 backdrop-blur-sm border border-pink-500/50 ${highlightedField === 'personal' ? 'shadow-[0_0_30px_rgba(247,37,133,0.5)]' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-28 h-28 border-4 border-pink-500 p-1 bg-black"
                                style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}>
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <Sunset className="w-6 h-6 text-orange-400 inline mb-2" />
                            <h1 className="text-4xl md:text-5xl font-bold tracking-wider break-words bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">{personal.fullName || 'NAME'}</h1>
                            <p className="text-xl text-cyan-400 tracking-widest mt-2">{personal.title || 'TITLE'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-3 bg-black/60 border border-cyan-500">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#f72585" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-xs text-pink-300 font-mono">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>|</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>|</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-black/30 backdrop-blur-sm border-l-4 border-cyan-400 break-inside-avoid page-break-inside-avoid">
                        <p className="text-base font-mono text-cyan-100 leading-relaxed">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-black/40 backdrop-blur-sm border border-purple-500/50 ${highlightedField === 'experience' ? 'shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}>
                                <h2 className="text-2xl tracking-[0.3em] text-purple-400 mb-6">{t.experience}</h2>
                                <div className="space-y-6 font-mono">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-pink-500 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <h3 className="text-lg font-bold text-pink-400">{exp.position}</h3>
                                            <p className="text-cyan-400 text-sm">{exp.company}</p>
                                            <p className="text-xs text-purple-300 mb-2">{exp.startDate} — {exp.endDate}</p>
                                            <p className="text-sm text-gray-300">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-black/40 backdrop-blur-sm border border-cyan-500/50 break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-2xl tracking-[0.3em] text-cyan-400 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4 font-mono">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-purple-900/30 border border-purple-500/30 break-inside-avoid page-break-inside-avoid">
                                            <p className="font-bold text-pink-400">{ref.name}</p>
                                            <p className="text-xs text-cyan-300">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-gradient-to-b from-pink-900/40 to-purple-900/40 border border-pink-500/50 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xl tracking-[0.2em] text-pink-400 mb-4">{t.skills}</h3>
                                <div className="space-y-2 font-mono">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-2 bg-black/30 border border-cyan-500/30 text-cyan-300 text-sm break-inside-avoid page-break-inside-avoid">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-black/40 backdrop-blur-sm border border-purple-500/50 ${highlightedField === 'education' ? 'shadow-[0_0_20px_rgba(168,85,247,0.5)]' : ''}`}>
                                <h3 className="text-xl tracking-[0.2em] text-purple-400 mb-4">{t.education}</h3>
                                <div className="space-y-4 font-mono">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-pink-400 text-sm">{edu.degree}</h4>
                                            <p className="text-xs text-cyan-300">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-black/40 backdrop-blur-sm border border-cyan-500/50 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xl tracking-[0.2em] text-cyan-400 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2 font-mono">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-pink-900/30 text-pink-300 text-xs">{h.name}</span>
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

