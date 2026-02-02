import apiClient from './client';
import { IUser, IUserStats, IPointTransaction, IPaginatedResponse } from '../../types';

export const userApi = {
  // Lấy thông tin profile
  getProfile: async (): Promise<IUser> => {
    const response = await apiClient.get<IUser>('/user/profile');
    return response.data;
  },

  // Cập nhật profile
  updateProfile: async (data: Partial<IUser>): Promise<IUser> => {
    const response = await apiClient.put<IUser>('/user/profile', data);
    return response.data;
  },

  // Lấy stats
  getStats: async (): Promise<IUserStats> => {
    const response = await apiClient.get<IUserStats>('/user/stats');
    return response.data;
  },

  // Lấy lịch sử giao dịch điểm
  getPointHistory: async (
    page: number = 1,
    limit: number = 10
  ): Promise<IPaginatedResponse<IPointTransaction>> => {
    const response = await apiClient.get<IPaginatedResponse<IPointTransaction>>(
      '/user/points/history',
      { params: { page, limit } }
    );
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (uri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', {
      uri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    } as any);

    const response = await apiClient.post<{ url: string }>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.url;
  },
};
