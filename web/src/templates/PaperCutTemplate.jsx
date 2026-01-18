import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Layers } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PaperCutTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const accentColor = theme?.accentColor || '#f43f5e'
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Career Path' : 'Kariyer Yolu',
        education: isEn ? 'Education' : 'Eğitim',
        skills: isEn ? 'Expertise' : 'Uzmanlık',
        references: isEn ? 'References' : 'Referanslar',
        hobbies: isEn ? 'Passions' : 'Tutkular'
    }

    return (
        <div className="min-h-full bg-rose-50 text-slate-800 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Decorative paper layers */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/50 rounded-bl-[100px] -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200/50 rounded-tr-[80px] -ml-12 -mb-12" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Card */}
                <header className={`mb-8 p-8 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(244,63,94,0.2)] relative overflow-hidden ${highlightedField === 'personal' ? 'ring-4 ring-rose-300' : ''}`}>
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-rose-500 to-orange-400" />
                    <div className="flex flex-col md:flex-row gap-6 items-center pl-4">
                        {personal.photo && (
                            <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg rotate-3 hover:rotate-0 transition-transform">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-1 break-words">{personal.fullName || 'İsim Soyisim'}</h1>
                            <p className="text-lg text-rose-600 font-medium mb-3">{personal.title || 'Meslek'}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-slate-500">
                                {personal.email && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Mail className="w-3 h-3" /> {personal.email}</span>}
                                {personal.phone && <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full"><Phone className="w-3 h-3" /> {personal.phone}</span>}
                            </div>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 bg-white rounded-xl shadow-lg -rotate-3">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color={accentColor} />
                            </div>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-white rounded-2xl shadow-md relative">
                        <div className="absolute -top-3 left-8 w-6 h-6 bg-rose-500 rounded-lg rotate-45" />
                        <p className="text-base leading-relaxed text-slate-600">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-white rounded-2xl shadow-md ${highlightedField === 'experience' ? 'ring-2 ring-rose-300' : ''}`}>
                                <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-6 flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> {t.experience}
                                </h2>
                                <div className="space-y-5">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-rose-100 before:rounded-full before:border-2 before:border-rose-400">
                                            <h3 className="font-bold text-slate-800">{exp.position}</h3>
                                            <p className="text-rose-600 text-sm font-medium">{exp.company}</p>
                                            <p className="text-xs text-slate-400 mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-white rounded-2xl shadow-md">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-rose-50 rounded-xl">
                                            <p className="font-bold text-sm">{ref.name}</p>
                                            <p className="text-xs text-slate-500">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-gradient-to-br from-rose-500 to-orange-400 text-white rounded-2xl shadow-lg">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-white/80 mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-2 bg-white/20 rounded-lg text-sm font-medium">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white rounded-2xl shadow-md ${highlightedField === 'education' ? 'ring-2 ring-rose-300' : ''}`}>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold text-sm">{edu.degree}</h4>
                                            <p className="text-slate-500 text-xs">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white rounded-2xl shadow-md">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-rose-500 mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">{h.name}</span>
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

