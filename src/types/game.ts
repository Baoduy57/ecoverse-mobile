import type { WasteType } from '../constants/game';
import { GameType, Difficulty } from '../constants/game';

// Game Session
export interface IGameSession {
  id: string;
  userId: string;
  gameType: GameType;
  difficulty: Difficulty;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  pointsEarned: number;
  streak: number;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

// Game Item (Waste Item)
export interface IWasteItem {
  id: string;
  name: string;
  type: WasteType;
  image: string;
  description?: string;
}

// Game Question (for Quiz)
export interface IGameQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  image?: string;
  difficulty: Difficulty;
}

// Game Result
export interface IGameResult {
  sessionId: string;
  score: number;
  pointsEarned: number;
  accuracy: number;
  timeSpent: number;
  newLevel?: number;
  achievements?: string[];
  rank?: number;
}

// Leaderboard Entry
export interface ILeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  points: number;
  level: number;
  isCurrentUser?: boolean;
}

// Daily Challenge
export interface IDailyChallenge {
  id: string;
  title: string;
  description: string;
  gameType: GameType;
  difficulty: Difficulty;
  targetScore: number;
  rewardPoints: number;
  expiresAt: string;
  isCompleted: boolean;
  progress?: number;
}

// Learning Path Level
export type LevelStatus = 'locked' | 'current' | 'completed';

export interface Level {
  id: number;
  title: string;
  icon: string;
  status: LevelStatus;
  bestScore?: string;
  isCurrent?: boolean;
  description: string;
  playsCount?: number;
  completionRate?: number;
}
