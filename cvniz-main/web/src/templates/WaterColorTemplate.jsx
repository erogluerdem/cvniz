import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Palette } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function WaterColorTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'Journey' : 'Yolculuk',
        education: isEn ? 'Learning' : 'Öğrenim',
        skills: isEn ? 'Palette' : 'Palet',
        references: isEn ? 'Connections' : 'Bağlantılar',
        hobbies: isEn ? 'Passions' : 'Tutkular'
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-pink-50 via-blue-50 to-green-50 text-slate-700 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: theme?.fontSize === 'Küçük' ? '0.95rem' : theme?.fontSize === 'Büyük' ? '1.15rem' : '1.05rem'
            }}>

            {/* Watercolor blobs */}
            <div className="absolute top-10 right-10 w-48 h-48 bg-pink-300/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Artistic Header */}
                <header className={`mb-10 text-center ${highlightedField === 'personal' ? 'bg-white/50 p-6 rounded-3xl' : ''}`}>
                    {personal.photo && (
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl">
                            <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <Palette className="w-6 h-6 mx-auto mb-2 text-pink-400" />
                    <h1 className="text-4xl font-bold mb-2 break-words text-slate-800">{personal.fullName || 'Artist Name'}</h1>
                    <p className="text-xl text-pink-600 italic mb-4">{personal.title || 'Creative Professional'}</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span>•</span>}
                        {personal.phone && <span>{personal.phone}</span>}
                        {personal.location && <span>•</span>}
                        {personal.location && <span>{personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-10 p-8 bg-white/60 backdrop-blur-sm rounded-3xl text-center">
                        <p className="text-xl leading-relaxed italic text-slate-600">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-8 bg-white/70 backdrop-blur-sm rounded-3xl ${highlightedField === 'experience' ? 'ring-2 ring-pink-300' : ''}`}>
                                <h2 className="text-sm uppercase tracking-widest text-pink-500 mb-8 text-center">{t.experience}</h2>
                                <div className="space-y-8">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="text-center">
                                            <h3 className="text-2xl font-bold text-slate-800">{exp.position}</h3>
                                            <p className="text-pink-500 italic">{exp.company}</p>
                                            <p className="text-sm text-slate-400 mb-3">{exp.startDate} — {exp.endDate}</p>
                                            <p className="text-slate-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-8 bg-white/70 backdrop-blur-sm rounded-3xl">
                                <h2 className="text-sm uppercase tracking-widest text-pink-500 mb-6 text-center">{t.references}</h2>
                                <div className="flex flex-wrap justify-center gap-6">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="text-center p-4 bg-pink-50 rounded-2xl">
                                            <p className="font-bold text-slate-800">{ref.name}</p>
                                            <p className="text-sm text-slate-500 italic">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-gradient-to-br from-pink-100 to-blue-100 rounded-3xl">
                                <h3 className="text-sm uppercase tracking-widest text-pink-600 mb-4 text-center">{t.skills}</h3>
                                <div className="space-y-2">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-4 py-2 bg-white/80 rounded-full text-center text-sm font-medium">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white/70 backdrop-blur-sm rounded-3xl ${highlightedField === 'education' ? 'ring-2 ring-pink-300' : ''}`}>
                                <h3 className="text-sm uppercase tracking-widest text-pink-500 mb-4 text-center">{t.education}</h3>
                                <div className="space-y-4 text-center">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold">{edu.degree}</h4>
                                            <p className="text-sm text-slate-500 italic">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-white/70 backdrop-blur-sm rounded-3xl">
                                <h3 className="text-sm uppercase tracking-widest text-pink-500 mb-4 text-center">{t.hobbies}</h3>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm">{h.name}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {theme?.showQrCode && (
                            <div className="flex justify-center">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={80} color="#ec4899" />
                            </div>
                        )}
                    </aside>
                </div>

            </div>
        </div>
    )
}

