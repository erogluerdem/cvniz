import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, ArrowRight, Zap, Play, Sparkles, Award, Briefcase, Star, ChevronRight, X } from 'lucide-react'

export default function CreativeWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#fcd34d'
    const bgColor = colors.bg || '#ffffff'
    const textColor = colors.text || '#000000'

    const containerStyle = {
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: styles.fontFamily || "'Syne', sans-serif",
    }

    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-black selection:text-white" style={containerStyle}>
            {/* BRUTALIST Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Massive Rotated Blocks */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[150%] border-r-[30px] border-black rotate-[-15deg] opacity-5" />
                <div className="absolute top-[10%] right-[-15%] w-[60%] h-[50%] border-[60px] border-black rotate-[8deg] opacity-[0.03]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-black rotate-[5deg] opacity-[0.02]" />

                {/* Giant Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-black opacity-[0.01] uppercase tracking-tighter pointer-events-none select-none whitespace-nowrap">
                    BOLD
                </div>
            </div>

            {/* AGGRESSIVE Sidebar Nav */}
            <nav className="fixed left-0 top-0 bottom-0 w-24 border-r-8 border-black bg-white z-50 hidden lg:flex flex-col items-center justify-between py-12">
                <motion.div
                    initial={{ rotate: -90 }}
                    className="text-2xl font-black whitespace-nowrap tracking-tighter origin-center -rotate-90"
                >
                    {personal?.fullName?.toUpperCase()}
                </motion.div>
                <div className="space-y-6 flex flex-col items-center">
                    {personal?.linkedin && (
                        <a href={personal.linkedin} className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                    {personal?.github && (
                        <a href={personal.github} className="w-12 h-12 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    <a
                        href={`mailto:${personal?.email}`}
                        className="w-14 h-14 bg-black text-white flex items-center justify-center rotate-45 hover:rotate-180 transition-all duration-500"
                    >
                        <Mail className="-rotate-45" />
                    </a>
                </div>
            </nav>

            {/* Mobile Top Nav */}
            <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b-8 border-black bg-white">
                <span className="text-xl font-black uppercase tracking-tight">
                    {personal?.fullName || 'Ad Soyad'}
                </span>
                <div className="flex items-center gap-3">
                    {personal?.linkedin && (
                        <a href={personal.linkedin} className="w-11 h-11 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all" aria-label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    )}
                    {personal?.github && (
                        <a href={personal.github} className="w-11 h-11 border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all" aria-label="GitHub">
                            <Github className="w-5 h-5" />
                        </a>
                    )}
                    {personal?.email && (
                        <a
                            href={`mailto:${personal.email}`}
                            className="w-12 h-12 bg-black text-white flex items-center justify-center rotate-3 hover:-rotate-3 transition-all"
                            aria-label="E-posta"
                        >
                            <Mail />
                        </a>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="lg:ml-24">
                {/* MASSIVE Hero Section */}
                <section className="min-h-screen flex items-center p-10 md:p-20 border-b-8 border-black relative overflow-hidden pt-24 lg:pt-0">
                    {/* Background Number */}
                    <div className="absolute -top-20 -right-20 text-[50vw] font-black opacity-[0.02] select-none pointer-events-none leading-none">
                        01
                    </div>

                    <div className="max-w-7xl w-full relative z-10">
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="space-y-12"
                        >
                            <div className="inline-block px-8 py-3 bg-black text-white font-black uppercase text-sm tracking-widest rotate-[-2deg] shadow-[10px_10px_0_rgba(0,0,0,0.1)]">
                                {personal?.title}
                            </div>

                            <h1 className="text-8xl md:text-[16rem] font-black leading-[0.75] tracking-tighter uppercase">
                                {personal?.fullName?.split(' ')[0]}
                                <br />
                                <span style={{ color: accentColor }} className="italic">
                                    {personal?.fullName?.split(' ').slice(1).join(' ')}
                                </span>
                            </h1>

                            <div className="flex flex-col lg:flex-row gap-12 lg:items-end">
                                <p className="text-2xl md:text-4xl font-black max-w-2xl leading-tight">
                                    {personal?.summary}
                                </p>
                                <a
                                    href="#experience"
                                    className="px-16 py-8 bg-black text-white text-2xl font-black uppercase tracking-widest flex items-center gap-6 hover:bg-transparent hover:text-black border-8 border-black transition-all group shrink-0 shadow-[15px_15px_0_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                                >
                                    Projeleri Gör
                                    <Play className="fill-white group-hover:fill-black w-8 h-8" />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* EXPERIENCE - Brutalist Blocks */}
                {experience?.length > 0 && (
                    <section id="experience" className="border-b-8 border-black">
                        <div className="grid lg:grid-cols-[400px,1fr]">
                            {/* Left - Header */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="p-12 md:p-20 bg-white border-r-8 border-b-8 lg:border-b-0 border-black sticky top-0 lg:h-screen flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none rotate-[-3deg] inline-block bg-black text-white px-6 py-2 mb-10 shadow-[10px_10px_0_rgba(0,0,0,0.1)]">
                                        DENEYİM
                                    </h2>
                                    <p className="text-xl font-bold max-w-sm leading-relaxed">
                                        Durdurulamaz bir ilerleme, her adımda yeni bir başarı ve öğrenme fırsatı.
                                    </p>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="text-8xl font-black opacity-10">
                                        {experience?.length}
                                    </div>
                                    <div className="text-sm font-black uppercase tracking-widest opacity-40">
                                        Pozisyon
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right - Cards */}
                            <div>
                                {experience.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: 100, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1, type: "spring" }}
                                        className={`p-12 md:p-20 hover:bg-black hover:text-white transition-all group relative overflow-hidden border-b-8 border-black ${i % 2 === 0 ? '' : 'bg-gray-50'}`}
                                    >
                                        {/* Giant Background Number */}
                                        <div className="absolute -top-10 -right-10 text-[20rem] font-black opacity-[0.02] group-hover:opacity-10 transition-opacity select-none pointer-events-none leading-none">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        <div className="space-y-10 relative z-10">
                                            {/* Date + Badge */}
                                            <div className="flex items-center gap-6">
                                                <span className="text-xl font-black uppercase bg-black text-white px-6 py-2 group-hover:bg-white group-hover:text-black transition-colors">
                                                    {exp.startDate} — {exp.endDate || 'GÜNÜMÜZ'}
                                                </span>
                                                <div className="h-2 flex-1 bg-black group-hover:bg-white transition-colors max-w-xs" />
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter group-hover:italic transition-all">
                                                {exp.position}
                                            </h3>

                                            {/* Company + Description */}
                                            <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
                                                <div className="text-3xl font-black border-b-8 border-black group-hover:border-white pb-2 transition-colors shrink-0">
                                                    {exp.company}
                                                </div>
                                                <p className="text-xl font-bold opacity-60 leading-tight max-w-xl group-hover:opacity-100 transition-opacity">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* SKILLS - Sticker Style */}
                {skills?.length > 0 && (
                    <section className="py-40 px-10 md:px-20 border-b-8 border-black bg-white overflow-hidden relative">
                        {/* Background */}
                        <div className="absolute inset-0 pointer-events-none select-none">
                            <div className="absolute top-20 left-20 text-[20rem] font-black opacity-[0.02] rotate-[-10deg]">SKILLS</div>
                        </div>

                        <div className="relative z-10">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-20"
                            >
                                <div className="inline-block bg-black text-white px-8 py-3 font-black text-sm uppercase tracking-widest rotate-[-1deg] mb-8">
                                    Teknoloji Cephaneliği
                                </div>
                                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
                                    Uzmanlık <span className="opacity-20 italic">Alanları</span>
                                </h2>
                            </motion.div>

                            {/* Skills Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {skills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{
                                            scale: 1.1,
                                            rotate: i % 2 === 0 ? 8 : -8,
                                            y: -10
                                        }}
                                        className="group cursor-default"
                                    >
                                        <div
                                            className="p-10 border-8 border-black font-black uppercase text-3xl md:text-4xl text-center transition-all shadow-[12px_12px_0_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-2 group-hover:translate-y-2"
                                            style={i % 4 === 0 ? { backgroundColor: accentColor } : { backgroundColor: 'white' }}
                                        >
                                            {skill.name || skill}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* EPIC Brutalist Footer */}
                <footer className="p-12 md:p-40 bg-black text-white relative overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-20 -left-20 text-[40vw] font-black opacity-[0.02] rotate-12 select-none">
                            HİYA
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-16 relative z-10 text-center"
                    >
                        <h2 className="text-7xl md:text-[14rem] font-black uppercase tracking-tighter italic leading-[0.8]">
                            Birlikte<br />
                            Çalışalım.
                        </h2>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="inline-block text-2xl md:text-5xl font-black border-b-[10px] border-white pb-4 hover:bg-white hover:text-black hover:px-12 hover:py-6 transition-all duration-300"
                        >
                            {personal?.email}
                        </a>
                        <div className="flex flex-wrap justify-center gap-12 font-black uppercase tracking-widest text-sm pt-20 opacity-30">
                            <a href={personal?.linkedin} className="hover:line-through hover:opacity-100 transition-all">LinkedIn</a>
                            <a href={personal?.github} className="hover:line-through hover:opacity-100 transition-all">GitHub</a>
                        </div>
                    </motion.div>
                </footer>
            </main>
        </div>
    )
}
