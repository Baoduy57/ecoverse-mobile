import apiClient from './client';
import {
  IGameSession,
  IGameResult,
  IGameQuestion,
  IWasteItem,
  IDailyChallenge,
  GameType,
  Difficulty,
} from '../../types';

export const gameApi = {
  // Lấy danh sách waste items
  getWasteItems: async (): Promise<IWasteItem[]> => {
    const response = await apiClient.get<IWasteItem[]>('/game/waste-items');
    return response.data;
  },

  // Lấy câu hỏi quiz
  getQuizQuestions: async (difficulty: Difficulty): Promise<IGameQuestion[]> => {
    const response = await apiClient.get<IGameQuestion[]>('/game/quiz', {
      params: { difficulty },
    });
    return response.data;
  },

  // Bắt đầu game session
  startGame: async (gameType: GameType, difficulty: Difficulty): Promise<IGameSession> => {
    const response = await apiClient.post<IGameSession>('/game/start', {
      gameType,
      difficulty,
    });
    return response.data;
  },

  // Submit game result
  submitGameResult: async (
    sessionId: string,
    data: Partial<IGameSession>
  ): Promise<IGameResult> => {
    const response = await apiClient.post<IGameResult>(`/game/submit/${sessionId}`, data);
    return response.data;
  },

  // Lấy daily challenges
  getDailyChallenges: async (): Promise<IDailyChallenge[]> => {
    const response = await apiClient.get<IDailyChallenge[]>('/game/daily-challenges');
    return response.data;
  },

  // Complete daily challenge
  completeDailyChallenge: async (challengeId: string): Promise<void> => {
    await apiClient.post(`/game/daily-challenges/${challengeId}/complete`);
  },
};
