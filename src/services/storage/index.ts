import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../../constants/config';

// Storage Service - Quản lý local storage
export const storageService = {
  // Token
  saveToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.TOKEN, token);
  },

  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
  },

  removeToken: async (): Promise<void> => {
    await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
  },

  // User Data
  saveUser: async (user: any): Promise<void> => {
    await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: async (): Promise<any | null> => {
    const data = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  removeUser: async (): Promise<void> => {
    await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.USER);
  },

  // Settings
  saveSettings: async (settings: any): Promise<void> => {
    await AsyncStorage.setItem(APP_CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getSettings: async (): Promise<any | null> => {
    const data = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },

  // Generic methods
  setItem: async (key: string, value: any): Promise<void> => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
  },

  getItem: async <T = any>(key: string): Promise<T | null> => {
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};
