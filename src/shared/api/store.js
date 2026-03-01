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

export async function searchStores({
  keyword,
  categoryId,
  page = 0,
  size = 20,
} = {}) {
  return requestWithMockFallback({
    apiName: 'searchStores',
    request: () =>
      api.get('/api/stores', { params: { keyword, categoryId, page, size } }),
    fallback: () => mockApi.searchStores({ keyword, categoryId, page, size }),
  });
}

export async function getSearchHistory(limit = 5) {
  return requestWithMockFallback({
    apiName: 'getSearchHistory',
    request: () => api.get('/api/search/history', { params: { limit } }),
    fallback: () => mockApi.getSearchHistory(limit),
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
