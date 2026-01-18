import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Zap, Terminal, Radio, Cpu } from 'lucide-react'

export default function NeoTokyoWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]" style={{ fontFamily: "'Rajdhani', sans-serif", color: '#fff' }}>

            {/* NEO TOKYO BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Rain effect */}
                {[...Array(100)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: ['-100%', '200%'] }}
                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: Math.random() * 2 }}
                        className="absolute w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent"
                        style={{ left: `${Math.random() * 100}%`, height: 50 + Math.random() * 100 }}
                    />
                ))}

                {/* Neon glow effects */}
                <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-pink-500/20 blur-[100px]" />
                <div className="absolute bottom-[30%] right-[5%] w-96 h-96 bg-cyan-500/15 blur-[120px]" />
                <div className="absolute top-[60%] left-[50%] w-80 h-80 bg-purple-500/10 blur-[100px]" />

                {/* Japanese text decoration */}
                <div className="absolute top-20 right-10 text-9xl font-black text-white/[0.02] rotate-90 origin-right select-none">
                    東京
                </div>
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-xl bg-black/50 border border-cyan-500/30 rounded-xl px-8 py-4 flex justify-between items-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-cyan-300 hidden md:block tracking-wider">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-cyan-400 transition-colors hidden lg:block">_profile</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-cyan-400 transition-colors hidden lg:block">_xp</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-cyan-400 transition-colors hidden lg:block">_skills</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-xs font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                            Connect
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-8 animate-pulse">
                            <Radio className="w-4 h-4 text-pink-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-pink-300">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500" style={{ textShadow: '0 0 60px rgba(236,72,153,0.5)' }}>
                                {personal.fullName}
                            </span>
                        </h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-pink-400" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Experience_Log</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-8 hover:border-pink-500/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-pink-500" />
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pl-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{exp.position}</h3>
                                        <p className="text-pink-400 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-white/30 mt-2 md:mt-0 font-mono">{exp.startDate} :: {exp.endDate}</span>
                                </div>
                                <p className="text-white/50 leading-relaxed pl-4">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Skill_Matrix</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(236,72,153,0.5)' }}
                                viewport={{ once: true }}
                                className="px-6 py-3 bg-black/40 border border-white/10 rounded-lg text-sm font-bold text-white/70 hover:text-cyan-300 hover:border-cyan-500/50 transition-all cursor-default"
                            >
                                <span className="text-pink-500 mr-2">//</span>{skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section id="education" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Academic_Data</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 hover:border-purple-500/50 transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 blur-xl" />
                                <div className="flex items-center gap-4 mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                                        <Terminal className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-white/30 font-mono">{edu.startDate} :: {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-purple-300 font-medium relative z-10">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 mb-2">Connect_Protocol</h3>
                        <p className="text-white/30 text-sm font-mono">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                                <Icon className="w-5 h-5 text-white/50" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
