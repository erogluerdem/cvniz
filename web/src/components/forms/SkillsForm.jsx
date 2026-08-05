import React from 'react';
import { Wrench, Sparkles, Plus, Trash2 } from 'lucide-react';
import { InputLabel } from './FormControls';

export default function SkillsForm({
    cvData,
    newSkill,
    setNewSkill,
    addSkill,
    removeSkill,
    suggestSkills
}) {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <InputLabel label="Beceri Ekle" icon={Wrench} />
                    <button
                        onClick={suggestSkills}
                        className="mb-2 text-[9px] font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest bg-purple-500/5 px-2 py-1 rounded border border-purple-500/10 flex items-center gap-1"
                    >
                        <Sparkles className="w-2.5 h-2.5" /> ÖNERİ AL
                    </button>
                </div>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-600"
                        placeholder="Örn. React.js, Python, Leadership"
                    />
                    <button
                        onClick={addSkill}
                        className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                    >
                        <Plus className="w-5 h-5 inline mr-1" /> EKLE
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {cvData.skills.map((skill, index) => (
                    <div
                        key={index}
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all cursor-pointer"
                        onClick={() => removeSkill(skill)}
                    >
                        <span className="text-sm font-medium text-slate-300 group-hover:text-red-400 transition-colors">{skill}</span>
                        <Trash2 className="w-3 h-3 text-slate-600 group-hover:text-red-400 transition-colors" />
                    </div>
                ))}
            </div>

            {cvData.skills.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.01]">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                        <Wrench className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Henüz beceri eklenmedi</p>
                </div>
            )}
        </div>
    );
}
