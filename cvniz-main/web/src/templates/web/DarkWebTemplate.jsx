import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, Code, ArrowRight, Zap, Terminal, Cpu, Database, Server, Shield, ChevronRight, Sparkles, Award, Briefcase } from 'lucide-react'

export default function DarkWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#06b6d4'
    const bgColor = colors.bg || '#030712'
    const textColor = colors.text || '#f3f4f6'
    const secondaryColor = colors.secondary || '#8b5cf6'

    const containerStyle = {
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: styles.fontFamily || "'Inter', sans-serif",
    }

    return (
        <div className="min-h-screen relative overflow-hidden" style={containerStyle}>
            {/* CYBERPUNK Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Neon Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[1000px] h-[1000px] rounded-full blur-[200px]"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 60%)` }}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full blur-[180px]"
                    style={{ background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 60%)` }}
                />

                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Scanlines Effect */}
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${textColor} 2px, ${textColor} 4px)`
                    }}
                />
            </div>

            {/* FLOATING Cyberpunk Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center px-8 py-4 rounded-2xl backdrop-blur-2xl border border-white/10 bg-black/50">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl relative overflow-hidden"
                                style={{ backgroundColor: accentColor }}
                            >
                                <span style={{ color: bgColor }}>{personal?.fullName?.[0]}</span>
                                {/* Glitch Effect */}
                                <div className="absolute inset-0 bg-white/20 -translate-x-full animate-pulse" />
                            </div>
                            <div className="hidden md:block">
                                <div className="font-black tracking-tight text-lg">{personal?.fullName}</div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">{personal?.title}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest opacity-60">
                                <a href="#hero" className="hover:opacity-100 hover:text-white transition-all flex items-center gap-2">
                                    <Terminal className="w-4 h-4" /> Init
                                </a>
                                <a href="#work" className="hover:opacity-100 hover:text-white transition-all flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" /> Process
                                </a>
                                <a href="#skills" className="hover:opacity-100 hover:text-white transition-all flex items-center gap-2">
                                    <Cpu className="w-4 h-4" /> Stack
                                </a>
                            </div>
                            <a
                                href={`mailto:${personal?.email}`}
                                className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2"
                                style={{ backgroundColor: accentColor, color: bgColor }}
                            >
                                <Zap className="w-4 h-4" /> İletişim
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MASSIVE Hero Section */}
            <section id="hero" className="relative min-h-screen flex items-center px-6 pt-32">
                {/* Giant Background Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span
                        className="text-[30vw] font-black opacity-[0.02] uppercase tracking-tighter whitespace-nowrap"
                    >
                        DEVELOPER
                    </span>
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left - Content */}
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
                            >
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                                <span className="text-xs font-black uppercase tracking-widest">{personal?.title}</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-7xl md:text-[10rem] font-black leading-[0.8] tracking-tighter"
                            >
                                {personal?.fullName?.split(' ')[0]}
                                <br />
                                <span
                                    className="text-transparent bg-clip-text"
                                    style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, ${secondaryColor || '#fff'})` }}
                                >
                                    {personal?.fullName?.split(' ').slice(1).join(' ')}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-gray-400 max-w-xl leading-relaxed"
                            >
                                {personal?.summary}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap gap-4"
                            >
                                <a
                                    href="#work"
                                    className="px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                    style={{ backgroundColor: accentColor, color: bgColor, boxShadow: `0 25px 50px -10px ${accentColor}50` }}
                                >
                                    Deneyimlerimi Gör <ArrowRight className="w-6 h-6" />
                                </a>
                                <div className="flex gap-3">
                                    {[
                                        { icon: <Linkedin className="w-5 h-5" />, link: personal?.linkedin },
                                        { icon: <Github className="w-5 h-5" />, link: personal?.github },
                                        { icon: <Globe className="w-5 h-5" />, link: personal?.website }
                                    ].filter(s => s.link).map((social, i) => (
                                        <a
                                            key={i}
                                            href={social.link}
                                            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hover:-translate-y-1"
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - 3D Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ delay: 0.4, duration: 1, type: "spring" }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative">
                                {/* Main Card */}
                                <div
                                    className="p-12 rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 relative overflow-hidden"
                                    style={{ boxShadow: `0 50px 100px -20px ${accentColor}20` }}
                                >
                                    {/* Terminal Header */}
                                    <div className="flex items-center gap-2 mb-8 pb-6 border-b border-white/10">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                        <span className="ml-4 text-xs font-mono opacity-30">terminal@{personal?.fullName?.toLowerCase().replace(' ', '-')}</span>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="p-6 rounded-2xl bg-white/5">
                                            <div className="text-4xl font-black mb-1" style={{ color: accentColor }}>{experience?.length || 0}+</div>
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-40">Yıl Deneyim</div>
                                        </div>
                                        <div className="p-6 rounded-2xl bg-white/5">
                                            <div className="text-4xl font-black mb-1" style={{ color: accentColor }}>{skills?.length || 0}+</div>
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-40">Teknoloji</div>
                                        </div>
                                    </div>

                                    {/* Code Animation */}
                                    <div className="font-mono text-sm space-y-2 opacity-40">
                                        <div><span style={{ color: accentColor }}>const</span> developer = {'{'}</div>
                                        <div className="pl-4">name: <span className="text-green-400">"{personal?.fullName}"</span>,</div>
                                        <div className="pl-4">status: <span className="text-yellow-400">"available"</span>,</div>
                                        <div className="pl-4">skills: <span className="text-blue-400">[...]</span></div>
                                        <div>{'}'}</div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div
                                    className="absolute -top-8 -right-8 w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center animate-bounce"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <Zap className="w-10 h-10" style={{ color: bgColor }} />
                                </div>
                                <div className="absolute -bottom-6 -left-6 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 font-mono text-sm">
                                    <span style={{ color: accentColor }}>$</span> npm run success
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXPERIENCE - Cyberpunk Timeline */}
            {experience?.length > 0 && (
                <section id="work" className="py-40 px-6 relative">
                    <div className="max-w-6xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8"
                        >
                            <div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: accentColor }}>
                                    &lt;experience&gt;
                                </span>
                                <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
                                    Kariyerim<br />
                                    <span className="opacity-20">Timeline</span>
                                </h2>
                            </div>
                            <p className="text-lg opacity-40 max-w-md font-mono">
                                // Her proje = yeni deneyim
                            </p>
                        </motion.div>

                        {/* Experience Cards */}
                        <div className="space-y-8">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, type: "spring" }}
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <div
                                        className="p-10 md:p-16 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden transition-all hover:bg-white/[0.05] hover:border-white/10"
                                        style={{ boxShadow: `0 40px 80px -20px ${colors.bg}` }}
                                    >
                                        {/* Terminal Header */}
                                        <div className="absolute top-0 left-0 right-0 px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                                            </div>
                                            <span className="text-[10px] font-mono opacity-20 group-hover:opacity-60 transition-opacity">
                                                job_{String(i + 1).padStart(2, '0')}.log
                                            </span>
                                        </div>

                                        {/* Huge Background Number */}
                                        <div className="absolute -top-20 -right-20 text-[20rem] font-black opacity-[0.02] select-none pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        {/* Content */}
                                        <div className="pt-16 relative z-10">
                                            <div className="grid md:grid-cols-[1fr,2fr] gap-10 md:gap-20">
                                                {/* Left - Meta */}
                                                <div className="space-y-6">
                                                    <div
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono"
                                                    >
                                                        <span style={{ color: accentColor }}>⬢</span>
                                                        {exp.startDate} — {exp.endDate || 'CURRENT'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-4 group-hover:text-white transition-colors">
                                                            {exp.position}
                                                        </h3>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-0.5" style={{ backgroundColor: accentColor }} />
                                                            <span className="text-xl font-bold" style={{ color: accentColor }}>
                                                                {exp.company}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right - Description */}
                                                <div className="flex items-center">
                                                    <p className="text-xl leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                                                        {exp.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Accent */}
                                        <div
                                            className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 transition-all duration-700"
                                            style={{ backgroundColor: accentColor }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* SKILLS - Tech Stack Grid */}
            {skills?.length > 0 && (
                <section id="skills" className="py-40 px-6 relative overflow-hidden">
                    {/* Background Glow */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px] opacity-10"
                        style={{ backgroundColor: accentColor }}
                    />

                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-24"
                        >
                            <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: accentColor }}>
                                &lt;tech-stack&gt;
                            </span>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
                                Teknoloji <span className="opacity-20">Arsenal</span>
                            </h2>
                        </motion.div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (i % 8) * 0.05 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="group cursor-default"
                                >
                                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all relative overflow-hidden">
                                        {/* Glow on Hover */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
                                            style={{ backgroundColor: accentColor }}
                                        />

                                        {/* Icon */}
                                        <div
                                            className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                                        >
                                            <Code className="w-6 h-6" style={{ color: accentColor }} />
                                        </div>

                                        <span className="font-black text-lg block mb-4">{skill.name || skill}</span>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-mono opacity-40">
                                                <span>proficiency</span>
                                                <span>{95 - (i * 2)}%</span>
                                            </div>
                                            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${95 - (i * 2)}%` }}
                                                    transition={{ duration: 1.5, delay: 0.5 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* EPIC Footer */}
            <footer className="py-40 px-6 border-t border-white/5 relative overflow-hidden">
                {/* Background */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[200px] opacity-10"
                    style={{ backgroundColor: accentColor }}
                />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs font-mono opacity-40 mb-6 block">
                            // ready_for_next_challenge
                        </span>
                        <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter mb-12">
                            Hadi<br />
                            <span
                                className="text-transparent bg-clip-text"
                                style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, ${secondaryColor || '#fff'})` }}
                            >
                                Konuşalım.
                            </span>
                        </h2>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="inline-flex items-center gap-4 px-12 py-6 rounded-2xl font-black text-xl transition-all hover:scale-105"
                            style={{
                                backgroundColor: accentColor,
                                color: bgColor,
                                boxShadow: `0 30px 60px -15px ${accentColor}50`
                            }}
                        >
                            <Mail className="w-6 h-6" />
                            {personal?.email}
                        </a>

                        <div className="mt-20 flex justify-center gap-10 opacity-30 text-xs font-mono uppercase tracking-widest">
                            {personal?.linkedin && <a href={personal.linkedin} className="hover:opacity-100 transition-opacity">LinkedIn</a>}
                            {personal?.github && <a href={personal.github} className="hover:opacity-100 transition-opacity">GitHub</a>}
                            <span>© 2024 {personal?.fullName}</span>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}
