import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Camera, CheckCircle2, Bookmark } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function SoftPillTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#10b981' // Emerald
    const isEn = theme?.language === 'en'

    const t = {
        personal: isEn ? 'Bio' : 'Özet',
        experience: isEn ? 'Work Experience' : 'İş Deneyimi',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Core Skills' : 'Yetenekler',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Interests' : 'İlgi Alanları',
        contact: isEn ? 'Contact Me' : 'İletişim'
    }

    return (
        <div className="min-h-full bg-[#f8fafc] text-slate-700 p-0"
            style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            <div className="max-w-6xl mx-auto p-8 md:p-10">
                {/* Header - Soft Rounded Card */}
                <header className={`mb-12 p-8 md:p-10 rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row gap-8 items-center transition-all duration-500 ${highlightedField === 'personal' ? 'scale-[1.02] shadow-[0_30px_60px_rgba(16,185,129,0.1)]' : ''}`}>
                    {personal.photo && (
                        <div className="shrink-0 w-44 h-44 rounded-[40px] overflow-hidden p-2 bg-slate-50 border border-slate-100 shadow-inner">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover rounded-[32px]" />
                        </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <CheckCircle2 className="w-3.5 h-3.5" /> PRO_PROFILE_CERTIFIED
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 break-words">
                            {personal.fullName || 'Name Surname'}
                        </h1>
                        <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent italic mb-8">
                            {personal.title || 'Digital Designer'}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            {personal.email && <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full hover:bg-white hover:shadow-md transition-all"><Mail className="w-4 h-4 text-emerald-500" /> {personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full hover:bg-white hover:shadow-md transition-all"><Phone className="w-4 h-4 text-emerald-500" /> {personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full hover:bg-white hover:shadow-md transition-all"><MapPin className="w-4 h-4 text-emerald-500" /> {personal.location}</div>}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left - Main Content */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Summary Pill */}
                        {personal.summary && (
                            <section className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                                <Bookmark className="absolute -top-4 -right-4 w-24 h-24 text-slate-50/50 group-hover:text-emerald-50/50 transition-colors" />
                                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">{t.personal}</h2>
                                <p className="text-xl leading-relaxed text-slate-600 italic">
                                    "{personal.summary}"
                                </p>
                            </section>
                        )}

                        {/* Experience Rounded */}
                        {experience.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'experience' ? 'scale-[1.01]' : ''}`}>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 flex items-center gap-4">
                                    <div className="w-8 h-[1px] bg-emerald-500" /> {t.experience}
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="p-8 rounded-[32px] bg-white border border-slate-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all group overflow-hidden relative">
                                            <div className="absolute top-0 right-0 p-10">
                                                <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase py-2 px-4 bg-slate-50 rounded-full">
                                                    {exp.startDate} – {exp.endDate}
                                                </span>
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-2xl font-black mb-1 group-hover:text-emerald-600 transition-colors leading-tight">{exp.position}</h3>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{exp.company}</p>
                                                <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References Soft */}
                        {references?.length > 0 && (
                            <section>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10">{t.references}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-8 rounded-[40px] bg-white border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                <Users className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-slate-800 mb-1">{ref.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{ref.company}</p>
                                                <p className="text-[10px] font-bold text-emerald-600 mt-2 italic underline underline-offset-4">{ref.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right - Sidebar Pills */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* Skills - Rounded Blocks */}
                        {skills.length > 0 && (
                            <section className="p-8 rounded-[32px] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-16 -mt-16" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400 mb-10">{t.skills}</h3>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold tracking-widest hover:bg-emerald-500 hover:text-white transition-all cursor-default group uppercase">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education - Smooth Cards */}
                        {education.length > 0 && (
                            <section className={`transition-all duration-500 ${highlightedField === 'education' ? 'scale-[1.05]' : ''}`}>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-10">{t.education}</h3>
                                <div className="space-y-6">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="p-6 rounded-[24px] bg-white border border-slate-100 shadow-sm relative group overflow-hidden">
                                            <div className="absolute top-0 right-0 h-full w-2 bg-emerald-500/10 group-hover:bg-emerald-500 transition-colors" />
                                            <h4 className="text-xl font-black text-slate-800 mb-2">{edu.degree}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{edu.school}</p>
                                            <span className="text-[9px] font-black text-slate-300 italic">{edu.startDate} – {edu.endDate}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Hobbies - Soft Tags */}
                        {hobbies?.length > 0 && (
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-8">{t.hobbies}</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {hobbies.map((h) => (
                                        <div key={h.id} className="p-4 rounded-[32px] bg-emerald-50/30 border border-emerald-500/10 flex items-center gap-4 group hover:bg-emerald-500 transition-colors">
                                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                <Heart className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 group-hover:text-white transition-colors">{h.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* QR Box */}
                        {theme?.showQrCode && (
                            <div className="p-8 rounded-[32px] bg-white border border-slate-100 text-center shadow-sm">
                                <QRCodeDisplay
                                    value={personal.website || personal.linkedin || 'https://CVniz.pro'}
                                    size={120}
                                    color={accentColor}
                                />
                                <p className="mt-6 text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 italic">verified_source_hash</p>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    )
}

