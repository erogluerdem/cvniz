import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Globe, MapPin, Briefcase, GraduationCap, ChevronRight, Download, ArrowRight, Award, Star, Zap, Building, Calendar, Users, TrendingUp } from 'lucide-react'

export default function CorporateWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    const colors = template?.colors || {}
    const styles = template?.styles || {}

    const accentColor = colors.accent || '#2563eb'
    const bgColor = colors.bg || '#ffffff'
    const textColor = colors.text || '#111827'

    const containerStyle = {
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: styles.fontFamily || "'Inter', sans-serif",
    }

    return (
        <div className="min-h-screen relative" style={containerStyle}>
            {/* PREMIUM Professional Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/20">
                            {personal?.fullName?.[0]}
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">{personal?.fullName}</h1>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mt-1">{personal?.title}</p>
                        </div>
                    </div>
                    <nav className="flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-gray-500 w-full max-w-sm lg:max-w-none lg:flex-row lg:items-center lg:gap-10">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-row lg:gap-10">
                            <a href="#about" className="hover:text-blue-600 transition-colors">Profil</a>
                            <a href="#experience" className="hover:text-blue-600 transition-colors">Kariyer</a>
                            <a href="#skills" className="hover:text-blue-600 transition-colors">Uzmanlık</a>
                        </div>
                        <a
                            href={`mailto:${personal?.email}`}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 w-full lg:w-auto"
                        >
                            <Mail className="w-4 h-4" /> İletişim
                        </a>
                    </nav>
                </div>
            </header>

            {/* EPIC Corporate Hero */}
            <section id="about" className="py-32 px-6 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${textColor} 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />

                {/* Decorative Shapes */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/[0.02] skew-x-[-12deg] translate-x-32" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/[0.03] rounded-full blur-[100px] -translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        {/* Left - Content */}
                        <div className="space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <span className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600/10 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                                    <Zap className="w-4 h-4" /> Profesyonel Özet
                                </span>
                                <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight">
                                    Stratejik<br />
                                    Liderlik &<br />
                                    <span className="text-blue-600">Mükemmellik.</span>
                                </h2>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-gray-600 leading-relaxed max-w-xl"
                            >
                                {personal?.summary}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap gap-4"
                            >
                                <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-600 text-sm font-bold">
                                    <MapPin className="w-5 h-5 text-blue-600" /> {personal?.location}
                                </div>
                                {personal?.email && (
                                    <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-lg border border-gray-100 text-gray-600 text-sm font-bold">
                                        <Mail className="w-5 h-5 text-blue-600" /> {personal?.email}
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex gap-4"
                            >
                                <a
                                    href="#experience"
                                    className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                                >
                                    Kariyerime Göz At <ArrowRight className="w-5 h-5" />
                                </a>
                            </motion.div>
                        </div>

                        {/* Right - Stats Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="relative"
                        >
                            <div className="bg-white border border-gray-100 p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 relative overflow-hidden">
                                {/* Corner Accent */}
                                <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-600/30 rotate-12">
                                    <Award className="w-14 h-14 text-white -rotate-12" />
                                </div>

                                <div className="space-y-10 relative z-10">
                                    <div>
                                        <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Yeterlilik Profili</div>
                                        <h3 className="text-3xl font-black text-gray-900">{personal?.fullName}</h3>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { value: experience?.length || 0, label: 'Yıl Deneyim', icon: <Briefcase className="w-5 h-5" /> },
                                            { value: skills?.length || 0, label: 'Uzmanlık', icon: <Star className="w-5 h-5" /> },
                                            { value: education?.length || 0, label: 'Eğitim', icon: <GraduationCap className="w-5 h-5" /> }
                                        ].map((stat, i) => (
                                            <div key={i} className="text-center p-6 bg-slate-50 rounded-2xl">
                                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mx-auto mb-3 text-blue-600">
                                                    {stat.icon}
                                                </div>
                                                <div className="text-3xl font-black text-blue-600">{stat.value}+</div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-sm font-bold text-gray-500">Aktif olarak fırsatları değerlendiriyor</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 px-8 py-4 bg-gray-900 text-white rounded-2xl shadow-xl font-bold text-sm flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-green-400" /> Premium Profil
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DETAILED Career Path */}
            {experience?.length > 0 && (
                <section id="experience" className="py-40 px-6 bg-white">
                    <div className="max-w-5xl mx-auto">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-24 space-y-4"
                        >
                            <span className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600/10 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                                <Building className="w-4 h-4" /> Kariyer Yolu
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight">
                                Profesyonel<br />
                                <span className="text-gray-300">Deneyim</span>
                            </h2>
                        </motion.div>

                        {/* Experience Cards */}
                        <div className="space-y-10">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <div className="bg-white border-2 border-gray-100 p-10 md:p-14 rounded-[2.5rem] shadow-xl shadow-gray-100/50 relative overflow-hidden transition-all hover:shadow-2xl hover:border-blue-600/20">
                                        {/* Large Background Number */}
                                        <div className="absolute -top-10 -right-10 text-[12rem] font-black text-gray-50 select-none pointer-events-none group-hover:text-blue-50 transition-colors">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>

                                        {/* Date Badge */}
                                        <div className="absolute top-0 right-0 px-8 py-3 bg-slate-50 border-bl border-gray-100 rounded-bl-2xl text-xs font-black uppercase tracking-widest text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <Calendar className="w-4 h-4 inline mr-2" />
                                            {exp.startDate} — {exp.endDate || 'GÜNÜMÜZ'}
                                        </div>

                                        <div className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-16">
                                            {/* Icon */}
                                            <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-all">
                                                <Briefcase className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-6">
                                                <div>
                                                    <h3 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none mb-3">
                                                        {exp.position}
                                                    </h3>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-0.5 bg-blue-600" />
                                                        <span className="text-xl font-bold text-blue-600">{exp.company}</span>
                                                    </div>
                                                </div>

                                                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                                                    {exp.description}
                                                </p>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50">
                                                    <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-500">Tam Zamanlı</span>
                                                    <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-500">Üst Düzey</span>
                                                    <span className="px-4 py-1.5 bg-blue-100 rounded-lg text-xs font-bold uppercase tracking-widest text-blue-600">Liderlik</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PREMIUM Skills Section */}
            {skills?.length > 0 && (
                <section id="skills" className="py-40 px-6 bg-slate-900 text-white overflow-hidden relative">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[150px] translate-x-1/2" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-3 gap-20">
                            {/* Left - Header */}
                            <div className="lg:col-span-1 space-y-8">
                                <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 text-white rounded-full text-xs font-black uppercase tracking-widest">
                                    <Star className="w-4 h-4" /> Teknik Kapasite
                                </span>
                                <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                                    Uzmanlık<br />
                                    <span className="text-blue-400">Alanları</span>
                                </h2>
                                <p className="text-lg text-gray-400 leading-relaxed">
                                    Modern araçlar ve metodolojilerle desteklenen, sürekli gelişen yetkinlik seti.
                                </p>
                                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                    <div className="text-5xl font-black text-blue-400">{skills?.length}+</div>
                                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Teknoloji</div>
                                </div>
                            </div>

                            {/* Right - Skills Grid */}
                            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                                {skills.map((skill, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (i % 6) * 0.05 }}
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        className="group cursor-default"
                                    >
                                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-400/30 transition-all relative overflow-hidden">
                                            {/* Glow */}
                                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="relative z-10">
                                                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all mb-6">
                                                    <ChevronRight className="w-6 h-6" />
                                                </div>
                                                <span className="font-bold text-lg leading-tight block">{skill.name || skill}</span>

                                                {/* Progress */}
                                                <div className="mt-4 h-1 rounded-full bg-white/10 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${95 - (i * 2)}%` }}
                                                        transition={{ duration: 1.5, delay: 0.5 }}
                                                        className="h-full rounded-full bg-blue-400"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* PROFESSIONAL Footer */}
            <footer className="py-32 px-6 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col lg:flex-row justify-between items-center gap-12"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-black text-3xl">
                                {personal?.fullName?.[0]}
                            </div>
                            <div className="text-left">
                                <h4 className="font-black text-xl text-gray-900">{personal?.fullName}</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">{personal?.title}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            {personal?.linkedin && (
                                <a href={personal.linkedin} className="flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-blue-600 hover:text-white transition-all">
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </a>
                            )}
                            {personal?.github && (
                                <a href={personal.github} className="flex items-center gap-2 px-6 py-3 bg-slate-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                                    <Github className="w-4 h-4" /> GitHub
                                </a>
                            )}
                            <a
                                href={`mailto:${personal?.email}`}
                                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                            >
                                <Mail className="w-4 h-4" /> Bana Ulaşın
                            </a>
                        </div>
                    </motion.div>

                </div>
            </footer>
        </div>
    )
}
