import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Sparkles, Camera } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function MagazineVogueTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#1a1a1a'
    const isEn = theme?.language === 'en'

    const t = {
        about: isEn ? 'The Narrative' : 'Hikaye',
        experience: isEn ? 'Professional Journey' : 'Mesleki Yolculuk',
        education: isEn ? 'Academic Background' : 'Akademik Arka Plan',
        skills: isEn ? 'Signature Strengths' : 'İmza Yetkinlikler',
        references: isEn ? 'Endorsements' : 'Referanslar',
        hobbies: isEn ? 'Refined Interests' : 'Rafine İlgi Alanları',
        contact: isEn ? 'Connection' : 'İletişim'
    }

    return (
        <div className="min-h-full bg-[#fafafa] text-[#1a1a1a] p-0 overflow-hidden"
            style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.95rem' : theme?.fontSize === 'Büyük' ? '1.15rem' : '1.05rem'
            }}>

            {/* Editorial Header */}
            <header className="relative py-12 px-12 md:px-16 border-b border-black/5 bg-white">
                <div className="absolute top-0 right-0 p-8 text-[10px] font-sans font-black uppercase tracking-[0.5em] opacity-20 hidden md:block">
                    Issue No. 2025 // Career Edition
                </div>

                <div className="flex flex-col md:flex-row gap-20 items-center">
                    <div className="flex-1 order-2 md:order-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-black" />
                            <span className="text-xs font-sans font-black uppercase tracking-[0.4em]">{t.about}</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold leading-[0.85] tracking-tighter mb-8 lowercase italic break-words">
                            {personal.fullName || 'Name Surname'}
                        </h1>
                        <p className="text-xl md:text-3xl font-light uppercase tracking-[0.2em] italic text-slate-500 mb-12">
                            {personal.title || 'Creative Professional'}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-sans font-bold uppercase tracking-widest opacity-60">
                            {personal.email && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black/10" /> {personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black/10" /> {personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-black/10" /> {personal.location}</div>}
                        </div>
                    </div>

                    {personal.photo && (
                        <div className="shrink-0 w-64 md:w-80 order-1 md:order-2 p-3 bg-[#f0f0f0] shadow-2xl relative border border-black/5">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-black text-white flex items-center justify-center rounded-full z-10">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale brightness-110 contrast-125 hover:grayscale-0 transition-all duration-700" />
                        </div>
                    )}
                </div>
            </header>

            <div className="px-12 md:px-16 py-12">
                {/* Intro Section - Asymmetric Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                    <div className="lg:col-span-5">
                        {personal.summary && (
                            <section className="relative">
                                <div className="text-[12rem] font-bold text-black/5 absolute -top-24 -left-12 pointer-events-none italic uppercase">Profile</div>
                                <Quote className="w-12 h-12 text-black/10 mb-8" />
                                <p className="text-3xl md:text-4xl leading-[1.1] font-light italic">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}
                    </div>

                    <div className="lg:col-span-1 hidden lg:block border-l border-black/5" />

                    <div className="lg:col-span-6 flex flex-col justify-center">
                        {skills.length > 0 && (
                            <section>
                                <h2 className="text-xl font-sans font-black uppercase tracking-[0.3em] mb-12 flex items-center gap-6">
                                    <span className="w-12 h-0.5 bg-black" /> {t.skills}
                                </h2>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="flex items-baseline gap-4 group">
                                            <span className="text-xs font-sans font-bold opacity-30 italic">0{i + 1}</span>
                                            <span className="text-xl font-bold italic group-hover:translate-x-2 transition-transform cursor-default">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                {/* Main Content Sections */}
                <div className="space-y-24">
                    {/* Experience Section - Column Layout */}
                    {experience.length > 0 && (
                        <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'bg-[#f0f0f0] -mx-12 md:-mx-16 px-12 md:px-24 py-16 shadow-inner' : ''}`}>
                            <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b-2 border-black pb-8">
                                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter uppercase italic">{t.experience}</h2>
                                <span className="text-xs font-sans font-black uppercase tracking-[0.5em] opacity-40">Timeline // 2025</span>
                            </div>

                            <div className="space-y-16 max-w-5xl mx-auto">
                                {experience.map((exp, idx) => (
                                    <div key={exp.id} className="grid grid-cols-1 md:grid-cols-12 gap-12 group">
                                        <div className="md:col-span-4">
                                            <span className="text-sm font-sans font-black uppercase tracking-widest text-slate-400 italic mb-4 block">
                                                {exp.startDate} – {exp.endDate}
                                            </span>
                                            <div className="h-0.5 w-12 bg-black/10 group-hover:w-full transition-all duration-700" />
                                        </div>
                                        <div className="md:col-span-8">
                                            <h3 className="text-3xl md:text-4xl font-bold mb-3 italic group-hover:text-amber-700 transition-colors uppercase tracking-tight">{exp.position}</h3>
                                            <p className="text-lg font-sans font-black uppercase tracking-[0.2em] mb-8 opacity-60 underline underline-offset-8">{exp.company}</p>
                                            <p className="text-xl leading-relaxed text-slate-600 italic font-light first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Dual Section Grid - Education & Projects */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'ring-1 ring-black p-8' : ''}`}>
                                <h2 className="text-4xl font-bold italic mb-12 border-b-4 border-black inline-block">{t.education}</h2>
                                <div className="space-y-12">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="relative pl-8 border-l border-black/5">
                                            <h4 className="text-2xl font-bold mb-1 italic uppercase tracking-tight">{edu.degree}</h4>
                                            <p className="text-sm font-sans font-black uppercase tracking-widest opacity-60 mb-4">{edu.school}</p>
                                            <p className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-slate-400">{edu.startDate} – {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-4xl font-bold italic mb-12 border-b-4 border-black inline-block">{t.references}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="border border-black/5 p-6 bg-white hover:bg-black hover:text-white transition-all group">
                                            <p className="text-lg font-black uppercase mb-1">{ref.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 group-hover:opacity-60">{ref.company}</p>
                                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-30 group-hover:opacity-100 flex flex-col gap-1">
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

            {/* Vogue Style Footer */}
            <footer className="mt-20 p-12 bg-white text-center border-t border-black/5">
                {theme?.showQrCode && (
                    <div className="mb-16 inline-block p-4 bg-white border border-black/5 shadow-xl hover:shadow-2xl transition-all">
                        <QRCodeDisplay
                            value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                            size={100}
                            color="#000000"
                        />
                        <div className="mt-4 text-[9px] font-sans font-black uppercase tracking-[0.4em] opacity-30">Scan for Portfolio</div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-center items-center gap-10 text-[10px] font-sans font-black uppercase tracking-[0.8em] opacity-20 px-12 md:px-24">
                    <h2 className="text-6xl md:text-7xl font-bold text-black border-y-2 border-black inline-block px-12 italic uppercase leading-tight tracking-tighter break-words">
                        {personal.fullName?.split(' ')[1] || 'LASTNAME'}
                    </h2>
                </div>
            </footer>
        </div>
    )
}

