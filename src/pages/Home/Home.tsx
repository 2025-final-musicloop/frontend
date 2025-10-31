import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Home.module.css';

function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true: 로그인, false: 회원가입
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 로그인되어 있는지 확인
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/login/', {
        username,
        password,
      });

      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        alert('로그인 성공!');
        navigate('/mypage');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/accounts/register/', {
        username,
        email,
        password,
      });

      if (response.data.message) {
        alert('회원가입 성공! 로그인해주세요.');
        setIsLogin(true);
        setPassword('');
        setEmail('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    alert('로그아웃되었습니다.');
  };

  // 이미 로그인된 경우
  if (isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>음악 루프 생성 사이트</div>
        
        <div className={styles.loggedInSection}>
          <h2>환영합니다! 🎵</h2>
          <p>로그인 되었습니다</p>
        </div>

        <div className={styles.navButtons}>
          <button onClick={() => navigate('/mypage')}>마이페이지</button>
          <button onClick={() => navigate('/make')}>제작 페이지</button>
          <button onClick={() => navigate('/board')}>게시판</button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>음악 루프 생성 사이트</div>

      {/* 탭 전환 */}
      <div className={styles.authToggle}>
        <button 
          onClick={() => {
            setIsLogin(true);
            setError('');
          }} 
          className={isLogin ? styles.activeTab : styles.inactiveTab}
        >
          로그인
        </button>
        <button 
          onClick={() => {
            setIsLogin(false);
            setError('');
          }} 
          className={!isLogin ? styles.activeTab : styles.inactiveTab}
        >
          회원가입
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* 로그인 폼 */}
      {isLogin ? (
        <form onSubmit={handleLogin} className={styles.signupForm}>
          <h2>로그인</h2>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
        </form>
      ) : (
        /* 회원가입 폼 */
        <form onSubmit={handleSignup} className={styles.signupForm}>
          <h2>회원가입</h2>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">회원가입</button>
        </form>
      )}

      <div className={styles.navButtons}>
        <button onClick={() => navigate('/make')}>제작 페이지로 가기</button>
        <button onClick={() => navigate('/board')}>게시판으로 가기</button>
      </div>
    </div>
  );
}

export default Home;
