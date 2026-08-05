import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, GraduationCap } from 'lucide-react';
import { TextInput } from './FormControls';

export default function EducationForm({
    cvData,
    moveEducation,
    removeEducation,
    updateEducation,
    addEducation
}) {
    return (
        <div className="space-y-6">
            {cvData.education.map((edu, index) => (
                <div key={edu.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                        <button
                            onClick={() => moveEducation(index, 'up')}
                            disabled={index === 0}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => moveEducation(index, 'down')}
                            disabled={index === cvData.education.length - 1}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => removeEducation(edu.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mb-6 text-purple-400 font-bold text-[10px] uppercase tracking-widest">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">
                            {index + 1}
                        </div>
                        Eğitim Kaydı
                    </div>

                    <div className="space-y-4">
                        <TextInput
                            label="Okul / Üniversite"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                            placeholder="Stanford University"
                            icon={GraduationCap}
                            section="education"
                        />
                        <TextInput
                            label="Bölüm / Derece"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Computer Science, MSc"
                            section="education"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="Başlangıç"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                placeholder="2016"
                            />
                            <TextInput
                                label="Bitiş"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                placeholder="2020"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={addEducation}
                className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-purple-500/50 hover:text-purple-400 hover:bg-purple-500/5 transition-all group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Yeni Eğitim Ekle
            </button>
        </div>
    );
}
