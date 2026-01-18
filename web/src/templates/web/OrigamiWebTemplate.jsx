import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Layers, Square, Scissors } from 'lucide-react'

export default function OrigamiWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-amber-50" style={{ fontFamily: "'Nunito', sans-serif", color: '#374151' }}>

            {/* ORIGAMI BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Paper fold shadows */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-rose-100/50 to-transparent" />
                <div className="absolute bottom-0 right-0 w-64 h-full bg-gradient-to-l from-amber-100/50 to-transparent" />

                {/* Floating paper shapes */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 5, 0]
                        }}
                        transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute"
                        style={{
                            top: `${15 + (i * 15)}%`,
                            left: `${5 + (i * 15)}%`,
                            width: 60 + i * 20,
                            height: 60 + i * 20,
                            transform: `rotate(${45 + i * 10}deg)`
                        }}
                    >
                        <div className="w-full h-full bg-white shadow-xl rounded-sm" style={{ boxShadow: '10px 10px 30px rgba(0,0,0,0.08)' }} />
                    </motion.div>
                ))}
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl px-8 py-4 flex justify-between items-center shadow-xl shadow-gray-200/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-lg">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-800 hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors hidden lg:block">Hakkımda</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors hidden lg:block">Deneyim</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors hidden lg:block">Yetenekler</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-rose-400 to-amber-400 rounded-xl text-xs font-bold text-white shadow-lg">
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 border border-rose-200 rounded-full mb-8">
                            <Scissors className="w-4 h-4 text-rose-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-rose-600">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 bg-clip-text text-transparent">
                            {personal.fullName}
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {personal.summary}
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-rose-400" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-rose-400" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-400" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Deneyimlerim</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-100 to-amber-100 -translate-y-10 translate-x-10 rotate-45" />
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-rose-500 transition-colors">{exp.position}</h3>
                                        <p className="text-rose-500 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-gray-400 mt-2 md:mt-0">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-gray-500 leading-relaxed relative z-10">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Yetenekler</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, rotate: 3 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 bg-white rounded-2xl text-sm font-bold text-gray-600 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:text-rose-500 transition-all cursor-default"
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
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Eğitim</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-lg">
                                        <Square className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{edu.school}</h4>
                                        <p className="text-sm text-gray-400">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-rose-500 font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-gray-100">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Birlikte Yapalım</h3>
                        <p className="text-gray-400 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:border-rose-300 hover:shadow-lg transition-all">
                                <Icon className="w-5 h-5 text-gray-400" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
