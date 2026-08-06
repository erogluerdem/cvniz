import { Mail, Phone, MapPin, GraduationCap, BookOpen, Users, Award, Heart, Star } from 'lucide-react'

export default function TeacherTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div id="cv-template-wrapper" className="min-h-full bg-gradient-to-br from-amber-50 to-orange-50 print-exact mx-auto print:mx-0" style={{ fontFamily: "'Inter', Georgia, serif" }}>
            {/* Warm Header with Book Design */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800" />

                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-10 w-40 h-40 border-4 border-white rounded-full" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/20 rounded-tr-full" />
                </div>

                <div className="relative px-10 py-10">
                    <div className="flex items-center gap-8">
                        {/* Avatar with book-style frame */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-xl shadow-amber-900/30">
                                <GraduationCap className="w-14 h-14 text-amber-800" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <Heart className="w-5 h-5 text-red-500" />
                            </div>
                        </div>

                        <div className="flex-1 text-white">
                            <h1 className="text-4xl font-bold mb-2">{personal.fullName || 'Ad Soyad'}</h1>
                            <p className="text-xl text-amber-200 font-medium mb-4">{personal.title || 'Öğretmen'}</p>

                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-3">
                                {personal.email && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm border border-white/20">
                                        <Mail className="w-4 h-4 text-amber-300" /> {personal.email}
                                    </span>
                                )}
                                {personal.phone && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm border border-white/20">
                                        <Phone className="w-4 h-4 text-amber-300" /> {personal.phone}
                                    </span>
                                )}
                                {personal.location && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm border border-white/20">
                                        <MapPin className="w-4 h-4 text-amber-300" /> {personal.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="bg-white shadow-lg -mt-4 mx-10 rounded-2xl p-6 grid grid-cols-4 gap-4 text-center relative z-10">
                <div>
                    <div className="text-3xl font-bold text-amber-600">10+</div>
                    <div className="text-sm text-gray-500">Yıl Deneyim</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-orange-600">500+</div>
                    <div className="text-sm text-gray-500">Öğrenci</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-amber-600">50+</div>
                    <div className="text-sm text-gray-500">Proje</div>
                </div>
                <div>
                    <div className="text-3xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-gray-500">Özveri</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8 pt-6 grid grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                    {/* Teaching Philosophy */}
                    {personal.summary && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-amber-100/50 border-l-4 border-amber-500 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Öğretmenlik Felsefem</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-[52px] italic">
                                "{personal.summary}"
                            </p>
                        </section>
                    )}

                    {/* Teaching Experience */}
                    {experience.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-amber-100/50 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Öğretmenlik Deneyimi</h2>
                            </div>
                            <div className="space-y-5 pl-[52px]">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-amber-500/30 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 ring-4 ring-white" />
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{exp.position || 'Öğretmen'}</h3>
                                                <p className="text-amber-600 font-medium">{exp.company || 'Okul'}</p>
                                            </div>
                                            <span className="text-xs text-white bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 rounded-full font-medium">
                                                {exp.startDate} - {exp.endDate}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="text-gray-600 text-sm mt-3 leading-relaxed whitespace-pre-line">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-amber-100/50 break-inside-avoid page-break-inside-avoid">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-800">Eğitim</h2>
                            </div>
                            <div className="space-y-4 pl-[52px]">
                                {education.map((edu) => (
                                    <div key={edu.id} className="relative pl-6 border-l-2 border-emerald-500/30 break-inside-avoid page-break-inside-avoid">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 ring-4 ring-white" />
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{edu.school || 'Üniversite'}</h3>
                                                <p className="text-emerald-600 font-medium">{edu.degree || 'Bölüm'}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                                                {edu.startDate} - {edu.endDate}
                                            </span>
                                        </div>
                                        {edu.description && (
                                            <p className="text-gray-600 text-sm mt-2">{edu.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Expertise Areas */}
                    {skills.length > 0 && (
                        <div className="bg-gradient-to-br from-amber-700 to-orange-700 text-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-5">
                                <Award className="w-6 h-6 text-amber-200" />
                                <h2 className="font-bold text-lg">Uzmanlık Alanları</h2>
                            </div>
                            <div className="space-y-3">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm break-inside-avoid page-break-inside-avoid">
                                        <Star className="w-4 h-4 text-amber-300" />
                                        <span className="text-amber-100">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Teaching Approach */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-amber-100/50">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-amber-600" />
                            Öğretim Yaklaşımı
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <span className="text-amber-600">🎯</span>
                                </div>
                                <span className="text-sm text-gray-700">Öğrenci odaklı</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <span className="text-orange-600">💡</span>
                                </div>
                                <span className="text-sm text-gray-700">Yaratıcı yöntemler</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <span className="text-amber-600">🤝</span>
                                </div>
                                <span className="text-sm text-gray-700">Bireysel destek</span>
                            </div>
                        </div>
                    </div>

                    {/* Languages */}
                    {languages?.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-amber-100/50">
                            <h2 className="font-bold text-gray-800 mb-4">Diller</h2>
                            <div className="space-y-3">
                                {languages.map((lang, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 font-medium">{lang.name}</span>
                                            <span className="text-amber-600">{lang.level}</span>
                                        </div>
                                        <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                                style={{
                                                    width: lang.level?.includes('Ana') ? '100%' :
                                                        lang.level?.includes('İleri') ? '85%' :
                                                            lang.level?.includes('Orta') ? '60%' : '40%'
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
