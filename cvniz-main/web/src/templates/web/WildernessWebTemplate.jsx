import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, TreePine, Mountain, Bird, Leaf } from 'lucide-react'

export default function WildernessWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0d1f0f]" style={{ fontFamily: "'Lora', serif", color: '#d4e4d4' }}>

            {/* WILDERNESS BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Fog layers */}
                <motion.div
                    animate={{ x: [-50, 50, -50], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#1a3a1c]/50 to-transparent blur-xl"
                />
                <motion.div
                    animate={{ x: [50, -50, 50], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#1a3a1c]/30 to-transparent blur-2xl"
                />

                {/* Tree silhouettes */}
                <svg className="absolute bottom-0 left-0 right-0 h-64 opacity-20" viewBox="0 0 1200 200" preserveAspectRatio="none">
                    <path d="M0,200 L0,100 L50,80 L100,120 L150,60 L200,100 L250,40 L300,90 L350,50 L400,100 L450,70 L500,110 L550,80 L600,120 L650,60 L700,100 L750,50 L800,90 L850,70 L900,110 L950,80 L1000,100 L1050,60 L1100,90 L1150,70 L1200,100 L1200,200 Z" fill="#0a1a0c" />
                </svg>

                {/* Moon glow */}
                <div className="absolute top-20 right-40 w-24 h-24 rounded-full bg-[#f5f5dc] blur-sm opacity-80" />
                <div className="absolute top-20 right-40 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, #f5f5dc 0%, transparent 70%)', filter: 'blur(30px)' }} />
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-xl bg-[#0d1f0f]/80 border border-[#2d4f2d]/30 rounded-2xl px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center">
                            <TreePine className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-[#d4e4d4] hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="#about" className="text-xs font-bold uppercase tracking-widest text-[#8ab48a]/60 hover:text-[#8ab48a] transition-colors hidden lg:block">Keşfet</a>
                        <a href="#experience" className="text-xs font-bold uppercase tracking-widest text-[#8ab48a]/60 hover:text-[#8ab48a] transition-colors hidden lg:block">Yolculuk</a>
                        <a href="#skills" className="text-xs font-bold uppercase tracking-widest text-[#8ab48a]/60 hover:text-[#8ab48a] transition-colors hidden lg:block">Doğa</a>
                        <a href={`mailto:${personal.email}`} className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl text-xs font-bold text-white shadow-lg">
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-700/30 rounded-full mb-8">
                            <Leaf className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">{personal.title}</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-r from-emerald-200 via-[#d4e4d4] to-emerald-200 bg-clip-text text-transparent">
                            {personal.fullName}
                        </h1>
                        <p className="text-xl text-[#8ab48a]/60 max-w-2xl mx-auto mb-12 leading-relaxed italic">
                            "{personal.summary}"
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-[#8ab48a]/40">
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500" />{personal.location}</div>}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">Yolculuk</h2>
                    <div className="space-y-8">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-[#1a3a1c]/30 border border-[#2d4f2d]/30 rounded-3xl p-8 hover:bg-[#1a3a1c]/50 transition-all group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#d4e4d4] group-hover:text-emerald-300 transition-colors">{exp.position}</h3>
                                        <p className="text-emerald-400 font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-[#8ab48a]/40 mt-2 md:mt-0">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-[#8ab48a]/60 leading-relaxed">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">Yetenekler</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                viewport={{ once: true }}
                                className="px-6 py-3 backdrop-blur-xl bg-[#1a3a1c]/30 border border-[#2d4f2d]/30 rounded-2xl text-sm font-bold text-[#8ab48a]/70 hover:text-emerald-300 hover:border-emerald-500/50 transition-all cursor-default"
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
                    <h2 className="text-4xl font-black text-center mb-20 bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">Temel</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="backdrop-blur-xl bg-[#1a3a1c]/30 border border-[#2d4f2d]/30 rounded-3xl p-8 hover:bg-[#1a3a1c]/50 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center">
                                        <Mountain className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#d4e4d4]">{edu.school}</h4>
                                        <p className="text-sm text-[#8ab48a]/40">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-emerald-300 font-medium">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative py-16 px-6 border-t border-[#2d4f2d]/20">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-[#d4e4d4] mb-2">Bir Yolculuğa Çıkalım</h3>
                        <p className="text-[#8ab48a]/40 text-sm">{personal.email}</p>
                    </div>
                    <div className="flex gap-4">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 rounded-xl bg-[#1a3a1c]/30 border border-[#2d4f2d]/30 flex items-center justify-center hover:bg-[#1a3a1c]/50 transition-all">
                                <Icon className="w-5 h-5 text-[#8ab48a]/50" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
