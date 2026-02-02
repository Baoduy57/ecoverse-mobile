import apiClient from './client';
import { INotification, ILeaderboard, LeaderboardType, LeaderboardScope } from '../../types';

export const studentApi = {
  // Notifications
  getNotifications: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get('/student/notifications', {
      params: { page, limit },
    });
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.put(`/student/notifications/${notificationId}/read`);
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    await apiClient.put('/student/notifications/read-all');
  },

  // Leaderboard
  getLeaderboard: async (
    type: LeaderboardType,
    scope: LeaderboardScope,
    scopeId?: string
  ): Promise<ILeaderboard> => {
    const response = await apiClient.get('/student/leaderboard', {
      params: { type, scope, scopeId },
    });
    return response.data;
  },

  // Class Info
  getClassInfo: async () => {
    const response = await apiClient.get('/student/class-info');
    return response.data;
  },

  // Friends/Classmates
  getClassmates: async () => {
    const response = await apiClient.get('/student/classmates');
    return response.data;
  },
};
