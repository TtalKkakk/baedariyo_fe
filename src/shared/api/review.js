import { api } from './instance';

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
