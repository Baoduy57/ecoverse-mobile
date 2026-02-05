import { create } from 'zustand';
import { IUser, IAuthResponse } from '../types';
import { authApi } from '../services/api';
import { storageService } from '../services/storage';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response: IAuthResponse = await authApi.login({ email, password });

      await storageService.saveToken(response.token);
      await storageService.saveUser(response.user);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Đăng nhập thất bại',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      const response: IAuthResponse = await authApi.register({ email, password, name });

      await storageService.saveToken(response.token);
      await storageService.saveUser(response.user);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Đăng ký thất bại',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    // Mock logout - chỉ clear local data
    await storageService.removeToken();
    await storageService.removeUser();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const token = await storageService.getToken();
      const user = await storageService.getUser();

      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
