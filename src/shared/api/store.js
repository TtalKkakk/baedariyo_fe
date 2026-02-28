import { api } from './instance';

export async function getStoreDetail(storePublicId) {
  const response = await api.get(`/api/stores/${storePublicId}`);
  return response.data?.data ?? response.data;
}
