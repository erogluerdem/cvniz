import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, Sparkles, Zap, ArrowDown, MapPin, ArrowRight, Briefcase, Award, Star, ChevronRight } from 'lucide-react'

export default function GradientWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#F43F5E'
    const bgColor = colors.bg || '#ffffff'
    const textColor = colors.text || '#000000'
    const secondaryColor = colors.secondary || '#3B82F6'

    const containerStyle = {
        background: bgColor,
        color: textColor,
        fontFamily: styles.fontFamily || "'Montserrat', sans-serif",
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-white/20" style={containerStyle}>
            {/* EPIC Dynamic Mesh Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 150, 0],
                        y: [0, 80, 0],
                        scale: [1, 1.3, 1],
                        rotate: [0, 45, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[30%] -left-[20%] w-[100%] h-[100%] rounded-full blur-[180px] opacity-50 mix-blend-overlay"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 60%)` }}
                />
                <motion.div
                    animate={{
                        x: [0, -150, 0],
                        y: [0, -80, 0],
                        scale: [1, 1.2, 1],
                        rotate: [0, -45, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[30%] -right-[20%] w-[90%] h-[90%] rounded-full blur-[160px] opacity-40 mix-blend-overlay"
                    style={{ background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 60%)` }}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-[200px] opacity-30"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 50%)` }}
                />
            </div>

            {/* PREMIUM Floating Nav */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-6">
                <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full py-4 px-10 flex justify-between items-center shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xl font-black"
                        >
                            {personal?.fullName?.[0]}
                        </div>
                        <span className="text-xl font-black text-white italic tracking-tighter uppercase hidden md:block">{personal?.fullName}</span>
                    </div>
                    <a
                        href={`mailto:${personal?.email}`}
                        className="group flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Bağlantı Kur
                    </a>
                </div>
            </nav>

            {/* MASSIVE Hero */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32">
                {/* Giant Background Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span className="text-[30vw] font-black text-white/[0.02] uppercase tracking-tighter whitespace-nowrap">
                        VIZYONER
                    </span>
                </div>

                <div className="relative z-10 max-w-5xl">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="mb-12 relative inline-block"
                    >
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/20 backdrop-blur-3xl border-2 border-white/30 flex items-center justify-center text-6xl md:text-8xl font-black text-white shadow-2xl relative z-10">
                            {personal?.fullName?.[0]}
                        </div>
                        {/* Decorative Ring */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-6 border-2 border-dashed border-white/20 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-12 border border-white/10 rounded-full"
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full">
                            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/80">{personal?.title}</span>
                        </div>

                        <h1 className="text-7xl md:text-[12rem] font-black text-white leading-[0.8] tracking-tighter uppercase">
                            Sınırları<br />
                            <span className="opacity-20 italic">Aşıyorum.</span>
                        </h1>

                        <p className="text-2xl md:text-3xl font-bold text-white/60 max-w-3xl mx-auto leading-snug">
                            {personal?.summary?.substring(0, 120)}...
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 pt-8">
                            <a
                                href="#experience"
                                className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                            >
                                Keşfet <ArrowDown className="w-5 h-5" />
                            </a>
                            <div className="flex gap-3">
                                {personal?.linkedin && (
                                    <a href={personal.linkedin} className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                                        <Linkedin className="w-5 h-5 text-white" />
                                    </a>
                                )}
                                {personal?.github && (
                                    <a href={personal.github} className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                                        <Github className="w-5 h-5 text-white" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* EXPERIENCE - Epic Cards */}
            {experience?.length > 0 && (
                <section id="experience" className="py-40 px-6 relative">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-24"
                        >
                            <div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: accentColor }}>
                                    Kariyer Yolculuğu
                                </span>
                                <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                                    Deneyim
                                </h2>
                            </div>
                            <div className="h-[2px] flex-1 bg-white/10 hidden md:block" />
                        </motion.div>

                        {/* Cards */}
                        <div className="space-y-10">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 80 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        damping: 15,
                                        stiffness: 100,
                                        delay: i * 0.1
                                    }}
                                    whileHover={{ y: -20, rotate: i % 2 === 0 ? 1 : -1 }}
                                    className="group"
                                >
                                    <div
                                        className="p-12 md:p-20 rounded-[4rem] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden transition-all hover:bg-white/10 hover:border-white/20 shadow-2xl"
                                        style={{ boxShadow: `0 60px 120px -30px ${accentColor}20` }}
                                    >
                                        {/* Massive Background Number */}
                                        <div className="absolute -top-20 -right-10 text-[20rem] font-black text-white/[0.02] select-none pointer-events-none group-hover:text-white/[0.05] transition-colors italic">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        {/* Specular Line */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Content */}
                                        <div className="relative z-10 grid md:grid-cols-[1fr,2fr] gap-10 md:gap-20">
                                            {/* Left */}
                                            <div className="space-y-6">
                                                <div
                                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black text-xs font-black uppercase tracking-widest shadow-xl"
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    Seviye {experience.length - i}
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3">
                                                        {exp.startDate} — {exp.endDate || 'GÜNÜMÜZ'}
                                                    </div>
                                                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                                                        {exp.position}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-px bg-white/30" />
                                                    <span className="text-2xl font-bold italic" style={{ color: accentColor }}>
                                                        {exp.company}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right */}
                                            <div className="flex items-center">
                                                <p className="text-xl text-white/60 leading-relaxed font-medium border-l-2 border-white/10 pl-8 italic">
                                                    "{exp.description}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* SKILLS - Vibrant Pills */}
            {skills?.length > 0 && (
                <section className="py-40 px-6 relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-black/20" />

                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-24"
                        >
                            <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: accentColor }}>
                                Uzmanlık Alanları
                            </span>
                            <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter opacity-10 absolute inset-0 flex items-center justify-center pointer-events-none">
                                TECH
                            </h2>
                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter relative">
                                Teknoloji <span className="opacity-20">Arsenal</span>
                            </h2>
                        </motion.div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{
                                        y: -15,
                                        scale: 1.05,
                                        rotate: i % 2 === 0 ? 5 : -5
                                    }}
                                    className="group cursor-default"
                                >
                                    <div
                                        className="p-8 rounded-3xl bg-white/5 border-2 border-white/10 text-center transition-all hover:bg-white/10 hover:border-white backdrop-blur-xl relative overflow-hidden"
                                    >
                                        {/* Icon */}
                                        <div
                                            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12"
                                            style={{ backgroundColor: `${accentColor}20` }}
                                        >
                                            <Star className="w-6 h-6" style={{ color: accentColor }} />
                                        </div>

                                        <span className="font-black text-xl text-white uppercase tracking-tight">
                                            {skill.name || skill}
                                        </span>

                                        {/* Progress */}
                                        <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${95 - (i * 2)}%` }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: accentColor }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* EPIC Footer */}
            <footer className="py-40 px-6 text-center relative">
                <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <span className="text-xs font-black uppercase tracking-[0.5em] text-white/40">Yeni Maceralara Hazırım</span>
                        <h2 className="text-7xl md:text-[12rem] font-black text-white uppercase tracking-tighter leading-none">
                            Konuşalım.
                        </h2>
                    </motion.div>

                    <a
                        href={`mailto:${personal?.email}`}
                        className="inline-flex items-center gap-6 px-16 py-8 bg-white text-black rounded-full font-black text-2xl md:text-4xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Merhaba De <Sparkles className="w-8 h-8 fill-black" />
                    </a>

                    <div className="pt-32 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10 opacity-30">
                        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-white">
                            <MapPin className="w-4 h-4" /> {personal?.location}
                        </div>
                        <div className="flex gap-12 font-black uppercase tracking-[0.3em] text-[10px] text-white">
                            {personal?.linkedin && <a href={personal.linkedin} className="hover:opacity-100 transition-opacity">LinkedIn</a>}
                            {personal?.github && <a href={personal.github} className="hover:opacity-100 transition-opacity">GitHub</a>}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
