import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 토큰이 필요한 경우 여기서 추가
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // 인증 에러 처리
          // localStorage.removeItem('accessToken');
          // window.location.href = '/login';
          break;
        case 403:
          // 권한 에러 처리
          break;
        case 404:
          // Not Found 처리
          break;
        case 500:
          // 서버 에러 처리
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);
