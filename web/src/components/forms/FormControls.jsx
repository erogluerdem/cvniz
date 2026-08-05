import React from 'react';

export const InputLabel = ({ label, icon: Icon }) => (
    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
        {Icon && <Icon className="w-3 h-3 text-cyan-500/50" />}
        {label}
    </label>
);

export const TextInput = ({ label, icon, section, setHighlightedField, ...props }) => (
    <div className="group">
        <InputLabel label={label} icon={icon} />
        <input
            {...props}
            onFocus={() => setHighlightedField && setHighlightedField(section || label)}
            onBlur={() => setHighlightedField && setHighlightedField(null)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 transition-all group-hover:border-white/20"
        />
    </div>
);

export const TextArea = ({ label, icon, section, setHighlightedField, ...props }) => (
    <div className="group">
        <InputLabel label={label} icon={icon} />
        <textarea
            {...props}
            onFocus={() => setHighlightedField && setHighlightedField(section || label)}
            onBlur={() => setHighlightedField && setHighlightedField(null)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 transition-all group-hover:border-white/20 resize-none min-h-[120px]"
        />
    </div>
);
