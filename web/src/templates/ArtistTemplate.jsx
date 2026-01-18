import { Mail, Phone, MapPin, Brush, Palette, Camera, Sparkles, Instagram, Globe, Linkedin } from 'lucide-react'

export default function ArtistTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-neutral-950" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Artistic Header with Gradient Mesh */}
            <header className="relative overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/40 via-purple-600/30 to-cyan-500/40" />
                    <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                </div>

                <div className="relative px-10 py-14 text-center">
                    {/* Avatar with artistic frame */}
                    <div className="relative w-40 h-40 mx-auto mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-500 rounded-2xl rotate-6 shadow-[0_0_30px_rgba(217,70,239,0.3)]" />
                        <div className="absolute inset-1 bg-neutral-900 rounded-xl flex items-center justify-center overflow-hidden">
                            {personal.photo ? (
                                <img src={personal.photo} alt={personal.fullName} className="w-full h-full object-cover -rotate-6 scale-110" />
                            ) : (
                                <Palette className="w-14 h-14 text-fuchsia-400" />
                            )}
                        </div>
                    </div>

                    <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
                        {personal.fullName || 'Ad Soyad'}
                    </h1>
                    <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 font-medium mb-6">
                        {personal.title || 'Görsel Sanatçı'}
                    </p>

                    {/* Contact Badges */}
                    <div className="flex justify-center flex-wrap gap-3">
                        {personal.email && (
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white border border-white/10 hover:border-fuchsia-500/50 transition-colors">
                                <Mail className="w-4 h-4 text-fuchsia-400" /> {personal.email}
                            </span>
                        )}
                        {personal.phone && (
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white border border-white/10">
                                <Phone className="w-4 h-4 text-purple-400" /> {personal.phone}
                            </span>
                        )}
                        {personal.location && (
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-sm text-white border border-white/10">
                                <MapPin className="w-4 h-4 text-cyan-400" /> {personal.location}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Artist Statement */}
            {personal.summary && (
                <section className="px-10 py-10 border-t border-white/10">
                    <div className="max-w-3xl mx-auto text-center">
                        <Sparkles className="w-8 h-8 text-fuchsia-400 mx-auto mb-4" />
                        <p className="text-xl text-neutral-300 leading-relaxed italic font-light">
                            "{personal.summary}"
                        </p>
                    </div>
                </section>
            )}

            {/* Main Content Grid */}
            <div className="px-10 py-8">
                <div className="grid grid-cols-5 gap-8">
                    {/* Left Column - Projects & Exhibitions */}
                    <div className="col-span-3 space-y-8">
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center">
                                        <Brush className="w-5 h-5 text-white" />
                                    </div>
                                    Sergiler & Projeler
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {experience.map((exp, index) => (
                                        <div
                                            key={exp.id}
                                            className="group relative bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-5 border border-white/10 hover:border-fuchsia-500/50 transition-all"
                                        >
                                            {/* Color accent bar */}
                                            <div
                                                className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                                                style={{
                                                    background: `linear-gradient(to right, ${index % 3 === 0 ? '#d946ef, #a855f7' :
                                                        index % 3 === 1 ? '#a855f7, #06b6d4' :
                                                            '#06b6d4, #d946ef'
                                                        })`
                                                }}
                                            />
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                                                        {exp.position || 'Proje'}
                                                    </h3>
                                                    <p className="text-fuchsia-400/80 text-sm">{exp.company || 'Mekan'}</p>
                                                </div>
                                                <span className="text-xs text-neutral-500 bg-white/5 px-2 py-1 rounded-full">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-neutral-400 text-sm leading-relaxed">
                                                    {exp.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                    Sanat Eğitimi
                                </h2>
                                <div className="space-y-4">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="flex gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-cyan-400 font-bold">{edu.startDate?.slice(-2) || '??'}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{edu.school || 'Okul'}</h3>
                                                <p className="text-cyan-400/80 text-sm">{edu.degree || 'Program'}</p>
                                                {edu.description && (
                                                    <p className="text-neutral-500 text-sm mt-1">{edu.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Skills & Social */}
                    <div className="col-span-2 space-y-6">
                        {/* Skills / Techniques */}
                        {skills.length > 0 && (
                            <div className="bg-gradient-to-br from-fuchsia-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl p-6 border border-white/10">
                                <h2 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-fuchsia-400" />
                                    Teknikler & Araçlar
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 rounded-full text-sm text-white border border-fuchsia-500/30"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Portfolio Stats (Decorative) */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h2 className="font-bold text-white mb-4">Portfolyo</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 rounded-xl border border-fuchsia-500/20">
                                    <div className="text-3xl font-bold text-fuchsia-400">50+</div>
                                    <div className="text-xs text-neutral-500">Eser</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20">
                                    <div className="text-3xl font-bold text-cyan-400">15+</div>
                                    <div className="text-xs text-neutral-500">Sergi</div>
                                </div>
                            </div>
                        </div>

                        {/* Languages */}
                        {languages?.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h2 className="font-bold text-white mb-4">Diller</h2>
                                <div className="space-y-3">
                                    {languages.map((lang, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <span className="text-neutral-300">{lang.name}</span>
                                            <span className="text-sm px-3 py-1 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 rounded-full text-fuchsia-300">
                                                {lang.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
                        {(personal.linkedin || personal.website) && (
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h2 className="font-bold text-white mb-4">Bağlantılar</h2>
                                <div className="space-y-3">
                                    {personal.linkedin && (
                                        <div className="flex items-center gap-3 text-neutral-400 text-sm">
                                            <Linkedin className="w-5 h-5 text-fuchsia-400" />
                                            <span className="break-all">{personal.linkedin}</span>
                                        </div>
                                    )}
                                    {personal.website && (
                                        <div className="flex items-center gap-3 text-neutral-400 text-sm">
                                            <Globe className="w-5 h-5 text-cyan-400" />
                                            <span className="break-all">{personal.website}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
