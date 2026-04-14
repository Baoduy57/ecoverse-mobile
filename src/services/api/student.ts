import apiClient from './client';
import { INotification } from '../../types';

const getStudentBaseUrl = () => {
  const currentBase = apiClient.defaults.baseURL || 'https://ecoverse.com.name.vn/api';
  return currentBase.replace(/\/api\/?$/, '');
};

export const studentApi = {
  // Student details
  getStudentById: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}`, {
      baseURL: getStudentBaseUrl(),
    });
    return response.data;
  },

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
