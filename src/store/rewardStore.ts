import { create } from 'zustand';
import { IReward, IRedeemHistory } from '../types';
import { rewardApi } from '../services/api';

interface RewardState {
  rewards: IReward[];
  pendingRedemptions: IRedeemHistory[];
  redemptionHistory: IRedeemHistory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRewards: () => Promise<void>;
  fetchPendingRedemptions: () => Promise<void>;
  fetchRedemptionHistory: () => Promise<void>;
  requestRedemption: (rewardId: string) => Promise<void>;
  cancelRedemption: (redemptionId: string) => Promise<void>;
}

export const useRewardStore = create<RewardState>((set, get) => ({
  rewards: [],
  pendingRedemptions: [],
  redemptionHistory: [],
  isLoading: false,
  error: null,

  fetchRewards: async () => {
    try {
      set({ isLoading: true, error: null });
      const rewards = await rewardApi.getRewards();
      set({ rewards, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Không thể tải danh sách quà',
        isLoading: false,
      });
    }
  },

  fetchPendingRedemptions: async () => {
    try {
      const pending = await rewardApi.getPendingRedemptions();
      set({ pendingRedemptions: pending });
    } catch (error: any) {
      console.error('Fetch pending redemptions error:', error);
    }
  },

  fetchRedemptionHistory: async () => {
    try {
      set({ isLoading: true });
      const data = await rewardApi.getRedemptionHistory();
      set({ redemptionHistory: data.items, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Không thể tải lịch sử đổi quà',
        isLoading: false,
      });
    }
  },

  requestRedemption: async (rewardId: string) => {
    try {
      set({ isLoading: true, error: null });
      const redemption = await rewardApi.requestRedemption(rewardId);

      set(state => ({
        pendingRedemptions: [redemption, ...state.pendingRedemptions],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Không thể gửi yêu cầu đổi quà',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelRedemption: async (redemptionId: string) => {
    try {
      await rewardApi.cancelRedemption(redemptionId);

      set(state => ({
        pendingRedemptions: state.pendingRedemptions.filter(r => r.id !== redemptionId),
      }));
    } catch (error: any) {
      set({ error: error.message || 'Không thể hủy yêu cầu' });
      throw error;
    }
  },
}));
