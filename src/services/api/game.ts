import apiClient from './client';
import {
  IWasteBin,
  IGameRound,
  IGameAttempt,
  IGameAttemptUpsertPayload,
  IPlacementRequest,
  IPlacementResponse,
  IWasteItemDetails,
} from '../../types';

// Các API Game/Waste của backend hiện tại chạy ở root, không dùng suffix `/api`.
const getGameBaseUrl = () => {
  const currentBase = apiClient.defaults.baseURL || 'https://ecoverse.com.name.vn/api';
  return currentBase.replace(/\/api\/?$/, '');
};

const unwrapData = <T>(response: { data?: unknown }): T => {
  const payload = response.data;

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const firstLayer = (payload as { data?: unknown }).data;
    if (firstLayer && typeof firstLayer === 'object' && 'data' in firstLayer) {
      return ((firstLayer as { data?: unknown }).data as T) ?? (firstLayer as T);
    }
    return firstLayer as T;
  }

  return payload as T;
};

const unwrapArray = <T>(response: { data?: unknown }): T[] => {
  const payload = unwrapData<unknown>(response);

  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object') {
    const container = payload as {
      data?: unknown;
      items?: unknown;
      content?: unknown;
      rows?: unknown;
    };

    if (Array.isArray(container.data)) return container.data as T[];
    if (Array.isArray(container.items)) return container.items as T[];
    if (Array.isArray(container.content)) return container.content as T[];
    if (Array.isArray(container.rows)) return container.rows as T[];
  }

  return [];
};

export const gameApi = {
  // 1. Tải thông tin 4 thùng rác
  getWasteBins: async (): Promise<IWasteBin[]> => {
    const response = await apiClient.get<any>('/wastes/bins', { baseURL: getGameBaseUrl() });
    return response.data?.data || response.data;
  },

  // 2. Tìm Chọn & Thiết Lập Bản Đồ Chơi (Game Maps)
  getGameRounds: async (
    userId: string,
    pageNo = 1,
    pageSize = 10,
    searching: string | null = null
  ): Promise<IGameRound[]> => {
    const payload: Record<string, string | number | null> = {
      page_no: pageNo,
      page_size: pageSize,
      searching,
    };
    const response = await apiClient.post<unknown>(
      `/games/rounds/users/${userId}/get-list`,
      payload,
      {
        baseURL: getGameBaseUrl(),
      }
    );
    return unwrapArray<IGameRound>(response as { data?: unknown });
  },

  // 2.1. Lấy chi tiết Món Rác cho 1 Màn Chơi (Game Round Items)
  getGameRoundItems: async (userId: string, gameRoundId: string): Promise<IWasteItemDetails[]> => {
    const response = await apiClient.get<any>(
      `/wastes/items/users/${userId}/game-rounds/${gameRoundId}`,
      { baseURL: getGameBaseUrl() }
    );
    return response.data?.data || response.data;
  },

  // 3. Khởi tạo Lượt chơi mới (Create Attempt)
  createAttempt: async (
    gameRoundId: string,
    studentId: string,
    payload: IGameAttemptUpsertPayload
  ): Promise<IGameAttempt> => {
    const response = await apiClient.post<unknown>(
      `/games/rounds/${gameRoundId}/students/${studentId}/attempts`,
      payload,
      { baseURL: getGameBaseUrl() }
    );
    return unwrapData<IGameAttempt>(response as { data?: unknown });
  },

  // 3.1. Cập nhật Attempt khi kết thúc màn
  updateAttempt: async (
    gameAttemptId: string,
    payload: IGameAttemptUpsertPayload
  ): Promise<IGameAttempt> => {
    const response = await apiClient.put<unknown>(`/games/attempts/${gameAttemptId}`, payload, {
      baseURL: getGameBaseUrl(),
    });
    return unwrapData<IGameAttempt>(response as { data?: unknown });
  },

  // 4. Nhặt & Thả Rác (Create Placements)
  createPlacements: async (
    gameRoundId: string,
    gameAttemptId: string,
    placements: IPlacementRequest[]
  ): Promise<IPlacementResponse[]> => {
    const response = await apiClient.post<unknown>(
      `/games/rounds/${gameRoundId}/attempts/${gameAttemptId}/placements`,
      placements,
      { baseURL: getGameBaseUrl() }
    );
    return unwrapArray<IPlacementResponse>(response as { data?: unknown });
  },

  // 5. Xem chi tiết thao tác thả rác trong 1 Lần chơi
  getPlacementDetails: async (gameAttemptId: string): Promise<IPlacementResponse[]> => {
    const response = await apiClient.get<unknown>(`/games/attempts/${gameAttemptId}/placements`, {
      baseURL: getGameBaseUrl(),
    });
    return unwrapArray<IPlacementResponse>(response as { data?: unknown });
  },

  // 7. Lấy lịch sử attempts theo chính student_id (API mới 10.3)
  getStudentAttempts: async (
    studentId: string,
    pageNo = 1,
    pageSize = 10,
    searching: string | null = null
  ): Promise<IGameAttempt[]> => {
    const payloadReq: Record<string, string | number | null> = {
      page_no: pageNo,
      page_size: pageSize,
      searching,
    };
    const response = await apiClient.post<unknown>(
      `/games/students/${studentId}/attempts/get-list`,
      payloadReq,
      { baseURL: getGameBaseUrl() }
    );
    return unwrapArray<IGameAttempt>(response as { data?: unknown });
  },
};
