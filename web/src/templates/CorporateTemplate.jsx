import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, CheckCircle, Quote } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CorporateTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, customSections, projects, certifications, references, hobbies } = data
    
    // Dynamic styling
    const accentColor = theme?.accentColor || '#1e3a8a' // Default to a deep corporate blue
    const fontSize = theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem'
    const isEn = theme?.language === 'en'

    const t = {
        expertise: isEn ? 'Areas of Expertise' : 'Uzmanlık Alanları',
        languages: isEn ? 'Languages' : 'Dil Becerileri',
        interests: isEn ? 'Interests' : 'İlgi Alanları',
        experience: isEn ? 'Professional Experience' : 'İş Deneyimi',
        education: isEn ? 'Education' : 'Eğitim',
        projects: isEn ? 'Key Projects' : 'Önemli Projeler',
        certifications: isEn ? 'Certifications' : 'Sertifikalar',
        references: isEn ? 'References' : 'Referanslar',
        summary: isEn ? 'Executive Summary' : 'Profesyonel Özet'
    }

    // Convert hex to rgb for rgba operations
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '30, 58, 138';
    };
    const accentRgb = hexToRgb(accentColor);

    return (
        <div id="cv-template-wrapper" className="min-h-[297mm] bg-white print-exact mx-auto print:mx-0 overflow-hidden" 
             style={{ 
                 fontFamily: theme?.fontFamily ? `'${theme.fontFamily}', sans-serif` : "'Inter', -apple-system, sans-serif",
                 fontSize: fontSize
             }}>
            
            {/* Header */}
            <header className="text-white px-10 py-10 md:py-12 relative overflow-hidden" style={{ backgroundColor: accentColor }}>
                {/* Abstract corporate pattern overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar/Photo */}
                    {personal.photo && (
                        <div className={`transition-all duration-500 shrink-0 ${highlightedField?.startsWith('personal') ? 'ring-4 ring-white/50 scale-105 rounded-xl' : ''}`}>
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 text-center md:text-left pt-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-1 tracking-tight text-white">{personal.fullName || 'Ad Soyad'}</h1>
                        <p className="text-white/80 text-lg md:text-xl font-medium tracking-wide mb-5 uppercase text-[15px]">{personal.title || 'Pozisyon'}</p>

                        {/* Contact Info */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-[12px] font-medium text-white/90">
                            {personal.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-white/70" />
                                    <span className="tracking-wide">{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-white/70" />
                                    <span className="tracking-wide">{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-white/70" />
                                    <span className="tracking-wide">{personal.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-10 md:p-12">
                {/* Summary */}
                {personal.summary && (
                    <section className={`mb-10 p-6 rounded-xl border-l-4 break-inside-avoid transition-all duration-500 ${highlightedField === 'personal.summary' ? 'shadow-md scale-[1.01]' : 'shadow-sm'}`} style={{ backgroundColor: `rgba(${accentRgb}, 0.03)`, borderColor: accentColor }}>
                        <div className="flex items-center gap-2 mb-3">
                            <Quote className="w-4 h-4" style={{ color: accentColor }} />
                            <h2 className="text-[12px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                                {t.summary}
                            </h2>
                        </div>
                        <p className="text-slate-700 text-[13.5px] leading-relaxed text-justify font-medium">
                            {personal.summary}
                        </p>
                    </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left Column - Experience & Education */}
                    <div className="col-span-1 md:col-span-2 space-y-10">
                        {/* Experience */}
                        {experience?.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'bg-slate-50 p-4 rounded-xl -mx-4 px-4' : ''}`}>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `rgba(${accentRgb}, 0.1)` }}>
                                        <Briefcase className="w-5 h-5" style={{ color: accentColor }} />
                                    </div>
                                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-slate-800">
                                        {t.experience}
                                    </h2>
                                </div>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative break-inside-avoid">
                                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-[16px] tracking-tight">{exp.position}</h3>
                                                    <p className="text-[14px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">
                                                    {exp.startDate} — {exp.endDate}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-slate-600 text-[13px] leading-relaxed text-justify mt-3">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {projects?.length > 0 && (
                            <section>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `rgba(${accentRgb}, 0.1)` }}>
                                        <CheckCircle className="w-5 h-5" style={{ color: accentColor }} />
                                    </div>
                                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-slate-800">
                                        {t.projects}
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    {projects.map((p) => (
                                        <div key={p.id} className="break-inside-avoid bg-slate-50 p-4 rounded-lg border border-slate-100">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-slate-900 text-[14px]">{p.name}</h3>
                                                {p.link && (
                                                    <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                                                        Link
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-slate-600 text-[12.5px] leading-relaxed">{p.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education?.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'bg-slate-50 p-4 rounded-xl -mx-4 px-4' : ''}`}>
                                <div className="flex items-center gap-3 mb-6 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: `rgba(${accentRgb}, 0.1)` }}>
                                        <GraduationCap className="w-5 h-5" style={{ color: accentColor }} />
                                    </div>
                                    <h2 className="text-[14px] font-bold uppercase tracking-wider text-slate-800">
                                        {t.education}
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="flex flex-col md:flex-row justify-between items-start break-inside-avoid gap-2 border-l-2 pl-4" style={{ borderColor: `rgba(${accentRgb}, 0.2)` }}>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-[15px]">{edu.school}</h3>
                                                <p className="text-[13px] font-medium mt-0.5" style={{ color: accentColor }}>{edu.degree}</p>
                                                {edu.description && (
                                                    <p className="text-slate-500 text-[12px] mt-2">{edu.description}</p>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                {edu.startDate} — {edu.endDate}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-8">
                        {/* Skills */}
                        {skills?.length > 0 && (
                            <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider mb-5 flex items-center gap-2 text-slate-800">
                                    <Award className="w-4 h-4" style={{ color: accentColor }} />
                                    {t.expertise}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex items-center gap-3 break-inside-avoid">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                                            <span className="text-slate-700 text-[13px] font-medium">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider mb-5 flex items-center gap-2 text-slate-800">
                                    <Globe className="w-4 h-4" style={{ color: accentColor }} />
                                    {t.languages}
                                </h2>
                                <div className="space-y-4">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="break-inside-avoid">
                                            <div className="flex justify-between text-[12px] mb-1.5 font-medium">
                                                <span className="text-slate-800">{lang.name}</span>
                                                <span className="text-slate-500">{lang.level}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        backgroundColor: accentColor,
                                                        width: lang.level?.includes('Ana') || lang.level?.toLowerCase().includes('native') ? '100%' :
                                                            lang.level?.includes('İleri') || lang.level?.toLowerCase().includes('advanced') ? '85%' :
                                                                lang.level?.includes('Orta') || lang.level?.toLowerCase().includes('intermediate') ? '60%' : '40%'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certifications */}
                        {certifications?.length > 0 && (
                            <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider mb-5 flex items-center gap-2 text-slate-800">
                                    <Award className="w-4 h-4" style={{ color: accentColor }} />
                                    {t.certifications}
                                </h2>
                                <div className="space-y-4">
                                    {certifications.map((cert) => (
                                        <div key={cert.id}>
                                            <h4 className="font-bold text-slate-800 text-[12px] leading-tight mb-1">{cert.name}</h4>
                                            <p className="text-[11px] font-medium" style={{ color: accentColor }}>{cert.issuer}</p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{cert.date}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider mb-5 flex items-center gap-2 text-slate-800">
                                    <Quote className="w-4 h-4" style={{ color: accentColor }} />
                                    {t.references}
                                </h2>
                                <div className="space-y-4">
                                    {references.map((ref) => (
                                        <div key={ref.id}>
                                            <h4 className="font-bold text-slate-800 text-[12px]">{ref.name}</h4>
                                            <p className="text-[11px] font-medium text-slate-600">{ref.company}</p>
                                            <p className="text-[10px] text-slate-500">{ref.email || ref.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        {/* Interests */}
                        {hobbies?.length > 0 && (
                            <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider mb-5 text-slate-800">
                                    {t.interests}
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((hobby) => (
                                        <span key={hobby.id} className="text-[11px] font-medium text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
                                            {hobby.name}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Links */}
                        {(personal.linkedin || personal.website) && (
                            <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider mb-5 text-slate-800">
                                    Links
                                </h2>
                                <div className="space-y-3 text-[12px] font-medium">
                                    {personal.linkedin && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Linkedin className="w-4 h-4" style={{ color: accentColor }} />
                                            <span className="break-all">{personal.linkedin}</span>
                                        </div>
                                    )}
                                    {personal.website && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Globe className="w-4 h-4" style={{ color: accentColor }} />
                                            <span className="break-all">{personal.website}</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Custom Sections in Sidebar */}
                        {customSections && customSections.map(section => (
                            <section key={section.id} className="bg-slate-50 rounded-xl p-6 border border-slate-100 break-inside-avoid">
                                <h2 className="text-[13px] font-bold uppercase tracking-wider mb-4 text-slate-800">
                                    {section.title}
                                </h2>
                                <p className="text-slate-600 text-[12.5px] leading-relaxed whitespace-pre-line text-justify">
                                    {section.content}
                                </p>
                            </section>
                        ))}

                        {/* QR Code */}
                        {theme?.showQrCode && (personal.website || personal.linkedin) && (
                            <section className="flex justify-center break-inside-avoid pt-4">
                                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <QRCodeDisplay
                                        url={personal.website || personal.linkedin}
                                        label=""
                                        size={72}
                                    />
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
