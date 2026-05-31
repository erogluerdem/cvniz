import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, Briefcase, GraduationCap, Award, Sparkles, Star, ArrowRight, ChevronRight, Zap, MapPin } from 'lucide-react'

export default function GlassWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#06b6d4'
    const bgColor = colors.bg || '#0f172a'
    const textColor = colors.text || '#ffffff'
    const secondaryColor = colors.secondary || '#8B5CF6'

    const containerStyle = {
        background: bgColor,
        color: textColor,
        fontFamily: styles.fontFamily || "'Inter', sans-serif",
    }

    return (
        <div className="min-h-screen relative overflow-hidden selection:bg-white/30" style={containerStyle}>
            {/* IMMERSIVE Animated Background */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Moving Gradient Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 180, 360],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full blur-[150px] opacity-40"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 60%)` }}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [360, 180, 0],
                        x: [0, -100, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full blur-[130px] opacity-30"
                    style={{ background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 60%)` }}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.4, 1],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[180px] opacity-20"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 60%)` }}
                />

                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
            </div>

            {/* PREMIUM Floating Glass Nav */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
                <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-[2rem] px-8 py-4 flex justify-between items-center shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-xl">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <span className="font-black text-white tracking-tight">{personal?.fullName}</span>
                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">{personal?.title}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex gap-8 text-[11px] font-black uppercase tracking-widest text-white/60">
                            <a href="#about" className="hover:text-white transition-colors">Başlangıç</a>
                            <a href="#projects" className="hover:text-white transition-colors">Projeler</a>
                            <a href="#skills" className="hover:text-white transition-colors">Uzmanlık</a>
                        </div>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-xl"
                        >
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* EPIC Glass Hero */}
            <section id="about" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
                {/* Background Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span className="text-[25vw] font-black text-white/[0.02] uppercase tracking-tighter whitespace-nowrap">
                        CREATIVE
                    </span>
                </div>

                <div className="max-w-6xl w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left - Content */}
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl"
                            >
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{personal?.title}</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter"
                            >
                                Dijital<br />
                                <span className="text-white/40 italic">Deneyimler</span><br />
                                Yaratıyorum.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-white/60 max-w-lg leading-relaxed font-medium"
                            >
                                Merhaba, ben <span className="text-white font-bold">{personal?.fullName}</span>. {personal?.summary?.substring(0, 150)}...
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-wrap gap-4"
                            >
                                <a
                                    href="#projects"
                                    className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                >
                                    Projelerimi Keşfet <ArrowRight className="w-5 h-5" />
                                </a>
                                <div className="flex gap-3">
                                    {personal?.linkedin && (
                                        <a href={personal.linkedin} className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all">
                                            <Linkedin className="w-5 h-5 text-white" />
                                        </a>
                                    )}
                                    {personal?.github && (
                                        <a href={personal.github} className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/20 transition-all">
                                            <Github className="w-5 h-5 text-white" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - Premium Glass Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1, type: "spring" }}
                            className="relative perspective-1000"
                        >
                            <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                                {/* Specular Highlight */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/30 via-transparent to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 space-y-8">
                                    {/* Avatar */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 border border-white/30 flex items-center justify-center text-4xl font-black text-white shadow-xl">
                                            {personal?.fullName?.[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white">{personal?.fullName}</h3>
                                            <p className="text-white/50 text-sm font-medium">{personal?.location}</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { value: experience?.length || 0, label: 'Deneyim' },
                                            { value: skills?.length || 0, label: 'Yetenek' },
                                            { value: education?.length || 0, label: 'Eğitim' }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center">
                                                <div className="text-3xl font-black text-white">{stat.value}+</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/10">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-sm font-bold text-white/60">İş Fırsatlarına Açık</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element */}
                            <div className="absolute -bottom-6 -right-6 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl font-black text-sm text-white">
                                ✨ Premium Tasarım
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXPERIENCE - Premium Glass Cards */}
            {experience?.length > 0 && (
                <section id="projects" className="py-40 px-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-24"
                        >
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-4 block">Kariyer Yolculuğu</span>
                            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                                Deneyim <span className="text-white/20">&</span> Roller
                            </h2>
                            <div className="w-32 h-1 bg-white/20 mx-auto mt-8 rounded-full" />
                        </motion.div>

                        {/* Experience Cards */}
                        <div className="space-y-8">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-12 md:p-16 rounded-[3rem] relative overflow-hidden transition-all hover:bg-white/[0.06] hover:border-white/20 shadow-2xl">
                                        {/* Large Background Number */}
                                        <div className="absolute -top-20 -right-10 text-[18rem] font-black text-white/[0.02] select-none pointer-events-none group-hover:text-white/[0.04] transition-colors">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        {/* Specular Line */}
                                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                                        {/* Content */}
                                        <div className="relative z-10 grid md:grid-cols-[auto,1fr] gap-10 md:gap-16 items-start">
                                            {/* Icon */}
                                            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xl shadow-xl group-hover:scale-110 transition-transform">
                                                <Briefcase className="w-8 h-8 text-white" />
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">{exp.position}</h3>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="w-8 h-px bg-white/30" />
                                                            <span className="text-xl font-bold" style={{ color: accentColor }}>{exp.company}</span>
                                                        </div>
                                                    </div>
                                                    <div className="px-6 py-2 rounded-full bg-white/10 border border-white/20 text-[11px] font-black uppercase tracking-widest text-white/60 backdrop-blur-xl shrink-0">
                                                        {exp.startDate} — {exp.endDate || 'Günümüz'}
                                                    </div>
                                                </div>
                                                <p className="text-lg text-white/50 leading-relaxed font-medium">
                                                    {exp.description}
                                                </p>
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

            {/* SKILLS - Floating Glass Bubbles */}
            {skills?.length > 0 && (
                <section id="skills" className="py-40 px-6 relative overflow-hidden">
                    {/* Background Glow */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-20"
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
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-4 block">Uzmanlık Alanları</span>
                            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter">
                                Teknoloji <span className="text-white/20">Arsenal</span>
                            </h2>
                        </motion.div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        delay: i * 0.05,
                                        duration: 0.8
                                    }}
                                    whileHover={{
                                        y: -15,
                                        scale: 1.05,
                                        rotate: i % 2 === 0 ? 3 : -3
                                    }}
                                    className="group cursor-default"
                                >
                                    <div className="p-8 rounded-3xl backdrop-blur-3xl bg-white/10 border border-white/20 text-center transition-all hover:bg-white/20 hover:border-white/40 relative overflow-hidden shadow-xl">
                                        {/* Glow Effect */}
                                        <div
                                            className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"
                                            style={{ backgroundColor: accentColor }}
                                        />

                                        {/* Icon */}
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>

                                        <span className="font-black text-white text-lg relative z-10 block">
                                            {skill.name || skill}
                                        </span>

                                        {/* Skill Level */}
                                        <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${95 - (i * 3)}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
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

            {/* EPIC Glass Footer */}
            <footer className="py-40 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden"
                    >
                        {/* Top Shine */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                        <div className="relative z-10">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-6 block">
                                Yeni Projelere Hazırım
                            </span>
                            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-12">
                                Hadi<br />
                                <span className="text-white/30">Konuşalım.</span>
                            </h2>
                            <a
                                href={`mailto:${personal?.email}`}
                                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl"
                            >
                                <Mail className="w-6 h-6" /> Mesaj Gönder
                            </a>

                            <div className="mt-16 flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                                {personal?.linkedin && <a href={personal.linkedin} className="hover:text-white transition-colors">LinkedIn</a>}
                                {personal?.github && <a href={personal.github} className="hover:text-white transition-colors">GitHub</a>}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}
