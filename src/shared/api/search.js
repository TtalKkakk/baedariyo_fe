import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

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

export async function getRecentKeywords() {
  return requestWithMockFallback({
    apiName: 'getRecentKeywords',
    request: () => api.get('/api/search/recent'),
    fallback: () => mockApi.getRecentKeywords(),
  });
}

export async function deleteRecentKeyword(keyword) {
  return requestWithMockFallback({
    apiName: 'deleteRecentKeyword',
    request: () =>
      api.delete(`/api/search/recent/${encodeURIComponent(keyword)}`),
    fallback: () => mockApi.deleteRecentKeyword(keyword),
  });
}

export async function deleteAllRecentKeywords() {
  return requestWithMockFallback({
    apiName: 'deleteAllRecentKeywords',
    request: () => api.delete('/api/search/recent'),
    fallback: () => mockApi.deleteAllRecentKeywords(),
  });
}
