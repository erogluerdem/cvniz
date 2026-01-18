import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Github, Linkedin, Globe, Send, User, Bot, Sparkles, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'

export default function ChatGPTWebTemplate({ cv, template }) {
    const data = cv?.data || cv || {}
    const personal = data.personal || data.personalInfo || {}
    const experience = data.experience || []
    const education = data.education || []
    const skills = data.skills || []

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#343541]" style={{ fontFamily: "'Söhne', 'Helvetica Neue', sans-serif", color: '#ececf1' }}>

            {/* SIDEBAR */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#202123] p-4 hidden lg:flex flex-col z-50">
                <button className="w-full py-3 border border-white/20 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all mb-4">
                    <Sparkles className="w-4 h-4" /> Yeni Sohbet
                </button>

                <div className="flex-1 overflow-auto">
                    <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Bugün</div>
                    <div className="space-y-1">
                        <div className="p-3 rounded-lg bg-white/10 text-sm truncate">
                            {personal.fullName} - CV Görüntüleme
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10a37f] to-[#1a7f64] flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">Ziyaretçi</span>
                    </div>
                </div>
            </aside>

            {/* MAIN CHAT AREA */}
            <div className="lg:ml-64 min-h-screen flex flex-col">
                {/* CHAT MESSAGES */}
                <div className="flex-1 overflow-auto pb-32">
                    {/* Welcome Message */}
                    <div className="bg-[#444654] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose prose-invert max-w-none"
                                >
                                    <p className="text-base leading-relaxed">
                                        Merhaba! 👋 Ben <strong>{personal.fullName}</strong>'ın yapay zeka destekli CV asistanıyım.
                                        Size <strong>{personal.title}</strong> olarak çalışan {personal.fullName} hakkında bilgi verebilirim.
                                    </p>
                                    <p className="text-sm text-white/70 mt-4 italic">
                                        "{personal.summary}"
                                    </p>
                                </motion.div>

                                <div className="flex items-center gap-2 mt-4 text-white/40">
                                    <button className="p-1 hover:text-white/80 transition-colors"><Copy className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white/80 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white/80 transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Question - Experience */}
                    <div className="bg-[#343541] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-base">İş deneyimlerini anlatır mısın?</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Response - Experience */}
                    <div className="bg-[#444654] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="prose prose-invert max-w-none"
                                >
                                    <p className="text-base leading-relaxed mb-4">
                                        Tabii! {personal.fullName}'ın profesyonel deneyimleri şöyle:
                                    </p>

                                    <div className="space-y-6">
                                        {experience.map((exp, i) => (
                                            <div key={i} className="border-l-2 border-[#10a37f] pl-4">
                                                <h4 className="text-[#10a37f] font-semibold text-lg mb-1">{exp.position}</h4>
                                                <p className="text-sm text-white/60 mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                                                <p className="text-sm text-white/80">{exp.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <div className="flex items-center gap-2 mt-4 text-white/40">
                                    <button className="p-1 hover:text-white/80 transition-colors"><Copy className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white/80 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white/80 transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white/80 transition-colors"><RotateCcw className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Question - Skills */}
                    <div className="bg-[#343541] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-base">Hangi becerilere sahip?</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Response - Skills */}
                    <div className="bg-[#444654] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="prose prose-invert max-w-none"
                                >
                                    <p className="text-base leading-relaxed mb-4">
                                        {personal.fullName} aşağıdaki becerilere sahip:
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-[#10a37f]/20 text-[#10a37f] rounded-full text-sm border border-[#10a37f]/30">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>

                                <div className="flex items-center gap-2 mt-4 text-white/40">
                                    <button className="p-1 hover:text-white/80 transition-colors"><Copy className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white/80 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                                    <button className="p-1 hover:text-white/80 transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Question - Education */}
                    <div className="bg-[#343541] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-base">Eğitim geçmişi ne?</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Response - Education */}
                    <div className="bg-[#444654] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="prose prose-invert max-w-none"
                                >
                                    <p className="text-base leading-relaxed mb-4">
                                        Eğitim geçmişi:
                                    </p>

                                    <div className="space-y-4">
                                        {education.map((edu, i) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <GraduationCap className="w-5 h-5 text-[#10a37f] mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-white">{edu.school}</h4>
                                                    <p className="text-sm text-[#10a37f]">{edu.degree}</p>
                                                    <p className="text-xs text-white/50">{edu.startDate} - {edu.endDate}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-[#343541] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#5436DA] flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-base">Kendisiyle nasıl iletişime geçebilirim?</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#444654] py-8">
                        <div className="max-w-3xl mx-auto px-4 flex gap-6">
                            <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center flex-shrink-0">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="prose prose-invert max-w-none"
                                >
                                    <p className="text-base leading-relaxed mb-4">
                                        {personal.fullName} ile iletişime geçmek için:
                                    </p>

                                    <div className="space-y-3">
                                        {personal.email && (
                                            <a href={`mailto:${personal.email}`} className="flex items-center gap-3 text-[#10a37f] hover:underline">
                                                <Mail className="w-4 h-4" /> {personal.email}
                                            </a>
                                        )}
                                        {personal.phone && (
                                            <div className="flex items-center gap-3 text-white/80">
                                                <Phone className="w-4 h-4 text-[#10a37f]" /> {personal.phone}
                                            </div>
                                        )}
                                        {personal.location && (
                                            <div className="flex items-center gap-3 text-white/80">
                                                <MapPin className="w-4 h-4 text-[#10a37f]" /> {personal.location}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        {[Github, Linkedin, Globe].map((Icon, i) => (
                                            <a key={i} href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                                <Icon className="w-5 h-5 text-white/60" />
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* INPUT BAR */}
                <div className="fixed bottom-0 lg:left-64 left-0 right-0 bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-8 pb-6 px-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Bir soru sorun..."
                                className="w-full bg-[#40414f] border border-white/10 rounded-xl py-4 px-5 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white/80 transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-white/30 text-center mt-3">
                            Bu CV, {personal.fullName} tarafından ChatGPT tarzında tasarlanmıştır.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
