import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Droplets, Waves, Anchor, Fish } from 'lucide-react'

export default function AquarisWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a2540] via-[#0d3b66] to-[#000814]" style={{ fontFamily: "'Inter', sans-serif", color: '#e0f7fa' }}>

            {/* UNDERWATER BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Light rays from surface */}
                <div className="absolute top-0 left-1/4 w-96 h-[80%] bg-gradient-to-b from-cyan-400/20 to-transparent blur-3xl transform -rotate-12" />
                <div className="absolute top-0 right-1/3 w-64 h-[70%] bg-gradient-to-b from-blue-300/15 to-transparent blur-3xl transform rotate-6" />

                {/* Bubbles */}
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -800], opacity: [0.6, 0] }}
                        transition={{ duration: 8 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}
                        className="absolute rounded-full border border-cyan-300/30 bg-cyan-200/10"
                        style={{
                            width: 4 + Math.random() * 12,
                            height: 4 + Math.random() * 12,
                            bottom: '-5%',
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}

                {/* Wavy lines */}
                <svg className="absolute bottom-0 left-0 right-0 h-32 opacity-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <motion.path
                        animate={{ d: ['M0,60 Q300,30 600,60 T1200,60 V120 H0 Z', 'M0,60 Q300,90 600,60 T1200,60 V120 H0 Z', 'M0,60 Q300,30 600,60 T1200,60 V120 H0 Z'] }}
                        transition={{ duration: 5, repeat: Infinity }}
                        fill="rgba(6, 182, 212, 0.3)"
                    />
                </svg>
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-2xl bg-cyan-900/30 border border-cyan-400/20 rounded-2xl px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-white hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-cyan-200/60 hover:text-cyan-200 transition-colors hidden lg:block">Dalış</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-cyan-200/60 hover:text-cyan-200 transition-colors hidden lg:block">Derinlik</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-cyan-200/60 hover:text-cyan-200 transition-colors hidden lg:block">Akıntı</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-cyan-500/30">
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-400/20 rounded-full mb-8">
                            <Waves className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-r from-cyan-200 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                            {personal.fullName}
                        </h1>
                        <p className="text-xl text-cyan-100/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-cyan-200/50">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-400" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-400" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Kariyer Derinliği</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-cyan-900/20 border border-cyan-400/10 rounded-3xl p-8 hover:bg-cyan-800/20 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{exp.position}</h3>
                                        <p className="text-cyan-400 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-cyan-200/40 mt-2 md:mt-0">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-cyan-100/60 leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Yetenekler</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 backdrop-blur-xl bg-cyan-800/20 border border-cyan-400/20 rounded-2xl text-sm font-bold text-cyan-200/80 hover:text-cyan-100 hover:border-cyan-400/50 transition-all cursor-default"
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
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Eğitim</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-cyan-900/20 border border-cyan-400/10 rounded-3xl p-8 hover:bg-cyan-800/20 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                        <Anchor className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{edu.school}</h4>
                                        <p className="text-sm text-cyan-200/40">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-cyan-300 font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-cyan-400/10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-white mb-2">Dalışa Hazır mısın?</h3>
                        <p className="text-cyan-200/50 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-xl bg-cyan-800/20 border border-cyan-400/10 flex items-center justify-center hover:bg-cyan-700/20 transition-all">
                                <Icon className="w-5 h-5 text-cyan-200/60" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
