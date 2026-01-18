import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Github, Linkedin, Globe, ArrowRight, Star } from 'lucide-react'

export default function AuroraWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#22d3ee'
    const bgColor = colors.bg || '#0c1222'
    const textColor = colors.text || '#e2e8f0'

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: bgColor, color: textColor, fontFamily: styles.fontFamily || "'Inter', sans-serif" }}>

            {/* AURORA BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: ['-20%', '20%', '-20%'], y: ['-10%', '10%', '-10%'], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-30%] left-[-20%] w-[100%] h-[80%] blur-[120px] opacity-40"
                    style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4, #0ea5e9)' }}
                />
                <motion.div
                    animate={{ x: ['20%', '-20%', '20%'], y: ['10%', '-10%', '10%'], scale: [1, 1.3, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-20%] right-[-30%] w-[80%] h-[70%] blur-[150px] opacity-30"
                    style={{ background: 'linear-gradient(135deg, #a78bfa, #8b5cf6, #7c3aed)' }}
                />
                <motion.div
                    animate={{ y: ['-5%', '15%', '-5%'], scale: [1, 1.1, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[-20%] left-[20%] w-[70%] h-[60%] blur-[130px] opacity-25"
                    style={{ background: 'linear-gradient(135deg, #34d399, #10b981, #059669)' }}
                />
                {/* Stars */}
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            {/* FLOATING NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl px-8 py-4 flex justify-between items-center shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors hidden lg:block">Hakkımda</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors hidden lg:block">Deneyim</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors hidden lg:block">Yetenekler</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-xs font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all">
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
                            <Star className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                            {personal.fullName}
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-400" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE SECTION */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Deneyim</h2>
                    <div className="space-y-12">
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
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{exp.position}</h3>
                                        <p className="text-cyan-400 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-white/40 mt-2 md:mt-0">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-white/60 leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS SECTION */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Yetenekler</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/80 hover:text-cyan-300 hover:border-cyan-500/50 transition-all cursor-default"
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION SECTION */}
            <section id="education" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Eğitim</h2>
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
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-white/40">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-cyan-300 font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Birlikte Çalışalım</h3>
                        <p className="text-white/50 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                            <Github className="w-5 h-5 text-white/60" />
                        </a>
                        <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                            <Linkedin className="w-5 h-5 text-white/60" />
                        </a>
                        <a href="#" className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                            <Globe className="w-5 h-5 text-white/60" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
