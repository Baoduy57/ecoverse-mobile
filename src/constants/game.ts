// Loại rác thải
export enum WasteType {
  ORGANIC = 'ORGANIC', // Rác hữu cơ
  RECYCLABLE = 'RECYCLABLE', // Rác tái chế
  HAZARDOUS = 'HAZARDOUS', // Rác nguy hại
  NON_RECYCLABLE = 'NON_RECYCLABLE', // Rác không tái chế
}

// Cấu hình game
export const GAME_CONFIG = {
  // Điểm số
  POINTS_PER_CORRECT: 10,
  POINTS_PER_STREAK: 5,
  BONUS_MULTIPLIER: 1.5,
  MAX_DAILY_POINTS: 1000,

  // Thời gian
  GAME_TIME_LIMIT: 60, // giây
  COUNTDOWN_START: 3,

  // Level & Progression
  POINTS_PER_LEVEL: 100,
  MAX_LEVEL: 50,

  // Combo & Streak
  COMBO_THRESHOLD: 3,
  STREAK_BONUS: 5,
  MAX_STREAK: 10,

  // Lives
  MAX_LIVES: 3,
  LIFE_REGENERATION_TIME: 300, // 5 phút (giây)
};

// Loại mini game
export enum GameType {
  SORTING = 'SORTING', // Phân loại rác
  QUIZ = 'QUIZ', // Câu hỏi trắc nghiệm
  MEMORY = 'MEMORY', // Trò chơi ghi nhớ
  PUZZLE = 'PUZZLE', // Xếp hình
  CATCHING = 'CATCHING', // Bắt rác rơi
}

// Độ khó
export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

// Cấu hình độ khó
export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    timeLimit: 90,
    itemCount: 5,
    pointsMultiplier: 1,
  },
  [Difficulty.MEDIUM]: {
    timeLimit: 60,
    itemCount: 8,
    pointsMultiplier: 1.5,
  },
  [Difficulty.HARD]: {
    timeLimit: 45,
    itemCount: 12,
    pointsMultiplier: 2,
  },
};

// Achievement types
export enum AchievementType {
  FIRST_GAME = 'FIRST_GAME',
  STREAK_5 = 'STREAK_5',
  STREAK_10 = 'STREAK_10',
  LEVEL_10 = 'LEVEL_10',
  LEVEL_20 = 'LEVEL_20',
  PERFECT_GAME = 'PERFECT_GAME',
  MASTER_SORTER = 'MASTER_SORTER',
}

// Thông tin về các loại rác
export const WASTE_INFO = {
  [WasteType.ORGANIC]: {
    name: 'Rác Hữu Cơ',
    description: 'Rác dễ phân hủy từ thiên nhiên',
    examples: ['Thức ăn thừa', 'Vỏ trái cây', 'Lá cây', 'Rau củ hỏng'],
    color: '#8BC34A',
    icon: '🥬',
  },
  [WasteType.RECYCLABLE]: {
    name: 'Rác Tái Chế',
    description: 'Rác có thể tái chế và sử dụng lại',
    examples: ['Chai nhựa', 'Giấy báo', 'Lon nhôm', 'Hộp carton'],
    color: '#2196F3',
    icon: '♻️',
  },
  [WasteType.HAZARDOUS]: {
    name: 'Rác Nguy Hại',
    description: 'Rác độc hại, nguy hiểm với môi trường',
    examples: ['Pin', 'Bóng đèn', 'Thuốc trừ sâu', 'Hóa chất'],
    color: '#F44336',
    icon: '☢️',
  },
  [WasteType.NON_RECYCLABLE]: {
    name: 'Rác Không Tái Chế',
    description: 'Rác không thể tái chế',
    examples: ['Túi nilon bẩn', 'Giấy dính', 'Đồ gốm vỡ', 'Khăn giấy'],
    color: '#9E9E9E',
    icon: '🗑️',
  },
};
