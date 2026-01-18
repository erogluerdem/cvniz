import { motion } from 'framer-motion'
import { ArrowRight, Mail, MapPin, Linkedin, Globe, Github, Zap, Award, Briefcase, Star, ChevronRight, Sparkles } from 'lucide-react'

export default function MinimalWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#000000'
    const bgColor = colors.bg || '#ffffff'
    const textColor = colors.text || '#111827'

    const containerStyle = {
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: styles.fontFamily || "'Inter', sans-serif",
    }

    return (
        <div className="min-h-screen transition-colors duration-500 relative overflow-hidden" style={containerStyle}>
            {/* MASSIVE Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-[200px] opacity-10"
                    style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }}
                />
                <div
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full blur-[200px] opacity-5"
                    style={{ background: `radial-gradient(circle, ${textColor} 0%, transparent 70%)` }}
                />
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
                        backgroundSize: '80px 80px'
                    }}
                />
            </div>

            {/* Premium Floating Nav */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
                <div
                    className="backdrop-blur-2xl border rounded-full px-8 py-4 flex justify-between items-center shadow-2xl"
                    style={{ backgroundColor: `${bgColor}90`, borderColor: `${textColor}10` }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            {personal?.fullName?.[0]}
                        </div>
                        <span className="font-bold tracking-tight hidden md:block">{personal?.fullName}</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest font-bold opacity-60">
                            <a href="#about" className="hover:opacity-100 transition-opacity">Başlangıç</a>
                            <a href="#experience" className="hover:opacity-100 transition-opacity">Kariyer</a>
                            <a href="#skills" className="hover:opacity-100 transition-opacity">Yetenekler</a>
                        </div>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105"
                            style={{ backgroundColor: accentColor, color: bgColor }}
                        >
                            İletişim
                        </a>
                    </div>
                </div>
            </nav>

            {/* EPIC Hero Section */}
            <section id="about" className="min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative">
                {/* Large Background Text */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                >
                    <span
                        className="text-[25vw] font-black opacity-[0.02] uppercase tracking-tighter whitespace-nowrap"
                        style={{ color: textColor }}
                    >
                        {personal?.fullName?.split(' ')[0]}
                    </span>
                </div>

                <div className="max-w-5xl w-full relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left Content */}
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-3 px-5 py-2 rounded-full border"
                                style={{ borderColor: `${colors.accent}40`, backgroundColor: `${colors.accent}10` }}
                            >
                                <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: accentColor }}>
                                    {personal?.title}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]"
                            >
                                {personal?.fullName?.split(' ')[0]}
                                <br />
                                <span style={{ color: accentColor }}>
                                    {personal?.fullName?.split(' ').slice(1).join(' ')}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl opacity-60 leading-relaxed max-w-lg"
                            >
                                {personal?.summary}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-wrap gap-4"
                            >
                                <a
                                    href={`mailto:${personal?.email}`}
                                    className="px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
                                    style={{ backgroundColor: accentColor, color: bgColor, boxShadow: `0 20px 40px -10px ${accentColor}40` }}
                                >
                                    Hadi Konuşalım <ArrowRight className="w-5 h-5" />
                                </a>
                                <div className="flex gap-3">
                                    {personal?.linkedin && (
                                        <a href={personal.linkedin} className="w-14 h-14 rounded-2xl border flex items-center justify-center hover:scale-105 transition-all" style={{ borderColor: `${textColor}20` }}>
                                            <Linkedin className="w-5 h-5 opacity-50" />
                                        </a>
                                    )}
                                    {personal?.github && (
                                        <a href={personal.github} className="w-14 h-14 rounded-2xl border flex items-center justify-center hover:scale-105 transition-all" style={{ borderColor: `${textColor}20` }}>
                                            <Github className="w-5 h-5 opacity-50" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="relative"
                        >
                            <div
                                className="p-12 rounded-[3rem] border shadow-2xl backdrop-blur-xl relative overflow-hidden"
                                style={{ backgroundColor: `${bgColor}80`, borderColor: `${textColor}10` }}
                            >
                                {/* Decorative Corner */}
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 rounded-bl-[3rem]"
                                    style={{ backgroundColor: `${colors.accent}10` }}
                                />

                                <div className="relative z-10 space-y-10">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                            style={{ backgroundColor: accentColor }}
                                        >
                                            <Award className="w-8 h-8" style={{ color: bgColor }} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-black uppercase tracking-widest opacity-40">Deneyim</div>
                                            <div className="text-4xl font-black">{experience?.length || 0}+ Yıl</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl" style={{ backgroundColor: `${textColor}05` }}>
                                            <div className="text-3xl font-black" style={{ color: accentColor }}>{skills?.length || 0}+</div>
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">Yetenek</div>
                                        </div>
                                        <div className="p-6 rounded-2xl" style={{ backgroundColor: `${textColor}05` }}>
                                            <div className="text-3xl font-black" style={{ color: accentColor }}>{education?.length || 0}</div>
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-40 mt-1">Eğitim</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-6 border-t" style={{ borderColor: `${textColor}10` }}>
                                        <MapPin className="w-5 h-5 opacity-40" />
                                        <span className="text-sm font-bold opacity-60">{personal?.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div
                                className="absolute -bottom-6 -left-6 px-6 py-3 rounded-2xl shadow-xl font-black text-sm uppercase tracking-widest"
                                style={{ backgroundColor: accentColor, color: bgColor }}
                            >
                                ✓ Açık İş Fırsatlarına
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* EXPERIENCE - Premium Cards */}
            {experience?.length > 0 && (
                <section id="experience" className="py-40 px-6 relative">
                    {/* Section Background */}
                    <div
                        className="absolute inset-0"
                        style={{ backgroundColor: `${textColor}02` }}
                    />

                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8"
                        >
                            <div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: accentColor }}>
                                    Kariyer Yolculuğu
                                </span>
                                <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                                    Profesyonel<br />
                                    <span className="opacity-30">Deneyimlerim</span>
                                </h2>
                            </div>
                            <p className="text-lg opacity-50 max-w-md">
                                Her rol, yeni beceriler ve değerli deneyimler kazandırdığım bir fırsat oldu.
                            </p>
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
                                    <div
                                        className="p-10 md:p-16 rounded-[3rem] border transition-all relative overflow-hidden"
                                        style={{
                                            backgroundColor: bgColor,
                                            borderColor: `${textColor}10`,
                                            boxShadow: `0 40px 80px -20px ${textColor}10`
                                        }}
                                    >
                                        {/* Big Background Number */}
                                        <div
                                            className="absolute -top-10 -right-10 text-[15rem] font-black opacity-[0.02] select-none pointer-events-none"
                                        >
                                            0{i + 1}
                                        </div>

                                        {/* Hover Accent Line */}
                                        <div
                                            className="absolute top-0 left-0 w-0 group-hover:w-full h-1 transition-all duration-500"
                                            style={{ backgroundColor: colors.accent }}
                                        />

                                        <div className="relative z-10 grid md:grid-cols-[1fr,2fr] gap-10 md:gap-20">
                                            {/* Left - Meta */}
                                            <div className="space-y-6">
                                                <div
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest"
                                                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                                                >
                                                    <Briefcase className="w-4 h-4" />
                                                    {exp.startDate} — {exp.endDate || 'Günümüz'}
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-3">
                                                        {exp.position}
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-px" style={{ backgroundColor: accentColor }} />
                                                        <span className="text-lg font-bold" style={{ color: accentColor }}>
                                                            {exp.company}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right - Description */}
                                            <div className="flex items-center">
                                                <p className="text-xl leading-relaxed opacity-60">
                                                    {exp.description}
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

            {/* SKILLS - Interactive Grid */}
            {skills?.length > 0 && (
                <section id="skills" className="py-40 px-6 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(180deg, ${bgColor} 0%, ${accentColor}05 50%, ${bgColor} 100%)`
                        }}
                    />

                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-24"
                        >
                            <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: colors.accent }}>
                                Uzmanlık Alanları
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                                Yetenek <span className="opacity-30">Arsenal</span>
                            </h2>
                        </motion.div>

                        {/* Skills Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {skills.map((skill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -10, scale: 1.05 }}
                                    className="group cursor-default"
                                >
                                    <div
                                        className="p-8 rounded-3xl border text-center transition-all relative overflow-hidden"
                                        style={{
                                            backgroundColor: `${bgColor}`,
                                            borderColor: `${textColor}10`
                                        }}
                                    >
                                        {/* Hover Background */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{ backgroundColor: `${accentColor}05` }}
                                        />

                                        {/* Icon */}
                                        <div
                                            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all group-hover:scale-110"
                                            style={{ backgroundColor: `${accentColor}15` }}
                                        >
                                            <Star className="w-6 h-6" style={{ color: accentColor }} />
                                        </div>

                                        <span className="font-black text-lg relative z-10">
                                            {skill.name || skill}
                                        </span>

                                        {/* Skill Level Bar */}
                                        <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${textColor}10` }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${90 - (i * 3)}%` }}
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

            {/* EDUCATION */}
            {education?.length > 0 && (
                <section className="py-40 px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-20"
                        >
                            <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: colors.accent }}>
                                Akademik Geçmiş
                            </span>
                            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                                Eğitim <span className="opacity-30">Yolculuğu</span>
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {education.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="p-10 rounded-3xl border relative overflow-hidden group"
                                    style={{ borderColor: `${textColor}10` }}
                                >
                                    <div
                                        className="absolute top-0 right-0 w-24 h-24 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundColor: `${accentColor}10` }}
                                    />

                                    <div className="relative z-10">
                                        <div
                                            className="inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                                            style={{ backgroundColor: `${textColor}10` }}
                                        >
                                            {edu.year || edu.startDate}
                                        </div>
                                        <h3 className="text-2xl font-black mb-2">{edu.school || edu.institution}</h3>
                                        <p className="font-bold" style={{ color: accentColor }}>{edu.degree || edu.field}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* EPIC Footer CTA */}
            <footer id="contact" className="py-40 px-6 relative overflow-hidden">
                {/* Background */}
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `${accentColor}05` }}
                />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs font-black uppercase tracking-[0.3em] mb-6 block opacity-50">
                            Yeni projelere hazırım
                        </span>
                        <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12">
                            Hadi<br />
                            <span style={{ color: accentColor }}>Konuşalım.</span>
                        </h2>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="inline-flex items-center gap-4 px-12 py-6 rounded-full text-xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            style={{
                                backgroundColor: accentColor,
                                color: bgColor,
                                boxShadow: `0 30px 60px -15px ${accentColor}40`
                            }}
                        >
                            <Mail className="w-6 h-6" />
                            {personal?.email}
                        </a>
                    </motion.div>
                </div>
            </footer>
        </div>
    )
}
