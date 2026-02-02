// Notification Types for Student App
export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  // Rewards
  REWARD_APPROVED = 'REWARD_APPROVED', // Phần thưởng được duyệt
  REWARD_REJECTED = 'REWARD_REJECTED', // Phần thưởng bị từ chối
  REWARD_DELIVERED = 'REWARD_DELIVERED', // Phần thưởng đã giao

  // Achievements
  ACHIEVEMENT_UNLOCKED = 'ACHIEVEMENT_UNLOCKED', // Đạt thành tích mới
  LEVEL_UP = 'LEVEL_UP', // Lên level
  BADGE_EARNED = 'BADGE_EARNED', // Nhận huy hiệu

  // Daily Challenges
  DAILY_CHALLENGE = 'DAILY_CHALLENGE', // Thử thách mới
  CHALLENGE_COMPLETED = 'CHALLENGE_COMPLETED', // Hoàn thành thử thách

  // Parent/School
  PARENT_MESSAGE = 'PARENT_MESSAGE', // Tin nhắn từ phụ huynh
  SCHOOL_ANNOUNCEMENT = 'SCHOOL_ANNOUNCEMENT', // Thông báo từ trường

  // System
  SYSTEM = 'SYSTEM', // Thông báo hệ thống
}

// Leaderboard Types
export interface ILeaderboard {
  id: string;
  type: LeaderboardType;
  scope: LeaderboardScope;
  scopeId?: string; // ID của lớp hoặc trường
  entries: import('./game').ILeaderboardEntry[];
  updatedAt: string;
}

export enum LeaderboardType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ALL_TIME = 'ALL_TIME',
}

export enum LeaderboardScope {
  GLOBAL = 'GLOBAL', // Toàn quốc
  SCHOOL = 'SCHOOL', // Theo trường
  CLASS = 'CLASS', // Theo lớp
  FRIENDS = 'FRIENDS', // Bạn bè
}

// Student Profile Info
export interface IStudentInfo {
  className?: string;
  schoolName?: string;
  grade?: number; // Khối lớp
  parentEmail?: string; // Email phụ huynh liên kết
  parentApprovalRequired: boolean; // Yêu cầu phụ huynh duyệt đổi quà
}
