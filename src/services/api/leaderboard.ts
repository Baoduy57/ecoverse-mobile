import apiClient from './client';
import {
  ILeaderboard,
  LeaderboardScope,
  LeaderboardType,
  IStudentLeaderboardEntry,
  StudentLeaderboardScope,
} from '../../types';

const getLeaderboardBaseUrl = () => {
  const currentBase = apiClient.defaults.baseURL || 'https://ecoverse.com.name.vn/api';
  return currentBase.replace(/\/api\/?$/, '');
};

export const leaderboardApi = {
  getStudentLeaderboard: async (
    partnerId: string,
    params: {
      scope: StudentLeaderboardScope;
      page: number;
      size: number;
      grade?: string;
    }
  ): Promise<IStudentLeaderboardEntry[]> => {
    const response = await apiClient.get('/leaderboards/' + partnerId, {
      baseURL: getLeaderboardBaseUrl(),
      params: {
        scope: params.scope,
        page: params.page,
        size: params.size,
        ...(params.grade ? { grade: params.grade } : {}),
      },
    });

    const payload = response.data;
    if (
      payload &&
      typeof payload === 'object' &&
      Array.isArray((payload as { data?: unknown }).data)
    ) {
      return (payload as { data: IStudentLeaderboardEntry[] }).data;
    }

    if (Array.isArray(payload)) {
      return payload as IStudentLeaderboardEntry[];
    }

    return [];
  },

  // Legacy leaderboard endpoint (kept for backward compatibility)
  getLeaderboard: async (
    type: LeaderboardType,
    scope: LeaderboardScope,
    scopeId?: string
  ): Promise<ILeaderboard> => {
    const response = await apiClient.get('/student/leaderboard', {
      params: { type, scope, scopeId },
    });
    return response.data;
  },
};
