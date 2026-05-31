import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, Github, Linkedin, Globe, Zap, Music, Radio } from 'lucide-react'

export default function SynthWaveWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0f0f23]" style={{ fontFamily: styles.fontFamily || "'Orbitron', sans-serif", color: '#fff' }}>

            {/* SYNTHWAVE BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Sunset Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a2e] via-[#2e0854] to-[#0f0f23]" />

                {/* Sun */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-t-full"
                    style={{ background: 'linear-gradient(to top, #ff006e, #ff8c00, #ffd700)' }}
                />
                <div className="absolute bottom-[30%] left-0 right-0 h-[125px] bg-[#0f0f23]" />

                {/* Grid Floor */}
                <div className="absolute bottom-0 left-0 right-0 h-[40%]" style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255,0,110,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,0,110,0.3) 1px, transparent 1px)',
                    backgroundSize: '60px 40px',
                    transform: 'perspective(500px) rotateX(60deg)',
                    transformOrigin: 'center top'
                }} />

                {/* Glow Lines */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff006e] to-transparent" />
            </div>

            {/* NEON NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="bg-black/50 backdrop-blur-xl border-2 border-[#ff006e]/50 rounded-xl px-8 py-4 flex justify-between items-center shadow-[0_0_30px_rgba(255,0,110,0.3)]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff006e] to-[#ff8c00] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,110,0.5)]">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-[#ff006e] hidden md:block tracking-wider">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-[#ff006e] transition-colors hidden lg:block">Bio</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-[#ff006e] transition-colors hidden lg:block">XP</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-[#ff006e] transition-colors hidden lg:block">Skills</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-[#ff006e] to-[#ff8c00] rounded-lg text-xs font-bold text-white shadow-[0_0_20px_rgba(255,0,110,0.5)] hover:shadow-[0_0_30px_rgba(255,0,110,0.8)] transition-all">
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff006e]/10 border border-[#ff006e]/30 rounded-full mb-8">
                            <Music className="w-4 h-4 text-[#ff006e]" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[#ff006e]">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-wider mb-8 uppercase" style={{ textShadow: '0 0 40px rgba(255,0,110,0.5), 0 0 80px rgba(255,140,0,0.3)' }}>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#ff8c00] to-[#ffd700]">{personal.fullName}</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#ff006e]" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#ff006e]" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ff006e]" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 uppercase tracking-wider" style={{ textShadow: '0 0 30px rgba(255,0,110,0.5)' }}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] to-[#ff8c00]">Experience</span>
                    </h2>
                    <div className="space-y-12">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-black/40 backdrop-blur-xl border-2 border-[#ff006e]/30 rounded-2xl p-8 hover:border-[#ff006e] transition-all group shadow-[0_0_20px_rgba(255,0,110,0.1)] hover:shadow-[0_0_40px_rgba(255,0,110,0.2)]"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-[#ff006e] transition-colors uppercase tracking-wide">{exp.position}</h3>
                                        <p className="text-[#ff8c00] font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-white/40 mt-2 md:mt-0 font-mono">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-white/60 leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 uppercase tracking-wider" style={{ textShadow: '0 0 30px rgba(255,0,110,0.5)' }}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] to-[#ff8c00]">Skills</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(255,0,110,0.5)' }}
                                viewport={{ once: true }}
                                className="px-6 py-3 bg-black/40 border-2 border-[#ff006e]/30 rounded-xl text-sm font-bold text-white/80 hover:text-[#ff006e] hover:border-[#ff006e] transition-all cursor-default uppercase tracking-wide"
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
                    <h2 className="text-4xl font-black text-center mb-20 uppercase tracking-wider" style={{ textShadow: '0 0 30px rgba(255,0,110,0.5)' }}>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] to-[#ff8c00]">Education</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-black/40 backdrop-blur-xl border-2 border-[#ff006e]/30 rounded-2xl p-8 hover:border-[#ff006e] transition-all shadow-[0_0_20px_rgba(255,0,110,0.1)]"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff006e] to-[#ff8c00] flex items-center justify-center shadow-[0_0_20px_rgba(255,0,110,0.5)]">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white uppercase tracking-wide">{edu.school}</h4>
                                        <p className="text-sm text-white/40 font-mono">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-[#ff8c00] font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t-2 border-[#ff006e]/20">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-[#ff006e] mb-2 uppercase tracking-wider">Let's Connect</h3>
                        <p className="text-white/50 text-sm font-mono">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-xl bg-black/40 border-2 border-[#ff006e]/30 flex items-center justify-center hover:border-[#ff006e] hover:shadow-[0_0_20px_rgba(255,0,110,0.5)] transition-all">
                                <Icon className="w-5 h-5 text-white/60" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
