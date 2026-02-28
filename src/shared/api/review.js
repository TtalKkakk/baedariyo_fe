import { api } from './instance';

export async function getMyReviews() {
  const response = await api.get('/api/reviews/me');
  return response.data?.data ?? response.data;
}
