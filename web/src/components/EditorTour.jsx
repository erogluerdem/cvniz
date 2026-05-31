import React, { useEffect, useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Check, ChevronRight, X, Sparkles } from 'lucide-react';

// Custom Tooltip for Joyride to match the platform's premium dark UI
const CustomTooltip = ({
    continuous,
    index,
    step,
    size,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-w-sm"
            {...tooltipProps}
        >
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 flex items-center justify-between">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    CVniz Rehberi
                </h3>
                <button
                    {...closeProps}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            
            <div className="p-5">
                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                    {step.content}
                </p>
            </div>

            <div className="p-4 bg-black/20 flex items-center justify-between border-t border-white/5">
                <span className="text-xs font-bold text-slate-500">
                    Adım {index + 1} / {size}
                </span>
                <div className="flex gap-2">
                    {index > 0 && (
                        <button
                            {...backProps}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Geri
                        </button>
                    )}
                    <button
                        {...primaryProps}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold text-xs flex items-center gap-1 transition-all shadow-lg shadow-cyan-500/20"
                    >
                        {isLastStep ? 'Bitir' : 'İleri'}
                        {isLastStep ? <Check className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default function EditorTour() {
    const [run, setRun] = useState(false);
    const { user } = useAuth();
    
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        const tourCompleted = localStorage.getItem('CVniz_editor_tour_completed');
        if (!tourCompleted) {
            // Give enough time for the heavy DOM to render
            const timer = setTimeout(() => {
                // Use highly reliable selectors that are always in the DOM regardless of screen size
                const allSteps = [
                    {
                        target: '.editor-sidebar-menu', 
                        content: 'Sol menüden kişisel bilgilerinizi, deneyimlerinizi ve yeteneklerinizi adım adım doldurabilirsiniz. Düzenledikçe sağ tarafta anlık göreceksiniz.',
                        disableBeacon: true,
                        placement: 'right'
                    },
                    {
                        target: '#editor-top-bar',
                        content: 'Üst menüdeki butonlarla CV\'nizi başka dillere çevirebilir, premium yapay zeka asistanı kullanabilir ve anında cihazınıza PDF indirebilirsiniz!',
                        disableBeacon: true,
                        placement: 'bottom'
                    },
                    {
                        target: '#cv-preview-frame',
                        content: 'Bu devasa alan sizin oyun bahçeniz. Yaptığınız her renk, font ve metin değişikliği anında buraya yansır. Üzerinde özgürce çalışabilirsiniz.',
                        disableBeacon: true,
                        placement: 'center'
                    }
                ];

                setSteps(allSteps);
                setRun(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            localStorage.setItem('CVniz_editor_tour_completed', 'true');
        }
    };

    if (steps.length === 0) return null;

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous={true}
            run={run}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            steps={steps}
            tooltipComponent={CustomTooltip}
            styles={{
                options: {
                    zIndex: 10000,
                    arrowColor: '#0f172a', // slate-900 matches tooltip background
                },
                spotlight: {
                    borderRadius: '16px',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)'
                }
            }}
        />
    );
}
