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

function normalizeStore(store) {
  return {
    ...store,
    totalRating: store.totalRating ?? store.rating ?? 0,
    deliveryTimeMin: store.deliveryTimeMin ?? store.deliveryTime ?? 0,
    deliveryFee: store.deliveryFee ?? { amount: 0 },
    minimumOrderAmount: store.minimumOrderAmount ?? {
      amount: store.minOrderPrice ?? 0,
    },
  };
}

export async function getStoreDetail(storePublicId) {
  const result = await requestWithMockFallback({
    apiName: 'getStoreDetail',
    request: () => api.get(`/api/stores/${storePublicId}`),
    fallback: () => mockApi.getStoreDetail(storePublicId),
  });
  return result ? normalizeStore(result) : result;
}

export async function searchStores({
  keyword,
  storeCategory,
  latitude,
  longitude,
  page = 0,
  size = 20,
  sort,
  minRating,
  maxMinOrderAmount,
  freeDelivery,
  instantDiscount,
} = {}) {
  const result = await requestWithMockFallback({
    apiName: 'searchStores',
    request: () =>
      api.get('/api/stores', {
        params: {
          keyword,
          storeCategory,
          latitude,
          longitude,
          page,
          size,
          sort,
          minRating,
          maxMinOrderAmount,
          freeDelivery: freeDelivery || undefined,
          instantDiscount: instantDiscount || undefined,
        },
      }),
    fallback: () =>
      mockApi.searchStores({
        keyword,
        storeCategory,
        page,
        size,
        sort,
        minRating,
        maxMinOrderAmount,
        freeDelivery,
      }),
  });
  return Array.isArray(result) ? result.map(normalizeStore) : result;
}

function getAccountIdFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.accountId ?? payload.userId ?? payload.sub ?? null;
  } catch {
    return null;
  }
}

export async function getSearchHistory(limit = 5) {
  const userId = getAccountIdFromToken();
  return requestWithMockFallback({
    apiName: 'getSearchHistory',
    request: () => api.get('/api/search/recent', { params: { userId } }),
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
