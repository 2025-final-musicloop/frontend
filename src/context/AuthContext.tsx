// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

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

  // 자동 로그인
 useEffect(() => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    setAccessToken(accessToken); // ✅ 이 줄 추가!

    (axios.get('http://localhost:8000/api/user/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }) as Promise<any>)
      .then((res) => {
        setUser(res.data as User);
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .finally(() => setLoading(false));
  } else {
    setLoading(false);
  }
}, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
