// src/api/auth.ts
import axios from 'axios';

const API = 'http://localhost:8000/api/accounts';  // accounts 앱 경로 포함

// ✅ 응답 타입 명시
interface SignupResponse {
  message: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LogoutResponse {
  message: string;
}

// ✅ 회원가입 요청
export const signup = async (email: string, password: string, nickname: string) => {
  const response = await axios.post(`${API}/register/`, {
    username: email,
    password: password,
    nickname: nickname,
  });

  return response.data;
};

// ✅ 로그인 요청
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API}/login/`, {
    username,
    password,
  });

  const { access, refresh } = response.data;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);

  return response.data;
};

// ✅ 로그아웃 요청
export const logout = async (): Promise<LogoutResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    const response = await axios.post<LogoutResponse>(
      `${API}/auth/logout/`,
      { refresh_token: refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return response.data;
  } catch (error) {
    console.error('❌ 로그아웃 요청 실패:', error);
    throw error;
  }
};
