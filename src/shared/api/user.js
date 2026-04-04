import { api } from './instance';
import { requestWithMockFallback } from './fallback';
import { mockApi } from './mockData';

export async function updateUserNickname(payload) {
  return requestWithMockFallback({
    apiName: 'updateUserNickname',
    request: () => api.patch('/api/user/nickname', payload),
    fallback: () => mockApi.updateUserNickname(payload),
  });
}

export async function updateUserPhoneNumber(payload) {
  return requestWithMockFallback({
    apiName: 'updateUserPhoneNumber',
    request: () => api.patch('/api/user/phoneNumber', payload),
    fallback: () => mockApi.updateUserPhoneNumber(payload),
  });
}

export async function getUserAddresses() {
  return requestWithMockFallback({
    apiName: 'getUserAddresses',
    request: () => api.get('/api/user/address'),
    fallback: () => mockApi.getUserAddresses(),
  });
}

export async function addUserAddress(payload) {
  return requestWithMockFallback({
    apiName: 'addUserAddress',
    request: () => api.post('/api/user/address', payload),
    fallback: () => mockApi.addUserAddress(payload),
  });
}

export async function deleteUserAddress(payload) {
  return requestWithMockFallback({
    apiName: 'deleteUserAddress',
    request: () => api.delete('/api/user/address', { data: payload }),
    fallback: () => mockApi.deleteUserAddress(payload),
  });
}

export async function setDefaultAddress(payload) {
  return requestWithMockFallback({
    apiName: 'setDefaultAddress',
    request: () => api.patch('/api/user/address/default', payload),
    fallback: () => mockApi.setDefaultAddress(payload),
  });
}

export async function getUserProfile() {
  return requestWithMockFallback({
    apiName: 'getUserProfile',
    request: () => api.get('/api/user/me'),
    fallback: () => mockApi.getUserProfile(),
  });
}

export async function updateAddressAlias(payload) {
  return requestWithMockFallback({
    apiName: 'updateAddressAlias',
    request: () => api.patch('/api/user/address/alias', payload),
    fallback: () => mockApi.updateAddressAlias(payload),
  });
}
