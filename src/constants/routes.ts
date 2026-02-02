// Navigation Routes
export const ROUTES = {
  // Auth Stack
  AUTH_STACK: 'AuthStack',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Main Stack
  MAIN_STACK: 'MainStack',

  // Tab Navigation
  HOME_TAB: 'HomeTab',
  GAME_TAB: 'GameTab',
  LEADERBOARD_TAB: 'LeaderboardTab',
  PROFILE_TAB: 'ProfileTab',

  // Home
  HOME: 'Home',
  DAILY_CHALLENGE: 'DailyChallenge',

  // Game
  GAME_LIST: 'GameList',
  GAME_PLAY: 'GamePlay',
  GAME_RESULT: 'GameResult',

  // Education
  WASTE_INFO: 'WasteInfo',
  VIDEO_TUTORIAL: 'VideoTutorial',
  QUIZ: 'Quiz',

  // Profile
  PROFILE: 'Profile',
  EDIT_PROFILE: 'EditProfile',
  ACHIEVEMENTS: 'Achievements',
  SETTINGS: 'Settings',

  // Rewards
  REWARDS: 'Rewards',
  REWARD_DETAIL: 'RewardDetail',
  REDEEM_HISTORY: 'RedeemHistory',
  REDEEM_REQUEST: 'RedeemRequest',
  PENDING_REDEMPTIONS: 'PendingRedemptions',

  // Leaderboard
  LEADERBOARD: 'Leaderboard',

  // Other
  NOTIFICATIONS: 'Notifications',
  CLASS_INFO: 'ClassInfo',
} as const;

export type RouteNames = (typeof ROUTES)[keyof typeof ROUTES];
