import apiClient from './client';
import { IReward, IRedeemHistory, IPaginatedResponse, RedeemStatus } from '../../types';

export interface GetRewardsParams {
  type?: string;
  page_no?: number;
  page_size?: number;
  searching?: string;
  grade?: string;
  has_children?: boolean;
}

export interface RewardListResponse {
  success: boolean;
  message: string;
  data: IReward[];
}

const mapStatus = (data: any): RedeemStatus => {
  if (data.parent_approval === 'REJECTED') return RedeemStatus.PARENT_REJECTED;
  if (data.parent_approval === 'APPROVED') {
    if (data.partner_approval === 'REJECTED') return RedeemStatus.PARTNER_REJECTED;
    if (data.partner_approval === 'APPROVED') return RedeemStatus.APPROVED;
    return RedeemStatus.PARENT_APPROVED;
  }
  return RedeemStatus.PENDING;
};

export const rewardApi = {
  // Get available rewards
  getRewards: async (partnerId: string, params?: GetRewardsParams): Promise<IReward[]> => {
    const customBaseURL = apiClient.defaults.baseURL?.replace('/api', '') || 'https://ecoverse.com.name.vn';
    const response = await apiClient.post<RewardListResponse>(
      `/rewards/${partnerId}/get-list`,
      {
        page_no: 1,
        page_size: 10,
        has_children: false,
        ...params
      },
      { baseURL: customBaseURL }
    );
    return response.data.data;
  },

  // Request reward redemption (student)
  requestRedemption: async (studentId: string, rewardId: string): Promise<IRedeemHistory> => {
    const customBaseURL = apiClient.defaults.baseURL?.replace('/api', '') || 'https://ecoverse.com.name.vn';
    const response = await apiClient.post<any>(
      `/redemptions/students/${studentId}/reward-items/${rewardId}`,
      {},
      { baseURL: customBaseURL }
    );
    
    const data = response.data.data;
    return {
      id: data.redemption_id,
      userId: studentId,
      rewardId: rewardId,
      reward: {
        id: rewardId,
        name: data.reward_item_name,
        description: '',
        point_required: data.points_required,
        image_url: data.image_reward_item,
        partner_id: data.partner_id,
        available: true,
      },
      pointsSpent: data.points_required,
      status: mapStatus(data),
      redeemedAt: data.redemption_date,
      reason_parent: data.reason_parent,
      reason_partner: data.reason_partner,
    };
  },

  // Get redemption history
  getRedemptionHistory: async (userId: string): Promise<IRedeemHistory[]> => {
    const customBaseURL = apiClient.defaults.baseURL?.replace('/api', '') || 'https://ecoverse.com.name.vn';
    const response = await apiClient.get<any>(`/redemptions/users/${userId}`, {
      baseURL: customBaseURL,
    });
    
    const dataList = response.data.data || [];
    return dataList.map((data: any) => ({
      id: data.redemption_id,
      userId: userId,
      rewardId: '', // rewardId not typically needed since it's flattened
      reward: {
        id: '',
        name: data.reward_item_name,
        description: '',
        point_required: data.points_required,
        image_url: data.image_reward_item,
        partner_id: data.partner_id,
        available: true,
      },
      pointsSpent: data.points_required,
      status: mapStatus(data),
      redeemedAt: data.redemption_date,
      reason_parent: data.reason_parent,
      reason_partner: data.reason_partner,
    }));
  },
};
