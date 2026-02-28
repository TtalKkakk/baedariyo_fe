import { api } from './instance';

export async function createPayment(payload) {
  const response = await api.post('/api/payments', payload);
  return response.data?.data ?? response.data;
}

export async function approvePayment(paymentId, payload) {
  const response = await api.post(
    `/api/payments/${paymentId}/approve`,
    payload
  );
  return response.data?.data ?? response.data;
}

export async function failPayment(paymentId) {
  const response = await api.post(`/api/payments/${paymentId}/fail`);
  return response.data?.data ?? response.data;
}

export async function cancelPayment(paymentId) {
  const response = await api.post(`/api/payments/${paymentId}/cancel`);
  return response.data?.data ?? response.data;
}

export async function getPaymentDetail(paymentId) {
  const response = await api.get(`/api/payments/${paymentId}`);
  return response.data?.data ?? response.data;
}

export async function getMyPayments(status) {
  const response = await api.get('/api/payments/my', {
    params: status ? { status } : undefined,
  });

  return response.data?.data ?? response.data;
}
