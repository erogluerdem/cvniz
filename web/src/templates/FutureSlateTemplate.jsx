import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Laptop, Code2, Cpu } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function FutureSlateTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#6366f1' // Indigo
    const isEn = theme?.language === 'en'

    const t = {
        personal: isEn ? 'Bio' : 'Özet',
        experience: isEn ? 'Professional Path' : 'Mesleki Yolculuk',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Technologies' : 'Teknolojiler',
        references: isEn ? 'Network' : 'Referanslar',
        hobbies: isEn ? 'Personal' : 'Kişisel',
        contact: isEn ? 'Contact' : 'İletişim'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-slate-900 p-0 print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* modern Tech Header */}
            <header className="bg-slate-950 text-white p-8 md:p-12 relative overflow-hidden border-b-[6px]" style={{ borderBottomColor: accentColor }}>
                {/* Decorative Tech BG */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] -mr-48 -mt-48 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                    {personal.photo && (
                        <div className="shrink-0 w-44 h-44 rounded-3xl overflow-hidden border-4 border-white/10 p-1 bg-slate-900 shadow-2xl">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-2xl brightness-110" />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-500/20">
                            <Cpu className="w-3 h-3" /> VERIFIED_TALENT
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-none break-words">
                            {personal.fullName || 'Talent Name'}
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-slate-500 italic mb-8">
                            {personal.title || 'Product Developer'}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {personal.email && <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Mail className="w-4 h-4 text-indigo-500" /> {personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><Phone className="w-4 h-4 text-indigo-500" /> {personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"><MapPin className="w-4 h-4 text-indigo-500" /> {personal.location}</div>}
                        </div>
                    </div>
                    {theme?.showQrCode && (
                        <div className="shrink-0 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            <QRCodeDisplay
                                value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                size={90}
                                color={accentColor}
                            />
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Side - Bio & Tech Stack */}
                <div className="lg:col-span-4 space-y-16">
                    {/* Summary */}
                    {personal.summary && (
                        <section className={`transition-all duration-500 ${highlightedField === 'personal' ? 'bg-slate-50 p-8 rounded-3xl ring-2 ring-indigo-500/20' : ''}`}>
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-8 text-slate-500">{t.personal}</h2>
                            <p className="text-lg leading-relaxed text-slate-600 font-medium italic border-l-4 border-indigo-500 pl-6">
                                "{personal.summary}"
                            </p>
                        </section>
                    )}

                    {/* Tech Stack (Skills) */}
                    {skills.length > 0 && (
                        <section className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 break-inside-avoid page-break-inside-avoid">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-10 flex items-center gap-3">
                                <Code2 className="w-4 h-4" /> {t.skills}
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {skills.map((skill, i) => (
                                    <div key={i} className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-700 uppercase tracking-widest shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex items-center gap-2 group break-inside-avoid page-break-inside-avoid">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-500 transition-colors" /> {skill}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Certifications */}
                    {certifications?.length > 0 && (
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">{isEn ? 'CREDENTIALS' : 'BELGELER'}</h3>
                            <div className="space-y-4">
                                {certifications.map((cert) => (
                                    <div key={cert.id} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors break-inside-avoid page-break-inside-avoid">
                                        <Award className="w-5 h-5 text-indigo-500 shrink-0" />
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight">{cert.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cert.issuer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Main - Path & Story */}
                <div className="lg:col-span-8 space-y-20 border-l border-slate-100 pl-12 lg:pl-20">
                    {/* Path (Experience) */}
                    {experience.length > 0 && (
                        <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.02]' : ''}`}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-12 flex items-center gap-4">
                                <div className="w-10 h-[1px] bg-slate-200" /> {t.experience}
                            </h2>
                            <div className="space-y-16">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="group relative break-inside-avoid page-break-inside-avoid">
                                        <div className="flex flex-col md:flex-row justify-between items-baseline mb-4 gap-4">
                                            <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.position}</h3>
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full">
                                                {exp.startDate} — {exp.endDate}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                <Laptop className="w-4 h-4 text-indigo-500" />
                                            </div>
                                            <p className="text-sm font-black uppercase tracking-widest text-slate-500 lg:text-indigo-500/80">{exp.company}</p>
                                        </div>
                                        <p className="text-base text-slate-600 leading-relaxed font-medium">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Academia (Education) */}
                    {education.length > 0 && (
                        <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'bg-slate-50 p-10 rounded-[40px]' : ''}`}>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-10">{t.education}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h4 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">{edu.degree}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-3">{edu.school}</p>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{edu.startDate} – {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Network (References) */}
                    {references?.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-10">{t.references}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {references.map((ref) => (
                                    <div key={ref.id} className="p-8 border border-slate-100 rounded-[32px] hover:border-indigo-200 transition-all bg-white relative overflow-hidden group break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute top-0 right-0 w-2 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors" />
                                        <p className="text-lg font-black uppercase tracking-tight mb-1">{ref.name}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">{ref.company}</p>
                                        <div className="space-y-1 font-bold text-[10px] text-slate-500">
                                            <p className="hover:text-indigo-600 transition-colors">{ref.email}</p>
                                            <p>{ref.phone}</p>
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

