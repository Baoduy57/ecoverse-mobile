// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'EcoVerse',
  VERSION: '1.0.0',

  // API
  API_TIMEOUT: 30000,

  // Storage Keys
  STORAGE_KEYS: {
    TOKEN: '@ecoverse_token',
    USER: '@ecoverse_user',
    SETTINGS: '@ecoverse_settings',
    ONBOARDING: '@ecoverse_onboarding',
  },

  // Pagination
  ITEMS_PER_PAGE: 10,
  LEADERBOARD_LIMIT: 50,

  // Assets
  DEFAULT_AVATAR: require('../../assets/images/default-avatar.jpg'),

  // Analytics
  ANALYTICS_ENABLED: true,

  // Features
  FEATURES: {
    SOCIAL_SHARING: true,
    PUSH_NOTIFICATIONS: true,
    IN_APP_PURCHASE: false,
    OFFLINE_MODE: true,
  },
};

// Regex Patterns
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
  PHONE: /^[0-9]{10}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
  SERVER_ERROR: 'Lỗi server. Vui lòng thử lại sau.',
  INVALID_INPUT: 'Thông tin không hợp lệ.',
  UNKNOWN_ERROR: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  UPDATE_SUCCESS: 'Cập nhật thành công!',
  REDEEM_SUCCESS: 'Đổi quà thành công!',
};

// Date Formats
export const DATE_FORMATS = {
  FULL: 'DD/MM/YYYY HH:mm:ss',
  DATE_ONLY: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm',
  SHORT_DATE: 'DD/MM',
};
