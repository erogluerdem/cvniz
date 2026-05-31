import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Star, ShieldCheck } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function ExecutiveGoldTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#C5A059' // Gold
    const isEn = theme?.language === 'en'

    const t = {
        personalInfo: isEn ? 'Private Profile' : 'Şahsi Profil',
        experience: isEn ? 'Professional Tenure' : 'Mesleki Geçmiş',
        education: isEn ? 'Academic Credentials' : 'Akademik Yetkinlik',
        skills: isEn ? 'Core Competencies' : 'Ana Yetkinlikler',
        languages: isEn ? 'Linguistic Mastery' : 'Dil Bilgisi',
        projects: isEn ? 'Key Engagements' : 'Önemli Girişimler',
        certifications: isEn ? 'Executive Certifications' : 'Sertifikalar',
        references: isEn ? 'Professional Endorsements' : 'Profesyonel Referanslar',
        hobbies: isEn ? 'Personal Interests' : 'Kişisel İlgi Alanları'
    }

    return (
        <div className="min-h-full bg-[#fdfcf8] text-[#2d2a26] p-0"
            style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Elegant Header with Gold Accent */}
            <header className="bg-[#1a1c20] text-white p-8 md:p-12 relative overflow-hidden border-b-[8px]" style={{ borderColor: accentColor }}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rotate-45 -mr-32 -mt-32" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 max-w-6xl mx-auto">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 lowercase italic opacity-95 break-words">
                            {personal.fullName || 'Executive Name'}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className="h-px w-12 bg-white/20" />
                            <p className="text-xl uppercase tracking-[0.3em] font-sans font-light" style={{ color: accentColor }}>
                                {personal.title || 'Managing Director'}
                            </p>
                        </div>
                    </div>

                    {personal.photo && (
                        <div className="w-48 h-48 rounded-full border-4 p-2 bg-white/5 shadow-2xl overflow-hidden" style={{ borderColor: accentColor }}>
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-full sepia-[0.3]" />
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-6xl mx-auto p-8 md:p-12">
                {/* Contact Bar - Floating Style */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16 border-b border-[#e2dfd7] pb-8 text-sm font-sans uppercase tracking-widest font-semibold opacity-80">
                    {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</div>}
                    {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</div>}
                    {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</div>}
                    {personal.linkedin && <div className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LINKEDIN</div>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side - Details */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Executive Summary */}
                        {personal.summary && (
                            <section className="relative">
                                <div className="flex items-baseline gap-4 mb-8">
                                    <h2 className="text-2xl font-bold italic border-b-2" style={{ borderColor: accentColor }}>{isEn ? 'Strategic Summary' : 'Stratejik Özet'}</h2>
                                </div>
                                <p className="text-xl leading-relaxed italic text-slate-700 font-light">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* Professional Tenure (Experience) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'ring-2 ring-[#C5A059] ring-offset-8 p-4 rounded-lg' : ''}`}>
                                <h2 className="text-sm font-sans font-black uppercase tracking-[0.4em] mb-12 opacity-40 flex items-center gap-4">
                                    {t.experience} <div className="flex-1 h-px bg-slate-200" />
                                </h2>
                                <div className="space-y-12">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="group relative">
                                            <div className="md:grid md:grid-cols-4 md:gap-8 items-start">
                                                <div className="md:col-span-1 mb-4 md:mb-0">
                                                    <span className="text-sm font-sans font-bold uppercase tracking-widest bg-[#f4f1e9] px-3 py-1 border-l-4" style={{ borderLeftColor: accentColor }}>
                                                        {exp.startDate} – {exp.endDate}
                                                    </span>
                                                </div>
                                                <div className="md:col-span-3">
                                                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#C5A059] transition-colors">{exp.position}</h3>
                                                    <p className="text-sm font-sans font-black uppercase tracking-widest mb-6 opacity-60 italic">{exp.company}</p>
                                                    <p className="text-lg leading-relaxed text-slate-600 font-sans">
                                                        {exp.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-sm font-sans font-black uppercase tracking-[0.4em] mb-12 opacity-40 flex items-center gap-4">
                                    {t.references} <div className="flex-1 h-px bg-slate-200" />
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="border-l border-[#C5A059] pl-6 py-2">
                                            <p className="text-lg font-bold mb-1 italic">{ref.name}</p>
                                            <p className="text-xs font-black uppercase tracking-widest text-[#C5A059] mb-4">{ref.company}</p>
                                            <p className="text-sm font-medium opacity-60 italic">{ref.email} // {ref.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Side - Categorization */}
                    <div className="lg:col-span-4 space-y-20">
                        {/* Core Competencies */}
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-sm font-sans font-black uppercase tracking-[0.4em] mb-8 opacity-40">{t.skills}</h3>
                                <div className="space-y-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full group-hover:scale-150 transition-transform" />
                                            <span className="text-base font-bold italic tracking-wide group-hover:translate-x-2 transition-transform">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'bg-[#f4f1e9] p-6 rounded-lg' : ''}`}>
                                <h3 className="text-sm font-sans font-black uppercase tracking-[0.4em] mb-10 opacity-40">{t.education}</h3>
                                <div className="space-y-10">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <p className="text-[10px] font-sans font-black uppercase tracking-widest opacity-50 mb-2">{edu.startDate} – {edu.endDate}</p>
                                            <h4 className="text-lg font-bold mb-1 italic">{edu.degree}</h4>
                                            <p className="text-sm font-sans font-black uppercase tracking-[0.1em] text-[#C5A059]">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <section>
                                <h3 className="text-sm font-sans font-black uppercase tracking-[0.4em] mb-8 opacity-40">{t.languages}</h3>
                                <div className="space-y-3 font-sans">
                                    {languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between items-center bg-[#f4f1e9] px-4 py-2 border-r-2 border-[#C5A059]">
                                            <span className="text-sm font-bold uppercase tracking-widest">{lang.name}</span>
                                            <span className="text-[10px] font-black italic opacity-60 underline">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies - Styled as Stars */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-sm font-sans font-black uppercase tracking-[0.4em] mb-8 opacity-40">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {hobbies.map((h) => (
                                        <div key={h.id} className="text-xs font-bold font-sans italic p-2 border border-[#e2dfd7] hover:border-[#C5A059] transition-colors flex items-center gap-2">
                                            <Star className="w-3 h-3 text-[#C5A059]" /> {h.name}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* QR Certificate */}
                        {theme?.showQrCode && (
                            <div className="p-10 border-2 border-[#e2dfd7] bg-white text-center rounded-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-12 h-12 bg-[#1a1c20] -mr-6 -mt-6 rotate-45" />
                                <div className="relative z-10">
                                    <ShieldCheck className="w-6 h-6 mx-auto mb-4 text-[#C5A059]" />
                                    <p className="text-[10px] font-sans font-black uppercase tracking-[0.2em] mb-6 opacity-40 italic">Digital Identity Authenticated</p>
                                    <QRCodeDisplay
                                        value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                        size={120}
                                        color={accentColor}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

