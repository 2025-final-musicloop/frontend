import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';
import { signup } from '../../api/auth'; // ✅ API 연결

const RegisterPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState(''); // <- 실제 username으로 쓸 예정
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ✅ signup 요청 시 username으로 email 전달
      await signup(email, password, nickname);
      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      alert('회원가입 실패 😥');
      console.error('회원가입 에러:', err);
    }
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
