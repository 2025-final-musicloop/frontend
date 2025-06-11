import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';

const RegisterPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt with:', { nickname, email, password });
    // 여기에 실제 회원가입 로직을 추가할 수 있습니다.
    navigate('/login'); // 회원가입 후 로그인 페이지로 이동
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <BackButton />
      <form onSubmit={handleRegister} className={styles.form}>
        <h2>회원가입</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="nickname">닉네임</label>
          <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
        </div>
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
            회원가입
          </Button>
          <Button onClick={goToLogin} variant="secondary" size="md">
            로그인 페이지로
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
