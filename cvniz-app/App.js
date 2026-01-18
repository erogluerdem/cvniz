import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Providers
import { AuthProvider } from './src/context/AuthContext';
import { CVProvider } from './src/context/CVContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <CVProvider>
            <AppContent />
          </CVProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
