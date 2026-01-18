import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { COLORS } from '../constants';

// Components
import CustomTabBar from '../components/CustomTabBar';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EditorScreen from '../screens/EditorScreen';
import TemplatesScreen from '../screens/TemplatesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// New Premium Screens
import CoverLetterScreen from '../screens/CoverLetterScreen';
import ATSAnalysisScreen from '../screens/ATSAnalysisScreen';
import CVShareScreen from '../screens/CVShareScreen';
import JobSearchScreen from '../screens/JobSearchScreen';
import CVTranslatorScreen from '../screens/CVTranslatorScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PremiumScreen from '../screens/PremiumScreen';

// Advanced Feature Screens
import InterviewScreen from '../screens/InterviewScreen';
import ApplicationCRMScreen from '../screens/ApplicationCRMScreen';
import LinkedInImportScreen from '../screens/LinkedInImportScreen';
import QRCodeScreen from '../screens/QRCodeScreen';
import SkillGapScreen from '../screens/SkillGapScreen';
import SalaryScreen from '../screens/SalaryScreen';
import CareerPathScreen from '../screens/CareerPathScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Loading Screen
function LoadingScreen({ colors }) {
    return (
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
            <View style={styles.loadingContent}>
                <View style={styles.loadingLogo}>
                    <Text style={styles.loadingLogoText}>CV</Text>
                </View>
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 24 }} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Yükleniyor...</Text>
            </View>
        </View>
    );
}

// Bottom Tab Navigator with Custom Tab Bar
function MainTabs() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Templates" component={TemplatesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

// Auth Stack
function AuthStack({ onOnboardingComplete }) {
    const { colors } = useTheme();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="Onboarding">
                {(props) => <OnboardingScreen {...props} onComplete={onOnboardingComplete} />}
            </Stack.Screen>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

// Main Navigator
export default function AppNavigator() {
    const { user, loading } = useAuth();
    const { colors } = useTheme();
    const [showOnboarding, setShowOnboarding] = useState(null);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        try {
            const completed = await AsyncStorage.getItem('onboarding_completed');
            setShowOnboarding(completed !== 'true');
        } catch (error) {
            setShowOnboarding(false);
        }
    };

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
    };

    if (loading || showOnboarding === null) {
        return <LoadingScreen colors={colors} />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.background }
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                    <Stack.Screen name="Editor" component={EditorScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="CoverLetter" component={CoverLetterScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="ATSAnalysis" component={ATSAnalysisScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="CVShare" component={CVShareScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="JobSearch" component={JobSearchScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="CVTranslator" component={CVTranslatorScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="Premium" component={PremiumScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="Interview" component={InterviewScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="ApplicationCRM" component={ApplicationCRMScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="LinkedInImport" component={LinkedInImportScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="QRCode" component={QRCodeScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="SkillGap" component={SkillGapScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="Salary" component={SalaryScreen} options={{ headerShown: false, presentation: 'modal' }} />
                    <Stack.Screen name="CareerPath" component={CareerPathScreen} options={{ headerShown: false, presentation: 'modal' }} />
                </>
            ) : showOnboarding ? (
                <Stack.Screen name="Auth" options={{ headerShown: false }}>
                    {(props) => <AuthStack {...props} onOnboardingComplete={handleOnboardingComplete} />}
                </Stack.Screen>
            ) : (
                <Stack.Screen name="Auth" options={{ headerShown: false }}>
                    {() => (
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Register" component={RegisterScreen} />
                        </Stack.Navigator>
                    )}
                </Stack.Screen>
            )}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    loadingContent: {
        alignItems: 'center',
    },
    loadingLogo: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    loadingLogoText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    loadingText: { 
        marginTop: 16, 
        fontSize: 16,
        fontWeight: '500',
    },
});
