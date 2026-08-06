import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, BookOpen, GraduationCap as Cap } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function AcademicSerifTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#1e293b' // Deep navy
    const isEn = theme?.language === 'en'

    const t = {
        personal: isEn ? 'Biographical Summary' : 'Biyografik Özet',
        experience: isEn ? 'Professional Experience' : 'Mesleki Deneyim',
        education: isEn ? 'Academic Background' : 'Akademik Geçmiş',
        skills: isEn ? 'Scholarly Expertise' : 'Bilimsel Yetkinlikler',
        references: isEn ? 'Academic Referees' : 'Akademik Referanslar',
        hobbies: isEn ? 'Research Interests' : 'Araştırma İlgi Alanları',
        contact: isEn ? 'Contact Information' : 'İletişim Bilgileri'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-slate-900 p-0 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem'
            }}>

            <div className="max-w-6xl mx-auto p-8 md:p-10 border-x border-slate-100 min-h-screen">
                {/* Traditional Academic Header */}
                <header className={`mb-12 text-center border-b-2 border-slate-900 pb-12 transition-all duration-500 ${highlightedField === 'personal' ? 'bg-slate-50 p-8' : ''}`}>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 break-words">
                        {personal.fullName || 'SCHOLAR NAME'}
                    </h1>
                    <p className="text-xl md:text-2xl font-bold italic text-slate-600 mb-12">
                        {personal.title || 'Academic Researcher'}
                    </p>

                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-xs font-sans font-bold uppercase tracking-widest text-slate-500">
                        {personal.email && <div className="flex items-center gap-2 underline underline-offset-4 decoration-slate-200">{personal.email}</div>}
                        {personal.phone && <div className="flex items-center gap-2">{personal.phone}</div>}
                        {personal.location && <div className="flex items-center gap-2">{personal.location}</div>}
                    </div>

                    {personal.photo && (
                        <div className="mt-12 flex justify-center">
                            <div className="w-40 h-40 rounded-none border border-slate-300 p-1 bg-white grayscale contrast-125 shadow-sm">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Bio Summary */}
                        {personal.summary && (
                            <section>
                                <h2 className="text-xs font-sans font-black uppercase tracking-[0.4em] mb-8 text-slate-500 border-l-4 border-slate-900 pl-4">{t.personal}</h2>
                                <p className="text-xl leading-relaxed text-slate-700 italic border-l-4 border-slate-100 pl-8">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* Academic Education (Priority for scholars) */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'bg-slate-50 p-10 ring-1 ring-slate-200' : ''}`}>
                                <h2 className="text-xs font-sans font-black uppercase tracking-[0.4em] mb-12 text-slate-500 border-l-4 border-slate-900 pl-4">{t.education}</h2>
                                <div className="space-y-16">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="relative break-inside-avoid page-break-inside-avoid">
                                            <div className="flex flex-col md:flex-row justify-between items-baseline mb-4 gap-4">
                                                <h3 className="text-2xl font-black text-slate-900">{edu.degree}</h3>
                                                <span className="text-sm font-sans font-black italic text-slate-500">
                                                    {edu.startDate} – {edu.endDate}
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold italic text-slate-600 mb-4">{edu.school}</p>
                                            <div className="h-px w-20 bg-slate-200" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.01]' : ''}`}>
                                <h2 className="text-xs font-sans font-black uppercase tracking-[0.4em] mb-12 text-slate-500 border-l-4 border-slate-900 pl-4">{t.experience}</h2>
                                <div className="space-y-16">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="group break-inside-avoid page-break-inside-avoid">
                                            <div className="flex flex-col md:flex-row justify-between items-baseline mb-4 gap-4">
                                                <h3 className="text-2xl font-black text-slate-900 group-hover:underline decoration-slate-300 underline-offset-8 transition-all">{exp.position}</h3>
                                                <span className="text-sm font-sans font-bold text-slate-500 capitalize">
                                                    {exp.startDate} – {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-lg font-bold italic text-slate-600 mb-6">{exp.company}</p>
                                            <p className="text-base text-slate-700 leading-relaxed max-w-2xl font-medium">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Referees */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-xs font-sans font-black uppercase tracking-[0.4em] mb-12 text-slate-500 border-l-4 border-slate-900 pl-4">{t.references}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="border-b border-slate-100 pb-8 break-inside-avoid page-break-inside-avoid">
                                            <p className="text-xl font-black italic mb-2">{ref.name}</p>
                                            <p className="text-xs font-sans font-black uppercase tracking-widest text-slate-500 mb-4">{ref.company}</p>
                                            <div className="space-y-1 font-sans text-[10px] font-black uppercase text-slate-300">
                                                <p className="hover:text-slate-900 transition-colors">{ref.email}</p>
                                                <p>{ref.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12 border-l border-slate-50 pl-8">
                        {/* Expertise */}
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-slate-500 mb-10 flex items-center gap-3">
                                    <BookOpen className="w-4 h-4 text-slate-900" /> {t.skills}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-4 group break-inside-avoid page-break-inside-avoid">
                                            <div className="w-1 h-1 bg-slate-900 rounded-full" />
                                            <span className="text-sm font-bold italic text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Research Interests */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-slate-500 mb-8">{t.hobbies}</h3>
                                <div className="space-y-4">
                                    {hobbies.map((h) => (
                                        <div key={h.id} className="text-xs font-bold italic text-slate-500 border-l-2 border-slate-100 pl-4 py-1 hover:border-slate-900 transition-colors break-inside-avoid page-break-inside-avoid">
                                            {h.name}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Authenticity QR */}
                        {theme?.showQrCode && (
                            <div className="p-10 bg-slate-50 rounded-none border border-slate-200 text-center">
                                <QRCodeDisplay
                                    value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                    size={120}
                                    color="#0f172a"
                                />
                                <p className="mt-6 text-[8px] font-sans font-black uppercase tracking-[0.3em] text-slate-300">Scholarly Verification Hub</p>
                            </div>
                        )}

                        {/* Certifications (Academic) */}
                        {certifications?.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-slate-500 mb-8">{isEn ? 'CREDENTIALS' : 'SERTİFİKALAR'}</h3>
                                <div className="space-y-6">
                                    {certifications.map((cert) => (
                                        <div key={cert.id} className="flex gap-4 break-inside-avoid page-break-inside-avoid">
                                            <Cap className="w-5 h-5 text-slate-900 shrink-0" />
                                            <div>
                                                <p className="text-sm font-black italic">{cert.name}</p>
                                                <p className="text-[10px] font-sans font-black text-slate-300 uppercase">{cert.issuer}</p>
                                            </div>
                                        </div>
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

