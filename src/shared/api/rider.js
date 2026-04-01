import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function updateRiderNickname(payload) {
  return requestWithMockFallback({
    apiName: 'updateRiderNickname',
    request: () => api.patch('/api/rider/nickname', payload),
    fallback: () => mockApi.updateRiderNickname(payload),
  });
}

export async function updateRiderPhoneNumber(payload) {
  return requestWithMockFallback({
    apiName: 'updateRiderPhoneNumber',
    request: () => api.patch('/api/rider/phoneNumber', payload),
    fallback: () => mockApi.updateRiderPhoneNumber(payload),
  });
}

export async function updateRiderVehicle(payload) {
  return requestWithMockFallback({
    apiName: 'updateRiderVehicle',
    request: () => api.patch('/api/rider/vehicle', payload),
    fallback: () => mockApi.updateRiderVehicle(payload),
  });
}

export async function setRiderOnline() {
  return requestWithMockFallback({
    apiName: 'setRiderOnline',
    request: () => api.patch('/api/rider/online'),
    fallback: () => mockApi.setRiderOnline(),
  });
}

export async function setRiderOffline() {
  return requestWithMockFallback({
    apiName: 'setRiderOffline',
    request: () => api.patch('/api/rider/offline'),
    fallback: () => mockApi.setRiderOffline(),
  });
}

export async function assignRiderToOrder({ orderId }) {
  return requestWithMockFallback({
    apiName: 'assignRiderToOrder',
    request: () => api.post(`/api/deliveries/${orderId}/assign`),
    fallback: () => mockApi.assignRiderToOrder({ orderId }),
  });
}

export async function startRiderDelivery({ orderId }) {
  return requestWithMockFallback({
    apiName: 'startRiderDelivery',
    request: () => api.post(`/api/deliveries/${orderId}/start`),
    fallback: () => mockApi.startRiderDelivery({ orderId }),
  });
}

export async function completeRiderDelivery({ orderId }) {
  return requestWithMockFallback({
    apiName: 'completeRiderDelivery',
    request: () => api.post(`/api/deliveries/${orderId}/complete`),
    fallback: () => mockApi.completeRiderDelivery({ orderId }),
  });
}
