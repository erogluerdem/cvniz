import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Gamepad2, Trophy, Joystick, Heart } from 'lucide-react'

export default function ArcadeWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0f0f1a]" style={{ fontFamily: "'Press Start 2P', monospace", color: '#fff' }}>

            {/* ARCADE BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Scanlines */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)' }} />

                {/* Neon grid */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ff00ff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {/* Floating pixels */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -500], opacity: [1, 0] }}
                        transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3 }}
                        className="absolute w-4 h-4"
                        style={{ bottom: -20, left: `${Math.random() * 100}%`, background: ['#ff00ff', '#00ffff', '#ffff00', '#00ff00'][i % 4] }}
                    />
                ))}

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 text-[10px] text-[#ff00ff]/50">PLAYER 1</div>
                <div className="absolute top-4 right-4 text-[10px] text-[#00ffff]/50">HI-SCORE</div>
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="bg-black/80 border-4 border-[#ff00ff] px-8 py-4 flex justify-between items-center" style={{ boxShadow: '0 0 20px #ff00ff, inset 0 0 20px rgba(255,0,255,0.1)' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#ff00ff] flex items-center justify-center">
                            <Gamepad2 className="w-5 h-5 text-black" />
                        </div>
                        <span className="text-[10px] text-[#ff00ff] hidden md:block">{personal.fullName?.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-[8px] text-[#00ffff]/60 hover:text-[#00ffff] transition-colors hidden lg:block">START</a>
                        <a href="#experience" className="text-[8px] text-[#00ffff]/60 hover:text-[#00ffff] transition-colors hidden lg:block">LEVELS</a>
                        <a href="#skills" className="text-[8px] text-[#00ffff]/60 hover:text-[#00ffff] transition-colors hidden lg:block">POWER-UPS</a>
                        <a href={`mailto:${personal.email}`} className="px-4 py-2 bg-[#00ffff] text-black text-[8px] font-bold hover:bg-[#ff00ff] transition-all">
                            CONTACT
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff00ff]/10 border-2 border-[#ff00ff] mb-8">
                            <Trophy className="w-4 h-4 text-[#ffff00]" />
                            <span className="text-[8px] text-[#ff00ff]">{personal.title?.toUpperCase()}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl mb-8 leading-relaxed" style={{ textShadow: '4px 4px 0 #ff00ff, 8px 8px 0 #00ffff' }}>
                            {personal.fullName?.toUpperCase()}
                        </h1>
                        <p className="text-[10px] text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-[8px] text-white/40">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#ff00ff]" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#00ffff]" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3 text-[#ffff00]" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE - LEVELS */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl text-center mb-20" style={{ textShadow: '3px 3px 0 #00ffff' }}>
                        LEVEL SELECT
                    </h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-black/50 border-4 border-[#00ffff] p-8 hover:border-[#ff00ff] transition-all group relative overflow-hidden"
                                style={{ boxShadow: '4px 4px 0 #00ffff' }}
                            >
                                <div className="absolute top-2 right-2 text-[8px] text-[#ffff00]">LVL {i + 1}</div>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg text-[#ff00ff] group-hover:text-[#00ffff] transition-colors">{exp.position?.toUpperCase()}</h3>
                                        <p className="text-[10px] text-[#00ffff] mt-2">{exp.company?.toUpperCase()}</p>
                                    </div>
                                    <span className="text-[8px] text-white/30 mt-2 md:mt-0">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-[10px] text-white/50 leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS - POWER-UPS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl text-center mb-20" style={{ textShadow: '3px 3px 0 #ff00ff' }}>
                        POWER-UPS
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                viewport={{ once: true }}
                                className="px-4 py-2 bg-black/50 border-2 border-[#ffff00] text-[8px] text-[#ffff00] hover:bg-[#ffff00] hover:text-black transition-all cursor-default"
                                style={{ boxShadow: '2px 2px 0 #ffff00' }}
                            >
                                + {skill?.toUpperCase()}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section id="education" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl text-center mb-20" style={{ textShadow: '3px 3px 0 #00ff00' }}>
                        TRAINING
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-black/50 border-4 border-[#00ff00] p-8 hover:border-[#ffff00] transition-all"
                                style={{ boxShadow: '4px 4px 0 #00ff00' }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-[#00ff00] flex items-center justify-center">
                                        <Joystick className="w-6 h-6 text-black" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] text-white">{edu.school?.toUpperCase()}</h4>
                                        <p className="text-[8px] text-white/30 mt-1">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-[#00ff00]">{edu.degree?.toUpperCase()}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t-4 border-[#ff00ff]">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                            <Heart className="w-4 h-4 text-[#ff0000]" />
                            <Heart className="w-4 h-4 text-[#ff0000]" />
                            <Heart className="w-4 h-4 text-[#ff0000]" />
                        </div>
                        <p className="text-[8px] text-white/30">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 bg-black border-2 border-[#ff00ff] flex items-center justify-center hover:bg-[#ff00ff] transition-all">
                                <Icon className="w-4 h-4 text-white" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-8 text-[8px] text-white/20">
                    INSERT COIN TO CONTINUE
                </div>
            </footer>
        </div>
    )
}
