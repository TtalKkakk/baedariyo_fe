import { api } from './instance';

export async function getMyPayments(status) {
  const response = await api.get('/api/payments/my', {
    params: status ? { status } : undefined,
  });

  return response.data?.data ?? response.data;
}
