import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Crown } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function BoardRoomTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#1e3a5f'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Executive History' : 'Yönetim Geçmişi',
        education: isEn ? 'Academic Credentials' : 'Akademik Geçmiş',
        skills: isEn ? 'Core Competencies' : 'Temel Yetkinlikler',
        references: isEn ? 'Board References' : 'Yönetim Referansları',
        hobbies: isEn ? 'Personal Interests' : 'Kişisel İlgiler'
    }

    return (
        <div className="min-h-full bg-slate-50 text-slate-800 p-8 md:p-10"
            style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-4xl mx-auto">
                {/* Executive Header */}
                <header className={`mb-8 p-8 bg-[#1e3a5f] text-white rounded-sm ${highlightedField === 'personal' ? 'ring-4 ring-amber-400' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-32 h-32 border-4 border-white/20 overflow-hidden">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Crown className="w-5 h-5 text-amber-400" />
                                <span className="text-xs uppercase tracking-[0.3em] text-amber-400 font-sans">Executive Profile</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-2 break-words">{personal.fullName || 'Executive Name'}</h1>
                            <p className="text-lg text-slate-300 italic">{personal.title || 'Chief Executive Officer'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-3 bg-white">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color={accentColor} />
                            </div>
                        )}
                    </div>
                </header>

                {/* Contact Bar */}
                <div className="mb-8 p-4 bg-white border-l-4 border-[#1e3a5f] flex flex-wrap gap-6 text-sm text-slate-600 font-sans">
                    {personal.email && <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {personal.phone}</span>}
                    {personal.location && <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {personal.location}</span>}
                </div>

                {/* Executive Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-white border border-slate-200">
                        <p className="text-lg leading-relaxed text-slate-700 italic">"{personal.summary}"</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-white border border-slate-200 ${highlightedField === 'experience' ? 'ring-2 ring-amber-400' : ''}`}>
                                <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#1e3a5f] mb-6 border-b border-slate-200 pb-2">{t.experience}</h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="border-l-2 border-[#1e3a5f] pl-4">
                                            <h3 className="text-lg font-bold">{exp.position}</h3>
                                            <p className="text-[#1e3a5f] font-sans text-sm font-medium">{exp.company}</p>
                                            <p className="text-xs text-slate-400 font-sans mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-white border border-slate-200">
                                <h2 className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#1e3a5f] mb-4 border-b border-slate-200 pb-2">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-slate-50">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-slate-500 font-sans">{ref.company}</p>
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
                            <section className="p-6 bg-[#1e3a5f] text-white">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-amber-400 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="text-sm font-sans border-b border-white/10 pb-2">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`p-6 bg-white border border-slate-200 ${highlightedField === 'education' ? 'ring-2 ring-amber-400' : ''}`}>
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#1e3a5f] mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-slate-500 text-xs font-sans">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-amber-50 border border-amber-200">
                                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-amber-800 mb-3">{t.hobbies}</h3>
                                <div className="space-y-1 text-sm text-amber-900">
                                    {hobbies.map((h) => (
                                        <p key={h.id}>{h.name}</p>
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

