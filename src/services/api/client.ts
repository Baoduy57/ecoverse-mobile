import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../../constants/config';
import { useApiStatusStore } from '../../store/apiStatusStore';
import { useAuthStore } from '../../store/authStore';

type RequestMetadata = {
  id: number;
  slowWarningTimer?: ReturnType<typeof setTimeout>;
  didShowSlowWarning: boolean;
};

type RequestConfigWithMetadata = InternalAxiosRequestConfig & {
  metadata?: RequestMetadata;
};

const SLOW_REQUEST_WARNING_MS = Math.max(7000, Math.floor(APP_CONFIG.API_TIMEOUT * 0.5));

let requestIdSeed = 0;
const activeSlowWarningIds = new Set<number>();

const clearRequestWarning = (config?: RequestConfigWithMetadata) => {
  if (!config?.metadata) {
    return;
  }

  const { id, slowWarningTimer, didShowSlowWarning } = config.metadata;

  if (slowWarningTimer) {
    clearTimeout(slowWarningTimer);
  }

  if (didShowSlowWarning) {
    activeSlowWarningIds.delete(id);

    const store = useApiStatusStore.getState();
    if (activeSlowWarningIds.size === 0 && store.incident?.type === 'slow_request') {
      store.hideIncident();
    }
  }
};

// Tạo axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://ecoverse.com.name.vn/api',
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
  async config => {
    const configWithMetadata = config as RequestConfigWithMetadata;
    const requestId = ++requestIdSeed;

    configWithMetadata.metadata = {
      id: requestId,
      didShowSlowWarning: false,
    };

    configWithMetadata.metadata.slowWarningTimer = setTimeout(() => {
      activeSlowWarningIds.add(requestId);

      if (configWithMetadata.metadata) {
        configWithMetadata.metadata.didShowSlowWarning = true;
      }

      useApiStatusStore.getState().showSlowRequest();
    }, SLOW_REQUEST_WARNING_MS);

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
    clearRequestWarning(response.config as RequestConfigWithMetadata);
    return response;
  },
  async (error: AxiosError) => {
    clearRequestWarning(error.config as RequestConfigWithMetadata | undefined);

    if (error.response?.status === 401) {
      // Token hết hạn - force logout to clear storage and redirect
      // Delay import or use require to avoid circular dependency if needed
      useAuthStore.getState().logout();
    }

    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    const statusCode = error.response?.status;
    const errorMessage = error.message?.toLowerCase() || '';
    const apiStatus = useApiStatusStore.getState();

    if (statusCode === 503) {
      apiStatus.showMaintenance();
    } else if (error.code === 'ECONNABORTED' || errorMessage.includes('timeout')) {
      apiStatus.showTimeout();
    } else if (!error.response) {
      apiStatus.showNetworkError();
    } else if (statusCode && statusCode >= 500) {
      apiStatus.showServerError();
    }

    return Promise.reject(error);
  }
);

export default apiClient;
