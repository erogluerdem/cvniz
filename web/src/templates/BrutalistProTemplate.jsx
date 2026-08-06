import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, ArrowRight, Star } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function BrutalistProTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#ff3e3e'
    const isEn = theme?.language === 'en'

    const t = {
        contact: isEn ? 'CONTACT' : 'İLETİŞİM',
        experience: isEn ? 'WORK RECORD' : 'İŞ KAYDI',
        education: isEn ? 'ACADEMIC' : 'AKADEMİK',
        skills: isEn ? 'TOOLKIT' : 'ARAÇ ÇANTASI',
        languages: isEn ? 'SPEECH' : 'DİL',
        projects: isEn ? 'BUILDS' : 'PROJELER',
        certifications: isEn ? 'VALIDATION' : 'DOĞRULAMA',
        references: isEn ? 'WITNESS' : 'REFERANSLAR',
        hobbies: isEn ? 'EXTRAS' : 'EKSTRALAR'
    }

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-white text-black p-0 border-[6px] border-black selection:bg-black selection:text-white print-exact mx-auto print:mx-0"
            style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="flex flex-col md:flex-row min-h-full">
                {/* Left Sidebar - Bold Info */}
                <aside className="w-full md:w-64 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black bg-white p-6 flex flex-col">
                    <div className={`mb-12 transition-all duration-300 ${highlightedField === 'personal' ? 'ring-8 ring-black ring-offset-4' : ''}`}>
                        {personal.photo && (
                            <div className="w-full aspect-square border-[4px] border-black bg-black mb-8 overflow-hidden">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                            </div>
                        )}
                        <h1 className="text-4xl font-black leading-none uppercase mb-4 break-words">
                            {personal.fullName || 'NO_NAME'}
                        </h1>
                        <p className="bg-black text-white px-3 py-1 inline-block text-xs font-black uppercase tracking-widest italic">
                            {personal.title || 'SPECIALIST'}
                        </p>
                    </div>

                    <div className="mt-auto space-y-12">
                        {/* Contact */}
                        <section>
                            <h2 className="text-xl font-black uppercase border-b-4 border-black mb-6 inline-block">{t.contact}</h2>
                            <div className="space-y-4 font-bold text-sm">
                                {personal.email && <div className="flex items-start gap-3"><Mail className="w-5 h-5 shrink-0" /> <span className="break-all">{personal.email}</span></div>}
                                {personal.phone && <div className="flex items-start gap-3"><Phone className="w-5 h-5 shrink-0" /> <span>{personal.phone}</span></div>}
                                {personal.location && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 shrink-0" /> <span>{personal.location}</span></div>}
                            </div>
                        </section>

                        {/* Skills */}
                        {skills.length > 0 && (
                            <section>
                                <h2 className="text-xl font-black uppercase border-b-4 border-black mb-6 inline-block">{t.skills}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="border-2 border-black px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* QR Code */}
                        {theme?.showQrCode && (
                            <div className="p-4 border-[4px] border-black inline-block">
                                <QRCodeDisplay
                                    value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                    size={100}
                                    color="#000000"
                                />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 bg-[#f0f0f0] p-6 md:p-8">
                    <div className="max-w-4xl space-y-8">
                        {/* Summary */}
                        {personal.summary && (
                            <section>
                                <div className="bg-black text-white p-8 md:p-12 relative">
                                    <Quote className="absolute -top-6 -left-6 w-12 h-12 text-black bg-white border-4 border-black p-2" />
                                    <p className="text-xl md:text-2xl font-black leading-tight italic uppercase">
                                        "{personal.summary}"
                                    </p>
                                </div>
                            </section>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-300 ${highlightedField === 'experience' ? 'bg-[#ffde00] p-8 border-4 border-black' : ''}`}>
                                <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 tracking-tighter flex items-center gap-4 break-inside-avoid">
                                    {t.experience} <ArrowRight className="w-6 h-6 stroke-[3]" />
                                </h2>
                                <div className="space-y-10">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-8 border-l-[4px] border-black group break-inside-avoid">
                                            <div className="absolute -left-4 top-0 w-6 h-6 bg-black flex items-center justify-center text-white font-black text-[10px]">
                                                ★
                                            </div>
                                            <div className="flex flex-col md:flex-row justify-between items-baseline mb-3 gap-3">
                                                <h3 className="text-xl md:text-2xl font-black uppercase italic group-hover:underline underline-offset-4 transition-all">{exp.position}</h3>
                                                <span className="font-black text-[11px] bg-black text-white px-3 py-0.5">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-lg font-black mb-3 group-hover:text-red-600 transition-colors uppercase">{exp.company}</p>
                                            <p className="text-base font-bold leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-300 ${highlightedField === 'education' ? 'bg-black text-white p-10' : ''}`}>
                                <h2 className="text-4xl font-black uppercase mb-8 tracking-tighter">{t.education}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="border-[4px] border-black p-8 bg-white text-black hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_#000] transition-all break-inside-avoid page-break-inside-avoid">
                                            <h3 className="text-xl font-black uppercase mb-2 leading-none">{edu.degree}</h3>
                                            <p className="font-bold text-sm mb-4 italic uppercase text-slate-500">{edu.school}</p>
                                            <div className="text-xs font-black bg-black text-white px-3 py-1 inline-block uppercase">
                                                {edu.startDate} - {edu.endDate}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects & Other */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Projects */}
                            {projects?.length > 0 && (
                                <section>
                                    <h2 className="text-3xl font-black uppercase mb-8 border-b-8 border-black inline-block">{t.projects}</h2>
                                    <div className="space-y-6">
                                        {projects.map((p) => (
                                            <div key={p.id} className="p-6 border-4 border-black bg-white hover:bg-black hover:text-white transition-all break-inside-avoid page-break-inside-avoid">
                                                <h4 className="text-lg font-black uppercase mb-2">{p.name}</h4>
                                                <p className="text-sm font-bold opacity-80">{p.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Hobbies */}
                            {hobbies?.length > 0 && (
                                <section>
                                    <h2 className="text-3xl font-black uppercase mb-8 border-b-8 border-black inline-block">{t.hobbies}</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {hobbies.map((h) => (
                                            <div key={h.id} className="bg-black text-white px-4 py-2 text-sm font-black uppercase flex items-center gap-2 break-inside-avoid page-break-inside-avoid">
                                                <Star className="w-4 h-4 fill-white" /> {h.name}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-4xl font-black uppercase mb-8 tracking-tighter">{t.references}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-8 border-[6px] border-black bg-white break-inside-avoid page-break-inside-avoid">
                                            <p className="text-2xl font-black uppercase italic mb-2">{ref.name}</p>
                                            <p className="font-bold text-sm uppercase text-slate-500 mb-4">{ref.company}</p>
                                            <div className="space-y-1 font-black text-xs uppercase underline underline-offset-2">
                                                <p>{ref.email}</p>
                                                <p>{ref.phone}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>

        </div>
    )
}

