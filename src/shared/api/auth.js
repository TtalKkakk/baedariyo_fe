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

export async function changeUserPassword(payload) {
  return requestWithMockFallback({
    apiName: 'changeUserPassword',
    request: () => api.patch('/api/auth/user/password', payload),
    fallback: () => mockApi.changeUserPassword(payload),
  });
}

export async function changeRiderPassword(payload) {
  return requestWithMockFallback({
    apiName: 'changeRiderPassword',
    request: () => api.patch('/api/auth/rider/password', payload),
    fallback: () => mockApi.changeRiderPassword(payload),
  });
}

export async function checkUserEmailDuplicate(email) {
  return requestWithMockFallback({
    apiName: 'checkUserEmailDuplicate',
    request: () =>
      api.get('/api/auth/user/email/duplicate', { params: { email } }),
    fallback: () => mockApi.checkUserEmailDuplicate(email),
  });
}

export async function checkRiderEmailDuplicate(email) {
  return requestWithMockFallback({
    apiName: 'checkRiderEmailDuplicate',
    request: () =>
      api.get('/api/auth/rider/email/duplicate', { params: { email } }),
    fallback: () => mockApi.checkRiderEmailDuplicate(email),
  });
}
