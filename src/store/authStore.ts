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
  studentLogin: (student_code: string) => Promise<void>;
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



  studentLogin: async (student_code: string) => {
    try {
      set({ isLoading: true, error: null });
      const rawResponse: any = await authApi.studentLogin({ student_code });
      
      // Khắc phục nhanh các dạng mapping trả về từ API backend
      const responseData = rawResponse.data || rawResponse;
      const extractedToken = responseData.access_token || responseData.token;
      
      // Map user_info sang chuẩn IUser của app
      const apiUser = responseData.user_info || responseData.user || {};
      const mappedUser = {
        ...apiUser,
        id: apiUser.student_id || apiUser.id,
        name: apiUser.full_name || apiUser.name,
        avatar: apiUser.avatar_url || apiUser.avatar,
        points: apiUser.points || 0,
        grade: apiUser.grade,
        // Lưu lại token refresh nếu có
        refreshToken: responseData.refresh_token,
      };

      if (!extractedToken) {
        console.error('API Response missing token:', rawResponse);
        throw new Error('Đăng nhập thất bại: Máy chủ không trả về token hợp lệ. Xem log để biết chi tiết.');
      }

      await storageService.saveToken(extractedToken);
      await storageService.saveUser(mappedUser); // Contains student ID mapped from API

      set({
        user: mappedUser,
        token: extractedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Đăng nhập học sinh thất bại',
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
