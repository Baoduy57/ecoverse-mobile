// User Types
export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  level: number;
  points: number;
  totalPoints: number;
  streak: number;
  lives: number;
  createdAt: string;
  updatedAt: string;
  // Student specific info
  className?: string;
  schoolName?: string;
  grade?: string | number;
  parentName?: string;
  parentEmail?: string;
  partnerId?: string;
  // API statistics block
  statistics?: {
    total_games_played: number;
    total_average_accuracy: number;
    total_quizzes_completed: number;
    total_achievements_unlocked: number;
  };
}

export interface IUserStats {
  totalGames: number;
  gamesWon: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  highestStreak: number;
  favoriteGameType?: string;
}

export interface IUserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  language: 'vi' | 'en';
  theme: 'light' | 'dark';
}

// Auth Types
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}
