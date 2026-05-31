import { Mail, Phone, MapPin, Linkedin, Globe, Award, Briefcase, GraduationCap, Quote, Users, Heart, Zap } from 'lucide-react'
import QRCodeDisplay from '../components/QRCodeDisplay'

export default function PopArtTemplate({ data, theme, highlightedField }) {
    const { personal, experience, education, skills, languages, projects, certifications, customSections, references, hobbies } = data
    const isEn = theme?.language === 'en'

    const t = {
        experience: isEn ? 'POW!' : 'BUM!',
        education: isEn ? 'BRAIN!' : 'BEYİN!',
        skills: isEn ? 'BOOM!' : 'PATLAT!',
        references: isEn ? 'WHAM!' : 'ÇAT!',
        hobbies: isEn ? 'WOW!' : 'VAY!'
    }

    return (
        <div className="min-h-full bg-yellow-400 text-slate-900 p-8 md:p-10 relative overflow-hidden"
            style={{
                fontFamily: "'Bangers', cursive",
                fontSize: theme?.fontSize === 'Küçük' ? '0.9rem' : theme?.fontSize === 'Büyük' ? '1.1rem' : '1rem'
            }}>

            {/* Pop art dots pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)',
                backgroundSize: '20px 20px'
            }} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Pop Art Header */}
                <header className={`mb-8 p-8 bg-white border-4 border-black relative ${highlightedField === 'personal' ? 'shadow-[8px_8px_0_0_#ec4899]' : 'shadow-[8px_8px_0_0_#000]'}`}>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {personal.photo && (
                            <div className="w-32 h-32 border-4 border-black shadow-[6px_6px_0_0_#06b6d4] overflow-hidden">
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover saturate-150 contrast-125" />
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-block bg-red-600 text-white px-4 py-1 mb-2 transform -rotate-2">
                                <span className="text-sm tracking-widest">SUPER STAR</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-bold uppercase break-words" style={{ textShadow: '3px 3px 0 #ec4899, 6px 6px 0 #06b6d4' }}>{personal.fullName || 'NAME!'}</h1>
                            <p className="text-2xl text-blue-600 mt-2">{personal.title || 'HERO'}</p>
                        </div>
                        {theme?.showQrCode && (
                            <div className="p-2 bg-white border-4 border-black shadow-[4px_4px_0_0_#ec4899]">
                                <QRCodeDisplay value={personal.website || personal.linkedin || 'https://CVniz.pro'} size={70} color="#000" />
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 font-sans text-sm">
                        {personal.email && <span className="bg-cyan-400 border-2 border-black px-3 py-1">{personal.email}</span>}
                        {personal.phone && <span className="bg-pink-400 border-2 border-black px-3 py-1">{personal.phone}</span>}
                        {personal.location && <span className="bg-green-400 border-2 border-black px-3 py-1">{personal.location}</span>}
                    </div>
                </header>

                {/* Summary */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-white border-4 border-black shadow-[6px_6px_0_0_#000] relative">
                        <div className="absolute -top-4 -left-4 bg-red-600 text-white px-3 py-1 transform rotate-6">
                            <span className="text-lg">HEY!</span>
                        </div>
                        <p className="text-lg font-sans leading-relaxed">{personal.summary}</p>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className={`p-6 bg-cyan-400 border-4 border-black shadow-[6px_6px_0_0_#000] ${highlightedField === 'experience' ? 'shadow-[8px_8px_0_0_#ec4899]' : ''}`}>
                                <h2 className="text-4xl mb-6" style={{ textShadow: '2px 2px 0 #fff' }}>{t.experience}</h2>
                                <div className="space-y-6 font-sans">
                                    {experience.map((exp) => (
                                        <div key={exp.id} className="p-4 bg-white border-2 border-black">
                                            <h3 className="text-xl font-bold text-pink-600">{exp.position}</h3>
                                            <p className="text-blue-600 font-bold">{exp.company}</p>
                                            <p className="text-xs text-slate-500 mb-2">{exp.startDate} - {exp.endDate}</p>
                                            <p className="text-sm">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* References */}
                        {references?.length > 0 && (
                            <section className="p-6 bg-green-400 border-4 border-black shadow-[6px_6px_0_0_#000]">
                                <h2 className="text-4xl mb-4" style={{ textShadow: '2px 2px 0 #fff' }}>{t.references}</h2>
                                <div className="flex flex-wrap gap-4 font-sans">
                                    {references.map((ref) => (
                                        <div key={ref.id} className="p-4 bg-white border-2 border-black">
                                            <p className="font-bold">{ref.name}</p>
                                            <p className="text-sm text-slate-500">{ref.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section className="p-6 bg-pink-500 text-white border-4 border-black shadow-[6px_6px_0_0_#000]">
                                <h3 className="text-3xl mb-4" style={{ textShadow: '2px 2px 0 #000' }}>{t.skills}</h3>
                                <div className="space-y-2 font-sans">
                                    {skills.map((skill, i) => (
                                        <div key={i} className="px-3 py-2 bg-white text-black border-2 border-black text-sm font-bold">{skill}</div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {education.length > 0 && (
                            <section className={`p-6 bg-white border-4 border-black shadow-[6px_6px_0_0_#06b6d4] ${highlightedField === 'education' ? 'shadow-[8px_8px_0_0_#ec4899]' : ''}`}>
                                <h3 className="text-3xl mb-4 text-blue-600">{t.education}</h3>
                                <div className="space-y-4 font-sans">
                                    {education.map((edu) => (
                                        <div key={edu.id}>
                                            <h4 className="font-bold">{edu.degree}</h4>
                                            <p className="text-sm text-slate-500">{edu.school}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {hobbies?.length > 0 && (
                            <section className="p-6 bg-purple-500 text-white border-4 border-black shadow-[6px_6px_0_0_#000]">
                                <h3 className="text-3xl mb-4" style={{ textShadow: '2px 2px 0 #000' }}>{t.hobbies}</h3>
                                <div className="flex flex-wrap gap-2 font-sans">
                                    {hobbies.map((h) => (
                                        <span key={h.id} className="px-3 py-1 bg-yellow-400 text-black border-2 border-black text-xs font-bold">{h.name}</span>
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

