import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function createOrder(payload) {
  return requestWithMockFallback({
    apiName: 'createOrder',
    request: () => api.post('/api/orders/rider/assign', payload),
    fallback: () => mockApi.createOrder(payload),
  });
}

export async function assignRiderToOrder(payload) {
  return requestWithMockFallback({
    apiName: 'assignRiderToOrder',
    request: () => api.post('/api/orders/users/create', payload),
    fallback: () => mockApi.assignRiderToOrder(payload),
  });
}
