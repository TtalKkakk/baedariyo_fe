import { api } from './instance';

export async function loginUser(payload) {
  const response = await api.post('/api/auth/user/login', payload);
  return response.data?.data ?? response.data;
}
