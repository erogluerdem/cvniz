/**
 * Native Modules Integration
 * Biometric auth, camera, file storage, device info
 */

import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import * as LocalAuthentication from 'expo-local-authentication';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as DocumentPicker from 'expo-document-picker';
import Share from 'react-native-share';
import * as Sentry from '@sentry/react-native';

/**
 * Biometric Authentication Service
 */
export const BiometricService = {
    /**
     * Check if biometric is available
     */
    isBiometricAvailable: async () => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            return compatible && enrolled;
        } catch (error) {
            console.error('Biometric check error:', error);
            return false;
        }
    },

    /**
     * Get biometric type
     */
    getBiometricType: async () => {
        try {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            
            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                return 'faceId';
            }
            if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                return 'touchId';
            }
            if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
                return 'iris';
            }

            return null;
        } catch (error) {
            console.error('Get biometric type error:', error);
            return null;
        }
    },

    /**
     * Authenticate with biometric
     */
    authenticate: async (reason = 'Kimlik doğrulama gerekli') => {
        try {
            const available = await BiometricService.isBiometricAvailable();
            
            if (!available) {
                throw new Error('Biometric authentication not available');
            }

            const result = await LocalAuthentication.authenticateAsync({
                disableDeviceFallback: false,
                reason,
                fallbackLabel: 'PIN kullan',
                enableDeviceFallback: true
            });

            return result.success;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'biometric' } });
            console.error('Biometric authentication error:', error);
            return false;
        }
    },

    /**
     * Store biometric token
     */
    storeToken: async (key, token) => {
        try {
            await SecureStore.setItemAsync(key, token);
            console.log('✅ Token stored securely');
        } catch (error) {
            Sentry.captureException(error);
            console.error('Store token error:', error);
        }
    },

    /**
     * Retrieve biometric token
     */
    getToken: async (key) => {
        try {
            const token = await SecureStore.getItemAsync(key);
            return token;
        } catch (error) {
            console.error('Get token error:', error);
            return null;
        }
    },

    /**
     * Delete biometric token
     */
    deleteToken: async (key) => {
        try {
            await SecureStore.deleteItemAsync(key);
            console.log('✅ Token deleted');
        } catch (error) {
            console.error('Delete token error:', error);
        }
    }
};

/**
 * Camera Service
 */
export const CameraService = {
    /**
     * Request camera permission
     */
    requestPermission: async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'camera' } });
            console.error('Camera permission error:', error);
            return false;
        }
    },

    /**
     * Take photo
     */
    takePhoto: async (cameraRef) => {
        try {
            if (!cameraRef.current) {
                throw new Error('Camera not ready');
            }

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
                skipProcessing: false
            });

            return photo;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'camera' } });
            console.error('Take photo error:', error);
            return null;
        }
    },

    /**
     * Pick image from gallery
     */
    pickImage: async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                throw new Error('Media library permission denied');
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8
            });

            if (!result.canceled) {
                return result.assets[0];
            }

            return null;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'image-picker' } });
            console.error('Pick image error:', error);
            return null;
        }
    },

    /**
     * Record video
     */
    recordVideo: async (cameraRef, duration = 30000) => {
        try {
            if (!cameraRef.current) {
                throw new Error('Camera not ready');
            }

            const video = await cameraRef.current.recordAsync({
                maxDuration: duration / 1000
            });

            return video;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'video' } });
            console.error('Record video error:', error);
            return null;
        }
    }
};

/**
 * File Storage Service
 */
export const FileStorageService = {
    /**
     * Save file to app documents
     */
    saveFile: async (filename, content, type = 'text') => {
        try {
            const filePath = `${FileSystem.documentDirectory}${filename}`;

            if (type === 'json') {
                content = JSON.stringify(content, null, 2);
            }

            await FileSystem.writeAsStringAsync(filePath, content);
            console.log(`✅ File saved: ${filename}`);

            return filePath;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'file-storage' } });
            console.error('Save file error:', error);
            return null;
        }
    },

    /**
     * Read file from app documents
     */
    readFile: async (filename, type = 'text') => {
        try {
            const filePath = `${FileSystem.documentDirectory}${filename}`;
            const content = await FileSystem.readAsStringAsync(filePath);

            if (type === 'json') {
                return JSON.parse(content);
            }

            return content;
        } catch (error) {
            console.error('Read file error:', error);
            return null;
        }
    },

    /**
     * Delete file
     */
    deleteFile: async (filename) => {
        try {
            const filePath = `${FileSystem.documentDirectory}${filename}`;
            await FileSystem.deleteAsync(filePath);
            console.log(`✅ File deleted: ${filename}`);
        } catch (error) {
            console.error('Delete file error:', error);
        }
    },

    /**
     * List files
     */
    listFiles: async () => {
        try {
            const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
            return files;
        } catch (error) {
            console.error('List files error:', error);
            return [];
        }
    },

    /**
     * Pick document
     */
    pickDocument: async (types = ['pdf', 'doc', 'docx']) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: types.map(t => `*/*${t}`)
            });

            if (!result.canceled) {
                return result.assets[0];
            }

            return null;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'document-picker' } });
            console.error('Pick document error:', error);
            return null;
        }
    }
};

