import apiClient from './client';
import type {
  ICompetition,
  ICompetitionParticipant,
  IRegisterParticipantPayload,
  IRegisterParticipantResponse,
} from '../../types/competition';

/**
 * Competition endpoints run at root level (no `/api` prefix), same as game/leaderboard.
 */
const getCompetitionBaseUrl = () => {
  const currentBase = apiClient.defaults.baseURL || 'https://ecoverse.com.name.vn/api';
  return currentBase.replace(/\/api\/?$/, '');
};

export const competitionApi = {
  /**
   * 1. Lấy danh sách cuộc thi của nhà trường/trung tâm.
   * GET /competitions/{partner_id}
   */
  getCompetitions: async (partnerId: string): Promise<ICompetition[]> => {
    const response = await apiClient.get<any>(`/competitions/${partnerId}`, {
      baseURL: getCompetitionBaseUrl(),
    });

    const payload = response.data;
    if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
      return payload.data as ICompetition[];
    }
    if (Array.isArray(payload)) {
      return payload as ICompetition[];
    }
    return [];
  },

  /**
   * 2. Ghi danh lên Bảng xếp hạng Cuộc thi (Bước 2.3 / 3.4).
   * POST /competitions/{competition_id}/students/{student_id}/participant
   */
  registerParticipant: async (
    competitionId: string,
    studentId: string,
    payload: IRegisterParticipantPayload
  ): Promise<IRegisterParticipantResponse> => {
    const response = await apiClient.post<any>(
      `/competitions/${competitionId}/students/${studentId}/participant`,
      payload,
      { baseURL: getCompetitionBaseUrl() }
    );

    const data = response.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as IRegisterParticipantResponse;
    }
    return data as IRegisterParticipantResponse;
  },

  /**
   * 3. Xem Bảng xếp hạng Cuộc thi.
   * GET /competitions/{competition_id}/participants
   */
  getCompetitionParticipants: async (
    competitionId: string
  ): Promise<ICompetitionParticipant[]> => {
    const response = await apiClient.get<any>(
      `/competitions/${competitionId}/participants`,
      { baseURL: getCompetitionBaseUrl() }
    );

    const payload = response.data;
    if (payload && typeof payload === 'object' && Array.isArray(payload.data)) {
      return payload.data as ICompetitionParticipant[];
    }
    if (Array.isArray(payload)) {
      return payload as ICompetitionParticipant[];
    }
    return [];
  },
};
