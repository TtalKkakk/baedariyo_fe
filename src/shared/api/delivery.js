import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function assignRiderToDelivery(orderId) {
  return requestWithMockFallback({
    apiName: 'assignRiderToDelivery',
    request: () => api.post(`/api/deliveries/${orderId}/assign`),
    fallback: () => mockApi.assignRiderToDelivery(orderId),
  });
}

export async function startDelivery(orderId) {
  return requestWithMockFallback({
    apiName: 'startDelivery',
    request: () => api.post(`/api/deliveries/${orderId}/start`),
    fallback: () => mockApi.startDelivery(orderId),
  });
}

export async function completeDelivery(orderId) {
  return requestWithMockFallback({
    apiName: 'completeDelivery',
    request: () => api.post(`/api/deliveries/${orderId}/complete`),
    fallback: () => mockApi.completeDelivery(orderId),
  });
}

export async function getDeliveryLocation(orderId) {
  return requestWithMockFallback({
    apiName: 'getDeliveryLocation',
    request: () => api.get(`/api/deliveries/${orderId}/location`),
    fallback: () => mockApi.getDeliveryLocation(orderId),
  });
}

export async function updateDeliveryLocation(orderId, payload) {
  return requestWithMockFallback({
    apiName: 'updateDeliveryLocation',
    request: () => api.post(`/api/deliveries/${orderId}/location`, payload),
    fallback: () => mockApi.updateDeliveryLocation(orderId, payload),
  });
}

export async function getRiderDeliveryHistory() {
  return requestWithMockFallback({
    apiName: 'getRiderDeliveryHistory',
    request: () => api.get('/api/deliveries/my/history'),
    fallback: () => mockApi.getRiderDeliveryHistory(),
  });
}
