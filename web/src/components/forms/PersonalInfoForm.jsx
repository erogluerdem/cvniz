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
            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden group">
                <div className="relative shrink-0">
                    {cvData.personal.photo ? (
                        <img src={cvData.personal.photo} alt="Profile" className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/50" />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-slate-800 flex items-center justify-center border-2 border-dashed border-white/10">
                            <User className="w-10 h-10 text-slate-600" />
                        </div>
                    )}
                    {isPremium && (
                        <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 rounded-xl flex items-center justify-center cursor-pointer hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                            <Camera className="w-4 h-4 text-slate-950" />
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                        </label>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            Profil Fotoğrafı
                            {!isPremium && <Lock className="w-3 h-3 text-amber-500" />}
                        </h3>
                        {isPremium && (
                            <button
                                onClick={() => setShowHeadshotModal(true)}
                                className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                            >
                                <Sparkles className="w-3 h-3" />
                                AI Headshot
                            </button>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                        {isPremium
                            ? 'Özgeçmişinizi kişiselleştirmek için bir fotoğraf yükleyin veya yapay zeka ile profesyonel bir portre oluşturun.'
                            : 'Fotoğraf özelliği Premium üyeler içindir.'}
                    </p>
                    {!isPremium && (
                        <button
                            onClick={() => document.getElementById('premium-panel-trigger')?.click()}
                            className="mt-3 text-[9px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors"
                        >
                            PREMIUM'A GEÇ
                        </button>
                    )}
                </div>
                {cvData.personal.photo && isPremium && (
                    <button
                        onClick={() => updatePersonal('photo', '')}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                    >
                        <Trash2 className="w-3 h-3" />
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
                        className="py-1 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center gap-2"
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
