import { create } from 'zustand';
import { IUser } from '../types';
import { authApi } from '../services/api';
import { storageService } from '../services/storage';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  studentLogin: (student_code: string) => Promise<void>;
  refreshCurrentUser: (silent?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

const extractEnvelopeData = (rawResponse: any) => {
  const root = rawResponse?.data ?? rawResponse ?? {};

  if (root && typeof root === 'object' && 'data' in root) {
    const nestedData = (root as { data?: unknown }).data;
    if (nestedData !== undefined && nestedData !== null) {
      return nestedData;
    }
  }

  return root;
};

const toIsoDateString = (rawDate: unknown, fallbackIso: string) => {
  if (typeof rawDate === 'string' && rawDate.trim().length > 0) {
    return rawDate;
  }

  if (Array.isArray(rawDate) && rawDate.length >= 6) {
    const [year, month, day, hour, minute, second, nano = 0] = rawDate.map(value => Number(value));

    if (
      [year, month, day, hour, minute, second].every(value => Number.isFinite(value)) &&
      month >= 1
    ) {
      const millisecond = Number.isFinite(nano) ? Math.floor(nano / 1_000_000) : 0;
      const parsed = new Date(
        Date.UTC(year, month - 1, day, hour, minute, second, Math.max(0, millisecond))
      );
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
  }

  return fallbackIso;
};

const mapApiUserToStoreUser = (rawResponse: any, fallbackUser: IUser | null): IUser => {
  const responseData = extractEnvelopeData(rawResponse);
  const apiUser = responseData?.user_info || responseData?.user || responseData || {};

  const nowIso = new Date().toISOString();
  const currentPoints = Number(apiUser.points ?? fallbackUser?.points ?? 0);

  return {
    id: String(apiUser.student_id || apiUser.id || fallbackUser?.id || ''),
    email: String(apiUser.email || fallbackUser?.email || ''),
    name: String(apiUser.full_name || apiUser.name || fallbackUser?.name || 'Hoc sinh'),
    avatar: apiUser.avatar_url || apiUser.avatar || fallbackUser?.avatar,
    level: Number(apiUser.level ?? fallbackUser?.level ?? 1),
    points: currentPoints,
    totalPoints: Number(
      apiUser.total_points ?? apiUser.totalPoints ?? fallbackUser?.totalPoints ?? currentPoints
    ),
    streak: Number(apiUser.streak ?? fallbackUser?.streak ?? 0),
    lives: Number(apiUser.lives ?? fallbackUser?.lives ?? 0),
    createdAt: toIsoDateString(
      apiUser.created_at || apiUser.createdAt || apiUser.created_date || apiUser.createdDate,
      fallbackUser?.createdAt || nowIso
    ),
    updatedAt: toIsoDateString(
      apiUser.updated_at || apiUser.updatedAt || apiUser.updated_date || apiUser.updatedDate,
      fallbackUser?.updatedAt || nowIso
    ),
    className: apiUser.class_name || apiUser.className || fallbackUser?.className,
    schoolName: apiUser.school_name || apiUser.schoolName || fallbackUser?.schoolName,
    grade: apiUser.grade ?? fallbackUser?.grade,
    parentName:
      apiUser.parent_name ||
      apiUser.parentName ||
      apiUser.parent_full_name ||
      responseData.parent_name ||
      fallbackUser?.parentName,
    parentEmail: apiUser.parent_email || apiUser.parentEmail || fallbackUser?.parentEmail,
    partnerId: apiUser.partner_id || responseData.partner_id || fallbackUser?.partnerId,
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  studentLogin: async (student_code: string) => {
    try {
      set({ isLoading: true, error: null });
      const rawResponse: any = await authApi.studentLogin({ student_code });

      // Khắc phục nhanh các dạng mapping trả về từ API backend
      const responseData = extractEnvelopeData(rawResponse);
      const extractedToken = responseData?.access_token || responseData?.token;
      const mappedUser = mapApiUserToStoreUser(rawResponse, null);

      if (!extractedToken) {
        console.error('API Response missing token:', rawResponse);
        throw new Error(
          'Đăng nhập thất bại: Máy chủ không trả về token hợp lệ. Xem log để biết chi tiết.'
        );
      }

      await storageService.saveToken(extractedToken);
      await storageService.saveUser(mappedUser); // Contains student ID mapped from API

      set({
        user: mappedUser,
        token: extractedToken,
        isAuthenticated: true,
        isLoading: false,
      });

      // Đồng bộ lại user từ backend để cập nhật các field có thể thay đổi ngoài app.
      await get().refreshCurrentUser(true);
    } catch (error: any) {
      set({
        error: error.message || 'Đăng nhập học sinh thất bại',
        isLoading: false,
      });
      throw error;
    }
  },

  refreshCurrentUser: async (silent: boolean = true) => {
    if (!get().isAuthenticated) {
      return;
    }

    try {
      const currentUser = get().user;
      const latestUser = await authApi.getCurrentUser();
      const mappedUser = mapApiUserToStoreUser(latestUser, currentUser);

      await storageService.saveUser(mappedUser);

      set({
        user: mappedUser,
        error: null,
      });
    } catch (error: any) {
      if (!silent) {
        set({
          error: error?.message || 'Khong the dong bo thong tin nguoi dung',
        });
      }
    }
  },

  logout: async () => {
    // Mock logout - chỉ clear local data
    await storageService.removeToken();
    await storageService.removeUser();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const token = await storageService.getToken();
      const user = await storageService.getUser();

      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Không bắt user phải logout/login lại nếu dữ liệu trên DB đã đổi.
        await get().refreshCurrentUser(true);
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
