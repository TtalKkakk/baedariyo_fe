import { api } from './instance';

export async function createStoreReview(storePublicId, payload) {
  const response = await api.post(
    `/api/stores/${storePublicId}/reviews`,
    payload
  );
  return response.data?.data ?? response.data;
}

export async function getMyReviews() {
  const response = await api.get('/api/reviews/me');
  return response.data?.data ?? response.data;
}

export async function getReviewDetail(publicStoreReviewId) {
  const response = await api.get(`/api/reviews/${publicStoreReviewId}`);
  return response.data?.data ?? response.data;
}

export async function deleteMyReview(publicStoreReviewId) {
  const response = await api.delete(`/api/reviews/${publicStoreReviewId}`);
  return response.data?.data ?? response.data;
}
