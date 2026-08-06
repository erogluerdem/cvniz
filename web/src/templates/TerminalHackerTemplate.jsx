import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Terminal, ChevronRight } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function TerminalHackerTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#22c55e'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'work_history' : 'is_gecmisi',
        education: isEn ? 'education' : 'egitim',
        skills: isEn ? 'skills' : 'yetenekler',
        references: isEn ? 'references' : 'referanslar',
        hobbies: isEn ? 'interests' : 'ilgi_alanlari'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-black text-green-400 p-6 md:p-8 font-mono print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Terminal Header */}
                <header className={`mb-6 p-4 bg-gray-900 border border-green-500/30 rounded-lg ${highlightedField === 'personal' ? 'ring-2 ring-green-500' : ''}`}>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-green-500/20">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-xs text-green-500/50">user@CVniz:~$ cat profile.json</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {personal.photo && (
                            <div className="w-24 h-24 border border-green-500/50 p-1 bg-black">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale brightness-125" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="text-green-300">{'{'}</div>
                            <div className="pl-4">
                                <p><span className="text-yellow-400">"name"</span>: <span className="text-white">"{personal.fullName || 'Anonymous'}"</span>,</p>
                                <p><span className="text-yellow-400">"role"</span>: <span className="text-white">"{personal.title || 'Developer'}"</span>,</p>
                                <p><span className="text-yellow-400">"email"</span>: <span className="text-cyan-400">"{personal.email || 'null'}"</span>,</p>
                                <p><span className="text-yellow-400">"phone"</span>: <span className="text-white">"{personal.phone || 'null'}"</span>,</p>
                                <p><span className="text-yellow-400">"location"</span>: <span className="text-white">"{personal.location || 'Remote'}"</span></p>
                            </div>
                            <div className="text-green-300">{'}'}</div>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 border border-green-500/30 bg-black">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#22c55e" />
                            </div>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-6 p-4 bg-gray-900/50 border-l-2 border-green-500 break-inside-avoid page-break-inside-avoid">
                        <p className="text-sm text-green-300"><span className="text-green-500">&gt;</span> {personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-4 bg-gray-900/50 border border-green-500/20 rounded ${highlightedField === 'experience' ? 'border-green-500' : ''}`}>
                                <h2 className="text-xs text-green-500 mb-4 flex items-center gap-2">
                                    <Terminal className="w-4 h-4" /> $ ls ./{t.experience}/
                                </h2>
                                <div className="space-y-4">
                                    {experience.map((exp, idx) => (
                                        <div key={exp.id} className="border-l border-green-500/30 pl-4 break-inside-avoid page-break-inside-avoid">
                                            <p className="text-yellow-400 text-sm"><ChevronRight className="w-3 h-3 inline" /> {exp.position}</p>
                                            <p className="text-cyan-400 text-xs">@ {exp.company}</p>
                                            <p className="text-green-500/50 text-xs"># {exp.startDate} - {exp.endDate}</p>
                                            <p className="text-green-300 text-sm mt-2">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-4 bg-gray-900/50 border border-green-500/20 rounded break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-xs text-green-500 mb-4">$ cat {t.references}.txt</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-3 border border-green-500/20 bg-black/50 break-inside-avoid page-break-inside-avoid">
                                            <p className="text-yellow-400 text-sm">{ref.name}</p>
                                            <p className="text-xs text-green-500/50">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-4">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <section className="p-4 bg-green-500/10 border border-green-500/30 rounded break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs text-green-500 mb-3">$ echo ${t.skills}</h3>
                                <div className="space-y-1">
                                    {skills.map((skill, i) => (
                                        <p key={i} className="text-sm text-green-300">├── {skill}</p>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`p-4 bg-gray-900/50 border border-green-500/20 rounded ${highlightedField === 'education' ? 'border-green-500' : ''}`}>
                                <h3 className="text-xs text-green-500 mb-3">$ grep {t.education}</h3>
                                <div className="space-y-3">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <p className="text-yellow-400 text-sm">{edu.degree}</p>
                                            <p className="text-xs text-cyan-400">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section className="p-4 bg-gray-900/50 border border-green-500/20 rounded break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs text-green-500 mb-3">$ npm list {t.hobbies}</h3>
                                <div className="space-y-1 text-xs text-green-300">
                                    {hobbies.map((h) => (
                                        <p key={h.id}>└── {h.name}</p>
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

