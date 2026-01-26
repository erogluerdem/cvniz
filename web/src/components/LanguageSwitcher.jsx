import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-lg">
            <button
                onClick={() => changeLanguage('tr')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${i18n.language === 'tr'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-500 hover:text-white'
                    }`}
            >
                TR
            </button>
            <div className="w-px h-3 bg-white/10" />
            <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs font-bold rounded transition-all ${i18n.language === 'en'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-500 hover:text-white'
                    }`}
            >
                EN
            </button>
        </div>
    );
}
