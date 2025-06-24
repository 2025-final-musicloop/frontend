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

  // JWT 만료 확인 함수
  const checkTokenExpiration = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('토큰 파싱 실패:', error);
      return true;
    }
  };

  // 자동 로그아웃 처리 함수
  const handleTokenExpiration = () => {
    console.log('토큰이 만료되어 자동 로그아웃됩니다.');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setAccessToken('');
  };

  // 자동 로그인
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      if (checkTokenExpiration(accessToken)) {
        handleTokenExpiration();
        setLoading(false);
        return;
      }

      setAccessToken(accessToken);

      axios
        .get('http://localhost:8000/api/user/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          setUser(res.data as User);
        })
        .catch((error) => {
          console.error('사용자 정보 가져오기 실패:', error);
          handleTokenExpiration();
        })
        .then(() => {
          setLoading(false); // 항상 실행됨
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutAPI();
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
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
