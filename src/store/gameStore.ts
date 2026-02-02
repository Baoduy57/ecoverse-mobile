import { create } from 'zustand';
import { IGameSession, GameType, Difficulty } from '../types';

interface GameState {
  currentSession: IGameSession | null;
  score: number;
  streak: number;
  timeRemaining: number;
  isPlaying: boolean;

  // Actions
  startGame: (gameType: GameType, difficulty: Difficulty) => void;
  endGame: () => void;
  updateScore: (points: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  updateTime: (seconds: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentSession: null,
  score: 0,
  streak: 0,
  timeRemaining: 0,
  isPlaying: false,

  startGame: (gameType: GameType, difficulty: Difficulty) => {
    set({
      currentSession: {
        id: Date.now().toString(),
        userId: '', // Will be set from auth store
        gameType,
        difficulty,
        score: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        timeSpent: 0,
        pointsEarned: 0,
        streak: 0,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      },
      isPlaying: true,
      score: 0,
      streak: 0,
    });
  },

  endGame: () => {
    const session = get().currentSession;
    if (session) {
      set({
        currentSession: { ...session, isCompleted: true },
        isPlaying: false,
      });
    }
  },

  updateScore: (points: number) => {
    set(state => ({
      score: state.score + points,
    }));
  },

  incrementStreak: () => {
    set(state => ({
      streak: state.streak + 1,
    }));
  },

  resetStreak: () => {
    set({ streak: 0 });
  },

  updateTime: (seconds: number) => {
    set({ timeRemaining: seconds });
  },

  resetGame: () => {
    set({
      currentSession: null,
      score: 0,
      streak: 0,
      timeRemaining: 0,
      isPlaying: false,
    });
  },
}));
