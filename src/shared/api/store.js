import { api } from './instance';

export async function getStoreDetail(storePublicId) {
  const response = await api.get(`/api/stores/${storePublicId}`);
  return response.data?.data ?? response.data;
}

export async function getStoreReviews(storePublicId) {
  const response = await api.get(`/api/stores/${storePublicId}/reviews`);
  return response.data?.data ?? response.data;
}

export async function getStoreMenus(storePublicId) {
  const response = await api.get(`/api/stores/${storePublicId}/menus`);
  return response.data?.data ?? response.data;
}
