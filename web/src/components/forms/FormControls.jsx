import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const ATSTips = {
    "Profesyonel Özet": "İpucu: Sektördeki deneyiminizi ve en güçlü 2-3 yeteneğinizi ilk cümlede vurgulayın. İlk 3 saniye çok önemlidir.",
    "Açıklama": "İpucu: Sadece ne yaptığınızı değil, nasıl bir etki yarattığınızı yazın (Örn: 'Satışları %30 artırdım'). Rakamlar ATS skorunu uçurur.",
    "Pozisyon": "İpucu: Başlığınızda endüstri standartlarını (Örn. 'Frontend Developer') kullanın. Tuhaf isimler ATS'den geçemez.",
    "Yetenekler": "İpucu: İş ilanlarındaki anahtar kelimeleri (keywords) birebir kopyalayıp yeteneklerinize ekleyin."
};

const SmartTooltip = ({ label, isFocused }) => {
    const tip = ATSTips[label];
    if (!tip) return null;

    return (
        <AnimatePresence>
            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute z-50 -top-10 right-0 max-w-xs pointer-events-none"
                >
                    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 text-cyan-50 p-3 rounded-2xl shadow-xl shadow-cyan-500/10 flex gap-3 items-start text-xs leading-relaxed">
                        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <p>{tip}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const InputLabel = ({ label, icon: Icon }) => (
    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2 [.editor-theme-editorial_&]:text-slate-500">
        {Icon && <Icon className="w-3.5 h-3.5 text-cyan-500/50 [.editor-theme-editorial_&]:text-cyan-600/60" />}
        {label}
    </label>
);

export const TextInput = ({ label, icon, section, setHighlightedField, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="group relative">
            <InputLabel label={label} icon={icon} />
            <SmartTooltip label={label} isFocused={isFocused} />
            <input
                {...props}
                onFocus={() => {
                    setIsFocused(true);
                    if (setHighlightedField) setHighlightedField(section || label);
                }}
                onBlur={() => {
                    setIsFocused(false);
                    if (setHighlightedField) setHighlightedField(null);
                }}
                className="w-full rounded-2xl px-4 py-3.5 text-sm transition-all focus:outline-none focus:ring-4
                bg-slate-900/40 border border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-cyan-500/10 hover:border-white/20 hover:bg-slate-900/60 shadow-inner
                [.editor-theme-editorial_&]:bg-slate-50 [.editor-theme-editorial_&]:border-slate-200 [.editor-theme-editorial_&]:text-slate-900 [.editor-theme-editorial_&]:placeholder:text-slate-400 [.editor-theme-editorial_&]:focus:border-cyan-400 [.editor-theme-editorial_&]:focus:ring-cyan-400/20 [.editor-theme-editorial_&]:hover:border-slate-300 [.editor-theme-editorial_&]:hover:bg-white [.editor-theme-editorial_&]:shadow-sm"
            />
        </div>
    );
};

export const TextArea = ({ label, icon, section, setHighlightedField, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="group relative">
            <InputLabel label={label} icon={icon} />
            <SmartTooltip label={label} isFocused={isFocused} />
            <textarea
                {...props}
                onFocus={() => {
                    setIsFocused(true);
                    if (setHighlightedField) setHighlightedField(section || label);
                }}
                onBlur={() => {
                    setIsFocused(false);
                    if (setHighlightedField) setHighlightedField(null);
                }}
                className="w-full rounded-2xl px-4 py-4 text-sm resize-none min-h-[140px] transition-all focus:outline-none focus:ring-4
                bg-slate-900/40 border border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-cyan-500/10 hover:border-white/20 hover:bg-slate-900/60 shadow-inner
                [.editor-theme-editorial_&]:bg-slate-50 [.editor-theme-editorial_&]:border-slate-200 [.editor-theme-editorial_&]:text-slate-900 [.editor-theme-editorial_&]:placeholder:text-slate-400 [.editor-theme-editorial_&]:focus:border-cyan-400 [.editor-theme-editorial_&]:focus:ring-cyan-400/20 [.editor-theme-editorial_&]:hover:border-slate-300 [.editor-theme-editorial_&]:hover:bg-white [.editor-theme-editorial_&]:shadow-sm"
            />
        </div>
    );
};

