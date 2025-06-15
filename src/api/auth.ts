// src/api/auth.ts
import axios from 'axios';

const API = 'http://localhost:8000/api';

// ✅ 응답 타입 명시
interface SignupResponse {
  message: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
}

// ✅ 회원가입 요청
export const signup = async (email: string, password: string, nickname: string) => {
  const response = await axios.post(`${API}/register/`, {
    username: email,       // Django User 모델용 필드
    password: password,
    nickname: nickname     // 사용자 커스텀 필드
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
