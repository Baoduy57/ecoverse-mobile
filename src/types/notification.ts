export enum NotificationType {
  PROGRESS = 'PROGRESS',
  REWARD = 'REWARD',
  ACHIEVEMENT = 'ACHIEVEMENT',
  QUIZ = 'QUIZ',
  GAME = 'GAME',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  icon?: string;
  iconColor?: string;
  iconBgColor?: string;
  actionText?: string;
  actionRoute?: string;
}
