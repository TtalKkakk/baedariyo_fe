import { api } from './instance';

export async function signupUser(payload) {
  const response = await api.post('/api/auth/user/signup', payload);
  return response.data?.data ?? response.data;
}

export async function signupRider(payload) {
  const response = await api.post('/api/auth/rider/signup', payload);
  return response.data?.data ?? response.data;
}

export async function loginUser(payload) {
  const response = await api.post('/api/auth/user/login', payload);
  return response.data?.data ?? response.data;
}

export async function loginRider(payload) {
  const response = await api.post('/api/auth/rider/login', payload);
  return response.data?.data ?? response.data;
}

export async function withdrawUser() {
  const response = await api.patch('/api/auth/user/withdraw');
  return response.data?.data ?? response.data;
}
