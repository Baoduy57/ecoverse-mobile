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
  id: string | number;
  title: string;
  icon: string;
  status: LevelStatus;
  bestScore?: string;
  isCurrent?: boolean;
  description: string;
  playsCount?: number;
  completionRate?: number;
  itemCount?: number;
  bestPoints?: number;
  lastPoints?: number;
  lastDuration?: number;
  lastAttemptNumber?: number;
  lastAttemptId?: string;
}

// -----------------------------------------
// NEW BACKEND DONG BỘ APIs DUMB DATA
// -----------------------------------------

export interface IWasteBin {
  id: string;
  code: string;
  display_name: string;
  color_hex: string;
  icon_url: string;
  description: string;
  active: boolean;
}

export interface IGameRoundItem {
  waste_item_id: string | null;
  order_index: number;
}

export interface IGameRound {
  id: string;
  title: string;
  description: string;
  shared: boolean;
  created_by: string;
  item_count: number;
  active: boolean;
  partner_id: string | null;
  game_round_items: IGameRoundItem[] | null;
}

export interface IGameAttempt {
  id: string;
  game_round_id: string;
  title_game_round: string;
  student_id: string;
  duration: number;
  points_earned: number;
  correct_count: number;
  total_items: number;
  attempt_number: number;
  completed: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface IGameAttemptUpsertPayload {
  duration: number;
  points_earned: number;
  total_items: number;
  correct_count: number;
  completed: boolean;
}

export type BinCode = 'PLASTIC' | 'PAPER' | 'ORGANIC' | 'OTHERS';

export interface IPlacementRequest {
  waste_item_id: string;
  code: BinCode;
  is_correct: boolean;
}

export interface IPlacementUpdateQuery {
  correct: boolean;
  code: BinCode;
}

export interface IWasteItemDetails {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  points?: number;
  correct_bin_code: BinCode;
  created_by?: string;
  order_index?: number;
  active?: boolean;
}

export interface IPlacementResponse {
  id: string;
  waste_item: IWasteItemDetails;
  code: BinCode;
  is_correct: boolean;
}
