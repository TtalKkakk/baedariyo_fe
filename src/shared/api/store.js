import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function createStore(payload) {
  return requestWithMockFallback({
    apiName: 'createStore',
    request: () => api.post('/api/stores', payload),
    fallback: () => mockApi.createStore(payload),
  });
}

export async function getStoreDetail(storePublicId) {
  return requestWithMockFallback({
    apiName: 'getStoreDetail',
    request: () => api.get(`/api/stores/${storePublicId}`),
    fallback: () => mockApi.getStoreDetail(storePublicId),
  });
}

export async function getStoreReviews(storePublicId) {
  return requestWithMockFallback({
    apiName: 'getStoreReviews',
    request: () => api.get(`/api/stores/${storePublicId}/reviews`),
    fallback: () => mockApi.getStoreReviews(storePublicId),
  });
}

export async function getStoreMenus(storePublicId) {
  return requestWithMockFallback({
    apiName: 'getStoreMenus',
    request: () => api.get(`/api/stores/${storePublicId}/menus`),
    fallback: () => mockApi.getStoreMenus(storePublicId),
  });
}
