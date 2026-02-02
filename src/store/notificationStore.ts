import { create } from 'zustand';
import { INotification } from '../types';
import { studentApi } from '../services/api';

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: INotification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await studentApi.getNotifications();

      const unreadCount = data.items.filter((n: INotification) => !n.isRead).length;

      set({
        notifications: data.items,
        unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Không thể tải thông báo',
        isLoading: false,
      });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await studentApi.markNotificationAsRead(notificationId);

      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      console.error('Mark as read error:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await studentApi.markAllNotificationsAsRead();

      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      console.error('Mark all as read error:', error);
    }
  },

  addNotification: (notification: INotification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
}));
