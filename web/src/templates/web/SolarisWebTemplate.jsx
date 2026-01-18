import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Sun, Moon, Sparkles, Orbit } from 'lucide-react'

export default function SolarisWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#050510]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}>

            {/* SOLAR SYSTEM BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Stars */}
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                    />
                ))}

                {/* Sun in center */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                    style={{ background: 'radial-gradient(circle, #ffd700 0%, #ff8c00 50%, #ff4500 100%)', boxShadow: '0 0 100px rgba(255,165,0,0.5), 0 0 200px rgba(255,165,0,0.3)' }}
                />

                {/* Orbits */}
                {[200, 350, 500].map((size, i) => (
                    <div
                        key={i}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                        style={{ width: size, height: size }}
                    />
                ))}

                {/* Planets */}
                {[{ orbit: 200, color: '#a855f7', size: 12, duration: 10 }, { orbit: 350, color: '#3b82f6', size: 20, duration: 20 }, { orbit: 500, color: '#22c55e', size: 16, duration: 30 }].map((planet, i) => (
                    <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ duration: planet.duration, repeat: Infinity, ease: 'linear' }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{ width: planet.orbit, height: planet.orbit }}
                    >
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                            style={{ width: planet.size, height: planet.size, background: planet.color, boxShadow: `0 0 20px ${planet.color}` }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Sun className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-orange-400 transition-colors hidden lg:block">Orbit</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-orange-400 transition-colors hidden lg:block">Journey</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-orange-400 transition-colors hidden lg:block">Systems</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-xs font-bold text-white shadow-lg">
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-8">
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-orange-300">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-r from-orange-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                            {personal.fullName}
                        </h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-orange-400" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-orange-400" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Orbital Journey</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">{exp.position}</h3>
                                        <p className="text-orange-400 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-white/40 mt-2 md:mt-0">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-white/50 leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Star Systems</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/70 hover:text-orange-300 hover:border-orange-500/50 transition-all cursor-default"
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section id="education" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">Launch Pad</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                                        <Moon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-white/40">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-orange-300 font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Launch Together</h3>
                        <p className="text-white/40 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                                <Icon className="w-5 h-5 text-white/50" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
