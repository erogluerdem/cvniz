import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, ArrowUpRight } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function SwissGridTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#ff4b2b' // Vibrant Red
    const isEn = theme?.language === 'en'

    const t = {
        personal: isEn ? 'IDENTITY' : 'KİMLİK',
        experience: isEn ? 'CHRONOLOGY' : 'KRONOLOJİ',
        education: isEn ? 'ACADEMIA' : 'AKADEMİ',
        skills: isEn ? 'CAPABILITIES' : 'KAPASİTE',
        languages: isEn ? 'DIALECTS' : 'DİLLER',
        projects: isEn ? 'OUTPUTS' : 'ÇIKTILAR',
        certifications: isEn ? 'VALIDATIONS' : 'BELGELER',
        references: isEn ? 'CONTACTS' : 'TEMASLAR',
        hobbies: isEn ? 'PASSIONS' : 'TUTKULAR'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-black p-0 border-[10px] border-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.85rem' : theme?.fontSize === 'Büyük' ? '1.05rem' : '0.95rem'
            }}>

            {/* Swiss Header - Geometric and Bold */}
            <header className="mb-24 flex flex-col md:flex-row justify-between items-start gap-12 border-b-4 border-black pb-12">
                <div className="max-w-2xl">
                    <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        SWISS_SYSTEM_CV // V2.5
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black uppercase leading-[0.8] mb-8 tracking-tighter break-words">
                        {personal.fullName || 'FIRST LAST'}
                    </h1>
                    <p className="text-2xl font-bold uppercase tracking-widest" style={{ color: accentColor }}>
                        {personal.title || 'PROFESSIONAL_MODULE'}
                    </p>
                </div>

                {personal.photo && (
                    <div className="w-48 h-48 rounded-none border-[1px] border-black grayscale contrast-125 brightness-110 shadow-[12px_12px_0px_#f0f0f0]">
                        <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column - Vertical Text & Identity */}
                <div className="lg:col-span-3 space-y-16">
                    {/* Identity (Personal Info) */}
                    <section className={`transition-all duration-300 ${highlightedField === 'personal' ? 'ring-4 ring-black p-4' : ''}`}>
                        <h2 className="text-sm font-black uppercase mb-8 border-b-2 border-black inline-block tracking-[0.2em]">{t.personal}</h2>
                        <div className="space-y-6 text-xs font-bold uppercase tracking-widest text-slate-500 leading-relaxed">
                            {personal.email && <div className="hover:text-black transition-colors">{personal.email}</div>}
                            {personal.phone && <div className="hover:text-black transition-colors">{personal.phone}</div>}
                            {personal.location && <div className="hover:text-black transition-colors">{personal.location}</div>}
                            {personal.linkedin && <div className="hover:text-black transition-colors">{personal.linkedin}</div>}
                        </div>
                    </section>

                    {/* Capabilities (Skills) */}
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-black uppercase mb-8 border-b-2 border-black inline-block tracking-[0.2em]">{t.skills}</h2>
                            <div className="space-y-3">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex justify-between items-center group break-inside-avoid page-break-inside-avoid">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{skill}</span>
                                        <div className="w-12 h-1 bg-black/5 group-hover:bg-black transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* QR System */}
                    {theme?.showQrCode && (
                        <div className="pt-10">
                            <QRCodeDisplay
                                value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                size={120}
                                color="#000000"
                            />
                            <p className="text-[8px] font-black uppercase tracking-widest mt-4 opacity-30 italic">AUTHENTIC_RECORD_001</p>
                        </div>
                    )}
                </div>

                {/* Right Column - Experience & Education */}
                <div className="lg:col-span-9 space-y-16 border-l-2 border-black/5 pl-8 lg:pl-12">
                    {/* Summary */}
                    {personal.summary && (
                        <section>
                            <div className="flex items-start gap-12">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest -rotate-90 origin-left translate-y-24 hidden md:block">ABSTRACT</span>
                                <p className="text-xl font-black uppercase tracking-tighter leading-snug text-black">
                                    "{personal.summary}"
                                </p>
                            </div>
                        </section>
                    )}

                    {/* Chronology (Experience) */}
                    {experience.length > 0 && (
                        <section className={`transition-all duration-300 ${highlightedField === 'experience' ? 'bg-[#f8f8f8] -ml-8 p-8 border-l-8 border-black shadow-xl shadow-black/5' : ''}`}>
                            <div className="flex justify-between items-end mb-16">
                                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{t.experience}</h2>
                                <ArrowUpRight className="w-12 h-12 stroke-[3] text-slate-200" />
                            </div>
                            <div className="space-y-12">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="grid grid-cols-1 md:grid-cols-4 gap-8 group break-inside-avoid page-break-inside-avoid">
                                        <div className="md:col-span-1">
                                            <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-1">
                                                {exp.startDate} – {exp.endDate}
                                            </span>
                                        </div>
                                        <div className="md:col-span-3">
                                            <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-slate-500 transition-colors mb-2">{exp.position}</h3>
                                            <p className="text-xs font-black uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>{exp.company}</p>
                                            <p className="text-sm font-bold leading-relaxed text-slate-600 max-w-xl">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Academia (Education) */}
                    {education.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-black uppercase mb-12 border-b-8 border-black inline-block tracking-tighter">{t.education}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {education.map((edu) => (
                                    <div key={edu.id} className="relative pt-6 border-t-[1px] border-black/10 break-inside-avoid page-break-inside-avoid">
                                        <span className="text-[10px] font-black text-slate-500 absolute top-0 left-0 uppercase">{edu.startDate} – {edu.endDate}</span>
                                        <h4 className="text-lg font-black uppercase mb-1">{edu.degree}</h4>
                                        <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-3">{edu.school}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Contacts (References) */}
                    {references?.length > 0 && (
                        <section>
                            <h2 className="text-3xl font-black uppercase mb-12 tracking-tighter opacity-10">{t.references}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {references.map((ref) => (
                                    <div key={ref.id} className="bg-black text-white p-6 shadow-[10px_10px_0px_#f0f0f0] hover:shadow-none transition-all break-inside-avoid page-break-inside-avoid">
                                        <p className="text-lg font-black uppercase tracking-tight mb-2">{ref.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60 italic">{ref.company}</p>
                                        <div className="text-[10px] font-black uppercase tracking-widest flex flex-col gap-1">
                                            <span>{ref.email}</span>
                                            <span>{ref.phone}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

        </div>
    )
}

