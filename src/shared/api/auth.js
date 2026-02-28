import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function signupUser(payload) {
  return requestWithMockFallback({
    apiName: 'signupUser',
    request: () => api.post('/api/auth/user/signup', payload),
    fallback: () => mockApi.signupUser(payload),
  });
}

export async function signupRider(payload) {
  return requestWithMockFallback({
    apiName: 'signupRider',
    request: () => api.post('/api/auth/rider/signup', payload),
    fallback: () => mockApi.signupRider(payload),
  });
}

export async function loginUser(payload) {
  return requestWithMockFallback({
    apiName: 'loginUser',
    request: () => api.post('/api/auth/user/login', payload),
    fallback: () => mockApi.loginUser(payload),
  });
}

export async function loginRider(payload) {
  return requestWithMockFallback({
    apiName: 'loginRider',
    request: () => api.post('/api/auth/rider/login', payload),
    fallback: () => mockApi.loginRider(payload),
  });
}

export async function withdrawUser() {
  return requestWithMockFallback({
    apiName: 'withdrawUser',
    request: () => api.patch('/api/auth/user/withdraw'),
    fallback: () => mockApi.withdrawUser(),
  });
}

export async function withdrawRider() {
  return requestWithMockFallback({
    apiName: 'withdrawRider',
    request: () => api.patch('/api/auth/rider/withdraw'),
    fallback: () => mockApi.withdrawRider(),
  });
}
