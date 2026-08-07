import React from 'react';
import { Camera, Lock, User, Briefcase, Link as LinkIcon, Mail, Phone, MapPin, Sparkles, Trash2 } from 'lucide-react';
import { TextInput, TextArea } from './FormControls';
import MagicWandButton from '../MagicWandButton';

export default function PersonalInfoForm({
    cvData,
    updatePersonal,
    isPremium,
    setShowHeadshotModal,
    handlePhotoChange,
    generateAISummary,
    setHighlightedField
}) {
    return (
        <div className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex items-center gap-6 p-6 rounded-3xl border relative overflow-hidden group transition-all duration-500 bg-slate-900/60 backdrop-blur-xl border-white/10 [.editor-theme-editorial_&]:bg-white [.editor-theme-editorial_&]:border-slate-200 [.editor-theme-editorial_&]:shadow-xl">
                {/* Decorative blob */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                
                <div className="relative shrink-0">
                    <div className="relative z-10">
                        {cvData.personal.photo ? (
                            <img src={cvData.personal.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20" />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-dashed transition-colors bg-slate-800 border-white/10 [.editor-theme-editorial_&]:bg-slate-50 [.editor-theme-editorial_&]:border-slate-300">
                                <User className="w-10 h-10 text-slate-500 [.editor-theme-editorial_&]:text-slate-400" />
                            </div>
                        )}
                        {isPremium && (
                            <label className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                                <Camera className="w-5 h-5 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        )}
                    </div>
                </div>
                <div className="flex-1 relative z-10">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-white [.editor-theme-editorial_&]:text-slate-900">
                            Profil Fotoğrafı
                            {!isPremium && <Lock className="w-3.5 h-3.5 text-amber-500" />}
                        </h3>
                        {isPremium && (
                            <button
                                onClick={() => setShowHeadshotModal(true)}
                                className="text-[10px] font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:from-blue-500/30 hover:to-purple-500/30 transition-all [.editor-theme-editorial_&]:bg-purple-50 [.editor-theme-editorial_&]:text-purple-600 [.editor-theme-editorial_&]:border-purple-200"
                            >
                                <Sparkles className="w-3 h-3" />
                                AI Headshot
                            </button>
                        )}
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-slate-400 [.editor-theme-editorial_&]:text-slate-500">
                        {isPremium
                            ? 'Özgeçmişinizi kişiselleştirmek için bir fotoğraf yükleyin veya yapay zeka ile profesyonel bir portre oluşturun.'
                            : 'Fotoğraf özelliği Premium üyeler içindir. Göz alıcı bir profil için yükseltin.'}
                    </p>
                    {!isPremium && (
                        <button
                            onClick={() => document.getElementById('premium-panel-trigger')?.click()}
                            className="mt-4 text-[10px] font-black text-amber-400 uppercase tracking-widest hover:text-amber-300 transition-colors flex items-center gap-1 [.editor-theme-editorial_&]:text-amber-600 [.editor-theme-editorial_&]:hover:text-amber-500"
                        >
                            PREMIUM'A GEÇ <Sparkles className="w-3 h-3" />
                        </button>
                    )}
                </div>
                {cvData.personal.photo && isPremium && (
                    <button
                        onClick={() => updatePersonal('photo', '')}
                        className="absolute top-4 right-4 p-2 rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:scale-110"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            <TextInput
                label="Ad Soyad"
                value={cvData.personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
                placeholder="Örn. Ahmet Yılmaz"
                icon={User}
                section="personal"
                setHighlightedField={setHighlightedField}
            />
            <div className="relative">
                <TextArea
                    label="Özet Giriş"
                    value={cvData.personal.summary}
                    onChange={(e) => updatePersonal('summary', e.target.value)}
                    placeholder="Kariyer hedeflerinizi ve uzmanlıklarınızı kısaca anlatın..."
                    icon={Sparkles}
                    section="personal_summary"
                    setHighlightedField={setHighlightedField}
                />
                <div className="absolute top-0 right-0 flex gap-2">
                    <MagicWandButton
                        text={cvData.personal.summary}
                        onImprove={(newText) => updatePersonal('summary', newText)}
                        className="bg-white/5"
                    />
                    <button
                        onClick={generateAISummary}
                        className="py-1.5 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center gap-2 [.editor-theme-editorial_&]:bg-cyan-50 [.editor-theme-editorial_&]:border-cyan-200 [.editor-theme-editorial_&]:text-cyan-600 [.editor-theme-editorial_&]:hover:bg-cyan-100 shadow-sm"
                    >
                        <Sparkles className="w-3 h-3" /> AI İLE YAZ
                    </button>
                </div>
            </div>
            <TextInput
                label="Ünvan"
                value={cvData.personal.title}
                onChange={(e) => updatePersonal('title', e.target.value)}
                placeholder="Örn. Senior Software Engineer"
                icon={Briefcase}
                section="personal"
                setHighlightedField={setHighlightedField}
            />
            <div className="grid grid-cols-2 gap-4">
                <TextInput
                    label="E-posta"
                    type="email"
                    value={cvData.personal.email}
                    onChange={(e) => updatePersonal('email', e.target.value)}
                    placeholder="mail@ornek.com"
                    icon={Mail}
                    section="personal"
                    setHighlightedField={setHighlightedField}
                />
                <TextInput
                    label="Telefon"
                    value={cvData.personal.phone}
                    onChange={(e) => updatePersonal('phone', e.target.value)}
                    placeholder="+90 5XX"
                    icon={Phone}
                    section="personal"
                    setHighlightedField={setHighlightedField}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <TextInput
                    label="Konum"
                    value={cvData.personal.location}
                    onChange={(e) => updatePersonal('location', e.target.value)}
                    placeholder="İstanbul, TR"
                    icon={MapPin}
                    section="personal"
                    setHighlightedField={setHighlightedField}
                />
                <TextInput
                    label="LinkedIn"
                    value={cvData.personal.linkedin}
                    onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/..."
                    icon={LinkIcon}
                    section="personal"
                    setHighlightedField={setHighlightedField}
                />
            </div>
        </div>
    );
}
