import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function VintageClassTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#78350f'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Professional History' : 'Mesleki Geçmiş',
        education: isEn ? 'Academic Record' : 'Akademik Kayıt',
        skills: isEn ? 'Proficiencies' : 'Uzmanlıklar',
        references: isEn ? 'Character References' : 'Karakter Referansları',
        hobbies: isEn ? 'Personal Pursuits' : 'Kişisel İlgiler'
    }

    return (
        <div className="min-h-full bg-amber-50 text-amber-950 p-8 md:p-12"
            style={{
                fontFamily: "'Merriweather', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Vintage border frame */}
            <div className="max-w-4xl mx-auto p-8 md:p-10 border-4 border-double border-amber-900/30 bg-amber-50">

                {/* Ornamental Header */}
                <header className={`mb-10 text-center pb-8 border-b-2 border-amber-900/20 ${highlightedField === 'personal' ? 'bg-amber-100 -m-4 p-4 rounded' : ''}`}>
                    <div className="text-xs uppercase tracking-[0.5em] text-amber-700 mb-4">— Curriculum Vitae —</div>

                    {personal.photo && (
                        <div className="w-32 h-32 mx-auto mb-6 border-4 border-amber-900/30 p-1 bg-white">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover sepia-[0.3]" />
                        </div>
                    )}

                    <h1 className="text-4xl font-bold mb-2 break-words">{personal.fullName || 'Full Name'}</h1>
                    <p className="text-xl text-amber-700 italic mb-6">{personal.title || 'Professional Title'}</p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-amber-800">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>•</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>•</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-10 text-center max-w-2xl mx-auto">
                        <Quote className="w-8 h-8 mx-auto mb-4 text-amber-400" />
                        <p className="text-lg leading-relaxed italic text-amber-900">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={highlightedField === 'experience' ? 'bg-amber-100 p-6 -mx-6 rounded' : ''}>
                                <h2 className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-6 flex items-center gap-4">
                                    <span className="flex-1 h-px bg-amber-300" />
                                    {t.experience}
                                    <span className="flex-1 h-px bg-amber-300" />
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id}>
                                            <h3 className="text-lg font-bold">{exp.position}</h3>
                                            <p className="text-amber-700 italic">{exp.company}</p>
                                            <p className="text-xs text-amber-600 mb-2">{exp.startDate} — {exp.endDate}</p>
                                            <p className="text-amber-900 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-6 flex items-center gap-4">
                                    <span className="flex-1 h-px bg-amber-300" />
                                    {t.references}
                                    <span className="flex-1 h-px bg-amber-300" />
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="text-center p-4 border border-amber-200 bg-white">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-amber-700 italic">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6 border-l-2 border-amber-200 pl-6">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">{t.skills}</h3>
                                <ul className="space-y-2 list-disc list-inside text-sm text-amber-900">
                                    {skills.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={highlightedField === 'education' ? 'bg-amber-100 p-3 -ml-3 rounded' : ''}>
                                <h3 className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-amber-700 text-xs italic">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-4">{t.hobbies}</h3>
                                <ul className="space-y-1 text-sm text-amber-900 italic">
                                    {hobbies.map((h) => (
                                        <li key={h.id}>{h.name}</li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {theme?.showQrCode && (
                            <div className="pt-4 border-t border-amber-200 flex justify-center">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color={accentColor} />
                            </div>
                        )}
                    </aside>
                </div>

            </div>
        </div>
    )
}

