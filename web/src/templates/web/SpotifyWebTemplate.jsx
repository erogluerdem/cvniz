import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Music } from 'lucide-react'

export default function SpotifyWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#1a1a2e] via-[#121212] to-[#121212]" style={{ fontFamily: "'Circular', 'Helvetica Neue', sans-serif", color: '#fff' }}>

            {/* SPOTIFY BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#1db954]/30 to-transparent" />

                {/* Sound waves animation */}
                <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 opacity-10">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [20, 60 + Math.random() * 40, 20] }}
                            transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                            className="w-1 bg-[#1db954] rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* SIDEBAR NAV - Spotify style */}
            <nav className="fixed left-0 top-0 bottom-0 w-64 bg-black p-6 hidden lg:flex flex-col z-50">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-[#1db954] flex items-center justify-center">
                        <Music className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-bold text-white">My Portfolio</span>
                </div>

                <div className="space-y-4">
                    <a href="#about" className="flex items-center gap-4 text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors">
                        <span className="w-6 h-6 flex items-center justify-center">🏠</span> Ana Sayfa
                    </a>
                    <a href="#tracks" className="flex items-center gap-4 text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors">
                        <span className="w-6 h-6 flex items-center justify-center">🔍</span> Deneyimler
                    </a>
                    <a href="#library" className="flex items-center gap-4 text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors">
                        <span className="w-6 h-6 flex items-center justify-center">📚</span> Kütüphane
                    </a>
                </div>

                <div className="mt-auto">
                    <a href={`mailto:${personal.email}`} className="block w-full py-3 bg-white text-black text-center text-sm font-bold rounded-full hover:scale-105 transition-transform">
                        İletişime Geç
                    </a>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="lg:ml-64">
                {/* HERO - Album Cover Style */}
                <section id="about" className="relative min-h-screen flex items-end pt-32 pb-20 px-6" style={{ background: 'linear-gradient(to bottom, rgba(29,185,84,0.4), #121212)' }}>
                    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-end gap-8 relative z-10">
                        {/* Album Art */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-56 h-56 bg-gradient-to-br from-[#1db954] to-[#191414] rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0"
                        >
                            <span className="text-8xl font-black text-white/10">{personal.fullName?.charAt(0)}</span>
                        </motion.div>

                        <div className="flex-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-white">Profil</span>
                            <h1 className="text-6xl md:text-8xl font-black text-white mt-2 mb-4">
                                {personal.fullName}
                            </h1>
                            <p className="text-[#b3b3b3] text-sm max-w-2xl mb-4">
                                {personal.summary}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-[#b3b3b3]">
                                <span className="text-[#1db954] font-bold">{personal.title}</span>
                                <span>•</span>
                                <span>{experience.length} Deneyim</span>
                                <span>•</span>
                                <span>{skills.length} Yetenek</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRACKS - Experience */}
                <section id="tracks" className="relative py-16 px-6 bg-[#121212]">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white">Popüler Deneyimler</h2>
                            <span className="text-sm text-[#b3b3b3] hover:text-white cursor-pointer">Tümünü Gör</span>
                        </div>

                        {/* Track list */}
                        <div className="space-y-2">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4 p-4 rounded-md hover:bg-white/10 transition-all group"
                                >
                                    <span className="w-4 text-[#b3b3b3] text-sm group-hover:hidden">{i + 1}</span>
                                    <Play className="w-4 h-4 text-white hidden group-hover:block" />

                                    <div className="w-12 h-12 bg-gradient-to-br from-[#333] to-[#1a1a1a] rounded flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="w-5 h-5 text-[#b3b3b3]" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate group-hover:text-[#1db954] transition-colors">{exp.position}</h3>
                                        <p className="text-sm text-[#b3b3b3] truncate">{exp.company}</p>
                                    </div>

                                    <span className="text-sm text-[#b3b3b3] hidden md:block">{exp.startDate} - {exp.endDate}</span>

                                    <Heart className="w-4 h-4 text-[#b3b3b3] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-[#1db954]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SKILLS - Playlist Style */}
                <section id="library" className="relative py-16 px-6 bg-[#121212]">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8">Yetenek Playlistim</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    viewport={{ once: true }}
                                    className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-all cursor-pointer group"
                                >
                                    <div className="w-full aspect-square bg-gradient-to-br from-[#1db954] to-[#191414] rounded-md mb-4 flex items-center justify-center relative">
                                        <span className="text-2xl font-bold text-white/20">{skill.charAt(0)}</span>
                                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#1db954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg translate-y-2 group-hover:translate-y-0">
                                            <Play className="w-5 h-5 text-black fill-black" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-white text-sm truncate">{skill}</h4>
                                    <p className="text-xs text-[#b3b3b3]">Yetenek</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* EDUCATION */}
                <section className="relative py-16 px-6 bg-[#121212]">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8">Eğitim Albümleri</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {education.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="flex items-center gap-4 bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-all cursor-pointer"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#535353] to-[#1a1a1a] rounded-lg flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="w-8 h-8 text-[#b3b3b3]" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-[#b3b3b3]">{edu.degree}</p>
                                        <p className="text-xs text-[#b3b3b3] mt-1">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PLAYER BAR - Footer */}
                <footer className="fixed bottom-0 left-0 lg:left-64 right-0 h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between z-50">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#1db954] to-[#191414] rounded flex items-center justify-center">
                            <span className="text-xl font-black text-white/20">{personal.fullName?.charAt(0)}</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{personal.fullName}</h4>
                            <p className="text-xs text-[#b3b3b3]">{personal.title}</p>
                        </div>
                        <Heart className="w-4 h-4 text-[#1db954] cursor-pointer" />
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-6">
                            <SkipBack className="w-4 h-4 text-[#b3b3b3] hover:text-white cursor-pointer" />
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                                <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                            </div>
                            <SkipForward className="w-4 h-4 text-[#b3b3b3] hover:text-white cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#b3b3b3]">0:00</span>
                            <div className="w-80 h-1 bg-[#535353] rounded-full overflow-hidden hidden md:block">
                                <div className="w-1/3 h-full bg-[#1db954]" />
                            </div>
                            <span className="text-[10px] text-[#b3b3b3]">3:45</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 hidden md:flex">
                        <Volume2 className="w-4 h-4 text-[#b3b3b3]" />
                        <div className="w-24 h-1 bg-[#535353] rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-white" />
                        </div>
                    </div>
                </footer>

                {/* Spacer for fixed footer */}
                <div className="h-20" />
            </div>
        </div>
    )
}
