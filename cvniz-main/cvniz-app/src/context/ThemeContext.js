import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '../constants';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('light');

    const isDark = themeMode === 'system'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';

    const colors = isDark ? COLORS.dark : COLORS.light;

    const setTheme = (mode) => {
        setThemeMode(mode);
    };

    const value = {
        themeMode,
        isDark,
        colors,
        setTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
