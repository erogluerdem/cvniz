import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Plus, Sparkles } from 'lucide-react';
import { TextInput, TextArea } from './FormControls';
import MagicWandButton from '../MagicWandButton';

export default function ExperienceForm({
    cvData,
    moveExperience,
    removeExperience,
    updateExperience,
    generateAIExperience,
    addExperience
}) {
    return (
        <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
                <div key={exp.id} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl relative group/item hover:bg-white/[0.04] transition-all">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                        <button
                            onClick={() => moveExperience(index, 'up')}
                            disabled={index === 0}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => moveExperience(index, 'down')}
                            disabled={index === cvData.experience.length - 1}
                            className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => removeExperience(exp.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 mb-6 text-cyan-400 font-bold text-[10px] uppercase tracking-widest">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px]">
                            {index + 1}
                        </div>
                        Deneyim Kaydı
                    </div>

                    <div className="space-y-4">
                        <TextInput
                            label="Şirket"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Google"
                        />
                        <TextInput
                            label="Pozisyon"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                            placeholder="Senior Developer"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput
                                label="Başlangıç"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                placeholder="Ocak 2020"
                            />
                            <TextInput
                                label="Bitiş"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                placeholder="Günümüz"
                            />
                        </div>
                        <div className="relative">
                            <TextArea
                                label="Açıklama / Başarılar"
                                value={exp.description}
                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                placeholder="Sorumluluklarınız ve elde ettiğiniz başarılar..."
                                section="experience"
                            />
                            <div className="absolute top-0 right-0 flex gap-2">
                                <MagicWandButton
                                    text={exp.description}
                                    onImprove={(newText) => updateExperience(exp.id, 'description', newText)}
                                    className="bg-white/5"
                                />
                                <button
                                    onClick={() => generateAIExperience(exp.id, exp.company, exp.position)}
                                    className="py-1 px-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all flex items-center gap-2"
                                >
                                    <Sparkles className="w-3 h-3" /> AI ÖNERİSİ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={addExperience}
                className="w-full py-4 rounded-2xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center gap-3 text-sm font-bold text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all group"
            >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                Yeni Deneyim Ekle
            </button>
        </div>
    );
}
