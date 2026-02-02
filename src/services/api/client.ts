import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../../constants/config';

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://api.ecoverse.com',
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý error
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token hết hạn - redirect to login
      await AsyncStorage.removeItem(APP_CONFIG.STORAGE_KEYS.TOKEN);
      // TODO: Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default apiClient;
