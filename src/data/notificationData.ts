import { Notification, NotificationType } from '../types/notification';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: NotificationType.PROGRESS,
    title: 'Chúc mừng! Tiến độ mới 🎉',
    message: 'Bạn đã hoàn thành 75% mục tiêu tuần này. Cố gắng lên!',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isRead: false,
    icon: 'chart-line-variant',
    iconColor: '#10B981',
    iconBgColor: '#D1FAE5',
    actionText: 'Xem tiến độ',
  },
  {
    id: '2',
    type: NotificationType.REWARD,
    title: 'Đổi quà thành công! 🎁',
    message: 'Bạn đã đổi 500 xu lấy "Bút chì eco-friendly". Đến nhận quà nhé!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    icon: 'gift',
    iconColor: '#F59E0B',
    iconBgColor: '#FEF3C7',
    actionText: 'Xem quà',
  },
  {
    id: '3',
    type: NotificationType.ACHIEVEMENT,
    title: 'Huy hiệu mới! 🏆',
    message: 'Bạn đã mở khóa huy hiệu "Nhà tái chế xuất sắc"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    icon: 'trophy',
    iconColor: '#EF4444',
    iconBgColor: '#FEE2E2',
    actionText: 'Xem huy hiệu',
  },
  {
    id: '4',
    type: NotificationType.QUIZ,
    title: 'Quiz tuần mới! 📝',
    message: 'Quiz về "Tái chế nhựa" đã sẵn sàng. Tham gia ngay để nhận 100 xu!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: true,
    icon: 'clipboard-check',
    iconColor: '#8B5CF6',
    iconBgColor: '#F5F3FF',
    actionText: 'Làm quiz',
  },
  {
    id: '5',
    type: NotificationType.GAME,
    title: 'Thử thách mới! 🎮',
    message: 'Level 5 "Phân loại rác nhanh" đã được mở khóa',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    icon: 'gamepad-variant',
    iconColor: '#06B6D4',
    iconBgColor: '#CFFAFE',
    actionText: 'Chơi ngay',
  },
  {
    id: '6',
    type: NotificationType.SYSTEM,
    title: 'Cập nhật hệ thống 🔧',
    message: 'EcoVerse đã thêm tính năng quét AI mới. Hãy thử ngay!',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    icon: 'information',
    iconColor: '#6366F1',
    iconBgColor: '#E0E7FF',
    actionText: 'Khám phá',
  },
  {
    id: '7',
    type: NotificationType.PROGRESS,
    title: 'Streak 7 ngày! 🔥',
    message: 'Bạn đã duy trì streak 7 ngày liên tiếp. Tuyệt vời!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    icon: 'fire',
    iconColor: '#F97316',
    iconBgColor: '#FFEDD5',
  },
  {
    id: '8',
    type: NotificationType.REWARD,
    title: 'Nhận xu hàng ngày 💰',
    message: 'Bạn đã nhận 50 xu từ việc hoàn thành nhiệm vụ hàng ngày',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isRead: true,
    icon: 'currency-usd',
    iconColor: '#FBBF24',
    iconBgColor: '#FEF3C7',
  },
];

export function getUnreadCount(): number {
  return MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
}

export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Vừa xong';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
  return `${Math.floor(seconds / 604800)} tuần trước`;
}
