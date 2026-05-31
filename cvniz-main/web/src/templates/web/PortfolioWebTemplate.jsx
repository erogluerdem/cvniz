import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ArrowRight, Layers, Box, Sparkles, Star, Award, Briefcase, MapPin, Zap, ChevronRight, Eye, Image } from 'lucide-react'

export default function PortfolioWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#FF6B35'
    const bgColor = colors.bg || '#0a0a0a'
    const textColor = colors.text || '#ffffff'

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: bgColor, color: textColor, fontFamily: styles.fontFamily || "'Outfit', sans-serif" }}>
            {/* Dot Pattern Background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${accentColor}30 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            {/* Floating Shapes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ rotate: 360, y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 right-20 w-64 h-64 border border-white/10 rounded-3xl"
                />
                <motion.div
                    animate={{ rotate: -360, y: [0, -30, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-40 left-20 w-48 h-48 border border-white/5"
                />
            </div>

            {/* Minimal Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <motion.div
                            whileHover={{ rotate: 90 }}
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            {personal?.fullName?.[0]}
                        </motion.div>
                        <span className="font-bold text-lg tracking-tight hidden md:block">{personal?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
                            <a href="#work" className="hover:text-white transition-colors">Work</a>
                            <a href="#about" className="hover:text-white transition-colors">About</a>
                            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
                        </div>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            Hire Me
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="min-h-screen flex items-center pt-24 px-6">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                        >
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5">
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                                <span className="text-sm font-medium">{personal?.title}</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight">
                                I design &<br />
                                build<br />
                                <span style={{ color: accentColor }}>experiences.</span>
                            </h1>

                            <p className="text-xl text-white/50 max-w-lg leading-relaxed">
                                {personal?.summary}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#work"
                                    className="px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all"
                                    style={{ backgroundColor: accentColor, color: bgColor }}
                                >
                                    <Eye className="w-5 h-5" /> View Work
                                </a>
                                <a
                                    href={`mailto:${personal?.email}`}
                                    className="px-8 py-4 rounded-xl font-bold text-lg border border-white/20 flex items-center gap-3 hover:bg-white/5 transition-all"
                                >
                                    Contact Me
                                </a>
                            </div>
                        </motion.div>

                        {/* Right - Portfolio Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            <div className="grid grid-cols-2 gap-6">
                                {[0, 1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -10, scale: 1.05 }}
                                        className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden relative"
                                    >
                                        <Image className="w-12 h-12 text-white/20 group-hover:scale-110 transition-transform" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                            <span className="font-bold">Project {i + 1}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats Badge */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="absolute -bottom-6 -left-6 px-8 py-4 rounded-2xl font-bold flex items-center gap-4"
                                style={{ backgroundColor: accentColor, color: bgColor }}
                            >
                                <div className="text-3xl font-black">{experience?.length || 0}+</div>
                                <div className="text-sm">Years<br />Experience</div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Work Experience */}
            {experience?.length > 0 && (
                <section id="work" className="py-40 px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex items-end justify-between mb-20"
                        >
                            <div>
                                <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: accentColor }}>
                                    Experience
                                </span>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tight">
                                    Work<br />History
                                </h2>
                            </div>
                            <div className="text-8xl font-black text-white/5 hidden md:block">
                                {experience?.length}
                            </div>
                        </motion.div>

                        <div className="space-y-8">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 10 }}
                                    className="group"
                                >
                                    <div className="p-10 md:p-14 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all relative overflow-hidden">
                                        <div className="absolute -top-10 -right-10 text-[12rem] font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        <div className="relative z-10 grid md:grid-cols-[1fr,2fr] gap-10">
                                            <div className="space-y-4">
                                                <div className="inline-block px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
                                                    {exp.startDate} — {exp.endDate || 'Present'}
                                                </div>
                                                <h3 className="text-3xl font-black tracking-tight">{exp.position}</h3>
                                                <p className="text-lg font-bold" style={{ color: accentColor }}>{exp.company}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <p className="text-lg text-white/50 leading-relaxed">{exp.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills?.length > 0 && (
                <section id="skills" className="py-40 px-6">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <span className="text-sm font-bold uppercase tracking-widest mb-4 block" style={{ color: accentColor }}>
                                Skills
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tight">
                                My Toolkit
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -10, rotate: i % 2 === 0 ? 3 : -3 }}
                                    className="cursor-default"
                                >
                                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center hover:border-white/20 transition-all group">
                                        <div
                                            className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: `${accentColor}20` }}
                                        >
                                            <Layers className="w-6 h-6" style={{ color: accentColor }} />
                                        </div>
                                        <span className="font-bold text-lg">{skill.name || skill}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-40 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-sm font-bold uppercase tracking-widest mb-6 block text-white/40">
                            Let's create something amazing
                        </span>
                        <h2 className="text-6xl md:text-9xl font-black tracking-tight mb-12">
                            Get In<br />
                            <span style={{ color: accentColor }}>Touch.</span>
                        </h2>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="inline-flex items-center gap-4 px-12 py-6 rounded-2xl font-bold text-xl transition-all hover:scale-105"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            <Mail className="w-6 h-6" /> {personal?.email}
                        </a>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}
