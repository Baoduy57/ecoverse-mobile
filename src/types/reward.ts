// Reward Types
export interface IReward {
  id: string;
  name: string;
  description: string;
  point_required: number;
  image_url: string;
  partner_id: string;
  available: boolean;
}

// Redeem History
export interface IRedeemHistory {
  id: string;
  userId: string;
  rewardId: string;
  reward: IReward;
  pointsSpent: number;
  status: RedeemStatus;
  code?: string;
  redeemedAt: string;
  usedAt?: string;
  reason_parent?: string;
  reason_partner?: string;
}

export enum RedeemStatus {
  PENDING = 'PENDING', // Chờ phụ huynh xác nhận
  PARENT_APPROVED = 'PARENT_APPROVED', // Phụ huynh đã duyệt
  APPROVED = 'APPROVED', // Đối tác đã duyệt
  DELIVERED = 'DELIVERED', // Đã giao
  USED = 'USED', // Đã sử dụng
  EXPIRED = 'EXPIRED', // Hết hạn
  CANCELLED = 'CANCELLED', // Đã hủy
  PARENT_REJECTED = 'PARENT_REJECTED', // Phụ huynh từ chối
  PARTNER_REJECTED = 'PARTNER_REJECTED', // Đối tác từ chối
}

// Badge/Achievement
export interface IAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

// Transaction History
export interface IPointTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  points: number;
  description: string;
  relatedId?: string;
  createdAt: string;
}

export enum TransactionType {
  EARN_GAME = 'EARN_GAME',
  EARN_DAILY = 'EARN_DAILY',
  EARN_ACHIEVEMENT = 'EARN_ACHIEVEMENT',
  EARN_BONUS = 'EARN_BONUS',
  SPEND_REWARD = 'SPEND_REWARD',
  ADMIN_ADJUST = 'ADMIN_ADJUST',
}
