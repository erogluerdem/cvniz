import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Moon, Wind } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function DarkZenTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#64748b' // Muted slate
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'The Path' : 'Yolculuk',
        education: isEn ? 'The Learning' : 'Gelişim',
        skills: isEn ? 'The Skills' : 'Yetenekler',
        references: isEn ? 'The Bonds' : 'Referanslar',
        hobbies: isEn ? 'The Spirit' : 'Yaşam Ritmi',
        contact: isEn ? 'Reach Out' : 'İletişim'
    }

    return (
        <div className="min-h-full bg-[#0a0a0a] text-stone-400 p-0 selection:bg-stone-800 selection:text-white"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Zen Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto py-12 px-12 md:px-16">
                {/* Minimalist Zen Header */}
                <header className={`mb-16 text-center transition-all duration-700 ${highlightedField === 'personal' ? 'scale-[1.03]' : ''}`}>
                    <div className="inline-flex items-center gap-4 mb-12 opacity-30">
                        <div className="w-12 h-px bg-stone-700" />
                        <Moon className="w-5 h-5" />
                        <div className="w-12 h-px bg-stone-700" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] mb-6 text-stone-100 uppercase break-words px-4">
                        {personal.fullName || 'ZEN NAME'}
                    </h1>
                    <p className="text-xl italic tracking-widest text-stone-500 mb-16">
                        {personal.title || 'Focus Specialist'}
                    </p>

                    <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-stone-700">
                        {personal.email && <div className="hover:text-stone-300 transition-colors cursor-pointer">{personal.email}</div>}
                        {personal.phone && <div className="hover:text-stone-300 transition-colors cursor-pointer">{personal.phone}</div>}
                        {personal.location && <div className="hover:text-stone-300 transition-colors cursor-pointer">{personal.location}</div>}
                    </div>

                    {personal.photo && (
                        <div className="mt-12 flex justify-center">
                            <div className="w-48 h-48 rounded-full border border-stone-800 p-2 bg-stone-900 group">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-full grayscale brightness-75 contrasts-125 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-1000" />
                            </div>
                        </div>
                    )}
                </header>

                <div className="space-y-20">
                    {/* Intro Summary */}
                    {personal.summary && (
                        <section className="text-center max-w-3xl mx-auto">
                            <Quote className="w-12 h-12 mx-auto mb-10 text-stone-800" />
                            <p className="text-xl md:text-2xl leading-relaxed font-light text-stone-200 italic">
                                "{personal.summary}"
                            </p>
                        </section>
                    )}

                    {/* The Path (Experience) */}
                    {experience.length > 0 && (
                        <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'bg-stone-900/50 p-12 rounded-[60px]' : ''}`}>
                            <h2 className="text-xs font-black uppercase tracking-[0.6em] text-stone-600 mb-16 text-center">{t.experience}</h2>
                            <div className="space-y-16">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative group">
                                        <div className="flex flex-col md:flex-row justify-between items-baseline mb-6 gap-6">
                                            <h3 className="text-3xl font-light tracking-tight text-stone-200 group-hover:text-white transition-colors uppercase">{exp.position}</h3>
                                            <span className="text-[10px] font-black tracking-widest text-stone-600 uppercase">
                                                {exp.startDate} – {exp.endDate}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-8 italic">{exp.company}</p>
                                        <p className="text-lg text-stone-500 leading-relaxed max-w-3xl font-light group-hover:text-stone-300 transition-colors">
                                            {exp.description}
                                        </p>
                                        <div className="absolute -left-10 top-0 bottom-0 w-[1px] bg-stone-800 group-hover:bg-stone-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Dual Grid - Skills & Education */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                        {/* The Skills */}
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-xs font-black uppercase tracking-[0.6em] text-stone-600 mb-12 flex items-center gap-4">
                                    <Wind className="w-4 h-4 text-stone-700" /> {t.skills}
                                </h3>
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <span className="text-sm font-light tracking-widest text-stone-400 group-hover:text-white transition-colors uppercase">{skill}</span>
                                            <div className="w-24 h-[1px] bg-stone-800 group-hover:bg-stone-500 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* The Learning */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.05]' : ''}`}>
                                <h3 className="text-xs font-black uppercase tracking-[0.6em] text-stone-600 mb-12">{t.education}</h3>
                                <div className="space-y-12">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="group overflow-hidden">
                                            <h4 className="text-xl font-light text-stone-200 mb-2 uppercase tracking-tight group-hover:translate-x-4 transition-transform">{edu.degree}</h4>
                                            <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-4 italic">{edu.school}</p>
                                            <p className="text-[9px] font-black text-stone-800 uppercase tracking-widest">{edu.startDate} – {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* The Bonds (References) */}
                    {references?.length > 0 && (
                        <section>
                            <h2 className="text-xs font-black uppercase tracking-[0.6em] text-stone-600 mb-12 text-center">{t.references}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                {references.map((ref) => (
                                    <div key={ref.id} className="text-center group">
                                        <p className="text-xl font-light text-stone-200 mb-4 uppercase tracking-[0.1em] group-hover:scale-110 transition-transform">{ref.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-700 mb-8 italic">{ref.company}</p>
                                        <div className="flex flex-col gap-2 font-black text-[9px] tracking-widest text-stone-800 group-hover:text-stone-500 transition-colors">
                                            <span>{ref.email}</span>
                                            <span>{ref.phone}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Authenticity Indicator */}
                {theme?.showQrCode && (
                    <div className="mt-20 flex justify-center">
                        <div className="p-10 border border-stone-900 bg-[#070707] rounded-full hover:scale-110 transition-transform duration-[2s]">
                            <QRCodeDisplay
                                value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                size={100}
                                color="#2e2e2e"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

