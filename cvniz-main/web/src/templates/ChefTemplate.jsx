import { Mail, Phone, MapPin, ChefHat, Utensils, Award, Star, Flame, BookOpen } from 'lucide-react'

export default function ChefTemplate({ data }) {
    const { personal, experience, education, skills, languages } = data

    return (
        <div className="min-h-full bg-stone-50" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {/* Elegant Culinary Header */}
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-amber-900" />

                {/* Decorative pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
                        backgroundSize: '30px 30px'
                    }}
                />

                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />

                <div className="relative px-10 py-10">
                    <div className="flex items-center gap-8">
                        {/* Chef Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-xl border-4 border-white/20">
                                <ChefHat className="w-14 h-14 text-red-800" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 text-white">
                            <h1 className="text-4xl font-bold mb-2 tracking-tight">{personal.fullName || 'Ad Soyad'}</h1>
                            <p className="text-xl text-amber-200 italic mb-4">{personal.title || 'Executive Chef'}</p>

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

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 text-white text-center">
                            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                <div className="text-2xl font-bold text-amber-300">15+</div>
                                <div className="text-xs text-red-100">Yıl Deneyim</div>
                            </div>
                            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                <div className="text-2xl font-bold text-amber-300">⭐⭐⭐</div>
                                <div className="text-xs text-red-100">Michelin</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="p-8 grid grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="col-span-2 space-y-6">
                    {/* Culinary Philosophy */}
                    {personal.summary && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-red-100/50 border-l-4 border-red-800">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
                                    <Flame className="w-5 h-5 text-amber-300" />
                                </div>
                                <h2 className="text-lg font-bold text-red-900 italic">Mutfak Felsefem</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-[52px] italic">
                                "{personal.summary}"
                            </p>
                        </section>
                    )}

                    {/* Professional Experience */}
                    {experience.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-red-100/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
                                    <Utensils className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-red-900">Profesyonel Deneyim</h2>
                            </div>
                            <div className="space-y-5 pl-[52px]">
                                {experience.map((exp) => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-red-300">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-red-700 to-red-900 ring-4 ring-white" />
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{exp.position || 'Şef'}</h3>
                                                <p className="text-red-700 italic">{exp.company || 'Restoran'}</p>
                                            </div>
                                            <span className="text-xs text-white bg-gradient-to-r from-red-700 to-red-900 px-3 py-1.5 rounded-full font-medium">
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

                    {/* Education & Certifications */}
                    {education.length > 0 && (
                        <section className="bg-white rounded-2xl p-6 shadow-lg shadow-red-100/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-red-900">Eğitim & Sertifikalar</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pl-[52px]">
                                {education.map((edu) => (
                                    <div key={edu.id} className="p-4 bg-gradient-to-br from-red-50 to-amber-50 rounded-xl border border-red-100">
                                        <h3 className="font-bold text-gray-800">{edu.school || 'Okul'}</h3>
                                        <p className="text-red-700 text-sm italic">{edu.degree || 'Program'}</p>
                                        <p className="text-gray-500 text-xs mt-1">{edu.startDate} - {edu.endDate}</p>
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
                        <div className="bg-gradient-to-br from-red-900 to-red-800 text-white rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-3 mb-5">
                                <Award className="w-6 h-6 text-amber-300" />
                                <h2 className="font-bold text-lg italic">Uzmanlık Alanları</h2>
                            </div>
                            <div className="space-y-3">
                                {skills.map((skill, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm">
                                        <Star className="w-4 h-4 text-amber-300" />
                                        <span className="text-red-100">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Signature Dishes (Decorative) */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-100/50">
                        <h2 className="font-bold text-red-900 mb-4 italic">İmza Yemekler</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-amber-50 rounded-xl">
                                <span className="text-2xl">🍽️</span>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Truffle Risotto</div>
                                    <div className="text-xs text-gray-500">İtalyan Mutfağı</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-red-50 rounded-xl">
                                <span className="text-2xl">🥩</span>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Beef Wellington</div>
                                    <div className="text-xs text-gray-500">Fransız Mutfağı</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Languages */}
                    {languages?.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-red-100/50">
                            <h2 className="font-bold text-red-900 mb-4">Diller</h2>
                            <div className="space-y-3">
                                {languages.map((lang, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 font-medium">{lang.name}</span>
                                            <span className="text-red-700">{lang.level}</span>
                                        </div>
                                        <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-red-700 to-amber-600 rounded-full"
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
