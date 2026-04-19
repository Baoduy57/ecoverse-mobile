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

  updateStudentDetails: async (
    studentId: string,
    data: { full_name?: string; grade?: string; class_number?: string }
  ) => {
    const formData = new FormData();
    if (data.full_name) formData.append('full_name', data.full_name);
    if (data.grade) formData.append('grade', data.grade);
    if (data.class_number) formData.append('class_number', data.class_number);

    const response = await apiClient.put(`/students/${studentId}`, formData, {
      baseURL: getStudentBaseUrl(),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateStudentAvatar: async (studentId: string, imageUri: string) => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('file', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.patch(`/students/${studentId}/update-avatar`, formData, {
      baseURL: getStudentBaseUrl(),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

  // AI Waste Items (History)
  getAIWasteItems: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}/waste-items/AI`, {
      baseURL: getStudentBaseUrl(), // use root API for /students/... instead of /api/...
    });
    return response.data;
  },
};
