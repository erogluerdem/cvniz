import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Rocket, TrendingUp } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function StartupPitchTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Track Record' : 'Başarı Geçmişi',
        education: isEn ? 'Foundation' : 'Temel',
        skills: isEn ? 'Superpowers' : 'Süper Güçler',
        references: isEn ? 'Network' : 'Ağ',
        hobbies: isEn ? 'Beyond Work' : 'İş Dışı'
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Abstract shapes */}
            <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Pitch Header */}
                <header className={`mb-8 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 ${highlightedField === 'personal' ? 'ring-2 ring-white/50' : ''}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Rocket className="w-5 h-5 text-pink-300" />
                                <span className="text-xs uppercase tracking-widest text-pink-300 font-bold">Founder & Innovator</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 break-words">{personal.fullName || 'Founder Name'}</h1>
                            <p className="text-xl text-purple-200">{personal.title || 'CEO & Co-Founder'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-4 bg-white rounded-2xl shadow-xl">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={90} color="#7c3aed" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                        {personal.email && <span className="px-4 py-2 bg-white/10 rounded-full">{personal.email}</span>}
                        {personal.phone && <span className="px-4 py-2 bg-white/10 rounded-full">{personal.phone}</span>}
                        {personal.location && <span className="px-4 py-2 bg-white/10 rounded-full">{personal.location}</span>}
                    </div>
                </header>

                {/* Summary - The Pitch */}
                {personal.summary && (
                    <section className="mb-8 p-8 bg-white text-slate-800 rounded-3xl shadow-2xl transform hover:scale-[1.01] transition-transform">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-violet-600" />
                            <span className="text-xs uppercase tracking-widest text-violet-600 font-bold">The Vision</span>
                        </div>
                        <p className="text-xl leading-relaxed font-medium">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience - Track Record */}
                        {experience.length > 0 && (
                            <section className={`p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 ${highlightedField === 'experience' ? 'ring-2 ring-white/50' : ''}`}>
                                <h2 className="text-sm uppercase tracking-widest text-pink-300 font-bold mb-8">{t.experience}</h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-pink-400 before:rounded-full">
                                            <h3 className="text-2xl font-bold">{exp.position}</h3>
                                            <p className="text-pink-300 font-medium">{exp.company}</p>
                                            <p className="text-xs text-purple-200 mb-3">{exp.startDate} → {exp.endDate}</p>
                                            <p className="text-purple-100 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References - Network */}
                        {references?.length > 0 && (
                            <section className="p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                                <h2 className="text-sm uppercase tracking-widest text-pink-300 font-bold mb-6">{t.references}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-white/10 rounded-xl">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-purple-200">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl shadow-xl">
                                <h3 className="text-sm uppercase tracking-widest text-pink-100 font-bold mb-4">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-4 py-2 bg-white/20 rounded-xl text-sm font-medium">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 ${highlightedField === 'education' ? 'ring-2 ring-white/50' : ''}`}>
                                <h3 className="text-sm uppercase tracking-widest text-pink-300 font-bold mb-4">{t.education}</h3>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold">{edu.degree}</h4>
                                            <p className="text-sm text-purple-200">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                                <h3 className="text-sm uppercase tracking-widest text-pink-300 font-bold mb-4">{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-4 py-2 bg-white/10 rounded-full text-sm">{h.name}</span>
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

