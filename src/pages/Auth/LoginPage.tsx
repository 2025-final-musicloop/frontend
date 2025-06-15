import React, { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import { login } from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAccessToken, login: setUser } = useContext(AuthContext);

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      const { access, refresh } = res;

      // ✅ accessToken 저장 (context + localStorage)
      setAccessToken(access);
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // ✅ user 정보 저장 (API 응답이 username, id 등 포함해야 함)
      // 예시로 임시 유저 정보 설정
      setUser({ username: email, id: 1 }); // 👉 여기서 실제 사용자 정보를 넘겨주세요

      alert('로그인 성공!');
      navigate('/');
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('로그인 실패 😥');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <form onSubmit={handleLogin} className={styles.form}>
        <h2>로그인</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="email">이메일</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttonGroup}>
          <Button variant="primary" size="md">
            로그인
          </Button>
          <Button onClick={goToRegister} variant="secondary" size="md">
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
