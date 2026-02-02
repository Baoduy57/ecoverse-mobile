import apiClient from './client';
import { IReward, IRedeemHistory, IPaginatedResponse, RedeemStatus } from '../../types';

export const rewardApi = {
  // Get available rewards
  getRewards: async (): Promise<IReward[]> => {
    const response = await apiClient.get<IReward[]>('/rewards');
    return response.data;
  },

  // Get reward detail
  getRewardDetail: async (rewardId: string): Promise<IReward> => {
    const response = await apiClient.get<IReward>(`/rewards/${rewardId}`);
    return response.data;
  },

  // Request reward redemption (student)
  requestRedemption: async (rewardId: string): Promise<IRedeemHistory> => {
    const response = await apiClient.post<IRedeemHistory>('/rewards/redeem', {
      rewardId,
    });
    return response.data;
  },

  // Get redemption history
  getRedemptionHistory: async (
    page: number = 1,
    limit: number = 10
  ): Promise<IPaginatedResponse<IRedeemHistory>> => {
    const response = await apiClient.get<IPaginatedResponse<IRedeemHistory>>('/rewards/history', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get pending redemptions (waiting for parent approval)
  getPendingRedemptions: async (): Promise<IRedeemHistory[]> => {
    const response = await apiClient.get<IRedeemHistory[]>('/rewards/pending');
    return response.data;
  },

  // Cancel redemption request (only if still pending)
  cancelRedemption: async (redemptionId: string): Promise<void> => {
    await apiClient.delete(`/rewards/redeem/${redemptionId}`);
  },
};
