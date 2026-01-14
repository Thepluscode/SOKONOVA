// Cross-platform storage - uses localStorage on web, SecureStore on native
import { Platform } from 'react-native';

// Web-compatible storage
const webStorage = {
    getItemAsync: async (key: string): Promise<string | null> => {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    },
    setItemAsync: async (key: string, value: string): Promise<void> => {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, value);
        }
    },
    deleteItemAsync: async (key: string): Promise<void> => {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
    },
};

// Use web storage for web platform, otherwise import SecureStore
let storage = webStorage;

if (Platform.OS !== 'web') {
    // Dynamic import for native platforms
    try {
        const SecureStore = require('expo-secure-store');
        storage = SecureStore;
    } catch (e) {
        console.warn('SecureStore not available, using web storage');
    }
}

export const getItemAsync = storage.getItemAsync;
export const setItemAsync = storage.setItemAsync;
export const deleteItemAsync = storage.deleteItemAsync;

export default storage;
