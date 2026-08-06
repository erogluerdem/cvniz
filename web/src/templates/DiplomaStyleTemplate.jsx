import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Medal } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function DiplomaStyleTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#15803d'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Professional Record' : 'Mesleki Kayıt',
        education: isEn ? 'Academic Credentials' : 'Akademik Belgeler',
        skills: isEn ? 'Certified Skills' : 'Sertifikalı Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Personal Interests' : 'Kişisel İlgiler'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-emerald-50 text-slate-800 p-8 md:p-12 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Certificate Frame */}
            <div className="max-w-4xl mx-auto p-6 border-8 border-emerald-800 bg-white relative">
                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-600" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-600" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-600" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-600" />

                <div className="p-8">
                    {/* Diploma Header */}
                    <header className={`mb-8 text-center pb-6 border-b-2 border-emerald-200 ${highlightedField === 'personal' ? 'bg-emerald-50 -m-4 p-4 rounded' : ''}`}>
                        <Medal className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                        <div className="text-xs uppercase tracking-[0.5em] text-emerald-600 mb-4 font-sans">Certificate of Professional Excellence</div>

                        {personal.photo && (
                            <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-emerald-600 p-1 bg-white overflow-hidden">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-full" />
                            </div>
                        )}

                        <h1 className="text-4xl font-bold text-emerald-800 mb-2 break-words">{personal.fullName || 'Certified Professional'}</h1>
                        <p className="text-xl text-emerald-600 italic">{personal.title || 'Professional Title'}</p>
                    </header>

                    {/* Contact */}
                    <div className="mb-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-sans">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>|</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>|</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>

                    {/* Summary */}
                    {personal.summary && (
                        <section className="mb-8 p-6 bg-emerald-50 text-center break-inside-avoid page-break-inside-avoid">
                            <p className="text-lg leading-relaxed text-emerald-900 italic">{personal.summary}</p>
                        </section>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Experience */}
                            {experience.length > 0 && (
                                <section className={highlightedField === 'experience' ? 'bg-emerald-50 p-4 -mx-4 rounded' : ''}>
                                    <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-emerald-700 mb-6 text-center border-b border-emerald-200 pb-2">{t.experience}</h2>
                                    <div className="space-y-6">
                                        {experience.map((exp) => (
                                            <div key={exp.id} className="text-center break-inside-avoid page-break-inside-avoid">
                                                <h3 className="text-xl font-bold text-emerald-800">{exp.position}</h3>
                                                <p className="text-emerald-600 font-sans text-sm">{exp.company}</p>
                                                <p className="text-xs text-slate-500 font-sans mb-2">{exp.startDate} — {exp.endDate}</p>
                                                <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* References */}
                            {references?.length > 0 && (
                                <section>
                                    <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4 text-center">{t.references}</h2>
                                    <div className="flex flex-wrap justify-center gap-6 text-center">
                                        {references.map((ref) => (
                                            <div key={ref.id} className="p-4 border border-emerald-200 rounded break-inside-avoid page-break-inside-avoid">
                                                <p className="font-bold">{ref.name}</p>
                                                <p className="text-sm text-slate-500 font-sans">{ref.company}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6 border-l border-emerald-200 pl-6">
                            {/* Skills */}
                            {skills.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4">{t.skills}</h3>
                                    <div className="space-y-2">
                                        {skills.map((skill, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm break-inside-avoid page-break-inside-avoid">
                                                <Award className="w-4 h-4 text-emerald-600" />
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Education */}
                            {education.length > 0 && (
                                <section className={highlightedField === 'education' ? 'bg-emerald-50 p-3 -ml-3 rounded' : ''}>
                                    <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-emerald-700 mb-4">{t.education}</h3>
                                    <div className="space-y-4">
                                        {education.map((edu) => (
                                            <div key={edu.id}>
                                                <h4 className="font-bold">{edu.degree}</h4>
                                                <p className="text-emerald-600 text-sm font-sans">{edu.school}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Hobbies */}
                            {hobbies?.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-emerald-700 mb-3">{t.hobbies}</h3>
                                    <ul className="space-y-1 text-sm italic text-slate-600">
                                        {hobbies.map((h) => (
                                            <li key={h.id}>{h.name}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}

                            {theme?.showQrCode && (
                                <div className="pt-4 flex justify-center">
                                    <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color={accentColor} />
                                </div>
                            )}
                        </aside>
                    </div>

                </div>
            </div>
        </div>
    )
}

