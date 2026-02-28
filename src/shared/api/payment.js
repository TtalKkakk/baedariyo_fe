import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function createPayment(payload) {
  return requestWithMockFallback({
    apiName: 'createPayment',
    request: () => api.post('/api/payments', payload),
    fallback: () => mockApi.createPayment(payload),
  });
}

export async function approvePayment(paymentId, payload) {
  return requestWithMockFallback({
    apiName: 'approvePayment',
    request: () => api.post(`/api/payments/${paymentId}/approve`, payload),
    fallback: () => mockApi.approvePayment(paymentId, payload),
  });
}

export async function failPayment(paymentId) {
  return requestWithMockFallback({
    apiName: 'failPayment',
    request: () => api.post(`/api/payments/${paymentId}/fail`),
    fallback: () => mockApi.failPayment(paymentId),
  });
}

export async function cancelPayment(paymentId) {
  return requestWithMockFallback({
    apiName: 'cancelPayment',
    request: () => api.post(`/api/payments/${paymentId}/cancel`),
    fallback: () => mockApi.cancelPayment(paymentId),
  });
}

export async function getPaymentDetail(paymentId) {
  return requestWithMockFallback({
    apiName: 'getPaymentDetail',
    request: () => api.get(`/api/payments/${paymentId}`),
    fallback: () => mockApi.getPaymentDetail(paymentId),
  });
}

export async function getMyPayments(status) {
  return requestWithMockFallback({
    apiName: 'getMyPayments',
    request: () =>
      api.get('/api/payments/my', {
        params: status ? { status } : undefined,
      }),
    fallback: () => mockApi.getMyPayments(status),
  });
}
