import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function createStoreReview(storePublicId, payload) {
  return requestWithMockFallback({
    apiName: 'createStoreReview',
    request: () => api.post(`/api/stores/${storePublicId}/reviews`, payload),
    fallback: () => mockApi.createStoreReview(storePublicId, payload),
  });
}

export async function getMyReviews() {
  return requestWithMockFallback({
    apiName: 'getMyReviews',
    request: () => api.get('/api/reviews/me'),
    fallback: () => mockApi.getMyReviews(),
  });
}

export async function getReviewDetail(publicStoreReviewId) {
  return requestWithMockFallback({
    apiName: 'getReviewDetail',
    request: () => api.get(`/api/reviews/${publicStoreReviewId}`),
    fallback: () => mockApi.getReviewDetail(publicStoreReviewId),
  });
}

export async function deleteMyReview(publicStoreReviewId) {
  return requestWithMockFallback({
    apiName: 'deleteMyReview',
    request: () => api.delete(`/api/reviews/${publicStoreReviewId}`),
    fallback: () => mockApi.deleteMyReview(publicStoreReviewId),
  });
}
