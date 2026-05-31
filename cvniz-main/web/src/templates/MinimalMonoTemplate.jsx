import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, ArrowRight } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MinimalMonoTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        personal: isEn ? 'IDENTITY' : 'KİMLİK',
        experience: isEn ? 'HISTORY' : 'GEÇMİŞ',
        education: isEn ? 'ACADEMIA' : 'AKADEMİ',
        skills: isEn ? 'CAPABILITIES' : 'YETKİNLİLER',
        references: isEn ? 'WITNESS' : 'REFERANSLAR',
        hobbies: isEn ? 'INTERESTS' : 'İLGİLER'
    }

    return (
        <div className="min-h-full bg-white text-black p-0 border-[12px] border-black"
            style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.8rem' : theme?.fontSize === 'Büyük' ? '1rem' : '0.9rem'
            }}>

            <div className="p-8 md:p-12">
                {/* Header - Industrial Minimal */}
                <header className={`mb-20 flex flex-col md:flex-row justify-between items-start gap-8 transition-all duration-300 ${highlightedField === 'personal' ? 'ring-[4px] ring-black p-4 -m-4' : ''}`}>
                    <div className="max-w-3xl">
                        <div className="inline-block px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-[0.4em] mb-8">
                            MONO_PROTOCOL_V.01
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.75] mb-8 break-words">
                            {personal.fullName || 'NO NAME'}
                        </h1>
                        <p className="text-3xl font-black uppercase tracking-widest italic border-b-[8px] border-black inline-block">
                            {personal.title || 'SPECIALIST'}
                        </p>
                    </div>

                    <div className="shrink-0 space-y-4 text-[10px] font-black uppercase tracking-widest text-right">
                        {personal.email && <div className="hover:line-through transition-all cursor-crosshair">{personal.email}</div>}
                        {personal.phone && <div className="hover:line-through transition-all cursor-crosshair">{personal.phone}</div>}
                        {personal.location && <div className="hover:line-through transition-all cursor-crosshair">{personal.location}</div>}
                        {personal.linkedin && <div className="hover:line-through transition-all cursor-crosshair">LINKEDIN_STR</div>}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Summary */}
                        {personal.summary && (
                            <section className="relative group">
                                <div className="absolute -left-10 top-0 bottom-0 w-2 bg-black group-hover:w-full group-hover:bg-black/5 transition-all duration-500" />
                                <p className="text-xl font-black uppercase tracking-tighter leading-snug pl-6 group-hover:text-black">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* History (Experience) */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'bg-black text-white p-12 -mx-12' : ''}`}>
                                <h2 className="text-3xl font-black uppercase tracking-tighter border-b-[8px] border-current mb-12 inline-block">{t.experience}</h2>
                                <div className="space-y-16">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="group relative">
                                            <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 gap-6">
                                                <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:italic transition-all">{exp.position}</h3>
                                                <span className="text-xs font-black uppercase tracking-widest border-2 border-current px-3 py-1">
                                                    {exp.startDate} – {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-xl font-bold uppercase tracking-widest mb-10 opacity-60 group-hover:opacity-100 transition-opacity">@ {exp.company}</p>
                                            <p className="text-lg leading-relaxed font-bold border-l-4 border-current pl-8 max-w-2xl">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-black uppercase tracking-tighter border-b-[8px] border-black mb-10 inline-block">{t.references}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-black uppercase tracking-widest text-[10px]">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-8 border-[4px] border-black hover:bg-black hover:text-white transition-all">
                                            <p className="text-xl mb-1 italic">{ref.name}</p>
                                            <p className="mb-6 opacity-40">{ref.company}</p>
                                            <div className="space-y-1">
                                                <p className="underline underline-offset-4">{ref.email}</p>
                                                <p className="underline underline-offset-4">{ref.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-16 border-l-[3px] border-black pl-8 lg:pl-12">
                        {/* Capabilities */}
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                                    {t.skills} <ArrowRight className="w-5 h-5 stroke-[3]" />
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-center gap-4 group">
                                            <div className="w-2 h-2 bg-black group-hover:scale-[3] transition-transform" />
                                            <span className="text-xs font-black uppercase tracking-widest group-hover:translate-x-4 transition-transform">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Academia */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-300 ${highlightedField === 'education' ? 'bg-black text-white p-8' : ''}`}>
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] mb-12">{t.education}</h3>
                                <div className="space-y-12 font-black uppercase tracking-widest">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="relative pt-6 border-t-[3px] border-current">
                                            <div className="text-[9px] mb-2 opacity-40">{edu.startDate} – {edu.endDate}</div>
                                            <h4 className="text-sm mb-1">{edu.degree}</h4>
                                            <p className="text-[9px] opacity-60">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] mb-8">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {hobbies.map((h) => (
                                        <div key={h.id} className="px-4 py-2 border-2 border-black text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all cursor-default">
                                            {h.name}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* QR System */}
                        {theme?.showQrCode && (
                            <div className="p-4 border-[6px] border-black bg-white inline-block">
                                <QRCodeDisplay
                                    value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                    size={120}
                                    color="#000000"
                                />
                                <p className="text-[7px] font-black uppercase tracking-[0.5em] mt-4 text-center">DATAHASH_8829</p>
                            </div>
                        )}
                    </aside>
                </div>

                {/* Footer - Vertical Sidebar style */}
            </div>
        </div>
    )
}

