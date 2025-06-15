// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { logout as logoutAPI } from '../api/auth';

interface User {
  username: string;
  id: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  accessToken: string;
  setAccessToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  accessToken: '',
  setAccessToken: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>('');

  // 토큰 만료 감지 함수
  const checkTokenExpiration = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
      return true; // 파싱 실패 시 만료된 것으로 간주
    }
  };

  // 자동 로그아웃 함수
  const handleTokenExpiration = () => {
    console.log('🔒 토큰이 만료되어 자동 로그아웃됩니다.');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken('');
  };

  // 자동 로그인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // 토큰 만료 확인
      if (checkTokenExpiration(accessToken)) {
        console.log('🔒 저장된 토큰이 만료되었습니다.');
        handleTokenExpiration();
        setLoading(false);
        return;
      }

      setAccessToken(accessToken);

      (
        axios.get('http://localhost:8000/api/user/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }) as Promise<any>
      )
        .then((res) => {
          setUser(res.data as User);
        })
        .catch((error) => {
          console.error('사용자 정보 조회 실패:', error);
          if (error.response?.status === 401) {
            handleTokenExpiration();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await logoutAPI();
      console.log('✅ 로그아웃 성공');
    } catch (error) {
      console.error('❌ 로그아웃 API 호출 실패:', error);
      // API 호출이 실패해도 로컬 상태는 정리
    } finally {
      // 로컬 상태 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setAccessToken('');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