/**
 * Device Information Service
 */
export const DeviceInfoService = {
    /**
     * Get device info
     */
    getDeviceInfo: async () => {
        try {
            return {
                brand: Device.brand,
                manufacturer: Device.manufacturer,
                modelName: Device.modelName,
                modelId: Device.modelId,
                osName: Device.osName,
                osVersion: Device.osVersion,
                platformApiLevel: Device.platformApiLevel,
                designName: Device.designName,
                productName: Device.productName,
                deviceYearClass: Device.deviceYearClass
            };
        } catch (error) {
            console.error('Get device info error:', error);
            return null;
        }
    },

    /**
     * Get app info
     */
    getAppInfo: () => {
        return {
            appOwnership: Constants.appOwnership,
            sessionId: Constants.sessionId,
            executionEnvironment: Constants.executionEnvironment,
            expoVersion: Constants.expoVersion,
            expoSdkVersion: Constants.expoSdkVersion,
            releaseChannel: Constants.releaseChannel,
            nativeAppVersion: Constants.nativeAppVersion,
            nativeBuildVersion: Constants.nativeBuildVersion
        };
    },

    /**
     * Get unique device ID
     */
    getDeviceId: async () => {
        try {
            const deviceId = Constants.sessionId;
            return deviceId;
        } catch (error) {
            console.error('Get device ID error:', error);
            return null;
        }
    }
};

/**
 * Share Service
 */
export const ShareService = {
    /**
     * Share file
     */
    shareFile: async (fileUri, title = 'Paylaş') => {
        try {
            await Share.open({
                url: fileUri,
                title,
                failOnCancel: false
            });

            console.log('✅ File shared');
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'share' } });
            console.error('Share file error:', error);
        }
    },

    /**
     * Share text
     */
    shareText: async (text, title = 'Paylaş') => {
        try {
            await Share.open({
                message: text,
                title,
                failOnCancel: false
            });

            console.log('✅ Text shared');
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'share' } });
            console.error('Share text error:', error);
        }
    },

    /**
     * Share multiple files
     */
    shareFiles: async (fileUris, title = 'Paylaş') => {
        try {
            await Share.open({
                urls: fileUris,
                title,
                failOnCancel: false
            });

            console.log('✅ Files shared');
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'share' } });
            console.error('Share files error:', error);
        }
    }
};

/**
 * Hook for biometric authentication
 */
export const useBiometric = () => {
    const [isBiometricAvailable, setIsBiometricAvailable] = React.useState(false);
    const [biometricType, setBiometricType] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        initBiometric();
    }, []);

    const initBiometric = async () => {
        const available = await BiometricService.isBiometricAvailable();
        setIsBiometricAvailable(available);

        if (available) {
            const type = await BiometricService.getBiometricType();
            setBiometricType(type);
        }
    };

    const authenticate = async () => {
        setLoading(true);
        try {
            const result = await BiometricService.authenticate();
            return result;
        } finally {
            setLoading(false);
        }
    };

    return {
        isBiometricAvailable,
        biometricType,
        loading,
        authenticate
    };
};

/**
 * Hook for camera
 */
export const useCamera = () => {
    const cameraRef = React.useRef(null);
    const [hasPermission, setHasPermission] = React.useState(false);

    React.useEffect(() => {
        requestCameraPermission();
    }, []);

    const requestCameraPermission = async () => {
        const granted = await CameraService.requestPermission();
        setHasPermission(granted);
    };

    const takePhoto = async () => {
        return await CameraService.takePhoto(cameraRef);
    };

    const pickImage = async () => {
        return await CameraService.pickImage();
    };

    return {
        cameraRef,
        hasPermission,
        takePhoto,
        pickImage,
        requestCameraPermission
    };
};

export default {
    BiometricService,
    CameraService,
    FileStorageService,
    DeviceInfoService,
    ShareService,
    useBiometric,
    useCamera
};
