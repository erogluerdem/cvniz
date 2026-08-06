import { Mail, Phone, MapPin, Heart, Activity, Award, Briefcase, GraduationCap, BookOpen, Globe, Languages, FolderKanban, Star, Quote, Users } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PsychologistTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#818cf8' // Indigo 400
    const isEn = theme?.language === 'en'

    const t = {
        summary: isEn ? 'Clinical Profile' : 'Klinik Profil',
        experience: isEn ? 'Professional Experience' : 'Mesleki Deneyim',
        education: isEn ? 'Academic Background' : 'Akademik Geçmiş',
        skills: isEn ? 'Areas of Expertise' : 'Uzmanlık Alanları',
        languages: isEn ? 'Languages' : 'Diller',
        projects: isEn ? 'Projects & Research' : 'Projeler ve Araştırmalar',
        certifications: isEn ? 'Certifications' : 'Sertifikalar ve Eğitimler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgi Alanları',
        contact: isEn ? 'Contact Information' : 'İletişim Bilgileri'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-[297mm] bg-white text-slate-700 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Lora', 'Inter', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.9rem'
            }}>

            <div className="w-full max-w-[210mm] mx-auto min-h-[297mm] bg-white shadow-none border-t-[4px]" style={{ borderColor: accentColor }}>

                {/* Header Section */}
                <header className="p-10 md:p-12 border-b border-slate-50 relative overflow-hidden bg-slate-50/30">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100 rounded-full translate-x-24 -translate-y-24 opacity-50" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className={`flex-1 ${highlightedField === 'personal' ? 'ring-2 ring-indigo-50 p-2 rounded-lg' : ''}`}>
                            <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-tight">{personal.fullName}</h1>
                            <p className="text-lg font-medium italic opacity-80" style={{ color: accentColor }}>{personal.title}</p>
                        </div>
                        <div className="flex flex-col gap-1 text-right text-[11px] font-light italic text-slate-500">
                            {personal.email && <div className="flex items-center justify-end gap-2">{personal.email} <Mail className="w-3 h-3 opacity-40" /></div>}
                            {personal.phone && <div className="flex items-center justify-end gap-2">{personal.phone} <Phone className="w-3 h-3 opacity-40" /></div>}
                            {personal.location && <div className="flex items-center justify-end gap-2">{personal.location} <MapPin className="w-3 h-3 opacity-40" /></div>}
                            {personal.website && <div className="flex items-center justify-end gap-2">{personal.website} <Globe className="w-3 h-3 opacity-40" /></div>}
                        </div>
                    </div>
                </header>

                <div className="p-10 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">

                    {/* Main Column */}
                    <div className="md:col-span-8 space-y-12">
                        {/* Summary */}
                        {personal.summary && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-4 flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5" style={{ color: accentColor }} /> {t.summary}
                                </h2>
                                <p className="text-[14px] leading-relaxed italic text-slate-600 border-l-[2px] pl-6" style={{ borderLeftColor: `${accentColor}30` }}>
                                    {personal.summary}
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {experience?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5" style={{ color: accentColor }} /> {t.experience}
                                </h2>
                                <div className="space-y-8">
                                    {experience.map((exp, idx) => (
                                        <div key={exp.id || idx} className="group relative pl-6 border-l border-slate-100 break-inside-avoid page-break-inside-avoid">
                                            <div className="absolute top-1 -left-[4.5px] w-2 h-2 rounded-full bg-slate-200" style={{ backgroundColor: idx === 0 ? accentColor : undefined }} />
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="text-[16px] font-medium text-slate-800">{exp.position}</h3>
                                                <span className="text-[10px] italic text-slate-500 font-light whitespace-nowrap ml-4">{exp.startDate} — {exp.endDate}</span>
                                            </div>
                                            <p className="text-[11px] font-bold uppercase tracking-widest mb-2 opacity-70" style={{ color: accentColor }}>{exp.company}</p>
                                            <p className="text-[13px] leading-relaxed text-slate-500 whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects / Research */}
                        {projects?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-2">
                                    <FolderKanban className="w-3.5 h-3.5" style={{ color: accentColor }} /> {t.projects}
                                </h2>
                                <div className="space-y-6">
                                    {projects.map((proj, i) => (
                                        <div key={proj.id || i} className="p-4 bg-slate-50/50 rounded-sm border border-slate-100 flex flex-col gap-1 break-inside-avoid page-break-inside-avoid">
                                            <h4 className="text-[15px] font-medium text-slate-800">{proj.name}</h4>
                                            <p className="text-[12px] italic leading-relaxed text-slate-500">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="md:col-span-4 space-y-10">
                        {/* Skills */}
                        {skills?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-4">{t.skills}</h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.map((s, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-sm text-[11px] font-medium border border-slate-100">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-4 flex items-center gap-2">
                                    <GraduationCap className="w-3.5 h-3.5" style={{ color: accentColor }} /> {t.education}
                                </h2>
                                <div className="space-y-6">
                                    {education.map((edu, idx) => (
                                        <div key={edu.id || idx}>
                                            <h4 className="text-[13px] font-bold text-slate-800 leading-tight mb-1">{edu.school}</h4>
                                            <p className="text-[12px] italic text-slate-500 mb-1">{edu.degree}</p>
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-4 flex items-center gap-2">
                                    <Languages className="w-3.5 h-3.5" style={{ color: accentColor }} /> {t.languages}
                                </h2>
                                <div className="space-y-3">
                                    {languages.map((lang, idx) => (
                                        <div key={idx} className="flex justify-between items-center break-inside-avoid page-break-inside-avoid">
                                            <span className="text-[12px] font-medium">{lang.name}</span>
                                            <span className="text-[9px] font-black uppercase opacity-40 tracking-widest" style={{ color: accentColor }}>{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 mb-4 flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5" style={{ color: accentColor }} /> {t.references}
                                </h2>
                                <div className="space-y-6">
                                    {references.map((ref, i) => (
                                        <div key={ref.id || i}>
                                            <p className="text-[13px] font-bold text-slate-800 mb-0.5">{ref.name}</p>
                                            <p className="text-[10px] opacity-50 uppercase leading-none mb-1">{ref.position}</p>
                                            <p className="text-[9px] font-medium opacity-30 italic">{ref.email || ref.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* QR Code */}
                        {theme?.showQrCode && (
                            <div className="pt-6 flex flex-col items-center justify-center border-t border-slate-50">
                                <QRCodeDisplay
                                    value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                    size={80}
                                    color={accentColor}
                                />
                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-20 mt-2">Scan Clinical Profile</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

