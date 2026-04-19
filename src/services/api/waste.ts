import { Platform } from 'react-native';
import apiClient from './client';

const getWasteBaseUrl = () => {
  const currentBase = apiClient.defaults.baseURL || 'https://ecoverse.com.name.vn/api';
  return currentBase.replace(/\/api\/?$/, '');
};

export const wasteApi = {
  /**
   * Tạo lịch sử rác thải quét AI.
   * Lưu ý: giữ nguyên path param userId của API, nhưng truyền student_id vào giá trị này.
   */
  createWasteItem: async (
    userId: string,
    data: {
      name: string;
      description: string;
      correctBinCode: string;
      imageUri: string;
    }
  ) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || ' ');
    formData.append('correctBinCode', data.correctBinCode);

    const filename = data.imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;

    formData.append('image', {
      uri: Platform.OS === 'ios' ? data.imageUri.replace('file://', '') : data.imageUri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post(`/wastes/${userId}`, formData, {
      baseURL: getWasteBaseUrl(), // Because it's at root /wastes
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });

    return response.data;
  },
};
