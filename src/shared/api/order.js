import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function createOrder(payload) {
  return requestWithMockFallback({
    apiName: 'createOrder',
    request: () => api.post('/api/orders/users/assign', payload),
    fallback: () => mockApi.createOrder(payload),
  });
}

export async function assignRiderToOrder(payload) {
  return requestWithMockFallback({
    apiName: 'assignRiderToOrder',
    request: () => api.post(`/api/deliveries/${payload.orderId}/assign`),
    fallback: () => mockApi.assignRiderToOrder(payload),
  });
}
