import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

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

export async function getAutocompleteSuggestions(keyword) {
  return requestWithMockFallback({
    apiName: 'getAutocompleteSuggestions',
    request: () => api.get('/api/search/autocomplete', { params: { keyword } }),
    fallback: () => mockApi.getAutocompleteSuggestions(keyword),
  });
}

export async function getPopularKeywords() {
  return requestWithMockFallback({
    apiName: 'getPopularKeywords',
    request: () => api.get('/api/search/popular'),
    fallback: () => mockApi.getPopularKeywords(),
  });
}

export async function getRecentKeywords(userId) {
  return requestWithMockFallback({
    apiName: 'getRecentKeywords',
    request: () =>
      api.get('/api/search/recent', {
        params: { userId },
      }),
    fallback: () => mockApi.getRecentKeywords(),
  });
}
export async function deleteRecentKeyword(keyword) {
  const userId = getAccountIdFromToken();
  return requestWithMockFallback({
    apiName: 'deleteRecentKeyword',
    request: () =>
      api.delete(`/api/search/recent/${encodeURIComponent(keyword)}`, {
        params: { userId },
      }),
    fallback: () => mockApi.deleteRecentKeyword(keyword),
  });
}

export async function deleteAllRecentKeywords() {
  const userId = getAccountIdFromToken();
  return requestWithMockFallback({
    apiName: 'deleteAllRecentKeywords',
    request: () => api.delete('/api/search/recent', { params: { userId } }),
    fallback: () => mockApi.deleteAllRecentKeywords(),
  });
}
