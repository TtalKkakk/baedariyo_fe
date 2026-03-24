import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function getPaymentMethods() {
  return requestWithMockFallback({
    apiName: 'getPaymentMethods',
    request: () => api.get('/api/user/payment-methods'),
    fallback: () => mockApi.getPaymentMethods(),
  });
}

export async function addPaymentMethod(payload) {
  return requestWithMockFallback({
    apiName: 'addPaymentMethod',
    request: () => api.post('/api/user/payment-methods', payload),
    fallback: () => mockApi.addPaymentMethod(payload),
  });
}

export async function deletePaymentMethod(paymentMethodId) {
  return requestWithMockFallback({
    apiName: 'deletePaymentMethod',
    request: () => api.delete(`/api/user/payment-methods/${paymentMethodId}`),
    fallback: () => mockApi.deletePaymentMethod(paymentMethodId),
  });
}
