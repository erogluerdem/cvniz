import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Sparkles, Diamond, Gem, Rainbow } from 'lucide-react'

export default function HolographicWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#fff' }}>

            {/* HOLOGRAPHIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Iridescent gradient */}
                <motion.div
                    animate={{
                        background: [
                            'linear-gradient(45deg, #ff0080, #7928ca, #00d4ff, #00ff80, #ff0080)',
                            'linear-gradient(45deg, #7928ca, #00d4ff, #00ff80, #ff0080, #7928ca)',
                            'linear-gradient(45deg, #00d4ff, #00ff80, #ff0080, #7928ca, #00d4ff)'
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 opacity-20 blur-3xl"
                />

                {/* Prismatic light rays */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent transform rotate-12" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent transform -rotate-12" />

                {/* Floating particles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 3 }}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            background: `hsl(${Math.random() * 360}, 100%, 70%)`
                        }}
                    />
                ))}
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, rgba(255,0,128,0.1), rgba(0,212,255,0.1))' }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff0080, #7928ca, #00d4ff)' }}>
                            <Diamond className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-pink-400 transition-colors hidden lg:block">Prizma</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-cyan-400 transition-colors hidden lg:block">Spektrum</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-purple-400 transition-colors hidden lg:block">Işıklar</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #ff0080, #7928ca, #00d4ff)' }}>
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-white/20" style={{ background: 'linear-gradient(135deg, rgba(255,0,128,0.2), rgba(0,212,255,0.2))' }}>
                            <Gem className="w-4 h-4 text-pink-400" />
                            <span className="text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8">
                            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent" style={{ WebkitBackgroundClip: 'text' }}>
                                {personal.fullName}
                            </span>
                        </h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-pink-400" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-purple-400" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Spektrum</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, rgba(255,0,128,0.05), rgba(0,212,255,0.05))' }} />
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent transition-colors">{exp.position}</h3>
                                        <p className="text-purple-400 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-white/30 mt-2 md:mt-0">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-white/50 leading-relaxed relative z-10">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Işık Paleti</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/70 hover:border-pink-500/50 transition-all cursor-default"
                                style={{ background: `linear-gradient(135deg, rgba(${120 + i * 20},0,${200 - i * 10},0.1), rgba(0,${150 + i * 10},255,0.1))` }}
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
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Temel</h2>
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
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff0080, #7928ca, #00d4ff)' }}>
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-white/30">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-purple-300 font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">Işığa Katıl</h3>
                        <p className="text-white/30 text-sm">{personal.email}</p>
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
