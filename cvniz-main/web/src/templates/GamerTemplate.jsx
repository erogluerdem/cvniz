import { Mail, Phone, MapPin, Gamepad2, Joystick, Trophy, Target, Zap, Twitch, Youtube, Shield } from 'lucide-react'

export default function GamerTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-gray-950" style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Gaming HUD Header */}
            <header className="relative overflow-hidden">
                {/* Neon gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-gray-900 to-pink-900/50" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Grid overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}
                />

                <div className="relative px-10 py-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            {/* Gamer Avatar with hexagon frame */}
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-1 clip-hexagon">
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center clip-hexagon">
                                        <Gamepad2 className="w-14 h-14 text-pink-400" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs font-bold text-white shadow-lg shadow-pink-500/30">
                                    LVL 99
                                </div>
                            </div>

                            <div>
                                <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                                    {personal.fullName || 'GAMER TAG'}
                                </h1>
                                <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 font-bold mb-4">
                                    {personal.title || 'Pro E-Sports Player'}
                                </p>

                                {/* Contact Badges */}
                                <div className="flex flex-wrap gap-3">
                                    {personal.email && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-pink-500/30 text-sm text-gray-300">
                                            <Mail className="w-4 h-4 text-pink-400" /> {personal.email}
                                        </span>
                                    )}
                                    {personal.phone && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-purple-500/30 text-sm text-gray-300">
                                            <Phone className="w-4 h-4 text-purple-400" /> {personal.phone}
                                        </span>
                                    )}
                                    {personal.location && (
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-cyan-500/30 text-sm text-gray-300">
                                            <MapPin className="w-4 h-4 text-cyan-400" /> {personal.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Panel */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="px-5 py-3 bg-gradient-to-r from-pink-500/10 to-pink-500/5 border border-pink-500/30 rounded-lg text-center">
                                <div className="text-2xl font-black text-pink-400">500+</div>
                                <div className="text-xs text-gray-400">Turnuva</div>
                            </div>
                            <div className="px-5 py-3 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-lg text-center">
                                <div className="text-2xl font-black text-cyan-400">Top 1%</div>
                                <div className="text-xs text-gray-400">Global</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="px-10 py-8">
                {/* Bio Section */}
                {personal.summary && (
                    <section className="mb-8 p-6 bg-gradient-to-r from-white/5 to-transparent rounded-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500" />
                        <div className="flex items-start gap-4">
                            <Shield className="w-8 h-8 text-pink-400 flex-shrink-0 mt-1" />
                            <div>
                                <h2 className="text-lg font-bold text-white mb-2">Player Bio</h2>
                                <p className="text-gray-400 leading-relaxed">{personal.summary}</p>
                            </div>
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-5 gap-8">
                    {/* Left Column */}
                    <div className="col-span-3 space-y-6">
                        {/* Teams & Tournaments */}
                        {experience.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-white" />
                                    </div>
                                    Takımlar & Turnuvalar
                                </h2>
                                <div className="space-y-4">
                                    {experience.map((exp, index) => (
                                        <div
                                            key={exp.id}
                                            className="group relative bg-white/5 rounded-xl p-5 border border-white/10 hover:border-pink-500/50 transition-all overflow-hidden"
                                        >
                                            {/* Accent bar */}
                                            <div
                                                className="absolute top-0 left-0 w-1 h-full"
                                                style={{
                                                    background: `linear-gradient(to bottom, ${index % 3 === 0 ? '#ec4899, #a855f7' :
                                                            index % 3 === 1 ? '#a855f7, #06b6d4' :
                                                                '#06b6d4, #ec4899'
                                                        })`
                                                }}
                                            />
                                            <div className="flex justify-between items-start mb-2 pl-4">
                                                <div>
                                                    <h3 className="font-bold text-white group-hover:text-pink-400 transition-colors text-lg flex items-center gap-2">
                                                        {exp.position || 'Pozisyon'}
                                                        <Zap className="w-4 h-4 text-yellow-400" />
                                                    </h3>
                                                    <p className="text-purple-400">{exp.company || 'Takım/Organizasyon'}</p>
                                                </div>
                                                <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                                    {exp.startDate} - {exp.endDate}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-gray-400 text-sm mt-3 pl-4 leading-relaxed">
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
                                        <Target className="w-5 h-5 text-white" />
                                    </div>
                                    Eğitim
                                </h2>
                                <div className="space-y-3">
                                    {education.map((edu) => (
                                        <div key={edu.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                            <h3 className="font-bold text-white">{edu.school || 'Okul'}</h3>
                                            <p className="text-cyan-400 text-sm">{edu.degree || 'Bölüm'}</p>
                                            <p className="text-gray-500 text-xs mt-1">{edu.startDate} - {edu.endDate}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="col-span-2 space-y-6">
                        {/* Games & Roles */}
                        {skills.length > 0 && (
                            <div className="bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl p-6 border border-white/10">
                                <h2 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
                                    <Joystick className="w-5 h-5 text-pink-400" />
                                    Oyunlar & Roller
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-4 py-2 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-lg text-sm text-white border border-pink-500/30 flex items-center gap-2"
                                        >
                                            <span>🎮</span> {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                Başarılar
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
                                    <span className="text-2xl">🥇</span>
                                    <div>
                                        <div className="text-sm font-bold text-yellow-400">MVP</div>
                                        <div className="text-xs text-gray-500">Sezon Finalleri</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
                                    <span className="text-2xl">🏆</span>
                                    <div>
                                        <div className="text-sm font-bold text-purple-400">Şampiyon</div>
                                        <div className="text-xs text-gray-500">Ulusal Turnuva</div>
                                    </div>
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
                                            <span className="text-gray-300">{lang.name}</span>
                                            <span className="text-sm px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full text-pink-300">
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
                                <h2 className="font-bold text-white mb-4">Sosyal Medya</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                        <Twitch className="w-5 h-5 text-purple-400" />
                                        <span className="text-sm text-gray-300">Twitch</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                                        <Youtube className="w-5 h-5 text-red-400" />
                                        <span className="text-sm text-gray-300">YouTube</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .clip-hexagon {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
            `}</style>
        </div>
    )
}
