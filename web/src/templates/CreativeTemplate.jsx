import { Mail, Phone, MapPin, Linkedin, Globe, Palette } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CreativeTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#a855f7' // Default to purple if none
    const fontSize = theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem'
    const isEn = theme?.language === 'en'

    const t = {
        contact: isEn ? 'Contact' : 'İletişim',
        expertise: isEn ? 'Expertise' : 'Uzmanlık',
        languages: isEn ? 'Languages' : 'Diller',
        interests: isEn ? 'Interests' : 'İlgi Alanları',
        experience: isEn ? 'Experience' : 'Deneyim',
        education: isEn ? 'Education' : 'Eğitim',
        projects: isEn ? 'Projects' : 'Projeler',
        certifications: isEn ? 'Certifications' : 'Sertifikalar',
        references: isEn ? 'References' : 'Referanslar',
        about: isEn ? 'About Me' : 'Hakkımda'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-[297mm] bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 print-exact mx-auto print:mx-0 overflow-hidden relative"
             style={{
                 fontFamily: theme.fontFamily ? `'${theme.fontFamily}', sans-serif` : "'Outfit', 'Inter', sans-serif",
                 fontSize: fontSize
             }}
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-[350px] opacity-10 pointer-events-none" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, transparent 100%)` }} />
            <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: accentColor }} />
            
            {/* Creative Header */}
            <div className="relative px-12 pt-12 pb-8">
                <div className="flex items-center gap-8">
                    {/* Avatar */}
                    {personal.photo ? (
                        <div className="w-32 h-32 rounded-3xl overflow-hidden rotate-3 shadow-2xl border-4 border-white shrink-0 relative z-10 group">
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-3xl bg-white flex items-center justify-center text-4xl font-black rotate-3 shadow-2xl border-4 border-slate-50 shrink-0 relative z-10" style={{ color: accentColor }}>
                            {personal.fullName ? personal.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '✦'}
                        </div>
                    )}

                    <div className="relative z-10 flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-[42px] font-black tracking-tighter text-slate-900 leading-none mb-3 drop-shadow-sm">
                                    {personal.fullName}
                                </h1>
                                <p className="text-lg font-bold tracking-wide uppercase px-4 py-1.5 rounded-full inline-block text-white shadow-md" style={{ backgroundColor: accentColor }}>
                                    {personal.title}
                                </p>
                            </div>
                            {theme.showQrCode && (personal.website || personal.linkedin) && (
                                <div className="bg-white p-2 rounded-xl shadow-lg rotate-3">
                                    <QRCodeDisplay
                                        url={personal.website || personal.linkedin}
                                        label=""
                                        size={60}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Contact Pills */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {personal.email && (
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-[11px] font-bold text-slate-700">
                                    <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} /> {personal.email}
                                </span>
                            )}
                            {personal.phone && (
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-[11px] font-bold text-slate-700">
                                    <Phone className="w-3.5 h-3.5" style={{ color: accentColor }} /> {personal.phone}
                                </span>
                            )}
                            {personal.location && (
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-[11px] font-bold text-slate-700">
                                    <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} /> {personal.location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-12 pb-12">
                {/* Summary Card */}
                {personal.summary && (
                    <div className={`relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 mb-10 border border-slate-100 overflow-hidden break-inside-avoid transition-all duration-500 ${highlightedField?.startsWith('personal') ? 'ring-4 ring-cyan-500/20 scale-[1.01]' : ''}`}>
                        <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: accentColor }} />
                        <div className="flex items-center gap-3 mb-4">
                            <Palette className="w-6 h-6" style={{ color: accentColor }} />
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">{t.about}</h2>
                        </div>
                        <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                            {personal.summary}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-12 gap-10">
                    {/* Left Column (Wider) */}
                    <div className="col-span-7 space-y-10">
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md text-white" style={{ backgroundColor: accentColor }}>💼</span>
                                    {t.experience}
                                </h2>
                                <div className={`space-y-6 transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.01]' : ''}`}>
                                    {experience.map((exp, index) => (
                                        <div key={exp.id} className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 break-inside-avoid border border-slate-100">
                                            <div className="absolute -left-3 top-6 w-6 h-6 rounded-full border-4 border-slate-50 flex items-center justify-center z-10" style={{ backgroundColor: accentColor }}>
                                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                            </div>
                                            
                                            <div className="flex justify-between items-start mb-3 ml-2">
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-[15px]">{exp.position}</h3>
                                                    <p className="font-bold text-[13px]" style={{ color: accentColor }}>{exp.company}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    {exp.startDate} — {exp.endDate}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-[12px] text-slate-600 font-medium leading-relaxed ml-2">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md text-white" style={{ backgroundColor: accentColor }}>🎓</span>
                                    {t.education}
                                </h2>
                                <div className={`space-y-4 transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.01]' : ''}`}>
                                    {education.map((edu) => (
                                        <div key={edu.id} className="bg-white rounded-2xl shadow-md p-5 border border-slate-100 break-inside-avoid relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-16 h-16 opacity-5 rotate-12 transition-transform group-hover:rotate-45" style={{ backgroundColor: accentColor }} />
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-[14px] mb-0.5">{edu.school}</h3>
                                                    <p className="font-bold text-[12px]" style={{ color: accentColor }}>{edu.degree}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                                                    {edu.startDate} — {edu.endDate}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        
                        {/* Projects in Left Column to balance height */}
                        {projects && projects.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md text-white" style={{ backgroundColor: accentColor }}>🚀</span>
                                    {t.projects}
                                </h2>
                                <div className="space-y-4">
                                    {projects.map(p => (
                                        <div key={p.id} className="bg-white rounded-2xl shadow-md p-5 border border-slate-100 break-inside-avoid">
                                            <h4 className="font-black text-slate-900 text-[14px] mb-2">{p.name}</h4>
                                            <p className="text-[12px] text-slate-600 mb-3 leading-relaxed font-medium">{p.description}</p>
                                            {p.link && (
                                                <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors" style={{ color: accentColor }}>
                                                    <Globe className="w-3.5 h-3.5" /> Demo Link
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column (Narrower) */}
                    <div className="col-span-5 space-y-8">
                        {skills.length > 0 && (
                            <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-2xl" style={{ backgroundColor: accentColor }} />
                                <h2 className="text-xl font-black mb-5 flex items-center gap-2 relative z-10">
                                    ⚡ {t.expertise}
                                </h2>
                                <div className="flex flex-wrap gap-2.5 relative z-10">
                                    {skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-[11px] font-bold transition-colors"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {languages?.length > 0 && (
                            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xl">
                                <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
                                    🌍 {t.languages}
                                </h2>
                                <div className="space-y-4">
                                    {languages.map((lang, index) => (
                                        <div key={index} className="flex justify-between items-center break-inside-avoid border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                            <span className="font-black text-slate-700 text-[13px]">{lang.name}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white" style={{ backgroundColor: accentColor }}>
                                                {lang.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {certifications && certifications.length > 0 && (
                            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xl">
                                <h2 className="text-xl font-black text-slate-900 mb-5 flex items-center gap-2">
                                    🏆 {t.certifications}
                                </h2>
                                <div className="space-y-4">
                                    {certifications.map((cert) => (
                                        <div key={cert.id} className="break-inside-avoid">
                                            <h4 className="font-black text-slate-800 text-[12px]">{cert.name}</h4>
                                            <p className="text-[11px] font-medium text-slate-500 mb-1">{cert.issuer}</p>
                                            <span className="text-[10px] font-bold text-slate-400">{cert.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Sections */}
                        {customSections && customSections.map(section => (
                            <div key={section.id} className="bg-white rounded-3xl p-7 border border-slate-200 shadow-xl break-inside-avoid">
                                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                                    ✨ {section.title}
                                </h2>
                                <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
