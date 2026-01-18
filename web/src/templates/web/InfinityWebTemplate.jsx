import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Infinity, Shapes, Triangle } from 'lucide-react'

export default function InfinityWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23]" style={{ fontFamily: "'Poppins', sans-serif", color: '#fff' }}>

            {/* INFINITY GEOMETRIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Floating 3D shapes */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -30, 0],
                            rotateX: [0, 360],
                            rotateY: [0, 180, 0]
                        }}
                        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute"
                        style={{
                            top: `${10 + (i * 8)}%`,
                            left: `${5 + (i * 10)}%`,
                            width: 40 + i * 10,
                            height: 40 + i * 10
                        }}
                    >
                        <div className={`w-full h-full ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-lg' : ''} border border-white/10`}
                            style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05))` }}
                        />
                    </motion.div>
                ))}

                {/* Gradient orbs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-[20%] right-[10%] w-96 h-96 rounded-full blur-[100px] opacity-30"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-[20%] left-[10%] w-80 h-80 rounded-full blur-[80px] opacity-20"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
                />
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Infinity className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-indigo-400 transition-colors hidden lg:block">∞ About</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-indigo-400 transition-colors hidden lg:block">∞ Work</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-indigo-400 transition-colors hidden lg:block">∞ Skills</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-500/30">
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
                            <Shapes className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                            {personal.fullName}
                        </h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-purple-400" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-pink-400" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Infinite Growth</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">{exp.position}</h3>
                                        <p className="text-indigo-400 font-medium">{exp.company}</p>
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
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Endless Abilities</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 backdrop-blur-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl text-sm font-bold text-white/70 hover:text-indigo-300 hover:border-indigo-500/50 transition-all cursor-default"
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
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Foundation</h2>
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
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <Triangle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-white/40">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-indigo-300 font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">∞ Connect</h3>
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
