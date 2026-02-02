import apiClient from './client';
import { IAuthResponse, ILoginRequest, IRegisterRequest, IUser } from '../../types';

export const authApi = {
  // Đăng nhập
  login: async (data: ILoginRequest): Promise<IAuthResponse> => {
    const response = await apiClient.post<IAuthResponse>('/auth/login', data);
    return response.data;
  },

  // Đăng ký
  register: async (data: IRegisterRequest): Promise<IAuthResponse> => {
    const response = await apiClient.post<IAuthResponse>('/auth/register', data);
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<IUser> => {
    const response = await apiClient.get<IUser>('/auth/me');
    return response.data;
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Quên mật khẩu
  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset mật khẩu
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/reset-password', { token, newPassword });
  },
};
