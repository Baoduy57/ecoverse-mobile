export const colors = {
  // Primary Colors - Màu xanh lá (môi trường)
  primary: '#4CAF50',
  primaryLight: '#81C784',
  primaryDark: '#388E3C',

  // Secondary Colors - Màu cam (năng lượng, vui tươi)
  secondary: '#FF9800',
  secondaryLight: '#FFB74D',
  secondaryDark: '#F57C00',

  // Accent Colors
  accent: '#FFD700', // Vàng - điểm thưởng
  accentBlue: '#2196F3',
  accentPurple: '#9C27B0',

  // Waste Type Colors - Màu theo loại rác
  waste: {
    organic: '#8BC34A', // Rác hữu cơ - xanh lá nhạt
    recyclable: '#2196F3', // Rác tái chế - xanh dương
    hazardous: '#F44336', // Rác nguy hại - đỏ
    nonRecyclable: '#9E9E9E', // Rác không tái chế - xám
  },

  // UI Colors
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  onboardingBg: '#E8F5E9', // Xanh mint nhạt cho onboarding

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    white: '#FFFFFF',
  },

  // Status Colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  // Border & Divider
  border: '#E0E0E0',
  divider: '#EEEEEE',
  shadow: '#000000',

  // Game Elements
  game: {
    star: '#FFD700',
    coin: '#FFB300',
    diamond: '#64B5F6',
  },

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Gradients (for LinearGradient)
  gradient: {
    primary: ['#2E7D32', '#4CAF50', '#81C784'] as const,
    hero: ['#1B5E20', '#2E7D32', '#388E3C'] as const,
    card: ['#FFFFFF', '#F8FDF8'] as const,
    scanGlow: ['#4CAF50', 'transparent'] as const,
  },
};

// Độ mờ cho overlay và disabled states
export const opacity = {
  disabled: 0.5,
  overlay: 0.5,
  pressed: 0.7,
};
