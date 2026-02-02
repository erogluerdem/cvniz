import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomTourTooltip = ({
    index,
    step,
    tooltipProps,
    backProps,
    primaryProps,
    isLastStep,
    isFirstStep,
    skipProps,
    continuous,
    size
}) => {
    return (
        <div 
            {...tooltipProps}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-2xl p-0 w-[380px] max-w-[90vw] overflow-hidden relative z-[9999]"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-2xl -ml-8 -mb-8" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold text-sm">
                            {index + 1}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            / {size}
                        </span>
                    </div>
                    
                    {!isLastStep && (
                        <button 
                            {...skipProps}
                            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors px-2 py-1"
                        >
                            Pas geç
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="mb-6">
                    {step.title && (
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                            {step.title}
                        </h3>
                    )}
                    <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {step.content}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        {...backProps}
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 
                            ${index > 0 
                                ? 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800' 
                                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'}`}
                        disabled={index === 0}
                    >
                        Geri
                    </button>
                    
                    <button
                        {...primaryProps}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                                 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow-lg shadow-blue-500/25 
                                 transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                    >
                        {isLastStep ? 'Tamamla' : 'Devam Et'}
                        {!isLastStep && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-100 dark:bg-slate-800 w-full">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                    style={{ width: `${((index + 1) / size) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default CustomTourTooltip;
