// src/api/axiosInstance.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 401 오류 감지: 토큰이 만료되었습니다.');
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // 페이지 새로고침하여 AuthContext가 자동으로 로그아웃 처리하도록 함
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default instance;

//이제부터 모든 API 요청에 토큰 자동 포함됩니다.
//401 오류 시 자동으로 토큰을 제거하고 페이지를 새로고침합니다.
