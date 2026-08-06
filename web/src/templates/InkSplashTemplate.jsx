import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, PenTool } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function InkSplashTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Journey' : 'Yolculuk',
        education: isEn ? 'Learning' : 'Öğrenim',
        skills: isEn ? 'Craft' : 'Zanaat',
        references: isEn ? 'Circle' : 'Çevre',
        hobbies: isEn ? 'Soul' : 'Ruh'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-stone-100 text-stone-800 p-8 md:p-10 relative overflow-hidden print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.95rem' : theme?.fontSize === 'Büyük' ? '1.15rem' : '1.05rem'
            }}>

            {/* Ink splash blobs */}
            <div className="absolute top-10 right-20 w-40 h-40 bg-stone-900 rounded-full opacity-5 blur-xl" />
            <div className="absolute bottom-20 left-10 w-60 h-32 bg-stone-900 rounded-full opacity-5 blur-2xl transform rotate-45" />
            <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-stone-900 rounded-full opacity-10 blur-lg" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Artistic Header with ink accent */}
                <header className={`mb-10 pb-8 border-b-4 border-stone-900 relative ${highlightedField === 'personal' ? 'bg-stone-200/50 p-6 -m-6 rounded-lg' : ''}`}>
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-stone-900 rounded-full opacity-10 blur-md" />

                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="relative">
                                <div className="absolute -inset-2 bg-stone-900 rounded-full opacity-10 blur-sm" />
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-stone-900 relative z-10">
                                    <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale-[0.3]" />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <PenTool className="w-5 h-5 text-stone-600" />
                                <span className="text-xs uppercase tracking-[0.4em] text-stone-500">Portfolio</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 break-words">{personal.fullName || 'Artist Name'}</h1>
                            <p className="text-xl text-stone-500 italic">{personal.title || 'Creative Professional'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color="#1c1917" />
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-stone-500">
                        {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</span>}
                        {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                        {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                    </div>
                </header>

                {/* Summary with ink drop */}
                {personal.summary && (
                    <section className="mb-10 relative break-inside-avoid page-break-inside-avoid">
                        <div className="absolute -left-8 top-0 w-1 h-full bg-stone-900" />
                        <div className="absolute -left-10 top-0 w-5 h-5 bg-stone-900 rounded-full" />
                        <p className="text-xl leading-relaxed italic text-stone-600 pl-4">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={highlightedField === 'experience' ? 'bg-stone-200/50 p-6 -mx-6 rounded-lg' : ''}>
                                <h2 className="text-sm uppercase tracking-[0.4em] text-stone-400 mb-8">{t.experience}</h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-stone-900 before:rounded-full break-inside-avoid page-break-inside-avoid">
                                            <h3 className="text-2xl font-bold">{exp.position}</h3>
                                            <p className="text-stone-500 italic">{exp.company}</p>
                                            <p className="text-sm text-stone-400 mb-3">{exp.startDate} — {exp.endDate}</p>
                                            <p className="text-stone-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-sm uppercase tracking-[0.4em] text-stone-400 mb-6">{t.references}</h2>
                                <div className="flex flex-wrap gap-6">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="relative p-4 bg-white border border-stone-200 shadow-sm break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-stone-900 rounded-full opacity-20" />
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-stone-500 italic">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {skills.length > 0 && (
                            <section className="p-6 bg-stone-900 text-stone-100 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-sm uppercase tracking-[0.3em] text-stone-400 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="border-b border-stone-700 pb-2 text-lg break-inside-avoid page-break-inside-avoid">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={highlightedField === 'education' ? 'bg-stone-200/50 p-4 rounded-lg' : ''}>
                                <h3 className="text-sm uppercase tracking-[0.3em] text-stone-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold">{edu.degree}</h4>
                                            <p className="text-sm text-stone-500 italic">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-sm uppercase tracking-[0.3em] text-stone-400 mb-4">{t.hobbies}</h3>
                                <div className="space-y-2 italic text-stone-600">
                                    {hobbies.map((h) => (
                                        <p key={h.id}>• {h.name}</p>
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

