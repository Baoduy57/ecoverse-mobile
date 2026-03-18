import { create } from 'zustand';

export type ApiIncidentType = 'slow_request' | 'timeout' | 'maintenance' | 'network' | 'server';

export interface ApiIncident {
  type: ApiIncidentType;
  title: string;
  message: string;
  canDismiss: boolean;
  updatedAt: number;
}

interface ApiStatusState {
  incident: ApiIncident | null;
  showIncident: (incident: Omit<ApiIncident, 'updatedAt'>) => void;
  hideIncident: () => void;
  showSlowRequest: () => void;
  showTimeout: () => void;
  showMaintenance: () => void;
  showNetworkError: () => void;
  showServerError: () => void;
}

const INCIDENT_PRIORITY: Record<ApiIncidentType, number> = {
  slow_request: 1,
  network: 2,
  timeout: 3,
  server: 4,
  maintenance: 5,
};

export const useApiStatusStore = create<ApiStatusState>((set, get) => ({
  incident: null,

  showIncident: next => {
    const current = get().incident;

    if (current && INCIDENT_PRIORITY[next.type] < INCIDENT_PRIORITY[current.type]) {
      return;
    }

    set({
      incident: {
        ...next,
        updatedAt: Date.now(),
      },
    });
  },

  hideIncident: () => {
    set({ incident: null });
  },

  showSlowRequest: () => {
    get().showIncident({
      type: 'slow_request',
      title: 'Đang xử lý yêu cầu',
      message: 'Hệ thống đang phản hồi chậm. Vui lòng chờ trong giây lát.',
      canDismiss: true,
    });
  },

  showTimeout: () => {
    get().showIncident({
      type: 'timeout',
      title: 'Kết nối đang quá tải',
      message: 'Yêu cầu mất quá nhiều thời gian. Vui lòng thử lại sau ít phút.',
      canDismiss: true,
    });
  },

  showMaintenance: () => {
    get().showIncident({
      type: 'maintenance',
      title: 'Chức năng đang bảo trì',
      message: 'Máy chủ đang bảo trì tạm thời. Vui lòng quay lại sau.',
      canDismiss: true,
    });
  },

  showNetworkError: () => {
    get().showIncident({
      type: 'network',
      title: 'Không thể kết nối',
      message: 'Thiết bị chưa kết nối mạng hoặc tín hiệu không ổn định.',
      canDismiss: true,
    });
  },

  showServerError: () => {
    get().showIncident({
      type: 'server',
      title: 'Hệ thống đang bận',
      message: 'Máy chủ đang gặp sự cố tạm thời. Vui lòng thử lại sau.',
      canDismiss: true,
    });
  },
}));
