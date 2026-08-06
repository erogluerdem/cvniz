import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, LayoutGrid, Monitor, Smartphone, Code, Languages, Star, FolderKanban } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MetroUITemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#0078d4' // Microsoft Blue
    const isEn = theme?.language === 'en'

    const t = {
        identity: isEn ? 'IDENTITY' : 'KİMLİK',
        experience: isEn ? 'WORK_TRACK' : 'İŞ_GEÇMİŞİ',
        education: isEn ? 'ACADEMIC_LOG' : 'EĞİTİM_KAYDI',
        skills: isEn ? 'SYSTEM_SKILLS' : 'SİSTEM_YETKİNLİĞİ',
        references: isEn ? 'NODES' : 'TEMAS_NOKTALARI',
        hobbies: isEn ? 'OFF_WORK' : 'MESAİ_DIŞI',
        projects: isEn ? 'PROJECTS' : 'PROJELER',
        certifications: isEn ? 'CERTS' : 'SERTİFİKALAR',
        languages: isEn ? 'LANGUAGES' : 'DİLLER'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-[#f3f3f3] text-slate-800 p-8 md:p-12 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Segoe UI', 'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                {/* Header Tile - Solid & Dynamic */}
                <header
                    className={`sm:col-span-2 lg:col-span-4 p-8 text-white flex flex-col justify-center relative shadow-lg overflow-hidden group transition-all duration-500 ${highlightedField === 'personal' ? 'scale-[1.02] ring-8 ring-cyan-500/20' : ''}`}
                    style={{ backgroundColor: '#1e1e1e' }}
                >
                    <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-blue-500/10 transition-colors pointer-events-none">
                        <Monitor className="w-64 h-64 -mr-16 -mt-16 rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-widest mb-6" style={{ backgroundColor: accentColor }}>
                            SYSTEM_PROFILE_V.02
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4 break-words">
                            {personal.fullName || 'User_Name'}
                        </h1>
                        <p className="text-2xl font-light text-slate-500 italic">
                            {personal.title || 'System Architect'}
                        </p>
                    </div>
                </header>

                {/* Photo Tile - Square */}
                {personal.photo && (
                    <div className="sm:col-span-2 lg:col-span-2 aspect-square bg-[#ddd] shadow-lg overflow-hidden group border-b-[8px]" style={{ borderColor: accentColor }}>
                        <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale brightness-110 group-hover:grayscale-0 transition-all duration-700 hover:scale-110" />
                    </div>
                )}

                {/* Contact Tiles - Microsoft Style */}
                <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 sm:col-span-2 lg:col-span-2">
                    {personal.email && (
                        <div className="p-6 text-white shadow-lg flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer" style={{ backgroundColor: accentColor }}>
                            <Mail className="w-6 h-6 opacity-30" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-tighter opacity-50 mb-1">EMAIL</p>
                                <p className="text-[10px] font-bold break-all leading-tight">{personal.email}</p>
                            </div>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="p-6 bg-teal-600 text-white shadow-lg flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer">
                            <Phone className="w-6 h-6 opacity-30" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-tighter opacity-50 mb-1">PHONE</p>
                                <p className="text-[10px] font-bold">{personal.phone}</p>
                            </div>
                        </div>
                    )}
                    {personal.location && (
                        <div className="p-6 bg-indigo-600 text-white shadow-lg flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer">
                            <MapPin className="w-6 h-6 opacity-30" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-tighter opacity-50 mb-1">LOCATION</p>
                                <p className="text-[10px] font-bold">{personal.location}</p>
                            </div>
                        </div>
                    )}
                    {(personal.linkedin || personal.website) && (
                        <div className="p-6 bg-[#0077b5] text-white shadow-lg flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer">
                            <Globe className="w-6 h-6 opacity-30" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-tighter opacity-50 mb-1">WEB</p>
                                <p className="text-[10px] font-bold truncate">{personal.website || 'LINKEDIN'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Tile */}
                {personal.summary && (
                    <div className="sm:col-span-2 lg:col-span-4 p-8 bg-white shadow-lg border-l-[8px] flex flex-col justify-center" style={{ borderColor: accentColor }}>
                        <Quote className="w-10 h-10 text-[#eee] mb-4" />
                        <p className="text-lg font-light italic leading-relaxed text-slate-600">
                            {personal.summary}
                        </p>
                    </div>
                )}

                {/* Experience Row */}
                <div className="sm:col-span-2 lg:col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experience.length > 0 && experience.map((exp, idx) => (
                        <div key={exp.id || idx} className={`p-8 shadow-lg transition-all duration-300 ${idx === 0 ? 'bg-[#222] text-white' : 'bg-white text-slate-800'}`}>
                            <div className="flex justify-between items-start mb-6">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{exp.startDate} – {exp.endDate}</p>
                                <Briefcase className="w-4 h-4 opacity-20" />
                            </div>
                            <h3 className="text-xl font-black mb-1 leading-none">{exp.position}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-60" style={{ color: idx === 0 ? accentColor : '#666' }}>{exp.company}</p>
                            <p className="text-xs opacity-70 leading-relaxed whitespace-pre-line">{exp.description}</p>
                        </div>
                    ))}
                </div>

                {/* Skills & Education & Languages */}
                <div className="sm:col-span-2 lg:col-span-4 p-8 bg-white shadow-lg">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-3">
                        <LayoutGrid className="w-4 h-4" /> {t.skills}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-12">
                        {skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 bg-[#f9f9f9] border border-slate-200 text-[10px] font-bold tracking-tight uppercase hover:bg-slate-900 hover:text-white transition-colors cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {education.length > 0 && (
                            <div>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-3">
                                    <GraduationCap className="w-4 h-4" /> {t.education}
                                </h2>
                                <div className="space-y-6">
                                    {education.map((edu, i) => (
                                        <div key={edu.id || i}>
                                            <h4 className="text-sm font-black uppercase mb-1">{edu.degree}</h4>
                                            <p className="text-[10px] font-bold opacity-50 uppercase">{edu.school}</p>
                                            <p className="text-[9px] opacity-40 mt-1">{edu.startDate} - {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {languages.length > 0 && (
                            <div>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center gap-3">
                                    <Languages className="w-4 h-4" /> {t.languages}
                                </h2>
                                <div className="space-y-4">
                                    {languages.map((lang, i) => (
                                        <div key={i} className="flex flex-col gap-1 break-inside-avoid page-break-inside-avoid">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase">
                                                <span>{lang.name}</span>
                                                <span opacity-40>{lang.level}</span>
                                            </div>
                                            <div className="h-1 bg-slate-100 w-full rounded-full">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: accentColor, width: lang.level?.toLowerCase().includes('yüksek') || lang.level?.toLowerCase().includes('advanced') || lang.level?.toLowerCase().includes('native') ? '100%' : '60%' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Projects Tile */}
                <div className="sm:col-span-2 lg:col-span-2 p-8 bg-[#333] text-white shadow-lg overflow-hidden relative">
                    <FolderKanban className="absolute -right-8 -bottom-8 w-32 h-32 opacity-5 rotate-12" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-8 flex items-center gap-3" style={{ color: accentColor }}>
                        <FolderKanban className="w-4 h-4" /> {t.projects}
                    </h2>
                    <div className="space-y-8 relative z-10">
                        {projects.map((proj, i) => (
                            <div key={proj.id || i}>
                                <h4 className="text-md font-black uppercase border-b border-white/10 pb-2 mb-2">{proj.name}</h4>
                                <p className="text-[11px] opacity-60 leading-relaxed font-medium line-clamp-3">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications & Hobbies */}
                {certifications?.length > 0 && (
                    <div className="sm:col-span-2 lg:col-span-3 p-8 bg-white shadow-lg border-r-[8px]" style={{ borderColor: accentColor }}>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-3">
                            <Award className="w-4 h-4" /> {t.certifications}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certifications.map((cert, i) => (
                                <div key={cert.id || i} className="flex gap-4 break-inside-avoid page-break-inside-avoid">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                        <Award className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black uppercase leading-tight line-clamp-2">{cert.name}</h4>
                                        <p className="text-[9px] opacity-50 mt-1 uppercase">{cert.issuer}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {hobbies?.length > 0 && (
                    <div className="sm:col-span-2 lg:col-span-3 p-8 bg-slate-900 text-white shadow-lg flex flex-col justify-center">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-400 mb-6" style={{ color: accentColor }}>{t.hobbies}</h2>
                        <div className="flex flex-wrap gap-2">
                            {hobbies.map((h, i) => (
                                <span key={h.id || i} className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-default">
                                    {h.name || h}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Custom Sections */}
                {customSections?.length > 0 && customSections.map((section, idx) => (
                    <div key={idx} className="sm:col-span-2 lg:col-span-6 p-10 bg-white shadow-lg break-inside-avoid page-break-inside-avoid">
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-4 inline-block" style={{ borderColor: accentColor }}>{section.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {section.items.map((item, i) => (
                                <div key={i}>
                                    <h4 className="text-sm font-black uppercase mb-1">{item.title}</h4>
                                    <p className="text-xs opacity-70 leading-relaxed whitespace-pre-line">{item.description}</p>
                                    {item.date && <p className="text-[10px] font-bold opacity-30 mt-2 uppercase tracking-widest">{item.date}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* QR & References Container */}
                <div className="sm:col-span-2 lg:col-span-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {references?.length > 0 && (
                        <div className="lg:col-span-3 p-8 bg-white shadow-lg border-l-[8px] border-emerald-500">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">{t.references}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {references.map((ref, i) => (
                                    <div key={ref.id || i}>
                                        <p className="text-md font-black uppercase tracking-tight leading-none mb-1">{ref.name}</p>
                                        <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{ref.position} @ {ref.company}</p>
                                        <div className="flex gap-4 mt-2">
                                            {ref.email && <span className="text-[8px] font-black opacity-30">{ref.email}</span>}
                                            {ref.phone && <span className="text-[8px] font-black opacity-30">{ref.phone}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {theme?.showQrCode && (
                        <div className="lg:col-span-1 p-8 bg-white shadow-lg flex flex-col items-center justify-center text-center">
                            <QRCodeDisplay
                                value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                size={120}
                                color="#000000"
                            />
                            <p className="text-[8px] font-black uppercase opacity-30 mt-4 tracking-[0.2em]">SCAN_TO_VERIFY</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

