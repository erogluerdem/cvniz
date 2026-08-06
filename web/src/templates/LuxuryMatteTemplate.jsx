import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Diamond } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function LuxuryMatteTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#a8a29e'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Expertise' : 'Uzmanlık',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Lifestyle' : 'Yaşam Tarzı'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-stone-100 text-stone-800 p-8 md:p-10 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.95rem' : theme?.fontSize === 'Büyük' ? '1.15rem' : '1.05rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Matte Luxury Header */}
                <header className={`mb-10 p-10 bg-stone-800 text-stone-100 ${highlightedField === 'personal' ? 'ring-4 ring-stone-400' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-36 h-36 overflow-hidden">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale-[0.3]" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                                <Diamond className="w-4 h-4 text-stone-400" />
                                <span className="text-xs font-sans uppercase tracking-[0.4em] text-stone-400">Premium Profile</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2 break-words">{personal.fullName || 'Full Name'}</h1>
                            <p className="text-xl text-stone-400 italic">{personal.title || 'Professional Title'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-4 bg-stone-100">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color="#44403c" />
                            </div>
                        )}
                    </div>
                </header>

                {/* Contact Strip */}
                <div className="mb-8 flex flex-wrap justify-center gap-8 text-sm text-stone-500 font-sans">
                    {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-10 p-8 bg-white break-inside-avoid page-break-inside-avoid">
                        <p className="text-xl leading-relaxed text-stone-600 italic text-center">"{personal.summary}"</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-8 bg-white ${highlightedField === 'experience' ? 'ring-2 ring-stone-400' : ''}`}>
                                <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-stone-400 mb-8">{t.experience}</h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-stone-300 pl-6 break-inside-avoid page-break-inside-avoid">
                                            <h3 className="text-2xl font-bold">{exp.position}</h3>
                                            <p className="text-stone-500 font-sans text-sm mb-1">{exp.company}</p>
                                            <p className="text-xs text-stone-400 font-sans mb-3">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-stone-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-8 bg-white break-inside-avoid page-break-inside-avoid">
                                <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-stone-400 mb-6">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-stone-50 break-inside-avoid page-break-inside-avoid">
                                            <p className="font-bold text-lg">{ref.name}</p>
                                            <p className="text-sm text-stone-500 font-sans">{ref.company}</p>
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
                            <section className="p-6 bg-stone-800 text-stone-100 break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">{t.skills}</h3>
                                <div className="space-y-3">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="text-lg border-b border-stone-700 pb-2 break-inside-avoid page-break-inside-avoid">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`p-6 bg-white ${highlightedField === 'education' ? 'ring-2 ring-stone-400' : ''}`}>
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-lg">{edu.degree}</h4>
                                            <p className="text-stone-500 text-sm font-sans">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white break-inside-avoid page-break-inside-avoid">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-stone-400 mb-4">{t.hobbies}</h3>
                                <div className="space-y-2 italic">
                                    {hobbies.map((h) => (
                                        <p key={h.id} className="text-stone-600">{h.name}</p>
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

