import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Film, Camera, Clapperboard, Star } from 'lucide-react'

export default function CinematicWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]" style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#fff' }}>

            {/* CINEMATIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Film grain overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

                {/* Spotlight effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-amber-500/10 via-transparent to-transparent blur-3xl" />

                {/* Vignette */}
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />

                {/* Film strip edges */}
                <div className="absolute top-0 left-0 w-12 h-full bg-black border-r border-white/5" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 25px)' }} />
                <div className="absolute top-0 right-0 w-12 h-full bg-black border-l border-white/5" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 25px)' }} />
            </div>

            {/* NAV */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
                <div className="backdrop-blur-xl bg-black/70 border border-white/10 rounded-sm px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500 rounded-sm flex items-center justify-center">
                            <Film className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-bold text-2xl text-white tracking-widest hidden md:block">{personal.fullName}</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <a href="#about" className="text-sm font-bold uppercase tracking-[0.3em] text-white/50 hover:text-amber-500 transition-colors hidden lg:block">ACT I</a>
                        <a href="#experience" className="text-sm font-bold uppercase tracking-[0.3em] text-white/50 hover:text-amber-500 transition-colors hidden lg:block">ACT II</a>
                        <a href="#skills" className="text-sm font-bold uppercase tracking-[0.3em] text-white/50 hover:text-amber-500 transition-colors hidden lg:block">ACT III</a>
                        <a href={`mailto:${personal.email}`} className="px-6 py-3 bg-amber-500 text-black text-sm font-bold uppercase tracking-widest hover:bg-amber-400 transition-all">
                            Contact
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO - TITLE SEQUENCE */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
                        <div className="inline-flex items-center gap-3 mb-12">
                            <div className="w-16 h-px bg-amber-500" />
                            <span className="text-sm tracking-[0.5em] text-amber-500 uppercase">{personal.title}</span>
                            <div className="w-16 h-px bg-amber-500" />
                        </div>
                        <h1 className="text-[15vw] md:text-[10vw] font-black uppercase tracking-[0.2em] leading-[0.9] mb-12">
                            {personal.fullName?.split(' ').map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.3, duration: 0.8 }}
                                    className="block"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed font-sans italic"
                        >
                            "{personal.summary}"
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="flex flex-wrap justify-center gap-8 text-sm text-white/30 font-sans"
                        >
                            {personal.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-500" />{personal.email}</div>}
                            {personal.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" />{personal.phone}</div>}
                            {personal.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" />{personal.location}</div>}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE - ACT II */}
            <section id="experience" className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-sm tracking-[0.5em] text-amber-500 uppercase">Act II</span>
                        <h2 className="text-6xl font-black uppercase tracking-[0.2em] mt-4">Career</h2>
                    </div>
                    <div className="space-y-16">
                        {experience.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="relative pl-8 border-l border-amber-500/30 hover:border-amber-500 transition-colors group"
                            >
                                <div className="absolute -left-2 top-0 w-4 h-4 bg-black border-2 border-amber-500 rounded-full" />
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                    <div>
                                        <h3 className="text-4xl font-black uppercase tracking-wider text-white group-hover:text-amber-500 transition-colors">{exp.position}</h3>
                                        <p className="text-lg text-amber-500/80 font-sans mt-2">{exp.company}</p>
                                    </div>
                                    <span className="text-sm text-white/30 mt-2 md:mt-0 font-sans">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-white/40 leading-relaxed font-sans">{exp.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section id="skills" className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-sm tracking-[0.5em] text-amber-500 uppercase">Act III</span>
                        <h2 className="text-6xl font-black uppercase tracking-[0.2em] mt-4">Skills</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map((skill, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                viewport={{ once: true }}
                                className="px-8 py-4 border border-white/10 text-lg font-bold uppercase tracking-[0.2em] text-white/60 hover:text-amber-500 hover:border-amber-500/50 transition-all cursor-default"
                            >
                                {skill}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EDUCATION */}
            <section id="education" className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-sm tracking-[0.5em] text-amber-500 uppercase">Epilogue</span>
                        <h2 className="text-6xl font-black uppercase tracking-[0.2em] mt-4">Education</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {education.map((edu, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="border border-white/10 p-8 hover:border-amber-500/50 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <Star className="w-6 h-6 text-amber-500" />
                                    <div>
                                        <h4 className="text-2xl font-black uppercase tracking-wider text-white">{edu.school}</h4>
                                        <p className="text-sm text-white/30 font-sans">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                </div>
                                <p className="text-amber-500/80 font-sans">{edu.degree}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CREDITS - FOOTER */}
            <footer className="relative py-20 px-6 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <Clapperboard className="w-12 h-12 text-amber-500 mx-auto mb-8" />
                    <h3 className="text-4xl font-black uppercase tracking-[0.3em] mb-4">The End</h3>
                    <p className="text-white/30 text-sm font-sans mb-8">{personal.email}</p>
                    <div className="flex justify-center gap-6">
                        {[Github, Linkedin, Globe].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-amber-500 hover:text-amber-500 transition-all">
                                <Icon className="w-5 h-5 text-white/40" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}
