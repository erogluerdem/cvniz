import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MinimalistTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, customSections, projects, certifications, references, hobbies } = data
    const accentColor = theme?.accentColor || '#1f2937'
    const fontSize = theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem'
    const isEn = theme?.language === 'en'

    const t = {
        expertise: isEn ? 'Expertise' : 'Uzmanlık',
        languages: isEn ? 'Languages' : 'Diller',
        interests: isEn ? 'Interests' : 'İlgi Alanları',
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        projects: isEn ? 'Projects' : 'Projeler',
        certifications: isEn ? 'Certifications' : 'Sertifikalar',
        references: isEn ? 'References' : 'Referanslar',
        summary: isEn ? 'Summary' : 'Özet'
    }

    return (
        <div id="cv-template-wrapper" className="p-10 md:p-14 min-h-[297mm] bg-white print-exact mx-auto print:mx-0 overflow-hidden" 
             style={{ 
                 fontFamily: theme?.fontFamily ? `'${theme.fontFamily}', sans-serif` : "'Inter', -apple-system, sans-serif",
                 fontSize: fontSize
             }}>
            
            {/* Header */}
            <header className={`text-center mb-10 pb-8 border-b transition-all duration-500 ${highlightedField?.startsWith('personal') ? 'bg-slate-50 p-4 rounded-xl' : ''}`} style={{ borderColor: accentColor + '20' }}>
                {personal.photo && (
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 ring-1 ring-slate-200 p-0.5">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-full" />
                        </div>
                    </div>
                )}
                
                <h1 className="text-3xl font-light text-slate-900 mb-2 tracking-widest uppercase">
                    {personal.fullName || 'Ad Soyad'}
                </h1>
                
                <p className="text-[13px] font-medium tracking-[0.2em] uppercase text-slate-500 mb-6">
                    {personal.title || 'Pozisyon'}
                </p>

                {/* Contact Info - Ultra Minimal Horizontal */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] text-slate-500 font-medium tracking-wide">
                    {personal.email && (
                        <div className="flex items-center gap-2">
                            <span style={{ color: accentColor }}>•</span>
                            <span>{personal.email}</span>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="flex items-center gap-2">
                            <span style={{ color: accentColor }}>•</span>
                            <span>{personal.phone}</span>
                        </div>
                    )}
                    {personal.location && (
                        <div className="flex items-center gap-2">
                            <span style={{ color: accentColor }}>•</span>
                            <span>{personal.location}</span>
                        </div>
                    )}
                    {personal.linkedin && (
                        <div className="flex items-center gap-2">
                            <span style={{ color: accentColor }}>•</span>
                            <span>{personal.linkedin}</span>
                        </div>
                    )}
                    {personal.website && (
                        <div className="flex items-center gap-2">
                            <span style={{ color: accentColor }}>•</span>
                            <span>{personal.website}</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Summary */}
            {personal.summary && (
                <section className="mb-12 break-inside-avoid">
                    <p className="text-slate-600 text-[13px] text-center max-w-3xl mx-auto leading-relaxed font-light">
                        {personal.summary}
                    </p>
                </section>
            )}

            <div className="max-w-4xl mx-auto">
                {/* Experience */}
                {experience?.length > 0 && (
                    <section className={`mb-12 break-inside-avoid transition-all duration-500 ${highlightedField === 'experience' ? 'bg-slate-50 p-4 rounded-xl -mx-4 px-4' : ''}`}>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 text-center flex items-center justify-center gap-4">
                            <div className="h-px w-8 bg-slate-200" />
                            {t.experience}
                            <div className="h-px w-8 bg-slate-200" />
                        </h2>
                        <div className="space-y-8">
                            {experience.map((exp) => (
                                <div key={exp.id} className="grid grid-cols-[140px_1fr] gap-8 break-inside-avoid">
                                    <div className="text-right pt-0.5">
                                        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                            {exp.startDate} <br/> {exp.endDate}
                                        </div>
                                    </div>
                                    <div className="pl-6 border-l" style={{ borderColor: accentColor + '20' }}>
                                        <h3 className="font-bold text-slate-900 text-[14px] tracking-tight">{exp.position}</h3>
                                        <p className="text-[12px] font-medium text-slate-500 mb-3">{exp.company}</p>
                                        {exp.description && (
                                            <p className="text-slate-600 text-[12px] leading-relaxed font-light">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <section className={`mb-12 break-inside-avoid transition-all duration-500 ${highlightedField === 'education' ? 'bg-slate-50 p-4 rounded-xl -mx-4 px-4' : ''}`}>
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 text-center flex items-center justify-center gap-4">
                            <div className="h-px w-8 bg-slate-200" />
                            {t.education}
                            <div className="h-px w-8 bg-slate-200" />
                        </h2>
                        <div className="space-y-6">
                            {education.map((edu) => (
                                <div key={edu.id} className="grid grid-cols-[140px_1fr] gap-8 break-inside-avoid">
                                    <div className="text-right pt-0.5">
                                        <div className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                            {edu.startDate} <br/> {edu.endDate}
                                        </div>
                                    </div>
                                    <div className="pl-6 border-l" style={{ borderColor: accentColor + '20' }}>
                                        <h3 className="font-bold text-slate-900 text-[14px] tracking-tight">{edu.school}</h3>
                                        <p className="text-slate-600 text-[13px] font-light">{edu.degree}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects?.length > 0 && (
                    <section className="mb-12 break-inside-avoid">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-8 text-center flex items-center justify-center gap-4">
                            <div className="h-px w-8 bg-slate-200" />
                            {t.projects}
                            <div className="h-px w-8 bg-slate-200" />
                        </h2>
                        <div className="grid grid-cols-2 gap-8">
                            {projects.map(p => (
                                <div key={p.id} className="break-inside-avoid">
                                    <h3 className="font-bold text-slate-900 text-[13px]">{p.name}</h3>
                                    <p className="text-slate-500 text-[12px] font-light mt-1 mb-2 leading-relaxed">{p.description}</p>
                                    {p.link && (
                                        <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} className="text-[10px] uppercase tracking-widest font-bold" style={{ color: accentColor }}>
                                            Link
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Multi-Column Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-12">
                    
                    {/* Skills */}
                    {skills?.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-2" style={{ borderColor: accentColor + '20' }}>
                                {t.expertise}
                            </h2>
                            <ul className="space-y-2">
                                {skills.map((skill, index) => (
                                    <li key={index} className="text-[12px] text-slate-600 font-light flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Languages */}
                    {languages?.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-2" style={{ borderColor: accentColor + '20' }}>
                                {t.languages}
                            </h2>
                            <div className="space-y-3">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center text-[12px]">
                                        <span className="text-slate-700 font-medium">{lang.name}</span>
                                        <span className="text-slate-400 font-light">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {certifications?.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-2" style={{ borderColor: accentColor + '20' }}>
                                {t.certifications}
                            </h2>
                            <div className="space-y-4">
                                {certifications.map((cert) => (
                                    <div key={cert.id}>
                                        <h4 className="font-bold text-slate-700 text-[12px]">{cert.name}</h4>
                                        <p className="text-[11px] text-slate-500 font-light">{cert.issuer}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* References */}
                    {references?.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-2" style={{ borderColor: accentColor + '20' }}>
                                {t.references}
                            </h2>
                            <div className="space-y-4">
                                {references.map((ref) => (
                                    <div key={ref.id}>
                                        <h4 className="font-bold text-slate-700 text-[12px]">{ref.name}</h4>
                                        <p className="text-[11px] text-slate-500 font-medium">{ref.company}</p>
                                        <p className="text-[10px] text-slate-400 font-light">{ref.email || ref.phone}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Interests */}
                    {hobbies?.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 border-b pb-2" style={{ borderColor: accentColor + '20' }}>
                                {t.interests}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {hobbies.map((hobby) => (
                                    <span key={hobby.id} className="text-[11px] font-light text-slate-600 border px-2 py-1 rounded-sm" style={{ borderColor: accentColor + '20' }}>
                                        {hobby.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Custom Sections */}
                {customSections?.length > 0 && (
                    <section className="mt-12 space-y-10 border-t pt-10 break-inside-avoid" style={{ borderColor: accentColor + '20' }}>
                        {customSections.map(section => (
                            <div key={section.id}>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 text-center flex items-center justify-center gap-4">
                                    <div className="h-px w-8 bg-slate-200" />
                                    {section.title}
                                    <div className="h-px w-8 bg-slate-200" />
                                </h2>
                                <p className="text-slate-600 text-[12px] leading-relaxed max-w-2xl mx-auto text-center font-light">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </section>
                )}

                {/* Footer QR Code */}
                {theme?.showQrCode && (personal.website || personal.linkedin) && (
                    <div className="mt-12 pt-8 border-t flex justify-center break-inside-avoid" style={{ borderColor: accentColor + '20' }}>
                        <QRCodeDisplay
                            url={personal.website || personal.linkedin}
                            label={personal.website ? 'Web Sitesi' : 'LinkedIn Profilim'}
                            size={64}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
