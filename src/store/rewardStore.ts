import { create } from 'zustand';
import { IReward, IRedeemHistory } from '../types';
import { rewardApi, GetRewardsParams } from '../services/api';
import { useAuthStore } from './authStore';

interface RewardState {
  rewards: IReward[];
  redemptionHistory: IRedeemHistory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRewards: (partnerId: string, params?: GetRewardsParams) => Promise<void>;
  fetchRedemptionHistory: (userId: string) => Promise<void>;
  requestRedemption: (studentId: string, rewardId: string) => Promise<void>;
}

export const useRewardStore = create<RewardState>((set, get) => ({
  rewards: [],
  redemptionHistory: [],
  isLoading: false,
  error: null,

  fetchRewards: async (partnerId: string, params?: GetRewardsParams) => {
    try {
      set({ isLoading: true, error: null });
      const rewards = await rewardApi.getRewards(partnerId, params);
      set({ rewards, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Không thể tải danh sách quà',
        isLoading: false,
      });
    }
  },
  fetchRedemptionHistory: async (userId: string) => {
    try {
      set({ isLoading: true });
      const data = await rewardApi.getRedemptionHistory(userId);
      set({ redemptionHistory: data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Không thể tải lịch sử đổi quà',
        isLoading: false,
      });
    }
  },

  requestRedemption: async (studentId: string, rewardId: string) => {
    try {
      set({ isLoading: true, error: null });
      const redemption = await rewardApi.requestRedemption(studentId, rewardId);

      set(state => ({
        isLoading: false,
      }));

      // Trừ điểm của user trên frontend tạm thời
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        useAuthStore.setState({
          user: {
            ...authStore.user,
            points: Math.max(0, authStore.user.points - (redemption.pointsSpent || 0))
          }
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Không thể gửi yêu cầu đổi quà',
        isLoading: false,
      });
      throw error;
    }
  },
}));
