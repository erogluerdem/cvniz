import { useState } from 'react'
import { User, Briefcase, GraduationCap, Wrench, Plus, Trash2, Languages } from 'lucide-react'

const tabs = [
    { id: 'personal', label: 'Kişisel', icon: <User className="w-4 h-4" /> },
    { id: 'experience', label: 'Deneyim', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'education', label: 'Eğitim', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', label: 'Yetenekler', icon: <Wrench className="w-4 h-4" /> }
]

export default function CVForm({ cvData, setCvData }) {
    const [activeTab, setActiveTab] = useState('personal')
    const [newSkill, setNewSkill] = useState('')

    const updatePersonal = (field, value) => {
        setCvData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }))
    }

    const addExperience = () => {
        setCvData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: Date.now(),
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: ''
            }]
        }))
    }

    const updateExperience = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        }))
    }

    const removeExperience = (id) => {
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }))
    }

    const addEducation = () => {
        setCvData(prev => ({
            ...prev,
            education: [...prev.education, {
                id: Date.now(),
                school: '',
                degree: '',
                startDate: '',
                endDate: '',
                description: ''
            }]
        }))
    }

    const updateEducation = (id, field, value) => {
        setCvData(prev => ({
            ...prev,
            education: prev.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        }))
    }

    const removeEducation = (id) => {
        setCvData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }))
    }

    const addSkill = () => {
        if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
            setCvData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }))
            setNewSkill('')
        }
    }

    const removeSkill = (skillToRemove) => {
        setCvData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }))
    }

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab-button flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'active' : ''
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Personal Tab */}
            {activeTab === 'personal' && (
                <div className="space-y-4 fade-in">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Ad Soyad</label>
                            <input
                                type="text"
                                value={cvData.personal.fullName}
                                onChange={(e) => updatePersonal('fullName', e.target.value)}
                                className="input-field"
                                placeholder="Ahmet Yılmaz"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Ünvan / Pozisyon</label>
                            <input
                                type="text"
                                value={cvData.personal.title}
                                onChange={(e) => updatePersonal('title', e.target.value)}
                                className="input-field"
                                placeholder="Senior Frontend Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">E-posta</label>
                            <input
                                type="email"
                                value={cvData.personal.email}
                                onChange={(e) => updatePersonal('email', e.target.value)}
                                className="input-field"
                                placeholder="email@ornek.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Telefon</label>
                            <input
                                type="tel"
                                value={cvData.personal.phone}
                                onChange={(e) => updatePersonal('phone', e.target.value)}
                                className="input-field"
                                placeholder="+90 5XX XXX XX XX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Konum</label>
                            <input
                                type="text"
                                value={cvData.personal.location}
                                onChange={(e) => updatePersonal('location', e.target.value)}
                                className="input-field"
                                placeholder="İstanbul, Türkiye"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">LinkedIn</label>
                            <input
                                type="text"
                                value={cvData.personal.linkedin}
                                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                                className="input-field"
                                placeholder="linkedin.com/in/kullanici"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Website / Portfolio</label>
                            <input
                                type="text"
                                value={cvData.personal.website}
                                onChange={(e) => updatePersonal('website', e.target.value)}
                                className="input-field"
                                placeholder="website.com"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Özet</label>
                            <textarea
                                value={cvData.personal.summary}
                                onChange={(e) => updatePersonal('summary', e.target.value)}
                                className="input-field min-h-[120px] resize-none"
                                placeholder="Kendinizi kısaca tanıtın..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
                <div className="space-y-4 fade-in">
                    {cvData.experience.map((exp, index) => (
                        <div key={exp.id} className="glass rounded-xl p-4 relative">
                            <button
                                onClick={() => removeExperience(exp.id)}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="text-sm text-gray-400 mb-3">Deneyim {index + 1}</div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        className="input-field"
                                        placeholder="Şirket Adı"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="text"
                                        value={exp.position}
                                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                        className="input-field"
                                        placeholder="Pozisyon"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                        className="input-field"
                                        placeholder="Başlangıç (2020-01)"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={exp.endDate}
                                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                        className="input-field"
                                        placeholder="Bitiş (Günümüz)"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                        className="input-field min-h-[80px] resize-none"
                                        placeholder="• Başarılarınızı ve sorumluluklarınızı yazın..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addExperience}
                        className="w-full py-3 rounded-xl border border-dashed border-white/30 text-gray-400 hover:border-cyan-500 hover:text-cyan-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Deneyim Ekle
                    </button>
                </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
                <div className="space-y-4 fade-in">
                    {cvData.education.map((edu, index) => (
                        <div key={edu.id} className="glass rounded-xl p-4 relative">
                            <button
                                onClick={() => removeEducation(edu.id)}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="text-sm text-gray-400 mb-3">Eğitim {index + 1}</div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <input
                                        type="text"
                                        value={edu.school}
                                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                        className="input-field"
                                        placeholder="Okul / Üniversite Adı"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                        className="input-field"
                                        placeholder="Bölüm / Derece"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={edu.startDate}
                                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                        className="input-field"
                                        placeholder="Başlangıç (2016)"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={edu.endDate}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                        className="input-field"
                                        placeholder="Bitiş (2020)"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <textarea
                                        value={edu.description}
                                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                        className="input-field min-h-[60px] resize-none"
                                        placeholder="GPA, başarılar, aktiviteler..."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addEducation}
                        className="w-full py-3 rounded-xl border border-dashed border-white/30 text-gray-400 hover:border-cyan-500 hover:text-cyan-500 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Eğitim Ekle
                    </button>
                </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
                <div className="space-y-4 fade-in">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Yetenekler</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                className="input-field flex-1"
                                placeholder="Yetenek ekle (Enter'a bas)"
                            />
                            <button
                                onClick={addSkill}
                                className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {cvData.skills.map((skill, index) => (
                            <div
                                key={index}
                                className="group flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-red-500/20 transition-colors cursor-pointer"
                                onClick={() => removeSkill(skill)}
                            >
                                <span>{skill}</span>
                                <Trash2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-red-400 transition-opacity" />
                            </div>
                        ))}
                    </div>

                    {cvData.skills.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Henüz yetenek eklenmedi
                        </div>
                    )}

                    {/* Languages Section */}
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Languages className="w-5 h-5 text-cyan-500" />
                            <h3 className="font-semibold">Dil Becerileri</h3>
                        </div>

                        <div className="space-y-2">
                            {cvData.languages?.map((lang, index) => (
                                <div key={index} className="flex items-center justify-between glass rounded-lg p-3">
                                    <span>{lang.name}</span>
                                    <span className="text-sm text-gray-400">{lang.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
