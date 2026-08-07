import { Mail, Phone, MapPin, Linkedin, Globe, Award, TrendingUp, Users, BookOpen, CheckCircle } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ExecutiveTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#b45309' // Default to amber/gold
    const fontSize = theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem'
    const isEn = theme?.language === 'en'

    const t = {
        contact: isEn ? 'Contact' : 'İletişim',
        expertise: isEn ? 'Core Competencies' : 'Temel Yetkinlikler',
        languages: isEn ? 'Languages' : 'Diller',
        interests: isEn ? 'Interests' : 'İlgi Alanları',
        experience: isEn ? 'Executive Experience' : 'Yönetici Deneyimi',
        education: isEn ? 'Education' : 'Eğitim',
        projects: isEn ? 'Key Projects' : 'Önemli Projeler',
        certifications: isEn ? 'Certifications' : 'Sertifikalar',
        references: isEn ? 'References' : 'Referanslar',
        summary: isEn ? 'Executive Summary' : 'Yönetici Özeti'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-[297mm] bg-white print-exact mx-auto print:mx-0 overflow-hidden" 
            style={{ 
                fontFamily: theme.fontFamily ? `'${theme.fontFamily}', serif` : "'Playfair Display', Georgia, serif",
                fontSize: fontSize
            }}>
            
            {/* Luxury Header */}
            <header className="bg-slate-900 text-white relative">
                {/* Accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ backgroundColor: accentColor }}></div>
                
                <div className="px-10 py-12 md:px-16 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                    {personal.photo && (
                        <div className={`transition-all duration-500 shrink-0 ${highlightedField?.startsWith('personal') ? 'ring-4 ring-cyan-500/50 scale-105 rounded-full' : ''}`}>
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 overflow-hidden shadow-2xl relative" style={{ borderColor: accentColor }}>
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                    
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                            {personal.fullName || 'Ad Soyad'}
                        </h1>
                        <p className="text-xl md:text-2xl font-medium tracking-wide uppercase" style={{ color: accentColor }}>
                            {personal.title || 'Executive Position'}
                        </p>

                        {/* Elegant Contact Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mt-8 text-sm text-slate-300 font-sans">
                            {personal.email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" style={{ color: accentColor }} />
                                    <span className="tracking-wide">{personal.email}</span>
                                </div>
                            )}
                            {personal.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" style={{ color: accentColor }} />
                                    <span className="tracking-wide">{personal.phone}</span>
                                </div>
                            )}
                            {personal.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                                    <span className="tracking-wide">{personal.location}</span>
                                </div>
                            )}
                            {personal.linkedin && (
                                <div className="flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" style={{ color: accentColor }} />
                                    <span className="tracking-wide">{personal.linkedin}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {theme.showQrCode && (personal.website || personal.linkedin) && (
                        <div className="hidden md:block shrink-0 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                            <QRCodeDisplay url={personal.website || personal.linkedin} size={80} label="" />
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="px-10 py-10 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                
                {/* Main Column */}
                <div className="md:col-span-2 space-y-10">
                    
                    {/* Executive Summary */}
                    {personal.summary && (
                        <section className={`break-inside-avoid transition-all duration-500 ${highlightedField === 'personal.summary' ? 'bg-cyan-50 p-4 rounded-lg' : ''}`}>
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-6 h-6" style={{ color: accentColor }} />
                                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-widest text-[14px]">
                                    {t.summary}
                                </h2>
                            </div>
                            <div className="pl-6 border-l-2" style={{ borderColor: accentColor }}>
                                <p className="text-slate-700 text-[13px] leading-relaxed font-serif text-justify">
                                    {personal.summary}
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Professional Experience */}
                    {experience.length > 0 && (
                        <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'bg-cyan-50 p-4 rounded-lg -mx-4 px-4' : ''}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-6 h-6" style={{ color: accentColor }} />
                                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-widest text-[14px]">
                                    {t.experience}
                                </h2>
                            </div>
                            <div className="space-y-8">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative break-inside-avoid">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{exp.position}</h3>
                                                <p className="text-[15px] font-bold" style={{ color: accentColor }}>{exp.company}</p>
                                            </div>
                                            <div className="mt-1 md:mt-0 font-sans">
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                    {exp.startDate} — {exp.endDate}
                                                </span>
                                            </div>
                                        </div>
                                        {exp.description && (
                                            <div className="text-slate-600 text-[13px] leading-relaxed text-justify mt-3 font-serif">
                                                {exp.description}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <CheckCircle className="w-6 h-6" style={{ color: accentColor }} />
                                <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-widest text-[14px]">
                                    {t.projects}
                                </h2>
                            </div>
                            <div className="space-y-6">
                                {projects.map((p) => (
                                    <div key={p.id} className="break-inside-avoid pl-4 border-l" style={{ borderColor: accentColor + '40' }}>
                                        <h3 className="text-[15px] font-bold text-slate-900 mb-1">{p.name}</h3>
                                        <p className="text-[13px] text-slate-700 leading-relaxed font-serif">{p.description}</p>
                                        {p.link && (
                                            <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} className="inline-block mt-2 font-sans text-[11px] font-bold tracking-wider uppercase" style={{ color: accentColor }}>
                                                {p.link}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="md:col-span-1 space-y-10">
                    
                    {/* Education */}
                    {education.length > 0 && (
                        <section className={`break-inside-avoid transition-all duration-500 ${highlightedField === 'education' ? 'bg-cyan-50 p-4 rounded-lg -mx-4 px-4' : ''}`}>
                            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                <BookOpen className="w-5 h-5 text-slate-900" />
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest text-[13px]">{t.education}</h2>
                            </div>
                            <div className="space-y-5">
                                {education.map((edu) => (
                                    <div key={edu.id} className="break-inside-avoid">
                                        <h3 className="font-bold text-slate-900 text-[14px] leading-tight mb-1">{edu.school}</h3>
                                        <p className="text-[13px] italic font-serif" style={{ color: accentColor }}>{edu.degree}</p>
                                        <p className="text-[10px] font-sans text-slate-500 font-bold uppercase tracking-widest mt-1">
                                            {edu.startDate} — {edu.endDate}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <section className="break-inside-avoid">
                            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                <Award className="w-5 h-5 text-slate-900" />
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest text-[13px]">{t.expertise}</h2>
                            </div>
                            <div className="flex flex-col gap-2 font-sans">
                                {skills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 text-[12px] font-medium text-slate-700">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {languages?.length > 0 && (
                        <section className="break-inside-avoid">
                            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                <Globe className="w-5 h-5 text-slate-900" />
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest text-[13px]">{t.languages}</h2>
                            </div>
                            <div className="space-y-3 font-sans">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between items-center text-[12px]">
                                        <span className="font-bold text-slate-800">{lang.name}</span>
                                        <span className="text-slate-500 italic">{lang.level}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {certifications && certifications.length > 0 && (
                        <section className="break-inside-avoid">
                            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                <Award className="w-5 h-5 text-slate-900" />
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest text-[13px]">{t.certifications}</h2>
                            </div>
                            <div className="space-y-4 font-sans">
                                {certifications.map((cert) => (
                                    <div key={cert.id}>
                                        <h4 className="font-bold text-slate-800 text-[12px]">{cert.name}</h4>
                                        <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Custom Sections Sidebar */}
                    {customSections && customSections.map(section => (
                        <section key={section.id} className="break-inside-avoid">
                            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest text-[13px]">{section.title}</h2>
                            </div>
                            <p className="text-[12px] text-slate-700 font-serif leading-relaxed">
                                {section.content}
                            </p>
                        </section>
                    ))}
                    
                    {/* Hobbies / Interests */}
                    {hobbies && hobbies.length > 0 && (
                        <section className="break-inside-avoid">
                            <div className="flex items-center gap-2 mb-5 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-widest text-[13px]">{t.interests}</h2>
                            </div>
                            <div className="flex flex-wrap gap-2 font-sans">
                                {hobbies.map(hobby => (
                                    <span key={hobby.id} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                        {hobby.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
