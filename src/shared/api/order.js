import { api } from './instance';

export async function createOrder(payload) {
  const response = await api.post('/api/orders/rider/assign', payload);
  return response.data?.data ?? response.data;
}

export async function assignRiderToOrder(payload) {
  const response = await api.post('/api/orders/users/create', payload);
  return response.data?.data ?? response.data;
}
