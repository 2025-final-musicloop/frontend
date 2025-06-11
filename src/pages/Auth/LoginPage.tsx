import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // 여기에 실제 로그인 로직을 추가할 수 있습니다.
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
