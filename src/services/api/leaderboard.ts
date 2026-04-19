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

const ABSOLUTE_URI_REGEX = /^(https?:\/\/|data:|file:)/i;

export const resolveLeaderboardAssetUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (ABSOLUTE_URI_REGEX.test(trimmed)) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${getLeaderboardBaseUrl()}${normalizedPath}`;
};

export const leaderboardApi = {
  getStudentRank: async (
    partnerId: string,
    studentId: string,
    params: {
      scope: StudentLeaderboardScope;
      grade?: string;
    }
  ): Promise<number | null> => {
    const response = await apiClient.get(
      `/leaderboards/partners/${partnerId}/students/${studentId}`,
      {
        baseURL: getLeaderboardBaseUrl(),
        params: {
          scope: params.scope,
          ...(params.grade ? { grade: params.grade } : {}),
        },
      }
    );

    const payload = response.data;
    if (
      payload &&
      typeof payload === 'object' &&
      Number.isFinite(Number((payload as { data?: unknown }).data))
    ) {
      return Number((payload as { data?: unknown }).data);
    }

    if (Number.isFinite(Number(payload))) {
      return Number(payload);
    }

    return null;
  },

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
