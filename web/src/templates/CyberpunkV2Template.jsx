import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Terminal, Zap, Hash } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function CyberpunkV2Template({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#00f2ff'
    const isEn = theme?.language === 'en'

    const t = {
        contact: isEn ? 'Contact_Protocol' : 'İletişim_Protokolü',
        experience: isEn ? 'Work_History' : 'Deneyim_Kaydı',
        education: isEn ? 'Knowledge_Base' : 'Eğitim_Temeli',
        skills: isEn ? 'Skill_Set' : 'Yetenek_Matrisi',
        languages: isEn ? 'Neural_Links' : 'Dil_Ağları',
        projects: isEn ? 'Active_Projects' : 'Aktif_Projeler',
        certifications: isEn ? 'Validated_Certs' : 'Sertifikalar',
        references: isEn ? 'Data_Nodes' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgi_Alanları',
        expertise: isEn ? 'Expertise' : 'Uzmanlık'
    }

    return (
        <div className="min-h-full bg-[#050505] text-white p-0 relative"
            style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

            {/* Neon Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] -mr-64 -mt-64 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] -ml-64 -mb-64 rounded-full pointer-events-none" />

            <div className="relative z-10 p-6 md:p-8">
                {/* Header Section */}
                <header className={`mb-8 border-b border-dashed border-white/10 pb-8 transition-all duration-500 ${highlightedField === 'personal' ? 'scale-[1.01] bg-white/[0.01] p-4 rounded-2xl ring-1 ring-cyan-500/30' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                        {personal.photo && (
                            <div className="shrink-0 w-40 h-40 rounded-none transform rotate-3 border-4 border-cyan-500/50 p-2 bg-[#050505] shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                <Terminal className="w-3 h-3" /> System://Authorized_User
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2 leading-none break-words">
                                {personal.fullName || 'User_Name'}
                            </h1>
                            <p className="text-2xl font-bold text-cyan-400 uppercase tracking-widest italic mb-6">
                                {personal.title || 'System_Architect'}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {personal.email && <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors"><Mail className="w-3 h-3 text-cyan-500" /> {personal.email}</span>}
                                {personal.phone && <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors"><Phone className="w-3 h-3 text-cyan-500" /> {personal.phone}</span>}
                                {personal.location && <span className="flex items-center gap-2 hover:text-cyan-400 transition-colors"><MapPin className="w-3 h-3 text-cyan-500" /> {personal.location}</span>}
                            </div>
                        </div>
                        {theme?.showQrCode && (
                            <div className="shrink-0 p-3 bg-white/[0.03] border border-white/10 backdrop-blur-sm -rotate-3 hover:rotate-0 transition-transform">
                                <QRCodeDisplay
                                    value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                    size={80}
                                    color={accentColor}
                                />
                            </div>
                        )}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Summary */}
                        {personal.summary && (
                            <section className="relative">
                                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-purple-500" />
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-cyan-400 mb-6 flex items-center gap-3">
                                    <Zap className="w-4 h-4" /> {isEn ? 'CORE_OBJECTIVE' : 'TEMEL_VİZYON'}
                                </h2>
                                <p className="text-lg font-medium leading-relaxed text-slate-300 italic">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`break-inside-avoid transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.01] bg-white/[0.01] p-6 rounded-3xl ring-1 ring-cyan-500/30' : ''}`}>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white mb-8 flex items-center gap-3">
                                    <span className="w-10 h-px bg-cyan-500/30" /> {t.experience}
                                </h2>
                                <div className="space-y-10">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="group relative">
                                            <div className="absolute -left-8 top-1.5 w-4 h-4 border border-cyan-500 bg-[#050505] group-hover:bg-cyan-500 transition-colors" />
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-black text-white italic group-hover:text-cyan-400 transition-colors">{exp.position}</h3>
                                                    <p className="text-cyan-500/80 font-bold uppercase tracking-widest text-[11px]">{exp.company}</p>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600 border border-slate-800 px-3 py-1 rounded-full uppercase">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {projects?.length > 0 && (
                            <section>
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white mb-10 flex items-center gap-4">
                                    <span className="w-12 h-px bg-purple-500/50" /> {t.projects}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {projects.map((project) => (
                                        <div key={project.id} className="p-6 bg-white/[0.03] border border-white/5 hover:border-cyan-500/50 transition-all group">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Hash className="w-4 h-4 text-cyan-400" />
                                                <h3 className="font-black text-white italic group-hover:text-cyan-400 transition-colors">{project.name}</h3>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">{project.description}</p>
                                            {project.link && (
                                                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                                                    <Globe className="w-3 h-3" /> External_Link
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white mb-8 flex items-center gap-4">
                                    <span className="w-12 h-px bg-emerald-500/50" /> {t.references}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="border-l border-white/10 pl-4 py-2 hover:border-cyan-500 transition-colors group">
                                            <p className="font-black text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors italic">{ref.name}</p>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{ref.company}</p>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-600 font-medium">{ref.phone}</p>
                                                <p className="text-[10px] text-slate-600 font-medium">{ref.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Skills */}
                        {skills.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                        <Zap className="w-3 h-3 text-cyan-400" />
                                    </div>
                                    {t.skills}
                                </h3>
                                <div className="flex flex-wrap gap-2 text-cyan-400">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-cyan-500/5 border border-cyan-500/20 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all cursor-default">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.02] bg-white/[0.02] p-6 rounded-3xl ring-2 ring-cyan-500/50' : ''}`}>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                        <GraduationCap className="w-3 h-3 text-purple-400" />
                                    </div>
                                    {t.education}
                                </h3>
                                <div className="space-y-8">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="text-sm font-black text-white italic mb-1">{edu.degree}</h4>
                                            <p className="text-purple-400 text-[11px] font-bold uppercase tracking-widest mb-2">{edu.school}</p>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{edu.startDate} - {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-lg bg-rose-500/20 flex items-center justify-center">
                                        <Heart className="w-3 h-3 text-rose-400" />
                                    </div>
                                    {t.hobbies}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {hobbies.map((hobby) => (
                                        <div key={hobby.id} className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/5 rounded-xl hover:border-rose-500/30 transition-all">
                                            <span className="text-xs font-bold text-slate-400">{hobby.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Custom Sections */}
                        {customSections?.length > 0 && customSections.map((section) => (
                            <section key={section.id}>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                        <Hash className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    {section.title}
                                </h3>
                                <div className="text-xs text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                                    {section.content}
                                </div>
                            </section>
                        ))}
                    </aside>
                </div>

            </div>
        </div>
    )
}

